// D1 query layer for the Worker (Bible 013/015 — API exposes business shapes, not rows).
import type { Destination, ProvinceMeta, Region } from "../src/lib/types";

export interface D1Like {
  prepare: (sql: string) => {
    bind: (...args: unknown[]) => { all: <T>() => Promise<{ results: T[] }>; first: <T>() => Promise<T | null> };
    all: <T>() => Promise<{ results: T[] }>;
  };
}

interface DestRow {
  id: string;
  slug: string;
  province_slug: string;
  name: string;
  name_en: string;
  type: string;
  lng: number;
  lat: number;
  summary: string;
  story: string;
  facts: string;
  travel_tips: string;
  best_time: string;
  visit_duration: string;
  ticket: string;
  opening_hours: string;
  badges: string;
  tags: string;
  gallery: string;
  nearby: string;
  featured: number;
}

interface ProvRow {
  slug: string;
  region_id: string;
  name: string;
  name_en: string;
  region_name: string;
  color: string;
  center_lng: number;
  center_lat: number;
  summary: string | null;
  story: string | null;
  best_time: string | null;
  specialties: string | null;
}

const parse = <T>(s: string | null, fallback: T): T => {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
};

function toDestination(r: DestRow): Destination {
  return {
    id: r.id,
    slug: r.slug,
    provinceSlug: r.province_slug,
    name: r.name,
    nameEn: r.name_en,
    type: r.type as Destination["type"],
    lng: r.lng,
    lat: r.lat,
    summary: r.summary,
    story: r.story,
    facts: parse(r.facts, []),
    travelTips: parse(r.travel_tips, []),
    bestTime: r.best_time,
    visitDuration: r.visit_duration,
    ticket: r.ticket,
    openingHours: r.opening_hours,
    badges: parse(r.badges, []),
    tags: parse(r.tags, []),
    gallery: parse(r.gallery, []),
    nearby: parse(r.nearby, []),
    featured: !!r.featured,
  };
}

function toProvinceMeta(r: ProvRow): ProvinceMeta {
  return {
    slug: r.slug,
    name: r.name,
    nameEn: r.name_en,
    regionId: r.region_id as ProvinceMeta["regionId"],
    regionName: r.region_name,
    color: r.color,
    centroid: [r.center_lng, r.center_lat],
  };
}

export async function getRegions(db: D1Like): Promise<Region[]> {
  const { results } = await db
    .prepare("SELECT id, name, name_en, color FROM regions ORDER BY display_order")
    .all<{ id: string; name: string; name_en: string; color: string }>();
  return results.map((r) => ({ id: r.id as Region["id"], name: r.name, nameEn: r.name_en, color: r.color }));
}

export async function getProvinces(db: D1Like): Promise<ProvinceMeta[]> {
  const { results } = await db
    .prepare("SELECT * FROM provinces ORDER BY name")
    .all<ProvRow>();
  return results.map(toProvinceMeta);
}

/** Lightweight list for map markers + client search index. */
export async function getDestinationsLight(db: D1Like) {
  const { results } = await db
    .prepare(
      "SELECT id, slug, province_slug, name, name_en, type, lng, lat, summary, tags, badges, gallery, featured FROM destinations",
    )
    .all<DestRow>();
  return results.map((r) => ({
    id: r.id,
    slug: r.slug,
    provinceSlug: r.province_slug,
    name: r.name,
    nameEn: r.name_en,
    type: r.type,
    lng: r.lng,
    lat: r.lat,
    summary: r.summary,
    tags: parse<string[]>(r.tags, []),
    badges: parse<string[]>(r.badges, []),
    gallery: parse(r.gallery, []),
    featured: !!r.featured,
  }));
}

export async function getDestination(db: D1Like, id: string): Promise<Destination | null> {
  const row = await db.prepare("SELECT * FROM destinations WHERE id = ?").bind(id).first<DestRow>();
  return row ? toDestination(row) : null;
}

export async function getProvinceBundle(db: D1Like, slug: string) {
  const row = await db.prepare("SELECT * FROM provinces WHERE slug = ?").bind(slug).first<ProvRow>();
  if (!row) return null;
  const { results } = await db
    .prepare("SELECT * FROM destinations WHERE province_slug = ? ORDER BY featured DESC, name")
    .bind(slug)
    .all<DestRow>();
  const dests = results.map(toDestination);
  const content = row.summary
    ? {
        slug: row.slug,
        summary: row.summary,
        story: row.story ?? "",
        bestTime: row.best_time ?? "",
        specialties: parse<string[]>(row.specialties, []),
        destinationIds: dests.map((d) => d.id),
      }
    : null;
  return { meta: toProvinceMeta(row), content, destinations: dests };
}
