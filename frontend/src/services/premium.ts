/**
 * premium.ts — RideTune freemium system.
 */
import { storage } from "@/src/utils/storage";

const K_PREMIUM = "ridetune.premium";

export const PLAN_LIMITS = {
  free: {
    maxBikes:    1,
    maxProfiles: 1,
    maxSetups:   0,
    loadModes:   ["solo"] as string[],
    languages:   ["en", "es"] as string[],
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
  const val = await storage.getItem<string>(K_PREMIUM, "false");
  return val === "true" || val === (true as never);
}

export async function setPremiumStatusForTesting(value: boolean): Promise<void> {
  await storage.setItem(K_PREMIUM, value ? "true" : "false");
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
