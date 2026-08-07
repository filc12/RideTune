/**
 * oem-data.ts
 *
 * Fonte de dados OEM (catálogo de motas + dados de suspensão de fábrica).
 *
 * Estratégia de dados (por prioridade):
 *   1. Memória (sessão actual — iniciada com dados bundle)
 *   2. Cache AsyncStorage (resultado do último fetch Supabase)
 *   3. Supabase live fetch (actualizado em background)
 *   4. Bundle TypeScript (fallback offline garantido)
 *
 * A app arranca sempre com dados bundle (síncrono, zero latência).
 * Se o Supabase tiver dados mais recentes, actualiza em background
 * e guarda em cache para a próxima sessão.
 *
 * Como usar:
 *   - Chamar `initOemData()` no _layout.tsx (sem await) para iniciar o refresh
 *   - Usar `getOemBikes()` e `getOemSuspById()` em todo o código
 */

import { BIKES as BUNDLE_BIKES, type Bike, type BikeAdjusters, type BikeCategory, type SuspAdj } from '@/src/data/bikes';
import { MFZ_PROFILES as BUNDLE_PROFILES, type MfzProfile } from '@/src/data/mfzSuspensionData';
import { TIRE_PRESSURES as BUNDLE_PRESSURES } from '@/src/data/tirePressure';
import { storage } from '@/src/utils/storage';
import { captureError } from '@/src/services/sentry';

// ─── Config ───────────────────────────────────────────────────────────────────

const SUPABASE_URL      = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// v2: o cache v1 foi gravado sem conversão snake_case→camelCase, por isso os
// perfis CFMOTO ficaram sem `weightPoints`. Bumpar a chave descarta esse cache
// envenenado em vez de o manter até expirar.
const CACHE_KEY    = 'ridetune.oem_cache_v2';

/**
 * Idade a partir da qual se volta a pedir dados ao servidor.
 *
 * ATENÇÃO ao histórico disto: era de 7 dias E o arranque fazia `return` quando o
 * cache estava fresco, ou seja, nunca revalidava. O resultado é que uma moto nova
 * demorava até uma semana a chegar a quem já tinha a app instalada — e não havia
 * forma nenhuma de forçar. Deu queixas reais de utilizadores.
 *
 * Agora o arranque aplica o cache de imediato (para não atrasar o ecrã) e revalida
 * SEMPRE em segundo plano. Este intervalo já só serve para não repetir o pedido
 * quando a app é reaberta várias vezes seguidas.
 */
const REVALIDATE_AFTER_MS = 60 * 60 * 1000; // 1 hora

/** Evita pedidos simultâneos se o arranque e o botão de refresh coincidirem. */
let _inFlight: Promise<void> | null = null;

// ─── Types ────────────────────────────────────────────────────────────────────

export type TirePressure = {
  bikeId:          string;
  frontSoloBar:    number;
  frontLoadedBar:  number | null;  // null = igual ao solo
  rearSoloBar:     number;
  rearLoadedBar:   number | null;  // null = igual ao solo
  frontOffRoadBar: number | null;  // null = sem modo off-road
  rearOffRoadBar:  number | null;
  frontSize:       string | null;
  rearSize:        string | null;
  source:          string;
  dataQuality:     'oem_manual' | 'estimated_spec';
};

// ─── In-memory state (mutable, começa com bundle) ─────────────────────────────

let _bikes: Bike[]                     = [...BUNDLE_BIKES];
let _suspMap: Record<string, MfzProfile> = Object.fromEntries(
  BUNDLE_PROFILES.map(p => [p.id, p])
);
let _pressureMap: Record<string, TirePressure> = Object.fromEntries(
  BUNDLE_PRESSURES.map(p => [p.bikeId, p])
);

// ─── API pública (síncrona) ───────────────────────────────────────────────────

/** Catálogo completo, incluindo as motos marcadas `hidden`. */
export function getOemBikes(): Bike[] {
  return _bikes;
}

/**
 * O que se mostra no seletor de motos. Exclui as `hidden` — motos cujos afinadores
 * não deu para confirmar em fonte oficial e que por isso não devem ser oferecidas.
 * Usa esta em listagens; a getOemBikes() só para contagens internas ou diagnóstico.
 */
export function getSelectableOemBikes(): Bike[] {
  return _bikes.filter(b => !b.hidden);
}

