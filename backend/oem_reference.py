"""
OEM suspension reference for community setup verification.

Sag targets (mm) per bike slug, mirroring the website's data/setups.ts.
Used to flag submitted setups as "verified" (within a sane tolerance of the
factory targets) or "outside_oem". Kept small on purpose; expand as the
catalogue grows, or move to the DB later.
"""

from typing import Optional, Dict

# bike_slug -> {"front": mm, "rear": mm}
OEM_SAG: Dict[str, Dict[str, int]] = {
    "bmw-r1250-gs": {"front": 40, "rear": 38},
    "ducati-desertx": {"front": 42, "rear": 40},
    "cfmoto-800mt": {"front": 40, "rear": 38},
    "aprilia-tuareg-660": {"front": 41, "rear": 39},
    "bmw-f900-gs": {"front": 40, "rear": 38},
    "ducati-multistrada-v4": {"front": 40, "rear": 38},
    "bmw-s1000rr": {"front": 32, "rear": 30},
    "aprilia-rs660": {"front": 35, "rear": 33},
}

# How far a submitted sag may drift from the OEM target and still be "verified".
# Wide, because legitimate rider weight / load changes move sag by several mm.
SAG_TOLERANCE_MM = 12

# Absolute sanity bounds — outside these the submission is rejected outright.
SAG_MIN_MM, SAG_MAX_MM = 10, 80
CLICKS_MIN, CLICKS_MAX = 0, 40


def is_sane(front_sag: int, rear_sag: int, rebound: int, compression: int) -> bool:
    """Reject physically implausible values before storing."""
    return (
        SAG_MIN_MM <= front_sag <= SAG_MAX_MM
        and SAG_MIN_MM <= rear_sag <= SAG_MAX_MM
        and CLICKS_MIN <= rebound <= CLICKS_MAX
        and CLICKS_MIN <= compression <= CLICKS_MAX
    )


def verify(bike_slug: str, front_sag: int, rear_sag: int) -> str:
    """
    Return "verified" if within tolerance of the OEM sag target,
    "outside_oem" if a known model but out of range,
    "unverified" if we have no OEM reference for this model yet.
    """
    ref: Optional[Dict[str, int]] = OEM_SAG.get(bike_slug)
    if ref is None:
        return "unverified"
    within_front = abs(front_sag - ref["front"]) <= SAG_TOLERANCE_MM
    within_rear = abs(rear_sag - ref["rear"]) <= SAG_TOLERANCE_MM
    return "verified" if (within_front and within_rear) else "outside_oem"
