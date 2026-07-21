/**
 * premium.ts — RideTune freemium system.
 */
import { storage } from "@/src/utils/storage";

const K_PREMIUM = "ridetune.premium";
const K_PREMIUM_SOURCE = "ridetune.premium.source";
/** Timestamp (ms) da última validação do entitlement junto da loja. */
const K_PREMIUM_VERIFIED_AT = "ridetune.premium.verified_at";

type PremiumSource = "store" | "dev";

let storePremiumVerifiedThisSession = false;

/**
 * Período de tolerância offline.
 *
 * O `storePremiumVerifiedThisSession` arranca a false em cada abertura da app
 * e só fica true se o RevenueCat responder. Sem tolerância, quem pagou perdia
 * o Premium sempre que abrisse a app sem rede — que numa app de mota é
 * precisamente quando mais falta faz.
 *
 * Com tolerância: se a loja confirmou o entitlement há menos de 14 dias,
 * confiamos na cache local. Refunds e cancelamentos continuam a refletir-se,
 * só que com um atraso máximo de 14 dias sem rede.
 */
const PREMIUM_GRACE_MS = 14 * 24 * 60 * 60 * 1000;

async function withinGracePeriod(): Promise<boolean> {
  const at = await storage.getItem<number>(K_PREMIUM_VERIFIED_AT, 0);
  if (!at || typeof at !== "number") return false;
  const age = Date.now() - at;
  // age < 0 => relógio do device andou para trás; não confiar.
  return age >= 0 && age < PREMIUM_GRACE_MS;
}

export const isForceFreeBuild = process.env.EXPO_PUBLIC_FORCE_FREE === "true";

export const canUseDevPremiumUnlock =
  !isForceFreeBuild && __DEV__ && process.env.EXPO_PUBLIC_ENABLE_DEV_PREMIUM_UNLOCK === "true";

export const PLAN_LIMITS = {
  free: {
    maxBikes:    1,
    maxProfiles: 1,
    maxSetups:   0,
    loadModes:   ["solo"] as string[],
    languages:   ["en", "pt", "es", "fr", "de", "it"] as string[], // all languages free (lower entry barrier)
  },
  premium: {
    maxBikes:    Infinity,
    maxProfiles: Infinity,
    maxSetups:   Infinity,
    loadModes:   ["solo", "malas", "duo", "duo_malas"] as string[],
    languages:   ["en", "pt", "es", "fr", "de", "it"] as string[],
  },
} as const;

export async function getPremiumStatus(): Promise<boolean> {
  if (isForceFreeBuild) return false;

  const val = await storage.getItem<string>(K_PREMIUM, "false");
  const active = val === "true" || val === (true as never);
  if (!active) return false;

  const source = await storage.getItem<PremiumSource>(K_PREMIUM_SOURCE, "dev");

  if (source === "store") {
    // Validado nesta sessão, ou validado há pouco tempo (offline / arranque
    // ainda a decorrer). Ver PREMIUM_GRACE_MS.
    return storePremiumVerifiedThisSession || (await withinGracePeriod());
  }

  return canUseDevPremiumUnlock && source === "dev";
}

export async function setPremiumStatusForTesting(value: boolean): Promise<void> {
  if (!canUseDevPremiumUnlock) {
    await storage.setItem(K_PREMIUM, "false");
    await storage.removeItem(K_PREMIUM_SOURCE);
    await storage.removeItem(K_PREMIUM_VERIFIED_AT);
    return;
  }
  await storage.setItem(K_PREMIUM, value ? "true" : "false");
  await storage.setItem(K_PREMIUM_SOURCE, "dev");
}

export async function setPremiumStatusFromStore(value: boolean): Promise<void> {
  storePremiumVerifiedThisSession = value;

  if (isForceFreeBuild) {
    await storage.setItem(K_PREMIUM, "false");
    await storage.removeItem(K_PREMIUM_SOURCE);
    await storage.removeItem(K_PREMIUM_VERIFIED_AT);
    return;
  }

  await storage.setItem(K_PREMIUM, value ? "true" : "false");
  if (value) {
    await storage.setItem(K_PREMIUM_SOURCE, "store");
    // Marca o início do período de tolerância offline.
    await storage.setItem(K_PREMIUM_VERIFIED_AT, Date.now());
  } else {
    // A loja disse explicitamente que não há entitlement (refund, cancelamento):
    // limpar a tolerância para o acesso cessar já.
    await storage.removeItem(K_PREMIUM_SOURCE);
    await storage.removeItem(K_PREMIUM_VERIFIED_AT);
  }
}

export async function isPremium(): Promise<boolean> {
  return getPremiumStatus();
}

export async function getCurrentPlan(): Promise<"free" | "premium"> {
  return (await isPremium()) ? "premium" : "free";
}

export async function getPlanLimits() {
  const plan = await getCurrentPlan();
  return PLAN_LIMITS[plan];
}

export async function canAddBike(currentCount: number): Promise<boolean> {
  if (await isPremium()) return true;
  return currentCount < PLAN_LIMITS.free.maxBikes;
}

export async function canUseLoadMode(mode: string): Promise<boolean> {
  if (await isPremium()) return true;
  return PLAN_LIMITS.free.loadModes.includes(mode);
}

export async function canCreateProfile(currentCount: number): Promise<boolean> {
  if (await isPremium()) return true;
  return currentCount < PLAN_LIMITS.free.maxProfiles;
}

export async function canSaveSetup(): Promise<boolean> {
  return isPremium();
}

export async function canUseLanguage(lang: string): Promise<boolean> {
  if (await isPremium()) return true;
  return PLAN_LIMITS.free.languages.includes(lang);
}
