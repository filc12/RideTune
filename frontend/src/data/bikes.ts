// Curated catalog of motorcycles with adjustable suspension.
// adj: "full"    = preload+rebound+compression both ends
//      "partial" = at least rear preload+rebound; front may be limited
//      "fixed"   = no click-adjustable dampers (front locked + rear preload only)
// Sources: manufacturer specs, Bennetts, Cycle World, MCNews, Teknik Motorsport.
//
// `adjusters` (opcional) diz QUAIS dos 6 afinadores existem fisicamente. Só é lido
// nas motos SEM mfzProfileId — essas caem na heurística por categoria, que de outra
// forma inventaria um número para afinadores que a moto não tem. Quando omitido usa-se
// ADJUSTERS_BY_LEVEL[adj]. Só está preenchido onde a moto DIVERGE desse default.
//
// POR VERIFICAR — mantêm o default do nível `adj`, que pode estar errado.
// Não editar sem confirmar em spec oficial do fabricante:
//   Honda:    honda-fireblade (honda.co.uk MY2025+ lista Öhlins NPX/TTX36 S-EC 3.0:
//             compressão e extensão são ELETRÓNICAS. Falta confirmar se a pré-carga é
//             manual — se for, é caso de adjusters {fPre,rPre} true e o resto false;
//             se não for, é perfil MFZ com tudo `na`. A geração anterior (Showa BPF)
//             era mecânica full, por isso a entrada precisa de ano no nome.)
//   KTM:      ktm-1290-sdr, ktm-890-duke-r (a KTM removeu ambas as páginas de
//             technical-specifications do ktm.com — sem fonte oficial viva)
//   Suzuki:   suzuki-gsxs1000, suzuki-gsxr1000 (a tabela oficial da Suzuki diz só
//             "inverted telescopic, coil spring, oil damped" — não lista afinadores)
//   Yamaha:   yamaha-r1 (frente confirmada full em yamahamotorsports.com: pré-carga +
//             compressão alta/baixa + extensão; falta confirmação oficial do traseiro)
//
// BLOCO CHINÊS — tentado e SEM SAÍDA pelo site oficial. Não repetir a pesquisa pela
// mesma via; o caminho que falta é o manual do utilizador (PDF), ver nota no fim.
//   CFMoto:   cfmoto-1000srr (o 1000 SR-R saiu do cfmoto.com global — modelo de
//             mercado chinês; a gama Sport Racing global só lista o 675SR-R)
//   QJ Motor: qj-srt800x, qj-srt750sx, qj-srk921, qj-srk600, qj-srk800, qj-srk900,
//             qj-srt450rx, qj-srt900sx, qj-srt600sx
//             (global.qjmotor.com usa um template genérico em TODOS os modelos —
//             "Upside down telescopic forks" / "Telescopic coil spring oil damped".
//             Confirmado no SRK 921 RR e no SRT 300 DX: nunca diz que é ajustável.)
//   Voge:     voge-900dsx, voge-650dsx, voge-525dsx, voge-525r, voge-625dsx,
//             voge-800dsx-rally, voge-r625, voge-ac525x
//             (a Voge não tem site global vivo: voge.eu e voge.com estão à venda,
//             voge.it idem. Só restam importadores nacionais e imprensa.)
//
// Via que falta explorar para o bloco chinês: os manuais do utilizador em PDF que os
// importadores publicam (ex.: qjmotor.es/wp-content/uploads/.../MANUAL-USUARIO-*.pdf).
// São documento OEM e listam os afinadores. Não deu para extrair o texto por browser
// — é preciso descarregar o PDF à mão e ler o capítulo da suspensão.

export type BikeCategory =
  | "adventure"
  | "naked"
  | "sport"
  | "sport_touring"
  | "supermoto"
  | "midsport"
  | "scrambler";

export type SuspAdj = "full" | "partial" | "fixed";

/**
 * Which of the six adjusters physically exist on the bike.
 * Only needed for bikes WITHOUT an mfzProfileId — those fall back to the
 * category heuristic, which otherwise invents a number for every adjuster.
 * When omitted, ADJUSTERS_BY_LEVEL[adj] is used as a conservative default.
 */
export type BikeAdjusters = {
  fPre: boolean; fComp: boolean; fReb: boolean;
  rPre: boolean; rComp: boolean; rReb: boolean;
};

