import geoMeta from "@/data/generated/geo-meta.json";
import { apiGet } from "./client";
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

// ── Async content (cached) ────────────────────────────────
const bundleCache = new Map<string, Promise<ProvinceBundle | null>>();
const destCache = new Map<string, Promise<Destination | null>>();
let lightPromise: Promise<DestinationLight[]> | null = null;

/** Lightweight destination list (markers + search), fetched once. */
export function fetchDestinationsLight(): Promise<DestinationLight[]> {
  if (!lightPromise) lightPromise = apiGet<DestinationLight[]>("/destinations").catch(() => []);
  return lightPromise;
}

export function fetchProvinceBundle(slug: string): Promise<ProvinceBundle | null> {
  let p = bundleCache.get(slug);
  if (!p) {
    p = apiGet<ProvinceBundle>(`/province/${slug}`).catch(() => null);
    bundleCache.set(slug, p);
  }
  return p;
}

export function fetchDestination(id: string): Promise<Destination | null> {
  let p = destCache.get(id);
  if (!p) {
    p = apiGet<Destination>(`/destination/${id}`).catch(() => null);
    destCache.set(id, p);
  }
  return p;
}
