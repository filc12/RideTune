/**
 * suspensionFormulas.ts — as fórmulas de ajuste por peso, isoladas de tudo o resto.
 *
 * PORQUE É QUE ISTO É UM FICHEIRO À PARTE
 * Estas funções são aritmética pura: entram um valor de fábrica e um peso, sai um valor
 * ajustado. Estavam dentro do `suspensionReal.ts`, que importa o `oem-data` e por aí o
 * armazenamento e o Sentry — coisas que só existem dentro da app. Isso tornava as
 * fórmulas impossíveis de testar fora dela, e foi assim que um erro de pré-carga viveu
 * meses sem ninguém dar por ele.
 *
 * Aqui não se importa nada além dos tipos dos dados. Qualquer script de verificação pode
 * chamar isto directamente.
 */

import { type MfzProfile, type VType } from '../data/mfzSuspensionData';

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function roundQuarter(v: number): number {
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
 * Honda formula — amortecimento igual ao da KTM.
 *
 * A PRÉ-CARGA EM VOLTAS NÃO É IGUAL À DA KTM, ao contrário do que este comentário dizia
 * até 7 de agosto de 2026. A KTM faz `base + round(delta/25)`; esta faz o mesmo vezes
 * 0,25. Para um passageiro de 75 kg, a KTM abre 3 voltas e esta abre 0,75 — quatro vezes
 * menos, para o mesmo tipo de afinador.
 *
 * NÃO SE UNIFORMIZOU, e a razão é que não se sabe qual das duas está certa. Pode bem ser
 * de propósito: a tabela por carga do manual da Ducati DesertX mostra a pré-carga da
 * FRENTE a não mexer nada entre andar sozinho e andar com passageiro, enquanto os manuais
 * KTM mandam abrir 3 a 6 voltas. Marcas diferentes fazem coisas diferentes.
 *
 * O caminho de saída não é escolher uma constante — é o `preloadKgPerTurn`, que põe o
 * ritmo por mota a partir do manual. Ver `docs/pendentes.md`.
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
 * Suzuki — amortecimento igual ao da KTM.
 *
 * A pré-carga em voltas tem o mesmo desvio de quatro vezes descrito no `adjustHonda`, e
 * pela mesma razão: nunca foi medida contra manual nenhum. Serve de fórmula a motas
 * Ducati, Kawasaki, Aprilia e Suzuki, que não têm por que se comportar todas igual.
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

export function applyFormula(
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

