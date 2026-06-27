// D1 query layer for the Worker (Bible 013/015 — API exposes business shapes, not rows).
import type {
  Destination,
  DestinationTranslation,
  ProvinceMeta,
  ProvinceTranslation,
  Region,
} from "../src/lib/types";

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
  i18n: string | null;
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
  i18n: string | null;
}

const parse = <T>(s: string | null, fallback: T): T => {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
};

/**
 * Pick the translation bundle for `locale` from a row's JSON i18n column.
 * Returns null for Vietnamese / unknown locale / empty column, so callers keep the
 * base (Vietnamese) fields as the fallback.
 */
function pickTranslation<T>(json: string | null, locale?: string): T | null {
  if (!locale || locale === "vi") return null;
  const all = parse<Record<string, T> | null>(json, null);
  return all?.[locale] ?? null;
}

const nonEmpty = (s?: string): s is string => typeof s === "string" && s.length > 0;
const hasItems = (a?: string[]): a is string[] => Array.isArray(a) && a.length > 0;

function toDestination(r: DestRow, locale?: string): Destination {
  const gallery = parse<Destination["gallery"]>(r.gallery, []);
  const tr = pickTranslation<DestinationTranslation>(r.i18n, locale);
  return {
    id: r.id,
    slug: r.slug,
    provinceSlug: r.province_slug,
    name: tr && nonEmpty(tr.name) ? tr.name : r.name,
    nameEn: r.name_en,
    type: r.type as Destination["type"],
    lng: r.lng,
    lat: r.lat,
    summary: tr && nonEmpty(tr.summary) ? tr.summary : r.summary,
    story: tr && nonEmpty(tr.story) ? tr.story : r.story,
    facts: tr && hasItems(tr.facts) ? tr.facts : parse(r.facts, []),
    travelTips: tr && hasItems(tr.travelTips) ? tr.travelTips : parse(r.travel_tips, []),
    bestTime: tr && nonEmpty(tr.bestTime) ? tr.bestTime : r.best_time,
    visitDuration: tr && nonEmpty(tr.visitDuration) ? tr.visitDuration : r.visit_duration,
    ticket: tr && nonEmpty(tr.ticket) ? tr.ticket : r.ticket,
    openingHours: tr && nonEmpty(tr.openingHours) ? tr.openingHours : r.opening_hours,
    badges: parse(r.badges, []),
    tags: parse(r.tags, []),
    gallery:
      tr && hasItems(tr.galleryCaptions)
        ? gallery.map((g, i) => (nonEmpty(tr.galleryCaptions?.[i]) ? { ...g, caption: tr.galleryCaptions![i] } : g))
        : gallery,
    nearby: parse(r.nearby, []),
    featured: !!r.featured,
  };
}

function toProvinceMeta(r: ProvRow, locale?: string): ProvinceMeta {
  const tr = pickTranslation<ProvinceTranslation>(r.i18n, locale);
  return {
    slug: r.slug,
    name: tr && nonEmpty(tr.name) ? tr.name : r.name,
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

export async function getProvinces(db: D1Like, locale?: string): Promise<ProvinceMeta[]> {
  const { results } = await db
    .prepare("SELECT * FROM provinces ORDER BY name")
    .all<ProvRow>();
  return results.map((r) => toProvinceMeta(r, locale));
}

/** Lightweight list for map markers + client search index. */
export async function getDestinationsLight(db: D1Like, locale?: string) {
  const { results } = await db
    .prepare(
      "SELECT id, slug, province_slug, name, name_en, type, lng, lat, summary, tags, badges, gallery, featured, i18n FROM destinations",
    )
    .all<DestRow>();
  return results.map((r) => {
    const tr = pickTranslation<DestinationTranslation>(r.i18n, locale);
    return {
      id: r.id,
      slug: r.slug,
      provinceSlug: r.province_slug,
      name: tr && nonEmpty(tr.name) ? tr.name : r.name,
      nameEn: r.name_en,
      type: r.type,
      lng: r.lng,
      lat: r.lat,
      summary: tr && nonEmpty(tr.summary) ? tr.summary : r.summary,
      tags: parse<string[]>(r.tags, []),
      badges: parse<string[]>(r.badges, []),
      gallery: parse(r.gallery, []),
      featured: !!r.featured,
    };
  });
}

export async function getDestination(db: D1Like, id: string, locale?: string): Promise<Destination | null> {
  const row = await db.prepare("SELECT * FROM destinations WHERE id = ?").bind(id).first<DestRow>();
  return row ? toDestination(row, locale) : null;
}

export async function getProvinceBundle(db: D1Like, slug: string, locale?: string) {
  const row = await db.prepare("SELECT * FROM provinces WHERE slug = ?").bind(slug).first<ProvRow>();
  if (!row) return null;
  const { results } = await db
    .prepare("SELECT * FROM destinations WHERE province_slug = ? ORDER BY featured DESC, name")
    .bind(slug)
    .all<DestRow>();
  const dests = results.map((r) => toDestination(r, locale));
  const ptr = pickTranslation<ProvinceTranslation>(row.i18n, locale);
  const content = row.summary
    ? {
        slug: row.slug,
        summary: ptr && nonEmpty(ptr.summary) ? ptr.summary : row.summary,
        story: ptr && nonEmpty(ptr.story) ? ptr.story : (row.story ?? ""),
        bestTime: ptr && nonEmpty(ptr.bestTime) ? ptr.bestTime : (row.best_time ?? ""),
        specialties: ptr && hasItems(ptr.specialties) ? ptr.specialties : parse<string[]>(row.specialties, []),
        destinationIds: dests.map((d) => d.id),
      }
    : null;
  return { meta: toProvinceMeta(row, locale), content, destinations: dests };
}
