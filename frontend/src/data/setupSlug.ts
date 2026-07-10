/**
 * Maps an app bike id (see src/data/bikes.ts) to the canonical community
 * "setup slug" used by the website (/setups/<slug>), the Supabase `setups`
 * table and the OEM verification in the Edge Function.
 *
 * Only bikes listed here can have community setups shared for now. As we add
 * more model pages + OEM references on the website, extend this map.
 */
export const COMMUNITY_SLUG: Record<string, string> = {
  "bmw-1250-gs": "bmw-r1250-gs",
  "ducati-desertx": "ducati-desertx",
  "cfmoto-800mt-sport": "cfmoto-800mt",
  "cfmoto-800mt-explore": "cfmoto-800mt",
  "aprilia-tuareg": "aprilia-tuareg-660",
  "bmw-f900-gs": "bmw-f900-gs",
  "ducati-multi-v4": "ducati-multistrada-v4",
  "bmw-s1000rr": "bmw-s1000rr",
  "aprilia-rs660": "aprilia-rs660",
};

/** Community slug for an app bike id, or null if sharing isn't supported yet. */
export function communitySlug(bikeId: string): string | null {
  return COMMUNITY_SLUG[bikeId] ?? null;
}
