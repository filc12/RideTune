import { storage } from "@/src/utils/storage";
import type { Setup, Load } from "./suspension";

export type SavedSetup = {
  id: string;
  name: string;
  bikeId: string;
  bikeLabel: string;
  load: Load;
  setup: Setup;
  createdAt: number;
};

const K = "ridetune.setups";

export async function listSetups(): Promise<SavedSetup[]> {
  const raw = await storage.getItem<string>(K, "");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedSetup[];
  } catch {
    return [];
  }
}

export async function saveSetup(s: Omit<SavedSetup, "id" | "createdAt">) {
  const all = await listSetups();
  const next: SavedSetup = { ...s, id: `s_${Date.now()}`, createdAt: Date.now() };
  all.unshift(next);
  await storage.setItem(K, JSON.stringify(all));
  return next;
}

export async function deleteSetup(id: string) {
  const all = await listSetups();
  await storage.setItem(K, JSON.stringify(all.filter((x) => x.id !== id)));
}