/** Resolve por id SEM filtrar `hidden`, para não partir setups e diário já guardados. */
export function getOemBikeById(id: string): Bike | undefined {
  return _bikes.find(b => b.id === id);
}

export function getOemSuspById(profileId: string): MfzProfile | undefined {
  return _suspMap[profileId];
}

export function getOemSuspMap(): Record<string, MfzProfile> {
  return _suspMap;
}

export function getOemTirePressure(bikeId: string): TirePressure | undefined {
  return _pressureMap[bikeId];
}

// ─── Inicialização (chamar no app start) ─────────────────────────────────────

/**
 * Inicia os dados OEM:
 *   - Carrega cache do AsyncStorage (se disponível)
 *   - Lança refresh do Supabase em background se cache estiver vazio/stale
 *
 * Não precisa de await — a app usa dados bundle enquanto o fetch corre.
 */
export async function initOemData(): Promise<void> {
  let ageMs = Infinity;

  try {
    const raw = await storage.getItem<string>(CACHE_KEY, '');
    if (raw) {
      const cached: OemCache = JSON.parse(raw);
      ageMs = Date.now() - (cached.cachedAt ?? 0);

      // Aplicar dados de cache imediatamente para o ecrã não esperar por rede.
      if (cached.bikes?.length)      _applyBikes(cached.bikes);
      if (cached.suspension?.length) _applySuspension(cached.suspension);
      if (cached.pressure?.length)   _applyPressure(cached.pressure);
    }
  } catch {
    // cache inválido — continuar com bundle
  }

  // Revalidar em segundo plano. NÃO fazer `return` aqui quando o cache é recente:
  // era isso que impedia as motos novas de chegarem a quem já tinha a app.
  if (ageMs >= REVALIDATE_AFTER_MS) {
    _refreshOnce().catch(() => {/* falha silenciosa — fica o cache */});
  }
}

// ─── Refresh forçado (botão nas definições) ──────────────────────────────────

/**
 * Vai buscar dados novos e devolve true se conseguiu.
 * Usado pelo botão "Atualizar dados" — a única forma de o utilizador destrancar
 * uma moto acabada de acrescentar sem esperar pela revalidação automática.
 */
export async function refreshOemData(): Promise<boolean> {
  try {
    await _refreshOnce();
    return true;
  } catch {
    return false;
  }
}

/** Partilha o pedido em curso, para o arranque e o botão não duplicarem tráfego. */
function _refreshOnce(): Promise<void> {
  if (!_inFlight) {
    _inFlight = _fetchFromSupabase().finally(() => { _inFlight = null; });
  }
  return _inFlight;
}

// ─── Internals ────────────────────────────────────────────────────────────────

type DbTirePressureRow = {
  bike_id:           string;
  front_solo_bar:    number;
  front_loaded_bar:  number | null;
  rear_solo_bar:     number;
  rear_loaded_bar:   number | null;
  front_offroad_bar: number | null;
  rear_offroad_bar:  number | null;
  front_size:        string | null;
  rear_size:         string | null;
  source:            string;
  data_quality:      string;
};

type DbBikeRow = {
  id: string;
  brand: string;
  model: string;
  cc: string;
  category: string;
  adj: string;
  /** Optional jsonb column. Se não existir, resolveAdjusters() usa o default de `adj`. */
  adjusters: BikeAdjusters | null;
  /** Coluna opcional. Se não existir, a moto conta como visível. */
  hidden: boolean | null;
  mfz_profile_id: string | null;
};

/**
 * Linha da tabela `oem_suspension` — Postgres usa snake_case.
 * ATENÇÃO: tem de ser convertida para camelCase antes de entrar no _suspMap.
 * Se `weight_points` não for mapeado para `weightPoints`, os perfis com
 * formula 'cfmoto_interp' perdem os pontos de peso e ficam congelados no valor
 * base (applyFormula não tem branch para 'cfmoto_interp').
 */
type DbSuspRow = {
  id:            string;
  brand:         string;
  model:         string;
  year:          string;
  base_kg:       number;
  source:        string;
  formula:       string;
  front:         MfzProfile['front'];
  rear:          MfzProfile['rear'];
  weight_points: MfzProfile['weightPoints'] | null;
  preload_kg_per_turn: MfzProfile['preloadKgPerTurn'] | null;
  payload_kg: number | null;
  count_note:    string | null;
  notes:         string | null;
  data_quality:  string | null;
};

