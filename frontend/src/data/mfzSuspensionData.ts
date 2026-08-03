/**
 * mfzSuspensionData.ts
 * Factory suspension baseline data — sourced from mfzstudio.com/moto/
 * All values at BASE WEIGHT (baseKg) unless weightPoints is provided.
 *
 * COUNT DIRECTION GUIDE:
 *   'cl_hard' → Turn CW to fully hard (0), then count ACW out.
 *               Used by: Honda, KTM, Yamaha, Kove, Suzuki (damping)
 *   'cl_soft' → Turn ACW to fully soft (0), then count CW up.
 *               Used by: CFMOTO standard, Suzuki (preload)
 *   'tu_hard' → Same as cl_hard but in full turns (e.g. Honda rebound, KTM high-speed)
 *   'tu_soft' → Same as cl_soft but in full turns (e.g. KTM, Honda front preload)
 *   'mm'      → Physical spring gap in millimetres (KTM EXC, Yamaha T7 2025 fork distance)
 *   'pos'     → Named position / groove (e.g. Suzuki 1050DE "groove 4")
 *   'na'      → Not adjustable / not present on this model
 */

export type VType =
  | 'cl_hard'   // clicks from full CW hard
  | 'cl_soft'   // clicks from full ACW soft
  | 'tu_hard'   // turns from full CW hard
  | 'tu_soft'   // turns from full ACW soft
  | 'mm'        // millimetres
  | 'pos'       // named position
  | 'na';       // not applicable

export type DataQuality = 'oem_manual' | 'mfz_verified';


export interface SuspVal {
  v: number | null;
  type: VType;
  label?: string;   // used when type='pos' or 'na'
  /**
   * Token curto para a célula quando type='pos'. Sem isto a célula mostra só a palavra
   * genérica ("AJUSTA"), o que desperdiça informação que às vezes temos: o curso do
   * afinador ("1-10") ou a posição de fábrica numa escala ("2,5/5"). Mantém-se curto
   * porque a célula é estreita — a explicação vai no `label` e na countNote.
   */
  cell?: string;
}

export interface Axle {
  preload: SuspVal;
  comp: SuspVal;
  reb: SuspVal;
  hsComp?: SuspVal;  // high-speed compression (rally shocks)
  lsComp?: SuspVal;  // low-speed compression
}

/** Weight breakpoint for interpolation (CFMOTO multi-load data) */
export interface WeightPoint {
  kg: number;
  fPre?: number;
  fComp?: number;
  fReb?: number;
  rPre?: number;
  rComp?: number;
  rReb?: number;
  rHsComp?: number | string;
  rLsComp?: number;
}

export type AdjFormula =
  | 'cfmoto_interp'   // interpolate between weightPoints
  | 'ktm'             // delta/20 damping, delta/25 preload turns, delta/18 preload mm
  | 'yamaha'          // delta/20 damping, delta/15 rear preload clicks
  | 'honda'           // delta/20 damping, delta/25 preload turns
  | 'kove'            // delta/20 damping, no preload adjustment
  | 'suzuki';         // delta/20 damping, delta/20 preload

