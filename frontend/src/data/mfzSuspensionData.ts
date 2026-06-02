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
const pos  = (label: string): SuspVal => ({ v: null, type: 'pos', label });
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
    baseKg: 75, source: 'mfzstudio.com/moto/cfmoto/', formula: 'cfmoto_interp',
    countNote: 'ACW to fully soft (0), then CW count up.',
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
    baseKg: 75, source: 'mfzstudio.com/moto/cfmoto/', formula: 'cfmoto_interp',
    countNote: 'Damping: anticlockwise to soft (0), then clockwise to count. Rear preload: ring collar, clockwise adds preload.',
    front: {
      preload: pos('Standard seat: position 10 (spring length)'),
      comp: cl_s(10),
      reb: cl_s(10),
    },
    rear: {
      preload: tu_s(0),
      comp: na('No rear compression adjuster'),
      reb: cl_s(10),
    },
    weightPoints: [
      { kg: 75,  fComp: 10, fReb: 10, rPre: 0, rReb: 10 },
      { kg: 80,  fComp: 11, fReb: 11, rPre: 1, rReb: 11 },
      { kg: 105, fComp: 12, fReb: 12, rPre: 4, rReb: 12 },
      { kg: 155, fComp: 14, fReb: 14, rPre: 4, rReb: 14 },
    ],
    notes: 'Rear preload shown in turns (≈ visible rings on the collar; turn clockwise to add). Rear has no compression adjuster; damping uses click adjusters. Starting point only — confirm by sag (~30% / ~60mm of 200mm travel). If heavy loads need a lot of preload to reach target sag, fit a stiffer rear spring: preload does not replace correct spring rate.',
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
    baseKg: 75, source: 'mfzstudio.com/moto/honda/', formula: 'cfmoto_interp',
    front: {
      preload: tu_s(6),
      comp:    cl_s(8),
      reb:     cl_s(8),
    },
    rear: {
      preload: tu_s(2),
      comp:    cl_s(8),
      reb:     cl_s(8),
    },
    weightPoints: [
      { kg: 75,  rPre: 2 },
      { kg: 95,  rPre: 3 },
      { kg: 120, rPre: 4 },
      { kg: 150, rPre: 5 },
      { kg: 190, rPre: 7 },
    ],
    notes: 'Transalp 2026: now FULLY adjustable (added compression + rebound front and rear). DAMPING CLICK VALUES ARE PLACEHOLDERS (8) — TO BE CONFIRMED from mfzstudio/manual. Rear preload 7-position step adjuster, estimated from load. Confirm by sag.',
    dataQuality: 'mfz_verified',
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
    brand: 'Honda', model: 'NT1100', year: '2022-2024',
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
    notes: 'NT1100 2022-2024: front preload only (dial adjuster). Rear: preload (7 clicks from min) + stepless rebound. No compression adjusters.',
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
    baseKg: 75, source: 'mfzstudio.com/moto/kove/', formula: 'kove',
    front: {
      preload: pos('Standard seat: spring 215-230mm / Low seat: 200-225mm'),
      comp:    cl_h(10),
      reb:     cl_h(10),
    },
    rear: {
      preload: pos('Standard seat: spring 215-230mm / Low seat: 200-225mm'),
      comp:    na('Use high-speed + low-speed compression'),
      reb:     cl_h(10),
      hsComp:  tu_h(2),
      lsComp:  cl_h(8),
    },
    notes: 'Front & rear preload via spring length measurement. Has separate high-speed and low-speed rear compression.',
  },
  {
    id: 'kove_450rally_factory',
    brand: 'Kove', model: '450 Rally Factory', year: '2023+',
    baseKg: 75, source: 'mfzstudio.com/moto/kove/', formula: 'kove',
    front: {
      preload: pos('Standard seat: spring 215-230mm / Low seat: 200-225mm'),
      comp:    cl_h(10),
      reb:     cl_h(10),
    },
    rear: {
      preload: pos('Standard seat: spring 215-230mm / Low seat: 200-225mm'),
      comp:    na('Use high-speed + low-speed compression'),
      reb:     cl_h(10),
      hsComp:  tu_h(2),
      lsComp:  cl_h(8),
    },
    notes: 'Same factory settings as Regular variant. Has separate high-speed and low-speed rear compression.',
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
    notes: 'Pro 2026 — front compression differs from Standard/E5 (12 vs 18 clicks).',
  },
  {
    id: 'kove_800x_touring',
    brand: 'Kove', model: '800X Touring', year: '2024+',
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
  },
  {
    id: 'kove_800x_rally',
    brand: 'Kove', model: '800X Rally', year: '2024+',
    baseKg: 75, source: 'mfzstudio.com/moto/kove/', formula: 'kove',
    front: {
      preload: pos('Fork marking — confirm with sag'),
      comp:    cl_h(18),
      reb:     cl_h(8),   // different from other 800X
    },
    rear: {
      preload: pos('Shock adjuster — confirm with sag'),
      comp:    na('Use high-speed + low-speed compression'),
      reb:     cl_h(8),
      hsComp:  tu_h(2),
      lsComp:  cl_h(8),
    },
    notes: '800X Rally — separate high-speed and low-speed rear compression. Different front rebound vs Standard.',
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
    baseKg: 75, source: 'mfzstudio.com/moto/yamaha/', formula: 'yamaha',
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
    notes: 'Front preload: Distance A = 19.0mm at base. Keep both fork legs equal. Confirm with sag check.',
  },
];

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export const MFZ_PROFILES: MfzProfile[] = [
  ...CFMOTO,
  ...HONDA,
  ...KOVE,
  ...KTM,
  ...SUZUKI,
  ...YAMAHA,
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
