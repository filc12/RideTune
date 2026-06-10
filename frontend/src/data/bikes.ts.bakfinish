// Curated catalog of motorcycles with adjustable suspension.
// adj: "full"    = preload+rebound+compression both ends
//      "partial" = at least rear preload+rebound; front may be limited
//      "fixed"   = no click-adjustable dampers (front locked + rear preload only)
// Sources: manufacturer specs, Bennetts, Cycle World, MCNews, Teknik Motorsport.

export type BikeCategory =
  | "adventure"
  | "naked"
  | "sport"
  | "sport_touring"
  | "supermoto"
  | "midsport"
  | "scrambler";

export type SuspAdj = "full" | "partial" | "fixed";

export type Bike = {
  id: string;
  brand: string;
  model: string;
  cc: string;
  category: BikeCategory;
  adj: SuspAdj;
  /** Links to a real factory data profile from mfzstudio.com/moto/ */
  mfzProfileId?: string;
};

// Alphabetical order
export const BIKE_BRANDS: string[] = [
  "Aprilia", "BMW", "CF Moto", "Ducati", "Honda",
  "Kawasaki", "Kove", "KTM", "QJ Motor",
  "Suzuki", "Triumph", "Voge", "Yamaha",
];

export const BIKE_CATEGORIES: BikeCategory[] = [
  "adventure", "naked", "sport", "sport_touring",
  "supermoto", "midsport", "scrambler",
];

