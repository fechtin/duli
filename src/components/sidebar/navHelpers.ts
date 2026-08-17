import { destinations } from "@/data/destinations";
import { destinationsKr } from "@/data/kr";
import { krHeroIds, krHiddenGemIds, krSeasonalCalendar } from "@/data/kr/living";
import { krSeasonalState } from "@/data/kr/living-i18n";
import seasonalCalendar from "@/data/living/seasonal-calendar.json";
import { localizeSeasonalState } from "@/lib/living/livingI18n";
import {
  CALENDAR_DESTINATION,
  CALENDAR_PROVINCE,
  CALENDAR_SEED_OVERRIDES,
  HERO_PLACES,
  type HeroPlace,
} from "@/lib/living/calendarJoin";
import { thumbSeedFor } from "@/lib/media/gallery";
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

export { HERO_PLACES, type HeroPlace };

const dayOfYear = () =>
  Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

/** Day-of-year rotation so the hero changes every day (027 §Hero Image). */
export function heroOfTheDay(country: CountryCode = "vn"): HeroPlace {
  const doy = dayOfYear();
  if (country === "kr") {
    const ids = krHeroIds.filter((id) => krById.has(id));
    const d = krById.get(ids[doy % ids.length])!;
    return {
      id: d.id,
      seed: thumbSeedFor(d.id),
      lng: d.lng,
      lat: d.lat,
      name: krName(d),
      subtitle: krSummary(d),
    };
  }
  return HERO_PLACES[doy % HERO_PLACES.length];
}

/**
 * The photo for a living-calendar card, DERIVED from the same table that decides where the card
 * navigates (`CALENDAR_DESTINATION` in `lib/living/calendarJoin`).
 *
 * It used to be a second hand-kept table, and that is the whole bug: `ha-giang-loop` was in the
 * navigation table and missing from the photo table, so the card opened Đèo Mã Pì Lèng — a place
 * with eight photos — under a blank gradient. Nobody can forget to fill in a table that is
 * computed. What stays hand-written is only deliberate disagreement, and `check:photos` verifies
 * every entry of it still resolves.
 */
export function calendarSeed(id: string): string {
  return CALENDAR_SEED_OVERRIDES[id] ?? thumbSeedFor(CALENDAR_DESTINATION[id] ?? id);
}

export interface SeasonalHighlight {
  id: string;
  name: string;
  state: string;
  icon: string;
  /** image-manifest seed, derived from the card's destination (the id itself → gradient). */
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
          seed: d ? thumbSeedFor(d.id) : e.destinationId,
        };
      });
  }
  const entries = (seasonalCalendar as Record<string, SeasonEntry[]>)[String(month)] ?? [];
  return entries.slice(0, limit).map((e) => ({
    id: e.destinationId,
    name: t(`place.${e.destinationId}`),
    state: localizeSeasonalState(month, e.destinationId, e.state, locale),
    icon: e.icon,
    seed: calendarSeed(e.destinationId),
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
    return d ? { id: d.id, name: krName(d), summary: krSummary(d), seed: thumbSeedFor(d.id) } : null;
  }
  const id = HIDDEN_GEMS[doy % HIDDEN_GEMS.length];
  const dest = destinations.find((d) => d.id === id || d.slug === id);
  if (!dest) return null;
  return {
    id: dest.id,
    name: dest.name,
    summary: dest.summary,
    seed: thumbSeedFor(dest.id),
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
