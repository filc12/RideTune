"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LanguageProvider";
import { legalDictionaries } from "@/i18n/legal";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const { locale } = useI18n();
  const L = legalDictionaries[locale];
  const isPrivacy = kind === "privacy";

  const title = isPrivacy ? L.privacyTitle : L.termsTitle;
  const sections = isPrivacy ? L.privacySections : L.termsSections;
  const seeAlsoLabel = isPrivacy ? L.submissionTerms : L.privacyPolicy;
  const seeAlsoHref = isPrivacy ? "/terms" : "/privacy";

  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-slate-200">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="text-sm text-brand-accent hover:underline">
          {L.back}
        </Link>
        <LanguageSwitcher />
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-brand-muted">{L.lastUpdated}</p>
      <div className="mt-10 space-y-10">
        {sections.map(([sectionTitle, body]) => (
          <section key={sectionTitle}>
            <h2 className="text-xl font-semibold text-white">{sectionTitle}</h2>
            <p className="mt-3 leading-relaxed text-slate-300">{body}</p>
          </section>
        ))}
      </div>
      <p className="mt-12 text-sm text-brand-muted">
        {L.seeAlsoPre}{" "}
        <Link href={seeAlsoHref} className="text-brand-accent hover:underline">
          {seeAlsoLabel}
        </Link>
        .
      </p>
    </main>
  );
}
