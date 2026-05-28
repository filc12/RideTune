import * as Haptics from "expo-haptics";

/** Toque leve — botões normais, navegação. */
export function tapLight() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/** Toque médio — escolhas que mudam estado (mota, cenário). */
export function tapMedium() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/** Sucesso — gravar / confirmar. Duplo "tá-tá" nativo no iOS. */
export function tapSuccess() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/** Aviso — ação bloqueada (ex.: gate premium). */
export function tapWarning() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}
