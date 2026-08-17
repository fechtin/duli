import { destinations } from "@/data/destinations";
import { destinationsKr } from "@/data/kr";
import { krHeroIds, krHiddenGemIds, krSeasonalCalendar } from "@/data/kr/living";
import { krSeasonalState } from "@/data/kr/living-i18n";
import seasonalCalendar from "@/data/living/seasonal-calendar.json";
import { localizeSeasonalState } from "@/lib/living/livingI18n";
import type { Locale } from "@/lib/i18n";
import type { CountryCode, Destination } from "@/lib/types";
import { useContentStore } from "@/lib/store/useContentStore";
import { useMapStore } from "@/lib/store/useMapStore";
import { useUIStore } from "@/lib/store/useUIStore";

/**
 * The Korea atlas points its living calendars straight at real destination ids, so names,
 * coordinates and photo seeds come from the authoring data instead of a parallel namespace
 * (which is what the Vietnam calendars, written first, still use).
 */
const krById = new Map<string, Destination>(destinationsKr.map((d) => [d.id, d]));
const seedOf = (d: Destination) => d.gallery?.[0]?.seed ?? d.id;

/**
 * Display name for a Korean destination. The authoring data is Vietnamese, so prefer the
 * localized copy the API already loaded into the content store and fall back to the source.
 */
const krName = (d: Destination) =>
  useContentStore.getState().destinations.find((x) => x.id === d.id)?.name ?? d.name;
const krSummary = (d: Destination) =>
  useContentStore.getState().destinations.find((x) => x.id === d.id)?.summary ?? d.summary;

/** Translate fn shape (matches i18n `t`) so these non-hook helpers stay hook-free. */
type TFn = (key: string, params?: Record<string, string | number>) => string;

/**
 * A curated hero place: reliable photo seed + coordinates for the daily Hero Banner.
 * Display name + subtitle are resolved from the dictionary (`place.<id>` / `hero.subtitle.<id>`).
 */
export interface HeroPlace {
  id: string;
  /** image-manifest seed that is known to have a real photo. */
  seed: string;
  lng: number;
  lat: number;
  /** Set when the copy comes from the authoring data instead of the dictionary (Korea). */
  name?: string;
  subtitle?: string;
}

// Rotated daily. Every seed here is verified to resolve to a real photo in the manifest,
// so the hero never falls back to a gradient (027 §Hero Image — "bắt buộc").
export const HERO_PLACES: HeroPlace[] = [
  { id: "sa-pa", seed: "sapa-1", lng: 103.844, lat: 22.336 },
  { id: "ha-long", seed: "halong-1", lng: 107.078, lat: 20.91 },
  { id: "da-lat", seed: "dalat-1", lng: 108.458, lat: 11.94 },
  { id: "hue", seed: "hue-1", lng: 107.59, lat: 16.463 },
  { id: "golden-bridge", seed: "goldenbridge-1", lng: 108.0, lat: 15.995 },
  { id: "mu-cang-chai", seed: "mu-cang-chai-terraces-1", lng: 104.15, lat: 21.71 },
  { id: "ban-gioc", seed: "ban-gioc-waterfall-1", lng: 106.72, lat: 22.855 },
];

const dayOfYear = () =>
  Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

/** Day-of-year rotation so the hero changes every day (027 §Hero Image). */
export function heroOfTheDay(country: CountryCode = "vn"): HeroPlace {
  const doy = dayOfYear();
  if (country === "kr") {
    const ids = krHeroIds.filter((id) => krById.has(id));
    const d = krById.get(ids[doy % ids.length])!;
    return { id: d.id, seed: seedOf(d), lng: d.lng, lat: d.lat, name: krName(d), subtitle: krSummary(d) };
  }
  return HERO_PLACES[doy % HERO_PLACES.length];
}

