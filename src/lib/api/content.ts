import { getCountry } from "@/lib/country";
import { activeCountry } from "@/lib/store/useCountryStore";
import { apiGet } from "./client";
import type { Locale } from "@/lib/i18n/dictionaries";
import type {
  CountryCode,
  Destination,
  DestinationLight,
  ProvinceBundle,
  ProvinceMeta,
  Region,
  RegionId,
} from "@/lib/types";

// Province + region META and the map bounds are reference data tied to the geometry, so they
// stay static per country (Bible 019 §14 static-before-dynamic). Editorial CONTENT (province
// stories, destinations) is fetched from the Worker API, which reads D1 (Bible 013).

/** Per-country lookup tables, built once on first use. */
const tables = new Map<CountryCode, { bySlug: Map<string, ProvinceMeta>; byRegion: Map<string, Region> }>();

function tablesFor(cc: CountryCode) {
  let t = tables.get(cc);
  if (!t) {
    const meta = getCountry(cc).geoMeta;
    t = {
      bySlug: new Map(meta.provinces.map((p) => [p.slug, p])),
      byRegion: new Map(meta.regions.map((r) => [r.id, r])),
    };
    tables.set(cc, t);
  }
  return t;
}

/** Map bounds of the active atlas. */
export function getBounds(cc: CountryCode = activeCountry()): [number, number, number, number] {
  return getCountry(cc).geoMeta.bounds;
}

export function getRegions(cc: CountryCode = activeCountry()): Region[] {
  return getCountry(cc).geoMeta.regions;
}
export function getProvinces(cc: CountryCode = activeCountry()): ProvinceMeta[] {
  return getCountry(cc).geoMeta.provinces;
}
export function getProvinceMeta(slug: string, cc: CountryCode = activeCountry()): ProvinceMeta | undefined {
  return tablesFor(cc).bySlug.get(slug);
}
export function getRegion(id: RegionId, cc: CountryCode = activeCountry()): Region | undefined {
  return tablesFor(cc).byRegion.get(id);
}

// ── Async content (cached per country + locale) ─────────────────────
// Content is localized server-side (Worker overlays the i18n column; missing fields fall
// back to Vietnamese). Caches are keyed by "<country>:<locale>:<id>" so switching country or
// language refetches.
const bundleCache = new Map<string, Promise<ProvinceBundle | null>>();
const destCache = new Map<string, Promise<Destination | null>>();
const lightCache = new Map<string, Promise<DestinationLight[]>>();

/** Query string carrying country (omitted for the default atlas) and locale (omitted for vi). */
function query(locale: Locale | undefined, cc: CountryCode): string {
  const parts: string[] = [];
  if (cc !== "vn") parts.push(`country=${cc}`);
  if (locale && locale !== "vi") parts.push(`locale=${locale}`);
  return parts.length ? `?${parts.join("&")}` : "";
}

/** Lightweight destination list (markers + search), fetched once per country + locale. */
export function fetchDestinationsLight(
  locale: Locale = "vi",
  cc: CountryCode = activeCountry(),
): Promise<DestinationLight[]> {
  const key = `${cc}:${locale}`;
  let p = lightCache.get(key);
  if (!p) {
    p = apiGet<DestinationLight[]>(`/destinations${query(locale, cc)}`).catch(() => []);
    lightCache.set(key, p);
  }
  return p;
}

export function fetchProvinceBundle(
  slug: string,
  locale: Locale = "vi",
  cc: CountryCode = activeCountry(),
): Promise<ProvinceBundle | null> {
  const key = `${cc}:${locale}:${slug}`;
  let p = bundleCache.get(key);
  if (!p) {
    p = apiGet<ProvinceBundle>(`/province/${slug}${query(locale, cc)}`).catch(() => null);
    bundleCache.set(key, p);
  }
  return p;
}

export function fetchDestination(
  id: string,
  locale: Locale = "vi",
  cc: CountryCode = activeCountry(),
): Promise<Destination | null> {
  const key = `${cc}:${locale}:${id}`;
  let p = destCache.get(key);
  if (!p) {
    p = apiGet<Destination>(`/destination/${id}${query(locale, cc)}`).catch(() => null);
    destCache.set(key, p);
  }
  return p;
}
