// Resolves living-calendar content (seasonal state / flower / festival name+description) into the
// active locale, falling back to the Vietnamese base string when a translation is missing — the
// same per-field fallback semantics as the Worker's pickTranslation, but bundled + synchronous so
// hot paths (computeHeartbeat per-marker, generateBrief on render) stay non-async.
import type { Locale } from "@/lib/i18n";
import { seasonalI18n, flowerI18n, festivalI18n } from "@/data/i18n/living";

const key = (month: number, destId: string) => `${month}:${destId}`;

/** Localized seasonal `state` for a destination in a month; VI `baseVi` is the fallback. */
export function localizeSeasonalState(month: number, destId: string, baseVi: string, locale: Locale): string {
  if (locale === "vi") return baseVi;
  return seasonalI18n[key(month, destId)]?.[locale]?.state || baseVi;
}

/** Localized flower name for a destination in a month; VI `baseVi` is the fallback. */
export function localizeFlower(month: number, destId: string, baseVi: string, locale: Locale): string {
  if (locale === "vi") return baseVi;
  return flowerI18n[key(month, destId)]?.[locale]?.flower || baseVi;
}

/** Localized festival name; VI `baseVi` is the fallback. */
export function localizeFestivalName(id: string, baseVi: string, locale: Locale): string {
  if (locale === "vi") return baseVi;
  return festivalI18n[id]?.[locale]?.name || baseVi;
}

/** Localized festival description; VI `baseVi` is the fallback. */
export function localizeFestivalDescription(id: string, baseVi: string, locale: Locale): string {
  if (locale === "vi") return baseVi;
  return festivalI18n[id]?.[locale]?.description || baseVi;
}
