/**
 * community.ts — client for the community setups API (Supabase).
 *
 * Account-free: the only identity is an anonymous device id stored locally.
 * No personal data. Reads (approved) go straight to PostgREST; writes go
 * through the `setups` Edge Function (OEM verify + moderation + rate limit).
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

const FN = `${SUPABASE_URL}/functions/v1/setups`;
const REST = `${SUPABASE_URL}/rest/v1/setups`;
const DEVICE_KEY = "ridetune.device_id";

export type LoadUse = "road" | "touring" | "twoup" | "offroad";

export type SubmitPayload = {
  bike_slug: string;
  load: LoadUse;
  rider_gear_kg: number;
  sag_mm: number;
  front_preload: number;
  front_rebound: number;
  front_compression: number;
  rear_preload: number;
  rear_rebound: number;
  rear_compression: number;
  note?: string;
  country?: string | null;
};

export type CommunitySetup = {
  id: string;
  bike_slug: string;
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
  oem_match: "verified" | "outside_oem" | "unverified";
  helpful_count: number;
  status?: "pending" | "approved" | "rejected";
  created_at?: string;
};

function uuidV4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Anonymous, stable per-device id. Generated once, stored locally. */
export async function getDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = uuidV4();
    await AsyncStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export const isCommunityConfigured = (): boolean =>
  Boolean(SUPABASE_URL) && Boolean(SUPABASE_ANON_KEY);

function headers(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  };
}

async function errorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body?.error ?? `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

/** Create or update the user's setup for a bike + load. Returns the stored row. */
export async function submitSetup(payload: SubmitPayload): Promise<CommunitySetup> {
  const device_id = await getDeviceId();
  const res = await fetch(FN, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ ...payload, device_id }),
  });
  if (!res.ok) throw new Error(await errorMessage(res));
  return res.json();
}

/** The current device's own submissions (including pending). */
export async function listMySetups(): Promise<CommunitySetup[]> {
  const device_id = await getDeviceId();
  const res = await fetch(`${FN}?device_id=${encodeURIComponent(device_id)}`, {
    headers: headers(),
  });
  if (!res.ok) return [];
  return res.json();
}

/** Delete one of the device's own submissions. */
export async function deleteMySetup(id: string): Promise<boolean> {
  const device_id = await getDeviceId();
  const res = await fetch(
    `${FN}?id=${encodeURIComponent(id)}&device_id=${encodeURIComponent(device_id)}`,
    { method: "DELETE", headers: headers() },
  );
  return res.ok;
}

/** Toggle a "helpful" vote on an approved setup. */
export async function voteSetup(
  setupId: string,
): Promise<{ helpful_count: number; voted: boolean } | null> {
  const device_id = await getDeviceId();
  const res = await fetch(`${FN}?action=vote`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ setup_id: setupId, device_id }),
  });
  if (!res.ok) return null;
  return res.json();
}

/** Approved community setups for a bike (read-only, direct PostgREST). */
export async function getCommunitySetups(bikeSlug: string): Promise<CommunitySetup[]> {
  if (!isCommunityConfigured()) return [];
  const select =
    "id,bike_slug,load,rider_gear_kg,sag_mm,front_preload,front_rebound,front_compression,rear_preload,rear_rebound,rear_compression,note,country,oem_match,helpful_count";
  const res = await fetch(
    `${REST}?bike_slug=eq.${encodeURIComponent(bikeSlug)}` +
      `&status=eq.approved&select=${select}` +
      `&order=helpful_count.desc,created_at.desc&limit=200`,
    { headers: headers() },
  );
  if (!res.ok) return [];
  return res.json();
}
