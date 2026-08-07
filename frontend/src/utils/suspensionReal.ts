/**
 * suspensionReal.ts
 * Real suspension lookup and interpolation for RideTune.
 * Uses factory data from mfzSuspensionData.ts (sourced from mfzstudio.com/moto/).
 *
 * Usage:
 *   import { getRealSuspension } from './suspensionReal';
 *   const result = getRealSuspension('yamaha_t700_2025', 82, 0, 8);
 */

import {
  type MfzProfile,
  type SuspVal,
  type WeightPoint,
  type VType,
} from '../data/mfzSuspensionData';
import { getOemSuspMap } from '../services/oem-data';

// ─────────────────────────────────────────────
// Output types
// ─────────────────────────────────────────────

export type ConfidenceLevel =
  | 'real_oem'         // Official manufacturer manual — weight at stated value
  | 'real_mfz'         // Verified factory baseline from mfzstudio.com
  | 'brand_formula'    // Real base data + brand weight formula applied
  | 'category_estimate'; // No factory data — heuristic by bike category

export interface AdjResult {
  value: number | string | null;
  type: VType;
  display: string;       // Human-readable string for the UI
  countDirection: string; // How to count (instruction text)
  isAdjustable: boolean;
  /** Token curto para a célula quando type='pos' (curso ou posição de fábrica). */
  cell?: string;
}

export interface SuspensionResult {
  profileId: string;
  brand: string;
  model: string;
  year: string;
  totalKg: number;
  riderKg: number;
  pillionKg: number;
  luggageKg: number;
  front: {
    preload: AdjResult;
    compression: AdjResult;
    rebound: AdjResult;
  };
  rear: {
    preload: AdjResult;
    compression: AdjResult;
    rebound: AdjResult;
    highSpeedCompression?: AdjResult;
    lowSpeedCompression?: AdjResult;
  };
  notes?: string;
  countNote?: string;
  source: string;
  dataSource: 'real_factory' | 'interpolated';
  confidence: ConfidenceLevel;
}

// ─────────────────────────────────────────────
// Direction instruction text
// ─────────────────────────────────────────────

const COUNT_INSTRUCTIONS: Record<VType, string> = {
  cl_hard: 'Turn CW gently to fully hard (0), then count ACW clicks out.',
  cl_soft: 'Turn ACW gently to fully soft (0), then count CW clicks up.',
  tu_hard: 'Turn CW gently to fully hard (0), then count ACW turns out.',
  tu_soft: 'Turn ACW gently to fully soft (0), then count CW turns up.',
  mm:      'Set gap / distance in millimetres as indicated. Keep both sides equal.',
  pos:     'Set to the named position / groove as indicated.',
  na:      'Not adjustable on this model.',
};

// ─────────────────────────────────────────────
// Adjustment formulas (mirroring mfzstudio.com logic)
// ─────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function roundQuarter(v: number): number {
  return Math.round(v * 4) / 4;
}

/**
 * KTM formula (from mfzstudio.com/moto/ktm/ JS):
 *   damping clicks: base - round(delta/20), clamped 1-30
 *   preload turns:  base + round(delta/25), clamped 0-20
 *   preload mm:     base + round(delta/18), clamped 0-40
 *   damping turns:  base - round(delta/25)*0.25, rounded to 0.25 steps
 */
function adjustKtm(base: number, total: number, type: VType): number {
  const delta = total - 75;
  switch (type) {
    case 'cl_hard': return clamp(base - Math.round(delta / 20), 1, 30);
    case 'tu_hard': return clamp(roundQuarter(base - Math.round(delta / 25) * 0.25), 0.25, 4);
    case 'tu_soft': return clamp(base + Math.round(delta / 25), 0, 20);
    case 'mm':      return clamp(base + Math.round(delta / 18), 0, 40);
    default:        return base;
  }
}

/**
 * Yamaha formula (from mfzstudio.com/moto/yamaha/ JS):
 *   damping clicks: base - round(delta/20), clamped 1-30
 *   preload clicks: base + round(delta/15), clamped 0-30
 *   preload mm (T7 2025+/World Raid front, Distance A): base - round(delta/10) — more load = less distance = more preload (firmer)
 */
function adjustYamaha(base: number, total: number, type: VType): number {
  const delta = total - 75;
  switch (type) {
    case 'cl_hard': return clamp(base - Math.round(delta / 20), 1, 30);
    case 'cl_soft': return clamp(base + Math.round(delta / 15), 0, 30);
    case 'mm':      return clamp(base - Math.round(delta / 10), 0, 40); // mm = Distance A: more load -> LESS distance -> MORE preload (firmer)
    default:        return base;
  }
}

