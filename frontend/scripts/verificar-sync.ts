/**
 * verificar-sync.ts — compara o bundle local com o Supabase.
 *
 * O `tirePressure.ts` e o `mfzSuspensionData.ts` são o que a app mostra no primeiro
 * arranque e offline, antes de o fetch do Supabase chegar. Se divergirem da base, o
 * utilizador vê números errados durante essa janela — e foi exatamente o que aconteceu:
 * em agosto de 2026 havia 49 de 119 pressões desfasadas, incluindo medidas de pneu
 * simplesmente erradas (R1 com 190/55 quando calça 200/55).
 *
 * Correr:  npm run verificar-sync
 *
 * Sai com código 1 se houver qualquer diferença, para poder entrar num hook ou em CI.
 * Precisa do EXPO_PUBLIC_SUPABASE_URL e da EXPO_PUBLIC_SUPABASE_ANON_KEY — lê-os do
 * ambiente ou, se não estiverem lá, do .env.local.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

import { TIRE_PRESSURES } from '../src/data/tirePressure';
import { MFZ_PROFILES } from '../src/data/mfzSuspensionData';

// ── Ambiente ──────────────────────────────────────────────────────────────────
// Corre-se a partir de frontend/ (`npm run verificar-sync`), mas aceita-se também
// a raiz do repositório para o caso de ser chamado de um hook.

const CANDIDATOS = [process.cwd(), join(process.cwd(), 'frontend')];

function lerEnv(nome: string): string {
  if (process.env[nome]) return process.env[nome] as string;
  for (const raiz of CANDIDATOS) {
    for (const ficheiro of ['.env.local', '.env']) {
      try {
        const texto = readFileSync(join(raiz, ficheiro), 'utf8');
        const linha = texto.split('\n').find(l => l.trim().startsWith(nome + '='));
        if (linha) return linha.slice(linha.indexOf('=') + 1).trim();
      } catch { /* ficheiro não existe, tenta o seguinte */ }
    }
  }
  throw new Error(
    `Falta ${nome}. Põe-no no ambiente ou no frontend/.env.local.`
  );
}

const URL_BASE = lerEnv('EXPO_PUBLIC_SUPABASE_URL').replace(/\/+$/, '');
const CHAVE = lerEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');

async function buscar(tabela: string): Promise<any[]> {
  const r = await fetch(`${URL_BASE}/rest/v1/${tabela}?select=*&active=eq.true`, {
    headers: { apikey: CHAVE, Authorization: `Bearer ${CHAVE}` },
  });
  if (!r.ok) throw new Error(`${tabela}: HTTP ${r.status} ${await r.text()}`);
  return r.json();
}

// ── Normalização ──────────────────────────────────────────────────────────────
// Os dois lados têm de produzir exatamente a mesma string para o mesmo valor.
// Os numéricos vêm do Postgres como string ("2.50") e do TS como number (2.5).

const n2 = (v: unknown) => (v == null || v === '' ? '' : Number(v).toFixed(2));
const n3 = (v: unknown) => (v == null || v === '' ? '' : Number(v).toFixed(3));
const s = (v: unknown) => (v == null ? '' : String(v));

/** Um eixo: preload/comp/reb, cada um com valor e tipo de contagem. */
const eixo = (a: any) =>
  (['preload', 'comp', 'reb'] as const)
    .map(k => {
      const c = a?.[k];
      return c ? `${k}:${n3(c.v)}/${c.type}` : `${k}:-`;
    })
    .join(',');

/** Só os pontos de peso, que é o que importa comparar sem depender da ordem das chaves. */
const pontosPeso = (w: any) =>
  Array.isArray(w) ? w.map((x: any) => s(x.kg)).join('+') : '';

type Campos = Record<string, string>;

