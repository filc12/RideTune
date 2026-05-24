// Heuristic suspension setup calculator for RideTune.
// Visual/educational only — must be validated by the rider.
import { storage } from "@/src/utils/storage";
import type { BikeCategory } from "@/src/data/bikes";
import { BIKE_BY_ID } from "@/src/data/bikes";
import { getRealSuspension, type AdjResult } from "@/src/utils/suspensionReal";

export type Setup = {
  front: { preload: number; rebound: number; compression: number };
  rear: { preload: number; rebound: number; compression: number };
  sag: number; // mm
};

/** Extended result — includes real factory data when available. */
export type SetupResult = Setup & {
  isRealData: boolean;
  noData?: boolean;
  mfzProfileId?: string;
  countNote?: string;
  frontVType?: string;
  rearVType?: string;
  /** Full human-readable adjuster instructions from the factory profile. */
  adjDetails?: {
    front: { preload: string; comp: string; reb: string };
    rear:  { preload: string; comp: string; reb: string; hsComp?: string; lsComp?: string };
  };
};

export type Load = { rider: number; passenger: number; luggage: number };

export const DEFAULT_LOAD: Load = { rider: 75, passenger: 0, luggage: 0 };
const K_LOAD = "ridetune.load";

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

type Range = [number, number];

type CategoryProfile = {
  base: Setup;
  clamps: {
    front: { preload: Range; rebound: Range; compression: Range };
    rear:  { preload: Range; rebound: Range; compression: Range };
    sag: Range;
  };
  // Divisors for the per-kg delta. Higher = stiffer spring → less change per kg.
  scaling: {
    preloadFront: number;
    preloadRear:  number;
    rebound:      number;
    compression:  number;
    sag:          number;
  };
};

// Per-category profiles derived from real manufacturer data.
// Click ranges: WP XPLOR/APEX, Öhlins TTX, KYB, Showa SFF/BFF manuals.
// Base values: mid-range for a 75 kg solo rider.
const PROFILES: Record<BikeCategory, CategoryProfile> = {

  // Long-travel (150-210 mm). Designed to carry loads.
  // WP XPLOR 48, Öhlins TTX36 — typically 20-25 clicks rebound/compression.
  adventure: {
    base: {
      front: { preload: 4, rebound: 14, compression: 14 },
      rear:  { preload: 5, rebound: 14, compression: 14 },
      sag: 35,
    },
    clamps: {
      front: { preload: [0, 18], rebound: [2, 25], compression: [2, 22] },
      rear:  { preload: [0, 22], rebound: [2, 25], compression: [2, 22] },
      sag: [30, 50],
    },
    // Softer springs → more preload change needed per kg of load.
    scaling: { preloadFront: 10, preloadRear: 5, rebound: 12, compression: 12, sag: 7 },
  },

  // Medium-travel (120-145 mm). Balanced road use.
  // KYB AOS-II, Showa SFF-BP — typically 20 clicks.
  naked: {
    base: {
      front: { preload: 4, rebound: 10, compression: 12 },
      rear:  { preload: 4, rebound: 10, compression: 12 },
      sag: 30,
    },
    clamps: {
      front: { preload: [0, 15], rebound: [2, 20], compression: [2, 20] },
      rear:  { preload: [0, 20], rebound: [2, 20], compression: [2, 20] },
      sag: [25, 38],
    },
    scaling: { preloadFront: 12, preloadRear: 6, rebound: 15, compression: 15, sag: 8 },
  },

  // Short-travel (100-120 mm). Stiff springs, track-biased.
  // Öhlins NIX30/NIX EC, Showa BFF — typically 20 clicks.
  sport: {
    base: {
      front: { preload: 3, rebound: 8, compression: 10 },
      rear:  { preload: 3, rebound: 8, compression: 10 },
      sag: 25,
    },
    clamps: {
      front: { preload: [0, 10], rebound: [2, 18], compression: [2, 18] },
      rear:  { preload: [0, 12], rebound: [2, 18], compression: [2, 18] },
      sag: [20, 30],
    },
    // Stiff springs → each kg moves the needle much less.
    scaling: { preloadFront: 18, preloadRear: 10, rebound: 20, compression: 20, sag: 12 },
  },

  // Long-travel (130-160 mm). Comfort/load biased, similar range to adventure.
  // Typically Showa BFRC-lite or Kayaba.
  sport_touring: {
    base: {
      front: { preload: 4, rebound: 12, compression: 13 },
      rear:  { preload: 5, rebound: 12, compression: 14 },
      sag: 32,
    },
    clamps: {
      front: { preload: [0, 16], rebound: [2, 22], compression: [2, 20] },
      rear:  { preload: [0, 22], rebound: [2, 22], compression: [2, 22] },
      sag: [28, 42],
    },
    scaling: { preloadFront: 10, preloadRear: 5, rebound: 13, compression: 13, sag: 7 },
  },

  // Long-travel (150-185 mm). Motard geometry: stiff front, plush rear.
  // WP XPLOR / KYB.
  supermoto: {
    base: {
      front: { preload: 3, rebound: 12, compression: 11 },
      rear:  { preload: 4, rebound: 14, compression: 12 },
      sag: 32,
    },
    clamps: {
      front: { preload: [0, 14], rebound: [2, 22], compression: [2, 18] },
      rear:  { preload: [0, 18], rebound: [2, 22], compression: [2, 18] },
      sag: [28, 42],
    },
    scaling: { preloadFront: 13, preloadRear: 7, rebound: 14, compression: 14, sag: 8 },
  },

  // Medium-travel (110-130 mm). Between naked and sport.
  // Showa SFF-BP / Kayaba.
  midsport: {
    base: {
      front: { preload: 3, rebound: 9, compression: 11 },
      rear:  { preload: 3, rebound: 9, compression: 11 },
      sag: 27,
    },
    clamps: {
      front: { preload: [0, 12], rebound: [2, 18], compression: [2, 18] },
      rear:  { preload: [0, 15], rebound: [2, 18], compression: [2, 18] },
      sag: [22, 32],
    },
    scaling: { preloadFront: 15, preloadRear: 8, rebound: 18, compression: 18, sag: 10 },
  },

  // Medium-travel (130-150 mm). Upright, road-biased, similar to naked/adventure.
  scrambler: {
    base: {
      front: { preload: 4, rebound: 11, compression: 12 },
      rear:  { preload: 4, rebound: 11, compression: 12 },
      sag: 32,
    },
    clamps: {
      front: { preload: [0, 14], rebound: [2, 20], compression: [2, 18] },
      rear:  { preload: [0, 18], rebound: [2, 20], compression: [2, 20] },
      sag: [28, 40],
    },
    scaling: { preloadFront: 12, preloadRear: 6, rebound: 14, compression: 14, sag: 8 },
  },
};

