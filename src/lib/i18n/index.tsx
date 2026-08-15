import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dictionaries, interpolate, locales, type Locale, type TParams } from "./dictionaries";
import { DEFAULT_LOCALE, splitLocale, withLocale } from "@/lib/seo/urls";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: TParams) => string;
  locales: typeof locales;
}

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = "via.locale";

/**
 * The URL decides the language — one URL, one language, which is the whole premise of the
 * hreflang set the Worker emits. A saved preference only applies when the URL doesn't say
 * (the effect below then rewrites the URL to match, so the two never disagree).
 *
 * Deliberately NOT falling back to navigator.language any more: Googlebot renders with an
 * en-US navigator and no storage, so browser-sniffing would have flipped every Vietnamese URL
 * to the English version *during indexing* and pointed its canonical there. Google's own
 * guidance is to let hreflang pick the version and never auto-redirect on perceived language.
 */
function detectInitial(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const { locale, prefixed } = splitLocale(window.location.pathname);
  if (prefixed) return locale;
  const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
  return saved && saved in dictionaries ? saved : DEFAULT_LOCALE;
}

/**
 * Current locale outside React (stores/services). Mirrors `detectInitial` but is safe to
 * call anywhere — used by data-fetch layers (e.g. the food store) that lack hook context.
 */
export function getStoredLocale(): Locale {
  return detectInitial();
}

// Warn once per unique message so a re-rendering component doesn't flood the console.
const warned = new Set<string>();
function warnOnce(msg: string): void {
  if (warned.has(msg)) return;
  warned.add(msg);
  console.warn(`[i18n] ${msg}`);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitial);

  // Keep <html lang> and the URL's locale prefix pointing at the same language. This is the one
  // place the prefix is written: useUrlSync only ever preserves whatever it finds.
  useEffect(() => {
    document.documentElement.lang = locale;
    const { path } = splitLocale(window.location.pathname);
    const next = `${withLocale(locale, path)}${window.location.search}${window.location.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (next !== current) window.history.replaceState(null, "", next);
  }, [locale]);

  // Back/forward across a language switch changes the prefix under us.
  useEffect(() => {
    const onPop = () => setLocaleState(splitLocale(window.location.pathname).locale);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string, params?: TParams) => {
      const dict = dictionaries[locale];
      // Dev guardrail: surface untranslated keys so new features can't silently ship missing
      // translations (they'd otherwise fall through to vi / the raw key with no signal).
      if (import.meta.env.DEV) {
        if (!(key in dictionaries.vi)) warnOnce(`i18n: unknown key "${key}" (missing from vi.ts source)`);
        else if (!(key in dict)) warnOnce(`i18n: key "${key}" missing for locale "${locale}"`);
      }
      const value = dict[key] ?? dictionaries.vi[key] ?? key;
      return interpolate(value, params);
    },
    [locale],
  );

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t, locales }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/** Convenience hook returning just the translate function. */
export function useT() {
  return useI18n().t;
}

export type { Locale };
