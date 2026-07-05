/**
 * sentry.ts — Crash reporting wrapper para o RideTune.
 *
 * Setup:
 *   1. npx expo install @sentry/react-native
 *   2. Adicionar EXPO_PUBLIC_SENTRY_DSN ao .env
 *   3. Criar projeto em sentry.io → Settings → Client Keys → DSN
 */
import * as SentryLib from "@sentry/react-native";

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? "";

/**
 * Inicializa o Sentry. Chamar antes de qualquer render (em _layout.tsx).
 * Em desenvolvimento, o Sentry está desligado a menos que se force com EXPO_PUBLIC_SENTRY_FORCE_DEV=true.
 */
export function initSentry(): void {
  if (!DSN) {
    if (__DEV__) console.warn("[Sentry] DSN não configurado — crashes não serão reportados.");
    return;
  }

  const forceDev = process.env.EXPO_PUBLIC_SENTRY_FORCE_DEV === "true";

  SentryLib.init({
    dsn: DSN,
    environment: __DEV__ ? "development" : "production",
    enabled: !__DEV__ || forceDev,
    // Captura 20% das transações de performance
    tracesSampleRate: 0.2,
    // Ignora erros de rede comuns que não são bugs da app
    ignoreErrors: [
      "Network request failed",
      "AbortError",
    ],
  });
}

/**
 * Captura uma exceção manualmente com contexto extra opcional.
 * Em dev, apenas faz console.error.
 */
export function captureError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  if (__DEV__) {
    console.error("[Sentry captureError]", error, context ?? "");
    return;
  }
  SentryLib.withScope((scope) => {
    if (context) scope.setExtras(context);
    SentryLib.captureException(error);
  });
}

/**
 * Captura uma mensagem informativa (não-erro).
 * Útil para rastrear eventos críticos sem ser crashes.
 */
export function captureMessage(
  message: string,
  level: SentryLib.SeverityLevel = "info"
): void {
  if (__DEV__) {
    console.info(`[Sentry] ${level}: ${message}`);
    return;
  }
  SentryLib.captureMessage(message, level);
}

/**
 * Define o contexto do utilizador (para associar crashes a sessões).
 * Chamar com null para fazer logout.
 */
export function setSentryUser(userId: string | null): void {
  SentryLib.setUser(userId ? { id: userId } : null);
}

/**
 * HOC para envolver o componente raiz com o ErrorBoundary do Sentry.
 * Usar em _layout.tsx: export default Sentry.wrap(RootLayout)
 */
export const Sentry = SentryLib;
