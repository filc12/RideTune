import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/site.config";
import type { LoadUse } from "./setups";

export type CommunitySetup = {
  id: string;
  load: LoadUse;
  rider_gear_kg: number;
  sag_mm: number;
  front_preload: number;
  front_rebound: number;
  front_compression: number;
  rear_preload: number;
  rear_rebound: number;
  rear_compression: number;
  note: string;
  country: string | null;
  oem_match: string; // "verified" | "outside_oem" | "unverified"
  helpful_count: number;
};

const SELECT =
  "id,load,rider_gear_kg,sag_mm,front_preload,front_rebound,front_compression,rear_preload,rear_rebound,rear_compression,note,country,oem_match,helpful_count";

/**
 * Approved community setups for a model, read from Supabase (PostgREST).
 * RLS exposes only status = 'approved'. Revalidates hourly (ISR) so pages
 * stay static + SEO-friendly. Returns [] if Supabase isn't configured.
 */
export async function getCommunitySetups(slug: string): Promise<CommunitySetup[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/setups?bike_slug=eq.${encodeURIComponent(slug)}` +
        `&status=eq.approved&select=${SELECT}` +
        `&order=helpful_count.desc,created_at.desc&limit=200`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as CommunitySetup[]) : [];
  } catch {
    return [];
  }
}