export interface MfzProfile {
  id: string;
  brand: string;
  model: string;
  year: string;
  baseKg: number;
  source: string;
  formula: AdjFormula;
  front: Axle;
  rear: Axle;
  weightPoints?: WeightPoint[];
  countNote?: string;
  notes?: string;
  dataQuality?: DataQuality;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const cl_h = (v: number): SuspVal => ({ v, type: 'cl_hard' });
const cl_s = (v: number): SuspVal => ({ v, type: 'cl_soft' });
const tu_h = (v: number): SuspVal => ({ v, type: 'tu_hard' });
const tu_s = (v: number): SuspVal => ({ v, type: 'tu_soft' });
const mm   = (v: number): SuspVal => ({ v, type: 'mm' });
const pos  = (label: string, cell?: string): SuspVal => ({ v: null, type: 'pos', label, cell });
const na   = (label = 'Not adjustable'): SuspVal => ({ v: null, type: 'na', label });

// ─────────────────────────────────────────────
// CFMOTO
// Counting: ACW to soft=0, then CW count up (cl_soft)
// Exception: 1000MT-X rear preload reversed (cl_hard)
// ─────────────────────────────────────────────
const CFMOTO: MfzProfile[] = [
  {
    id: 'cfmoto_800mtx',
    brand: 'CFMOTO', model: '800MT-X', year: '2022+',
    // VERIFICADO contra o Suspension Adjustment Chart oficial do 800MT-X
    // (o chart do MT-X tem coluna de compressão traseira, ao contrário do
    // 800MT/IBEX 800-S). As 4 linhas de carga batem certo valor a valor.
    // POR MODELAR: o chart tem uma 5.ª linha que NÃO é de peso —
    // "One person (75kg) + Continuous rough road" → trás 3/12/15, frente
    // 4/10/13. É um modo de terreno, não é interpolável por kg.
    baseKg: 75, source: 'CFMOTO 800MT-X Suspension Adjustment Chart (official)', formula: 'cfmoto_interp',
    dataQuality: 'oem_manual',
    countNote: 'ACW to fully soft (0), then CW count up. Manual gives damping as ±2 — treat as a starting range, not an exact click.',
    notes: 'Official chart also lists a 5th condition not modelled here: solo rider on continuous rough road → rear 3 circles / 12±2 comp / 15±2 reb, front 4 circles / 10±2 comp / 13±2 reb. Same weight as solo but firmer damping for sustained rough surfaces.',
    front: {
      preload: cl_s(4), comp: cl_s(10), reb: cl_s(10),
    },
    rear: {
      preload: cl_s(3), comp: cl_s(8), reb: cl_s(12),
    },
    weightPoints: [
      { kg: 75,  fPre: 4, fComp: 10, fReb: 10, rPre: 3,  rComp: 8,  rReb: 12 },
      { kg: 115, fPre: 4, fComp: 10, fReb: 10, rPre: 5,  rComp: 10, rReb: 15 },
      { kg: 150, fPre: 5, fComp: 13, fReb: 13, rPre: 6,  rComp: 12, rReb: 17 },
      { kg: 190, fPre: 6, fComp: 15, fReb: 15, rPre: 8,  rComp: 14, rReb: 19 },
    ],
  },
  {
    id: 'cfmoto_1000mtx',
    brand: 'CFMOTO', model: '1000MT-X', year: '2023+',
    baseKg: 75, source: 'mfzstudio.com/moto/cfmoto/', formula: 'cfmoto_interp',
    countNote: 'REVERSED vs other CFMOTO. Front preload in mm. Rear preload: CW to max (hard), then ACW count out — higher number = lighter setting.',
    front: {
      preload: mm(11.5), comp: cl_s(10), reb: cl_s(10),
    },
    rear: {
      // reversed: cl_hard direction — higher value = less preload (lighter setting)
      preload: { v: 12, type: 'cl_hard', label: 'Reversed counting — see note' },
      comp: cl_s(10), reb: cl_s(10),
    },
    weightPoints: [
      { kg: 75,  fPre: 11.5, fComp: 10, fReb: 10, rPre: 12, rComp: 10, rReb: 10 },
      { kg: 115, fPre: 9.5,  fComp: 10, fReb: 10, rPre: 10, rComp: 8,  rReb: 7  },
      { kg: 150, fPre: 8.5,  fComp: 7,  fReb: 7,  rPre: 8,  rComp: 6,  rReb: 5  },
      { kg: 190, fPre: 5.5,  fComp: 5,  fReb: 5,  rPre: 6,  rComp: 4,  rReb: 3  },
    ],
    notes: '1000MT-X front preload is in mm (adjust spring gap). Rear preload counting is OPPOSITE to other CFMOTO — higher stored value = lighter/less preload.',
  },
  {
    id: 'cfmoto_800mt',
    brand: 'CFMOTO', model: '800MT', year: '2022+',
    // VERIFICADO contra o manual oficial: CF MOTO 800MT Owner's Manual p.181
    // (chart idêntico no IBEX 800-S p.148). As 4 colunas do manual mapeiam
    // para 75 / 115 / 150 / 190 kg e batem certo valor a valor.
    // Nota: a frente é MESMO igual entre "só piloto" e "piloto + 3 malas".
    baseKg: 75, source: 'CFMOTO 800MT Owner\'s Manual p.181 (official)', formula: 'cfmoto_interp',
    dataQuality: 'oem_manual',
    countNote: 'ACW to fully soft (0), then CW count up. No rear compression adjuster. Manual gives damping as ±2 — treat as a starting range, not an exact click.',
    front: {
      preload: cl_s(4), comp: cl_s(10), reb: cl_s(10),
    },
    rear: {
      preload: cl_s(3), comp: na('No rear compression adjuster'), reb: cl_s(10),
    },
    weightPoints: [
      { kg: 75,  fPre: 4, fComp: 10, fReb: 10, rPre: 3, rReb: 10 },
      { kg: 115, fPre: 4, fComp: 10, fReb: 10, rPre: 5, rReb: 15 },
      { kg: 150, fPre: 5, fComp: 13, fReb: 13, rPre: 6, rReb: 17 },
      { kg: 190, fPre: 6, fComp: 15, fReb: 15, rPre: 7, rReb: 19 },
    ],
  },
  {
    id: 'cfmoto_800nk',
    brand: 'CFMOTO', model: '800NK', year: '2022+',
    baseKg: 75, source: 'mfzstudio.com/moto/cfmoto/', formula: 'cfmoto_interp',
    countNote: 'ACW to fully soft (0), then CW count up. No rear compression adjuster.',
    front: {
      preload: cl_s(4), comp: cl_s(10), reb: cl_s(10),
    },
    rear: {
      preload: cl_s(3), comp: na('No rear compression adjuster'), reb: cl_s(10),
    },
    weightPoints: [
      { kg: 75,  fPre: 4, fComp: 10, fReb: 10, rPre: 3, rReb: 10 },
      { kg: 150, fPre: 5, fComp: 13, fReb: 13, rPre: 6, rReb: 17 },
    ],
    notes: '115kg and 190kg data estimated by interpolation. Confirm with sag check.',
  },
  {
    id: 'cfmoto_700mt',
    brand: 'CFMOTO', model: '700MT', year: '2021+',
    baseKg: 75, source: 'mfzstudio.com/moto/cfmoto/', formula: 'cfmoto_interp',
    countNote: 'Rear rebound: CW to fully hard, ACW count out. Front compression: ACW soft → CW. Rear preload in turns (tu_soft). No rear compression adjuster.',
    front: {
      preload: na('No front preload adjuster'),
      comp: cl_s(10),
      reb: cl_s(10),
    },
    rear: {
      preload: tu_s(6),   // turns CW from soft
      comp: na('No rear compression adjuster'),
      reb: cl_h(7),       // REVERSED vs other CFMOTO — cl_hard
    },
    weightPoints: [
      { kg: 75,  fComp: 10, fReb: 10, rPre: 6,  rReb: 7 },
      { kg: 115, fComp: 10, fReb: 10, rPre: 9,  rReb: 4 },
      { kg: 150, fComp: 14, fReb: 14, rPre: 10, rReb: 3 },
      { kg: 190, fComp: 16, fReb: 16, rPre: 12, rReb: 1 },
    ],
    notes: 'Rear preload in turns (tu_soft). Rear rebound is cl_hard (opposite to front). No front preload or rear compression adjuster.',
  },
  {
    id: 'cfmoto_450mt',
    brand: 'CFMOTO', model: '450MT', year: '2023+',
    // Reconstruído do manual oficial (450MT Owner's Manual p.140, "Shock
    // Absorber Adjustment Suggestion Chart"). O manual define 4 cenários e
    // SÓ altera a pré-carga traseira: o amortecimento fica em 10 gears em
    // todos eles, à frente e atrás. Os valores anteriores (11/12/14) eram
    // estimativas, não constavam de nenhum manual.
    baseKg: 75, source: 'CFMOTO 450MT Owner\'s Manual p.140 (official)', formula: 'cfmoto_interp',
    dataQuality: 'oem_manual',
    countNote: 'Damping: S direction (anticlockwise) to the end, then H (clockwise) and count to 10 = factory. Rear preload: from factory setting (spring height 8 inch), turn the adjuster nut clockwise to add.',
    front: {
      preload: pos('Factory setting — screw sleeve convex 0.5 inch'),
      comp: cl_s(10),
      reb: cl_s(10),
    },
    rear: {
      preload: tu_s(0),
      comp: na('No rear compression adjuster'),
      reb: cl_s(10),
    },
    // kg 75  = "not equipped with three boxes"  → factory setting
    // kg 115 = "equipped with three boxes"      → +4 turns on the preload nut
    // (assento rebaixado usa +6 voltas; não modelado — ver notes)
    weightPoints: [
      { kg: 75,  fComp: 10, fReb: 10, rPre: 0, rReb: 10 },
      { kg: 115, fComp: 10, fReb: 10, rPre: 4, rReb: 10 },
    ],
    notes: 'Official chart: only the REAR PRELOAD changes with load — damping stays at 10 gears front and rear in every condition. Factory rear spring height is 8 inch; with three boxes (side + tail) add 4 turns on the preload nut, or 6 turns if the seat height has been lowered. IMPORTANT: CFMOTO states this shock suits ONE RIDER ONLY, and recommends staying below 75 mph / 120 km/h when carrying the three boxes. Confirm by sag; if you need lots of preload to reach target sag, fit a stiffer spring — preload does not replace spring rate.',
  },
];

// ─────────────────────────────────────────────
// HONDA
// Counting: CW to fully hard (0), then ACW count out (cl_hard)
// Preload: turns CW from fully soft (tu_soft)
// Transalp: damping NOT adjustable
// ─────────────────────────────────────────────
const HONDA: MfzProfile[] = [
  {
    id: 'honda_transalp_2023',
    brand: 'Honda', model: 'XL750 Transalp', year: '2023-2024',
    baseKg: 75, source: 'mfzstudio.com/moto/honda/', formula: 'cfmoto_interp',
    front: {
      preload: tu_s(7),
      comp:    na('Not adjustable on this model'),
      reb:     na('Not adjustable on this model'),
    },
    rear: {
      preload: tu_s(2),
      comp:    na('Not adjustable on this model'),
      reb:     na('Not adjustable on this model'),
    },
    weightPoints: [
      { kg: 75,  rPre: 2 },
      { kg: 95,  rPre: 3 },
      { kg: 120, rPre: 4 },
      { kg: 150, rPre: 5 },
      { kg: 190, rPre: 7 },
    ],
    notes: 'Transalp: damping not adjustable, only spring preload. Rear preload is a 7-position step adjuster (1=soft ... 7=hard); position estimated from load. Front preload only. Confirm by sag.',
  },
  {
    id: 'honda_transalp_2025',
    brand: 'Honda', model: 'XL750 Transalp', year: '2025',
    baseKg: 75, source: 'mfzstudio.com/moto/honda/', formula: 'cfmoto_interp',
    front: {
      preload: tu_s(6),
      comp:    na('Not adjustable on this model'),
      reb:     na('Not adjustable on this model'),
    },
    rear: {
      preload: tu_s(2),
      comp:    na('Not adjustable on this model'),
      reb:     na('Not adjustable on this model'),
    },
    weightPoints: [
      { kg: 75,  rPre: 2 },
      { kg: 95,  rPre: 3 },
      { kg: 120, rPre: 4 },
      { kg: 150, rPre: 5 },
      { kg: 190, rPre: 7 },
    ],
    notes: 'Transalp 2025: revised internal valving (firmer rear, softer front) but still preload-only. Rear preload is a 7-position step adjuster (1=soft ... 7=hard); position estimated from load. Confirm by sag.',
  },
  {
    id: 'honda_transalp_2026',
    brand: 'Honda', model: 'XL750 Transalp', year: '2026+',
    baseKg: 75, source: 'Honda XL750 owner manual (official)', formula: 'cfmoto_interp',
    front: {
      preload: tu_s(6),
      comp:    cl_h(11),
      reb:     tu_h(1),
    },
    rear: {
      preload: tu_s(2),
      comp:    tu_h(2.5),
      reb:     tu_h(1.25),
    },
    weightPoints: [
      { kg: 75,  rPre: 2 },
      { kg: 95,  rPre: 3 },
      { kg: 120, rPre: 4 },
      { kg: 150, rPre: 5 },
      { kg: 190, rPre: 7 },
    ],
    notes: 'Transalp 2026: fully adjustable (Showa SFF-CA). Factory-standard values from the official Honda owner manual. Front: preload 6 turns from soft, compression 11 clicks from hard (12-click range), rebound 1 turn from hard (3-turn range). Rear: preload position 2 of 7, compression 2.5 turns from hard, rebound 1.25 turns from hard. Rear preload scales with load. Confirm by sag.',
    dataQuality: 'oem_manual',
  },
  {
    id: 'honda_at_1000l_2016_manual',
    dataQuality: 'oem_manual',
    brand: 'Honda', model: 'Africa Twin CRF1000L Manual', year: '2016-2017',
    baseKg: 75, source: 'mfzstudio.com/moto/honda/', formula: 'honda',
    front: {
      preload: tu_s(5),
      comp:    cl_h(8),
      reb:     tu_h(2.25),
    },
    rear: {
      preload: cl_s(7),
      comp:    cl_h(14),
      reb:     cl_h(11),
    },
  },
  {
    id: 'honda_at_1000l_2016_dct',
    dataQuality: 'oem_manual',
    brand: 'Honda', model: 'Africa Twin CRF1000L DCT', year: '2016-2017',
    baseKg: 75, source: 'mfzstudio.com/moto/honda/', formula: 'honda',
    front: {
      preload: tu_s(8.5),
      comp:    cl_h(8),
      reb:     tu_h(2.25),
    },
    rear: {
      preload: cl_s(7),
      comp:    cl_h(14),
      reb:     cl_h(11),
    },
    notes: 'DCT version — heavier front preload due to DCT weight distribution.',
  },
  {
    id: 'honda_at_1000l_2018_manual',
    dataQuality: 'oem_manual',
    brand: 'Honda', model: 'Africa Twin CRF1000L Manual', year: '2018-2019',
    baseKg: 75, source: 'mfzstudio.com/moto/honda/', formula: 'honda',
    front: {
      preload: tu_s(5),
      comp:    cl_h(8),
      reb:     tu_h(2.25),
    },
    rear: {
      preload: cl_s(7),
      comp:    cl_h(14),
      reb:     cl_h(9),
    },
  },
  {
    id: 'honda_at_1000l_advsports_2018',
    dataQuality: 'oem_manual',
    brand: 'Honda', model: 'Africa Twin Adventure Sports Manual', year: '2018-2019',
    baseKg: 75, source: 'mfzstudio.com/moto/honda/', formula: 'honda',
    front: {
      preload: tu_s(5),
      comp:    cl_h(4),
      reb:     tu_h(2.25),
    },
    rear: {
      preload: cl_s(7),
      comp:    cl_h(19),
      reb:     cl_h(13),
    },
    notes: 'Adventure Sports — firmer rear compression, different front compression vs Standard.',
  },
  {
    id: 'honda_at_1100l_2020_manual',
    dataQuality: 'oem_manual',
    brand: 'Honda', model: 'Africa Twin CRF1100L Manual', year: '2020+',
    baseKg: 75, source: 'mfzstudio.com/moto/honda/', formula: 'honda',
    front: {
      preload: tu_s(3),
      comp:    cl_h(9),
      reb:     tu_h(2.75),
    },
    rear: {
      preload: cl_s(7),
      comp:    cl_h(12),
      reb:     cl_h(8),
    },
  },
  {
    id: 'honda_at_1100l_advsports_eera',
    brand: 'Honda', model: 'Africa Twin Adventure Sports (Showa EERA)', year: '2020+',
    baseKg: 75, source: 'Honda official specs', formula: 'honda',
    front: {
      preload: na('Electronic — EERA menu'),
      comp:    na('Electronic — EERA menu'),
      reb:     na('Electronic — EERA menu'),
    },
    rear: {
      preload: na('Electronic — EERA menu'),
      comp:    na('Electronic — EERA menu'),
      reb:     na('Electronic — EERA menu'),
    },
    notes: 'Showa EERA semi-active electronic suspension — no manual click adjusters. Everything is set via the screen/buttons. Damping modes: Hard / Mid / Soft / Off-Road / User. Electronic rear preload with load presets (Rider / Rider+luggage / 2-up / 2-up+luggage) plus a manual 24-step mode. Always confirm by sag.',
    dataQuality: 'oem_manual',
  },
  {
    id: 'honda_at_1100l_2020_dct',
    dataQuality: 'oem_manual',
    brand: 'Honda', model: 'Africa Twin CRF1100L DCT', year: '2020+',
    baseKg: 75, source: 'mfzstudio.com/moto/honda/', formula: 'honda',
    front: {
      preload: tu_s(6),
      comp:    cl_h(9),
      reb:     tu_h(2.75),
    },
    rear: {
      preload: cl_s(7),
      comp:    cl_h(12),
      reb:     cl_h(8),
    },
    notes: 'DCT version — heavier front preload vs Manual.',
  },
  {
    id: 'honda_nt1100_2022',
    brand: 'Honda', model: 'NT1100 (standard / manual)', year: '2022+',
    baseKg: 75,
    source: 'mfzstudio.com/moto/honda/',
    dataQuality: 'oem_manual',
    formula: 'honda',
    front: {
      preload: tu_s(3),
      comp:    na(),
      reb:     na(),
    },
    rear: {
      preload: cl_s(7),
      comp:    na(),
      reb:     tu_h(2),
    },
    notes: 'NT1100 standard/manual (2022+, unchanged on the 2025 update): front preload only (dial adjuster). Rear: preload (7 clicks from min) + stepless rebound. No compression adjusters. Note: a separate 2025+ NT1100 Electronic Suspension (Showa EERA) variant exists with no manual clicks.',
  },
];

// ─────────────────────────────────────────────
// KOVE
// Counting: CW to fully hard (0), then ACW count out (cl_hard)
// Preload: spring length / fork marking (pos/na)
// ─────────────────────────────────────────────
const KOVE: MfzProfile[] = [
  {
    id: 'kove_450rally_regular',
    brand: 'Kove', model: '450 Rally Regular', year: '2023+',
    baseKg: 75,
    source: 'Manual do proprietário Kove 450 Rally (EN), pág. 63-72',
    formula: 'kove',
    dataQuality: 'oem_manual',
    countNote: 'Tudo se conta a partir do MAIS DURO: aperta o afinador no sentido horário até ao fim e depois abre, contando os cliques. Cada clique é 1/4 de volta. A frente NÃO tem pré-carga de mola — o que se regula é a pressão de ar interna, e só para a purgar. A pré-carga de trás é por comprimento de mola, e cada volta do afinador vale 1,5 mm.',
    notes: 'Valores confirmados contra o manual, um a um. Margens: à frente compressão e retorno 22 posições cada; atrás, compressão de alta velocidade cerca de 4 voltas e de baixa 16 posições. A mola de trás vai de 215 a 230 mm na versão de selim alto e de 200 a 225 mm na de selim baixo — apertar encurta e endurece. CORREÇÃO (agosto 2026): a pré-carga da FRENTE mostrava o comprimento da mola TRASEIRA (215-230 mm), ou seja o valor do amortecedor aplicado à forquilha. O manual é claro: a secção da frente só tem pressão de ar, compressão e retorno — não há pré-carga de mola à frente.',
    front: {
      preload: na('A forquilha não tem pré-carga de mola — regula-se pela pressão de ar interna, que se purga pelo parafuso de escape'),
      comp:    cl_h(10),
      reb:     cl_h(10),
    },
    rear: {
      preload: pos('Comprimento da mola: versão de selim alto 215-230 mm, selim baixo 200-225 mm; cada volta do afinador vale 1,5 mm', '215-230 mm'),
      comp:    na('Usar as compressões de alta e de baixa velocidade'),
      reb:     cl_h(10),
      hsComp:  tu_h(2),
      lsComp:  cl_h(8),
    },
  },
  {
    id: 'kove_450rally_factory',
    brand: 'Kove', model: '450 Rally Factory', year: '2023+',
    baseKg: 75,
    source: 'Valores do manual do proprietário Kove 450 Rally (EN), pág. 63-72 — o manual é da versão de série, não da Factory',
    formula: 'kove',
    countNote: 'Tudo se conta a partir do MAIS DURO: aperta no sentido horário até ao fim e depois abre, contando os cliques. Cada clique é 1/4 de volta. A frente não tem pré-carga de mola — regula-se a pressão de ar interna. A pré-carga de trás é por comprimento de mola, 1,5 mm por volta.',
    notes: 'Os números vêm do manual da 450 Rally de série. A Factory leva suspensão de especificação mais alta e pode ter valores próprios — falta o manual dela. A correção da pré-carga da frente aplica-se na mesma: não há pré-carga de mola à frente, e o que lá estava era o comprimento da mola traseira.',
    front: {
      preload: na('A forquilha não tem pré-carga de mola — regula-se pela pressão de ar interna, que se purga pelo parafuso de escape'),
      comp:    cl_h(10),
      reb:     cl_h(10),
    },
    rear: {
      preload: pos('Comprimento da mola: versão de selim alto 215-230 mm, selim baixo 200-225 mm; cada volta do afinador vale 1,5 mm', '215-230 mm'),
      comp:    na('Usar as compressões de alta e de baixa velocidade'),
      reb:     cl_h(10),
      hsComp:  tu_h(2),
      lsComp:  cl_h(8),
    },
  },
  {
    id: 'kove_800x_standard',
    brand: 'Kove', model: '800X Standard', year: '2023+',
    baseKg: 75, source: 'mfzstudio.com/moto/kove/', formula: 'kove',
    front: {
      preload: pos('Fork marking — confirm with sag'),
      comp:    cl_h(18),
      reb:     cl_h(18),
    },
    rear: {
      preload: pos('Shock adjuster — confirm with sag'),
      comp:    cl_h(10),
      reb:     cl_h(10),
    },
    notes: 'NOTA (agosto 2026): não sabemos se esta versão leva a forquilha por pressão de ar das Rally, que não tem pré-carga de mola, ou a forquilha com pré-carga da Touring. Os três manuais Kove lidos mostram que as duas arquiteturas coexistem na gama. Falta o manual desta.',
  },
  {
    id: 'kove_800x_e5',
    brand: 'Kove', model: '800X E5', year: '2024+',
    baseKg: 75, source: 'mfzstudio.com/moto/kove/', formula: 'kove',
    front: {
      preload: pos('Fork marking — confirm with sag'),
      comp:    cl_h(18),
      reb:     cl_h(18),
    },
    rear: {
      preload: pos('Shock adjuster — confirm with sag'),
      comp:    cl_h(10),
      reb:     cl_h(10),
    },
    notes: 'NOTA (agosto 2026): não sabemos se esta versão leva a forquilha por pressão de ar das Rally, que não tem pré-carga de mola, ou a forquilha com pré-carga da Touring. Os três manuais Kove lidos mostram que as duas arquiteturas coexistem na gama. Falta o manual desta.',
  },
  {
    id: 'kove_800x_pro_2026',
    brand: 'Kove', model: '800X Pro', year: '2026+',
    baseKg: 75, source: 'mfzstudio.com/moto/kove/', formula: 'kove',
    front: {
      preload: pos('Fork marking — confirm with sag'),
      comp:    cl_h(12),   // different from other 800X variants
      reb:     cl_h(18),
    },
    rear: {
      preload: pos('Shock adjuster — confirm with sag'),
      comp:    cl_h(10),
      reb:     cl_h(10),
    },
    notes: 'Pro 2026 — front compression differs from Standard/E5 (12 vs 18 clicks). NOTA (agosto 2026): não sabemos se esta versão leva a forquilha por pressão de ar das Rally, que não tem pré-carga de mola, ou a forquilha com pré-carga da Touring. Os três manuais Kove lidos mostram que as duas arquiteturas coexistem na gama. Falta o manual desta.',
  },
  {
    id: 'kove_800x_touring',
    brand: 'Kove', model: '800X Touring', year: '2024+',
    baseKg: 75,
    source: 'Manual do proprietário Kove 800X Touring (EN, ed. 2026.03), pág. 66-70',
    formula: 'kove',
    dataQuality: 'oem_manual',
    countNote: 'Conta-se a partir do MAIS DURO, à frente e atrás: aperta no sentido horário até ao fim e abre contando os cliques. À frente os afinadores estão repartidos por bengala e vêm marcados no próprio amortecedor: COMP à DIREITA, TEN à ESQUERDA. A pré-carga da frente tem escalas gravadas nos dois lados, que têm de ficar iguais.',
    notes: 'Valores confirmados contra o manual, um a um: à frente 18 cliques de compressão e 18 de retorno, atrás 10 e 10. Margens: à frente 24±2 cliques em cada; atrás 20±2 na compressão e 23±2 no retorno.',
    front: {
      preload: pos('Fork marking — confirm with sag'),
      comp:    cl_h(18),
      reb:     cl_h(18),
    },
    rear: {
      preload: pos('Shock adjuster — confirm with sag'),
      comp:    cl_h(10),
      reb:     cl_h(10),
    },
  },
  {
    id: 'kove_800x_rally',
    brand: 'Kove', model: '800X Rally', year: '2024+',
    baseKg: 75,
    source: 'Manual do proprietário Kove 800X Rally (EN, ref. 2504), pág. 61-66',
    formula: 'kove',
    dataQuality: 'oem_manual',
    countNote: 'Conta-se a partir do MAIS DURO: aperta o afinador no sentido horário até ao fim e depois abre, contando as posições. À frente NÃO há pré-carga de mola — só pressão de ar, que se purga pelo parafuso de escape com a roda no ar. A pré-carga de trás é por comprimento de mola, 1,5 mm por volta do afinador.',
    notes: 'Valores confirmados contra o manual, um a um: à frente 18 posições de compressão e 8 de retorno, atrás 8 de retorno, 2 voltas de compressão de alta velocidade e 8 posições de baixa. Margens: à frente 22 posições em cada; atrás cerca de 4 voltas na alta e 16 posições na baixa. Repare-se que o retorno da frente (8) é mesmo diferente do das outras 800X (18) — não é gralha, está assim no manual.\n\nCORREÇÃO (agosto 2026): a pré-carga da frente dizia «Fork marking — confirm with sag». A forquilha desta moto não tem pré-carga de mola nenhuma; é a mesma arquitetura por pressão de ar da 450 Rally. A 800X Touring, essa, tem pré-carga a sério, com escalas gravadas — as duas famílias não se podem misturar.',
    front: {
      preload: na('A forquilha não tem pré-carga de mola — regula-se pela pressão de ar interna, que se purga pelo parafuso de escape'),
      comp:    cl_h(18),
      reb:     cl_h(8),   // different from other 800X
    },
    rear: {
      preload: pos('Comprimento da mola; cada volta do afinador vale 1,5 mm', 'mola'),
      comp:    na('Use high-speed + low-speed compression'),
      reb:     cl_h(8),
      hsComp:  tu_h(2),
      lsComp:  cl_h(8),
    },
  },
];

// ─────────────────────────────────────────────
// KTM
// Counting: CW to fully hard (0), then ACW count out (cl_hard / tu_hard)
// Preload: turns CW from fully soft (tu_soft) or mm
// ─────────────────────────────────────────────
const KTM: MfzProfile[] = [
  {
    id: 'ktm_1290_adv_r_2021',
    brand: 'KTM', model: '1290 Super Adventure R', year: '2021+',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: tu_s(0),
      comp:    cl_h(15),
      reb:     cl_h(15),
    },
    rear: {
      preload: { v: null, type: 'pos', label: 'Street: 5 turns / Offroad: 1 turn (from fully ACW soft)' },
      comp:    na(),
      reb:     cl_h(15),
      hsComp:  tu_h(1.5),
      lsComp:  cl_h(15),
    },
    notes: 'Rear preload has two baseline modes: Street (5 turns) and Offroad (1 turn). 1290 Super Adventure S uses semi-active suspension and is NOT included.',
  },
  {
    id: 'ktm_1290_sadv_s_electronic',
    brand: 'KTM', model: '1290 Super Adventure S', year: '2021+',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: na('Electronic — TFT menu'),
      comp:    na('Electronic — TFT menu'),
      reb:     na('Electronic — TFT menu'),
    },
    rear: {
      preload: na('Electronic — TFT menu'),
      comp:    na('Electronic — TFT menu'),
      reb:     na('Electronic — TFT menu'),
    },
    notes: 'WP APEX semi-active (SAT) electronic suspension — no manual click adjusters. Everything is set via the TFT screen and handlebar buttons. Damping modes: Comfort / Street / Sport (with Suspension Pro pack: Offroad / Auto / Advanced 1-8). Rear preload is electronic, 10 levels (0-100%), with load presets (solo / solo + luggage / 2-up / 2-up + luggage) and self-adjusts to weight. Always confirm by sag.',
  },
  {
    id: 'ktm_1190_adv_r_2013',
    brand: 'KTM', model: '1190 Adventure R', year: '2013-2016',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: tu_s(5),
      comp:    cl_h(12),
      reb:     cl_h(12),
    },
    rear: {
      preload: tu_s(4),
      comp:    na(),
      reb:     cl_h(10),
      hsComp:  tu_h(1.5),
      lsComp:  cl_h(10),
    },
    notes: '1190 Adventure with EDS (Electronic Damping System) is NOT included — manual click version only.',
  },
  {
    id: 'ktm_890_adv_r_2021',
    brand: 'KTM', model: '890 Adventure R', year: '2021-2024',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: pos('+0 factory baseline (external preload adjuster)'),
      comp:    cl_h(15),
      reb:     cl_h(15),
    },
    rear: {
      preload: tu_s(4),
      comp:    na(),
      reb:     cl_h(15),
      hsComp:  tu_h(1.5),
      lsComp:  cl_h(15),
    },
  },
  {
    id: 'ktm_790_adv_r_2019',
    brand: 'KTM', model: '790 Adventure R', year: '2019-2024',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: pos('+0 factory baseline (external preload adjuster)'),
      comp:    cl_h(15),
      reb:     cl_h(15),
    },
    rear: {
      preload: tu_s(4),
      comp:    na(),
      reb:     cl_h(15),
      hsComp:  tu_h(1.5),
      lsComp:  cl_h(15),
    },
  },
  {
    id: 'ktm_790_adv_std_2025',
    brand: 'KTM', model: '790 Adventure Standard', year: '2025+',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: na(),
      comp:    cl_h(15),
      reb:     cl_h(15),
    },
    rear: {
      preload: tu_s(4),
      comp:    na('Not adjustable / not listed'),
      reb:     cl_h(10),
    },
    notes: 'Front preload and rear compression not adjustable on this variant.',
  },
  {
    id: 'ktm_390_adv_r_2025',
    brand: 'KTM', model: '390 Adventure R', year: '2025+',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: na(),
      comp:    cl_h(15),
      reb:     cl_h(15),
    },
    rear: {
      preload: mm(8),
      comp:    na('Not adjustable / not listed'),
      reb:     cl_h(15),
    },
  },
  {
    id: 'ktm_390_enduro_r_2025',
    brand: 'KTM', model: '390 Enduro R', year: '2025+',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: na(),
      comp:    cl_h(10),
      reb:     cl_h(10),
    },
    rear: {
      preload: mm(7),
      comp:    na('Not adjustable / not listed'),
      reb:     cl_h(10),
    },
  },
  {
    id: 'ktm_exc_2t_2018',
    brand: 'KTM', model: '250/300 EXC 2-Stroke', year: '2018-2019',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: pos('Standard: not externally adjustable. Six Days / preload-adjuster models: +0 factory'),
      comp:    cl_h(15),
      reb:     cl_h(15),
    },
    rear: {
      preload: mm(8),
      comp:    na(),
      reb:     cl_h(15),
      hsComp:  tu_h(2),
      lsComp:  cl_h(15),
    },
  },
  {
    id: 'ktm_excf_4t_2018',
    brand: 'KTM', model: '250/350/450 EXC-F 4-Stroke', year: '2018-2019',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: pos('Standard: not externally adjustable. Six Days / preload-adjuster models: +0 factory'),
      comp:    cl_h(15),
      reb:     cl_h(15),
    },
    rear: {
      preload: mm(8),
      comp:    na(),
      reb:     cl_h(15),
      hsComp:  tu_h(2),
      lsComp:  cl_h(15),
    },
  },
  {
    id: 'ktm_exc_2t_2020',
    brand: 'KTM', model: '250/300 EXC 2-Stroke', year: '2020-2023',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: pos('Standard: not externally adjustable. Six Days / preload-adjuster models: +0 factory'),
      comp:    cl_h(15),
      reb:     cl_h(15),
    },
    rear: {
      preload: mm(10),
      comp:    na(),
      reb:     cl_h(15),
      hsComp:  tu_h(2),
      lsComp:  cl_h(15),
    },
  },
  {
    id: 'ktm_excf_4t_2020',
    brand: 'KTM', model: '250/350/450 EXC-F 4-Stroke', year: '2020-2023',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: pos('Standard: not externally adjustable. Six Days / preload-adjuster models: +0 factory'),
      comp:    cl_h(15),
      reb:     cl_h(15),
    },
    rear: {
      preload: mm(8),
      comp:    na(),
      reb:     cl_h(15),
      hsComp:  tu_h(2),
      lsComp:  cl_h(15),
    },
  },
  {
    id: 'ktm_exc_2t_2024',
    brand: 'KTM', model: '250/300 EXC 2-Stroke', year: '2024+',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: na('Spring setup — not externally click-adjustable'),
      comp:    cl_h(15),
      reb:     cl_h(17),
    },
    rear: {
      preload: mm(7),
      comp:    na(),
      reb:     cl_h(15),
      hsComp:  tu_h(2),
      lsComp:  cl_h(15),
    },
  },
  {
    id: 'ktm_excf_4t_2024',
    brand: 'KTM', model: '250/350/450 EXC-F 4-Stroke', year: '2024+',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: na('Spring setup — not externally click-adjustable'),
      comp:    cl_h(15),
      reb:     cl_h(17),
    },
    rear: {
      preload: mm(7),
      comp:    na(),
      reb:     cl_h(15),
      hsComp:  tu_h(2),
      lsComp:  cl_h(15),
    },
  },
  {
    id: 'ktm_690_enduro_2018',
    brand: 'KTM', model: '690 Enduro R', year: '2018',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: na('Not externally adjustable / not listed'),
      comp:    cl_h(15),
      reb:     cl_h(15),
    },
    rear: {
      preload: mm(20),
      comp:    na(),
      reb:     cl_h(15),
      hsComp:  tu_h(1.5),
      lsComp:  cl_h(15),
    },
  },
  {
    id: 'ktm_690_enduro_2019',
    brand: 'KTM', model: '690 Enduro R', year: '2019+',
    baseKg: 75, source: 'mfzstudio.com/moto/ktm/', formula: 'ktm',
    front: {
      preload: na('Not externally adjustable / not listed'),
      comp:    cl_h(15),
      reb:     cl_h(15),
    },
    rear: {
      preload: mm(18),
      comp:    na(),
      reb:     cl_h(20),
      hsComp:  tu_h(2),
      lsComp:  cl_h(20),
    },
  },
];

