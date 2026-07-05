/**
 * purchases.ts — RideTune in-app purchases via RevenueCat.
 *
 * Produto: compra única vitalícia (ridetune_premium_lifetime).
 * Entitlement no RevenueCat: "premium".
 *
 * O módulo nativo (react-native-purchases) é carregado com lazy require
 * para a app não crashar em Expo Go — no Expo Go as funções degradam
 * graciosamente (isBillingAvailable() === false).
 *
 * Fonte de verdade: entitlement do RevenueCat. A flag local (premium.ts)
 * funciona como cache offline e é sincronizada em cada arranque.
 */
import { setPremiumStatusForTesting } from "@/src/services/premium";

export const ENTITLEMENT_ID = "premium";

const API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PurchasesModule = any;

let configured = false;
let available: boolean | null = null;

function getPurchases(): PurchasesModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("react-native-purchases");
    return mod.default ?? mod;
  } catch {
    return null; // Expo Go / módulo nativo ausente
  }
}

export function isBillingAvailable(): boolean {
  if (available === null) available = getPurchases() !== null && API_KEY_ANDROID.length > 0;
  return available;
}

/** Chamar uma vez no arranque da app (não bloqueia; falha em silêncio). */
export async function initPurchases(): Promise<void> {
  const Purchases = getPurchases();
  if (!Purchases || !API_KEY_ANDROID || configured) return;
  try {
    Purchases.configure({ apiKey: API_KEY_ANDROID });
    configured = true;
    // sync do estado real → cache local (cobre reinstalações e refunds)
    await syncPremiumFromStore();
  } catch {
    /* offline no arranque — cache local mantém-se */
  }
}

async function applyCustomerInfo(info: { entitlements: { active: Record<string, unknown> } }): Promise<boolean> {
  const active = !!info?.entitlements?.active?.[ENTITLEMENT_ID];
  await setPremiumStatusForTesting(active);
  return active;
}

/** Revalida o entitlement junto do RevenueCat e atualiza a cache local. */
export async function syncPremiumFromStore(): Promise<boolean> {
  const Purchases = getPurchases();
  if (!Purchases || !configured) return false;
  try {
    const info = await Purchases.getCustomerInfo();
    return await applyCustomerInfo(info);
  } catch {
    return false;
  }
}

/** Preço localizado do produto vitalício (ex.: "14,99 €"), ou null se indisponível. */
export async function getLifetimePrice(): Promise<string | null> {
  const Purchases = getPurchases();
  if (!Purchases || !configured) return null;
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings?.current?.availablePackages?.[0];
    return pkg?.product?.priceString ?? null;
  } catch {
    return null;
  }
}

export type PurchaseResult = "purchased" | "cancelled" | "error" | "unavailable";

/** Fluxo de compra do vitalício. Atualiza a flag premium em caso de sucesso. */
export async function purchaseLifetime(): Promise<PurchaseResult> {
  const Purchases = getPurchases();
  if (!Purchases || !configured) return "unavailable";
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings?.current?.availablePackages?.[0];
    if (!pkg) return "unavailable";
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const active = await applyCustomerInfo(customerInfo);
    return active ? "purchased" : "error";
  } catch (e) {
    const err = e as { userCancelled?: boolean };
    if (err?.userCancelled) return "cancelled";
    return "error";
  }
}

/** Restaurar compras (reinstalação / novo dispositivo). */
export async function restorePurchases(): Promise<boolean> {
  const Purchases = getPurchases();
  if (!Purchases || !configured) return false;
  try {
    const info = await Purchases.restorePurchases();
    return await applyCustomerInfo(info);
  } catch {
    return false;
  }
}
