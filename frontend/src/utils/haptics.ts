import * as Haptics from "expo-haptics";
import { storage } from "@/src/utils/storage";

const K_HAPTICS = "ridetune.haptics";

// Flag em memória para não ir ao storage (async) a cada toque.
// Default: ligado. É sobreposto por loadHapticsPref() no arranque da app.
let enabled = true;

/** Carregar a preferência do utilizador. Chamar uma vez no _layout.tsx. */
export async function loadHapticsPref(): Promise<void> {
  const v = await storage.getItem<string>(K_HAPTICS, "true");
  enabled = v !== "false";
}

/** Estado atual (síncrono) — para inicializar o toggle nas Definições. */
export function isHapticsEnabled(): boolean {
  return enabled;
}

/** Ligar/desligar o retorno tátil. Persiste e atualiza a flag em memória. */
export async function setHapticsEnabled(value: boolean): Promise<void> {
  enabled = value;
  await storage.setItem(K_HAPTICS, value ? "true" : "false");
}

/** Toque leve — botões normais, navegação. */
export function tapLight() {
  if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/** Toque médio — escolhas que mudam estado (mota, cenário). */
export function tapMedium() {
  if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/** Sucesso — gravar / confirmar. Duplo "tá-tá" nativo no iOS. */
export function tapSuccess() {
  if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/** Aviso — ação bloqueada (ex.: gate premium). */
export function tapWarning() {
  if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}
