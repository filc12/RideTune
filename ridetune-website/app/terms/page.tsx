import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Submission Terms",
  description:
    "Terms for sharing suspension setups to the RideTune community: your content, licence, moderation, removal and safety.",
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "article",
    url: "/terms",
    title: "Submission Terms — RideTune",
    description: "Terms for sharing setups to the RideTune community.",
  },
};

const sections: [string, string][] = [
  [
    "About these terms",
    "These terms apply when you choose to share a suspension setup to the RideTune community from the app. Sharing is optional. If you don’t share, these terms don’t apply to you.",
  ],
  [
    "What you share",
    "A shared setup includes your motorcycle model, load (rider, passenger, luggage), sag and clicker values, an optional country and an optional short note. It does not include your name, email or any personal data, and it is published as “Anonymous rider”, tied only to a random device identifier on your phone.",
  ],
  [
    "Your content",
    "You confirm the setup is your own and, to the best of your knowledge, accurate. Don’t submit anything you don’t have the right to share, or content that is offensive, misleading, unlawful or unrelated to motorcycle suspension.",
  ],
  [
    "Licence to display",
    "By sharing, you grant RideTune a non-exclusive, worldwide, royalty-free licence to store, display and distribute the shared setup on ridetune.app and inside the app. You keep ownership of what you share; this licence exists only so we can show it to other riders.",
  ],
  [
    "Moderation",
    "Submissions may be validated automatically (for example, checking values against manufacturer sag ranges) and lightly moderated. An optional note may be held for review before it appears. We may remove or decline any submission that breaks these terms or is reported.",
  ],
  [
    "Removing your setups",
    "You can view and delete your shared setups at any time from the app. Deleting a setup removes it from our servers. Because setups are anonymous, deletion is handled through the app on the device that shared them.",
  ],
  [
    "No professional advice, ride safely",
    "Suspension setups — whether shared by riders or provided by RideTune as reference — are suggestions and starting points, not professional advice. Always measure your own sag and adjust to your exact motorcycle, load and riding conditions. Incorrect suspension settings can affect handling and safety. You are responsible for how you set up and ride your motorcycle, and RideTune is not liable for the use of community or reference setups.",
  ],
  [
    "Changes",
    "We may update these terms from time to time. The “last updated” date below shows when they last changed.",
  ],
  [
    "Contact",
    "Questions about sharing or these terms? Email support@ridetune.app.",
  ],
];

export default function Terms() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-slate-200">
      <Link href="/" className="text-sm text-brand-accent hover:underline">
        ← Back to RideTune
      </Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">Submission Terms</h1>
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
        <Link href="/privacy" className="text-brand-accent hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </main>
  );
}
