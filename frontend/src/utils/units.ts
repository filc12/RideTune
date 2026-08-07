/**
 * units.ts — conversão de peso entre métrico e imperial.
 *
 * A REGRA QUE MANDA EM TUDO O RESTO: a app é métrica por dentro. Todos os dados dos
 * manuais, todas as fórmulas, tudo o que vai para o Supabase e para os setups guardados
 * está em quilos. O imperial existe só nas pontas — no que se mostra e no que se escreve.
 *
 * Porquê assim, e não guardar na unidade escolhida: quem já usa a app tem setups e entradas
 * de diário gravados em quilos. Se a unidade passasse a fazer parte do dado guardado, esses
 * registos ficavam ambíguos — 75 seria 75 quilos ou 75 libras? — e não há forma de o
 * descobrir depois. Convertendo só à entrada e à saída, nada do que está gravado muda de
 * significado, e mudar de unidade nas Definições nunca reescreve nada.
 *
 * SEM DEPENDÊNCIAS. Nem React, nem armazenamento, nem nada de Expo. É aritmética, e assim
 * pode ser chamada por um script de verificação fora da app — foi a lição que se tirou
 * quando as fórmulas de suspensão estavam presas dentro de um ficheiro que arrastava
 * metade da aplicação.
 */

export type UnitSystem = 'metric' | 'imperial';

/** Quilos numa libra. Valor exacto por definição internacional desde 1959. */
const KG_POR_LB = 0.45359237;

export function kgToLb(kg: number): number {
  return kg / KG_POR_LB;
}

export function lbToKg(lb: number): number {
  return lb * KG_POR_LB;
}

/**
 * O peso como o utilizador o vê, já arredondado à unidade inteira.
 *
 * Arredonda-se sempre para inteiro porque ninguém pesa 74,8 kg para efeitos de suspensão —
 * e porque meio quilo não muda um único clique em nenhuma das fórmulas.
 */
export function pesoParaMostrar(kg: number, sistema: UnitSystem): number {
  return Math.round(sistema === 'imperial' ? kgToLb(kg) : kg);
}

/**
 * O inverso: o que o utilizador escreveu ou escolheu, convertido para os quilos que a app
 * guarda. Em imperial o resultado é fraccionário de propósito — 165 lb são 74,8428 kg, e é
 * esse valor que se guarda.
 *
 * NÃO ARREDONDAR AQUI. Se se arredondasse para 75, ao voltar a mostrar dava 165,3 → 165,
 * o que por acaso até funcionaria; mas com 166 lb (75,29 kg → 75) sairia 165 e o número
 * mudava sozinho debaixo dos olhos de quem o acabou de escolher. Guardar o valor exacto é
 * o que torna a ida e volta estável.
 */
export function pesoParaGuardar(valorMostrado: number, sistema: UnitSystem): number {
  return sistema === 'imperial' ? lbToKg(valorMostrado) : valorMostrado;
}

/** O símbolo, para não andar espalhado por literais pelos ecrãs todos. */
export function simboloPeso(sistema: UnitSystem): string {
  return sistema === 'imperial' ? 'lb' : 'kg';
}

/**
 * Os limites e o passo de um seletor de peso, na unidade que está a ser mostrada.
 *
 * O passo é sempre em unidades inteiras do que se vê: quem anda em libras mexe de libra em
 * libra, não de 0,45 em 0,45. Os limites convertem-se e arredondam-se PARA DENTRO (mínimo
 * para cima, máximo para baixo) para nunca se poder escolher um valor que, convertido de
 * volta a quilos, caia fora do que a app aceita.
 */
export function limitesPeso(
  minKg: number,
  maxKg: number,
  sistema: UnitSystem,
): { min: number; max: number } {
  if (sistema === 'metric') return { min: minKg, max: maxKg };
  return { min: Math.ceil(kgToLb(minKg)), max: Math.floor(kgToLb(maxKg)) };
}

/**
 * Que sistema usar quando a app abre pela primeira vez, a partir da região do telemóvel.
 *
 * Os quatro países que não adoptaram o sistema métrico para uso corrente. O Reino Unido é
 * o caso ambíguo — oficialmente métrico, mas as pessoas dizem o peso em stones e libras, e
 * quem pede esta funcionalidade é precisamente essa gente.
 *
 * Usa-se o `Intl` do motor de JavaScript e NÃO o `expo-localization`, por uma razão
 * prática: o `expo-localization` é módulo nativo, e acrescentá-lo obrigaria a uma
 * compilação nova da app em vez de uma actualização por OTA. Se o `Intl` não existir ou a
 * região não se perceber, fica métrico — que é o que a app sempre fez.
 */
export function sistemaPorRegiao(): UnitSystem {
  const IMPERIAIS = ['US', 'GB', 'LR', 'MM'];
  try {
    const locale =
      typeof Intl !== 'undefined' && Intl.NumberFormat
        ? Intl.NumberFormat().resolvedOptions().locale
        : '';
    // Um locale vem como "en-US", "pt-PT" ou às vezes só "en". A região é o que estiver
    // a seguir ao primeiro travessão; sem travessão, não há região e não se adivinha.
    const regiao = locale.split('-')[1]?.toUpperCase();
    return regiao && IMPERIAIS.includes(regiao) ? 'imperial' : 'metric';
  } catch {
    return 'metric';
  }
}
