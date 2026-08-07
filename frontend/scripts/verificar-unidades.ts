/**
 * verificar-unidades.ts — a conversão de peso não pode fazer o número fugir.
 *
 * PORQUE É QUE ISTO EXISTE
 * A app é métrica por dentro e converte só nas pontas. O risco desse desenho é o número
 * andar sozinho: o utilizador escolhe 165 lb, a app guarda 74,84 kg, e da próxima vez que
 * abre o ecrã mostra 164 ou 166. Ninguém reporta um bug assim — assume que se enganou —
 * mas mina a confiança em tudo o resto que a app diz.
 *
 * Este script percorre TODAS as libras que alguém pode escolher e confirma que ir a quilos
 * e voltar dá exactamente o mesmo número. E faz o mesmo do lado métrico.
 *
 * Sai com código 1 a qualquer divergência, para o CI apanhar.
 */

import {
  kgToLb,
  limitesPeso,
  pesoParaGuardar,
  pesoParaMostrar,
  type UnitSystem,
} from '../src/utils/units';

let falhas = 0;

// ─── 1. Ida e volta, valor a valor ───────────────────────────────────────────
// Os limites cobrem tudo o que a app deixa escolher: condutor 40-130 kg, passageiro
// 0-120, bagagem 0-60. Testa-se o intervalo inteiro de 0 a 130 kg de uma vez.

console.log('Ida e volta do peso, em todos os valores possíveis\n');

for (const sistema of ['metric', 'imperial'] as UnitSystem[]) {
  const lim = limitesPeso(0, 130, sistema);
  const maus: number[] = [];

  for (let mostrado = lim.min; mostrado <= lim.max; mostrado++) {
    const kg = pesoParaGuardar(mostrado, sistema);
    if (pesoParaMostrar(kg, sistema) !== mostrado) maus.push(mostrado);
  }

  const total = lim.max - lim.min + 1;
  if (maus.length) {
    console.log(`✗ ${sistema}: ${maus.length} de ${total} valores mudam sozinhos`);
    console.log(`    primeiros: ${maus.slice(0, 8).join(', ')}`);
    falhas++;
  } else {
    console.log(`✓ ${sistema}: ${total} valores, todos estáveis (${lim.min} a ${lim.max})`);
  }
}

// ─── 2. Os limites nunca deixam sair do intervalo ────────────────────────────
// Convertem-se para dentro de propósito. Se o máximo em libras, convertido de volta,
// desse mais de 130 kg, a app aceitaria um peso que as fórmulas não cobrem.

console.log('\nLimites convertidos, sem transbordar\n');

for (const [minKg, maxKg, nome] of [
  [40, 130, 'condutor'],
  [0, 120, 'passageiro'],
  [0, 60, 'bagagem'],
] as [number, number, string][]) {
  const lim = limitesPeso(minKg, maxKg, 'imperial');
  const deVoltaMin = pesoParaGuardar(lim.min, 'imperial');
  const deVoltaMax = pesoParaGuardar(lim.max, 'imperial');
  const ok = deVoltaMin >= minKg && deVoltaMax <= maxKg;

  console.log(
    `${ok ? '✓' : '✗'} ${nome.padEnd(12)} ${minKg}-${maxKg} kg → ${lim.min}-${lim.max} lb ` +
    `→ ${deVoltaMin.toFixed(1)}-${deVoltaMax.toFixed(1)} kg`,
  );
  if (!ok) falhas++;
}

// ─── 3. Âncoras conhecidas ───────────────────────────────────────────────────
// Meia dúzia de valores que qualquer pessoa consegue conferir de cabeça. Apanham uma
// constante trocada, que é o erro que os dois testes de cima NÃO apanham: uma conversão
// consistentemente errada é consistentemente estável.

console.log('\nValores de referência\n');

for (const [kg, lb] of [
  [75, 165],
  [100, 220],
  [50, 110],
  [130, 287],
] as [number, number][]) {
  const obtido = Math.round(kgToLb(kg));
  const ok = obtido === lb;
  console.log(`${ok ? '✓' : '✗'} ${kg} kg = ${obtido} lb   (esperado ${lb})`);
  if (!ok) falhas++;
}

if (falhas) {
  console.log(`\n✗ ${falhas} verificações falharam.`);
  process.exit(1);
}

console.log('\n✓ A conversão de peso é estável nos dois sentidos.');
