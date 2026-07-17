/**
 * Central site configuration.
 * SITE_URL is the canonical production origin. Override at build/deploy time
 * with NEXT_PUBLIC_SITE_URL (e.g. Vercel env). Defaults to the custom domain.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://ridetune.app";

export const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.ridetune.app";

/** Support email shown on the contact page and footers. */
export const SUPPORT_EMAIL = "support@ridetune.app";

/**
 * Web3Forms public access key for the contact form.
 * Get a free key at https://web3forms.com (it's a public key, safe in client code).
 * Override at deploy time with NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY, or paste it here.
 */
export const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ??
  "3fee6e1e-961b-485e-987a-6cc3bb757af9";

/** Supabase (community setups). Empty = feature disabled (safe default). */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const SITE_NAME = "RideTune";

export const SITE_DESCRIPTION =
  "RideTune finds your perfect motorcycle suspension setup using OEM data, intelligent calculations and the real-world way you ride. Buy once. Ride forever.";
