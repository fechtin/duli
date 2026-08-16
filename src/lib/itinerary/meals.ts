/**
 * Meal slots — the part of docs/031.md §Phase 11 that the mockup wrote as "12:00 Lunch / free time".
 *
 * It can do better than that, because the atlas already carries editorially-scored restaurants
 * with coordinates and hours. But only just: 38 rows over 20 of 80 provinces, and in the flagship
 * Đà Nẵng corridor `quang-ngai` and `quang-tri` have **zero**. So the degradation ladder is the
 * common path, not a fallback, and tiers 2 and 3 matter more than tier 1:
 *
 *   1. a scored restaurant in the province the traveller is actually in at that hour;
 *   2. any scored restaurant in the base's other provinces;
 *   3. no data → hold the slot open as free time, and say so.
 *
 * Tier 3 is a first-class outcome. An empty slot labelled "free time" is honest; a restaurant
 * invented to fill it would be exactly the fabrication this project's provenance rule forbids.
 *
 * Relative imports only (Worker bundle) — see `types.ts`.
 */

import type { Base } from "./cluster.ts";
import { DINNER_MIN, LUNCH_MIN } from "./config.ts";
import { parseOpeningHours } from "./hours.ts";
import { reachKm } from "./travel.ts";
import type { MealRow, TripMeal, TripStop } from "./types.ts";

/** Don't send someone 40 km for lunch. */
const MEAL_REACH_KM = 12;
/** Still walkable-to-by-car once the near option is gone. Distance, never a province line. */
const MEAL_FALLBACK_KM = 30;

function pickMeal(
  meals: MealRow[],
  near: { lng: number; lat: number },
  atMinutes: number,
  taken: Set<string>,
): MealRow | null {
  const open = (m: MealRow) => {
    const spec = parseOpeningHours(m.openHours);
    return spec.kind !== "interval" || (atMinutes >= spec.openMin && atMinutes <= spec.closeMin);
  };
  const rank = (a: MealRow, b: MealRow) =>
    b.atlasScore - a.atlasScore || a.id.localeCompare(b.id);

  // Tier 1 — close to where the traveller actually is. Measured in kilometres, because a province
  // boundary says nothing about whether you can get to lunch.
  const tier1 = meals
    .filter((m) => !taken.has(m.id) && open(m) && reachKm(near, m) <= MEAL_REACH_KM)
    .sort(rank);
  if (tier1.length) return tier1[0];

  // Tier 2 — reach relaxed, still bounded. Without the bound this offered a Hội An bánh mì to
  // someone standing on top of Bà Nà; a meal you cannot get to is worse than an honest blank.
  const tier2 = meals
    .filter((m) => !taken.has(m.id) && open(m) && reachKm(near, m) <= MEAL_FALLBACK_KM)
    .sort(rank);
  if (tier2.length) return tier2[0];

  // Tier 3 — nothing to offer.
  return null;
}

/**
 * Slot lunch and dinner around the day's stops. The slot exists whether or not it can be filled;
 * a timeline with a visible gap at 12:00 reads as a plan, one that silently skips lunch reads as
 * a bug.
 */
export function planMeals(stops: TripStop[], base: Base, meals: MealRow[], taken: Set<string>): TripMeal[] {
  if (!stops.length) return [];

  const positionAt = (minutes: number): { lng: number; lat: number; provinceSlug: string } => {
    // Wherever the traveller most recently was at that hour.
    const previous = [...stops].reverse().find((s) => s.arrivalMinutes <= minutes) ?? stops[0];
    const place = base.candidates.find((c) => c.place.id === previous.destinationId);
    return place
      ? { lng: place.place.lng, lat: place.place.lat, provinceSlug: place.place.provinceSlug }
      : { lng: base.lng, lat: base.lat, provinceSlug: base.slug };
  };

  const out: TripMeal[] = [];
  for (const [slot, atMinutes] of [["lunch", LUNCH_MIN], ["dinner", DINNER_MIN]] as const) {
    const where = positionAt(atMinutes);
    const pick = pickMeal(meals, where, atMinutes, taken);
    if (pick) taken.add(pick.id);
    out.push({
      slot,
      atMinutes,
      restaurantId: pick?.id,
      restaurantName: pick?.name,
      provinceSlug: pick?.provinceSlug ?? where.provinceSlug,
    });
  }
  return out;
}