/**
 * Honda formula — same damping as KTM, preload turns same as KTM
 */
function adjustHonda(base: number, total: number, type: VType): number {
  const delta = total - 75;
  switch (type) {
    case "cl_hard": return clamp(base - Math.round(delta / 20), 1, 30);
    case "tu_hard": return clamp(roundQuarter(base - Math.round(delta / 25) * 0.25), 0.25, 4);
    case "cl_soft": return clamp(base + Math.round(delta / 20), 0, 30);
    case "tu_soft": return clamp(roundQuarter(base + Math.round(delta / 25) * 0.25), 0, 20);
    case "mm":      return clamp(base + Math.round(delta / 18), 0, 40);
    default:        return base;
  }
}

/**
 * Suzuki — same as KTM damping, preload same direction
 */
function adjustSuzuki(base: number, total: number, type: VType): number {
  const delta = total - 75;
  switch (type) {
    case "cl_hard": return clamp(base - Math.round(delta / 20), 1, 30);
    case "tu_hard": return clamp(roundQuarter(base - Math.round(delta / 25) * 0.25), 0.25, 4);
    case "cl_soft": return clamp(base + Math.round(delta / 20), 0, 30);
    case "tu_soft": return clamp(roundQuarter(base + Math.round(delta / 25) * 0.25), 0, 20);
    case "mm":      return clamp(base + Math.round(delta / 18), 0, 40);
    default:        return base;
  }
}
/**
 * Kove formula — cl_hard damping only (preload is always pos/na on Kove models)
 */
function adjustKove(base: number, total: number, type: VType): number {
  const delta = total - 75;
  switch (type) {
    case 'cl_hard': return clamp(base - Math.round(delta / 20), 1, 30);
    default:        return base;
  }
}

/**
 * Pré-carga com o ritmo medido no manual desta mota, em vez do da marca.
 *
 * As fórmulas por marca assumem que uma volta de pré-carga vale sempre os mesmos quilos
 * — a `ktm` usa 25. Nos manuais isso varia muito de mota para mota, porque depende do
 * passo da rosca do manípulo: no 890 Adventure R uma volta atrás vale 27 kg, no 1290
 * Super Adventure R vale 6. Quando o `preloadKgPerTurn` do perfil traz o valor do manual,
 * é esse que manda; sem ele, nada muda e a mota segue a fórmula da marca.
 *
 * Devolve `null` quando não há valor medido, para quem chama seguir o caminho normal.
 */
function preloadMedida(
  profile: MfzProfile,
  base: number,
  total: number,
  type: VType,
  eixo?: 'front' | 'rear'
): number | null {
  if (type !== 'tu_soft' || !eixo) return null;
  const kgPorVolta = profile.preloadKgPerTurn?.[eixo];
  if (!kgPorVolta) return null;
  return clamp(base + Math.round((total - profile.baseKg) / kgPorVolta), 0, 30);
}

function applyFormula(
  profile: MfzProfile,
  base: number,
  total: number,
  type: VType,
  eixo?: 'front' | 'rear'
): number {
  const medida = preloadMedida(profile, base, total, type, eixo);
  if (medida !== null) return medida;

  switch (profile.formula) {
    case 'ktm':     return adjustKtm(base, total, type);
    case 'yamaha':  return adjustYamaha(base, total, type);
    case 'honda':   return adjustHonda(base, total, type);
    case 'kove':    return adjustKove(base, total, type);
    case 'suzuki':  return adjustSuzuki(base, total, type);
    // 'cfmoto_interp' só chega aqui se os weightPoints faltarem (dados
    // corrompidos ou incompletos). Nesse caso NÃO devolver o valor base — isso
    // congela o setup em qualquer carga e parece à app estar avariada.
    // Usar a fórmula genérica KTM como rede de segurança.
    default:        return adjustKtm(base, total, type);
  }
}

// ─────────────────────────────────────────────
// CFMOTO multi-weight interpolation
// ─────────────────────────────────────────────

/**
 * Arredonda um valor interpolado para algo que o utilizador consiga mesmo pôr
 * no amortecedor. Não existe meio click: os tipos em clicks arredondam para
 * inteiro, as voltas para 1/4 e os mm para 0,5.
 */
function roundForType(v: number, type: VType): number {
  switch (type) {
    case 'cl_hard':
    case 'cl_soft': return Math.round(v);
    case 'tu_hard':
    case 'tu_soft': return roundQuarter(v);
    case 'mm':      return Math.round(v * 2) / 2;
    default:        return roundQuarter(v);
  }
}