type OemCache = {
  cachedAt:    number;
  bikes:       Bike[];
  suspension:  MfzProfile[];
  pressure:    TirePressure[];
};

async function _fetchFromSupabase(): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    Accept: 'application/json',
  };

  const [bikesRes, suspRes, pressureRes] = await Promise.all([
    fetch(
      `${SUPABASE_URL}/rest/v1/oem_bikes?select=*&active=eq.true&order=brand,model`,
      { headers }
    ),
    fetch(
      `${SUPABASE_URL}/rest/v1/oem_suspension?select=*&active=eq.true`,
      { headers }
    ),
    fetch(
      `${SUPABASE_URL}/rest/v1/oem_tire_pressure?select=*&active=eq.true`,
      { headers }
    ),
  ]);

  if (!bikesRes.ok || !suspRes.ok || !pressureRes.ok) {
    throw new Error(
      `Supabase OEM fetch failed: bikes=${bikesRes.status} susp=${suspRes.status} pressure=${pressureRes.status}`
    );
  }

  const rawBikes:    DbBikeRow[]          = await bikesRes.json();
  const rawSusp:     DbSuspRow[]          = await suspRes.json();
  const rawPressure: DbTirePressureRow[]  = await pressureRes.json();

  if (!rawBikes.length || !rawSusp.length) return;

  // Converter snake_case → camelCase para suspensão
  const suspension: MfzProfile[] = rawSusp.map(row => ({
    id:           row.id,
    brand:        row.brand,
    model:        row.model,
    year:         row.year,
    baseKg:       row.base_kg,
    source:       row.source,
    formula:      row.formula as MfzProfile['formula'],
    front:        row.front,
    rear:         row.rear,
    weightPoints: row.weight_points ?? undefined,
    // Ritmo de pré-carga medido no manual desta mota. Ausente na esmagadora maioria
    // das linhas, e isso é o normal — sem ele a mota segue a fórmula da marca.
    preloadKgPerTurn: row.preload_kg_per_turn ?? undefined,
    payloadKg:        row.payload_kg ?? undefined,
    countNote:    row.count_note ?? undefined,
    notes:        row.notes ?? undefined,
    dataQuality:  (row.data_quality ?? undefined) as MfzProfile['dataQuality'],
  }));

  // Converter snake_case → camelCase para bikes
  const bikes: Bike[] = rawBikes.map(row => ({
    id:           row.id,
    brand:        row.brand,
    model:        row.model,
    cc:           row.cc,
    category:     row.category as BikeCategory,
    adj:          row.adj as SuspAdj,
    adjusters:    row.adjusters ?? undefined,
    hidden:       row.hidden ?? undefined,
    mfzProfileId: row.mfz_profile_id ?? undefined,
  }));

  // Converter snake_case → camelCase para pressão
  const pressure: TirePressure[] = rawPressure.map(row => ({
    bikeId:          row.bike_id,
    frontSoloBar:    row.front_solo_bar,
    frontLoadedBar:  row.front_loaded_bar,
    rearSoloBar:     row.rear_solo_bar,
    rearLoadedBar:   row.rear_loaded_bar,
    frontOffRoadBar: row.front_offroad_bar,
    rearOffRoadBar:  row.rear_offroad_bar,
    frontSize:       row.front_size,
    rearSize:        row.rear_size,
    source:          row.source,
    dataQuality:     row.data_quality as TirePressure['dataQuality'],
  }));

  _applyBikes(bikes);
  _applySuspension(suspension);
  _applyPressure(pressure);

  // Guardar cache
  try {
    const entry: OemCache = { cachedAt: Date.now(), bikes, suspension, pressure };
    await storage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch (e) {
    captureError(e, { context: 'oem-data cache write' });
  }
}

function _applyBikes(bikes: Bike[]): void {
  if (bikes.length) _bikes = bikes;
}

function _applySuspension(profiles: MfzProfile[]): void {
  if (profiles.length) {
    _suspMap = Object.fromEntries(profiles.map(p => [p.id, p]));
  }
}

function _applyPressure(entries: TirePressure[]): void {
  if (entries.length) {
    _pressureMap = Object.fromEntries(entries.map(p => [p.bikeId, p]));
  }
}
