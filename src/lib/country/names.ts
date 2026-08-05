// Country names, split out from the registry in ./index so they can be read without pulling in
// the geometry that lives beside them.
//
// The Worker (worker/seo-body.ts) and the Vite config (which bakes the homepage's static <head>
// and crawler links) both need these strings; importing ./index would drag both geo-meta JSON
// blobs into the Worker bundle and into the config's module graph for the sake of two words.
//
// Adding a country: one entry here, one entry in ./index. Nothing else names a country — the
// homepage title, the sitemap and the SEO bodies are all generated from this map.

import type { CountryCode } from "../types";
import type { Locale } from "../i18n/dictionaries";

export const COUNTRY_LABELS: Record<CountryCode, Record<Locale, string>> = {
  vn: { vi: "Việt Nam", en: "Vietnam", ko: "베트남", ja: "ベトナム", zh: "越南" },
  kr: { vi: "Hàn Quốc", en: "South Korea", ko: "대한민국", ja: "韓国", zh: "韓國" },
};

/** Country codes in the order they should be listed to a reader (and to a crawler). */
export const COUNTRY_ORDER = Object.keys(COUNTRY_LABELS) as CountryCode[];

/**
 * Country name in `locale`, tolerant of an unknown code so callers parsing a URL segment don't
 * have to narrow first. Falls back to Vietnamese, then to the uppercased code.
 */
export function labelOf(code: string, locale: Locale = "vi"): string {
  const entry = COUNTRY_LABELS[code as CountryCode];
  return entry ? (entry[locale] ?? entry.vi) : code.toUpperCase();
}

/** "Việt Nam và Hàn Quốc" — the list of atlases, for copy that has to name all of them. */
export function labelList(locale: Locale = "vi", conjunction = "&"): string {
  const names = COUNTRY_ORDER.map((c) => COUNTRY_LABELS[c][locale] ?? COUNTRY_LABELS[c].vi);
  if (names.length < 2) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} ${conjunction} ${names[names.length - 1]}`;
}