function interpolateWps(
  wps: WeightPoint[],
  total: number,
  field: keyof WeightPoint,
  type: VType
): number | null {
  const sorted = [...wps].sort((a, b) => a.kg - b.kg);
  const vals = sorted.map(wp => ({ kg: wp.kg, v: wp[field] as number | undefined }));

  // Below minimum
  if (total <= sorted[0].kg) return vals[0].v ?? null;
  // Above maximum
  if (total >= sorted[sorted.length - 1].kg) return vals[vals.length - 1].v ?? null;

  // Find surrounding points
  for (let i = 0; i < vals.length - 1; i++) {
    if (total >= vals[i].kg && total <= vals[i + 1].kg) {
      const lo = vals[i], hi = vals[i + 1];
      if (lo.v == null || hi.v == null) return lo.v ?? null;
      const ratio = (total - lo.kg) / (hi.kg - lo.kg);
      return roundForType(lo.v + ratio * (hi.v - lo.v), type);
    }
  }
  return null;
}

// ─────────────────────────────────────────────
// Format a single adjuster value for display
// ─────────────────────────────────────────────

function formatDisplay(value: number | string | null, type: VType, label?: string): string {
  if (type === 'na') return label || 'Not adjustable';
  if (type === 'pos') return label || String(value);
  if (value === null) return '—';
  const v = Number(value);
  switch (type) {
    case 'cl_hard': return `${v} clicks out (from fully hard)`;
    case 'cl_soft': return `${v} clicks up (from fully soft)`;
    case 'tu_hard': return `${formatTurns(v)} turns out (from fully hard)`;
    case 'tu_soft': return `${formatTurns(v)} turns up (from fully soft)`;
    case 'mm':      return `${v} mm`;
    default:        return String(v);
  }
}

function formatTurns(v: number): string {
  const r = roundQuarter(v);
  const map: Record<number, string> = {
    0.25: '1/4',    0.5: '1/2',    0.75: '3/4',
    1.0:  '1',      1.25: '1-1/4', 1.5:  '1-1/2',
    1.75: '1-3/4',  2.0:  '2',     2.25: '2-1/4',
    2.5:  '2-1/2',  2.75: '2-3/4', 3.0:  '3',
    3.25: '3-1/4',  3.5:  '3-1/2', 3.75: '3-3/4',
    4.0:  '4',
  };
  return map[r] ?? String(r);
}

function buildAdjResult(sv: SuspVal, adjustedValue?: number): AdjResult {
  const isAdjustable = sv.type !== 'na';
  const finalValue = (sv.type !== 'na' && sv.type !== 'pos' && adjustedValue !== undefined)
    ? adjustedValue
    : sv.v;

  return {
    value: finalValue,
    type: sv.type,
    display: formatDisplay(finalValue, sv.type, sv.label),
    countDirection: COUNT_INSTRUCTIONS[sv.type],
    isAdjustable,
    cell: sv.cell,
  };
}

// ─────────────────────────────────────────────
// MAIN FUNCTION
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// Confidence level calculation
// ─────────────────────────────────────────────

function calcConfidence(profile: MfzProfile, total: number): ConfidenceLevel {
  const atBase = Math.abs(total - profile.baseKg) <= 5;
  const hasRealCurve = profile.formula === 'cfmoto_interp' && !!profile.weightPoints?.length;

  // Perfis com tabela de carga REAL (vários pontos tirados do manual/chart) continuam a
  // ser dados reais fora do baseKg — o que muda com o peso é qual das linhas se usa, não
  // uma fórmula inventada. Esta verificação tem de vir ANTES da de `oem_manual`: um perfil
  // pode ser as duas coisas (as Voge e as CFMoto são), e se a de oem_manual apanhasse
  // primeiro, as motos com os MELHORES dados da app mostravam o crachá mais fraco assim
  // que o piloto saísse dos 75 kg.
  if (hasRealCurve) {
    return profile.dataQuality === 'oem_manual' ? 'real_oem' : 'real_mfz';
  }

  // Valor de fábrica único: só é "real" à volta do peso base; fora disso é fórmula.
  if (profile.dataQuality === 'oem_manual') {
    return atBase ? 'real_oem' : 'brand_formula';
  }

  // Interpolação declarada mas sem weightPoints — dados incompletos, trata como fórmula.
  if (profile.formula === 'cfmoto_interp') {
    return atBase ? 'real_mfz' : 'brand_formula';
  }

  // All other brands: mfzstudio verified baseline + formula
  return atBase ? 'real_mfz' : 'brand_formula';
}