// Fallback when no bike is selected — mirrors original naked defaults.
const DEFAULT_PROFILE = PROFILES.naked;

export function calcSetup(load: Load, category?: BikeCategory): Setup {
  const p = category ? (PROFILES[category] ?? DEFAULT_PROFILE) : DEFAULT_PROFILE;
  const { base, clamps, scaling } = p;

  const total = load.rider + load.passenger + load.luggage;
  const delta = total - 75; // kg above baseline
  const rearBias = load.passenger * 0.6 + load.luggage * 0.4;

  return {
    front: {
      preload:     clamp(base.front.preload     + Math.round(delta / scaling.preloadFront), ...clamps.front.preload),
      rebound:     clamp(base.front.rebound     - Math.round(delta / scaling.rebound),      ...clamps.front.rebound),
      compression: clamp(base.front.compression - Math.round(delta / scaling.compression),  ...clamps.front.compression),
    },
    rear: {
      preload:     clamp(base.rear.preload + Math.round(delta / scaling.preloadRear) + Math.round(rearBias / 8), ...clamps.rear.preload),
      rebound:     clamp(base.rear.rebound     - Math.round(delta / scaling.rebound),      ...clamps.rear.rebound),
      compression: clamp(base.rear.compression - Math.round(delta / scaling.compression),  ...clamps.rear.compression),
    },
    sag: clamp(base.sag + Math.round(delta / scaling.sag), ...clamps.sag),
  };
}

/**
 * Primary setup function. Uses real factory data (mfzstudio.com) when the bike
 * has a linked profile; otherwise falls back to the category-based heuristic.
 *
 * @param bikeId  - id from BIKES (e.g. "yamaha-tenere"). Pass null for no bike.
 * @param load    - rider + passenger + luggage weights.
 */
export function calcSetupById(bikeId: string | null, load: Load): SetupResult {
  if (bikeId) {
    const bike = BIKE_BY_ID[bikeId];
    if (bike?.mfzProfileId) {
      const real = getRealSuspension(bike.mfzProfileId, load.rider, load.passenger, load.luggage);
      if (real) {
        const num = (adj: AdjResult): number =>
          adj.isAdjustable && typeof adj.value === "number" ? adj.value : 0;

        // Sag comes from the category heuristic (not in factory manuals)
        const sagSetup = calcSetup(load, bike.category);

        return {
          front: {
            preload:     num(real.front.preload),
            rebound:     num(real.front.rebound),
            compression: num(real.front.compression),
          },
          rear: {
            preload:     num(real.rear.preload),
            rebound:     num(real.rear.rebound),
            compression: num(real.rear.compression),
          },
          sag: sagSetup.sag,
          isRealData:    true,
          mfzProfileId:  bike.mfzProfileId,
          countNote:     real.countNote,
          frontVType:    real.front.rebound.type,
          rearVType:     real.rear.rebound.type,
          adjDetails: {
            front: {
              preload: real.front.preload.display,
              comp:    real.front.compression.display,
              reb:     real.front.rebound.display,
            },
            rear: {
              preload:  real.rear.preload.display,
              comp:     real.rear.compression.display,
              reb:      real.rear.rebound.display,
              hsComp:   real.rear.highSpeedCompression?.display,
              lsComp:   real.rear.lowSpeedCompression?.display,
            },
          },
        };
      }
    }
  }

  // Fallback: category-based heuristic
  const category = bikeId ? BIKE_BY_ID[bikeId]?.category : undefined;
  // noData: always true in fallback — real data was unavailable
  return { ...calcSetup(load, category), isRealData: false, noData: true };
}

export async function getLoad(): Promise<Load> {
  const raw = await storage.getItem<string>(K_LOAD, "");
  if (!raw) return DEFAULT_LOAD;
  try {
    const p = JSON.parse(raw);
    return {
      rider:     Number(p.rider)     || DEFAULT_LOAD.rider,
      passenger: Number(p.passenger) || 0,
      luggage:   Number(p.luggage)   || 0,
    };
  } catch {
    return DEFAULT_LOAD;
  }
}

export async function saveLoad(load: Load) {
  await storage.setItem(K_LOAD, JSON.stringify(load));
}

export function deriveMode(load: Load): "solo" | "malas" | "duo" | "duo_malas" {
  const hasPassenger = load.passenger > 0;
  const hasLuggage   = load.luggage   > 0;
  if (hasPassenger && hasLuggage) return "duo_malas";
  if (hasPassenger) return "duo";
  if (hasLuggage)   return "malas";
  return "solo";
}