// ─────────────────────────────────────────────
// SUZUKI V-STROM
// Counting: CW to fully hard (0), then ACW count out (cl_hard / tu_hard)
// Rear preload: clicks CW from fully ACW soft (cl_soft)
// 1050DE front preload: groove/position system
// ─────────────────────────────────────────────
const SUZUKI: MfzProfile[] = [
  {
    id: 'suzuki_vstrom_1050de',
    brand: 'Suzuki', model: 'V-Strom 1050DE', year: '2022+',
    baseKg: 75, source: 'mfzstudio.com/moto/suzuki/', formula: 'cfmoto_interp',
    front: {
      preload: pos('Groove position (1=soft ... 7=hard)'),
      comp:    cl_h(8),
      reb:     cl_h(8),
    },
    rear: {
      preload: cl_s(11),
      comp:    na('KYB shock — compression not adjustable'),
      reb:     tu_h(1.25),
    },
    weightPoints: [
      { kg: 80,  fPre: 4, fComp: 8, fReb: 8, rPre: 11, rReb: 1.25 },
      { kg: 100, fPre: 5, fComp: 7, fReb: 7, rPre: 13, rReb: 1 },
      { kg: 155, fPre: 7, fComp: 4, fReb: 4, rPre: 16, rReb: 0.25 },
      { kg: 175, fPre: 7, fComp: 3, fReb: 3, rPre: 18, rReb: 0.25 },
    ],
    notes: 'Front preload is a stepped groove adjuster (positions 1-7, not clicks); position estimated from load. Damping counts turns/clicks OUT from fully hard. Rear shock (KYB) has no compression adjuster. Starting point — confirm by sag.',
  },
  {
    id: 'suzuki_vstrom_800de',
    brand: 'Suzuki', model: 'V-Strom 800DE', year: '2023+',
    baseKg: 75, source: 'mfzstudio.com/moto/suzuki/', formula: 'cfmoto_interp',
    front: {
      preload: tu_s(6),
      comp:    tu_h(1.5),
      reb:     tu_h(1.5),
    },
    rear: {
      preload: cl_s(12),
      comp:    tu_h(1.5),
      reb:     tu_h(1.75),
    },
    weightPoints: [
      { kg: 80,  fPre: 6,  fComp: 1.5,  fReb: 1.5,  rPre: 12, rComp: 1.5,  rReb: 1.75 },
      { kg: 100, fPre: 8,  fComp: 1.25, fReb: 1.25, rPre: 14, rComp: 1.25, rReb: 1.5 },
      { kg: 155, fPre: 11, fComp: 0.5,  fReb: 0.5,  rPre: 17, rComp: 0.5,  rReb: 0.75 },
      { kg: 175, fPre: 13, fComp: 0.25, fReb: 0.25, rPre: 19, rComp: 0.25, rReb: 0.5 },
    ],
    notes: 'Front preload in turns; rear preload in clicks. Damping counts turns OUT from fully hard (fewer turns = more damping). All six adjusters active. Starting point — confirm by sag.',
  },
  {
    id: 'suzuki_drz4s_2025',
    brand: 'Suzuki', model: 'DR-Z4S', year: '2025+',
    // Lido no manual do proprietário DR-Z4S/DR-Z4SM (edição M5). O manual cobre as duas
    // motos e dá valores diferentes para cada uma — estes são os da S. A SM tem 15/1,5
    // voltas à frente e 15/15 atrás, por isso não se pode reutilizar este perfil.
    baseKg: 75, source: 'Manual do proprietário Suzuki DR-Z4S/DR-Z4SM (M5), págs. 2-51 a 2-56',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'Todos os afinadores contam a partir do fim de curso no sentido dos ponteiros (duro) e abrem ao contrário. Curso total: frente 21 cliques de extensão e 19 de compressão; atrás 18 cliques na compressão de baixa velocidade.',
    notes: 'A forquilha KYB não tem precarga: regula-se pela pressão de ar interna, cujo valor de fábrica é 0 kPa (equilibrada com a atmosfera). A precarga traseira existe, por anel roscado, mas a Suzuki recomenda que seja o concessionário a mexer — precisa de ferramenta especial. O amortecedor tem compressão separada de alta e baixa velocidade.',
    front: {
      preload: na('Sem precarga — forquilha por pressão de ar, padrão 0 kPa'),
      comp:    cl_h(8),
      reb:     cl_h(13),
    },
    rear: {
      preload: pos('Anel roscado — a Suzuki recomenda ajuste em concessionário (ferramenta especial)', 'ANEL'),
      comp:    na('Usar compressão de alta e de baixa velocidade'),
      reb:     cl_h(14),
      hsComp:  tu_h(1),
      lsComp:  cl_h(10),
    },
  },
  {
    id: 'suzuki_drz4sm_2025',
    brand: 'Suzuki', model: 'DR-Z4SM', year: '2025+',
    // Mesma edição do manual que a DR-Z4S (M5), que cobre as duas. Onde o manual dá dois
    // valores, estes são os da SM. Repare-se na compressão da frente: na S conta-se em
    // CLIQUES, na SM em VOLTAS — não é o mesmo afinador com outro número.
    baseKg: 75, source: 'Manual do proprietário Suzuki DR-Z4S/DR-Z4SM (M5), págs. 2-51 a 2-56',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'Todos os afinadores contam a partir do fim de curso no sentido dos ponteiros (duro) e abrem ao contrário. Curso total: frente 21 cliques de extensão e 3 voltas de compressão (afinar de 1/8 em 1/8); atrás 18 cliques na compressão de baixa velocidade.',
    notes: 'A forquilha KYB não tem precarga: regula-se pela pressão de ar interna, cujo valor de fábrica é 0 kPa. A precarga traseira existe, por anel roscado, mas a Suzuki recomenda que seja o concessionário a mexer. Compressão traseira separada em alta e baixa velocidade. A SM leva câmaras de ar.',
    front: {
      preload: na('Sem precarga — forquilha por pressão de ar, padrão 0 kPa'),
      comp:    tu_h(1.5),
      reb:     cl_h(15),
    },
    rear: {
      preload: pos('Anel roscado — a Suzuki recomenda ajuste em concessionário (ferramenta especial)', 'ANEL'),
      comp:    na('Usar compressão de alta e de baixa velocidade'),
      reb:     cl_h(15),
      hsComp:  tu_h(1),
      lsComp:  cl_h(15),
    },
  },
];

