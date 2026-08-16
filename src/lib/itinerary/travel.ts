/**
 * Travel time between two places — the engine's one deliberate policy exception.
 *
 * `src/lib/ai/prompt.ts:75` instructs the model: *"These are great-circle distances. The road is
 * longer and you do not know by how much. NEVER turn them into a travel time, a route, or a road
 * distance."* That rule exists because a lane once read "~200 km from Hà Nội" and volunteered
 * "4-5 hours by motorbike" — a number nobody verified. `gatewayProvider.test.ts:255` pins it.
 *
 * This module knowingly does the forbidden thing, because an itinerary needs a clock. The
 * exception is bounded, and the bounds are not optional:
 *
 *   1. Every number is rounded to 5 minutes and carries `precision: "estimate"` up the stack,
 *      so the UI cannot render it as though it were measured.
 *   2. **Kilometres are never returned and must never be displayed.** A haversine "road distance"
 *      is a claim about a road nobody drove. Minutes are an admitted estimate; km reads as fact.
 *   3. **Engine output must never be fed into `buildPrompt()`** — that would launder these
 *      estimates into the guide's voice as verified data, which is the exact failure the original
 *      rule was written to prevent. A comment in `prompt.ts` says so.
 *
 * Relative imports only (Worker bundle) — see `types.ts`.
 */

import type { DestinationType } from "../types.ts";
import { COASTAL_TYPES, MOUNTAIN_TYPES, TRAVEL } from "./config.ts";

export interface GeoPoint {
  lng: number;
  lat: number;
  /** Shapes the terrain multiplier; omitted points are treated as ordinary road. */
  type?: DestinationType;
}

/**
 * Swappable so a real routing API can replace the estimate later without touching the planner.
 * docs/031.md §Phase 9 asks for exactly this seam.
 */
export interface TravelTimeProvider {
  /** Estimated door-to-door minutes. Never negative, always rounded. */
  minutesBetween(a: GeoPoint, b: GeoPoint): number;
}

/** Great-circle km. Internal only — see rule 2 above; this value must not escape the module. */
export function haversineKm(aLng: number, aLat: number, bLng: number, bLat: number): number {
  const R = 6371;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(bLat - aLat);
  const dLng = rad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** The harder of the two endpoints decides how much longer the road is than the straight line. */
function detourFactor(a: GeoPoint, b: GeoPoint): number {
  const types = [a.type, b.type].filter(Boolean) as DestinationType[];
  if (types.some((t) => MOUNTAIN_TYPES.includes(t))) return TRAVEL.detourFactor.mountain;
  if (types.some((t) => COASTAL_TYPES.includes(t))) return TRAVEL.detourFactor.coastal;
  return TRAVEL.detourFactor.default;
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/**
 * The default provider: straight-line distance inflated by terrain, at a modest effective speed,
 * plus a fixed overhead for parking and walking in.
 *
 * The factors are judgement, not measurement, and are tuned against the one calibration point the
 * repo already records — `prompt.ts` notes Mù Cang Chải is ~230 km direct but ~280 km by QL32,
 * a 1.22× detour on a route that is only partly mountainous. 1.55× for genuinely mountainous
 * endpoints and 1.25× for ordinary road bracket that. They are configured in one place
 * (`config.ts TRAVEL`) precisely because they are the softest numbers in the engine.
 */
export const haversineTravelProvider: TravelTimeProvider = {
  minutesBetween(a, b) {
    const km = haversineKm(a.lng, a.lat, b.lng, b.lat) * detourFactor(a, b);
    const minutes = (km / TRAVEL.baseSpeedKmh) * 60 + TRAVEL.fixedOverheadMin;
    return Math.max(TRAVEL.roundToMin, roundTo(minutes, TRAVEL.roundToMin));
  },
};

/**
 * Straight-line km between two points, for reach and clustering decisions ONLY.
 * Kept separate from the provider so it is obvious at every call site that this is a geometric
 * test ("is this province in range?"), never something a user is shown.
 */
export function reachKm(a: GeoPoint, b: GeoPoint): number {
  return haversineKm(a.lng, a.lat, b.lng, b.lat);
}
