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
  source_url: string | null;
  verified_at: string | null;
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
    ...(r.source_url ? { sourceUrl: r.source_url } : {}),
    ...(r.verified_at ? { verifiedAt: r.verified_at } : {}),
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

export async function getRegions(db: D1Like, country = "vn"): Promise<Region[]> {
  const { results } = await db
    .prepare("SELECT id, name, name_en, color FROM regions WHERE country = ? ORDER BY display_order")
    .bind(country)
    .all<{ id: string; name: string; name_en: string; color: string }>();
  return results.map((r) => ({ id: r.id as Region["id"], name: r.name, nameEn: r.name_en, color: r.color }));
}

export async function getProvinces(db: D1Like, locale?: string, country = "vn"): Promise<ProvinceMeta[]> {
  const { results } = await db
    .prepare("SELECT * FROM provinces WHERE country = ? ORDER BY name")
    .bind(country)
    .all<ProvRow>();
  return results.map((r) => toProvinceMeta(r, locale));
}

/**
 * Provinces that actually have editorial content, name + slug only. Backs the crawler-visible
 * index on /{country} — the only page that links out to every province, so it is what gives a
 * bot a path from the homepage down to a destination.
 */
export async function getProvinceIndex(db: D1Like, country = "vn"): Promise<{ slug: string; name: string }[]> {
  const { results } = await db
    .prepare(
      `SELECT p.slug, p.name FROM provinces p
        WHERE p.country = ?
          AND EXISTS (SELECT 1 FROM destinations d WHERE d.province_slug = p.slug AND d.country = p.country)
        ORDER BY p.name`,
    )
    .bind(country)
    .all<{ slug: string; name: string }>();
  return results;
}

/** Lightweight list for map markers + client search index. */
export async function getDestinationsLight(db: D1Like, locale?: string, country = "vn") {
  const { results } = await db
    .prepare(
      "SELECT id, slug, province_slug, name, name_en, type, lng, lat, summary, tags, badges, gallery, featured, i18n FROM destinations WHERE country = ?",
    )
    .bind(country)
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

export async function getDestination(db: D1Like, id: string, locale?: string, country = "vn"): Promise<Destination | null> {
  const row = await db
    .prepare("SELECT * FROM destinations WHERE id = ? AND country = ?")
    .bind(id, country)
    .first<DestRow>();
  return row ? toDestination(row, locale) : null;
}

export async function getProvinceBundle(db: D1Like, slug: string, locale?: string, country = "vn") {
  const row = await db
    .prepare("SELECT * FROM provinces WHERE slug = ? AND country = ?")
    .bind(slug, country)
    .first<ProvRow>();
  if (!row) return null;
  const { results } = await db
    .prepare("SELECT * FROM destinations WHERE province_slug = ? AND country = ? ORDER BY featured DESC, name")
    .bind(slug, country)
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

// ── Food Explorer (Bible 026) ─────────────────────────────────
import type {
  Dish, DishWithRestaurants, Restaurant, DishTranslation, RestaurantTranslation,
} from "../src/lib/types";

interface DishRow {
  id: string; name: string; name_en: string; emoji: string | null;
  summary: string; story: string; origin_province: string | null;
  province_slugs: string; ingredients: string; flavor: string | null;
  best_time: string | null; tags: string; featured: number; i18n: string | null;
}

interface RestaurantRow {
  id: string; dish_id: string; name: string; province_slug: string;
  address: string | null; lng: number; lat: number; price_range: string | null;
  open_hours: string | null; labels: string; atlas_score: number; reasons: string;
  i18n: string | null;
}

const arr = <T>(s: string | null): T[] => {
  try { return s ? (JSON.parse(s) as T[]) : []; } catch { return []; }
};

function mapDish(r: DishRow, locale?: string): Dish {
  const tr = pickTranslation<DishTranslation>(r.i18n, locale);
  return {
    id: r.id, name: tr && nonEmpty(tr.name) ? tr.name : r.name,
    nameEn: r.name_en, emoji: r.emoji ?? "🍽️",
    summary: tr && nonEmpty(tr.summary) ? tr.summary : r.summary,
    story: tr && nonEmpty(tr.story) ? tr.story : r.story,
    originProvince: r.origin_province ?? "",
    provinceSlugs: arr(r.province_slugs),
    ingredients: tr && hasItems(tr.ingredients) ? tr.ingredients : arr(r.ingredients),
    flavor: tr && nonEmpty(tr.flavor) ? tr.flavor : (r.flavor ?? ""),
    bestTime: tr && nonEmpty(tr.bestTime) ? tr.bestTime : (r.best_time ?? ""),
    tags: arr(r.tags), featured: r.featured === 1,
  };
}

function mapRestaurant(r: RestaurantRow, locale?: string): Restaurant {
  const tr = pickTranslation<RestaurantTranslation>(r.i18n, locale);
  return {
    id: r.id, dishId: r.dish_id,
    name: tr && nonEmpty(tr.name) ? tr.name : r.name,
    provinceSlug: r.province_slug,
    address: tr && nonEmpty(tr.address) ? tr.address : (r.address ?? ""),
    lng: r.lng, lat: r.lat,
    priceRange: r.price_range ?? "", openHours: r.open_hours ?? "",
    labels: arr(r.labels), atlasScore: r.atlas_score,
    reasons: tr && hasItems(tr.reasons) ? tr.reasons : arr(r.reasons),
  };
}

/** All dishes, optionally only those that are a specialty of one province. */
export async function getDishes(db: D1Like, provinceSlug?: string, locale?: string, country = "vn"): Promise<Dish[]> {
  const rows = await db
    .prepare("SELECT * FROM dishes WHERE country = ? ORDER BY featured DESC, name")
    .bind(country)
    .all<DishRow>();
  const list = rows.results.map((r) => mapDish(r, locale));
  return provinceSlug ? list.filter((d) => d.provinceSlugs.includes(provinceSlug)) : list;
}

export async function getDish(db: D1Like, id: string, locale?: string, country = "vn"): Promise<DishWithRestaurants | null> {
  const row = await db.prepare("SELECT * FROM dishes WHERE id = ? AND country = ?").bind(id, country).first<DishRow>();
  if (!row) return null;
  const rests = await db
    .prepare("SELECT * FROM restaurants WHERE dish_id = ? ORDER BY atlas_score DESC")
    .bind(id)
    .all<RestaurantRow>();
  return { ...mapDish(row, locale), restaurants: rests.results.map((r) => mapRestaurant(r, locale)) };
}