// ─────────────────────────────────────────────
// YAMAHA TÉNÉRÉ 700
// Counting: CW to fully hard (0), then ACW count out (cl_hard)
// Rear preload: ACW to fully soft, then CW count up (cl_soft)
// 2019-2024 front preload: not adjustable
// 2025+ front preload: fork distance in mm (Distance A)
// ─────────────────────────────────────────────
const YAMAHA: MfzProfile[] = [
  {
    id: 'yamaha_t700_world_raid_2026',
    brand: 'Yamaha', model: 'Ténéré 700 World Raid', year: '2026+',
    baseKg: 75,
    source: 'Manual do proprietário Yamaha XTZ690D (oficial). O SENTIDO de contagem do amortecimento traseiro foi corrigido a partir do manual de oficina da T7 2025 (LIT-11616-38-67), que dá a convenção Yamaha explícita — ver nota',
    formula: 'yamaha',
    front: {
      preload: mm(19.0),
      comp:    cl_h(11),
      reb:     cl_h(18),
    },
    rear: {
      preload: cl_s(10),
      comp:    cl_h(14),
      reb:     cl_h(11),
    },
    countNote: 'Conta-se a partir do MAIS DURO, à frente e atrás, com o afinador todo apertado no sentido que aumenta o amortecimento. A pré-carga de trás é a exceção: aí o 0 é o mais solto e a de série são 10 cliques a apertar. A pré-carga da frente mede-se pela distância A, onde um número maior é mais mole.',
    notes: 'Ténéré 700 World Raid (XTZ690D), KYB totalmente ajustável, forquilha de 46 mm com Kashima. Valores de fábrica do manual oficial. Margens em Soft / STD / Hard: à frente pré-carga 19,0 / 19,0 / 4,0 mm, compressão 19 / 11 / 0 cliques e retorno 23 / 18 / 0; atrás pré-carga 0 / 10 / 24 cliques, compressão 21 / 14 / 0 e retorno 21 / 11 / 0. As duas bengalas têm de ficar iguais.\n\nCORREÇÃO (agosto 2026): esta entrada tinha o retorno e a compressão TRASEIROS marcados como contados desde o mais solto, com a nota a dizer «0 = soft, 21 = hard». Estava invertido — era uma leitura trocada da tabela, onde o 21 é a coluna Soft e o 0 é a coluna Hard. O manual de oficina da T7 2025 (LIT-11616-38-67, pág. 3-22 e 3-23) diz explicitamente que a posição de partida é «com o afinador todo rodado na direção a», e que a direção a é a que endurece. A frente desta mesma entrada já estava certa, o que confirma que era engano e não uma diferença real entre eixos. Os números não mudaram, só o sentido da contagem.',
    dataQuality: 'oem_manual',
  },
  {
    id: 'yamaha_t700_2019',
    brand: 'Yamaha', model: 'Ténéré 700', year: '2019-2024',
    baseKg: 75, source: 'mfzstudio.com/moto/yamaha/', formula: 'yamaha',
    front: {
      preload: na('Not adjustable on this model'),
      comp:    cl_h(11),
      reb:     cl_h(17),
    },
    rear: {
      preload: cl_s(10),
      comp:    cl_h(15),
      reb:     cl_h(13),
    },
    notes: 'Front preload not adjustable. Yamaha manual does not officially state exact rider weight; 75kg is used as estimated base.',
  },
  {
    id: 'yamaha_t700_2025',
    brand: 'Yamaha', model: 'Ténéré 700', year: '2025+',
    baseKg: 75,
    source: 'Manual de oficina Yamaha Ténéré 700 2025 (XTZ7S/XTZ7SC), LIT-11616-38-67 / BRL-28197-10, pág. 2-7 e 3-20 a 3-23',
    formula: 'yamaha',
    dataQuality: 'oem_manual',
    front: {
      preload: mm(19.0),   // Distance A = 19.0mm
      comp:    cl_h(11),
      reb:     cl_h(18),
    },
    rear: {
      preload: cl_s(10),
      comp:    cl_h(14),
      reb:     cl_h(11),
    },
    countNote: 'O manual dá os valores em cliques «a partir da posição de partida», e diz explicitamente que essa posição é com o afinador todo rodado no sentido "a" — o que aumenta o amortecimento. Ou seja, conta-se a partir do MAIS DURO, à frente e atrás. A pré-carga de trás é a exceção: aí o 0 é o mais solto, e a de série são 10 cliques a apertar. A pré-carga da frente mede-se pela distância A, e ao contrário do que parece um número MAIOR é mais MOLE.',
    notes: 'Novidade de 2025: a forquilha ganhou regulação de pré-carga, que a de 2019-2024 não tinha. As duas bengalas têm de ficar iguais. Margens do manual, em Soft / STD / Hard: à frente pré-carga 19,0 / 19,0 / 4,0 mm, retorno 23 / 18 / 0 cliques e compressão 19 / 11 / 0; atrás pré-carga 0 / 10 / 24 cliques, retorno 21 / 11 / 0 e compressão 21 / 14 / 0. O manual avisa que ao apertar até ao fim o clique 0 e o 1 podem coincidir, e que para além do fim aberto ainda dá cliques mas já não fazem nada.',
  },
];

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
const BMW: MfzProfile[] = [
  {
    id: 'bmw_r1300gsa_dsa',
    brand: 'BMW', model: 'R 1300 GS Adventure', year: '2024+',
    baseKg: 75, source: 'Manufacturer official specs', formula: 'honda',
    front: {
      preload: na('Electronic — menu'),
      comp:    na('Electronic — menu'),
      reb:     na('Electronic — menu'),
    },
    rear: {
      preload: na('Electronic — menu'),
      comp:    na('Electronic — menu'),
      reb:     na('Electronic — menu'),
    },
    notes: 'BMW Dynamic ESA / DSA semi-active electronic suspension — standard, no manual click version. Set via menu: ride modes with automatic damping and spring rate, load compensation. Electronic preload (solo / 2-up / luggage). Confirm by sag.',
    dataQuality: 'oem_manual',
  },
];

