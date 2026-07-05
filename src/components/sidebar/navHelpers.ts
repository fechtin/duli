import { destinations } from "@/data/destinations";
import seasonalCalendar from "@/data/living/seasonal-calendar.json";
import { useMapStore } from "@/lib/store/useMapStore";
import { useUIStore } from "@/lib/store/useUIStore";

/** A curated hero place: reliable photo seed + coordinates for the daily Hero Banner. */
export interface HeroPlace {
  id: string;
  name: string;
  subtitle: string;
  /** image-manifest seed that is known to have a real photo. */
  seed: string;
  lng: number;
  lat: number;
}

// Rotated daily. Every seed here is verified to resolve to a real photo in the manifest,
// so the hero never falls back to a gradient (027 §Hero Image — "bắt buộc").
export const HERO_PLACES: HeroPlace[] = [
  { id: "sa-pa", name: "Sa Pa", subtitle: "Ruộng bậc thang mùa nước đổ", seed: "sapa-1", lng: 103.844, lat: 22.336 },
  { id: "ha-long", name: "Vịnh Hạ Long", subtitle: "Kỳ quan giữa muôn đảo đá", seed: "halong-1", lng: 107.078, lat: 20.91 },
  { id: "da-lat", name: "Đà Lạt", subtitle: "Thành phố ngàn thông sương phủ", seed: "dalat-1", lng: 108.458, lat: 11.94 },
  { id: "hue", name: "Huế", subtitle: "Cố đô trầm mặc bên sông Hương", seed: "hue-1", lng: 107.59, lat: 16.463 },
  { id: "golden-bridge", name: "Cầu Vàng", subtitle: "Bàn tay đá nâng cầu trên mây", seed: "goldenbridge-1", lng: 108.0, lat: 15.995 },
  { id: "mu-cang-chai", name: "Mù Cang Chải", subtitle: "Mùa vàng trên đỉnh Tây Bắc", seed: "mu-cang-chai-terraces-1", lng: 104.15, lat: 21.71 },
  { id: "ban-gioc", name: "Thác Bản Giốc", subtitle: "Thác nước hùng vĩ nơi biên cương", seed: "ban-gioc-waterfall-1", lng: 106.72, lat: 22.855 },
];

/** Day-of-year rotation so the hero changes every day (027 §Hero Image). */
export function heroOfTheDay(): HeroPlace {
  const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return HERO_PLACES[doy % HERO_PLACES.length];
}

// Coordinates for the living-calendar destination ids (seasonal/festival/flower), which use
// their own id namespace distinct from the content destinations (see briefGenerator DEST_NAMES).
const CALENDAR_COORDS: Record<string, { lng: number; lat: number }> = {
  "cat-ba-island": { lng: 107.048, lat: 20.797 },
  "da-lat-city": { lng: 108.458, lat: 11.94 },
  "da-nang-coast": { lng: 108.22, lat: 16.06 },
  "ha-giang-loop": { lng: 105.0, lat: 23.1 },
  "ha-long-bay": { lng: 107.078, lat: 20.91 },
  "ho-chi-minh-city": { lng: 106.7, lat: 10.776 },
  "hoi-an-old-town": { lng: 108.338, lat: 15.88 },
  "hue-imperial-city": { lng: 107.59, lat: 16.463 },
  "moc-chau-plateau": { lng: 104.63, lat: 20.84 },
  "mu-cang-chai-terraces": { lng: 104.15, lat: 21.71 },
  "nha-trang-coast": { lng: 109.196, lat: 12.238 },
  "ninh-binh-trang-an": { lng: 105.89, lat: 20.25 },
  "perfume-pagoda": { lng: 105.75, lat: 20.62 },
  "phan-thiet-coast": { lng: 108.1, lat: 10.93 },
  "phong-nha-caves": { lng: 106.28, lat: 17.59 },
  "phu-quoc-island": { lng: 103.96, lat: 10.22 },
  "phu-yen-coast": { lng: 109.3, lat: 13.09 },
  "sapa-terraces": { lng: 103.844, lat: 22.336 },
};

const CALENDAR_NAMES: Record<string, string> = {
  "cat-ba-island": "Cát Bà",
  "da-lat-city": "Đà Lạt",
  "da-nang-coast": "Đà Nẵng",
  "ha-giang-loop": "Hà Giang",
  "ha-long-bay": "Hạ Long",
  "ho-chi-minh-city": "TP. Hồ Chí Minh",
  "hoi-an-old-town": "Hội An",
  "hue-imperial-city": "Huế",
  "moc-chau-plateau": "Mộc Châu",
  "mu-cang-chai-terraces": "Mù Cang Chải",
  "nha-trang-coast": "Nha Trang",
  "ninh-binh-trang-an": "Ninh Bình",
  "perfume-pagoda": "Chùa Hương",
  "phan-thiet-coast": "Phan Thiết",
  "phong-nha-caves": "Phong Nha",
  "phu-quoc-island": "Phú Quốc",
  "phu-yen-coast": "Phú Yên",
  "sapa-terraces": "Sa Pa",
};

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
  "perfume-pagoda": "huong-tich-chua-co",
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
export function seasonalHighlights(limit = 4): SeasonalHighlight[] {
  const month = new Date().getMonth() + 1;
  const entries = (seasonalCalendar as Record<string, SeasonEntry[]>)[String(month)] ?? [];
  return entries.slice(0, limit).map((e) => ({
    id: e.destinationId,
    name: CALENDAR_NAMES[e.destinationId] ?? e.destinationId,
    state: e.state,
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
export function gemOfTheDay(): GemOfDay | null {
  const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
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
 * Best-effort "fly there" for a destination id coming from the living calendars or content.
 * Resolves coordinates from the calendar map first, then the authoring destinations, else
 * resets the map. Opens the panel when the id is a real content destination.
 */
export function focusDestinationById(id: string): void {
  const cal = CALENDAR_COORDS[id];
  if (cal) return focusPoint(cal.lng, cal.lat);

  const dest = destinations.find((d) => d.id === id || d.slug === id);
  if (dest) {
    useMapStore.getState().selectDestination(dest.id, dest.provinceSlug);
    return focusPoint(dest.lng, dest.lat);
  }

  useMapStore.getState().reset();
  useUIStore.getState().setSidebarMobileOpen(false);
}
