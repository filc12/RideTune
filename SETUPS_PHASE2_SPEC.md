# RideTune — Setups Library, Phase 2 (real submissions)

Mini-spec for moving the Setups Library from static RideTune reference setups
(Phase 1, already live) to **real, rider-submitted setups** — while keeping the
app **account-free** and **privacy-first**.

Status: planning. Nothing here is built yet.

---

## 1. Guiding decisions (already made)

- **No accounts, no logins, no personal data.** Identity is a random,
  anonymous device id only.
- **Everyone shows as "Anonymous rider".** No nickname field at all.
- **Country is optional**, chosen from a fixed list (never free text).
- **Browse + submit = free** (grows the data moat and SEO).
- **Personalisation = Premium** (filter/apply to my exact weight → RevenueCat entitlement).
- Public content is **user-generated and shared with explicit consent** per submission.

---

## 2. Identity (the key decision)

- On first launch the app has (or generates) a random `device_id` (UUID v4),
  stored locally. **Reuse the existing PostHog anonymous `distinct_id`** rather
  than inventing a second id.
- `device_id` is **not** personal data — it's a random string with no name/email.
- It is used only to: attribute a submission to a device, let the user delete
  their own contributions, and prevent duplicate votes.

Accepted trade-off: a reinstall yields a new `device_id`, so limits can be
bypassed by a determined user. This is fine at this scale — rate limits +
moderation + reporting are "good enough". Do **not** add accounts to fix this.

---

## 3. Data model

Table `setups`:

| field            | type      | notes |
|------------------|-----------|-------|
| id               | uuid (pk) | |
| bike_slug        | string    | matches app + website bike catalogue |
| load             | enum      | road / touring / twoup / offroad |
| rider_gear_kg    | int       | rider + gear weight |
| front_sag_mm     | int       | |
| rear_sag_mm      | int       | |
| preload          | string    | e.g. "+3" (relative clicks) |
| rebound          | int       | clicks |
| compression      | int       | clicks |
| note             | string    | short, optional, max ~200 chars |
| country          | string?   | optional, from fixed list (ISO code) |
| device_id        | string    | anonymous author |
| status           | enum      | pending / approved / rejected |
| oem_match        | enum      | verified / outside_oem (computed) |
| helpful_count    | int       | denormalised vote tally |
| created_at       | timestamp | |

Table `votes` (prevents double voting):

| setup_id | device_id | created_at |  (composite unique on setup_id + device_id) |

---

## 4. API (extends existing backend/server.py)

- `POST /setups` — create. Body = the fields above (minus status/oem_match/id).
  Server computes `oem_match` against the OEM range, sets `status` per the
  moderation rule (§6), rate-limits by `device_id` + IP.
- `GET /setups?bike_slug=...` — approved setups for a model (for website + app).
- `POST /setups/{id}/vote` — toggle helpful (dedup by `device_id`).
- `GET /setups/mine?device_id=...` — the user's own submissions (for the
  "My shared setups" screen).
- `DELETE /setups/{id}` — only if `device_id` matches (self-removal).

All endpoints anonymous; no auth header, just the `device_id` in the body/query.

---

## 5. Submission UX (in the app)

1. User is on a saved setup (bike, load, clicks already known).
2. Taps **"Share this setup"**.
3. Consent sheet:
   > "Share this setup publicly? Your bike, load and clicks will appear on
   > ridetune.app and in the app as *Anonymous rider*. No personal data is
   > shared. You can remove it anytime." → **[Share] / [Cancel]**
   - Optional: pick a country (list). Optional: short note.
4. On Share → `POST /setups`. Show a confirmation + link to "My shared setups".

"My shared setups" screen lists their submissions with a delete button each.

---

## 6. Verification & moderation

- **Auto-verify:** compare submitted sag/clicks to the OEM range → `verified`
  or `outside_oem` badge (reuse existing OEM data + logic).
- **Numbers** are self-validating (range checks server-side; reject impossible values).
- **Note (free text)** is the only risk:
  - Length cap (~200 chars), basic profanity filter.
  - First note from a new `device_id` held as `pending` for a quick manual pass;
    later notes auto-approve.
  - A **"Report"** button on every card flips it back to `pending`.
- **Anti-abuse:** max N submissions/day per `device_id` and per IP; one setup
  per (device_id, bike_slug, load) — re-submitting updates the existing one.

---

## 7. Website integration (keep SEO)

- Model pages fetch **approved** setups from `GET /setups?bike_slug=...` at
  **build/revalidate time** (Next.js ISR, e.g. `revalidate = 3600`), so pages
  stay static, fast and indexable. New submissions appear at the next revalidate.
- Render community setups alongside the RideTune reference cards; empty state
  stays until the first approved submission for that model.
- Sorting: Top rated / Newest = free; **"Closest to my weight" = Premium** (the gate).

---

## 8. Gating (Premium)

- Free: browse, submit, vote.
- Premium (RevenueCat entitlement check in-app): filter/sort by exact rider+gear
  weight, and "apply this setup to my bike".

---

## 9. Legal / privacy (do before launch)

- Update the **privacy policy**: the app now transmits user-submitted setup
  content (still no personal data; note the anonymous `device_id`).
- Add **submission terms**: by sharing, the user grants RideTune a licence to
  display the setup publicly; content must be their own; no offensive content.
- **Deletion:** honoured via "My shared setups" and by `device_id` (RGPD-friendly).
- Add a lightweight **content/moderation policy** and a report path.

---

## 10. Suggested build order

1. Backend: `setups` table + `POST` / `GET` + OEM auto-verify + rate limits.
2. App: "Share this setup" + consent sheet + "My shared setups" (with delete).
3. Website: fetch approved setups into model pages via ISR; wire the Premium gate.
4. Votes + report + moderation hold.
5. Legal copy (privacy, submission terms, moderation policy).

Ship 1–3 as the MVP; 4–5 can follow quickly but must land before heavy promotion.
