/**
 * diary.ts — Ride diary / sensation log
 */
import { storage } from "@/src/utils/storage";

const K_DIARY = "ridetune.diary";
export const FREE_DIARY_LIMIT = 3;

export type DiaryEntry = {
  id: string;
  createdAt: number;
  bikeLabel: string;
  setup: string;
  rating: number; // 1-5
  notes: string;
};

export async function listEntries(): Promise<DiaryEntry[]> {
  const raw = await storage.getItem<string>(K_DIARY, "");
  if (!raw) return [];
  try { return JSON.parse(raw) as DiaryEntry[]; }
  catch { return []; }
}

export async function saveEntry(e: Omit<DiaryEntry, "id" | "createdAt">): Promise<DiaryEntry> {
  const all = await listEntries();
  const next: DiaryEntry = { ...e, id: `d_${Date.now()}`, createdAt: Date.now() };
  all.unshift(next);
  await storage.setItem(K_DIARY, JSON.stringify(all));
  return next;
}

export async function updateEntry(id: string, e: Partial<Omit<DiaryEntry, "id" | "createdAt">>): Promise<void> {
  const all = await listEntries();
  const idx = all.findIndex(x => x.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...e };
    await storage.setItem(K_DIARY, JSON.stringify(all));
  }
}

export async function deleteEntry(id: string): Promise<void> {
  const all = await listEntries();
  await storage.setItem(K_DIARY, JSON.stringify(all.filter(x => x.id !== id)));
}

export function formatEntry(e: DiaryEntry): string {
  const date = new Date(e.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const stars = "★".repeat(e.rating) + "☆".repeat(5 - e.rating);
  return `📅 ${date} — ${e.bikeLabel}\n⚙️ ${e.setup}\n${stars}\n"${e.notes}"`;
}
