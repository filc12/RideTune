// Heuristic suspension setup calculator for RideTune.
// Visual/educational only — must be validated by the rider.
import { storage } from "@/src/utils/storage";

export type Setup = {
  front: { preload: number; rebound: number; compression: number };
  rear: { preload: number; rebound: number; compression: number };
  sag: number; // mm
};

export type Load = { rider: number; passenger: number; luggage: number };

export const DEFAULT_LOAD: Load = { rider: 75, passenger: 0, luggage: 0 };
const K_LOAD = "ridetune.load";

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// Base setup for a 75kg solo rider, mid-range adventure bike.
const BASE: Setup = {
  front: { preload: 4, rebound: 10, compression: 12 },
  rear: { preload: 4, rebound: 10, compression: 12 },
  sag: 30,
};

export function calcSetup(load: Load): Setup {
  const total = load.rider + load.passenger + load.luggage;
  const delta = total - 75; // kg above baseline

  // Rear carries more of the additional weight, especially passenger and luggage.
  const rearBias = load.passenger * 0.6 + load.luggage * 0.4;

  return {
    front: {
      preload: clamp(BASE.front.preload + Math.round(delta / 12), 0, 14),
      rebound: clamp(BASE.front.rebound - Math.round(delta / 15), 2, 18),
      compression: clamp(BASE.front.compression - Math.round(delta / 15), 2, 18),
    },
    rear: {
      preload: clamp(
        BASE.rear.preload + Math.round(delta / 6) + Math.round(rearBias / 8),
        0,
        18,
      ),
      rebound: clamp(BASE.rear.rebound - Math.round(delta / 10), 2, 18),
      compression: clamp(BASE.rear.compression - Math.round(delta / 10), 2, 18),
    },
    sag: clamp(BASE.sag + Math.round(delta / 8), 25, 45),
  };
}

export async function getLoad(): Promise<Load> {
  const raw = await storage.getItem<string>(K_LOAD, "");
  if (!raw) return DEFAULT_LOAD;
  try {
    const p = JSON.parse(raw);
    return {
      rider: Number(p.rider) || DEFAULT_LOAD.rider,
      passenger: Number(p.passenger) || 0,
      luggage: Number(p.luggage) || 0,
    };
  } catch {
    return DEFAULT_LOAD;
  }
}

export async function saveLoad(load: Load) {
  await storage.setItem(K_LOAD, JSON.stringify(load));
}

// Derive a load mode from load values for the home card chip.
export function deriveMode(load: Load): "solo" | "malas" | "duo" | "duo_malas" {
  const hasPassenger = load.passenger > 0;
  const hasLuggage = load.luggage > 0;
  if (hasPassenger && hasLuggage) return "duo_malas";
  if (hasPassenger) return "duo";
  if (hasLuggage) return "malas";
  return "solo";
}
