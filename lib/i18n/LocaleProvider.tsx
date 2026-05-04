"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_LOCALE, LOCALES, STORAGE_KEY, type Locale } from "./config";
import { translate } from "./dict";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<Ctx | null>(null);

function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && LOCALES.includes(v as Locale);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (isLocale(stored)) setLocaleState(stored);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-Hant" : "en";
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(key, locale, params),
    [locale],
  );

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}

/** Helper hook returning just the `t` function. */
export function useT() {
  return useContext(LocaleContext)?.t ?? ((key: string) => key);
}

/** Pick bilingual field based on current locale. */
export function useBilingual() {
  const { locale } = useLocale();
  return <T extends { zh: string; en: string }>(field: T) => field[locale];
}
