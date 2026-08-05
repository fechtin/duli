import geoMetaVn from "@/data/generated/geo-meta.vn.json";
import geoMetaKr from "@/data/generated/geo-meta.kr.json";
import type { CountryCode, ProvinceMeta, Region } from "@/lib/types";
import type { Locale } from "@/lib/i18n/dictionaries";

/**
 * The country dimension. Each atlas ships its own geometry (`public/geo/<cc>-provinces.json`,
 * lazy-fetched) and its own province/region reference data (`geo-meta.<cc>.json`, bundled —
 * it carries no geometry so it stays a few KB). Editorial content lives in D1 and is fetched
 * per country; see src/lib/api/content.ts.
 *
 * Adding a country = registry file (data/registry/<cc>.mjs) → `npm run data:build -- <cc>`
 * → one entry here → content.
 */

interface GeoMeta {
  bounds: [number, number, number, number];
  regions: Region[];
  provinces: ProvinceMeta[];
}

export interface CountryConfig {
  code: CountryCode;
  /** Display name per UI locale. */
  label: Record<Locale, string>;
  /** Emoji flag — used by the country switcher. */
  flag: string;
  /** Lazy-fetched geometry, relative to BASE_URL. */
  geoFile: string;
  geoMeta: GeoMeta;
}

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  vn: {
    code: "vn",
    label: { vi: "Việt Nam", en: "Vietnam", ko: "베트남", ja: "ベトナム", zh: "越南" },
    flag: "🇻🇳",
    geoFile: "geo/vn-provinces.json",
    geoMeta: geoMetaVn as unknown as GeoMeta,
  },
  kr: {
    code: "kr",
    label: { vi: "Hàn Quốc", en: "South Korea", ko: "대한민국", ja: "韓国", zh: "韓國" },
    flag: "🇰🇷",
    geoFile: "geo/kr-provinces.json",
    geoMeta: geoMetaKr as unknown as GeoMeta,
  },
};

export const COUNTRY_CODES = Object.keys(COUNTRIES) as CountryCode[];

export const DEFAULT_COUNTRY: CountryCode = "vn";

export function isCountryCode(value: string | undefined | null): value is CountryCode {
  return !!value && value in COUNTRIES;
}

export function getCountry(code: CountryCode): CountryConfig {
  return COUNTRIES[code];
}

/** Country name in the UI locale — for copy that names the atlas, e.g. the passport title. */
export function countryLabel(code: CountryCode, locale: Locale): string {
  return COUNTRIES[code].label[locale] ?? COUNTRIES[code].label.vi;
}

/** Full URL of a country's geometry file (respects Vite's BASE_URL). */
export function geoUrl(code: CountryCode): string {
  return `${import.meta.env.BASE_URL}${COUNTRIES[code].geoFile}`;
}
