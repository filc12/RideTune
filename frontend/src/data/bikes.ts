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
// As motos que não deu para confirmar em fonte oficial estão marcadas `hidden: true`:
// ficam fora do seletor mas continuam a resolver por id, para não partir setups nem
// diário de quem já as escolheu. Tira-se o `hidden` assim que aparecer o manual.
//
// TRUQUE PARA O MANUALSLIB: as páginas são imagem e o texto não é extraível, mas dá para
// as LER em captura de ecrã. O índice, esse, é texto normal e diz logo que capítulos de
// afinação existem. Foi assim que se fez a GSX-S1000 (páginas 50 a 54).
//
// BLOCO CHINÊS — tentado e SEM SAÍDA pelo site oficial. Não repetir a pesquisa pela
// mesma via; o caminho que falta é o manual do utilizador (PDF), ver nota no fim.
//   CFMoto:   cfmoto-1000srr (o 1000 SR-R saiu do cfmoto.com global — modelo de
//             mercado chinês; a gama Sport Racing global só lista o 675SR-R)
//   QJ Motor: qj-srt600sx (o importador PT vende-a e a página diz só "Suspensões
//             Marzocchi multi-reguláveis", sem separar frente de trás. O importador
//             russo não tem manual desta. Fica oculta até haver detalhe.)
//             NOTA sobre a antiga entrada "SRT 750 SX": não existia. A QJ não vende
//             nenhum 750 em Portugal — a gama cá é SRT 600SX, 700X, 700 ON, 900SX e
//             900S. O id qj-srt750sx passou a ser a SRT 700X, 698cc, com os afinadores
//             da qjmotor.pt. Com isso caiu também toda a investigação do manual QJ750-7
//             sobre os "Type 1 / 2 / 3" da forquilha: era do SRT 750 X americano, que
//             não é vendido cá.
//             O que vale a pena guardar dessa investigação: alguns manuais QJ descrevem
//             um ÚNICO parafuso central que mexe na compressão E na extensão ao mesmo
//             tempo. O BikeAdjusters não sabe representar afinadores combinados — marcar
//             fComp e fReb a true faria a app pedir dois números para um só parafuso.
//             Se isso aparecer confirmado nalguma moto, o tipo tem de mudar.
//             (global.qjmotor.com usa um template genérico em TODOS os modelos —
//             "Upside down telescopic forks" / "Telescopic coil spring oil damped".
//             Confirmado no SRK 921 RR e no SRT 300 DX: nunca diz que é ajustável.)
//   Voge:     voge-650dsx, voge-525r, voge-r625
//             (a Voge não tem site global vivo: voge.eu e voge.com estão à venda,
//             voge.it idem. Só restam importadores nacionais e imprensa.)
//
// FONTE NOVA E BOA para a QJ: qjmotor.pt, o importador oficial português. As fichas de
// modelo separam frente e trás ("multi-regulável em pré-carga, compressão e extensão").
// É a fonte a usar por defeito, porque é a spec do mercado onde a app é usada — a QJ
// avisa no site global que as specs variam por região, e isso já deu um conflito real
// na SRT 900 SX (ver comentário na entrada). Cautela: a frase aparece igual em vários
// modelos, o que pode ser texto reaproveitado; na SRK 600 bate certo com o manual, o que
// lhe dá crédito. Confirma sempre a gama antes de assumir que um modelo existe cá.
//
// O QUE FUNCIONA para o bloco chinês: o MANUAL DO PROPRIETÁRIO em PDF. É documento OEM
// e traz o capítulo de afinação adjuster a adjuster. Já resolveu 10 motos.
// Melhor fonte encontrada: qjmotor-russia.com/inctructions — o importador russo publica
// 22 manuais em PDF (Google Drive), text-based, com tabelas de afinação e valores de
// fábrica. Muito melhor que o manualslib, onde as páginas são imagem e não dá para ler.
// Atenção: o manual de OFICINA (ficheiros "sm-*") não serve — não tem o capítulo de
// afinação. E alguns manuais QJ descrevem duas configurações de hardware sem dizer qual
// é a do modelo; só servem se as duas configurações tiverem os mesmos afinadores (foi o
// caso do SRK 600). Um capítulo em falta costuma ser informação: no SRT 800 X e no SRK
// 900 o índice salta a afinação da frente, e isso significa forquilha sem afinadores.
// MAS não é regra: no SRT 900 SX o manual russo também salta esse capítulo e a ficha
// oficial portuguesa diz que a moto tem Marzocchi 43 mm totalmente ajustável à frente.
// Ausência de capítulo é prova fraca — quando houver ficha do importador que contrarie,
// ganha a ficha do mercado onde a app é usada.
//
// Os manuais trazem ainda os valores de fábrica por carga (solo / com malas / 2 pessoas),
// que é material para perfil MFZ com dataQuality 'oem_manual'. Já está tudo introduzido:
// as três Voge (900 DSX, 800 DSX Rally, 625 DSX) com weightPoints, e as QJ SRK 600, 800,
// 900, 921, SRT 450 RX e SRT 900 SX com valor único. Não há valores por transcrever.

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
  /**
   * Fora do seletor de motos, mas NÃO apagada.
   * Usa-se quando não há forma de confirmar os afinadores em fonte oficial: mais vale
   * não oferecer a moto do que oferecer números inventados pela heurística.
   * Continua a resolver por id (`getOemBikeById`), para não partir setups e entradas de
   * diário de quem já a tinha escolhida. Tira-se o `hidden` assim que houver manual.
   */
  hidden?: boolean;
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
  { id: "aprilia-tuareg",    brand: "Aprilia", model: "Tuareg 660",    cc: "659cc",  category: "adventure", adj: "full",mfzProfileId: "aprilia_tuareg660_2021" },
  { id: "macbor-montana-xr5", brand: "Macbor", model: "Montana XR5", cc: "498cc", category: "adventure", adj: "full",mfzProfileId: "macbor_xr5" },
  { id: "aprilia-rsv4",      brand: "Aprilia", model: "RSV4",          cc: "1099cc", category: "sport",     adj: "full",mfzProfileId: "aprilia_rsv4_1100_2021" },
  { id: "aprilia-tuono-v4",  brand: "Aprilia", model: "Tuono V4",      cc: "1077cc", category: "naked",     adj: "full",mfzProfileId: "aprilia_tuono_v4_1100_rr" },
  // RS 660 / Tuono 660 base: KYB 41 mm com precarga + extensão (sem compressão) e monoamortecedor
  // precarga + extensão. Só a Tuono 660 Factory (Sachs) ganha compressão — não está no catálogo.
  { id: "aprilia-rs660",     brand: "Aprilia", model: "RS 660",        cc: "659cc",  category: "midsport",  adj: "full", adjusters: { fPre: true, fComp: false, fReb: true, rPre: true, rComp: false, rReb: true }, mfzProfileId: "aprilia_rs660_2020" },
  { id: "aprilia-tuono-660", brand: "Aprilia", model: "Tuono 660",     cc: "659cc",  category: "naked",     adj: "full", adjusters: { fPre: true, fComp: false, fReb: true, rPre: true, rComp: false, rReb: true }, mfzProfileId: "aprilia_tuono660_2021" },

  // ===== BMW =====
  { id: "bmw-r1300-gs-adv",  brand: "BMW", model: "R 1300 GS Adventure",  cc: "1300cc", category: "adventure",     adj: "full",mfzProfileId: "bmw_r1300gsa_dsa" }, // Dynamic ESA electronic
  // R 1300 GS (2024+): EVO-Telelever sem ajuste; atrás WAD só "spring preload fully
  // adjustable" — a BMW não lista extensão. DSA (eletrónica) é opcional. bmwmotorcycles.com
  { id: "bmw-r1300-gs",      brand: "BMW", model: "R 1300 GS (2024+)",     cc: "1300cc", category: "adventure",     adj: "full", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: false } },
  // R 1250 GS / RT sem ESA: Telelever à frente NÃO tem qualquer ajuste externo.
  // Atrás, manípulo de precarga + manípulo de extensão. (Com ESA é tudo eletrónico.)
  { id: "bmw-1250-gs",       brand: "BMW", model: "R 1250 GS (2019-2023)", cc: "1254cc", category: "adventure",     adj: "full", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: true } },
  { id: "bmw-r1200gs-lc",    brand: "BMW", model: "R 1200 GS (2013-2018)", cc: "1170cc", category: "adventure",     adj: "full", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: true }, mfzProfileId: "bmw_r1200gs_lc_2013" },
  { id: "bmw-r1250-rt",      brand: "BMW", model: "R 1250 RT (2019-2024)", cc: "1254cc", category: "sport_touring", adj: "full", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: true } },
  // F 900 GS (2024+): forquilha 43 mm precarga+comp+ext; atrás precarga hidráulica +
  // extensão (sem compressão). bmwmotorcycles.com
  { id: "bmw-f900-gs",       brand: "BMW", model: "F 900 GS (2024+)",      cc: "895cc",  category: "adventure",     adj: "full", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  // F 900 XR (2020+): a BMW lista a forquilha 43 mm SEM qualquer ajuste; atrás precarga
  // hidráulica + extensão. Dynamic ESA é opcional. bmwmotorcycles.com
  { id: "bmw-f900-xr",       brand: "BMW", model: "F 900 XR (2020+)",      cc: "895cc",  category: "sport_touring", adj: "full", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: true } },
  // S 1000 RR / S 1000 R / M 1000 RR: forquilha invertida 45 mm com precarga + compressão +
  // extensão; atrás full floater pro com compressão + extensão + precarga. Full nas duas
  // pontas — confirmado nos manuais do condutor oficiais (0E21, 0E51, 0E71), que dão os
  // seis afinadores e os valores de fábrica. A precarga é prescrita em sag, não em voltas.
  { id: "bmw-s1000rr",       brand: "BMW", model: "S 1000 RR",             cc: "999cc",  category: "sport",         adj: "full", mfzProfileId: "bmw_s1000rr_2019", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: true, rReb: true } },
  { id: "bmw-s1000r",        brand: "BMW", model: "S 1000 R",              cc: "999cc",  category: "naked",         adj: "full", mfzProfileId: "bmw_s1000r_2021",  adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: true, rReb: true } },
  { id: "bmw-m1000rr",       brand: "BMW", model: "M 1000 RR",             cc: "999cc",  category: "sport",         adj: "full", mfzProfileId: "bmw_m1000rr_2021", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: true, rReb: true } },

  // ===== CF Moto =====
  // 800MT Sport/Explore: KYB fully adjustable front (preload+compression+rebound), rear (preload+rebound)
  { id: "cfmoto-800mt-sport",   brand: "CF Moto", model: "800 MT Sport",   cc: "799cc", category: "adventure", adj: "full",    mfzProfileId: "cfmoto_800mt"  },
  { id: "cfmoto-800mt-explore", brand: "CF Moto", model: "800 MT Explore", cc: "799cc", category: "adventure", adj: "full",    mfzProfileId: "cfmoto_800mt"  },
  // 700MT: front rebound only (fixed compression & preload), rear preload+rebound
  { id: "cfmoto-700mt",         brand: "CF Moto", model: "700 MT",         cc: "693cc", category: "adventure", adj: "partial",mfzProfileId: "cfmoto_700mt"  },
  // 450MT: KYB fully adjustable confirmed (preload+compression+rebound both ends)
  { id: "cfmoto-450mt",         brand: "CF Moto", model: "450 MT",         cc: "449cc", category: "adventure", adj: "full",    mfzProfileId: "cfmoto_450mt"  },
  { id: "cfmoto-800nk",         brand: "CF Moto", model: "800 NK",         cc: "799cc", category: "naked",     adj: "partial",mfzProfileId: "cfmoto_800nk"  },
  { id: "cfmoto-1000srr",       brand: "CF Moto", model: "1000 SR-R",      cc: "998cc", category: "sport",     adj: "partial", hidden: true },
  { id: "cfmoto-800mtx", brand: "CF Moto", model: "800 MT-X", cc: "799cc", category: "adventure", adj: "full",mfzProfileId: "cfmoto_800mtx" },
  { id: "cfmoto-1000mtx", brand: "CF Moto", model: "1000 MT-X", cc: "947cc", category: "adventure", adj: "full",mfzProfileId: "cfmoto_1000mtx" },

  // ===== Ducati =====
  // V4 Rally: Skyhook EVO — comp/ext e precarga eletrónicas nas duas pontas, sem clickers
  // manuais (ducati.com). Usa o perfil Skyhook, que já cobre "S / Rally" e traz a nota
  // explicativa traduzida (count.ducati_multi_v4_skyhook) em vez de 6 células vazias.
  { id: "ducati-multi-v4-rally",  brand: "Ducati", model: "Multistrada V4 Rally",  cc: "1158cc", category: "adventure", adj: "full",    mfzProfileId: "ducati_multi_v4_rally_dss" },
  // V4 base: forquilha Ø50 MECÂNICA totalmente ajustável (comp+ext manuais) + monoamortecedor
  // totalmente ajustável c/ precarga remota. Não é Skyhook — essa é a S. ducati.com
  { id: "ducati-multi-v4",        brand: "Ducati", model: "Multistrada V4",         cc: "1158cc", category: "adventure", adj: "full",    mfzProfileId: "ducati_multi_v4_marzocchi" },
  // V4 S: Skyhook eletrónica (comp/ext/precarga no ecrã)
  // V4 RS e Pikes Peak: versoes de roda 17" a frente, ao contrario da V4/V4 S (19").
  // Suspensao Ohlins semiativa — sem cliques, so modos no painel.
  { id: "ducati-multi-v4-rs",   brand: "Ducati", model: "Multistrada V4 RS (2026)",         cc: "1158cc", category: "adventure", adj: "full",mfzProfileId: "ducati_multi_v4_ohlins_smartec" },
  { id: "ducati-multi-v4-pp",   brand: "Ducati", model: "Multistrada V4 Pikes Peak (2026)", cc: "1158cc", category: "adventure", adj: "full",mfzProfileId: "ducati_multi_v4_ohlins_smartec" },
  { id: "ducati-multi-v4-s",      brand: "Ducati", model: "Multistrada V4 S",       cc: "1158cc", category: "adventure", adj: "full",    mfzProfileId: "ducati_multi_v4_skyhook" },
  // Multistrada V2 (2025+): forquilha mecânica Ø45 totalmente ajustável + monoamortecedor
  // totalmente ajustável c/ precarga remota. (A versão S é Skyhook eletrónica.) ducati.com
  { id: "ducati-multi-v2s-travel", brand: "Ducati", model: "Multistrada V2 S Travel (2026)", cc: "890cc", category: "adventure", adj: "full",mfzProfileId: "ducati_multi_v2s_dss_evo" },
  { id: "ducati-multi-v2",        brand: "Ducati", model: "Multistrada V2 (2025+)", cc: "890cc",  category: "adventure", adj: "full",    mfzProfileId: "ducati_multi_v2_marzocchi" },
  // DesertX V2 (2026+): KYB 46 totalmente ajustável + KYB traseiro totalmente ajustável
  { id: "ducati-desertx-937", brand: "Ducati", model: "DesertX (2022-2025)", cc: "937cc", category: "adventure", adj: "full",mfzProfileId: "ducati_desertx_kayaba" },
  { id: "ducati-desertx",         brand: "Ducati", model: "DesertX V2 (2026+)",     cc: "890cc",  category: "adventure", adj: "full"    },
  // DesertX Rally: KYB 48 closed cartridge — a Ducati lista SÓ compressão e extensão à
  // frente, sem precarga. Atrás fully adjustable (HSC/LSC + ext) + precarga remota.
  { id: "ducati-desertx-rally",   brand: "Ducati", model: "DesertX Rally",          cc: "937cc",  category: "adventure", adj: "full", adjusters: { fPre: false, fComp: true, fReb: true, rPre: true, rComp: true, rReb: true } },
  { id: "ducati-sf-v4",           brand: "Ducati", model: "Streetfighter V4",       cc: "1103cc", category: "naked",     adj: "full",    mfzProfileId: "ducati_sf_v4_showa" },
  // Panigale V4 base (não-S): "Fully adjustable Showa BPF fork, 43 mm" à frente e
  // "Fully adjustable Sachs unit" atrás — full nas duas pontas, default correto.
  // (A V4 S é que leva Öhlins NPX/TTX36 S-EC 3.0 eletrónica.) ducati.com tech spec
  { id: "ducati-pani-v4",         brand: "Ducati", model: "Panigale V4",            cc: "1103cc", category: "sport",     adj: "full",    mfzProfileId: "ducati_panigale_v4_showa" },
  // Monster 937: Marzocchi front non-adjustable; rear Sachs preload+rebound only
  { id: "ducati-monster",         brand: "Ducati", model: "Monster",                cc: "937cc",  category: "naked",     adj: "partial", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: true } },
  // Hypermotard 950 base: Marzocchi Ø45 totalmente ajustável à frente; Sachs atrás só com
  // precarga + extensão (sem compressão). A versão SP com Öhlins é que é full atrás. ducati.com
  { id: "ducati-hyper-950",       brand: "Ducati", model: "Hypermotard 950",        cc: "937cc",  category: "supermoto", adj: "full", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  { id: "ducati-hyper-698",       brand: "Ducati", model: "Hypermotard 698 Mono",   cc: "659cc",  category: "supermoto", adj: "full",    mfzProfileId: "ducati_hyper698_marzocchi" },

  // ===== Honda =====
  { id: "honda-africa-as",   brand: "Honda", model: "Africa Twin Adventure Sports", cc: "1084cc", category: "adventure", adj: "full",  mfzProfileId: "honda_at_1100l_advsports_eera" }, // Showa EERA electronic
  { id: "honda-africa",      brand: "Honda", model: "Africa Twin",                  cc: "1084cc", category: "adventure", adj: "full",  mfzProfileId: "honda_at_1100l_2020_manual" },
  { id: "honda-africa-dct",  brand: "Honda", model: "Africa Twin DCT",              cc: "1084cc", category: "adventure", adj: "full",  mfzProfileId: "honda_at_1100l_2020_dct" },
  // Transalp XL750: Showa SFF front + Showa rear — preload only both ends, no rebound/compression
  { id: "honda-transalp",      brand: "Honda", model: "XL750 Transalp (2023-2024)", cc: "755cc",  category: "adventure", adj: "fixed",mfzProfileId: "honda_transalp_2023" },
  { id: "honda-transalp-2025", brand: "Honda", model: "XL750 Transalp (2025)",      cc: "755cc",  category: "adventure", adj: "fixed",mfzProfileId: "honda_transalp_2025" },
  { id: "honda-transalp-2026", brand: "Honda", model: "XL750 Transalp (2026+)",     cc: "755cc",  category: "adventure", adj: "full",  mfzProfileId: "honda_transalp_2026" },
  // NC750X: front non-adjustable, rear preload ring only
  { id: "honda-nc750x",      brand: "Honda", model: "NC750X",                       cc: "745cc",  category: "adventure", adj: "fixed"   },
  { id: "honda-xadv",        brand: "Honda", model: "X-ADV",                        cc: "745cc",  category: "adventure", adj: "fixed"   },
  // Fireblade (2024+): manual oficial CBR1000RR-R Fireblade SP 2025. Öhlins Smart EC —
  // "the system continually adjusts compression and rebound damping levels according to
  // the riding situation. You can adjust the front and rear suspension preload manually."
  // Ou seja: compressão e extensão são ELETRÓNICAS nas duas pontas (não há clicker), e
  // só a precarga é manual, à frente e atrás. A geração anterior (Showa BPF) era
  // mecânica e totalmente ajustável — daí o ano no nome.
  { id: "honda-fireblade",   brand: "Honda", model: "CBR1000RR-R Fireblade (2024+)", cc: "999cc",  category: "sport",     adj: "full", adjusters: { fPre: true, fComp: false, fReb: false, rPre: true, rComp: false, rReb: false } },
  // CB1000R: front compression only, rear preload+rebound (no front rebound, no rear compression)
  { id: "honda-nt1100",      brand: "Honda", model: "NT1100",                        cc: "1084cc", category: "sport_touring", adj: "partial",mfzProfileId: "honda_nt1100_2022" },
  // CB1000R: Showa SFF-BP front (preload+comp+reb, damping numa perna); Showa rear preload+rebound
  { id: "honda-cb1000r",     brand: "Honda", model: "CB1000R",                      cc: "998cc",  category: "naked",     adj: "partial", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  // CB650R 2021+: Showa SFF-BP fully adjustable
  // CB650R: Showa SFF-BP só com precarga à frente (sem extensão nem compressão);
  // monoamortecedor só precarga (10 posições). Não é "full".
  // CB750 Hornet: manual 3PMLB600 (PT). O capitulo de afinacao so cobre a traseira —
  // precarga por anel de 7 posicoes, a 4 de fabrica. Forquilha Showa SFF-BP sem
  // afinadores externos.
  { id: "honda-cb750-hornet", brand: "Honda", model: "CB750 Hornet (2023+)", cc: "755cc", category: "naked", adj: "fixed",mfzProfileId: "honda_cb750_hornet_2023" },
  { id: "honda-cb650r",      brand: "Honda", model: "CB650R",                       cc: "649cc",  category: "naked",     adj: "full",    adjusters: { fPre: true, fComp: false, fReb: false, rPre: true, rComp: false, rReb: false } },

  // ===== Kawasaki =====
  { id: "kawasaki-versys-1000", brand: "Kawasaki", model: "Versys 1000 SE",  cc: "1043cc", category: "adventure",     adj: "full",    mfzProfileId: "kawasaki_versys1000se_kecs" }, // KECS Skyhook electronic
  // Versys 650: front preload+rebound, rear preload+rebound — no compression either end
  // Versys 650 (KLE650J): manual do proprietário PT 99824-0018, pág. 1192-1193 e 1231.
  // À frente, precarga no topo da bengala ESQUERDA e extensão no topo da DIREITA, sem
  // compressão. Atrás só precarga, por afinador no suporte do poisa-pés traseiro direito:
  // a subsecção de extensão do amortecedor, na mesma página, é titulada «(KLZ1100A/B,
  // ZX1100H)» e NÃO inclui a KLE650J. Os valores standard vivem em figuras e não saem por
  // extração de texto, por isso ficam só os afinadores.
  { id: "kawasaki-versys-650",  brand: "Kawasaki", model: "Versys 650",      cc: "649cc",  category: "adventure",     adj: "partial", adjusters: { fPre: true, fComp: false, fReb: true, rPre: true, rComp: false, rReb: false } },
  // Ninja 1000SX: frente precarga+comp+ext; atrás precarga remota + extensão (sem compressão)
  { id: "kawasaki-1000sx",      brand: "Kawasaki", model: "Ninja 1000SX",    cc: "1043cc", category: "sport_touring", adj: "full",    adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  // Geração anterior (ZX1000WH/WJ): traseiro 190/50, não 190/55. Manual de oficina lido.
  { id: "kawasaki-1000-2017",   brand: "Kawasaki", model: "Ninja 1000 / Z1000SX (2017-2019)", cc: "1043cc", category: "sport_touring", adj: "full",mfzProfileId: "kawasaki_ninja1000_2017", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  // ZX-10R: Balance Free Fork invertida Ø43 com compressão + extensão + precarga; atrás
  // BFRC lite com compressão + extensão + precarga. Full nas duas pontas. Confirmado no
  // manual de oficina 2021-2023 (pág. 13-6), que dá os seis valores de fábrica.
  { id: "kawasaki-zx10r",       brand: "Kawasaki", model: "Ninja ZX-10R",    cc: "998cc",  category: "sport",         adj: "full",   mfzProfileId: "kawasaki_zx10r_2021", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: true, rReb: true } },
  // Z900 standard: KYB front preload+rebound, rear preload+rebound — no compression either end
  { id: "kawasaki-z900",        brand: "Kawasaki", model: "Z900",            cc: "948cc",  category: "naked",         adj: "partial",mfzProfileId: "kawasaki_z900_2017", adjusters: { fPre: true, fComp: false, fReb: true, rPre: true, rComp: false, rReb: true } },
  // Z H2 (base, não-SE): frente SFF-BP com compressão + extensão + precarga; atrás
  // Uni-Trak só com EXTENSÃO + precarga — a Kawasaki não lista compressão traseira.
  // (A Z H2 SE é que tem KECS eletrónica.) kawasaki.eu
  { id: "kawasaki-zh2",         brand: "Kawasaki", model: "Z H2 (2020+)",    cc: "998cc",  category: "naked",         adj: "full",    adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },

  // ===== Kove =====
  { id: "kove-800x-pro",   brand: "Kove", model: "800X Pro",  cc: "799cc", category: "adventure", adj: "full",mfzProfileId: "kove_800x_pro_2026"    },
  { id: "kove-800x",       brand: "Kove", model: "800X",      cc: "799cc", category: "adventure", adj: "full",mfzProfileId: "kove_800x_standard"    },
  { id: "kove-800-rally",  brand: "Kove", model: "800 Rally", cc: "799cc", category: "adventure", adj: "full",mfzProfileId: "kove_800x_rally"       },
  { id: "kove-450-rally",  brand: "Kove", model: "450 Rally", cc: "443cc", category: "adventure", adj: "full",mfzProfileId: "kove_450rally_regular" },
  { id: "kove-450-rally-factory", brand: "Kove", model: "450 Rally Factory", cc: "443cc", category: "adventure", adj: "full",mfzProfileId: "kove_450rally_factory" },
  { id: "kove-800x-e5",      brand: "Kove", model: "800X E5",      cc: "799cc", category: "adventure", adj: "full",mfzProfileId: "kove_800x_e5"      },
  { id: "kove-800x-touring", brand: "Kove", model: "800X Touring", cc: "799cc", category: "adventure", adj: "full",mfzProfileId: "kove_800x_touring" },

  // ===== KTM =====
  { id: "ktm-1290-sadv",     brand: "KTM", model: "1290 Super Adventure S", cc: "1301cc", category: "adventure", adj: "full",    mfzProfileId: "ktm_1290_sadv_s_electronic" }, // semi-active electronic
  { id: "ktm-1290-sadv-r",   brand: "KTM", model: "1290 Super Adventure R", cc: "1301cc", category: "adventure", adj: "full",    mfzProfileId: "ktm_1290_adv_r_2021" },
  { id: "ktm-1190-adv-r",   brand: "KTM", model: "1190 Adventure R",       cc: "1195cc", category: "adventure", adj: "full",    mfzProfileId: "ktm_1190_adv_r_2013" },
  { id: "ktm-890-adv-r",     brand: "KTM", model: "890 Adventure R",        cc: "889cc",  category: "adventure", adj: "full",    mfzProfileId: "ktm_890_adv_r_2021"  },
  { id: "ktm-790-adv-r",     brand: "KTM", model: "790 Adventure R",        cc: "799cc",  category: "adventure", adj: "full",    mfzProfileId: "ktm_790_adv_r_2019" },
  { id: "ktm-790-adv",       brand: "KTM", model: "790 Adventure (2025+)",    cc: "799cc",  category: "adventure", adj: "full",    mfzProfileId: "ktm_790_adv_std_2025" },
  // 890 Adventure (non-R): WP APEX 43 with preload+rebound both ends, no compression
  // 890 Adventure (não-R): o capítulo «Tuning the chassis» do manual (art. 3214267en,
  // 2021) tem só duas entradas, as duas do amortecedor — extensão e precarga. A forquilha
  // WP APEX de 43 mm não tem afinadores externos. Não confundir com a 890 Adventure R,
  // que tem perfil próprio e é totalmente ajustável.
  { id: "ktm-890-adv",       brand: "KTM", model: "890 Adventure",          cc: "889cc",  category: "adventure", adj: "partial", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: true } },
  // 390 Adventure: WP non-adjustable front + rear preload cam only
  // 390 Adventure: estava em `fixed`, o que fazia a app mostrar só precarga traseira. É o
  // contrário: o cap. 12 do manual (art. 3214794en) dá compressão (afinador BRANCO, bainha
  // esquerda) e extensão (VERMELHO, direita) à frente, e a forquilha NÃO tem precarga.
  { id: "ktm-390-adv",       brand: "KTM", model: "390 Adventure",          cc: "399cc",  category: "adventure", adj: "fixed",   mfzProfileId: "ktm_390_adv_2023", adjusters: { fPre: false, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  // 390 Adventure R (2025+): WP APEX open cartridge 43 comp+reb (30 clicks), sem precarga à frente;
  // WP APEX split piston atrás com precarga por anel + rebound (20 clicks), sem compressão. ktm.com specs
  { id: "ktm-390-adv-r",     brand: "KTM", model: "390 Adventure R (2025+)", cc: "399cc",  category: "adventure", adj: "partial",mfzProfileId: "ktm_390_adv_r_2025" },
  // 390 Enduro R (2025+): mesma base WP APEX 43 / split piston, 230 mm curso. ktm.com specs
  { id: "ktm-390-enduro-r",  brand: "KTM", model: "390 Enduro R (2025+)",   cc: "399cc",  category: "adventure", adj: "partial",mfzProfileId: "ktm_390_enduro_r_2025" },
  // 1290 Super Duke R: manual oficial KTM 2021 (art. 3214331en). WP APEX totalmente
  // ajustável nas duas pontas — precarga por parafuso nas duas pernas à frente (ao
  // contrário da 890 Duke R, que é split e não tem), e atrás precarga por manípulo,
  // extensão e compressão separada em baixa e alta velocidade.
  { id: "ktm-1290-sdr",      brand: "KTM", model: "1290 Super Duke R (2020-2023)", cc: "1301cc", category: "naked", adj: "full",mfzProfileId: "ktm_1290_sdr_2021" },
  // 890 Duke R: manual oficial KTM 2022 (art. 3214544en). Forquilha WP APEX 43 split —
  // compressão na perna esquerda, extensão na direita, SEM precarga à frente. Atrás
  // precarga + extensão + compressão separada em baixa e alta velocidade.
  { id: "ktm-890-duke-r",    brand: "KTM", model: "890 Duke R (2020-2023)", cc: "889cc",  category: "naked",     adj: "full",    mfzProfileId: "ktm_890_duke_r_2022" },
  // 790 Duke: WP APEX preload+rebound both ends, no compression
  // 790 Duke: o capítulo «Tuning the chassis» do manual (art. 3213925en, 2019) tem UMA
  // única entrada — «12.1 Adjusting the spring preload of the shock absorber». A WP APEX
  // de 43 mm é de cartucho aberto sem afinadores externos e o amortecedor só tem precarga.
  // O default de `partial` estava a oferecer quatro afinadores que a moto não tem.
  { id: "ktm-790-duke",      brand: "KTM", model: "790 Duke",               cc: "799cc",  category: "naked",     adj: "partial", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: false } },
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
  // SRT 800 X: manual do utilizador QJMOTOR SRT800/SRT800X (documento OEM). Só existe
  // capítulo "Rear shock absorber" — o índice salta de "Tool Kit" para "Rear shock
  // absorber", não há qualquer secção de afinação da frente. Atrás: botão de extensão
  // no fundo do amortecedor + duas porcas de precarga na mola. Sem compressão atrás.
  { id: "qj-srt800x",   brand: "QJ Motor", model: "SRT 800 X",  cc: "778cc", category: "adventure",     adj: "partial", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: true } },
  // Era "SRT 750 SX / 744cc", que não corresponde a nenhuma moto vendida em Portugal —
  // a QJ cá tem SRT 600SX, 700X, 700 ON, 900SX e 900S, não há 750 nenhum. Corrigido para
  // a SRT 700X, que é a adventure média real da gama. qjmotor.pt: "Forquilha invertida
  // 43 mm multi-regulável em pré-carga, compressão e extensão. Traseira:
  // mono-amortecedor multi-regulável em pré-carga e extensão."
  // O id fica como estava para não partir setups nem diário de quem já o tinha escolhido.
  { id: "qj-srt750sx",  brand: "QJ Motor", model: "SRT 700X", cc: "698cc", category: "adventure", adj: "full", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  // SRK921: Marzocchi fully adjustable (2026 spec confirmed)
  // SRK 921 (MY2026): manual do proprietário QJMOTOR (RU). É a mais completa do
  // catálogo QJ — frente com precarga (chave 14 mm, limite 10, fábrica 3,5), compressão
  // à esquerda (4,75, fábrica 1,5) e extensão à direita (4,75, fábrica 2,5); atrás
  // precarga (chave de gancho, mola L 165 mm ±5) + extensão + compressão SEPARADA em
  // baixa e alta velocidade (12 cliques cada). Default "full" correto.
  { id: "qj-srk921",    brand: "QJ Motor", model: "SRK 921",    cc: "921cc", category: "naked",         adj: "full",   mfzProfileId: "qj_srk921" },
  // SRK 600: manual do proprietário QJMOTOR (RU). O manual dá duas configurações de
  // forquilha, mas AMBAS têm os três afinadores — precarga (chave sextavada) +
  // compressão (perna esquerda) + extensão (perna direita). Atrás: extensão por botão
  // no fundo (26 posições, fábrica 10) + precarga por duas bainhas. Sem compressão atrás.
  { id: "qj-srk600",    brand: "QJ Motor", model: "SRK 600",    cc: "598cc", category: "naked",         adj: "partial",mfzProfileId: "qj_srk600" },
  // SRK 800: manual do proprietário QJMOTOR (RU). Frente completa — precarga (chave de
  // 14 mm, limite 10 voltas, fábrica 5), compressão à esquerda (limite 4,75, fábrica 1)
  // e extensão à direita (limite 4,75, fábrica 3,25). Atrás precarga hidráulica (curso
  // 10 mm, fábrica 0) + extensão (fábrica 7 voltas do duro). Sem compressão atrás.
  { id: "qj-srk800",   brand: "QJ Motor", model: "SRK 800",    cc: "778cc", category: "naked",     adj: "full",mfzProfileId: "qj_srk800" },
  // SRK 900: manual do proprietário QJMOTOR (RU). Só tem capítulo "Задний амортизатор"
  // (amortecedor traseiro) — não há qualquer secção de afinação da frente, nem no índice.
  // Atrás extensão (fábrica 9 voltas a partir do mais duro) + precarga por anel com
  // chave de gancho. Sem compressão atrás. Estava como "full" — não é.
  { id: "qj-srk900",   brand: "QJ Motor", model: "SRK 900",    cc: "900cc", category: "naked",     adj: "full",mfzProfileId: "qj_srk900" },
  // SRT 450 RX: manual do proprietário QJMOTOR, confirmado em DUAS edições independentes
  // (grega e russa MY2026) que dão exatamente os mesmos números. À frente só
  // amortecimento, um por perna: compressão na esquerda (limite 4 voltas, fábrica 1,5)
  // e extensão na direita (limite 4 voltas, fábrica 2,5) — SEM precarga. Atrás só
  // precarga, por porca de aperto + porca de ajuste (folga 3 a 8 mm) — sem amortecimento.
  // Contagem: fechar tudo no sentido horário (duro) e abrir anti-horário — 'tu_hard'.
  { id: "qj-srt450rx", brand: "QJ Motor", model: "SRT 450 RX", cc: "449cc", category: "adventure", adj: "full",mfzProfileId: "qj_srt450rx" },
  // SRT 900 SX: manual do proprietário QJMOTOR SRT 900 S/SX, confirmado em DUAS edições
  // (russa e inglesa). Como a SRK 900, só tem capítulo do amortecedor traseiro — nada de
  // afinação à frente, nem no índice. Atrás extensão (fábrica 10 voltas do mais duro na
  // SX; 5 na S) + precarga por colar da mola. Sem compressão atrás. Estava como "full".
  // SRT 900 SX: DUAS FONTES EM CONFLITO na frente, resolvido a favor do mercado PT.
  //   qjmotor.pt (importador oficial, modelo 2025): "Forquilha invertida Marzocchi de
  //   43 mm, multi-regulável em pré-carga, compressão e extensão. Traseira:
  //   mono-amortecedor multi-regulável em pré-carga e extensão."
  //   Manual do proprietário russo SRT 900 S/SX: NÃO tem capítulo de afinação da frente.
  // O traseiro bate certo nos dois (precarga + extensão, sem compressão); só a frente
  // diverge. A QJ avisa no site global que as specs variam por região, por isso o mais
  // provável é serem variantes de mercado diferentes. Como a app é para Portugal, manda
  // a qjmotor.pt. Por isso NÃO usa o perfil MFZ qj_srt900sx — os valores desse perfil
  // vieram do manual russo e podem ser de outro hardware.
  // Cautela: a frase da qjmotor.pt aparece igual na SRK 600 e na SRT 700X, o que cheira
  // a texto de marketing reaproveitado. A favor dela: na SRK 600 bate certo com o manual.
  { id: "qj-srt900sx", brand: "QJ Motor", model: "SRT 900 SX", cc: "904cc", category: "adventure", adj: "full", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  // SRT 600 SX (2024+): garfo Marzocchi 43mm invertido totalmente ajustável
  // (pré-carga, compressão e ressalto, 145mm de curso); atrás monoshock com
  // pré-carga remota e ressalto, sem compressão → "partial".
  { id: "qj-srt600sx", brand: "QJ Motor", model: "SRT 600 SX", cc: "554cc", category: "adventure", adj: "partial", hidden: true },

  // ===== Suzuki =====
  { id: "suzuki-vstrom-1050de", brand: "Suzuki", model: "V-Strom 1050 DE",  cc: "1037cc", category: "adventure", adj: "full",  mfzProfileId: "suzuki_vstrom_1050de" },
  { id: "suzuki-vstrom-800de",  brand: "Suzuki", model: "V-Strom 800 DE",   cc: "776cc",  category: "adventure", adj: "full",  mfzProfileId: "suzuki_vstrom_800de"  },
  // V-Strom 650 XT: front non-adjustable, rear preload only
  // V-Strom 650 XT (2017+): frente sem qualquer ajuste externo; atrás precarga + extensão
  { id: "suzuki-vstrom-650",    brand: "Suzuki", model: "V-Strom 650 XT",   cc: "645cc",  category: "adventure", adj: "fixed",   adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: true } },
  // GSX-S1000 (2015-2020): manual do proprietário Suzuki (o mesmo cobre a F/FA). Frente
  // KYB com precarga por posições (2,5 de 5 de fábrica), compressão e extensão 8 cliques
  // cada a abrir do duro. Atrás precarga por anel de 7 posições (4 de fábrica na versão
  // sem carenagem, 3 na F/FA) e extensão 1 volta — SEM compressão traseira.
  { id: "suzuki-gsxs1000",      brand: "Suzuki", model: "GSX-S1000 (2015-2020)", cc: "999cc",  category: "naked",     adj: "full",    mfzProfileId: "suzuki_gsxs1000_2015" },
  // GSX-R1000R (2017+): manual do proprietário Suzuki 99011-17K57-01A, que cobre a base
  // e a R. Showa BFF à frente com os afinadores de amortecimento EM BAIXO (precarga 7,75
  // voltas do mole, compressão 3 e extensão 2,5 do duro) e BFRC-lite atrás com os dois
  // afinadores no topo (compressão 2,75, extensão 3). Full nas duas pontas.
  { id: "suzuki-gsxr1000",      brand: "Suzuki", model: "GSX-R1000R (2017+)", cc: "999cc",  category: "sport",     adj: "full",    mfzProfileId: "suzuki_gsxr1000r_2017" },
  // DR-Z4S (2025+): confirmado no manual do proprietário (M5). A forquilha KYB não tem
  // precarga — regula-se por pressão de ar, de fábrica a 0 kPa. A precarga traseira existe
  // (anel roscado) mas a Suzuki manda ao concessionário. Compressão traseira separada em
  // alta e baixa velocidade, por isso `rComp` fica a false: quem mexe é o perfil.
  { id: "suzuki-drz4s",         brand: "Suzuki", model: "DR-Z4S (2025+)",     cc: "398cc",  category: "adventure", adj: "full",    mfzProfileId: "suzuki_drz4s_2025" },
  // DR-Z4SM: mesma base, supermoto de 17". Perfil separado de proposito — o manual da
  // valores diferentes para as duas, e a compressao da frente muda de cliques para voltas.
  { id: "suzuki-drz4sm",        brand: "Suzuki", model: "DR-Z4SM (2025+)",    cc: "398cc",  category: "supermoto", adj: "full",    mfzProfileId: "suzuki_drz4sm_2025" },

  // ===== Triumph =====
  { id: "triumph-tiger-1200",       brand: "Triumph", model: "Tiger 1200 Rally Pro",  cc: "1160cc", category: "adventure",     adj: "full",    mfzProfileId: "triumph_tiger1200_showa" }, // Showa semi-active
  { id: "triumph-tiger-900-rally",  brand: "Triumph", model: "Tiger 900 Rally Pro",   cc: "888cc",  category: "adventure",     adj: "full",    mfzProfileId: "triumph_tiger900_rally_pro" },
  // Tiger 900 GT: Showa preload+rebound, no compression
  { id: "triumph-tiger-900-gt",     brand: "Triumph", model: "Tiger 900 GT",          cc: "888cc",  category: "adventure",     adj: "partial", mfzProfileId: "triumph_tiger900_gt" },
  // Tiger Sport 660: Showa front preload only + rear preload only — no rebound/compression at all
  { id: "triumph-tiger-sport-660",  brand: "Triumph", model: "Tiger Sport 660",       cc: "660cc",  category: "sport_touring", adj: "fixed"   },
  // Street Triple RS: Showa 41 mm BPF com compressão + extensão + precarga; atrás Öhlins
  // STX40 com compressão e extensão — mas a PRÉ-CARGA TRASEIRA NÃO É REGULÁVEL, e não é
  // omissão: o Owner's Handbook põe-no em caixa de aviso (pág. 176). A ficha comercial
  // dizia "fully adjustable", que é o erro do costume. Manual lido.
  { id: "triumph-st-rs",            brand: "Triumph", model: "Street Triple RS",      cc: "765cc",  category: "naked",         adj: "full", mfzProfileId: "triumph_street_triple_rs", adjusters: { fPre: true, fComp: true, fReb: true, rPre: false, rComp: true, rReb: true } },
  // Speed Triple 1200 RS: Öhlins NIX30 Ø43 + Öhlins TTX36, ambos com precarga +
  // compressão + extensão MANUAIS. A Öhlins SmartEC (semi-ativa) é exclusiva da RR, não
  // desta RS — a dúvida anterior fica resolvida. triumphmotorcycles.com
  { id: "triumph-speed-1200",       brand: "Triumph", model: "Speed Triple 1200 RS",  cc: "1160cc", category: "naked",         adj: "full",    mfzProfileId: "triumph_speed1200rs" },
  // Scrambler 1200 XE: Marzocchi Ø45 "fully adjustable" à frente e duplo amortecedor
  // Marzocchi "fully adjustable" atrás (a XE, não a X, que é não-ajustável à frente).
  { id: "triumph-scrambler-1200",   brand: "Triumph", model: "Scrambler 1200 XE",    cc: "1200cc", category: "scrambler",     adj: "full",    mfzProfileId: "triumph_scrambler1200xe" },

  // ===== Voge =====
  // 900 DSX & 525 DSX: KYB fully adjustable confirmed
  // 900 DSX: manual do proprietário Voge (PT). Forquilha com precarga (comando 1),
  // extensão (comando 2, bainha esquerda) e compressão (comando 3, bainha direita).
  // Atrás o manual só descreve precarga (comando 1) + extensão (comando 2), mas a
  // compressão traseira EXISTE — parafuso rotativo no reservatório de gás separado
  // (garrafa dourada KYB). O manual é fraco (nem nomeia a KYB; a tabela de specs diz
  // só "Amortecedor central. Curso 63 mm") e omite-a. O manual do DS 625X, mesma
  // família de amortecedor, documenta esse afinador como "adjustor 3 (at position of
  // air bottle)". Portanto full nas duas pontas — default correto, sem `adjusters`.
  { id: "voge-900dsx",  brand: "Voge", model: "900 DSX", cc: "895cc", category: "adventure", adj: "full",   mfzProfileId: "voge_900dsx" },
  { id: "voge-650dsx",  brand: "Voge", model: "650 DSX", cc: "652cc", category: "adventure", adj: "partial", hidden: true },
  // 525 DSX (DS525X): manual do proprietário Voge. Só tem "Adjust the rear shock
  // absorber", e lá dentro só precarga da mola — nem amortecimento atrás, nem qualquer
  // secção de afinação da frente. É exatamente o default do nível "fixed", por isso não
  // precisa de `adjusters`. Estava como "full", o que era muito otimista.
  { id: "voge-525dsx",  brand: "Voge", model: "525 DSX", cc: "494cc", category: "adventure", adj: "fixed"   },
  { id: "voge-525r",    brand: "Voge", model: "525 R",   cc: "494cc", category: "naked",     adj: "partial", hidden: true },
  // 625 DSX (DS 625X): manual do proprietário Voge. Os seis afinadores existem —
  // frente precarga + extensão (bainha esq.) + compressão (bainha dta.); atrás precarga
  // + extensão + compressão (ajustador 3, no reservatório). Default "full" correto.
  { id: "voge-625dsx",       brand: "Voge", model: "625 DSX",      cc: "625cc", category: "adventure", adj: "full",mfzProfileId: "voge_625dsx" },
  // 800 DSX Rally: manual do proprietário Voge (EN). Os seis afinadores existem —
  // frente precarga (ajustador 1) + extensão (ajustador 2, topo, 10 posições) +
  // compressão (ajustador 3, base, 10 posições); atrás precarga + extensão +
  // compressão (ajustador 3, no reservatório de gás). Default "full" correto.
  { id: "voge-800dsx-rally", brand: "Voge", model: "800 DSX Rally", cc: "798cc", category: "adventure", adj: "full",mfzProfileId: "voge_800dsx_rally" },
  { id: "voge-r625",         brand: "Voge", model: "R625",          cc: "625cc", category: "naked",     adj: "full", hidden: true },
  // AC 525X: manual do proprietário Voge. Igual à 525 DSX — só "Adjustment of rear shock
  // absorber" com precarga da mola, sem amortecimento atrás e sem afinação à frente.
  { id: "voge-ac525x",       brand: "Voge", model: "AC 525X",       cc: "494cc", category: "scrambler", adj: "fixed"   },

  // ===== Yamaha =====
  { id: "yamaha-tenere-w",   brand: "Yamaha", model: "Ténéré 700 World Raid", cc: "689cc", category: "adventure",     adj: "full",    mfzProfileId: "yamaha_t700_world_raid_2026" }, // KYB fully adjustable (Ohlins is only the steering damper)
  // XT1200Z (2010-2020): manual do proprietário Yamaha. Frente com precarga por ranhura
  // (5,5 de 8), compressão 6 cliques e extensão 8, a abrir do duro. Atrás precarga por
  // manípulo de 6 posições (fábrica na 4) e extensão 10 cliques — SEM compressão atrás.
  // A XT1200ZE tem suspensão eletrónica e não é esta entrada.
  { id: "yamaha-xt1200z",    brand: "Yamaha", model: "XT1200Z Super Ténéré (2010-2020)", cc: "1199cc", category: "adventure", adj: "full",mfzProfileId: "yamaha_xt1200z_2010" },
  { id: "yamaha-xt1200ze",  brand: "Yamaha", model: "XT1200ZE Super Ténéré (2014-2020)", cc: "1199cc", category: "adventure", adj: "full",mfzProfileId: "yamaha_xt1200ze_2014" },
  // Ténéré 700 base: KYB preload+rebound both ends, no compression
  { id: "yamaha-tenere-2019", brand: "Yamaha", model: "Ténéré 700 (2019-2024)", cc: "689cc", category: "adventure", adj: "partial",mfzProfileId: "yamaha_t700_2019" },
  { id: "yamaha-tenere-2025", brand: "Yamaha", model: "Ténéré 700 (2025+)",      cc: "689cc", category: "adventure", adj: "full",    mfzProfileId: "yamaha_t700_2025" },
  // Tracer 9 GT+: suspensão semi-ativa KADS (KYB Actimatic). Compressão/extensão são
  // eletrónicas — não há clickers manuais. Só a precarga traseira é manual.
  { id: "yamaha-tracer9",    brand: "Yamaha", model: "Tracer 9 GT+",          cc: "890cc", category: "sport_touring", adj: "full",    adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: false } },
  // MT-10 (MTN1000G): KYB mecânica nas duas pontas, os seis afinadores confirmados no
  // manual do proprietário B67-28199-200. Atrás tem ainda compressão RÁPIDA e LENTA
  // separadas. Não confundir com a MT-10 SP (MTN1000D/DP), que é Öhlins ERS eletrónica.
  { id: "yamaha-mt10",       brand: "Yamaha", model: "MT-10",                 cc: "998cc", category: "naked",         adj: "full",    mfzProfileId: "yamaha_mt10_2016", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: true, rReb: true } },
  // MT-09: KYB front preload+rebound, rear preload+rebound — no compression either end
  // MT-09 (MTN890): à frente tem as três — precarga nas duas bengalas, extensão só na
  // DIREITA e compressão só na ESQUERDA. Atrás só precarga e extensão: o amortecedor não
  // tem compressão. O default de `partial` estava a esconder a compressão da frente.
  { id: "yamaha-mt09",       brand: "Yamaha", model: "MT-09",                 cc: "890cc", category: "naked",         adj: "partial", mfzProfileId: "yamaha_mt09_2021", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  // MT-07: KYB front non-adjustable, rear preload+rebound
  // MT-07: forquilha sem ajuste; amortecedor só precarga (came de 7 posições)
  { id: "yamaha-mt07",       brand: "Yamaha", model: "MT-07",                 cc: "689cc", category: "naked",         adj: "partial", adjusters: { fPre: false, fComp: false, fReb: false, rPre: true, rComp: false, rReb: false } },
  // XSR900: same platform as MT-09, preload+rebound both ends
  // XSR900 (2022+): KYB 41 mm totalmente ajustável à frente; atrás precarga + extensão
  { id: "yamaha-xsr900",     brand: "Yamaha", model: "XSR900",                cc: "890cc", category: "naked",         adj: "partial", adjusters: { fPre: true, fComp: true, fReb: true, rPre: true, rComp: false, rReb: true } },
  // YZF-R1 (2020+): manual oficial Yamaha (B3L). KYB totalmente ajustável nas duas
  // pontas — atrás com compressão separada em lenta e rápida. A R1M é que tem Öhlins
  // eletrónica; esta entrada é a R1 manual.
  { id: "yamaha-r1",         brand: "Yamaha", model: "YZF-R1 (2020+)",        cc: "998cc", category: "sport",         adj: "full",    mfzProfileId: "yamaha_r1_2020" },
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