function camposPressao(o: any, daBase: boolean): Campos {
  const g = (ts: string, db: string) => (daBase ? o[db] : o[ts]);
  return {
    frenteSolo: n2(g('frontSoloBar', 'front_solo_bar')),
    frenteCarga: n2(g('frontLoadedBar', 'front_loaded_bar')),
    trasSolo: n2(g('rearSoloBar', 'rear_solo_bar')),
    trasCarga: n2(g('rearLoadedBar', 'rear_loaded_bar')),
    frenteTT: n2(g('frontOffRoadBar', 'front_offroad_bar')),
    trasTT: n2(g('rearOffRoadBar', 'rear_offroad_bar')),
    medidaFrente: s(g('frontSize', 'front_size')),
    medidaTras: s(g('rearSize', 'rear_size')),
    qualidade: s(g('dataQuality', 'data_quality')),
    fonte: s(g('source', 'source')),
  };
}

function camposSuspensao(o: any, daBase: boolean): Campos {
  const g = (ts: string, db: string) => (daBase ? o[db] : o[ts]);
  return {
    marca: s(g('brand', 'brand')),
    modelo: s(g('model', 'model')),
    ano: s(g('year', 'year')),
    pesoBase: s(g('baseKg', 'base_kg')),
    formula: s(g('formula', 'formula')),
    qualidade: s(g('dataQuality', 'data_quality')),
    frente: eixo(g('front', 'front')),
    tras: eixo(g('rear', 'rear')),
    pontosPeso: pontosPeso(g('weightPoints', 'weight_points')),
    fonte: s(g('source', 'source')),
  };
}

// ── Comparação ────────────────────────────────────────────────────────────────

function comparar(
  nome: string,
  local: any[],
  base: any[],
  chaveLocal: (o: any) => string,
  chaveBase: (o: any) => string,
  campos: (o: any, daBase: boolean) => Campos,
): number {
  const mLocal = new Map(local.map(o => [chaveLocal(o), o]));
  const mBase = new Map(base.map(o => [chaveBase(o), o]));
  const ids = [...new Set([...mLocal.keys(), ...mBase.keys()])].sort();

  let problemas = 0;
  const linhas: string[] = [];

  for (const id of ids) {
    const a = mLocal.get(id);
    const b = mBase.get(id);
    if (!a) { linhas.push(`  ${id}: só existe no Supabase`); problemas++; continue; }
    if (!b) { linhas.push(`  ${id}: só existe no código`); problemas++; continue; }

    const ca = campos(a, false);
    const cb = campos(b, true);
    const diff = Object.keys(ca).filter(k => ca[k] !== cb[k]);
    if (diff.length) {
      problemas++;
      linhas.push(`  ${id}`);
      for (const k of diff) {
        const corta = (v: string) => (v.length > 70 ? v.slice(0, 67) + '...' : v || '(vazio)');
        linhas.push(`      ${k}: código=${corta(ca[k])}  base=${corta(cb[k])}`);
      }
    }
  }

  const total = Math.max(mLocal.size, mBase.size);
  if (problemas === 0) {
    console.log(`✓ ${nome}: ${total} linhas, tudo igual`);
  } else {
    console.log(`✗ ${nome}: ${problemas} de ${total} com diferenças`);
    console.log(linhas.join('\n'));
  }
  return problemas;
}

// ── Principal ─────────────────────────────────────────────────────────────────

async function principal() {
  const [pressoesBase, suspensaoBase] = await Promise.all([
    buscar('oem_tire_pressure'),
    buscar('oem_suspension'),
  ]);

  const p = comparar(
    'Pressões', TIRE_PRESSURES, pressoesBase,
    (o: any) => o.bikeId, (o: any) => o.bike_id, camposPressao,
  );
  const su = comparar(
    'Suspensão', MFZ_PROFILES, suspensaoBase,
    (o: any) => o.id, (o: any) => o.id, camposSuspensao,
  );

  if (p + su > 0) {
    console.log(
      '\nO bundle local e o Supabase divergem. Decide qual dos lados está certo\n' +
      'antes de publicar: o local é o que a app mostra offline e no primeiro arranque.',
    );
    process.exit(1);
  }
  console.log('\nBundle local e Supabase estão sincronizados.');
}

principal().catch(e => {
  console.error('Erro:', e.message);
  process.exit(2);
});
