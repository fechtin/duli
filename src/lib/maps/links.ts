import type { CountryCode } from "@/lib/types";

/**
 * Deep links to external map apps, so a place in the atlas can be opened where the user's own
 * map app knows it: photos, reviews, opening hours. They land on the PLACE, not on a route —
 * routing is one tap away inside those apps, and it is the wrong first step anyway, since most
 * people want to look the place over again before committing to going there.
 *
 * Built from coordinates, never from a name search: every destination and restaurant in the
 * dataset carries `lng`/`lat` (verified against the entry's `sourceUrl`), while a name search
 * can silently land on a same-named place in another province. The name is passed only as the
 * pin LABEL where the provider supports one.
 */
export interface MapPlace {
  /** Atlas entry id — what a Naver place id is resolved from. See maps/naver-places.ts. */
  id?: string;
  name: string;
  lng: number;
  lat: number;
}

/** 6 decimals ≈ 0.1 m — more than enough, and drops the trailing zeros toFixed leaves. */
const coord = (n: number): string => String(Number(n.toFixed(6)));

/**
 * Google Maps at the exact point (works on web, Android and iOS). The Maps URLs API drops a pin
 * there and opens the place card when a real place sits on those coordinates.
 */
export function googleMapsUrl(place: MapPlace): string {
  return `https://www.google.com/maps/search/?api=1&query=${coord(place.lat)},${coord(place.lng)}`;
}

/**
 * Naver Map — the map Koreans actually use (Google is crippled in Korea).
 *
 * Naver has no coordinate URL worth linking: `/p/?lng=&lat=` is silently dropped by the new map
 * app, and even when a pin does land, a bare pin carries none of what the user came to check.
 * The page that does is the place entry — photos, hours, menu, reviews — addressed by Naver's own
 * place id, which scripts/resolve-naver-places.mjs looks up for every Korean entry.
 *
 * Without an id we can only hand Naver the name and let its search rank it, which is why the
 * resolver exists at all.
 */
export function naverMapUrl(place: MapPlace, placeId?: string): string {
  if (placeId) return `https://map.naver.com/p/entry/place/${placeId}`;
  return `https://map.naver.com/p/search/${encodeURIComponent(place.name)}`;
}

export type MapProvider = "google" | "naver";

export interface MapLink {
  provider: MapProvider;
  /** Provider name — a brand, so it is NOT translated. */
  name: string;
  url: string;
}

/** Every map app worth opening a place in, in the order they should be shown. */
export function mapLinks(place: MapPlace, country: CountryCode, naverPlaceId?: string): MapLink[] {
  const links: MapLink[] = [{ provider: "google", name: "Google Maps", url: googleMapsUrl(place) }];
  if (country === "kr")
    links.push({ provider: "naver", name: "Naver Map", url: naverMapUrl(place, naverPlaceId) });
  return links;
}
