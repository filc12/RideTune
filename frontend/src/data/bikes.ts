// Curated catalog of best-selling motorcycles with adjustable suspension.
// Grouped by brand in the picker UI.

export type BikeCategory =
  | "adventure"
  | "naked"
  | "sport"
  | "sport_touring"
  | "supermoto"
  | "midsport"
  | "scrambler";

export type Bike = {
  id: string;
  brand: string;
  model: string;
  cc: string;
  category: BikeCategory;
};

// Brands appear in this order in the picker (high-volume / premium first, Chinese brands at the end).
export const BIKE_BRANDS: string[] = [
  "BMW",
  "Ducati",
  "Honda",
  "Yamaha",
  "KTM",
  "Suzuki",
  "Kawasaki",
  "Triumph",
  "Aprilia",
  "Voge",
  "CF Moto",
  "QJ Motor",
  "Kove",
];

export const BIKES: Bike[] = [
  // ===== BMW =====
  { id: "bmw-r1300-gs-adv", brand: "BMW", model: "R 1300 GS Adventure", cc: "1300cc", category: "adventure" },
  { id: "bmw-r1300-gs", brand: "BMW", model: "R 1300 GS", cc: "1300cc", category: "adventure" },
  { id: "bmw-1250-gs", brand: "BMW", model: "R 1250 GS", cc: "1254cc", category: "adventure" },
  { id: "bmw-r1250-rt", brand: "BMW", model: "R 1250 RT", cc: "1254cc", category: "sport_touring" },
  { id: "bmw-f900-gs", brand: "BMW", model: "F 900 GS", cc: "895cc", category: "adventure" },
  { id: "bmw-f900-xr", brand: "BMW", model: "F 900 XR", cc: "895cc", category: "sport_touring" },
  { id: "bmw-s1000rr", brand: "BMW", model: "S 1000 RR", cc: "999cc", category: "sport" },
  { id: "bmw-s1000r", brand: "BMW", model: "S 1000 R", cc: "999cc", category: "naked" },
  { id: "bmw-m1000rr", brand: "BMW", model: "M 1000 RR", cc: "999cc", category: "sport" },

  // ===== Ducati =====
  { id: "ducati-multi-v4-rally", brand: "Ducati", model: "Multistrada V4 Rally", cc: "1158cc", category: "adventure" },
  { id: "ducati-multi-v4", brand: "Ducati", model: "Multistrada V4", cc: "1158cc", category: "adventure" },
  { id: "ducati-multi-v2", brand: "Ducati", model: "Multistrada V2", cc: "937cc", category: "adventure" },
  { id: "ducati-desertx", brand: "Ducati", model: "DesertX", cc: "937cc", category: "adventure" },
  { id: "ducati-desertx-rally", brand: "Ducati", model: "DesertX Rally", cc: "937cc", category: "adventure" },
  { id: "ducati-sf-v4", brand: "Ducati", model: "Streetfighter V4", cc: "1103cc", category: "naked" },
  { id: "ducati-pani-v4", brand: "Ducati", model: "Panigale V4", cc: "1103cc", category: "sport" },
  { id: "ducati-monster", brand: "Ducati", model: "Monster", cc: "937cc", category: "naked" },
  { id: "ducati-hyper-950", brand: "Ducati", model: "Hypermotard 950", cc: "937cc", category: "supermoto" },
  { id: "ducati-hyper-698", brand: "Ducati", model: "Hypermotard 698 Mono", cc: "659cc", category: "supermoto" },

  // ===== Honda =====
  { id: "honda-africa-as", brand: "Honda", model: "Africa Twin Adventure Sports", cc: "1084cc", category: "adventure" },
  { id: "honda-africa", brand: "Honda", model: "Africa Twin", cc: "1084cc", category: "adventure" },
  { id: "honda-transalp", brand: "Honda", model: "XL750 Transalp", cc: "755cc", category: "adventure" },
  { id: "honda-nc750x", brand: "Honda", model: "NC750X", cc: "745cc", category: "adventure" },
  { id: "honda-xadv", brand: "Honda", model: "X-ADV", cc: "745cc", category: "adventure" },
  { id: "honda-fireblade", brand: "Honda", model: "CBR1000RR-R Fireblade", cc: "999cc", category: "sport" },
  { id: "honda-cb1000r", brand: "Honda", model: "CB1000R", cc: "998cc", category: "naked" },
  { id: "honda-cb650r", brand: "Honda", model: "CB650R", cc: "649cc", category: "naked" },

  // ===== Yamaha =====
  { id: "yamaha-tenere-w", brand: "Yamaha", model: "Ténéré 700 World Raid", cc: "689cc", category: "adventure" },
  { id: "yamaha-tenere", brand: "Yamaha", model: "Ténéré 700", cc: "689cc", category: "adventure" },
  { id: "yamaha-tracer9", brand: "Yamaha", model: "Tracer 9 GT+", cc: "890cc", category: "sport_touring" },
  { id: "yamaha-mt10", brand: "Yamaha", model: "MT-10", cc: "998cc", category: "naked" },
  { id: "yamaha-mt09", brand: "Yamaha", model: "MT-09", cc: "890cc", category: "naked" },
  { id: "yamaha-mt07", brand: "Yamaha", model: "MT-07", cc: "689cc", category: "naked" },
  { id: "yamaha-xsr900", brand: "Yamaha", model: "XSR900", cc: "890cc", category: "naked" },
  { id: "yamaha-r1", brand: "Yamaha", model: "YZF-R1", cc: "998cc", category: "sport" },
  { id: "yamaha-r7", brand: "Yamaha", model: "YZF-R7", cc: "689cc", category: "midsport" },

  // ===== KTM =====
  { id: "ktm-1290-sadv", brand: "KTM", model: "1290 Super Adventure S", cc: "1301cc", category: "adventure" },
  { id: "ktm-1290-sadv-r", brand: "KTM", model: "1290 Super Adventure R", cc: "1301cc", category: "adventure" },
  { id: "ktm-890-adv-r", brand: "KTM", model: "890 Adventure R", cc: "889cc", category: "adventure" },
  { id: "ktm-890-adv", brand: "KTM", model: "890 Adventure", cc: "889cc", category: "adventure" },
  { id: "ktm-390-adv", brand: "KTM", model: "390 Adventure", cc: "399cc", category: "adventure" },
  { id: "ktm-1290-sdr", brand: "KTM", model: "1290 Super Duke R", cc: "1301cc", category: "naked" },
  { id: "ktm-890-duke-r", brand: "KTM", model: "890 Duke R", cc: "889cc", category: "naked" },
  { id: "ktm-790-duke", brand: "KTM", model: "790 Duke", cc: "799cc", category: "naked" },
  { id: "ktm-690-smcr", brand: "KTM", model: "690 SMC R", cc: "693cc", category: "supermoto" },

  // ===== Suzuki =====
  { id: "suzuki-vstrom-1050de", brand: "Suzuki", model: "V-Strom 1050 DE", cc: "1037cc", category: "adventure" },
  { id: "suzuki-vstrom-800de", brand: "Suzuki", model: "V-Strom 800 DE", cc: "776cc", category: "adventure" },
  { id: "suzuki-vstrom-650", brand: "Suzuki", model: "V-Strom 650 XT", cc: "645cc", category: "adventure" },
  { id: "suzuki-gsxs1000", brand: "Suzuki", model: "GSX-S1000", cc: "999cc", category: "naked" },
  { id: "suzuki-gsxr1000", brand: "Suzuki", model: "GSX-R1000R", cc: "999cc", category: "sport" },

  // ===== Kawasaki =====
  { id: "kawasaki-versys-1000", brand: "Kawasaki", model: "Versys 1000 SE", cc: "1043cc", category: "adventure" },
  { id: "kawasaki-versys-650", brand: "Kawasaki", model: "Versys 650", cc: "649cc", category: "adventure" },
  { id: "kawasaki-1000sx", brand: "Kawasaki", model: "Ninja 1000SX", cc: "1043cc", category: "sport_touring" },
  { id: "kawasaki-zx10r", brand: "Kawasaki", model: "Ninja ZX-10R", cc: "998cc", category: "sport" },
  { id: "kawasaki-z900", brand: "Kawasaki", model: "Z900", cc: "948cc", category: "naked" },
  { id: "kawasaki-zh2", brand: "Kawasaki", model: "Z H2", cc: "998cc", category: "naked" },

  // ===== Triumph =====
  { id: "triumph-tiger-1200", brand: "Triumph", model: "Tiger 1200 Rally Pro", cc: "1160cc", category: "adventure" },
  { id: "triumph-tiger-900-rally", brand: "Triumph", model: "Tiger 900 Rally Pro", cc: "888cc", category: "adventure" },
  { id: "triumph-tiger-900-gt", brand: "Triumph", model: "Tiger 900 GT", cc: "888cc", category: "adventure" },
  { id: "triumph-tiger-sport-660", brand: "Triumph", model: "Tiger Sport 660", cc: "660cc", category: "sport_touring" },
  { id: "triumph-st-rs", brand: "Triumph", model: "Street Triple RS", cc: "765cc", category: "naked" },
  { id: "triumph-speed-1200", brand: "Triumph", model: "Speed Triple 1200 RS", cc: "1160cc", category: "naked" },
  { id: "triumph-scrambler-1200", brand: "Triumph", model: "Scrambler 1200 XE", cc: "1200cc", category: "scrambler" },

  // ===== Aprilia =====
  { id: "aprilia-tuareg", brand: "Aprilia", model: "Tuareg 660", cc: "659cc", category: "adventure" },
  { id: "aprilia-rsv4", brand: "Aprilia", model: "RSV4", cc: "1099cc", category: "sport" },
  { id: "aprilia-tuono-v4", brand: "Aprilia", model: "Tuono V4", cc: "1077cc", category: "naked" },
  { id: "aprilia-rs660", brand: "Aprilia", model: "RS 660", cc: "659cc", category: "midsport" },
  { id: "aprilia-tuono-660", brand: "Aprilia", model: "Tuono 660", cc: "659cc", category: "naked" },

  // ===== Voge =====
  { id: "voge-900dsx", brand: "Voge", model: "900 DSX", cc: "895cc", category: "adventure" },
  { id: "voge-650dsx", brand: "Voge", model: "650 DSX", cc: "652cc", category: "adventure" },
  { id: "voge-525dsx", brand: "Voge", model: "525 DSX", cc: "494cc", category: "adventure" },
  { id: "voge-525r", brand: "Voge", model: "525 R", cc: "494cc", category: "naked" },

  // ===== CF Moto =====
  { id: "cfmoto-800mt-sport", brand: "CF Moto", model: "800 MT Sport", cc: "799cc", category: "adventure" },
  { id: "cfmoto-800mt-explore", brand: "CF Moto", model: "800 MT Explore", cc: "799cc", category: "adventure" },
  { id: "cfmoto-700mt", brand: "CF Moto", model: "700 MT", cc: "693cc", category: "adventure" },
  { id: "cfmoto-450mt", brand: "CF Moto", model: "450 MT", cc: "449cc", category: "adventure" },
  { id: "cfmoto-800nk", brand: "CF Moto", model: "800 NK", cc: "799cc", category: "naked" },
  { id: "cfmoto-1000srr", brand: "CF Moto", model: "1000 SR-R", cc: "998cc", category: "sport" },

  // ===== QJ Motor =====
  { id: "qj-srt800x", brand: "QJ Motor", model: "SRT 800 X", cc: "778cc", category: "adventure" },
  { id: "qj-srt750sx", brand: "QJ Motor", model: "SRT 750 SX", cc: "744cc", category: "sport_touring" },
  { id: "qj-srk921", brand: "QJ Motor", model: "SRK 921", cc: "904cc", category: "naked" },
  { id: "qj-srk600", brand: "QJ Motor", model: "SRK 600", cc: "598cc", category: "naked" },

  // ===== Kove =====
  { id: "kove-800x-pro", brand: "Kove", model: "800X Pro", cc: "799cc", category: "adventure" },
  { id: "kove-800x", brand: "Kove", model: "800X", cc: "799cc", category: "adventure" },
  { id: "kove-800-rally", brand: "Kove", model: "800 Rally", cc: "799cc", category: "adventure" },
  { id: "kove-450-rally", brand: "Kove", model: "450 Rally", cc: "443cc", category: "adventure" },
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

// Convenience: bikes grouped by brand in the canonical BIKE_BRANDS order.
export function bikesByBrand(): { brand: string; items: Bike[] }[] {
  return BIKE_BRANDS.map((brand) => ({
    brand,
    items: BIKES.filter((b) => b.brand === brand),
  })).filter((g) => g.items.length > 0);
}
