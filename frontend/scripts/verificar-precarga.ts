/**
 * verificar-precarga.ts — a pré-carga calculada bate certo com a coluna do manual?
 *
 * PORQUE É QUE ISTO EXISTE
 * Em 7 de agosto de 2026 percebeu-se que a fórmula por marca trata a pré-carga como se
 * uma volta valesse sempre os mesmos quilos. Não vale: depende do passo da rosca do
 * manípulo, e varia muito de mota para mota. No 1290 Super Adventure R uma volta vale
 * 6 kg; no 890 Adventure R vale 27. O campo `preloadKgPerTurn` guarda o valor medido no
 * manual, e este script verifica que ele produz mesmo os números do manual.
 *
 * O TESTE
 * Os manuais KTM dão uma coluna «Full payload». A carga a que ela corresponde calcula-se
 * do próprio manual — peso máximo autorizado menos o peso da mota com o depósito cheio.
 * Se a app, nessa carga, devolver a pré-carga da coluna «Full payload», a conta está bem.
 *
 * Sai com código 1 a qualquer divergência, para o CI apanhar.
 *
 * NÃO É UM TESTE DE COMPILAÇÃO. Corre em tsx, que tolera coisas que o Metro rejeita —
 * quem apanha erros de sintaxe é o `npm run typecheck`.
 */

import { MFZ_PROFILES } from '../src/data/mfzSuspensionData';
import { applyFormula } from '../src/utils/suspensionFormulas';

/**
 * Porque é que não se chama o `getRealSuspension`: esse importa o `oem-data`, que importa
 * o armazenamento e o Sentry, que só existem dentro da app — fora dela rebenta. As
 * fórmulas vivem agora no `suspensionFormulas.ts`, sem dependências, precisamente para
 * poderem ser chamadas daqui.
 */
function precarga(id: string, totalKg: number): { frente: number | null; tras: number | null } | null {
  const p = MFZ_PROFILES.find(x => x.id === id);
  if (!p) return null;
  const um = (sv: typeof p.front.preload, eixo: 'front' | 'rear') =>
    sv.type === 'na' || sv.type === 'pos' || sv.v === null
      ? null
      : applyFormula(p, sv.v, totalKg, sv.type, eixo);
  return { frente: um(p.front.preload, 'front'), tras: um(p.rear.preload, 'rear') };
}

type Caso = {
  id: string;
  nome: string;
  /** Carga útil do manual: peso máximo autorizado − (peso sem combustível + depósito). */
  cargaMaxKg: number;
  /** De onde saíram os números, para quem vier a seguir não ter de os reconstituir. */
  fonte: string;
  /** Pré-carga da coluna «Full payload» do manual. */
  frente: number;
  tras: number;
};

const CASOS: Caso[] = [
  {
    id: 'ktm_890_adv_r_2021',
    nome: '890 Adventure R',
    cargaMaxKg: 235,
    fonte: 'Manual art. 3214536en: 450 kg autorizados, 200 kg sem combustível, 20 L de depósito',
    frente: 3,
    tras: 10,
  },
  {
    id: 'ktm_1290_adv_r_2021',
    nome: '1290 Super Adventure R',
    cargaMaxKg: 205,
    fonte: 'Manual art. 3214297en: 450 kg autorizados, 228 kg sem combustível, 23 L de depósito',
    frente: 6,
    tras: 26,
  },
];

let falhas = 0;

console.log('Pré-carga na carga máxima do manual\n');

for (const c of CASOS) {
  // A carga máxima do manual é o peso total que a mota pode levar — condutor incluído.
  // É esse total que as fórmulas recebem.
  const r = precarga(c.id, c.cargaMaxKg);

  if (!r) {
    console.log(`✗ ${c.nome}: perfil não encontrado (id ${c.id})`);
    falhas++;
    continue;
  }

  const frente = r.frente;
  const tras   = r.tras;
  const okF    = frente === c.frente;
  const okT    = tras   === c.tras;

  console.log(`${okF && okT ? '✓' : '✗'} ${c.nome} — ${c.cargaMaxKg} kg de carga`);
  console.log(`    frente  ${frente} voltas   (manual: ${c.frente})`);
  console.log(`    trás    ${tras} voltas   (manual: ${c.tras})`);

  if (!okF || !okT) {
    console.log(`    ${c.fonte}`);
    falhas++;
  }
  console.log();
}

if (falhas) {
  console.log(`✗ ${falhas} perfis não reproduzem o manual.`);
  console.log('  Ou o preloadKgPerTurn está mal, ou o valor base mudou, ou a fórmula mudou.');
  process.exit(1);
}

console.log('✓ Todos os perfis com pré-carga medida reproduzem a coluna do manual.');

// ─────────────────────────────────────────────────────────────────────────────
// Segunda verificação: pontos de carga acima da carga útil da mota
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Um ponto de carga acima do que a mota pode levar significa que o troço de cima da curva
 * está esticado — e a interpolação devolve de menos a toda a gente que ande carregada.
 *
 * Nem sempre é erro nosso: às vezes é o manual a contradizer-se, com a tabela de sugestões
 * a descrever uma configuração que excede a carga útil publicada noutra página. Esses casos
 * ficam aqui em baixo, com a razão. Qualquer caso NOVO faz o script falhar.
 */
const EXCEDENTES_CONHECIDOS: Record<string, string> = {
  cfmoto_700mt:
    'O manual contradiz-se. Carga útil de 165 kg, mas a tabela de sugestões da CFMoto tem ' +
    'uma linha «duas pessoas + três caixas» que, com as 40 kg de bagagem que a convenção ' +
    'assume, dá 190. Os valores são os que o fabricante manda pôr nessa configuração.',
  voge_625dsx:
    'Mesma contradição, mais pequena. Carga útil de 183 kg e o ponto de cima em 190 — a ' +
    'Voge descreve «condutor com passageiro e 3 malas» sem dizer quanto pesam as malas.',
};

console.log('\nPontos de carga contra a carga útil do manual\n');

let excedentes = 0;

for (const p of MFZ_PROFILES) {
  if (!p.payloadKg || !p.weightPoints?.length) continue;

  const topo = Math.max(...p.weightPoints.map(w => w.kg));
  const nome = `${p.brand} ${p.model}`;

  if (topo <= p.payloadKg) {
    console.log(`✓ ${nome.padEnd(30)} topo ${topo} kg   carga útil ${p.payloadKg} kg`);
    continue;
  }

  const conhecido = EXCEDENTES_CONHECIDOS[p.id];
  if (conhecido) {
    console.log(`~ ${nome.padEnd(30)} topo ${topo} kg   carga útil ${p.payloadKg} kg  (conhecido)`);
    continue;
  }

  console.log(`✗ ${nome.padEnd(30)} topo ${topo} kg   carga útil ${p.payloadKg} kg  ← NOVO`);
  excedentes++;
}

if (excedentes) {
  console.log(
    `\n✗ ${excedentes} perfis com o ponto de carga mais alto acima da carga útil.\n` +
    '  Ou os quilos do ponto estão mal, ou a carga útil está mal, ou é o manual a\n' +
    '  contradizer-se — nesse caso, juntar a EXCEDENTES_CONHECIDOS com a razão escrita.'
  );
  process.exit(1);
}

console.log('\n✓ Nenhum ponto de carga novo acima da carga útil.');
