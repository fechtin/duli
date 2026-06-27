import geoMeta from "@/data/generated/geo-meta.json";
import { apiGet } from "./client";
import type { Locale } from "@/lib/i18n/dictionaries";
import type { Destination, DestinationLight, ProvinceBundle, ProvinceMeta, Region, RegionId } from "@/lib/types";

// Province + region META and the map bounds are reference data tied to the geometry, so they
// stay static (Bible 019 §14 static-before-dynamic). Editorial CONTENT (province stories,
// destinations) is fetched from the Worker API, which reads D1 (Bible 013).

const regions = geoMeta.regions as Region[];
const provinces = geoMeta.provinces as ProvinceMeta[];
const provinceBySlug = new Map(provinces.map((p) => [p.slug, p]));
const regionById = new Map(regions.map((r) => [r.id, r]));

export const bounds = geoMeta.bounds as [number, number, number, number];

export function getRegions(): Region[] {
  return regions;
}
export function getProvinces(): ProvinceMeta[] {
  return provinces;
}
export function getProvinceMeta(slug: string): ProvinceMeta | undefined {
  return provinceBySlug.get(slug);
}
export function getRegion(id: RegionId): Region | undefined {
  return regionById.get(id);
}

// ── Async content (cached per-locale) ─────────────────────
// Content is localized server-side (Worker overlays the i18n column; missing fields fall
// back to Vietnamese). Caches are keyed by "<locale>:<id>" so switching language refetches.
const bundleCache = new Map<string, Promise<ProvinceBundle | null>>();
const destCache = new Map<string, Promise<Destination | null>>();
const lightCache = new Map<Locale, Promise<DestinationLight[]>>();

/** `?locale=` query, omitted for Vietnamese (the base/source language). */
const localeQuery = (locale?: Locale) => (locale && locale !== "vi" ? `?locale=${locale}` : "");

/** Lightweight destination list (markers + search), fetched once per locale. */
export function fetchDestinationsLight(locale: Locale = "vi"): Promise<DestinationLight[]> {
  let p = lightCache.get(locale);
  if (!p) {
    p = apiGet<DestinationLight[]>(`/destinations${localeQuery(locale)}`).catch(() => []);
    lightCache.set(locale, p);
  }
  return p;
}

export function fetchProvinceBundle(slug: string, locale: Locale = "vi"): Promise<ProvinceBundle | null> {
  const key = `${locale}:${slug}`;
  let p = bundleCache.get(key);
  if (!p) {
    p = apiGet<ProvinceBundle>(`/province/${slug}${localeQuery(locale)}`).catch(() => null);
    bundleCache.set(key, p);
  }
  return p;
}

export function fetchDestination(id: string, locale: Locale = "vi"): Promise<Destination | null> {
  const key = `${locale}:${id}`;
  let p = destCache.get(key);
  if (!p) {
    p = apiGet<Destination>(`/destination/${id}${localeQuery(locale)}`).catch(() => null);
    destCache.set(key, p);
  }
  return p;
}
