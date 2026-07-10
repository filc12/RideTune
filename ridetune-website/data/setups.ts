/**
 * Setup library data (website).
 *
 * RideTune *reference* starting points — single sag figure plus front/rear
 * clicker values, matching the shape the app produces. NOT user submissions.
 * Real community setups (same shape) are added later from the app.
 */

export type LoadUse = "road" | "touring" | "twoup" | "offroad";

export type Clicks = { preload: number; rebound: number; compression: number };

export type ReferenceSetup = {
  load: LoadUse;
  label: string;
  weightHint: string;
  sag: number; // mm
  front: Clicks;
  rear: Clicks;
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
  oemSag: number; // mm, single reference target
  base: { sag: number; front: Clicks; rear: Clicks };
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

export const USE_LABEL: Record<LoadUse, string> = {
  road: "Road",
  touring: "Touring",
  twoup: "Two-up",
  offroad: "Off-road",
};

const LOAD_META: Record<
  LoadUse,
  {
    label: string;
    weightHint: string;
    note: string;
    d: { sag: number; pre: number; reb: number; com: number };
  }
> = {
  road: {
    label: "Solo · road",
    weightHint: "Rider only",
    note: "Balanced starting point for solo road riding, at the reference sag.",
    d: { sag: 0, pre: 0, reb: 0, com: 0 },
  },
  touring: {
    label: "Loaded touring",
    weightHint: "Rider + luggage",
    note: "More preload to hold ride height with luggage, and a touch more rebound to settle the extra weight.",
    d: { sag: -2, pre: 2, reb: 1, com: 1 },
  },
  twoup: {
    label: "Two-up",
    weightHint: "Rider + passenger",
    note: "Extra preload and rebound so the rear stops wallowing with a passenger on board.",
    d: { sag: -3, pre: 3, reb: 2, com: 2 },
  },
  offroad: {
    label: "Off-road",
    weightHint: "Solo, standing",
    note: "Softer and taller for trails — more sag and less compression so the wheel tracks over rocks and ruts.",
    d: { sag: 3, pre: -1, reb: -1, com: -2 },
  },
};

const clamp = (n: number) => Math.max(0, Math.min(40, n));

function applyClicks(base: Clicks, d: { pre: number; reb: number; com: number }): Clicks {
  return {
    preload: clamp(base.preload + d.pre),
    rebound: clamp(base.rebound + d.reb),
    compression: clamp(base.compression + d.com),
  };
}

type RawModel = Omit<SetupModel, "setups" | "categoryLabel">;

const ADV_LOADS: LoadUse[] = ["road", "touring", "twoup", "offroad"];
const ROAD_LOADS: LoadUse[] = ["road", "twoup"];

// Category base clicks (mirror the app's suspension baselines).
const ADV_FRONT: Clicks = { preload: 4, rebound: 10, compression: 12 };
const ADV_REAR: Clicks = { preload: 4, rebound: 10, compression: 12 };
const SPORT_FRONT: Clicks = { preload: 3, rebound: 8, compression: 10 };
const SPORT_REAR: Clicks = { preload: 3, rebound: 8, compression: 10 };

function adv(slug: string, brand: string, model: string, cc: string, sag: number): RawModel {
  return {
    slug, brand, model, cc, category: "adventure", isAdv: true,
    oemSag: sag, base: { sag, front: { ...ADV_FRONT }, rear: { ...ADV_REAR } }, loads: ADV_LOADS,
  };
}

const RAW_MODELS: RawModel[] = [
  adv("bmw-r1250-gs", "BMW", "R 1250 GS", "1254cc", 38),
  adv("ducati-desertx", "Ducati", "DesertX", "937cc", 40),
  adv("cfmoto-800mt", "CF Moto", "800 MT", "799cc", 38),
  adv("aprilia-tuareg-660", "Aprilia", "Tuareg 660", "659cc", 39),
  adv("bmw-f900-gs", "BMW", "F 900 GS", "895cc", 38),
  adv("ducati-multistrada-v4", "Ducati", "Multistrada V4", "1158cc", 38),
  {
    slug: "bmw-s1000rr", brand: "BMW", model: "S 1000 RR", cc: "999cc",
    category: "sport", isAdv: false, oemSag: 30,
    base: { sag: 30, front: { ...SPORT_FRONT }, rear: { ...SPORT_REAR } }, loads: ROAD_LOADS,
  },
  {
    slug: "aprilia-rs660", brand: "Aprilia", model: "RS 660", cc: "659cc",
    category: "midsport", isAdv: false, oemSag: 33,
    base: { sag: 33, front: { ...SPORT_FRONT }, rear: { ...SPORT_REAR } }, loads: ROAD_LOADS,
  },
];

function buildSetups(m: RawModel): ReferenceSetup[] {
  return m.loads.map((load) => {
    const meta = LOAD_META[load];
    return {
      load,
      label: meta.label,
      weightHint: meta.weightHint,
      sag: m.base.sag + meta.d.sag,
      front: applyClicks(m.base.front, meta.d),
      rear: applyClicks(m.base.rear, meta.d),
      note: meta.note,
    };
  });
}

export const SETUP_MODELS: SetupModel[] = RAW_MODELS.map((m) => ({
  ...m,
  categoryLabel: CATEGORY_LABEL[m.category] ?? m.category,
  setups: buildSetups(m),
}));

export function getModel(slug: string): SetupModel | undefined {
  return SETUP_MODELS.find((m) => m.slug === slug);
}
