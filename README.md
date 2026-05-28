# RideTune — Motorcycle Suspension Setup Assistant

RideTune helps motorcycle riders find a practical starting point for their suspension setup based on real rider weight, luggage and passenger load.

---

## Stack

- **React Native** + **Expo Router** (SDK 54)
- **TypeScript**
- **EAS Build** (local + remote)
- **AsyncStorage** for local persistence

---

## Features

- OEM-based suspension data for KTM, Yamaha, Honda, Suzuki, CFMoto, Kove
- Preload, rebound and compression recommendations — front and rear
- Load modes: Solo, Luggage, Passenger, Passenger + Luggage
- Sag guide (4-step)
- Suspension diagnostics quiz
- Rider profiles (name + weight)
- Confidence badge: OEM / Verified / Calculated / Estimated
- 5 languages: EN, PT, ES, FR, DE

---

## Freemium System

| Feature | Free | Premium |
|---|---|---|
| Bikes | 1 | Unlimited |
| Load modes | Solo only | All modes |
| Saved setups | ❌ | ✅ |
| Rider profiles | 1 | Unlimited |
| Languages | EN only | EN/PT/ES/FR/DE |
| Diagnostics answers | ❌ | ✅ |

Premium status is stored in `ridetune.premium` (AsyncStorage).

### Toggle premium for testing
In `src/services/premium.ts`:
```ts
import { setPremiumStatusForTesting } from "@/src/services/premium";
await setPremiumStatusForTesting(true);  // enable
await setPremiumStatusForTesting(false); // disable
```

---

## Key Files

| File | Purpose |
|---|---|
| `app/_layout.tsx` | Root layout, splash, onboarding gate |
| `app/index.tsx` | Home screen |
| `app/onboarding.tsx` | First launch profile setup |
| `app/carga.tsx` | Load screen (rider/passenger/luggage) |
| `app/diagnostico.tsx` | Diagnostics quiz |
| `app/setups.tsx` | Saved setups |
| `app/profiles.tsx` | Rider profiles |
| `app/settings.tsx` | Language + app info |
| `src/utils/suspension.ts` | Suspension calculations |
| `src/data/mfzSuspensionData.ts` | OEM suspension data |
| `src/services/premium.ts` | Freemium access control |
| `src/components/PremiumModal.tsx` | Premium upsell modal |
| `src/utils/profiles.ts` | Rider profile CRUD |
| `src/i18n/index.tsx` | Translations (EN/PT/ES/FR/DE) |
| `src/components/SplashAnimated.tsx` | Video splash screen |

---

## Build

### Requirements
- Node.js 18+
- Java 17 (Temurin)
- Android SDK (via Android Studio)
- EAS CLI

### Setup
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export ANDROID_HOME=/Users/filipecarvalho/Library/Android/sdk
```

### Preview build (APK)
```bash
cd frontend
eas build --platform android --profile preview --local
```

### Production build (AAB for Google Play)
```bash
cd frontend
eas build --platform android --profile production --local
```

Output: `frontend/build-[timestamp].aab`

---

## Storage Keys

| Key | Value | Purpose |
|---|---|---|
| `ridetune.onboarded` | `"true"` | First launch completed |
| `ridetune.premium` | `"true"/"false"` | Premium status |
| `ridetune.bike` | bike ID string | Selected bike |
| `ridetune.load` | JSON Load object | Rider/passenger/luggage weights |
| `ridetune.profiles` | JSON array | Saved rider profiles |
| `ridetune.profile.active` | profile ID | Active profile |
| `ridetune.lang` | `"en"/"pt"/"es"/"fr"/"de"` | Selected language |

---

## Links

- **Privacy Policy:** https://sites.google.com/view/ridetune-privacy/página-inicial
- **Store listings:** `store-listings.md`
- **EAS Project:** `@filc/ridetune` (ID: 4e271bf2-0656-41dd-96cc-0d55adc09b0e)
- **Bundle ID:** `com.ridetune.app`

---

## EAS Free Plan Reset
Resets on the 1st of each month. Use `--local` flag to build without EAS quota.
