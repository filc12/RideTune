# RideTune Roadmap

## Phase 1 — MVP

Goal: make the core setup flow useful, responsible and visually convincing.

Build:

- mobile app shell;
- onboarding;
- Home;
- My Bike selection;
- initial motorcycle catalog;
- rider and load input;
- quick scenarios for solo, luggage, two-up and two-up luggage;
- riding mode selection;
- rule-based recommendation result;
- save setups locally;
- basic Sag Guide;
- basic Fix My Ride;
- safety disclaimers;
- English and European Portuguese.

MVP data rules:

- support confirmed, estimated and needs-review data states;
- do not show exact click/turn recommendations unless OEM baseline data is confirmed;
- show directional guidance when data is incomplete;
- exclude Benelli from the first catalog.

Next MVP improvements from current code:

1. Rename/reshape Motorcycle Selector into My Bike.
2. Add brand > model > year > version selection.
3. Expand Load Setup with gear, side cases, top case and extra bag.
4. Add quick scenario buttons.
5. Add data status warnings to Result.
6. Improve Result copy with objective, front/rear sections and safety notes.
7. Add sag calculator inputs and results.
8. Expand Fix My Ride symptoms.

## Phase 2 — Product Depth

Goal: make the app feel complete for real travel use.

Add:

- full Fix My Ride symptom library;
- setup edit, duplicate, compare and delete;
- setup export;
- photos of adjusters;
- richer motorcycle catalog;
- more languages;
- Supabase Auth;
- cloud-synced user bikes and saved setups;
- admin source tracking;
- backoffice MVP for catalog management.

## Phase 3 — Community and Business

Goal: build defensibility and recurring value.

Add:

- user-submitted motorcycle data;
- admin validation workflow;
- community setups;
- user ratings;
- partner workshops;
- tool recommendations;
- affiliate opportunities;
- Pro subscriptions;
- premium brand/model packs.

## Phase 4 — Advanced Assistant

Goal: turn the app into a smarter suspension companion.

Add:

- AI assistant/chat;
- advanced symptom reasoning;
- manual ingestion and extraction;
- trip-based recommendations;
- richer electronic suspension support;
- possible telemetry integrations.

## Current Technical Baseline

Current stack:

- React Native with Expo;
- Supabase-ready backend;
- PostgreSQL schema;
- local saved setup storage;
- rule-based recommendation engine;
- English and Portuguese UI strings.

Suggested future stack additions:

- Supabase Auth;
- Supabase Storage;
- web admin app;
- RevenueCat or Stripe;
- PostHog or Firebase Analytics.

