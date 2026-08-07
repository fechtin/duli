import type { CountryCode } from "@/lib/types";

/**
 * Deep links to external map apps, so a place in the atlas can hand the user off to
 * turn-by-turn directions.
 *
 * Built from coordinates, never from a name search: every destination and restaurant in the
 * dataset carries `lng`/`lat` (verified against the entry's `sourceUrl`), while a name search
 * can silently land on a same-named place in another province. The name is passed only as the
 * pin LABEL where the provider supports one.
 */
export interface MapPlace {
  name: string;
  lng: number;
  lat: number;
}

/** 6 decimals ≈ 0.1 m — more than enough, and drops the trailing zeros toFixed leaves. */
const coord = (n: number): string => String(Number(n.toFixed(6)));

/** Naver reads its path segments comma-separated, so a comma inside the label breaks the URL. */
const label = (name: string): string => encodeURIComponent(name.replace(/[,/]/g, " ").trim());

/** Google Maps directions to the exact point (works on web, Android and iOS). */
export function googleMapsUrl(place: MapPlace): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${coord(place.lat)},${coord(place.lng)}`;
}

/**
 * Naver Map directions — the map Koreans actually use (Google has no driving directions in
 * Korea). Path is `/p/directions/{start}/{goal}/{waypoints}/{mode}`; `-` leaves the start
 * empty so the app fills in the user's location.
 */
export function naverMapUrl(place: MapPlace): string {
  const goal = `${coord(place.lng)},${coord(place.lat)},${label(place.name)}`;
  return `https://map.naver.com/p/directions/-/${goal}/-/transit`;
}

export type MapProvider = "google" | "naver";

export interface MapLink {
  provider: MapProvider;
  /** Provider name — a brand, so it is NOT translated. */
  name: string;
  url: string;
}

/** Every map app worth offering for a place, in the order they should be shown. */
export function mapLinks(place: MapPlace, country: CountryCode): MapLink[] {
  const links: MapLink[] = [{ provider: "google", name: "Google Maps", url: googleMapsUrl(place) }];
  if (country === "kr") links.push({ provider: "naver", name: "Naver Map", url: naverMapUrl(place) });
  return links;
}