export type Bike = {
  id: string;
  brand: string;
  model: string;
  cc: string;
  category: BikeCategory;
  adj: SuspAdj;
  /** Per-adjuster capability. Overrides the default derived from `adj`. */
  adjusters?: BikeAdjusters;
  /** Links to a real factory data profile from mfzstudio.com/moto/ */
  mfzProfileId?: string;
};

/** Conservative default per `adj` level, used when `adjusters` is not set. */
export const ADJUSTERS_BY_LEVEL: Record<SuspAdj, BikeAdjusters> = {
  // Everything adjustable both ends.
  full:    { fPre: true,  fComp: true,  fReb: true,  rPre: true,  rComp: true,  rReb: true  },
  // Most common "partial" layout: preload + rebound both ends, no compression.
  partial: { fPre: true,  fComp: false, fReb: true,  rPre: true,  rComp: false, rReb: true  },
  // No click-adjustable dampers: rear spring preload only.
  fixed:   { fPre: false, fComp: false, fReb: false, rPre: true,  rComp: false, rReb: false },
};

/** Resolves the adjusters for a bike, falling back to the `adj` level default. */
export function resolveAdjusters(bike: { adj: SuspAdj; adjusters?: BikeAdjusters }): BikeAdjusters {
  return bike.adjusters ?? ADJUSTERS_BY_LEVEL[bike.adj];
}

// Alphabetical order
export const BIKE_BRANDS: string[] = [
  "Aprilia", "BMW", "CF Moto", "Ducati", "Honda",
  "Kawasaki", "Kove", "KTM", "Macbor", "QJ Motor",
  "Suzuki", "Triumph", "Voge", "Yamaha",
];

export const BIKE_CATEGORIES: BikeCategory[] = [
  "adventure", "naked", "sport", "sport_touring",
  "supermoto", "midsport", "scrambler",
];

