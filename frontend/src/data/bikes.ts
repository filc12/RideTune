// Curated catalog of best-selling motorcycles with adjustable suspension.
// Grouped by category for the picker UI.

export type BikeCategory =
  | "adventure"
  | "naked"
  | "sport"
  | "sport_touring"
  | "supermoto"
  | "midsport";

export type Bike = {
  id: string;
  brand: string;
  model: string;
  cc: string;
  category: BikeCategory;
};

export const BIKES: Bike[] = [
  // Adventure / Trail
  { id: "bmw-r1300-gs", brand: "BMW", model: "R 1300 GS", cc: "1300cc", category: "adventure" },
  { id: "bmw-1250-gs", brand: "BMW", model: "R 1250 GS", cc: "1254cc", category: "adventure" },
  { id: "ktm-1290-sadv", brand: "KTM", model: "1290 Super Adventure S", cc: "1301cc", category: "adventure" },
  { id: "ktm-890-adv", brand: "KTM", model: "890 Adventure", cc: "889cc", category: "adventure" },
  { id: "yamaha-tenere", brand: "Yamaha", model: "Ténéré 700", cc: "689cc", category: "adventure" },
  { id: "honda-africa", brand: "Honda", model: "Africa Twin", cc: "1084cc", category: "adventure" },
  { id: "ducati-multi-v4", brand: "Ducati", model: "Multistrada V4", cc: "1158cc", category: "adventure" },
  { id: "triumph-tiger-900", brand: "Triumph", model: "Tiger 900", cc: "888cc", category: "adventure" },
  { id: "triumph-tiger-1200", brand: "Triumph", model: "Tiger 1200", cc: "1160cc", category: "adventure" },
  { id: "suzuki-vstrom-1050", brand: "Suzuki", model: "V-Strom 1050", cc: "1037cc", category: "adventure" },

  // Naked / Streetfighter
  { id: "yamaha-mt09", brand: "Yamaha", model: "MT-09", cc: "890cc", category: "naked" },
  { id: "yamaha-mt07", brand: "Yamaha", model: "MT-07", cc: "689cc", category: "naked" },
  { id: "ktm-1290-sdr", brand: "KTM", model: "1290 Super Duke R", cc: "1301cc", category: "naked" },
  { id: "ktm-890-duke-r", brand: "KTM", model: "890 Duke R", cc: "889cc", category: "naked" },
  { id: "triumph-st-rs", brand: "Triumph", model: "Street Triple RS", cc: "765cc", category: "naked" },
  { id: "bmw-s1000r", brand: "BMW", model: "S 1000 R", cc: "999cc", category: "naked" },
  { id: "ducati-sf-v4", brand: "Ducati", model: "Streetfighter V4", cc: "1103cc", category: "naked" },
  { id: "kawasaki-z900", brand: "Kawasaki", model: "Z900", cc: "948cc", category: "naked" },

  // Sport / Superbike
  { id: "yamaha-r1", brand: "Yamaha", model: "YZF-R1", cc: "998cc", category: "sport" },
  { id: "honda-fireblade", brand: "Honda", model: "CBR1000RR-R Fireblade", cc: "999cc", category: "sport" },
  { id: "kawasaki-zx10r", brand: "Kawasaki", model: "Ninja ZX-10R", cc: "998cc", category: "sport" },
  { id: "bmw-s1000rr", brand: "BMW", model: "S 1000 RR", cc: "999cc", category: "sport" },
  { id: "ducati-pani-v4", brand: "Ducati", model: "Panigale V4", cc: "1103cc", category: "sport" },
  { id: "aprilia-rsv4", brand: "Aprilia", model: "RSV4", cc: "1099cc", category: "sport" },

  // Sport-Touring
  { id: "kawasaki-1000sx", brand: "Kawasaki", model: "Ninja 1000SX", cc: "1043cc", category: "sport_touring" },
  { id: "bmw-r1250-rt", brand: "BMW", model: "R 1250 RT", cc: "1254cc", category: "sport_touring" },

  // Supermoto
  { id: "ktm-690-smcr", brand: "KTM", model: "690 SMC R", cc: "693cc", category: "supermoto" },
  { id: "ducati-hyper-950", brand: "Ducati", model: "Hypermotard 950", cc: "937cc", category: "supermoto" },

  // Sport médio
  { id: "aprilia-rs660", brand: "Aprilia", model: "RS 660", cc: "659cc", category: "midsport" },
  { id: "yamaha-r7", brand: "Yamaha", model: "YZF-R7", cc: "689cc", category: "midsport" },
];

export const BIKE_CATEGORIES: BikeCategory[] = [
  "adventure",
  "naked",
  "sport",
  "sport_touring",
  "supermoto",
  "midsport",
];

export const BIKE_BY_ID: Record<string, Bike> = BIKES.reduce(
  (acc, b) => {
    acc[b.id] = b;
    return acc;
  },
  {} as Record<string, Bike>,
);

export function bikeLabel(id: string): string {
  const b = BIKE_BY_ID[id];
  return b ? `${b.brand} ${b.model}` : "—";
}