/**
 * Get suspension settings for a specific model and load.
 *
 * @param profileId  - ID from MFZ_PROFILES (e.g. 'yamaha_t700_2025')
 * @param riderKg    - Rider weight including full gear (kg)
 * @param pillionKg  - Pillion weight (0 if solo)
 * @param luggageKg  - Total luggage weight (0 if none)
 * @returns SuspensionResult or null if profile not found
 */
export function getRealSuspension(
  profileId: string,
  riderKg: number,
  pillionKg: number,
  luggageKg: number
): SuspensionResult | null {
  const profile = getOemSuspMap()[profileId];
  if (!profile) return null;

  const total = riderKg + pillionKg + luggageKg;
  const isInterp = profile.formula === 'cfmoto_interp';

  // Helper: get adjusted numeric value for a SuspVal
  function adj(sv: SuspVal, wpField?: keyof WeightPoint): number | null {
    if (sv.type === 'na' || sv.type === 'pos') return null;
    if (sv.v === null) return null;

    // CFMOTO: interpolate from weight points
    if (isInterp && profile.weightPoints && wpField) {
      const interp = interpolateWps(profile.weightPoints, total, wpField, sv.type);
      return interp ?? sv.v;
    }

    // Other brands: apply adjustment formula.
    // O eixo vai junto porque a pré-carga medida no manual é diferente à frente e atrás
    // — no 890 a mesma carga pede 3 voltas numa ponta e 6 na outra.
    const eixo = wpField?.startsWith('f') ? 'front' as const
               : wpField?.startsWith('r') ? 'rear'  as const
               : undefined;
    return applyFormula(profile, sv.v, total, sv.type, eixo);
  }

  const front = profile.front;
  const rear  = profile.rear;

  const result: SuspensionResult = {
    profileId,
    brand:     profile.brand,
    model:     profile.model,
    year:      profile.year,
    totalKg:   total,
    riderKg,
    pillionKg,
    luggageKg,
    front: {
      preload:     buildAdjResult(front.preload,     adj(front.preload,     'fPre')  ?? undefined),
      compression: buildAdjResult(front.comp,        adj(front.comp,        'fComp') ?? undefined),
      rebound:     buildAdjResult(front.reb,         adj(front.reb,         'fReb')  ?? undefined),
    },
    rear: {
      preload:     buildAdjResult(rear.preload,      adj(rear.preload,      'rPre')  ?? undefined),
      compression: buildAdjResult(rear.comp,         adj(rear.comp,         'rComp') ?? undefined),
      rebound:     buildAdjResult(rear.reb,          adj(rear.reb,          'rReb')  ?? undefined),
    },
    notes:      profile.notes,
    countNote:  profile.countNote,
    source:     profile.source,
    dataSource: isInterp ? 'interpolated' : 'real_factory',
    confidence: calcConfidence(profile, total),
  };

  // Optional: high-speed and low-speed compression
  if (rear.hsComp) {
    result.rear.highSpeedCompression = buildAdjResult(
      rear.hsComp,
      adj(rear.hsComp, 'rHsComp') ?? undefined
    );
  }
  if (rear.lsComp) {
    result.rear.lowSpeedCompression = buildAdjResult(
      rear.lsComp,
      adj(rear.lsComp, 'rLsComp') ?? undefined
    );
  }

  return result;
}

// ─────────────────────────────────────────────
// CONVENIENCE EXPORTS
// ─────────────────────────────────────────────

/** Find a profile ID from brand + model + year (partial match) */
export function findProfileId(brand: string, model: string, year?: string): string | null {
  const b = brand.toLowerCase();
  const m = model.toLowerCase();
  const matches = Object.values(getOemSuspMap()).filter(p => {
    const bMatch = p.brand.toLowerCase().includes(b);
    const mMatch = p.model.toLowerCase().includes(m);
    const yMatch = !year || p.year.includes(year);
    return bMatch && mMatch && yMatch;
  });
  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0].id;
  // If multiple matches, prefer exact year
  if (year) {
    const exact = matches.find(p => p.year === year);
    if (exact) return exact.id;
  }
  return matches[0].id;
}

/** List all available profile IDs */
export function listProfiles(): Array<{ id: string; brand: string; model: string; year: string }> {
  return Object.values(getOemSuspMap()).map(p => ({
    id: p.id, brand: p.brand, model: p.model, year: p.year,
  }));
}
