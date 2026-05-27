/**
 * profiles.ts
 * Rider profile management for RideTune.
 * Free: 1 profile max. Premium: unlimited.
 */
import { storage } from "@/src/utils/storage";

export type RiderProfile = {
  id: string;
  name: string;
  weightKg: number;
  createdAt: number;
};

const K_PROFILES  = "ridetune.profiles";
const K_ACTIVE_ID = "ridetune.profile.active";
export const FREE_PROFILE_LIMIT = 1;

export async function listProfiles(): Promise<RiderProfile[]> {
  const raw = await storage.getItem<string>(K_PROFILES, "");
  if (!raw) return [];
  try { return JSON.parse(raw) as RiderProfile[]; }
  catch { return []; }
}

export async function saveProfile(p: Omit<RiderProfile, "id" | "createdAt">): Promise<RiderProfile> {
  const all = await listProfiles();
  const next: RiderProfile = { ...p, id: `p_${Date.now()}`, createdAt: Date.now() };
  all.unshift(next);
  await storage.setItem(K_PROFILES, JSON.stringify(all));
  await storage.setItem(K_ACTIVE_ID, next.id);
  return next;
}

export async function updateProfile(id: string, p: Partial<Omit<RiderProfile, "id" | "createdAt">>): Promise<void> {
  const all = await listProfiles();
  const idx = all.findIndex(x => x.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...p };
    await storage.setItem(K_PROFILES, JSON.stringify(all));
  }
}

export async function deleteProfile(id: string): Promise<void> {
  const all = await listProfiles();
  const next = all.filter(x => x.id !== id);
  await storage.setItem(K_PROFILES, JSON.stringify(next));
  const activeId = await storage.getItem<string>(K_ACTIVE_ID, "");
  if (activeId === id) {
    await storage.setItem(K_ACTIVE_ID, next[0]?.id ?? "");
  }
}

export async function getActiveProfile(): Promise<RiderProfile | null> {
  const activeId = await storage.getItem<string>(K_ACTIVE_ID, "");
  if (!activeId) return null;
  const all = await listProfiles();
  return all.find(x => x.id === activeId) ?? null;
}

export async function setActiveProfile(id: string): Promise<void> {
  await storage.setItem(K_ACTIVE_ID, id);
}
