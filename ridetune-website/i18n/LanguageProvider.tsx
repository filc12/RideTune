"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LOCALES, dictionaries, type Dict, type Locale } from "./dictionaries";

const STORAGE_KEY = "ridetune.locale";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
};

const LanguageContext = createContext<Ctx | null>(null);

function isLocale(v: string | null): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Recupera preferência guardada ou deteta a do browser (só no cliente).
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (isLocale(saved)) {
      setLocaleState(saved);
      return;
    }
    const nav = typeof navigator !== "undefined" ? navigator.language.slice(0, 2).toLowerCase() : "en";
    if (isLocale(nav)) setLocaleState(nav);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignora indisponibilidade de localStorage
    }
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<Ctx>(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used within a LanguageProvider");
  return ctx;
}
