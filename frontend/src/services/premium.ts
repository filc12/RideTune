/**
 * premium.ts — RideTune freemium system.
 */
import { storage } from "@/src/utils/storage";

const K_PREMIUM = "ridetune.premium";
const K_PREMIUM_SOURCE = "ridetune.premium.source";

type PremiumSource = "store" | "dev";

let storePremiumVerifiedThisSession = false;

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
  return (source === "store" && storePremiumVerifiedThisSession) || (canUseDevPremiumUnlock && source === "dev");
}

export async function setPremiumStatusForTesting(value: boolean): Promise<void> {
  if (!canUseDevPremiumUnlock) {
    await storage.setItem(K_PREMIUM, "false");
    await storage.removeItem(K_PREMIUM_SOURCE);
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
    return;
  }

  await storage.setItem(K_PREMIUM, value ? "true" : "false");
  if (value) {
    await storage.setItem(K_PREMIUM_SOURCE, "store");
  } else {
    await storage.removeItem(K_PREMIUM_SOURCE);
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