const DUCATI: MfzProfile[] = [
  {
    id: 'ducati_multi_v4_skyhook',
    brand: 'Ducati', model: 'Multistrada V4 (S / Rally)', year: '2021+',
    baseKg: 75, source: 'Manufacturer official specs', formula: 'honda',
    front: {
      preload: na('Electronic — menu'),
      comp:    na('Electronic — menu'),
      reb:     na('Electronic — menu'),
    },
    rear: {
      preload: na('Electronic — menu'),
      comp:    na('Electronic — menu'),
      reb:     na('Electronic — menu'),
    },
    notes: 'Multistrada V4 S / Rally: Marzocchi Ducati Skyhook (DSS Evolution) semi-active electronic suspension — no manual click adjusters. Compression, rebound and preload set on the screen, integrated in the Riding Modes (Auto mode). The base V4 (non-S) has manual suspension. Confirm by sag.',
    dataQuality: 'oem_manual',
  },
  {
    id: 'ducati_multi_v4_marzocchi',
    brand: 'Ducati', model: 'Multistrada V4', year: '2021+',
    baseKg: 75,
    source: 'Manual do proprietário Ducati Multistrada V4 (EN, 25 ED02), pág. 239',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'À frente conta-se em VOLTAS a partir do mais duro, com o regulador todo fechado; atrás conta-se em CLIQUES, também a partir do mais duro. A pré-carga da frente são 5 voltas a apertar desde a posição toda solta, e a de trás mede-se em milímetros desde a mola toda solta.',
    notes: 'Este perfil é o da Multistrada V4 DE SÉRIE, com Marzocchi mecânico nas duas pontas — forquilha invertida de 50 mm com 170 mm de curso, amortecedor progressivo com 180 mm de curso na roda. A V4 S leva Skyhook eletrónico e tem perfil próprio. Atenção ao ler o manual: a mesma página de especificações descreve a forquilha como «fully manually adjustable» e logo a seguir diz «fully electronic hydraulic damping adjustment» — é a página a cobrir as duas versões ao mesmo tempo. Os números de afinação que lá estão são os mecânicos, ou seja, os da V4 de série.',
    front: {
      preload: tu_s(5),
      comp:    tu_h(2),
      reb:     tu_h(2),
    },
    rear: {
      preload: mm(19),
      comp:    cl_h(5),
      reb:     cl_h(12),
    },
  },
  {
    id: 'ducati_hyper698_marzocchi',
    brand: 'Ducati', model: 'Hypermotard 698 Mono', year: '2024+',
    baseKg: 85,
    source: 'Manual do proprietário Ducati Hypermotard 698 Mono (EN, 26 ED01), pág. 50-54 — tabelas de afinação da frente e de trás',
    formula: 'cfmoto_interp',
    dataQuality: 'oem_manual',
    countNote: 'À frente, a compressão e o retorno contam-se em VOLTAS desde o mais duro (regulador todo no sentido horário); a pré-carga é ao contrário, voltas a apertar desde toda solta, e cada volta vale 1 mm. Atrás, compressão e retorno também em voltas desde o mais duro, mas a pré-carga mede-se em milímetros desde a mola toda solta.',
    notes: 'Marzocchi de 45 mm à frente, com os reguladores repartidos: a compressão só na bengala ESQUERDA e o retorno só na DIREITA; a pré-carga está nas duas e tem de ficar igual. Atenção à base de peso: este manual é o único até agora que diz para que piloto foram calculados os valores — 80 a 90 kg vestido, por isso o perfil está a 85 kg e não aos 75 habituais. O manual dá quatro colunas: Road Comfort (a de série), Road Sport (frente 5 / 2,25 / 1,5; trás 14 mm / 1,5 / 2,25), Track (frente 5 / 1 / 1; trás 14 mm / 0,5 / 1,5) e Road com passageiro, que é a que está no ponto dos 160 kg. Margens: frente pré-carga 10 voltas, compressão e retorno 4 voltas; trás pré-carga 4 a 24 mm, compressão 3 voltas, retorno 4 voltas.',
    front: {
      preload: tu_s(5),
      comp:    { ...tu_h(3.5), label: 'Só a bengala esquerda tem regulador de compressão' },
      reb:     tu_h(2),
    },
    rear: {
      preload: mm(14),
      comp:    tu_h(2),
      reb:     tu_h(2.75),
    },
    weightPoints: [
      { kg: 85,  fPre: 5, fComp: 3.5, fReb: 2, rPre: 14, rComp: 2, rReb: 2.75 },
      { kg: 160, fPre: 8, fComp: 3.5, fReb: 2, rPre: 17, rComp: 2, rReb: 2 },
    ],
  },
  {
    id: 'ducati_multi_v2_marzocchi',
    brand: 'Ducati', model: 'Multistrada V2', year: '2025+',
    baseKg: 75,
    source: 'Manual do proprietário Ducati Multistrada V2 (EN, 26 ED04), pág. 62-63',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'Conta-se sempre a partir do mais duro, com o regulador todo fechado no sentido horário, tanto à frente como atrás. As exceções são as pré-cargas: à frente são 5 voltas a apertar desde toda solta, com cada volta a valer 1 mm; atrás a de série é 0, ou seja, o manípulo remoto todo solto.',
    notes: 'Marzocchi nas duas pontas, forquilha invertida de 45 mm, 170 mm de curso à frente e atrás. Os reguladores da frente estão repartidos: compressão na bengala ESQUERDA, retorno na DIREITA, pré-carga nas duas e tem de ficar igual. O amortecedor tem pré-carga por manípulo remoto. O manual dá tolerância de ±1/4 de volta em todos os valores de amortecimento. Margens: à frente compressão e retorno 4 voltas e pré-carga 10 mm. Atenção: este perfil é o da V2 de série, com Marzocchi mecânico — a V2 S Travel leva DSS eletrónico e tem perfil próprio.',
    front: {
      preload: tu_s(5),
      comp:    { ...tu_h(3), label: 'Só a bengala esquerda tem regulador de compressão' },
      reb:     { ...tu_h(1.5), label: 'Só a bengala direita tem regulador de retorno' },
    },
    rear: {
      preload: cl_s(0),
      comp:    tu_h(1.75),
      reb:     tu_h(0.75),
    },
  },
  {
    id: 'ducati_panigale_v4_showa',
    brand: 'Ducati', model: 'Panigale V4', year: '2025+',
    baseKg: 75,
    source: 'Manual do proprietário Ducati Panigale V4 (EN, 26 ED02), pág. 51-53',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'Conta-se em VOLTAS a partir do mais duro, com o regulador todo fechado no sentido horário, à frente e atrás. A pré-carga da frente é a exceção: 4 voltas a apertar desde toda aberta. A pré-carga de trás mede-se em milímetros desde a mola toda solta.',
    notes: 'Showa BPF invertida de 43 mm à frente, Sachs atrás, com amortecedor de direção Sachs. Margens: à frente compressão até 8,5 voltas, retorno até 6,25 e pré-carga de 3 a 18 mm (15 voltas); atrás compressão até 2,75 voltas, retorno até 3,25 e pré-carga de 8 a 18 mm. O manual dá cinco afinações por modo, e a de série coincide com Sport e Road. As de pista: Race A (frente 2,5 / 2 / 13 mm; trás 2,5 / 2,5 / 15 mm) e Race B (frente 3,5 / 3 / 13 mm). Wet abre a frente para 7 / 5,5 / 7 mm.',
    front: {
      preload: { ...tu_s(4), label: '4 voltas desde toda aberta, o equivalente a 7 mm' },
      comp:    tu_h(6),
      reb:     tu_h(4),
    },
    rear: {
      preload: mm(8),
      comp:    tu_h(1.5),
      reb:     tu_h(1.5),
    },
  },
  {
    id: 'ducati_sf_v4_showa',
    brand: 'Ducati', model: 'Streetfighter V4', year: '2025+',
    baseKg: 75,
    source: 'Manual do proprietário Ducati Streetfighter V4 (EN, 26 ED04), pág. 44-45',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'Conta-se em VOLTAS a partir do mais duro, com o regulador todo fechado no sentido horário, à frente e atrás. A pré-carga da frente é a exceção: 5 voltas a apertar desde toda aberta. A pré-carga de trás mede-se em milímetros desde a mola toda solta.',
    notes: 'Showa BPF invertida de 43 mm à frente, Sachs atrás. Margens: à frente compressão até 7 voltas, retorno até 5,5 e pré-carga de 1 a 15 mm (15 voltas); atrás compressão até 2,75 voltas, retorno até 3,25 e pré-carga de 8 a 18 mm. O manual dá também uma afinação Racing: à frente 1 volta de compressão, 1,5 de retorno e 8 voltas de pré-carga; atrás 0,5 / 0,5 e 14 mm. O manual diz que a afinação de série é a melhor solução para uso desportivo em estrada.',
    front: {
      preload: tu_s(5),
      comp:    tu_h(6.5),
      reb:     tu_h(5),
    },
    rear: {
      preload: mm(11),
      comp:    tu_h(2.25),
      reb:     tu_h(2),
    },
  },
  {
    id: 'ducati_multi_v4_rally_dss',
    brand: 'Ducati', model: 'Multistrada V4 Rally', year: '2023+',
    baseKg: 75,
    source: 'Manual do proprietário Ducati Multistrada V4 Rally (EN, 25 ED01), pág. 142-143',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'Quase tudo se faz no painel, não há cliques para contar. A única exceção é a pré-carga da frente, que é mecânica: 5 voltas de sextavado a apertar desde a posição toda solta, com cada volta a valer 1 mm.',
    notes: 'DSS, Ducati SkyHook System: o amortecimento das duas pontas é comandado por impulsos elétricos do painel e regula-se pelo menu Riding Mode - Suspension. A pré-carga de trás também é eletrónica e tem modo Autolevelling. Só a pré-carga da mola da frente é que se mexe à mão, com margem de 5 a 20 mm — e o manual pede que seja feita em concessionário. Forquilha de 50 mm, 200 mm de curso à frente.',
    front: {
      preload: { ...tu_s(5), label: '5 voltas desde toda solta; 1 mm por volta' },
      comp:    na('Eletrónico — ajusta-se no painel'),
      reb:     na('Eletrónico — ajusta-se no painel'),
    },
    rear: {
      preload: na('Eletrónico — pré-carga no painel, com modo Autolevelling'),
      comp:    na('Eletrónico — ajusta-se no painel'),
      reb:     na('Eletrónico — ajusta-se no painel'),
    },
  },
];

const KAWASAKI: MfzProfile[] = [
  {
    id: 'kawasaki_versys1000se_kecs',
    brand: 'Kawasaki', model: 'Versys 1000 SE', year: '2021+',
    baseKg: 75, source: 'Manufacturer official specs', formula: 'honda',
    front: {
      preload: na('Electronic — menu'),
      comp:    na('Electronic — menu'),
      reb:     na('Electronic — menu'),
    },
    rear: {
      preload: na('Electronic — menu'),
      comp:    na('Electronic — menu'),
      reb:     na('Electronic — menu'),
    },
    notes: 'Versys 1000 SE: KECS semi-active electronic suspension with Showa Skyhook — no manual clicks. Damping self-adjusts; preload and modes set on the screen. The base Versys 1000 S does not have KECS. Confirm by sag.',
    dataQuality: 'oem_manual',
  },
  {
    id: 'kawasaki_ninja1000_2017',
    brand: 'Kawasaki', model: 'Ninja 1000 / Z1000SX', year: '2017-2019',
    baseKg: 75,
    source: 'Manual de oficina Kawasaki Z1000SX / Ninja 1000, ref. 99924-1519-02 (2.ª ed., Jul. 2017), pág. 13-6',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'À frente conta-se em VOLTAS a partir do mais duro (regulador todo no sentido horário), tanto no retorno como na compressão. A pré-carga da frente é ao contrário: 5 voltas a apertar desde a posição toda solta. Atrás, o retorno é em voltas desde o mais duro e a pré-carga é em cliques desde a posição toda solta.',
    notes: 'Forquilha invertida de 41 mm, com os reguladores repartidos: a compressão existe só na bengala DIREITA, o retorno e a pré-carga estão nas duas. Margens de fábrica: retorno da frente 0 a 3 1/2 voltas, compressão 0 a 3 voltas, pré-carga da frente 0 a 15 voltas; atrás, retorno 0 a 2 1/2 voltas e pré-carga 0 a 40 cliques. O amortecedor é de gás a 980-1 280 kPa, não regulável. Exceção do manual: nas ZX1000WJ early do mercado BR o retorno de trás são 2 voltas em vez de 2 1/2. O manual cobre ZX1000WH (2017) e ZX1000WJ (2018); a 2019 é a mesma máquina.',
    front: {
      preload: tu_s(5),
      comp:    tu_h(1.75),
      reb:     tu_h(2.75),
    },
    rear: {
      preload: cl_s(8),
      comp:    na('O amortecedor não tem regulação de compressão'),
      reb:     tu_h(2.5),
    },
  },
  {
    id: 'kawasaki_z900_2017',
    brand: 'Kawasaki', model: 'Z900', year: '2017+',
    baseKg: 75,
    source: 'Manual de oficina Kawasaki Z900 / Z900 ABS, ref. 99924-1525-31, pág. 13-6',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'À frente, o retorno conta-se em CLIQUES a partir do mais duro (regulador todo no sentido horário) e a pré-carga em voltas a apertar desde a posição toda solta. Atrás, o retorno conta-se em voltas desde o mais duro; a pré-carga não se conta em cliques nem voltas, afere-se pelo comprimento da mola já montada.',
    notes: 'Forquilha invertida de 41 mm, 120 mm de curso; amortecedor horizontal back-link, 140 mm de curso. Margens de fábrica: retorno da frente 0 a 12 cliques, pré-carga da frente 0 a 30 voltas; atrás, retorno 0 a 1 4/5 voltas e pré-carga entre 190,5 e 200,5 mm de comprimento de mola (mais curto é mais duro). Não há regulação de compressão em nenhuma das pontas. Gás do amortecedor a 1 500 kPa, não regulável. O manual cobre as ZR900A/ZR900B de 2017; a geração 2020+ mantém a mesma forquilha e amortecedor mas não está confirmada por manual.',
    front: {
      preload: tu_s(8),
      comp:    na('A forquilha não tem regulação de compressão'),
      reb:     cl_h(7),
    },
    rear: {
      preload: pos('Regular até a mola montada ficar com 199,6 mm de comprimento', '199,6 mm'),
      comp:    na('O amortecedor não tem regulação de compressão'),
      reb:     tu_h(1.25),
    },
  },
];

const TRIUMPH: MfzProfile[] = [
  {
    id: 'triumph_tiger1200_showa',
    brand: 'Triumph', model: 'Tiger 1200 Rally Pro', year: '2022+',
    baseKg: 75, source: 'Manufacturer official specs', formula: 'honda',
    front: {
      preload: na('Electronic — menu'),
      comp:    na('Electronic — menu'),
      reb:     na('Electronic — menu'),
    },
    rear: {
      preload: na('Electronic — menu'),
      comp:    na('Electronic — menu'),
      reb:     na('Electronic — menu'),
    },
    notes: 'Tiger 1200 Rally Pro: Showa semi-active suspension — no manual click adjusters. Damping adapts to the terrain; automatic electronic rear preload (plus Active Preload Reduction). Set modes on the screen. Confirm by sag.',
    dataQuality: 'oem_manual',
  },
];

const MACBOR: MfzProfile[] = [
  {
    id: 'macbor_xr5',
    brand: 'Macbor', model: 'Montana XR5', year: '2021+',
    baseKg: 75, source: 'Manual do utilizador Montana XR5/510 (oficial)', formula: 'ktm',
    countNote: 'Cliques contados desde totalmente fechado "H" (duro), a abrir para "S" (mole). Pre-carga frente em mm (folga; menos mm = mais duro; fabrica 19 mm). Pre-carga tras = comprimento da mola 241,5 mm de fabrica (referencia).',
    front: {
      preload: mm(19),
      comp:    cl_h(7),
      reb:     cl_h(7),
    },
    rear: {
      preload: pos('241,5 mm comprimento mola (fabrica)', '241,5 mm'),
      comp:    cl_h(11),
      reb:     cl_h(6),
    },
    notes: 'Suspensao KYB totalmente ajustavel. Valores de fabrica do manual oficial. Frente: forquilha invertida 41 mm. Tras: monoamortecedor com reservatorio. Pre-carga traseira ajusta-se ao comprimento de mola (fabrica 241,5 +/-1,5 mm); usa o sag (~30% / ~60 mm) como guia. Confirmar sempre pelo sag.',
    dataQuality: 'oem_manual',
  },
];