/**
 * The living calendars (seasonal/festival/flower) name places in their own id namespace, so
 * `sapa-terraces` and friends have no entry in the authoring data. Unjoined, a card could only
 * ever move the camera — `selectDestination` never fired, so the detail panel stayed shut.
 * This table is that join: calendar id → the real destination it names.
 *
 * `navHelpers.test.ts` fails if an id here stops resolving, or if a new calendar id lands with
 * no home: an unmapped id falls through to `reset()`, which silently zooms the map back out.
 */
const CALENDAR_DESTINATION: Record<string, string> = {
  "cat-ba-island": "hp-cat-ba-island",
  "da-nang-coast": "my-khe-beach",
  "ha-giang-loop": "ma-pi-leng-pass",
  "ha-noi-old-quarter": "old-quarter-hanoi",
  "hoi-an-old-town": "hoi-an-ancient-town",
  "nha-trang-coast": "nha-trang-beach",
  "ninh-binh-trang-an": "trang-an",
  // Chùa Hương in Hà Nội — NOT `chua-huong-tich`, a different pagoda 230km south in Hà Tĩnh.
  "perfume-pagoda": "chua-huong",
  // The Katê entry names the tower the festival is actually held at.
  "phan-rang-ninh-thuan": "ntn-po-klong-garai",
  "phan-thiet-coast": "mui-ne-sand-dunes",
  "phong-nha-caves": "phong-nha-cave",
  "phu-yen-coast": "pye-ganh-da-dia",
  "sapa-terraces": "sa-pa-town",
};

/**
 * Calendar ids that name a whole city rather than a place. Their seasonal state is city-wide
 * weather ("mùa mưa chiều, sáng nắng đẹp"), so the province panel is the honest target —
 * promoting one landmark to stand for the city would put the wrong subject on screen.
 */
const CALENDAR_PROVINCE: Record<string, string> = {
  "ho-chi-minh-city": "ho-chi-minh",
};

// A hand-kept coordinate table used to live here as a third fallback. It is gone: every living
// id now reaches a destination or a province, and a table that only moves the camera is exactly
// what shadowed `selectDestination` in the first place. A new calendar id belongs in one of the
// two maps above — or needs a destination authored for it, which is what `perfume-pagoda` got.

// Verified image-manifest seeds for living-calendar ids (their own id namespace has no photos).
// Ids omitted here have no correct Commons photo yet → the card keeps the clean gradient.
const CALENDAR_SEEDS: Record<string, string> = {
  "cat-ba-island": "hp-cat-ba-island-1",
  "da-lat-city": "dalat-1",
  "da-nang-coast": "goldenbridge-1",
  "ha-long-bay": "halong-1",
  "hoi-an-old-town": "hoian-1",
  "hue-imperial-city": "hue-1",
  "moc-chau-plateau": "mocchau-1",
  "mu-cang-chai-terraces": "mu-cang-chai-terraces-1",
  "nha-trang-coast": "nhatrang-1",
  // `perfume-pagoda` used to sit here pointing at "huong-tich-chua-co" — a photo of Chùa Hương
  // Tích in Hà Tĩnh, captioned "Chùa cổ giữa rừng Hồng Lĩnh". The Chùa Hương festival card was
  // showing a different pagoda 230km away. No seed is better than the wrong subject; the new
  // `chua-huong` destination has empty seeds waiting for a reviewed photo.
  "phu-quoc-island": "phuquoc-1",
  "sapa-terraces": "sapa-1",
};

/** Resolve a verified image seed for a living-calendar id (id itself → gradient fallback). */
export function calendarSeed(id: string): string {
  return CALENDAR_SEEDS[id] ?? id;
}

export interface SeasonalHighlight {
  id: string;
  name: string;
  state: string;
  icon: string;
  /** image-manifest seed (falls back to the id → gradient when unmapped). */
  seed: string;
}

type SeasonEntry = { destinationId: string; state: string; icon: string; mood: string };

