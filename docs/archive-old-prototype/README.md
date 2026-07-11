# RideTune

RideTune is a first MVP React Native app for motorcycle suspension setup. It uses a dark dashboard UI, rule-based starting recommendations, local persistence, and a Supabase schema ready for catalog and user setup data.

## Run

```bash
npm install
npm start
```

The Expo scripts use `HOME=/Users/filipecarvalho` so local Expo state stays in the normal home folder instead of inside the project.

Add Supabase credentials to `.env` using `.env.example` when the backend project is ready.

## Included

- Onboarding, dashboard, motorcycle selector, load input, riding mode, recommendation, sag guide, symptom helper, saved setups, and settings screens.
- English and European Portuguese UI strings.
- Safety disclaimers in the main flow and guidance screens.
- Rule-based recommendation engine in `src/logic/recommendation.js`.
- Sag calculator for front and rear measurements in `src/logic/sag.js`.
- Detailed load input for rider, gear, passenger, side cases, top case, and extra bag.
- OEM data status handling: unconfirmed records show directional guidance instead of invented exact clicks/turns.
- Supabase migration and seed files in `supabase/`.
- Expanded initial catalog for adventure, trail, touring, and sport-touring motorcycles. Benelli is intentionally excluded from the MVP.

## Backend Notes

The schema separates public catalog tables from user-owned data:

- `brands`, `motorcycles`, `motorcycle_versions`
- `suspension_specs`, `suspension_adjusters`, `oem_settings`
- `profiles`, `user_bikes`, `load_profiles`, `sag_measurements`, `saved_setups`

Catalog tables are public-read. User tables use row-level security scoped to the authenticated user.

## Safety

All recommendations are starting points. Riders should verify OEM data, measure sag, inspect mechanical condition, and test changes at low speed in a safe area.
