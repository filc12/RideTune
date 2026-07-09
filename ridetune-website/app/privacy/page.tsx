import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — RideTune",
  description: "How RideTune handles your data.",
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
    "Data deletion",
    "Because your data lives on your device, deleting the app deletes your data. Anonymous analytics and crash data are retained by our providers for a limited period and cannot be linked back to you.",
  ],
  [
    "Contact",
    "Questions about privacy? Email filipeac12@gmail.com.",
  ],
];

export default function Privacy() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-slate-200">
      <a href="/" className="text-sm text-brand-accent hover:underline">
        ← Back to RideTune
      </a>
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
    </main>
  );
}
