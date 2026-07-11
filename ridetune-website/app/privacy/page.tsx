import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How RideTune handles your data: no accounts, local-first storage, anonymous analytics and crash reports only.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "article",
    url: "/privacy",
    title: "Privacy Policy — RideTune",
    description: "How RideTune handles your data.",
  },
};

const sections: [string, string][] = [
  [
    "Overview",
    "RideTune is a motorcycle suspension setup app. We built it to work without accounts, without sign-ups and with as little data as possible. This page explains what little data the app touches and why.",
  ],
  [
    "Data stored on your device",
    "Your rider profiles, saved setups, Ride Diary entries and load preferences are stored locally on your device. They never leave your phone unless you explicitly use the Export Data feature, which creates a file that you control and share yourself.",
  ],
  [
    "No accounts",
    "RideTune does not require or offer user accounts. We do not collect your name, email address or any other identity information.",
  ],
  [
    "Purchases",
    "RideTune Premium Lifetime is a one-time purchase processed entirely by Google Play Billing. We use RevenueCat to validate purchases and restore them on reinstall. We receive an anonymous purchase record — never your payment details, which stay with Google.",
  ],
  [
    "Analytics",
    "The app sends anonymous usage events (for example, which screens are opened) via PostHog to help us understand which features matter. These events are tied to a random identifier, not to you. No precise location, contacts or personal content is ever collected.",
  ],
  [
    "Crash reports",
    "If the app crashes, an automatic crash report (stack trace and device model) is sent via Sentry so we can fix the problem. Crash reports do not include your setups, diary or personal information.",
  ],
  [
    "Motorcycle data",
    "The app downloads its motorcycle and suspension database from our servers. These requests are anonymous read-only downloads.",
  ],
  [
    "Community setups (shared by you)",
    "If you choose to share a setup to the community, that setup — your motorcycle, load, sag and clicker values, an optional country and an optional short note — is published on ridetune.app and inside the app as “Anonymous rider”. It is tied only to a random device identifier generated on your phone, never to your name, email or any personal data. Sharing is always your choice and is confirmed each time. You can view and delete your shared setups at any time from the app, which removes them from our servers. Submissions may be checked automatically and lightly moderated to keep the library useful. Community data is stored with Supabase (our database provider). By sharing, you agree to the submission terms.",
  ],
  [
    "Data deletion",
    "Because your data lives on your device, deleting the app deletes your on-device data. Setups you shared to the community can be removed at any time from the app, which deletes them from our servers. Anonymous analytics and crash data are retained by our providers for a limited period and cannot be linked back to you.",
  ],
  [
    "Contact",
    "Questions about privacy? Email support@ridetune.app.",
  ],
];

export default function Privacy() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-slate-200">
      <Link href="/" className="text-sm text-brand-accent hover:underline">
        ← Back to RideTune
      </Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-brand-muted">Last updated: July 2026</p>
      <div className="mt-10 space-y-10">
        {sections.map(([title, body]) => (
          <section key={title}>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="mt-3 leading-relaxed text-slate-300">{body}</p>
          </section>
        ))}
      </div>
      <p className="mt-12 text-sm text-brand-muted">
        See also our{" "}
        <Link href="/terms" className="text-brand-accent hover:underline">
          Submission Terms
        </Link>
        .
      </p>
    </main>
  );
}
