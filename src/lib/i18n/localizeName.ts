// Client-side localization of place NAMES (proper nouns) that come from the static geo-meta.
// Editorial content (summary/story/…) is localized server-side by the Worker; names live here
// because they are reference data tied to the geometry, not D1 content.
import { provinceNames } from "@/data/i18n/provinceNames";
import { regionNames } from "@/data/i18n/regionNames";
import type { Locale } from "./dictionaries";

/** Province display name for `locale`, falling back to English transliteration then Vietnamese. */
export function localizeProvinceName(slug: string, viName: string, nameEn: string, locale: Locale): string {
  if (locale === "vi") return viName;
  return provinceNames[slug]?.[locale] ?? (locale === "en" ? nameEn : viName);
}

/** Region display name for `locale`, falling back to Vietnamese. */
export function localizeRegionName(id: string, viName: string, locale: Locale): string {
  if (locale === "vi") return viName;
  return regionNames[id]?.[locale] ?? viName;
}
