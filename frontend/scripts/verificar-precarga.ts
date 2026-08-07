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
