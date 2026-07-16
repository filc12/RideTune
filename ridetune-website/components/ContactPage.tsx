"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/LanguageProvider";
import { contactDictionaries } from "@/i18n/contact";
import { PLAY_URL, SUPPORT_EMAIL, WEB3FORMS_ACCESS_KEY } from "@/site.config";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const { locale } = useI18n();
  const c = contactDictionaries[locale];
  const [status, setStatus] = useState<Status>("idle");
  const [sentMessage, setSentMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const message = String(data.get("message") || "");

    if (!WEB3FORMS_ACCESS_KEY) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "New message from the RideTune website",
          from_name: "RideTune Contact",
          name: data.get("name") || "—",
          email: data.get("email"),
          message,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSentMessage(message);
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-brand-dark/60 px-4 py-3 text-sm text-white placeholder:text-brand-muted focus:border-brand-accent focus:outline-none";

  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-slate-200">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="text-sm text-brand-accent hover:underline">
          {c.back}
        </Link>
        <LanguageSwitcher />
      </div>

      <h1 className="mt-6 text-4xl font-bold tracking-tight">{c.title}</h1>
      <p className="mt-3 max-w-lg leading-relaxed text-brand-muted">{c.subtitle}</p>

      {/* Email + app */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-card/60 px-5 py-4 transition-colors hover:border-brand-accent"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-xs text-brand-muted">{c.emailUs}</span>
            <span className="block truncate text-sm font-semibold text-white">{SUPPORT_EMAIL}</span>
          </span>
        </a>

        <a
          href={PLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-card/60 px-5 py-4 transition-colors hover:border-brand-accent"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M3.6 1.8 13.7 12 3.6 22.2c-.4-.3-.6-.8-.6-1.4V3.2c0-.6.2-1.1.6-1.4Zm12.6 7.7L6.3 3.8l9.9 5.7ZM6.3 20.2l9.9-5.7-2.5-2.5-7.4 8.2Zm11.5-9.3 2.8 1.6c1 .6 1 1.6 0 2.2l-2.8 1.6L15.2 12l2.6-2.6Z" />
            </svg>
          </span>
          <span className="text-sm font-semibold text-white">{c.getApp}</span>
        </a>
      </div>

      {/* Chat-style message composer */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-brand-card/40 p-5">
        {/* greeting bubble */}
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent text-sm font-bold text-[#04111e]">R</span>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-brand-dark/70 px-4 py-3 text-sm leading-relaxed text-slate-200">
            {c.greeting}
          </div>
        </div>

        {status === "sent" ? (
          <div className="mt-5 space-y-4">
            {/* user's sent message (right) */}
            <div className="flex justify-end">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-brand-accent px-4 py-3 text-sm leading-relaxed text-[#04111e]">
                {sentMessage}
              </div>
            </div>
            {/* confirmation (left) */}
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent text-sm font-bold text-[#04111e]">R</span>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-brand-dark/70 px-4 py-3 text-sm leading-relaxed text-slate-200">
                <span className="block font-semibold text-white">{c.sentTitle}</span>
                <span className="mt-1 block text-brand-muted">{c.sentBody}</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-brand-muted">{c.nameLabel}</label>
                <input name="name" type="text" placeholder={c.namePlaceholder} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-brand-muted">{c.emailLabel}</label>
                <input name="email" type="email" required placeholder={c.emailPlaceholder} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-brand-muted">{c.messageLabel}</label>
              <textarea name="message" required rows={5} placeholder={c.messagePlaceholder} className={`${inputClass} resize-y`} />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-400">
                {WEB3FORMS_ACCESS_KEY ? c.error : c.notConfigured}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-6 py-3 text-sm font-bold text-[#04111e] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_24px_rgba(74,158,255,0.4)] disabled:opacity-60"
              >
                {status === "sending" ? c.sending : c.send}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
