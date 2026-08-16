/**
 * Trip planner API client.
 *
 * The plan is identified by its parameters rather than a server id, so the encoded parameter
 * string doubles as the cache key, the `?trip=` URL value and the share link. `encodeTripId` /
 * `decodeTripId` are the one place that format is defined — `trip.test.ts` pins the round trip.
 */

import { activeCountry } from "@/lib/store/useCountryStore";
import type { CountryCode } from "@/lib/types";
import { ENGINE_VERSION } from "@/lib/itinerary/config";
import type { TripPace, TripPlan, TripStyle } from "@/lib/itinerary/types";
import { apiGet } from "./client";

export interface TripParams {
  originProvince: string;
  days: number;
  style: TripStyle;
  pace: TripPace;
  pinned?: string[];
}

const STYLES: TripStyle[] = ["nature", "heritage", "food", "beach", "mixed"];
const PACES: TripPace[] = ["relaxed", "balanced", "packed"];

/**
 * `da-nang-5-heritage-balanced` — readable, shareable and SEO-legible, which an opaque hash is not.
 * Province slugs contain hyphens (`ba-ria-vung-tau`), so the province is whatever is left once the
 * three fixed trailing fields are removed.
 */
export function encodeTripId(p: TripParams): string {
  return `${p.originProvince}-${p.days}-${p.style}-${p.pace}`;
}

export function decodeTripId(id: string): TripParams | null {
  const parts = id.split("-");
  if (parts.length < 4) return null;
  const pace = parts.pop() as TripPace;
  const style = parts.pop() as TripStyle;
  const days = Number(parts.pop());
  const originProvince = parts.join("-");
  if (!originProvince || !STYLES.includes(style) || !PACES.includes(pace)) return null;
  if (!Number.isInteger(days) || days < 2 || days > 10) return null;
  return { originProvince, days, style, pace };
}

function query(p: TripParams, cc: CountryCode): string {
  const q = new URLSearchParams({
    origin: p.originProvince,
    days: String(p.days),
    style: p.style,
    pace: p.pace,
  });
  // Sorted so permutations share one cache entry, client-side and at the edge alike.
  if (p.pinned?.length) q.set("pinned", [...new Set(p.pinned)].sort().join(","));
  if (cc !== "vn") q.set("country", cc);
  // The engine version is what makes a deploy visible: responses are cached at the edge for an
  // hour, so without it a change to the planner keeps serving yesterday's schedule until the TTL
  // expires. `ENGINE_VERSION` documented this and nothing implemented it — the Worker reads only
  // the params it knows and Cloudflare keys on the whole query string, so carrying it here is all
  // it ever needed.
  q.set("v", ENGINE_VERSION);
  return `?${q.toString()}`;
}

const cache = new Map<string, Promise<TripPlan | null>>();

/** Cached by params + country, matching the promise-memo pattern in `content.ts` / `food.ts`. */
export function fetchTripPlan(p: TripParams, cc: CountryCode = activeCountry()): Promise<TripPlan | null> {
  const key = `${cc}:${encodeTripId(p)}:${(p.pinned ?? []).join(",")}`;
  let hit = cache.get(key);
  if (!hit) {
    hit = apiGet<TripPlan>(`/trip/plan${query(p, cc)}`).catch(() => null);
    cache.set(key, hit);
  }
  return hit;
}
