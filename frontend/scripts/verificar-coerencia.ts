/**
 * verificar-coerencia.ts — apanha afinadores cuja curva de peso contradiz o sentido
 * de contagem declarado.
 *
 * A ideia é simples e não precisa de manual nenhum. Um afinador contado a partir do
 * MAIS DURO tem de DESCER com o peso: menos cliques abertos, mais firme. Um contado a
 * partir do MAIS MOLE tem de SUBIR. Se a tabela por carga anda ao contrário do `type`
 * declarado, uma das duas coisas está errada.
 *
 * Foi assim que a CFMOTO 1000MT-X se denunciou em agosto de 2026: tinha os quatro
 * afinadores de amortecimento marcados como contados desde o mole e a tabela do manual
 * descia com a carga. O manual confirmou depois que se conta desde o duro.
 *
 * Correr:  npm run verificar-coerencia
 *
 * Sai com código 1 se aparecer alguma suspeita que não esteja na lista `CONHECIDOS`.
 * Não precisa de rede nem de credenciais — lê só o ficheiro de dados.
 */

import { MFZ_PROFILES } from '../src/data/mfzSuspensionData';
import { BIKES, ADJUSTERS_BY_LEVEL } from '../src/data/bikes';

/**
 * Casos já investigados e deixados de propósito como estão, com a razão.
 * Só entram aqui depois de alguém ter olhado para eles — não é para calar avisos.
 */
const CONHECIDOS: Record<string, string> = {
  // (vazio) — a Voge 625 DSX saiu daqui em agosto de 2026, com o manual DS 625X à mão:
  // passou a cl_hard, alinhada com a 800 DSX Rally. Ver a nota do perfil.
};

type Campo = [chave: string, eixo: 'front' | 'rear', afinador: string];

const CAMPOS: Campo[] = [
  ['fPre', 'front', 'preload'], ['fComp', 'front', 'comp'], ['fReb', 'front', 'reb'],
  ['rPre', 'rear', 'preload'],  ['rComp', 'rear', 'comp'],  ['rReb', 'rear', 'reb'],
];

let verificados = 0;
let emMm = 0;
const novos: string[] = [];
const conhecidosVistos: string[] = [];

for (const p of MFZ_PROFILES as any[]) {
  const wp = p.weightPoints;
  if (!Array.isArray(wp) || wp.length < 2) continue;
  const pontos = [...wp].sort((a, b) => a.kg - b.kg);

  for (const [chave, eixo, afinador] of CAMPOS) {
    const tipo: string | undefined = p[eixo]?.[afinador]?.type;
    const vals = pontos.map(x => x[chave]).filter(v => typeof v === 'number') as number[];
    if (!tipo || vals.length < 2) continue;

    // Em milímetros o sinal depende da peça (rosca à vista, folga, comprimento de
    // mola), por isso não dá para inferir. Contam-se e diz-se quantos são.
    if (tipo === 'mm') { emMm++; continue; }
    if (!/_(hard|soft)$/.test(tipo)) continue;

    verificados++;
    const primeiro = vals[0];
    const ultimo = vals[vals.length - 1];
    const esperaSubir = tipo.endsWith('_soft');
    const contradiz = esperaSubir ? ultimo < primeiro : ultimo > primeiro;
    if (!contradiz) continue;

    const id = `${p.id}:${chave}`;
    const linha =
      `  ${p.id}  ${chave}  tipo=${tipo}  curva=[${vals.join(', ')}]  ` +
      (esperaSubir ? '→ devia SUBIR com o peso' : '→ devia DESCER com o peso');
    if (CONHECIDOS[id]) conhecidosVistos.push(linha + `\n      ${CONHECIDOS[id]}`);
    else novos.push(linha);
  }
}

console.log(`Afinadores com tabela por carga verificados: ${verificados}` +
            (emMm ? ` (mais ${emMm} em milímetros, que não dá para inferir)` : ''));

if (conhecidosVistos.length) {
  console.log(`\nJá investigados, deixados como estão (${conhecidosVistos.length}):`);
  console.log(conhecidosVistos.join('\n'));
}

// ── Segundo aviso: motos que correm à mercê da heurística ────────────────────
//
// O campo `adjusters` SÓ é lido nas motos sem `mfzProfileId` — nas outras manda o
// perfil. Nessas, se `adjusters` também não estiver preenchido, cai-se no default
// grosseiro do nível `adj`, e a heurística por categoria inventa um número para cada
// afinador que ela julga existir. É onde a app está mais perto de mostrar um valor
// para um parafuso que a moto não tem.

const semPerfil = (BIKES as any[]).filter(b => !b.mfzProfileId && !b.hidden);
const semExplicito = semPerfil.filter(b => !b.adjusters);

if (semExplicito.length) {
  console.log(
    `\nMotos visíveis sem perfil: ${semPerfil.length}. Destas, ${semExplicito.length} ` +
    'não dizem que afinadores têm e ficam no default do nível `adj`:',
  );
  const porNivel: Record<string, any[]> = {};
  for (const b of semExplicito) (porNivel[b.adj] ??= []).push(b);
  for (const nivel of Object.keys(porNivel).sort()) {
    const ativos = Object.entries((ADJUSTERS_BY_LEVEL as any)[nivel])
      .filter(([, v]) => v).map(([k]) => k).join(' ');
    console.log(`\n  adj="${nivel}" → a app assume ${ativos}  (${porNivel[nivel].length} motos)`);
    for (const b of porNivel[nivel]) console.log(`     ${b.brand} ${b.model}`);
  }
  console.log(
    '\n  Isto não é erro — é o limite de o não sabermos. Preencher `adjusters` numa\n' +
    '  destas exige fonte oficial que diga que afinadores a moto tem; a alternativa\n' +
    '  honesta, quando não há, é marcá-la `hidden`.',
  );
}

if (novos.length) {
  console.log(`\n✗ SUSPEITAS NOVAS (${novos.length}):`);
  console.log(novos.join('\n'));
  console.log(
    '\nUm destes dois está errado: o sentido de contagem ou a tabela por carga.\n' +
    'Cuidado ao decidir — quando o perfil veio de um chart do fabricante, a convenção\n' +
    'de contagem é a que o chart diz em rodapé, não a da secção de procedimento do\n' +
    'manual. Já apanhámos manuais que se contradizem entre os dois sítios.',
  );
  process.exit(1);
}

console.log('\n✓ Nenhuma suspeita nova.');
