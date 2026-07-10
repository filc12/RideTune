"""
Community setups API (Phase 2).

Account-free: the only identity is an anonymous device_id (reuse the app's
PostHog distinct_id). No personal data. Everyone is shown as "Anonymous rider".

Endpoints (mounted under /api):
  POST   /setups              create/update a setup (upsert per device+bike+load)
  GET    /setups?bike_slug=   approved setups for a model (public)
  POST   /setups/{id}/vote    toggle a "helpful" vote (dedup by device)
  GET    /setups/mine         a device's own setups (incl. pending)
  DELETE /setups/{id}         self-removal (device_id must match)
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime, timedelta
import uuid

import oem_reference as oem

router = APIRouter(prefix="/api")

_db = None  # set by init() from server.py


def init(db):
    global _db
    _db = db


async def ensure_indexes():
    if _db is None:
        return
    await _db.votes.create_index([("setup_id", 1), ("device_id", 1)], unique=True)
    await _db.setups.create_index([("bike_slug", 1), ("status", 1)])
    await _db.setups.create_index([("device_id", 1)])


# ---- config ---------------------------------------------------------------

MAX_SETUPS_PER_DAY = 10
PUBLIC_LIMIT = 200

# Minimal profanity guard for the optional free-text note. Expand as needed.
BANNED_WORDS = {"fuck", "shit", "bitch", "cunt", "merda", "caralho", "puta", "foda"}

Load = Literal["road", "touring", "twoup", "offroad"]


# ---- models ---------------------------------------------------------------

class SetupCreate(BaseModel):
    device_id: str = Field(min_length=6, max_length=64)
    bike_slug: str = Field(min_length=2, max_length=64)
    load: Load
    rider_gear_kg: int = Field(ge=30, le=400)
    front_sag_mm: int
    rear_sag_mm: int
    preload: str = Field(max_length=8)
    rebound: int
    compression: int
    note: Optional[str] = Field(default="", max_length=200)
    country: Optional[str] = Field(default=None, max_length=2)


class VoteIn(BaseModel):
    device_id: str = Field(min_length=6, max_length=64)


class SetupOut(BaseModel):
    id: str
    bike_slug: str
    load: Load
    rider_gear_kg: int
    front_sag_mm: int
    rear_sag_mm: int
    preload: str
    rebound: int
    compression: int
    note: str
    country: Optional[str]
    author: str
    oem_match: str
    helpful_count: int
    created_at: datetime


class MySetupOut(SetupOut):
    status: str


def _public(doc) -> SetupOut:
    return SetupOut(
        id=doc["id"],
        bike_slug=doc["bike_slug"],
        load=doc["load"],
        rider_gear_kg=doc["rider_gear_kg"],
        front_sag_mm=doc["front_sag_mm"],
        rear_sag_mm=doc["rear_sag_mm"],
        preload=doc["preload"],
        rebound=doc["rebound"],
        compression=doc["compression"],
        note=doc.get("note", "") or "",
        country=doc.get("country"),
        author="Anonymous rider",
        oem_match=doc["oem_match"],
        helpful_count=doc.get("helpful_count", 0),
        created_at=doc["created_at"],
    )


# ---- endpoints ------------------------------------------------------------

@router.post("/setups", response_model=MySetupOut)
async def create_setup(body: SetupCreate):
    if not oem.is_sane(body.front_sag_mm, body.rear_sag_mm, body.rebound, body.compression):
        raise HTTPException(status_code=422, detail="Setup values are out of a plausible range.")

    note = (body.note or "").strip()
    if note:
        low = note.lower()
        if any(w in low for w in BANNED_WORDS):
            raise HTTPException(status_code=400, detail="Note contains disallowed language.")

    # rate limit per device (last 24h)
    since = datetime.utcnow() - timedelta(hours=24)
    recent = await _db.setups.count_documents(
        {"device_id": body.device_id, "created_at": {"$gte": since}}
    )
    if recent >= MAX_SETUPS_PER_DAY:
        raise HTTPException(status_code=429, detail="Daily submission limit reached. Try again tomorrow.")

    oem_match = oem.verify(body.bike_slug, body.front_sag_mm, body.rear_sag_mm)

    # moderation: hold the first noted submission from a new device
    if not note:
        status = "approved"
    else:
        has_prior = await _db.setups.count_documents(
            {"device_id": body.device_id, "status": "approved"}
        )
        status = "approved" if has_prior else "pending"

    now = datetime.utcnow()

    # one setup per (device, bike, load): update in place if it exists
    existing = await _db.setups.find_one(
        {"device_id": body.device_id, "bike_slug": body.bike_slug, "load": body.load}
    )

    fields = {
        "bike_slug": body.bike_slug,
        "load": body.load,
        "rider_gear_kg": body.rider_gear_kg,
        "front_sag_mm": body.front_sag_mm,
        "rear_sag_mm": body.rear_sag_mm,
        "preload": body.preload,
        "rebound": body.rebound,
        "compression": body.compression,
        "note": note,
        "country": body.country,
        "oem_match": oem_match,
        "status": status,
    }

    if existing:
        await _db.setups.update_one({"id": existing["id"]}, {"$set": fields})
        doc = await _db.setups.find_one({"id": existing["id"]})
    else:
        doc = {
            "id": str(uuid.uuid4()),
            "device_id": body.device_id,
            "helpful_count": 0,
            "created_at": now,
            **fields,
        }
        await _db.setups.insert_one(doc)

    out = _public(doc)
    return MySetupOut(**out.dict(), status=doc["status"])


@router.get("/setups", response_model=List[SetupOut])
async def list_setups(bike_slug: str = Query(..., min_length=2)):
    cursor = (
        _db.setups.find({"bike_slug": bike_slug, "status": "approved"})
        .sort([("helpful_count", -1), ("created_at", -1)])
        .limit(PUBLIC_LIMIT)
    )
    docs = await cursor.to_list(PUBLIC_LIMIT)
    return [_public(d) for d in docs]


@router.post("/setups/{setup_id}/vote")
async def vote_setup(setup_id: str, body: VoteIn):
    doc = await _db.setups.find_one({"id": setup_id, "status": "approved"})
    if not doc:
        raise HTTPException(status_code=404, detail="Setup not found.")
    try:
        await _db.votes.insert_one(
            {"setup_id": setup_id, "device_id": body.device_id, "created_at": datetime.utcnow()}
        )
    except Exception:
        # duplicate vote (unique index) — no-op
        return {"helpful_count": doc.get("helpful_count", 0), "voted": False}
    await _db.setups.update_one({"id": setup_id}, {"$inc": {"helpful_count": 1}})
    return {"helpful_count": doc.get("helpful_count", 0) + 1, "voted": True}


@router.get("/setups/mine", response_model=List[MySetupOut])
async def my_setups(device_id: str = Query(..., min_length=6)):
    cursor = _db.setups.find({"device_id": device_id}).sort([("created_at", -1)]).limit(PUBLIC_LIMIT)
    docs = await cursor.to_list(PUBLIC_LIMIT)
    return [MySetupOut(**_public(d).dict(), status=d["status"]) for d in docs]


@router.delete("/setups/{setup_id}")
async def delete_setup(setup_id: str, device_id: str = Query(..., min_length=6)):
    doc = await _db.setups.find_one({"id": setup_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Setup not found.")
    if doc["device_id"] != device_id:
        raise HTTPException(status_code=403, detail="You can only delete your own setups.")
    await _db.setups.delete_one({"id": setup_id})
    await _db.votes.delete_many({"setup_id": setup_id})
    return {"deleted": True}