export const BIKES: Bike[] = [
  // ===== Aprilia =====
  { id: "aprilia-tuareg",    brand: "Aprilia", model: "Tuareg 660",    cc: "659cc",  category: "adventure", adj: "full" },
  { id: "aprilia-rsv4",      brand: "Aprilia", model: "RSV4",          cc: "1099cc", category: "sport",     adj: "full" },
  { id: "aprilia-tuono-v4",  brand: "Aprilia", model: "Tuono V4",      cc: "1077cc", category: "naked",     adj: "full" },
  { id: "aprilia-rs660",     brand: "Aprilia", model: "RS 660",        cc: "659cc",  category: "midsport",  adj: "full" },
  { id: "aprilia-tuono-660", brand: "Aprilia", model: "Tuono 660",     cc: "659cc",  category: "naked",     adj: "full" },

  // ===== BMW =====
  { id: "bmw-r1300-gs-adv",  brand: "BMW", model: "R 1300 GS Adventure",  cc: "1300cc", category: "adventure",     adj: "full", mfzProfileId: "bmw_r1300gsa_dsa" }, // Dynamic ESA electronic
  { id: "bmw-r1300-gs",      brand: "BMW", model: "R 1300 GS",             cc: "1300cc", category: "adventure",     adj: "full" },
  { id: "bmw-1250-gs",       brand: "BMW", model: "R 1250 GS",             cc: "1254cc", category: "adventure",     adj: "full" },
  { id: "bmw-r1250-rt",      brand: "BMW", model: "R 1250 RT",             cc: "1254cc", category: "sport_touring", adj: "full" },
  { id: "bmw-f900-gs",       brand: "BMW", model: "F 900 GS",              cc: "895cc",  category: "adventure",     adj: "full" },
  { id: "bmw-f900-xr",       brand: "BMW", model: "F 900 XR",              cc: "895cc",  category: "sport_touring", adj: "full" },
  { id: "bmw-s1000rr",       brand: "BMW", model: "S 1000 RR",             cc: "999cc",  category: "sport",         adj: "full" },
  { id: "bmw-s1000r",        brand: "BMW", model: "S 1000 R",              cc: "999cc",  category: "naked",         adj: "full" },
  { id: "bmw-m1000rr",       brand: "BMW", model: "M 1000 RR",             cc: "999cc",  category: "sport",         adj: "full" },

  // ===== CF Moto =====
  // 800MT Sport/Explore: KYB fully adjustable front (preload+compression+rebound), rear (preload+rebound)
  { id: "cfmoto-800mt-sport",   brand: "CF Moto", model: "800 MT Sport",   cc: "799cc", category: "adventure", adj: "full",    mfzProfileId: "cfmoto_800mt"  },
  { id: "cfmoto-800mt-explore", brand: "CF Moto", model: "800 MT Explore", cc: "799cc", category: "adventure", adj: "full",    mfzProfileId: "cfmoto_800mt"  },
  // 700MT: front rebound only (fixed compression & preload), rear preload+rebound
  { id: "cfmoto-700mt",         brand: "CF Moto", model: "700 MT",         cc: "693cc", category: "adventure", adj: "partial", mfzProfileId: "cfmoto_700mt"  },
  // 450MT: KYB fully adjustable confirmed (preload+compression+rebound both ends)
  { id: "cfmoto-450mt",         brand: "CF Moto", model: "450 MT",         cc: "449cc", category: "adventure", adj: "full",    mfzProfileId: "cfmoto_450mt"  },
  { id: "cfmoto-800nk",         brand: "CF Moto", model: "800 NK",         cc: "799cc", category: "naked",     adj: "partial", mfzProfileId: "cfmoto_800nk"  },
  { id: "cfmoto-1000srr",       brand: "CF Moto", model: "1000 SR-R",      cc: "998cc", category: "sport",     adj: "partial" },
  { id: "cfmoto-800mtx", brand: "CF Moto", model: "800 MT-X", cc: "799cc", category: "adventure", adj: "full", mfzProfileId: "cfmoto_800mtx" },
  { id: "cfmoto-1000mtx", brand: "CF Moto", model: "1000 MT-X", cc: "947cc", category: "adventure", adj: "full", mfzProfileId: "cfmoto_1000mtx" },

  // ===== Ducati =====
  { id: "ducati-multi-v4-rally",  brand: "Ducati", model: "Multistrada V4 Rally",  cc: "1158cc", category: "adventure", adj: "full"    },
  { id: "ducati-multi-v4",        brand: "Ducati", model: "Multistrada V4",         cc: "1158cc", category: "adventure", adj: "full",    mfzProfileId: "ducati_multi_v4_skyhook" }, // Skyhook DSS (S/Rally)
  { id: "ducati-multi-v2",        brand: "Ducati", model: "Multistrada V2",         cc: "937cc",  category: "adventure", adj: "full"    },
  { id: "ducati-desertx",         brand: "Ducati", model: "DesertX",                cc: "937cc",  category: "adventure", adj: "full"    },
  { id: "ducati-desertx-rally",   brand: "Ducati", model: "DesertX Rally",          cc: "937cc",  category: "adventure", adj: "full"    },
  { id: "ducati-sf-v4",           brand: "Ducati", model: "Streetfighter V4",       cc: "1103cc", category: "naked",     adj: "full"    },
  { id: "ducati-pani-v4",         brand: "Ducati", model: "Panigale V4",            cc: "1103cc", category: "sport",     adj: "full"    },
  // Monster 937: Marzocchi front non-adjustable; rear Sachs preload+rebound only
  { id: "ducati-monster",         brand: "Ducati", model: "Monster",                cc: "937cc",  category: "naked",     adj: "partial" },
  { id: "ducati-hyper-950",       brand: "Ducati", model: "Hypermotard 950",        cc: "937cc",  category: "supermoto", adj: "full"    },
  { id: "ducati-hyper-698",       brand: "Ducati", model: "Hypermotard 698 Mono",   cc: "659cc",  category: "supermoto", adj: "full"    },

  // ===== Honda =====
  { id: "honda-africa-as",   brand: "Honda", model: "Africa Twin Adventure Sports", cc: "1084cc", category: "adventure", adj: "full",  mfzProfileId: "honda_at_1100l_advsports_eera" }, // Showa EERA electronic
  { id: "honda-africa",      brand: "Honda", model: "Africa Twin",                  cc: "1084cc", category: "adventure", adj: "full",  mfzProfileId: "honda_at_1100l_2020_manual" },
  // Transalp XL750: Showa SFF front + Showa rear — preload only both ends, no rebound/compression
  { id: "honda-transalp",      brand: "Honda", model: "XL750 Transalp (2023-2024)", cc: "755cc",  category: "adventure", adj: "fixed", mfzProfileId: "honda_transalp_2023" },
  { id: "honda-transalp-2025", brand: "Honda", model: "XL750 Transalp (2025)",      cc: "755cc",  category: "adventure", adj: "fixed", mfzProfileId: "honda_transalp_2025" },
  { id: "honda-transalp-2026", brand: "Honda", model: "XL750 Transalp (2026+)",     cc: "755cc",  category: "adventure", adj: "full",  mfzProfileId: "honda_transalp_2026" },
  // NC750X: front non-adjustable, rear preload ring only
  { id: "honda-nc750x",      brand: "Honda", model: "NC750X",                       cc: "745cc",  category: "adventure", adj: "fixed"   },
  { id: "honda-xadv",        brand: "Honda", model: "X-ADV",                        cc: "745cc",  category: "adventure", adj: "fixed"   },
  { id: "honda-fireblade",   brand: "Honda", model: "CBR1000RR-R Fireblade",        cc: "999cc",  category: "sport",     adj: "full"    },
  // CB1000R: front compression only, rear preload+rebound (no front rebound, no rear compression)
  { id: "honda-nt1100",      brand: "Honda", model: "NT1100",                        cc: "1084cc", category: "sport_touring", adj: "partial", mfzProfileId: "honda_nt1100_2022" },
  { id: "honda-cb1000r",     brand: "Honda", model: "CB1000R",                      cc: "998cc",  category: "naked",     adj: "partial" },
  // CB650R 2021+: Showa SFF-BP fully adjustable
  { id: "honda-cb650r",      brand: "Honda", model: "CB650R",                       cc: "649cc",  category: "naked",     adj: "full"    },

  // ===== Kawasaki =====
  { id: "kawasaki-versys-1000", brand: "Kawasaki", model: "Versys 1000 SE",  cc: "1043cc", category: "adventure",     adj: "full",    mfzProfileId: "kawasaki_versys1000se_kecs" }, // KECS Skyhook electronic
  // Versys 650: front preload+rebound, rear preload+rebound — no compression either end
  { id: "kawasaki-versys-650",  brand: "Kawasaki", model: "Versys 650",      cc: "649cc",  category: "adventure",     adj: "partial" },
  { id: "kawasaki-1000sx",      brand: "Kawasaki", model: "Ninja 1000SX",    cc: "1043cc", category: "sport_touring", adj: "full"    },
  { id: "kawasaki-zx10r",       brand: "Kawasaki", model: "Ninja ZX-10R",    cc: "998cc",  category: "sport",         adj: "full"    },
  // Z900 standard: KYB front preload+rebound, rear preload+rebound — no compression either end
  { id: "kawasaki-z900",        brand: "Kawasaki", model: "Z900",            cc: "948cc",  category: "naked",         adj: "partial" },
  { id: "kawasaki-zh2",         brand: "Kawasaki", model: "Z H2",            cc: "998cc",  category: "naked",         adj: "full"    },

  // ===== Kove =====
  { id: "kove-800x-pro",   brand: "Kove", model: "800X Pro",  cc: "799cc", category: "adventure", adj: "full", mfzProfileId: "kove_800x_pro_2026"    },
  { id: "kove-800x",       brand: "Kove", model: "800X",      cc: "799cc", category: "adventure", adj: "full", mfzProfileId: "kove_800x_standard"    },
  { id: "kove-800-rally",  brand: "Kove", model: "800 Rally", cc: "799cc", category: "adventure", adj: "full", mfzProfileId: "kove_800x_rally"       },
  { id: "kove-450-rally",  brand: "Kove", model: "450 Rally", cc: "443cc", category: "adventure", adj: "full", mfzProfileId: "kove_450rally_regular" },

  // ===== KTM =====
  { id: "ktm-1290-sadv",     brand: "KTM", model: "1290 Super Adventure S", cc: "1301cc", category: "adventure", adj: "full",    mfzProfileId: "ktm_1290_sadv_s_electronic" }, // semi-active electronic
  { id: "ktm-1290-sadv-r",   brand: "KTM", model: "1290 Super Adventure R", cc: "1301cc", category: "adventure", adj: "full",    mfzProfileId: "ktm_1290_adv_r_2021" },
  { id: "ktm-1190-adv-r",   brand: "KTM", model: "1190 Adventure R",       cc: "1195cc", category: "adventure", adj: "full",    mfzProfileId: "ktm_1190_adv_r_2013" },
  { id: "ktm-890-adv-r",     brand: "KTM", model: "890 Adventure R",        cc: "889cc",  category: "adventure", adj: "full",    mfzProfileId: "ktm_890_adv_r_2021"  },
  { id: "ktm-790-adv-r",     brand: "KTM", model: "790 Adventure R",        cc: "799cc",  category: "adventure", adj: "full",    mfzProfileId: "ktm_790_adv_r_2019" },
  { id: "ktm-790-adv",       brand: "KTM", model: "790 Adventure (2025+)",    cc: "799cc",  category: "adventure", adj: "full",    mfzProfileId: "ktm_790_adv_std_2025" },
  // 890 Adventure (non-R): WP APEX 43 with preload+rebound both ends, no compression
  { id: "ktm-890-adv",       brand: "KTM", model: "890 Adventure",          cc: "889cc",  category: "adventure", adj: "partial" },
  // 390 Adventure: WP non-adjustable front + rear preload cam only
  { id: "ktm-390-adv",       brand: "KTM", model: "390 Adventure",          cc: "399cc",  category: "adventure", adj: "fixed"   },
  { id: "ktm-1290-sdr",      brand: "KTM", model: "1290 Super Duke R",      cc: "1301cc", category: "naked",     adj: "full"    },
  { id: "ktm-890-duke-r",    brand: "KTM", model: "890 Duke R",             cc: "889cc",  category: "naked",     adj: "full"    },
  // 790 Duke: WP APEX preload+rebound both ends, no compression
  { id: "ktm-790-duke",      brand: "KTM", model: "790 Duke",               cc: "799cc",  category: "naked",     adj: "partial" },
  { id: "ktm-690-smcr",      brand: "KTM", model: "690 SMC R",              cc: "693cc",  category: "supermoto", adj: "full"    },

  // ===== QJ Motor =====
  { id: "qj-srt800x",   brand: "QJ Motor", model: "SRT 800 X",  cc: "778cc", category: "adventure",     adj: "partial" },
  { id: "qj-srt750sx",  brand: "QJ Motor", model: "SRT 750 SX", cc: "744cc", category: "sport_touring", adj: "partial" },
  // SRK921: Marzocchi fully adjustable (2026 spec confirmed)
  { id: "qj-srk921",    brand: "QJ Motor", model: "SRK 921",    cc: "921cc", category: "naked",         adj: "full"    },
  { id: "qj-srk600",    brand: "QJ Motor", model: "SRK 600",    cc: "598cc", category: "naked",         adj: "partial" },
  { id: "qj-srk800",   brand: "QJ Motor", model: "SRK 800",    cc: "778cc", category: "naked",     adj: "full" },
  { id: "qj-srk900",   brand: "QJ Motor", model: "SRK 900",    cc: "900cc", category: "naked",     adj: "full" },
  { id: "qj-srt450rx", brand: "QJ Motor", model: "SRT 450 RX", cc: "449cc", category: "adventure", adj: "full" },
  { id: "qj-srt900sx", brand: "QJ Motor", model: "SRT 900 SX", cc: "904cc", category: "adventure", adj: "full" },

  // ===== Suzuki =====
  { id: "suzuki-vstrom-1050de", brand: "Suzuki", model: "V-Strom 1050 DE",  cc: "1037cc", category: "adventure", adj: "full",  mfzProfileId: "suzuki_vstrom_1050de" },
  { id: "suzuki-vstrom-800de",  brand: "Suzuki", model: "V-Strom 800 DE",   cc: "776cc",  category: "adventure", adj: "full",  mfzProfileId: "suzuki_vstrom_800de"  },
  // V-Strom 650 XT: front non-adjustable, rear preload only
  { id: "suzuki-vstrom-650",    brand: "Suzuki", model: "V-Strom 650 XT",   cc: "645cc",  category: "adventure", adj: "fixed"   },
  { id: "suzuki-gsxs1000",      brand: "Suzuki", model: "GSX-S1000",        cc: "999cc",  category: "naked",     adj: "full"    },
  { id: "suzuki-gsxr1000",      brand: "Suzuki", model: "GSX-R1000R",       cc: "999cc",  category: "sport",     adj: "full"    },

  // ===== Triumph =====
  { id: "triumph-tiger-1200",       brand: "Triumph", model: "Tiger 1200 Rally Pro",  cc: "1160cc", category: "adventure",     adj: "full",    mfzProfileId: "triumph_tiger1200_showa" }, // Showa semi-active
  { id: "triumph-tiger-900-rally",  brand: "Triumph", model: "Tiger 900 Rally Pro",   cc: "888cc",  category: "adventure",     adj: "full"    },
  // Tiger 900 GT: Showa preload+rebound, no compression
  { id: "triumph-tiger-900-gt",     brand: "Triumph", model: "Tiger 900 GT",          cc: "888cc",  category: "adventure",     adj: "partial" },
  // Tiger Sport 660: Showa front preload only + rear preload only — no rebound/compression at all
  { id: "triumph-tiger-sport-660",  brand: "Triumph", model: "Tiger Sport 660",       cc: "660cc",  category: "sport_touring", adj: "fixed"   },
  { id: "triumph-st-rs",            brand: "Triumph", model: "Street Triple RS",      cc: "765cc",  category: "naked",         adj: "full"    },
  { id: "triumph-speed-1200",       brand: "Triumph", model: "Speed Triple 1200 RS",  cc: "1160cc", category: "naked",         adj: "full"    },
  { id: "triumph-scrambler-1200",   brand: "Triumph", model: "Scrambler 1200 XE",    cc: "1200cc", category: "scrambler",     adj: "full"    },

  // ===== Voge =====
  // 900 DSX & 525 DSX: KYB fully adjustable confirmed
  { id: "voge-900dsx",  brand: "Voge", model: "900 DSX", cc: "895cc", category: "adventure", adj: "full"    },
  { id: "voge-650dsx",  brand: "Voge", model: "650 DSX", cc: "652cc", category: "adventure", adj: "partial" },
  { id: "voge-525dsx",  brand: "Voge", model: "525 DSX", cc: "494cc", category: "adventure", adj: "full"    },
  { id: "voge-525r",    brand: "Voge", model: "525 R",   cc: "494cc", category: "naked",     adj: "partial" },
  { id: "voge-625dsx",       brand: "Voge", model: "625 DSX",      cc: "625cc", category: "adventure", adj: "full" },
  { id: "voge-800dsx-rally", brand: "Voge", model: "800 DSX Rally", cc: "798cc", category: "adventure", adj: "full" },
  { id: "voge-r625",         brand: "Voge", model: "R625",          cc: "625cc", category: "naked",     adj: "full" },
  { id: "voge-ac525x",       brand: "Voge", model: "AC 525X",       cc: "494cc", category: "scrambler", adj: "partial" },

  // ===== Yamaha =====
  { id: "yamaha-tenere-w",   brand: "Yamaha", model: "Ténéré 700 World Raid", cc: "689cc", category: "adventure",     adj: "full",    mfzProfileId: "yamaha_t700_world_raid_2026" }, // KYB fully adjustable (Ohlins is only the steering damper)
  // Ténéré 700 base: KYB preload+rebound both ends, no compression
  { id: "yamaha-tenere-2019", brand: "Yamaha", model: "Ténéré 700 (2019-2024)", cc: "689cc", category: "adventure", adj: "partial", mfzProfileId: "yamaha_t700_2019" },
  { id: "yamaha-tenere-2025", brand: "Yamaha", model: "Ténéré 700 (2025+)",      cc: "689cc", category: "adventure", adj: "full",    mfzProfileId: "yamaha_t700_2025" },
  { id: "yamaha-tracer9",    brand: "Yamaha", model: "Tracer 9 GT+",          cc: "890cc", category: "sport_touring", adj: "full"    },
  { id: "yamaha-mt10",       brand: "Yamaha", model: "MT-10",                 cc: "998cc", category: "naked",         adj: "full"    },
  // MT-09: KYB front preload+rebound, rear preload+rebound — no compression either end
  { id: "yamaha-mt09",       brand: "Yamaha", model: "MT-09",                 cc: "890cc", category: "naked",         adj: "partial" },
  // MT-07: KYB front non-adjustable, rear preload+rebound
  { id: "yamaha-mt07",       brand: "Yamaha", model: "MT-07",                 cc: "689cc", category: "naked",         adj: "partial" },
  // XSR900: same platform as MT-09, preload+rebound both ends
  { id: "yamaha-xsr900",     brand: "Yamaha", model: "XSR900",                cc: "890cc", category: "naked",         adj: "partial" },
  { id: "yamaha-r1",         brand: "Yamaha", model: "YZF-R1",                cc: "998cc", category: "sport",         adj: "full"    },
  // R7: KYB front non-adjustable, rear preload+rebound
  { id: "yamaha-r7",         brand: "Yamaha", model: "YZF-R7",                cc: "689cc", category: "midsport",      adj: "partial" },
];

export const BIKE_BY_ID: Record<string, Bike> = BIKES.reduce(
  (acc, b) => { acc[b.id] = b; return acc; },
  {} as Record<string, Bike>,
);

export function bikeLabel(id: string): string {
  const b = BIKE_BY_ID[id];
  return b ? `${b.brand} ${b.model}` : "—";
}

export function bikesByBrand(): { brand: string; items: Bike[] }[] {
  return BIKE_BRANDS.map((brand) => ({
    brand,
    items: BIKES.filter((b) => b.brand === brand),
  })).filter((g) => g.items.length > 0);
}