/** Current-month "Today's Highlights" cards from the seasonal calendar (027 §Today's Highlights). */
export function seasonalHighlights(
  limit: number,
  t: TFn,
  locale: Locale,
  country: CountryCode = "vn",
): SeasonalHighlight[] {
  const month = new Date().getMonth() + 1;
  if (country === "kr") {
    return (krSeasonalCalendar[String(month)] ?? [])
      .slice(0, limit)
      .map((e) => {
        const d = krById.get(e.destinationId);
        return {
          id: e.destinationId,
          name: d ? krName(d) : e.destinationId,
          state: krSeasonalState(month, e.destinationId, e.state, locale),
          icon: e.icon,
          seed: d ? seedOf(d) : e.destinationId,
        };
      });
  }
  const entries = (seasonalCalendar as Record<string, SeasonEntry[]>)[String(month)] ?? [];
  return entries.slice(0, limit).map((e) => ({
    id: e.destinationId,
    name: t(`place.${e.destinationId}`),
    state: localizeSeasonalState(month, e.destinationId, e.state, locale),
    icon: e.icon,
    seed: CALENDAR_SEEDS[e.destinationId] ?? e.destinationId,
  }));
}

const HIDDEN_GEMS = [
  "son-doong-cave",
  "tra-su-forest",
  "dray-nur-waterfall",
  "ma-pi-leng-pass",
  "bai-sao-beach",
  "hon-mun-island",
  "buon-don",
  "mieu-ba-chua-xu",
];

export interface GemOfDay {
  id: string;
  name: string;
  summary: string;
  seed: string;
}

/** Hidden Gem of the day — rotates daily, resolved from the authoring destinations. */
export function gemOfTheDay(country: CountryCode = "vn"): GemOfDay | null {
  const doy = dayOfYear();
  if (country === "kr") {
    const ids = krHiddenGemIds.filter((id) => krById.has(id));
    const d = krById.get(ids[doy % ids.length]);
    return d ? { id: d.id, name: krName(d), summary: krSummary(d), seed: seedOf(d) } : null;
  }
  const id = HIDDEN_GEMS[doy % HIDDEN_GEMS.length];
  const dest = destinations.find((d) => d.id === id || d.slug === id);
  if (!dest) return null;
  return {
    id: dest.id,
    name: dest.name,
    summary: dest.summary,
    seed: dest.gallery?.[0]?.seed ?? dest.id,
  };
}

/** Fly the map to a lng/lat and dismiss the mobile drawer. */
export function focusPoint(lng: number, lat: number, zoom = 7): void {
  useMapStore.getState().requestFocus({ kind: "point", lng, lat, zoom });
  useUIStore.getState().setSidebarMobileOpen(false);
}

/**
 * "Show me this" for a destination id coming from the living calendars or content: open the
 * panel that describes it, and fly the map there. Every living-calendar id reaches one; the
 * `reset()` at the end is for an id from nowhere, not a documented gap.
 */
export function focusDestinationById(id: string, country: CountryCode = "vn"): void {
  if (country === "kr") {
    const d = krById.get(id);
    if (d) {
      useMapStore.getState().selectDestination(d.id, d.provinceSlug);
      return focusPoint(d.lng, d.lat);
    }
    useMapStore.getState().reset();
    return useUIStore.getState().setSidebarMobileOpen(false);
  }

  const province = CALENDAR_PROVINCE[id];
  if (province) {
    // selectProvince already frames the province, so no focusPoint here.
    useMapStore.getState().selectProvince(province);
    return useUIStore.getState().setSidebarMobileOpen(false);
  }

  const destId = CALENDAR_DESTINATION[id] ?? id;
  const dest = destinations.find((d) => d.id === destId || d.slug === destId);
  if (dest) {
    useMapStore.getState().selectDestination(dest.id, dest.provinceSlug);
    return focusPoint(dest.lng, dest.lat);
  }

  useMapStore.getState().reset();
  useUIStore.getState().setSidebarMobileOpen(false);
}