export const BIKES: Bike[] = [
  // ===== Aprilia =====
  { id: "aprilia-tuareg",    brand: "Aprilia", model: "Tuareg 660",    cc: "659cc",  category: "adventure", adj: "full" },
  { id: "macbor-montana-xr5", brand: "Macbor", model: "Montana XR5", cc: "498cc", category: "adventure", adj: "full", mfzProfileId: "macbor_xr5" },
  { id: "aprilia-rsv4",      brand: "Aprilia", model: "RSV4",          cc: "1099cc", category: "sport",     adj: "full" },
  { id: "aprilia-tuono-v4",  brand: "Aprilia", model: "Tuono V4",      cc: "1077cc", category: "naked",     adj: "full" },
  // RS 660 / Tuono 660 base: KYB 41 mm com precarga + extensão (sem compressão) e monoamortecedor
  // precarga + extensão. Só a Tuono 660 Factory (Sachs) ganha compressão — não está no catálogo.
  { id: "aprilia-rs660",     brand: "Aprilia", model: "RS 660",        cc: "659cc",  category: "midsport",  adj: "full", adjusters: { fPre: true, fComp: false, fReb: true, rPre: true, rComp: false, rReb: true } },
  { id: "aprilia-tuono-660", brand: "Aprilia", model: "Tuono 660",     cc: "659cc",  category: "naked",     adj: "full", adjusters: { fPre: true, fComp: false, fReb: true, rPre: true, rComp: false, rReb: true } },

  // ===== BMW =====
  { id: "bmw-r1300-gs-adv",  brand: "BMW", model: "R 1300 GS Adventure",  cc: "1300cc", category: "adventure",     adj: "full", mfzProfileId: "bmw_r1300gsa_dsa" }, // Dynamic ESA electronic
  // R 1300 GS (2024+): EVO-Telelever sem ajuste; atrás WAD só "spring preload fully
  // adjustable" — a BMW não lista extensão. DSA (eletrónica) é opcional. bmwmotorcycles.com
  { id: "bmw-r1300-gs",      brand: "BMW", model: "R 1300 GS (2024+)",     cc: "1300cc", category: "adventure",     adj: "full", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: false } },
  // R 1250 GS / RT sem ESA: Telelever à frente NÃO tem qualquer ajuste externo.
  // Atrás, manípulo de precarga + manípulo de extensão. (Com ESA é tudo eletrónico.)
  { id: "bmw-1250-gs",       brand: "BMW", model: "R 1250 GS (2019-2023)", cc: "1254cc", category: "adventure",     adj: "full", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: true } },
  { id: "bmw-r1250-rt",      brand: "BMW", model: "R 1250 RT (2019-2024)", cc: "1254cc", category: "sport_touring", adj: "full", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: true } },
  // F 900 GS (2024+): forquilha 43 mm precarga+comp+ext; atrás precarga hidráulica +
  // extensão (sem compressão). bmwmotorcycles.com
  { id: "bmw-f900-gs",       brand: "BMW", model: "F 900 GS (2024+)",      cc: "895cc",  category: "adventure",     adj: "full", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  // F 900 XR (2020+): a BMW lista a forquilha 43 mm SEM qualquer ajuste; atrás precarga
  // hidráulica + extensão. Dynamic ESA é opcional. bmwmotorcycles.com
  { id: "bmw-f900-xr",       brand: "BMW", model: "F 900 XR (2020+)",      cc: "895cc",  category: "sport_touring", adj: "full", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: true } },
  // S 1000 RR / S 1000 R / M 1000 RR: forquilha invertida 45 mm com precarga + compressão +
  // extensão; atrás full floater pro com compressão + extensão + precarga. Full nas duas
  // pontas — o default de `adj: "full"` está correto. bmwmotorcycles.com (technicaldata)
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
  // V4 Rally: Skyhook EVO — comp/ext e precarga eletrónicas nas duas pontas, sem clickers
  // manuais (ducati.com). Usa o perfil Skyhook, que já cobre "S / Rally" e traz a nota
  // explicativa traduzida (count.ducati_multi_v4_skyhook) em vez de 6 células vazias.
  { id: "ducati-multi-v4-rally",  brand: "Ducati", model: "Multistrada V4 Rally",  cc: "1158cc", category: "adventure", adj: "full",    mfzProfileId: "ducati_multi_v4_skyhook" },
  // V4 base: forquilha Ø50 MECÂNICA totalmente ajustável (comp+ext manuais) + monoamortecedor
  // totalmente ajustável c/ precarga remota. Não é Skyhook — essa é a S. ducati.com
  { id: "ducati-multi-v4",        brand: "Ducati", model: "Multistrada V4",         cc: "1158cc", category: "adventure", adj: "full"    },
  // V4 S: Skyhook eletrónica (comp/ext/precarga no ecrã)
  { id: "ducati-multi-v4-s",      brand: "Ducati", model: "Multistrada V4 S",       cc: "1158cc", category: "adventure", adj: "full",    mfzProfileId: "ducati_multi_v4_skyhook" },
  // Multistrada V2 (2025+): forquilha mecânica Ø45 totalmente ajustável + monoamortecedor
  // totalmente ajustável c/ precarga remota. (A versão S é Skyhook eletrónica.) ducati.com
  { id: "ducati-multi-v2",        brand: "Ducati", model: "Multistrada V2 (2025+)", cc: "890cc",  category: "adventure", adj: "full"    },
  // DesertX V2 (2026+): KYB 46 totalmente ajustável + KYB traseiro totalmente ajustável
  { id: "ducati-desertx",         brand: "Ducati", model: "DesertX V2 (2026+)",     cc: "890cc",  category: "adventure", adj: "full"    },
  // DesertX Rally: KYB 48 closed cartridge — a Ducati lista SÓ compressão e extensão à
  // frente, sem precarga. Atrás fully adjustable (HSC/LSC + ext) + precarga remota.
  { id: "ducati-desertx-rally",   brand: "Ducati", model: "DesertX Rally",          cc: "937cc",  category: "adventure", adj: "full", adjusters: { fPre: false, fComp: true, fReb: true, rPre: true, rComp: true, rReb: true } },
  { id: "ducati-sf-v4",           brand: "Ducati", model: "Streetfighter V4",       cc: "1103cc", category: "naked",     adj: "full"    },
  // Panigale V4 base (não-S): "Fully adjustable Showa BPF fork, 43 mm" à frente e
  // "Fully adjustable Sachs unit" atrás — full nas duas pontas, default correto.
  // (A V4 S é que leva Öhlins NPX/TTX36 S-EC 3.0 eletrónica.) ducati.com tech spec
  { id: "ducati-pani-v4",         brand: "Ducati", model: "Panigale V4",            cc: "1103cc", category: "sport",     adj: "full"    },
  // Monster 937: Marzocchi front non-adjustable; rear Sachs preload+rebound only
  { id: "ducati-monster",         brand: "Ducati", model: "Monster",                cc: "937cc",  category: "naked",     adj: "partial", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: true } },
  // Hypermotard 950 base: Marzocchi Ø45 totalmente ajustável à frente; Sachs atrás só com
  // precarga + extensão (sem compressão). A versão SP com Öhlins é que é full atrás. ducati.com
  { id: "ducati-hyper-950",       brand: "Ducati", model: "Hypermotard 950",        cc: "937cc",  category: "supermoto", adj: "full", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  { id: "ducati-hyper-698",       brand: "Ducati", model: "Hypermotard 698 Mono",   cc: "659cc",  category: "supermoto", adj: "full"    },

  // ===== Honda =====
  { id: "honda-africa-as",   brand: "Honda", model: "Africa Twin Adventure Sports", cc: "1084cc", category: "adventure", adj: "full",  mfzProfileId: "honda_at_1100l_advsports_eera" }, // Showa EERA electronic
  { id: "honda-africa",      brand: "Honda", model: "Africa Twin",                  cc: "1084cc", category: "adventure", adj: "full",  mfzProfileId: "honda_at_1100l_2020_manual" },
  { id: "honda-africa-dct",  brand: "Honda", model: "Africa Twin DCT",              cc: "1084cc", category: "adventure", adj: "full",  mfzProfileId: "honda_at_1100l_2020_dct" },
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
  // CB1000R: Showa SFF-BP front (preload+comp+reb, damping numa perna); Showa rear preload+rebound
  { id: "honda-cb1000r",     brand: "Honda", model: "CB1000R",                      cc: "998cc",  category: "naked",     adj: "partial", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  // CB650R 2021+: Showa SFF-BP fully adjustable
  // CB650R: Showa SFF-BP só com precarga à frente (sem extensão nem compressão);
  // monoamortecedor só precarga (10 posições). Não é "full".
  { id: "honda-cb650r",      brand: "Honda", model: "CB650R",                       cc: "649cc",  category: "naked",     adj: "full",    adjusters: { fPre: true, fComp: false, fReb: false, rPre: true, rComp: false, rReb: false } },

  // ===== Kawasaki =====
  { id: "kawasaki-versys-1000", brand: "Kawasaki", model: "Versys 1000 SE",  cc: "1043cc", category: "adventure",     adj: "full",    mfzProfileId: "kawasaki_versys1000se_kecs" }, // KECS Skyhook electronic
  // Versys 650: front preload+rebound, rear preload+rebound — no compression either end
  { id: "kawasaki-versys-650",  brand: "Kawasaki", model: "Versys 650",      cc: "649cc",  category: "adventure",     adj: "partial" },
  // Ninja 1000SX: frente precarga+comp+ext; atrás precarga remota + extensão (sem compressão)
  { id: "kawasaki-1000sx",      brand: "Kawasaki", model: "Ninja 1000SX",    cc: "1043cc", category: "sport_touring", adj: "full",    adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  // ZX-10R: Balance Free Fork invertida Ø43 com compressão + extensão + precarga; atrás
  // BFRC lite com compressão + extensão + precarga. Full nas duas pontas. kawasaki.eu
  { id: "kawasaki-zx10r",       brand: "Kawasaki", model: "Ninja ZX-10R",    cc: "998cc",  category: "sport",         adj: "full"    },
  // Z900 standard: KYB front preload+rebound, rear preload+rebound — no compression either end
  { id: "kawasaki-z900",        brand: "Kawasaki", model: "Z900",            cc: "948cc",  category: "naked",         adj: "partial" },
  // Z H2 (base, não-SE): frente SFF-BP com compressão + extensão + precarga; atrás
  // Uni-Trak só com EXTENSÃO + precarga — a Kawasaki não lista compressão traseira.
  // (A Z H2 SE é que tem KECS eletrónica.) kawasaki.eu
  { id: "kawasaki-zh2",         brand: "Kawasaki", model: "Z H2 (2020+)",    cc: "998cc",  category: "naked",         adj: "full",    adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },

  // ===== Kove =====
  { id: "kove-800x-pro",   brand: "Kove", model: "800X Pro",  cc: "799cc", category: "adventure", adj: "full", mfzProfileId: "kove_800x_pro_2026"    },
  { id: "kove-800x",       brand: "Kove", model: "800X",      cc: "799cc", category: "adventure", adj: "full", mfzProfileId: "kove_800x_standard"    },
  { id: "kove-800-rally",  brand: "Kove", model: "800 Rally", cc: "799cc", category: "adventure", adj: "full", mfzProfileId: "kove_800x_rally"       },
  { id: "kove-450-rally",  brand: "Kove", model: "450 Rally", cc: "443cc", category: "adventure", adj: "full", mfzProfileId: "kove_450rally_regular" },
  { id: "kove-450-rally-factory", brand: "Kove", model: "450 Rally Factory", cc: "443cc", category: "adventure", adj: "full", mfzProfileId: "kove_450rally_factory" },
  { id: "kove-800x-e5",      brand: "Kove", model: "800X E5",      cc: "799cc", category: "adventure", adj: "full", mfzProfileId: "kove_800x_e5"      },
  { id: "kove-800x-touring", brand: "Kove", model: "800X Touring", cc: "799cc", category: "adventure", adj: "full", mfzProfileId: "kove_800x_touring" },

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
  // 390 Adventure R (2025+): WP APEX open cartridge 43 comp+reb (30 clicks), sem precarga à frente;
  // WP APEX split piston atrás com precarga por anel + rebound (20 clicks), sem compressão. ktm.com specs
  { id: "ktm-390-adv-r",     brand: "KTM", model: "390 Adventure R (2025+)", cc: "399cc",  category: "adventure", adj: "partial", mfzProfileId: "ktm_390_adv_r_2025" },
  // 390 Enduro R (2025+): mesma base WP APEX 43 / split piston, 230 mm curso. ktm.com specs
  { id: "ktm-390-enduro-r",  brand: "KTM", model: "390 Enduro R (2025+)",   cc: "399cc",  category: "adventure", adj: "partial", mfzProfileId: "ktm_390_enduro_r_2025" },
  { id: "ktm-1290-sdr",      brand: "KTM", model: "1290 Super Duke R",      cc: "1301cc", category: "naked",     adj: "full"    },
  { id: "ktm-890-duke-r",    brand: "KTM", model: "890 Duke R",             cc: "889cc",  category: "naked",     adj: "full"    },
  // 790 Duke: WP APEX preload+rebound both ends, no compression
  { id: "ktm-790-duke",      brand: "KTM", model: "790 Duke",               cc: "799cc",  category: "naked",     adj: "partial" },
  // 690 SMC R: forquilha WP APEX 48 split (compressão na perna esquerda, extensão na
  // direita, 30 cliques cada) — SEM ajuste de precarga à frente. Atrás WP APEX com
  // compressão (alta e baixa velocidade), extensão e precarga. ktm.com technical-specifications
  { id: "ktm-690-smcr",      brand: "KTM", model: "690 SMC R (2019+)",      cc: "693cc",  category: "supermoto", adj: "full",    adjusters: { fPre: false, fComp: true, fReb: true, rPre: true, rComp: true, rReb: true } },
  // 690 Enduro R: dual-sport homologada para estrada, faz sentido na app.
  // Categoria "adventure" por falta de tipo enduro em BikeCategory.
  // As EXC 2T / EXC-F ficam FORA do catálogo por decisão de produto (motos de competição,
  // sem uso para pressões de estrada nem sag de carga) — os perfis MFZ ficam órfãos de propósito.
  { id: "ktm-690-enduro-r",  brand: "KTM", model: "690 Enduro R (2019+)",   cc: "693cc",  category: "adventure", adj: "full",    mfzProfileId: "ktm_690_enduro_2019" },

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
  // SRT 600 SX (2024+): garfo Marzocchi 43mm invertido totalmente ajustável
  // (pré-carga, compressão e ressalto, 145mm de curso); atrás monoshock com
  // pré-carga remota e ressalto, sem compressão → "partial".
  { id: "qj-srt600sx", brand: "QJ Motor", model: "SRT 600 SX", cc: "554cc", category: "adventure", adj: "partial" },

  // ===== Suzuki =====
  { id: "suzuki-vstrom-1050de", brand: "Suzuki", model: "V-Strom 1050 DE",  cc: "1037cc", category: "adventure", adj: "full",  mfzProfileId: "suzuki_vstrom_1050de" },
  { id: "suzuki-vstrom-800de",  brand: "Suzuki", model: "V-Strom 800 DE",   cc: "776cc",  category: "adventure", adj: "full",  mfzProfileId: "suzuki_vstrom_800de"  },
  // V-Strom 650 XT: front non-adjustable, rear preload only
  // V-Strom 650 XT (2017+): frente sem qualquer ajuste externo; atrás precarga + extensão
  { id: "suzuki-vstrom-650",    brand: "Suzuki", model: "V-Strom 650 XT",   cc: "645cc",  category: "adventure", adj: "fixed",   adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: true } },
  { id: "suzuki-gsxs1000",      brand: "Suzuki", model: "GSX-S1000",        cc: "999cc",  category: "naked",     adj: "full"    },
  { id: "suzuki-gsxr1000",      brand: "Suzuki", model: "GSX-R1000R",       cc: "999cc",  category: "sport",     adj: "full"    },

  // ===== Triumph =====
  { id: "triumph-tiger-1200",       brand: "Triumph", model: "Tiger 1200 Rally Pro",  cc: "1160cc", category: "adventure",     adj: "full",    mfzProfileId: "triumph_tiger1200_showa" }, // Showa semi-active
  { id: "triumph-tiger-900-rally",  brand: "Triumph", model: "Tiger 900 Rally Pro",   cc: "888cc",  category: "adventure",     adj: "full"    },
  // Tiger 900 GT: Showa preload+rebound, no compression
  { id: "triumph-tiger-900-gt",     brand: "Triumph", model: "Tiger 900 GT",          cc: "888cc",  category: "adventure",     adj: "partial" },
  // Tiger Sport 660: Showa front preload only + rear preload only — no rebound/compression at all
  { id: "triumph-tiger-sport-660",  brand: "Triumph", model: "Tiger Sport 660",       cc: "660cc",  category: "sport_touring", adj: "fixed"   },
  // Street Triple RS: Showa 41 mm BPF com compressão + extensão + precarga; atrás Öhlins
  // STX40 fully adjustable. Full nas duas pontas. triumphmotorcycles.com
  { id: "triumph-st-rs",            brand: "Triumph", model: "Street Triple RS",      cc: "765cc",  category: "naked",         adj: "full"    },
  // Speed Triple 1200 RS: Öhlins NIX30 Ø43 + Öhlins TTX36, ambos com precarga +
  // compressão + extensão MANUAIS. A Öhlins SmartEC (semi-ativa) é exclusiva da RR, não
  // desta RS — a dúvida anterior fica resolvida. triumphmotorcycles.com
  { id: "triumph-speed-1200",       brand: "Triumph", model: "Speed Triple 1200 RS",  cc: "1160cc", category: "naked",         adj: "full"    },
  // Scrambler 1200 XE: Marzocchi Ø45 "fully adjustable" à frente e duplo amortecedor
  // Marzocchi "fully adjustable" atrás (a XE, não a X, que é não-ajustável à frente).
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
  // Tracer 9 GT+: suspensão semi-ativa KADS (KYB Actimatic). Compressão/extensão são
  // eletrónicas — não há clickers manuais. Só a precarga traseira é manual.
  { id: "yamaha-tracer9",    brand: "Yamaha", model: "Tracer 9 GT+",          cc: "890cc", category: "sport_touring", adj: "full",    adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: false } },
  // MT-10: "fully adjustable KYB suspension — front and rear". yamahamotorsports.com
  { id: "yamaha-mt10",       brand: "Yamaha", model: "MT-10",                 cc: "998cc", category: "naked",         adj: "full"    },
  // MT-09: KYB front preload+rebound, rear preload+rebound — no compression either end
  { id: "yamaha-mt09",       brand: "Yamaha", model: "MT-09",                 cc: "890cc", category: "naked",         adj: "partial" },
  // MT-07: KYB front non-adjustable, rear preload+rebound
  // MT-07: forquilha sem ajuste; amortecedor só precarga (came de 7 posições)
  { id: "yamaha-mt07",       brand: "Yamaha", model: "MT-07",                 cc: "689cc", category: "naked",         adj: "partial", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: false } },
  // XSR900: same platform as MT-09, preload+rebound both ends
  // XSR900 (2022+): KYB 41 mm totalmente ajustável à frente; atrás precarga + extensão
  { id: "yamaha-xsr900",     brand: "Yamaha", model: "XSR900",                cc: "890cc", category: "naked",         adj: "partial", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  { id: "yamaha-r1",         brand: "Yamaha", model: "YZF-R1",                cc: "998cc", category: "sport",         adj: "full"    },
  // R7: KYB front non-adjustable, rear preload+rebound
  // YZF-R7: KYB 41 mm totalmente ajustável à frente; atrás precarga + extensão
  { id: "yamaha-r7",         brand: "Yamaha", model: "YZF-R7",                cc: "689cc", category: "midsport",      adj: "partial", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
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