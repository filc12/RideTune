/**
 * Setup library data (website).
 *
 * These are RideTune *reference* starting points, derived from OEM sag targets
 * and typical load adjustments — NOT fabricated user submissions. Real community
 * setups are added later (from the app) and rendered alongside these.
 *
 * Slugs mirror the app's bike catalogue so URLs stay stable.
 */

export type LoadUse = "road" | "touring" | "twoup" | "offroad";

export type ReferenceSetup = {
  load: LoadUse;
  label: string;
  weightHint: string;
  frontSag: number; // mm
  rearSag: number; // mm
  preload: string; // clicks, relative to factory
  rebound: number; // clicks
  compression: number; // clicks
  note: string;
};

export type SetupModel = {
  slug: string;
  brand: string;
  model: string;
  cc: string;
  category: string;
  categoryLabel: string;
  isAdv: boolean;
  oem: { frontSag: number; rearSag: number };
  base: { rebound: number; compression: number };
  loads: LoadUse[];
  setups: ReferenceSetup[];
};

export const CATEGORY_LABEL: Record<string, string> = {
  adventure: "Adventure",
  sport: "Sport",
  midsport: "Middleweight sport",
  naked: "Naked",
  sport_touring: "Sport touring",
};

const LOAD_META: Record<
  LoadUse,
  {
    label: string;
    weightHint: string;
    note: string;
    d: { sagF: number; sagR: number; pre: number; reb: number; com: number };
  }
> = {
  road: {
    label: "Solo · road",
    weightHint: "Rider only",
    note: "Balanced starting point for solo road riding, at the factory sag targets.",
    d: { sagF: 0, sagR: 0, pre: 0, reb: 0, com: 0 },
  },
  touring: {
    label: "Loaded touring",
    weightHint: "Rider + luggage",
    note: "More rear preload to hold ride height with panniers and a top-box, and a touch more rebound to settle the extra weight.",
    d: { sagF: -1, sagR: -2, pre: 3, reb: 1, com: 1 },
  },
  twoup: {
    label: "Two-up",
    weightHint: "Rider + passenger",
    note: "Extra preload and rebound so the rear stops wallowing with a passenger on board.",
    d: { sagF: -2, sagR: -3, pre: 5, reb: 2, com: 2 },
  },
  offroad: {
    label: "Off-road",
    weightHint: "Solo, standing",
    note: "Softer and taller for trails — more sag and less compression so the wheel tracks over rocks and ruts.",
    d: { sagF: 3, sagR: 3, pre: -1, reb: -1, com: -2 },
  },
};

function clampClicks(n: number): number {
  return Math.max(0, Math.min(24, n));
}

function fmtPreload(n: number): string {
  if (n === 0) return "0 clicks";
  return `${n > 0 ? "+" : ""}${n} clicks`;
}

function buildSetups(m: Omit<SetupModel, "setups" | "categoryLabel">): ReferenceSetup[] {
  return m.loads.map((load) => {
    const meta = LOAD_META[load];
    return {
      load,
      label: meta.label,
      weightHint: meta.weightHint,
      frontSag: m.oem.frontSag + meta.d.sagF,
      rearSag: m.oem.rearSag + meta.d.sagR,
      preload: fmtPreload(meta.d.pre),
      rebound: clampClicks(m.base.rebound + meta.d.reb),
      compression: clampClicks(m.base.compression + meta.d.com),
      note: meta.note,
    };
  });
}

type RawModel = Omit<SetupModel, "setups" | "categoryLabel">;

const ADV_LOADS: LoadUse[] = ["road", "touring", "twoup", "offroad"];
const ROAD_LOADS: LoadUse[] = ["road", "twoup"];

const RAW_MODELS: RawModel[] = [
  {
    slug: "bmw-r1250-gs",
    brand: "BMW",
    model: "R 1250 GS",
    cc: "1254cc",
    category: "adventure",
    isAdv: true,
    oem: { frontSag: 40, rearSag: 38 },
    base: { rebound: 10, compression: 8 },
    loads: ADV_LOADS,
  },
  {
    slug: "ducati-desertx",
    brand: "Ducati",
    model: "DesertX",
    cc: "937cc",
    category: "adventure",
    isAdv: true,
    oem: { frontSag: 42, rearSag: 40 },
    base: { rebound: 10, compression: 8 },
    loads: ADV_LOADS,
  },
  {
    slug: "cfmoto-800mt",
    brand: "CF Moto",
    model: "800 MT",
    cc: "799cc",
    category: "adventure",
    isAdv: true,
    oem: { frontSag: 40, rearSag: 38 },
    base: { rebound: 9, compression: 8 },
    loads: ADV_LOADS,
  },
  {
    slug: "aprilia-tuareg-660",
    brand: "Aprilia",
    model: "Tuareg 660",
    cc: "659cc",
    category: "adventure",
    isAdv: true,
    oem: { frontSag: 41, rearSag: 39 },
    base: { rebound: 9, compression: 8 },
    loads: ADV_LOADS,
  },
  {
    slug: "bmw-f900-gs",
    brand: "BMW",
    model: "F 900 GS",
    cc: "895cc",
    category: "adventure",
    isAdv: true,
    oem: { frontSag: 40, rearSag: 38 },
    base: { rebound: 9, compression: 8 },
    loads: ADV_LOADS,
  },
  {
    slug: "ducati-multistrada-v4",
    brand: "Ducati",
    model: "Multistrada V4",
    cc: "1158cc",
    category: "adventure",
    isAdv: true,
    oem: { frontSag: 40, rearSag: 38 },
    base: { rebound: 10, compression: 9 },
    loads: ADV_LOADS,
  },
  {
    slug: "bmw-s1000rr",
    brand: "BMW",
    model: "S 1000 RR",
    cc: "999cc",
    category: "sport",
    isAdv: false,
    oem: { frontSag: 32, rearSag: 30 },
    base: { rebound: 8, compression: 10 },
    loads: ROAD_LOADS,
  },
  {
    slug: "aprilia-rs660",
    brand: "Aprilia",
    model: "RS 660",
    cc: "659cc",
    category: "midsport",
    isAdv: false,
    oem: { frontSag: 35, rearSag: 33 },
    base: { rebound: 8, compression: 9 },
    loads: ROAD_LOADS,
  },
];

export const SETUP_MODELS: SetupModel[] = RAW_MODELS.map((m) => ({
  ...m,
  categoryLabel: CATEGORY_LABEL[m.category] ?? m.category,
  setups: buildSetups(m),
}));

export function getModel(slug: string): SetupModel | undefined {
  return SETUP_MODELS.find((m) => m.slug === slug);
}

export const USE_LABEL: Record<LoadUse, string> = {
  road: "Road",
  touring: "Touring",
  twoup: "Two-up",
  offroad: "Off-road",
};