// ─────────────────────────────────────────────
// QJ MOTOR
// Fonte: manuais do proprietário publicados pelo importador russo
// (qjmotor-russia.com/inctructions). Documento OEM, text-based.
//
// Só estão aqui os modelos cujo perfil fica COMPLETO — ou seja, aqueles em que
// a forquilha não tem afinadores nenhuns e por isso não há valores em falta.
// Os restantes QJ e as Voge ficam de fora de propósito: têm afinadores à frente
// que o manual confirma existirem mas para os quais nunca dá valor de fábrica.
// Criar-lhes perfil trocaria a estimativa da heurística por células vazias.
// Contagem: fechar no sentido horário até ao fim (duro), depois abrir (tu_hard).
// ─────────────────────────────────────────────
const KTM_EXTRA: MfzProfile[] = [
  {
    id: 'ktm_1290_sdr_2021',
    brand: 'KTM', model: '1290 Super Duke R', year: '2020-2023',
    baseKg: 75, source: 'KTM 1290 Super Duke R Owner\'s Manual 2021 (art. 3214331en, oficial)', formula: 'ktm',
    dataQuality: 'oem_manual',
    front: {
      preload: pos('0 = base de fábrica (escala -3 a +3)', '0 (-3/+3)'),
      comp:    cl_h(15),   // perna ESQUERDA, parafuso branco COMP
      reb:     cl_h(15),   // perna DIREITA, parafuso vermelho REB
    },
    rear: {
      preload: pos('0 = base de fábrica (manípulo, escala -5 a +15)', '0 (-5/+15)'),
      comp:    cl_h(12),   // = baixa velocidade
      reb:     cl_h(15),
      lsComp:  cl_h(12),
      hsComp:  tu_h(1.5),
    },
    countNote: 'Frente: fechar até ao fim no sentido horário e abrir 15 cliques — compressão na perna ESQUERDA (parafuso branco, COMP), extensão na DIREITA (vermelho, REB). Precarga da frente por parafuso nas duas pernas, escala -3 / 0 / +3 (0 é a base). Atrás: extensão 15 cliques e compressão de baixa velocidade 12, ambas a abrir do duro; alta velocidade 1,5 voltas. Precarga traseira por manípulo do lado direito, escala -5 a +15 (0 é a base).',
    notes: 'Valores "Standard" do manual oficial, versão SUPER DUKE R (a RR tem outros). O manual dá quatro predefinições: Comfort / Standard / Sport / Carga máxima. Frente — precarga -3/0/+3/+3, compressão 21/15/7/7 e extensão 21/15/7/7 cliques. Atrás — compressão baixa velocidade 21/12/7/7 cliques, alta velocidade 1,5/1,5/1/1 voltas, extensão 21/15/10/10 cliques. Confirmar sempre pelo sag.',
  },
  {
    id: 'ktm_890_duke_r_2022',
    brand: 'KTM', model: '890 Duke R', year: '2020-2023',
    baseKg: 75, source: 'KTM 890 Duke R Owner\'s Manual 2022 (art. 3214544en, oficial)', formula: 'ktm',
    dataQuality: 'oem_manual',
    front: {
      // Forquilha WP APEX 43 split: um afinador por perna, sem precarga externa.
      preload: na('A forquilha split não tem afinador de precarga'),
      comp:    cl_h(15),   // perna ESQUERDA, adjuster branco COMP
      reb:     cl_h(15),   // perna DIREITA, adjuster vermelho REB
    },
    rear: {
      preload: tu_s(3),
      comp:    cl_h(14),   // = baixa velocidade; ver lsComp/hsComp
      reb:     cl_h(14),
      lsComp:  cl_h(14),
      hsComp:  tu_h(1.5),
    },
    countNote: 'Frente: fechar o afinador até ao fim no sentido horário e abrir 15 cliques — compressão na perna ESQUERDA (adjuster branco, marcado COMP), extensão na DIREITA (vermelho, REB). Atrás igual para extensão e compressão de baixa velocidade (14 cliques); a de alta velocidade é em voltas (1,5) com chave de bocas. Precarga: abrir tudo no sentido anti-horário e apertar 3 voltas.',
    notes: 'Valores "Standard" do manual oficial. O manual dá quatro predefinições: Comfort / Standard / Sport / Carga máxima. Frente — compressão 20/15/4/15 e extensão 20/15/10/15 cliques. Atrás — compressão baixa velocidade 16/14/10/14 cliques, alta velocidade 1,5 voltas em todas, extensão 17/14/12/11 cliques, precarga 1/3/5,5/6 voltas. A forquilha split NÃO tem precarga: o único ajuste de precarga da moto é no amortecedor. Confirmar sempre pelo sag.',
  },
];

const YAMAHA_EXTRA: MfzProfile[] = [
  {
    id: 'yamaha_xt1200z_2010',
    brand: 'Yamaha', model: 'XT1200Z Super Ténéré', year: '2010-2020',
    baseKg: 75, source: 'Manual do proprietário Yamaha XT1200Z Super Ténéré (oficial)', formula: 'yamaha',
    dataQuality: 'oem_manual',
    front: {
      preload: pos('Ranhura 5,5 de 8 (fábrica) — alinha a ranhura com o topo do tampo', '5,5/8'),
      comp:    cl_h(6),
      reb:     cl_h(8),
    },
    rear: {
      preload: pos('Posição 4 de 6 no manípulo (fábrica) — 1 é a mais dura', '4/6'),
      comp:    na('O amortecedor não tem afinador de compressão'),
      reb:     cl_h(10),
    },
    countNote: 'Frente: fechar o parafuso até ao fim no sentido de endurecer e contar a abrir — compressão 6 cliques (de 13 no máximo mole), extensão 8 (de 10). A precarga não é por cliques: alinha-se a ranhura do ajustador com o topo do tampo da forquilha, escala 0 a 8, fábrica em 5,5 (0 = mais duro). Regula as duas pernas IGUAIS, o manual avisa que assimetria tira estabilidade. Atrás: extensão 10 cliques a abrir do duro (de 20 no mole) e precarga por manípulo de 6 posições, fábrica na 4. Não há compressão traseira.',
    notes: 'Versão XT1200Z base. A XT1200ZE tem suspensão eletrónica, regulada pelo ecrã — não é este perfil. O manual avisa que o número real de cliques pode não bater certo ao valor listado por diferenças de produção: conta o curso total do teu afinador e ajusta a proporção. Pressões de fábrica: até 90 kg, 2,25 bar à frente e 2,50 atrás; acima disso, 2,25 e 2,90. Confirmar sempre pelo sag.',
  },
  {
    id: 'yamaha_r1_2020',
    brand: 'Yamaha', model: 'YZF-R1', year: '2020+',
    baseKg: 75, source: 'Manual do proprietário Yamaha YZF-R1 / R1M (B3L, oficial)', formula: 'yamaha',
    dataQuality: 'oem_manual',
    front: {
      preload: tu_s(6),    // min 0, standard 6, max 15 voltas
      comp:    cl_h(17),   // min 23, standard 17, max 1 cliques
      reb:     cl_h(7),    // min 14, standard 7, max 1 cliques
    },
    rear: {
      preload: pos('Medida pela distância A — ver manual'),
      comp:    cl_h(12),   // = baixa velocidade
      reb:     cl_h(12),   // min 23, standard 12, max 1
      lsComp:  cl_h(12),   // min 18, standard 12, max 1
      hsComp:  tu_h(3),    // min 5,5, standard 3, max 0 voltas
    },
    countNote: 'Fechar o afinador até ao fim no sentido de endurecer e contar a abrir. Frente: compressão 17 cliques, extensão 7 cliques; precarga ao contrário — fechar até parar no sentido de aliviar e apertar 6 voltas. Atrás: extensão 12 cliques, compressão lenta 12 cliques, compressão rápida 3 voltas. Precarga traseira mede-se pela distância A, não por cliques.',
    notes: 'Valores standard do manual oficial, versão YZF-R1 (a R1M tem suspensão Öhlins eletrónica, com compressão e extensão ajustadas pelo ecrã — não é este perfil). Extremos do manual: frente precarga 0 a 15 voltas, compressão 23 a 1, extensão 14 a 1. Atrás extensão 23 a 1, compressão lenta 18 a 1, compressão rápida 5,5 a 0 voltas. Confirmar sempre pelo sag.',
  },
];

// ─────────────────────────────────────────────
// VOGE
// Fonte: manuais do proprietário (documento OEM).
//
// PORQUE É QUE A FRENTE APARECE SEM NÚMERO: não é lacuna, é o que o manual diz. A Voge
// documenta o traseiro ao clique e por carga, e sobre a frente escreve "Please adjust the
// gear according to personal preference" — dá o número de posições e como encontrar a
// posição 1, mas recusa-se a prescrever. Usar `pos` mantém o afinador como existente
// (isAdjustable = true) e mostra a instrução em vez de inventar um valor. É mais correto
// que a heurística por categoria, que poria ali um número que a fábrica nunca deu.
//
// Contagem traseira: a precarga conta-se a partir do MOLE (anti-horário até ao fim,
// depois apertar) e a extensão a partir do DURO (horário até ao fim, depois abrir).
// ─────────────────────────────────────────────
const VOGE: MfzProfile[] = [
  {
    id: 'voge_900dsx',
    brand: 'Voge', model: '900 DSX', year: '2023+',
    baseKg: 75, source: 'Manual do proprietário Voge 900 DSX (PT, oficial)', formula: 'cfmoto_interp',
    dataQuality: 'oem_manual',
    front: {
      preload: pos('Ajustável (comando 1) — o manual não dá valor de fábrica'),
      comp:    pos('Ajustável (comando 3, bainha direita) — sem valor de fábrica'),
      reb:     pos('Ajustável (comando 2, bainha esquerda) — sem valor de fábrica'),
    },
    rear: {
      preload: cl_s(6),
      comp:    pos('Existe (parafuso no reservatório de gás) — o manual omite-a'),
      reb:     cl_h(18),
    },
    weightPoints: [
      { kg: 75,  rPre: 6,  rReb: 18 },
      { kg: 115, rPre: 16, rReb: 16 },
      { kg: 190, rPre: 21, rReb: 14 },
    ],
    countNote: 'Atrás: precarga a partir do mole (anti-horário até ao fim, depois conta a apertar) e extensão a partir do duro (horário até ao fim, depois conta a abrir). À frente o manual não prescreve valores — regula pelo sag e pela sensação.',
    notes: 'As três cargas do manual são: só piloto (6 cliques de precarga, 18 de extensão), piloto com 3 malas (16±1 e 16±1) e piloto com passageiro e 3 malas (21±1 e 14±1). A compressão traseira EXISTE, por parafuso no reservatório de gás, mas este manual não a descreve — o manual do 800 DSX Rally, que tem o mesmo amortecedor e os mesmos valores de precarga e extensão ao clique, usa 10 / 8 / 6 cliques do duro para as mesmas três cargas. Não foi copiado para aqui por ser outro modelo. A frente não tem valores de fábrica em fonte nenhuma: confirmado no manual português, no manual inglês DS900X, por OCR às figuras, e no fórum 900dsx.com, onde os próprios proprietários não os encontram. CUIDADO com o artigo de 900dsx.com sobre a forquilha — ele numera os parafusos ao contrário do manual (diz "tornillo 2 = compresión, tornillo 3 = rebote", quando a Voge diz comando 2 = extensão na bainha ESQUERDA e comando 3 = compressão na DIREITA). Está a descrever uma forquilha genérica, não esta. Confirmar sempre pelo sag.',
  },
  {
    id: 'voge_800dsx_rally',
    brand: 'Voge', model: '800 DSX Rally', year: '2024+',
    baseKg: 75, source: 'Manual do proprietário Voge 800 DSX Rally (EN, oficial)', formula: 'cfmoto_interp',
    dataQuality: 'oem_manual',
    front: {
      preload: mm(19),
      comp:    pos('10 posições (ajustador 3, em baixo) — a Voge não prescreve', '1-10'),
      reb:     pos('10 posições (ajustador 2, em cima) — a Voge não prescreve', '1-10'),
    },
    rear: {
      preload: cl_s(6),
      comp:    cl_h(10),
      reb:     cl_h(18),
    },
    weightPoints: [
      { kg: 75,  rPre: 6,  rComp: 10, rReb: 18 },
      { kg: 115, rPre: 16, rComp: 8,  rReb: 16 },
      { kg: 190, rPre: 21, rComp: 6,  rReb: 14 },
    ],
    countNote: 'Atrás: precarga a partir do mole, extensão e compressão a partir do duro (a compressão é o ajustador 3, no reservatório de gás). Precarga da frente em mm de altura, 19 mm de fábrica (intervalo 4 a 19). Compressão e extensão da frente têm 10 posições cada e o manual manda escolher por preferência.',
    notes: 'É o perfil Voge mais completo: o único cujo manual dá valor de fábrica para a precarga da frente (19 mm). As três cargas são só piloto, piloto com 3 malas e piloto com passageiro e 3 malas. Confirmar sempre pelo sag.',
  },
  {
    id: 'voge_625dsx',
    brand: 'Voge', model: '625 DSX (DS 625X)', year: '2024+',
    baseKg: 75, source: 'Manual do proprietário Voge DS 625X (EN, oficial)', formula: 'cfmoto_interp',
    dataQuality: 'oem_manual',
    front: {
      preload: pos('Ajustável (ajustador 1, chave de bocas 14 Nm) — sem valor de fábrica'),
      comp:    pos('Ajustável (ajustador 3, bainha direita) — sem valor de fábrica'),
      reb:     pos('Ajustável (ajustador 2, bainha esquerda) — sem valor de fábrica'),
    },
    rear: {
      preload: pos('Posição de entrega; +2 voltas com 3 malas, +3 a dois com malas', 'entrega'),
      comp:    cl_s(10),
      reb:     cl_s(10),
    },
    weightPoints: [
      { kg: 75,  rComp: 10, rReb: 10 },
      { kg: 115, rComp: 8,  rReb: 8  },
      { kg: 190, rComp: 6,  rReb: 6  },
    ],
    countNote: 'Atrás, ao contrário das outras Voge, a extensão e a compressão contam-se a partir do MOLE: anti-horário até ao fim, depois conta a apertar. A precarga traseira é em voltas a partir da posição de entrega, não a partir de um limite — por isso não tem número absoluto.',
    notes: 'Cargas do manual: só piloto (extensão e compressão 10 cliques, precarga na posição de entrega), piloto com 3 malas (8±1 e 8, precarga +2 voltas) e piloto com passageiro e 3 malas (6±1 e 6, precarga +3 voltas). Confirmar sempre pelo sag.',
  },
];

