/**
 * analytics.ts — PostHog analytics wrapper para o RideTune.
 *
 * Princípios:
 *   - Zero PII: nenhum nome, email, ou dado identificável é enviado.
 *   - Eventos tipados: todas as propriedades são definidas aqui.
 *   - Graceful no-op: se o PostHog não estiver configurado, tudo falha silenciosamente.
 *   - Não rastreia em __DEV__ por defeito (pode ser forçado com EXPO_PUBLIC_ANALYTICS_DEV).
 *
 * Eventos instrumentados:
 *   onboarding_completed   — utilizador termina o onboarding
 *   bike_selected          — utilizador escolhe uma mota
 *   setup_calculated       — cálculo de suspensão executado
 *   setup_saved            — utilizador guarda um setup
 *   premium_modal_shown    — paywall apareceu
 *   premium_converted      — utilizador activou premium (dev toggle = false)
 *   backup_exported        — backup JSON exportado com sucesso
 *   backup_imported        — backup JSON importado com sucesso
 *   diary_entry_created    — nova entrada no diário de viagem
 *   language_changed       — utilizador mudou idioma
 *   screen_viewed          — ecrã principal visitado
 */

import PostHog from 'posthog-react-native';
import { captureError } from '@/src/services/sentry';

// ─── Config ───────────────────────────────────────────────────────────────────

const PH_KEY  = process.env.EXPO_PUBLIC_POSTHOG_KEY  ?? '';
const PH_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com';
const FORCE_DEV = process.env.EXPO_PUBLIC_ANALYTICS_DEV === 'true';
const ENABLED   = Boolean(PH_KEY) && (!__DEV__ || FORCE_DEV);

// ─── Instância singleton ──────────────────────────────────────────────────────

let _ph: PostHog | null = null;

export function initAnalytics(): void {
  if (!ENABLED || _ph) return;
  try {
    _ph = new PostHog(PH_KEY, {
      host:               PH_HOST,
      // Flush a cada 20 eventos ou 30s (bom balanço para mobile)
      flushAt:            20,
      flushInterval:      30000,
      // Não capturar ecrãs automaticamente (controlamos nós)
      captureAppLifecycleEvents: false,
      // Session recording não está disponível nesta versão do SDK
    });
  } catch (e) {
    captureError(e, { context: 'initAnalytics' });
  }
}

/** Associar um identificador anónimo ao utilizador (ex: UUID guardado localmente). */
export function identifyUser(anonymousId: string, isPremium: boolean): void {
  if (!_ph) return;
  try {
    _ph.identify(anonymousId, { is_premium: isPremium });
  } catch (e) {
    captureError(e, { context: 'analytics.identify' });
  }
}

export function resetAnalyticsUser(): void {
  if (!_ph) return;
  try { _ph.reset(); } catch { /* silent */ }
}

// ─── Track helper ─────────────────────────────────────────────────────────────

function track(event: string, props?: Record<string, unknown>): void {
  if (!_ph) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _ph.capture(event, props as any);
  } catch (e) {
    captureError(e, { context: `analytics.track.${event}` });
  }
}

// ─── Eventos tipados ─────────────────────────────────────────────────────────

export const Analytics = {

  /** Utilizador terminou o onboarding (primeira execução). */
  onboardingCompleted(): void {
    track('onboarding_completed');
  },

  /** Utilizador seleccionou uma mota no picker. */
  bikeSelected(props: {
    bike_id:   string;
    brand:     string;
    category:  string;
    adj:       string;            // 'full' | 'partial' | 'fixed'
    has_oem_data: boolean;
  }): void {
    track('bike_selected', props);
  },

  /** Cálculo de suspensão executado. */
  setupCalculated(props: {
    confidence:    string;        // 'real_oem' | 'real_mfz' | 'brand_formula' | 'category_estimate'
    load_mode:     string;        // 'solo' | 'duo' | 'luggage' | 'duo_luggage'
    total_kg:      number;
    is_premium:    boolean;
  }): void {
    track('setup_calculated', props);
  },

  /** Utilizador guardou um setup nomeado. */
  setupSaved(props: {
    confidence: string;
    is_premium: boolean;
  }): void {
    track('setup_saved', props);
  },

  /** Paywall apareceu. */
  premiumModalShown(props: {
    feature: string;              // ex: 'premium.feature.languages'
  }): void {
    track('premium_modal_shown', props);
  },

  /** Utilizador activou premium (apenas se não for via dev toggle). */
  premiumConverted(): void {
    track('premium_converted');
  },

  /** Backup exportado com sucesso. */
  backupExported(): void {
    track('backup_exported');
  },

  /** Backup importado com sucesso. */
  backupImported(): void {
    track('backup_imported');
  },

  /** Nova entrada no diário de viagem. */
  diaryEntryCreated(): void {
    track('diary_entry_created');
  },

  /** Utilizador mudou o idioma. */
  languageChanged(props: { lang: string }): void {
    track('language_changed', props);
  },

  /** Ecrã principal visitado (tabs). */
  screenViewed(props: { screen: string }): void {
    track('screen_viewed', props);
  },

  /** Utilizador entrou em diagnóstico de sag. */
  sagDiagnosticStarted(): void {
    track('sag_diagnostic_started');
  },
};
