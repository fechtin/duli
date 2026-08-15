// Locale in the URL — the single place that knows how a path and a language combine.
//
// Shared by the Worker (edge <head> + hreflang), the client router (useUrlSync) and the sitemap
// builder, because all three must agree byte-for-byte: a canonical that disagrees with an
// hreflang, or a sitemap that lists a URL the router won't produce, is worse than neither.
//
// Shape: the default locale keeps the bare path, every other locale takes a prefix.
//   /vn/quang-nam/hoi-an-ancient-town      → vi
//   /en/vn/quang-nam/hoi-an-ancient-town   → en
// No collision is possible between the two leading segments: locale codes {en,ko,ja,zh} and
// country codes {vn,kr} are disjoint sets, and "vi" is never a prefix (see `redundant`).

import type { Locale } from "../i18n/dictionaries";

export const DEFAULT_LOCALE: Locale = "vi";

/** Every locale the site publishes, default first. Order is the order hreflang is emitted in. */
export const SEO_LOCALES: Locale[] = ["vi", "en", "ko", "ja", "zh"];

/** Locales that carry a URL prefix — the default locale lives on the bare path. */
const PREFIXED = new Set<string>(["en", "ko", "ja", "zh"]);

/**
 * hreflang value per locale. `zh` names its script: every Chinese string in the repo is
 * Simplified, enforced by `npm run check:zh` (scripts/zh-simplify.mjs). It was plain "zh" while
 * the Korea copy was still Traditional — a script tag the content didn't keep would have been
 * worse than none.
 */
export const HREFLANG: Record<Locale, string> = {
  vi: "vi",
  en: "en",
  ko: "ko",
  ja: "ja",
  zh: "zh-Hans",
};

/** og:locale is a different vocabulary from hreflang — underscored, region required. */
export const OG_LOCALE: Record<Locale, string> = {
  vi: "vi_VN",
  en: "en_US",
  ko: "ko_KR",
  ja: "ja_JP",
  zh: "zh_CN",
};

export function isLocaleSegment(segment: string | undefined): boolean {
  return Boolean(segment && (PREFIXED.has(segment) || segment === DEFAULT_LOCALE));
}

export interface SplitPath {
  locale: Locale;
  /** The path with any locale prefix removed — always starts with "/". */
  path: string;
  /** True when the URL carried an explicit locale prefix. */
  prefixed: boolean;
  /** True for an explicit "/vi/…" prefix, which duplicates the bare path and must 301 away. */
  redundant: boolean;
}

/** Split a pathname into its locale and the locale-free path the rest of the app reasons about. */
export function splitLocale(pathname: string): SplitPath {
  const segments = pathname.split("/").filter(Boolean);
  const head = segments[0];
  if (isLocaleSegment(head)) {
    const rest = segments.slice(1);
    return {
      locale: head as Locale,
      path: rest.length ? `/${rest.join("/")}` : "/",
      prefixed: true,
      redundant: head === DEFAULT_LOCALE,
    };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/", prefixed: false, redundant: false };
}

/** Re-attach a locale to a locale-free path. Inverse of `splitLocale`. */
export function withLocale(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (!PREFIXED.has(locale)) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Every locale's version of one locale-free path, for hreflang and sitemap alternates. */
export function alternatesOf(path: string): { locale: Locale; path: string }[] {
  return SEO_LOCALES.map((locale) => ({ locale, path: withLocale(locale, path) }));
}