const SUZUKI_EXTRA: MfzProfile[] = [
  {
    id: 'suzuki_gsxr1000r_2017',
    brand: 'Suzuki', model: 'GSX-R1000R', year: '2017+',
    baseKg: 75, source: 'Manual do proprietário Suzuki GSX-R1000/R (99011-17K57-01A, oficial)', formula: 'suzuki',
    dataQuality: 'oem_manual',
    front: {
      preload: tu_s(7.75),
      comp:    tu_h(3),
      reb:     tu_h(2.5),
    },
    rear: {
      preload: pos('Anel roscado — precisa de ferramenta especial, a Suzuki manda ir ao concessionário'),
      comp:    tu_h(2.75),
      reb:     tu_h(3),
    },
    countNote: 'Frente (Showa BFF): os afinadores de compressão e extensão estão em BAIXO nas duas pernas, não em cima. Fechar no sentido horário até parar e abrir — compressão 3 voltas, extensão 2,5. A precarga é ao contrário: fechar no anti-horário até parar e apertar 7,75 voltas, com chave sextavada no topo. Atrás: extensão 3 voltas e compressão 2,75, ambas a abrir do duro, com os dois afinadores no TOPO do amortecedor. Afinar 1/8 de volta de cada vez.',
    notes: 'Valores da versão R, que tem Showa BFF à frente e BFRC-lite atrás. A GSX-R1000 base tem números diferentes no mesmo manual — precarga da frente 4,75 voltas, extensão 4, compressão 4,75; atrás extensão 2,75 e compressão separada em alta e baixa velocidade, que a R não tem. Regular sempre as duas pernas da forquilha igual. A precarga traseira não tem valor de fábrica publicado: usar o sag. Confirmar sempre pelo sag.',
  },
  {
    id: 'suzuki_gsxs1000_2015',
    brand: 'Suzuki', model: 'GSX-S1000', year: '2015-2020',
    baseKg: 75, source: 'Manual do proprietário Suzuki GSX-S1000 / F / FA (oficial)', formula: 'suzuki',
    dataQuality: 'oem_manual',
    front: {
      preload: pos('Posição 2,5 de 5 (fábrica) — 5 riscas no ajustador, 1 = mais mole', '2,5/5'),
      comp:    cl_h(8),
      reb:     cl_h(8),
    },
    rear: {
      preload: pos('Posição 4 de 7 (fábrica, GSX-S1000/A; a F/FA vem na 3)', '4/7'),
      comp:    na('O amortecedor não tem afinador de compressão'),
      reb:     tu_h(1),
    },
    countNote: 'Frente: rodar o afinador no sentido horário até parar e abrir 8 cliques — compressão em baixo, extensão em cima, iguais nas duas pernas. Precarga da frente por posições (riscas no ajustador), fábrica na 2,5 de 5. Atrás só extensão: horário até parar, depois 1 volta a abrir. Precarga traseira por anel roscado de 7 posições, com a chave do kit de ferramentas.',
    notes: 'A Suzuki dá o mesmo valor de fábrica (8 cliques) para compressão e extensão à frente, por isso não é gralha. Atrás não há afinador de compressão. Regular sempre as duas pernas da forquilha igual — o manual avisa que assimetria causa instabilidade. Confirmar pelo sag.',
  },
];

const QJMOTOR: MfzProfile[] = [
  {
    id: 'qj_srk921',
    brand: 'QJ Motor', model: 'SRK 921', year: '2026+',
    baseKg: 75, source: 'Manual do proprietário QJMOTOR SRK 921 MY2026 (oficial)', formula: 'ktm',
    dataQuality: 'oem_manual',
    front: {
      preload: tu_s(3.5),
      comp:    tu_h(1.5),
      reb:     tu_h(2.5),
    },
    rear: {
      preload: pos('Comprimento da mola 165 mm ±5 (fábrica)', '165 mm'),
      comp:    cl_h(12),   // = baixa velocidade
      reb:     pos('A posição de fábrica vem marcada A COR no ajustador'),
      lsComp:  cl_h(12),
      hsComp:  cl_h(12),
    },
    countNote: 'É a QJ mais completa do catálogo. Frente: precarga a partir do mole (anti-horário até ao fim, depois 3,5 voltas a apertar, limite 10); compressão 1,5 voltas e extensão 2,5 a abrir do duro (limite 4,75 cada). Atrás: compressão SEPARADA em baixa e alta velocidade, 12 cliques cada a abrir do duro. A precarga faz-se pelo comprimento da mola, 165 mm. A extensão traseira não tem número — a posição de fábrica vem marcada a cor no próprio ajustador.',
    notes: 'Único modelo QJ do catálogo com compressão traseira separada em baixa e alta velocidade. Confirmar sempre pelo sag.',
  },
  {
    id: 'qj_srk800',
    brand: 'QJ Motor', model: 'SRK 800', year: '2023+',
    baseKg: 75, source: 'Manual do proprietário QJMOTOR SRK 800 (oficial)', formula: 'ktm',
    dataQuality: 'oem_manual',
    front: {
      preload: tu_s(5),
      comp:    tu_h(1),
      reb:     tu_h(3.25),
    },
    rear: {
      preload: pos('Precarga hidráulica, 0 de fábrica (curso 10 mm)', '0 (0-10 mm)'),
      comp:    na('O amortecedor não tem afinador de compressão'),
      reb:     tu_h(7),
    },
    countNote: 'Frente: precarga com chave de 14 mm a partir do mole (anti-horário até ao fim, depois 5 voltas a apertar, limite 10); compressão 1 volta e extensão 3,25 a abrir do duro (limite 4,75 cada). Atrás: precarga hidráulica com 10 mm de curso, 0 de fábrica, e extensão 7 voltas a abrir do duro. Sem compressão atrás.',
    notes: 'ATENÇÃO — o manual contradiz-se na frente: a tabela dá compressão 1 volta e extensão 3,25, mas o texto do procedimento de reset logo abaixo diz 1,5 e 3,5. Ficaram os valores da TABELA, que é onde estão também os limites. O texto parece copiado de outro modelo (no SRK 921 os dois batem certo). Se algum dia houver terceira fonte, vale a pena confirmar. Confirmar sempre pelo sag.',
  },
  {
    id: 'qj_srk600',
    brand: 'QJ Motor', model: 'SRK 600', year: '2023+',
    baseKg: 75, source: 'Manual do proprietário QJMOTOR SRK 600 (oficial)', formula: 'ktm',
    dataQuality: 'oem_manual',
    front: {
      preload: pos('Ajustável por chave sextavada — o manual não dá valor de fábrica'),
      comp:    pos('Ajustável (haste central, perna esquerda) — sem valor de fábrica'),
      reb:     pos('Ajustável (haste central, perna direita) — sem valor de fábrica'),
    },
    rear: {
      preload: pos('Duas bainhas roscadas — o manual não dá valor de fábrica'),
      comp:    na('O amortecedor não tem afinador de compressão'),
      reb:     cl_h(10),
    },
    countNote: 'Atrás: extensão na posição 10 de 26 — fechar no sentido horário (direção H) até ao batente, que é a posição 1, e abrir no sentido S até à 10. Sem compressão atrás. À frente existem os três afinadores mas o manual não prescreve valores: acerta pelo sag.',
    notes: 'O manual descreve duas configurações de forquilha para este modelo, mas ambas têm os mesmos três afinadores — precarga por chave sextavada, e compressão e extensão pelas hastes centrais, uma em cada perna. Por isso dá para afirmar que a frente é totalmente ajustável, mesmo sem saber qual das duas a moto leva. Confirmar sempre pelo sag.',
  },
  {
    id: 'qj_srk900',
    brand: 'QJ Motor', model: 'SRK 900', year: '2023+',
    baseKg: 75, source: 'Manual do proprietário QJMOTOR SRK 900 (oficial)', formula: 'ktm',
    dataQuality: 'oem_manual',
    front: {
      preload: na('Forquilha sem afinadores'),
      comp:    na('Forquilha sem afinadores'),
      reb:     na('Forquilha sem afinadores'),
    },
    rear: {
      preload: pos('Anel de precarga — sem valor de fábrica no manual'),
      comp:    na('O amortecedor não tem afinador de compressão'),
      reb:     tu_h(9),
    },
    countNote: 'Extensão traseira: rodar até ao fim no sentido horário (mais duro) e abrir 9 voltas. Precarga por anel roscado com chave de gancho — o manual não dá volta de fábrica, usa o sag.',
    notes: 'O manual só tem capítulo do amortecedor traseiro; não há qualquer secção de afinação da frente, nem no índice. Forquilha sem afinadores. Confirmar sempre pelo sag.',
  },
  // ÓRFÃO DE PROPÓSITO — não está ligado a nenhuma moto do catálogo.
  // Descreve a variante de mercado RUSSO, cujo manual não tem afinação à frente. A moto
  // vendida em Portugal leva Marzocchi 43 mm totalmente ajustável à frente segundo a
  // qjmotor.pt, por isso a entrada qj-srt900sx usa `adjusters` em vez deste perfil.
  // Fica aqui para não se perder o valor de fábrica da extensão traseira, caso um dia se
  // confirme qual das duas suspensões é a que chega cá.
  {
    id: 'qj_srt900sx',
    brand: 'QJ Motor', model: 'SRT 900 SX (mercado RU)', year: '2023+',
    baseKg: 75, source: 'Manual do proprietário QJMOTOR SRT 900 S/SX (oficial)', formula: 'ktm',
    dataQuality: 'oem_manual',
    front: {
      preload: na('Forquilha sem afinadores'),
      comp:    na('Forquilha sem afinadores'),
      reb:     na('Forquilha sem afinadores'),
    },
    rear: {
      preload: pos('Anel de precarga — sem valor de fábrica no manual'),
      comp:    na('O amortecedor não tem afinador de compressão'),
      reb:     tu_h(10),
    },
    countNote: 'Extensão traseira: rodar até ao fim no sentido horário (mais duro) e abrir 10 voltas. Precarga por anel roscado com chave de gancho — o manual não dá volta de fábrica, usa o sag.',
    notes: 'Mesma estrutura da SRK 900: o manual só cobre o amortecedor traseiro. A versão SRT 900 S usa 5 voltas de extensão em vez de 10 — este perfil é o da SX. Confirmar sempre pelo sag.',
  },
  {
    id: 'qj_srt450rx',
    brand: 'QJ Motor', model: 'SRT 450 RX', year: '2024+',
    baseKg: 75, source: 'Manual do proprietário QJMOTOR SRT 450 RX (oficial)', formula: 'ktm',
    dataQuality: 'oem_manual',
    front: {
      preload: na('A forquilha não tem afinador de precarga'),
      comp:    tu_h(1.5),
      reb:     tu_h(2.5),
    },
    rear: {
      preload: pos('3 a 8 mm entre o topo da rosca e a contraporca', '3-8 mm'),
      comp:    na('O amortecedor não tem afinador de compressão'),
      reb:     na('O amortecedor não tem afinador de extensão'),
    },
    countNote: 'Frente: rodar o parafuso até ao fim no sentido horário (mais duro) e abrir — compressão na perna esquerda 1,5 voltas, extensão na direita 2,5 voltas. Limite de 4 voltas em cada. Atrás só precarga, por porca de ajuste com chave de gancho.',
    notes: 'Confirmado em duas edições independentes do manual (grega e russa MY2026) com os mesmos números. Um afinador por perna: só compressão à esquerda e só extensão à direita, sem precarga à frente. Atrás só precarga — o manual dá o intervalo em mm (3 a 8) e não uma posição única, por isso usa o sag para escolher dentro dele.',
  },
  {
    id: 'yamaha_xt1200ze_2014',
    brand: 'Yamaha', model: 'XT1200ZE Super Ténéré', year: '2014-2020',
    baseKg: 75,
    source: 'Manual do proprietário Yamaha XT1200Z/ZE (oficial) — a secção da ZE remete a regulação para o ecrã',
    formula: 'yamaha',
    dataQuality: 'oem_manual',
    front: {
      preload: na('Eletrónica — regula-se pelo ecrã'),
      comp:    na('Eletrónica — regula-se pelo ecrã'),
      reb:     na('Eletrónica — regula-se pelo ecrã'),
    },
    rear: {
      preload: na('Eletrónica — regula-se pelo ecrã'),
      comp:    na('Eletrónica — regula-se pelo ecrã'),
      reb:     na('Eletrónica — regula-se pelo ecrã'),
    },
    countNote: 'Não há cliques a contar nesta moto. A suspensão eletrónica regula-se pelos botões do guiador e pelo ecrã: escolhes o modo de amortecimento e a predefinição de carga (só piloto / com bagagem / dois / dois com bagagem). O que a app te dá aqui é o sag e as pressões de pneus, que continuam a ser teus para medir.',
    notes: '⚠️ Esta é a versão ZE, com suspensão eletrónica. Se a tua moto tem afinadores manuais na forquilha e no amortecedor, é a XT1200Z base — escolhe essa, que tem os valores de fábrica do manual. Pressões de fábrica iguais às da Z: até 90 kg, 2,25 bar à frente e 2,50 atrás; acima disso, 2,25 e 2,90. O sag é a única medida que continua a valer numa suspensão eletrónica: confirma sempre por aí.',
  },
];

const BMW_EXTRA: MfzProfile[] = [
  {
    id: 'bmw_r1200gs_lc_2013',
    brand: 'BMW', model: 'R 1200 GS (LC)', year: '2013-2018',
    baseKg: 85,
    source: 'Manual de operação e manutenção BMW R 1200 GS, código 0A01, edição 08/2015 (oficial)',
    formula: 'cfmoto_interp',
    dataQuality: 'oem_manual',
    front: {
      preload: na('O Telelever não tem afinador de precarga'),
      comp:    na('O Telelever não tem afinador de compressão'),
      reb:     na('O Telelever não tem afinador de extensão'),
    },
    rear: {
      preload: tu_s(0),
      comp:    na('O amortecedor de série não tem afinador de compressão'),
      reb:     cl_h(8),
    },
    // O manual dá três estados de carga, não pesos. Os kg abaixo são a NOSSA leitura
    // desses estados — os números dos afinadores é que são da BMW. Ver `notes`.
    weightPoints: [
      { kg: 85,  rPre: 0,  rReb: 8 },   // só piloto, sem carga
      { kg: 115, rPre: 15, rReb: 2 },   // piloto com carga
      { kg: 185, rPre: 30, rReb: 2 },   // piloto, passageiro e carga
    ],
    countNote: 'Só há afinadores atrás. Precarga: roda de ajuste até ao batente no sentido LOW e conta voltas para HIGH — 0 voltas só com piloto, 15 com carga, 30 com passageiro e carga. Extensão: parafuso até ao batente no sentido horário e conta cliques no sentido anti-horário — 8 só com piloto, 2 com carga ou com passageiro. Começa o ajuste pelo lado esquerdo da moto. À frente não há nada a mexer: o Telelever não tem afinadores.',
    notes: '⚠️ Este perfil é da R 1200 GS (código 0A01). A GS Adventure é o 0A02, com amortecedor e curso diferentes — os valores não se transferem. ⚠️ Se a tua moto tem Dynamic ESA, o amortecimento e a precarga regulam-se pelo ecrã e não por estes valores. O manual da BMW não dá pesos, dá três estados de carga; os kg deste perfil são a forma como os traduzimos para a app, mas os números dos afinadores são os do manual. A precarga é contínua (voltas), não tem cliques. Confirmar sempre pelo sag.',
  },
];

