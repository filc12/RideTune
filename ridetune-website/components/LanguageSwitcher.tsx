"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/LanguageProvider";
import { LOCALES, LOCALE_LABELS } from "@/i18n/dictionaries";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "20px",
          color: "#e2e8f0",
          padding: "6px 12px",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          lineHeight: 1,
        }}
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
        </svg>
        <span style={{ textTransform: "uppercase" }}>{locale}</span>
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 100,
            minWidth: "150px",
            listStyle: "none",
            margin: 0,
            padding: "6px",
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
          }}
        >
          {LOCALES.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <button
                type="button"
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  background: l === locale ? "rgba(56,189,248,0.12)" : "transparent",
                  border: "none",
                  borderRadius: "8px",
                  color: l === locale ? "#38bdf8" : "#e2e8f0",
                  padding: "8px 10px",
                  fontSize: "13px",
                  fontWeight: l === locale ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {LOCALE_LABELS[l]}
                <span style={{ textTransform: "uppercase", fontSize: "11px", color: "#64748b" }}>{l}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
