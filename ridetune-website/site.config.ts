/**
 * Central site configuration.
 * SITE_URL is the canonical production origin. Override at build/deploy time
 * with NEXT_PUBLIC_SITE_URL (e.g. Vercel env). Defaults to the custom domain.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://ridetune.app";

export const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.ridetune.app";

/** Backend base URL for community setups. Empty = feature disabled (safe default). */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export const SITE_NAME = "RideTune";

export const SITE_DESCRIPTION =
  "RideTune finds your perfect motorcycle suspension setup using OEM data, intelligent calculations and the real-world way you ride. Buy once. Ride forever.";
