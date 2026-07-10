import { API_URL } from "@/site.config";
import type { LoadUse } from "./setups";

export type CommunitySetup = {
  id: string;
  load: LoadUse;
  rider_gear_kg: number;
  front_sag_mm: number;
  rear_sag_mm: number;
  preload: string;
  rebound: number;
  compression: number;
  note: string;
  country: string | null;
  author: string;
  oem_match: string; // "verified" | "outside_oem" | "unverified"
  helpful_count: number;
};

/**
 * Fetch approved community setups for a model from the backend.
 * Revalidates hourly (ISR) so pages stay static + SEO-friendly.
 * If the API isn't configured or errors, returns [] (feature stays hidden).
 */
export async function getCommunitySetups(slug: string): Promise<CommunitySetup[]> {
  if (!API_URL) return [];
  try {
    const res = await fetch(
      `${API_URL}/api/setups?bike_slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as CommunitySetup[]) : [];
  } catch {
    return [];
  }
}