export const MFZ_PROFILES: MfzProfile[] = [
  ...CFMOTO,
  ...KTM_EXTRA,
  ...YAMAHA_EXTRA,
  ...BMW_EXTRA,
  ...SUZUKI_EXTRA,
  ...VOGE,
  ...QJMOTOR,
  ...HONDA,
  ...KOVE,
  ...KTM,
  ...SUZUKI,
  ...YAMAHA,
  ...BMW,
  ...DUCATI,
  ...KAWASAKI,
  ...TRIUMPH,
  ...MACBOR,
  {
    id: 'honda_cb750_hornet_2023',
    brand: 'Honda', model: 'CB750 Hornet', year: '2023+',
    baseKg: 75, source: 'Manual do proprietário Honda Hornet (CB750A), 3PMLB600, pág. 131',
    formula: 'honda',
    dataQuality: 'oem_manual',
    countNote: 'A precarga traseira tem 7 posições, com a 4 de fábrica. 1 a 3 são mais macias, 5 a 7 mais rijas. Precisa da chave de pinos e da barra de extensão do kit de ferramentas.',
    notes: 'A forquilha Showa SFF-BP não tem afinadores externos — o capítulo de afinação do manual só cobre a suspensão traseira. Só a precarga traseira é regulável.',
    front: {
      preload: na('Forquilha sem afinadores externos'),
      comp:    na('Forquilha sem afinadores externos'),
      reb:     na('Forquilha sem afinadores externos'),
    },
    rear: {
      preload: pos('7 posições por anel roscado; a 4 é a de fábrica', '4/7'),
      comp:    na('Sem afinador de compressão'),
      reb:     na('Sem afinador de extensão'),
    },
  },
  {
    id: 'ducati_multi_v4_ohlins_smartec',
    brand: 'Ducati', model: 'Multistrada V4 RS / Pikes Peak', year: '2026',
    // Manual PT: forquilha Ohlins 48 mm e amortecedor TTX36, ambos com amortecimento
    // gerido eletronicamente (Smart EC 2.0). Nao ha cliques: escolhe-se um de cinco
    // modos no painel. A unica regulacao mecanica e' a precarga da frente; a de tras
    // tambem e' eletronica.
    baseKg: 75, source: 'Manual do proprietário Ducati Multistrada V4 RS (2026), pág. 348-349, e V4 Pikes Peak (2026), pág. 339',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'Não há cliques. O amortecimento escolhe-se no painel entre Hardest, Hard, Medium, Soft e Softest, e a moto tem 4 geometrias de carga (só piloto, piloto com bagagem, dois, dois com bagagem).',
    notes: 'Öhlins Smart EC 2.0 event-based nas duas pontas. A precarga da frente é manual; a de trás é elétrica, pelo painel. Curso de roda 170 mm à frente e atrás.',
    front: {
      preload: pos('Regulação manual da pré-carga na forquilha', 'MANUAL'),
      comp:    na('Gerido eletronicamente (Öhlins Smart EC 2.0)'),
      reb:     na('Gerido eletronicamente (Öhlins Smart EC 2.0)'),
    },
    rear: {
      preload: pos('Pré-carga elétrica, escolhida no painel entre 4 geometrias de carga', 'PAINEL'),
      comp:    na('Gerido eletronicamente (Öhlins Smart EC 2.0)'),
      reb:     na('Gerido eletronicamente (Öhlins Smart EC 2.0)'),
    },
  },
  {
    id: 'ducati_multi_v2s_dss_evo',
    brand: 'Ducati', model: 'Multistrada V2 S / S Travel', year: '2025+',
    baseKg: 75, source: 'Manual do proprietário Ducati Multistrada V2 S Travel (2026), pág. 280-281',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'Sem cliques. Escolhe-se o modo de suspensão (Comfort, Dynamic, Low Grip, Off Road) e, dentro do modo de pilotagem, um de cinco níveis: Hardest, Hard, Medium, Soft, Softest.',
    notes: 'Ducati Skyhook Suspension EVO: retorno, compressão e pré-carga comandados eletricamente nas duas pontas. Quatro geometrias de carga mais modo automático. Curso de roda 170 mm; curso do amortecedor 59 mm.',
    front: {
      preload: na('Comandado eletronicamente (Ducati Skyhook EVO)'),
      comp:    na('Comandado eletronicamente (Ducati Skyhook EVO)'),
      reb:     na('Comandado eletronicamente (Ducati Skyhook EVO)'),
    },
    rear: {
      preload: pos('Pré-carga elétrica: 4 geometrias de carga mais modo automático', 'PAINEL'),
      comp:    na('Comandado eletronicamente (Ducati Skyhook EVO)'),
      reb:     na('Comandado eletronicamente (Ducati Skyhook EVO)'),
    },
  },
  {
    id: 'aprilia_tuareg660_2021',
    brand: 'Aprilia', model: 'Tuareg 660', year: '2021+',
    baseKg: 75,
    source: 'Manual do proprietário Aprilia Tuareg 660, Ed. 01_10/2021, cód. 2Q000498 (EN), pág. 113 e 116',
    formula: 'cfmoto_interp',
    dataQuality: 'oem_manual',
    countNote: 'Conta-se SEMPRE a partir da posição mais dura, com o regulador todo rodado no sentido horário — é o que o manual manda. À frente, a pré-carga mede-se em milímetros de porca desapertada; atrás conta-se em cliques a fechar desde todo aberto.',
    notes: 'Forquilha invertida de 43 mm, curso 240 mm. Amortecedor com reservatório separado e ligação progressiva, curso 106,5 mm. O manual traz uma segunda tabela para passageiro e/ou bagagem: só mudam a pré-carga (6→7 mm à frente, 10→26 cliques atrás) e a extensão de trás (1,5→1 volta). A compressão fica igual nas duas cargas.',
    front: {
      preload: mm(6),
      comp: cl_h(8),
      reb: cl_h(8),
    },
    rear: {
      preload: cl_s(10),
      comp: tu_h(2),
      reb: tu_h(1.5),
    },
    weightPoints: [
      { kg: 75,  fPre: 6, fComp: 8, fReb: 8, rPre: 10, rComp: 2, rReb: 1.5 },
      { kg: 150, fPre: 7, fComp: 8, fReb: 8, rPre: 26, rComp: 2, rReb: 1 },
    ],
  },
  {
    id: 'aprilia_rs660_2020',
    brand: 'Aprilia', model: 'RS 660', year: '2021+',
    baseKg: 75,
    source: 'Manual do proprietário Aprilia RS 660, Ed. 03_11/2020, cód. 2Q000420, pág. 114 e 117',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'Conta-se sempre a partir da posição mais dura, com o regulador todo rodado no sentido horário.',
    notes: 'A afinação de fábrica é só uma, para estrada — o manual não dá tabela por carga. À frente há pré-carga e extensão, mas não há regulação de compressão. Atrás só se regula a extensão; a pré-carga afere-se pelo comprimento da mola (145,5 mm ± 2), com o amortecedor a 306 mm ± 2. Saliência das bengalas: 2 entalhes acima da mesa superior.',
    front: {
      preload: pos('A afinação de fábrica é com a porca de pré-carga toda desapertada', 'TODA SOLTA'),
      comp: na('A forquilha não tem regulação de compressão'),
      reb: cl_h(18),
    },
    rear: {
      preload: pos('Regular até a mola ficar com 145,5 mm ± 2 mm', '145,5 mm'),
      comp: na('O amortecedor não tem regulação de compressão'),
      reb: cl_h(5),
    },
  },
  {
    id: 'aprilia_tuono660_2021',
    brand: 'Aprilia', model: 'Tuono 660', year: '2021+',
    baseKg: 75,
    source: 'Manual do proprietário Aprilia Tuono 660, Ed. 01_01/2021, cód. 2Q000426, pág. 114 e 117',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'Conta-se sempre a partir da posição mais dura, com o regulador todo rodado no sentido horário.',
    notes: 'A afinação de fábrica é só uma, para estrada — o manual não dá tabela por carga. À frente há pré-carga e extensão, mas não há regulação de compressão. Atrás só se regula a extensão; a pré-carga afere-se pelo comprimento da mola (145,5 mm ± 2), com o amortecedor a 306 mm ± 2. Saliência das bengalas: 2 entalhes acima da mesa superior.',
    front: {
      preload: pos('A afinação de fábrica é com a porca de pré-carga toda desapertada', 'TODA SOLTA'),
      comp: na('A forquilha não tem regulação de compressão'),
      reb: cl_h(18),
    },
    rear: {
      preload: pos('Regular até a mola ficar com 145,5 mm ± 2 mm', '145,5 mm'),
      comp: na('O amortecedor não tem regulação de compressão'),
      reb: cl_h(5),
    },
  },
  {
    id: 'aprilia_rsv4_1100_2021',
    brand: 'Aprilia', model: 'RSV4 1100', year: '2021+',
    baseKg: 75,
    source: 'Manual do proprietário Aprilia RSV4 1100, Ed. 02_03/2021, cód. 2Q000439, pág. 126 e 132',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'Conta-se sempre a partir da posição mais dura, com o regulador todo rodado no sentido horário. A pré-carga da frente é a exceção: contam-se 5 voltas a apertar desde toda aberta.',
    notes: 'Valores da afinação de estrada. O manual traz ainda uma afinação de pista (extensão da frente a 8 cliques em vez de 10) que só deve ser usada em competição autorizada, fora do trânsito normal — por isso não entra aqui. Atrás, a pré-carga afere-se pelo comprimento da mola já montada: 148 mm, com 312 mm entre centros. Saliência das bengalas: 2 entalhes (8 mm). Amortecedor Sachs, versão sem ASC.',
    front: {
      preload: tu_s(5),
      comp: cl_h(6),
      reb: cl_h(10),
    },
    rear: {
      preload: pos('Regular até a mola montada ficar com 148 mm', '148 mm'),
      comp: tu_h(2),
      reb: cl_h(20),
    },
  },
  {
    id: 'aprilia_tuono_v4_1100_rr',
    brand: 'Aprilia', model: 'Tuono V4 1100 RR', year: '2015+',
    baseKg: 75,
    source: 'Manual do proprietário Aprilia Tuono V4 1100 RR/Factory, Ed. 03_03/2015, pág. 80 e 85',
    formula: 'suzuki',
    dataQuality: 'oem_manual',
    countNote: 'Conta-se sempre a partir da posição mais dura, com o regulador todo rodado no sentido horário. A pré-carga da frente é a exceção: contam-se 5 voltas a apertar desde toda aberta.',
    notes: 'Valores da versão RR, com forquilha e amortecedor Sachs — é a base da gama. A Factory leva Öhlins e tem números diferentes: à frente 10 cliques de extensão, 15 de compressão e 10 voltas de pré-carga; atrás 17 cliques de extensão e 15 de compressão, com 303 mm entre centros. Se a tua for Factory, usa esses. Atrás, a pré-carga afere-se pelo comprimento da mola já montada: 148,5 mm. Saliência das bengalas: 2 entalhes (8 mm). A afinação de pista fica de fora: o manual diz que é só para competição autorizada e proíbe expressamente usá-la na estrada.',
    front: {
      preload: tu_s(5),
      comp: cl_h(10),
      reb: cl_h(10),
    },
    rear: {
      preload: pos('Regular até a mola montada ficar com 148,5 mm', '148,5 mm'),
      comp: cl_h(2),
      reb: cl_h(13),
    },
  },
  {
    id: 'ducati_desertx_kayaba',
    brand: 'Ducati', model: 'DesertX', year: '2022-2025',
    baseKg: 75,
    source: 'Manual do proprietário Ducati DesertX (EN, ed. 25 ED02), pág. 57-60',
    formula: 'cfmoto_interp',
    dataQuality: 'oem_manual',
    countNote: 'À frente conta-se em VOLTAS a partir do mais duro (regulador todo no sentido horário). A pré-carga da frente também é em voltas, a apertar desde a posição toda solta, e cada volta vale 1 mm. Atrás, o retorno e a compressão são em voltas desde o mais duro, mas a pré-carga é em cliques.',
    notes: 'Kayaba nas duas pontas, 46 mm à frente, 230 mm de curso. O manual dá uma tabela por carga e outra por tipo de uso. À frente, os valores NÃO mudam com a carga: são sempre 2 voltas de retorno, 2 de compressão e 2 de pré-carga. Só o amortecedor muda. Para fora de estrada o manual sugere Off Road Standard (1,5 / 1,5 / 4 à frente) e Off Road Sport (1,25 / 1 / 8).',
    front: {
      preload: tu_s(2),
      comp: tu_h(2),
      reb: tu_h(2),
    },
    rear: {
      preload: cl_s(6),
      comp: tu_h(3),
      reb: tu_h(1.75),
    },
    weightPoints: [
      { kg: 75,  fPre: 2, fComp: 2, fReb: 2, rPre: 6,  rComp: 3,   rReb: 1.75 },
      { kg: 100, fPre: 2, fComp: 2, fReb: 2, rPre: 17, rComp: 2.5, rReb: 1.75 },
      { kg: 150, fPre: 2, fComp: 2, fReb: 2, rPre: 26, rComp: 2,   rReb: 1.5 },
    ],
  },
];

/** Quick lookup by profile ID */
export const MFZ_MAP: Record<string, MfzProfile> = Object.fromEntries(
  MFZ_PROFILES.map(p => [p.id, p])
);

/** All profile IDs grouped by brand */
export const MFZ_BRANDS: Record<string, string[]> = MFZ_PROFILES.reduce(
  (acc, p) => {
    if (!acc[p.brand]) acc[p.brand] = [];
    acc[p.brand].push(p.id);
    return acc;
  },
  {} as Record<string, string[]>
);
