/**
 * The orchestrator — the only entry point the Worker calls.
 *
 * `generateTrip` is a pure function of (input, data). That is not incidental tidiness: the plan is
 * identified in the URL by its parameters rather than by a server-side id, the response is
 * edge-cacheable, and every test can assert an exact output. Nothing in this directory may call
 * `Math.random()` or read a clock — `purity.test.ts` enforces both.
 *
 * Relative imports only (Worker bundle) — see `types.ts`.
 */

import { selectCandidates } from "./candidates.ts";
import { buildBases } from "./cluster.ts";
import type { Base } from "./cluster.ts";
import { DAY_START_MIN, ENGINE_VERSION, MIN_DAY_VISIT_MIN, PACE, WATER_CROSSING_HINT_KM } from "./config.ts";
import { planMeals } from "./meals.ts";
import { sequence } from "./route.ts";
import { allocateDays, layOutDay, pickForDay } from "./schedule.ts";
import { deriveTheme } from "./theme.ts";
import { haversineTravelProvider, reachKm } from "./travel.ts";
import type { TravelTimeProvider } from "./travel.ts";
import type { TripData, TripDay, TripInput, TripNoticeKey, TripPlan } from "./types.ts";

/**
 * Provinces in the order the traveller meets them, origin first.
 *
 * `visited` keeps the route's own ordering; anything only slept in is folded in at the point it is
 * first used, so the ribbon reads as the journey rather than as a set.
 */
function orderProvinces(origin: string, routeOrder: string[], days: TripDay[]): string[] {
  const touched = new Set<string>();
  for (const day of days) {
    for (const stop of day.stops) touched.add(stop.provinceSlug);
    touched.add(day.nightProvince);
  }
  const ordered = routeOrder.filter((slug) => touched.has(slug));
  for (const slug of touched) if (!ordered.includes(slug)) ordered.push(slug);
  return origin && ordered.includes(origin) ? [origin, ...ordered.filter((s) => s !== origin)] : ordered;
}

export function generateTrip(
  input: TripInput,
  data: TripData,
  provider: TravelTimeProvider = haversineTravelProvider,
): TripPlan {
  const empty: TripPlan = {
    originProvince: input.originProvince,
    provinces: [],
    requestedDays: input.days,
    totalDays: 0,
    totalStops: 0,
    estimatedTravelMinutes: 0,
    precision: "estimate",
    days: [],
    notices: ["shortened"],
    engineVersion: ENGINE_VERSION,
  };

  const set = selectCandidates(input, data);
  if (!set.candidates.length) return empty;

  const bases = buildBases(set, provider, input.originProvince);
  if (!bases.length) return empty;

  const ordered = sequence(
    bases.map((b) => ({ lng: b.lng, lat: b.lat, id: b.slug, base: b })),
    input.originProvince,
    provider,
  ).map((n) => n.base);

  const allocation = allocateDays(ordered, input.days, input.originProvince, input.pace);
  const itinerary = ordered.filter((b) => allocation.has(b.slug));

  const used = new Set<string>();
  const takenMeals = new Set<string>();
  const days: TripDay[] = [];
  const notices = new Set<TripNoticeKey>();
  const provinceOrder: string[] = [];

  let previousBase: Base | null = null;
  let dayNumber = 1;

  // Days a base could not use roll forward. Without this, one unschedulable morning threw away
  // every remaining day of its base: a seven-day trip from Bình Phước collapsed to a single day.
  let carry = 0;

  for (const base of itinerary) {
    const allocated = (allocation.get(base.slug) ?? 1) + carry;
    carry = 0;
    for (const p of base.provinces) if (!provinceOrder.includes(p)) provinceOrder.push(p);

    for (let nth = 0; nth < allocated; nth++) {
      const transfer = nth === 0 && previousBase !== null;
      // The transfer is NOT added to the clock here. `layOutDay` is handed the previous base as
      // the day's starting point and charges the real leg to the first stop — adding it twice is
      // how a transfer day ends up arriving at noon.
      const seed = input.seeds?.[dayNumber - 1] ?? 0;
      const startFrom = transfer && previousBase ? { lng: previousBase.lng, lat: previousBase.lat } : null;

      // A first pick can be entirely unschedulable *today* without being a bad pick: Cù Lao Chàm
      // wants a full day but the last boat back is 16:00, so arriving from Đà Nẵng at 09:30 it can
      // never fit — while Hội An and Mỹ Sơn sit in the same base, perfectly available. Giving up
      // on the day would end the trip early and blame the data. So retry without the places that
      // could not be placed; the exclusion is per-day, because tomorrow they may well fit.
      const blockedToday = new Set<string>();
      let laid = layOutDay([], base, startFrom, provider, DAY_START_MIN, PACE[input.pace]);
      for (let attempt = 0; attempt < 3; attempt++) {
        const chosen = pickForDay(base, new Set([...used, ...blockedToday]), input, seed, data.patterns);
        if (!chosen.length) break;
        laid = layOutDay(chosen, base, startFrom, provider, DAY_START_MIN, PACE[input.pace]);
        if (laid.stops.length) break;
        for (const c of chosen) blockedToday.add(c.place.id);
      }
      for (const stop of laid.stops) used.add(stop.destinationId);

      // A day that could not place a single stop means the area is exhausted — stop cleanly
      // rather than emitting empty days.
      // A day with one short stop in it is padding, not a day. Stop here and let `shortened` say
      // so — the traveller can judge a four-day answer to a five-day question; they cannot judge a
      // fifth day that is sixty minutes of sightseeing dressed up as one.
      // Never applied to day one. The opening day is what anchors the trip at the province the
      // traveller asked to start from; rejecting it for thinness handed the whole itinerary to a
      // neighbour, which is the one outcome nobody would forgive.
      const floor = Math.max(MIN_DAY_VISIT_MIN, PACE[input.pace].activeMinutes * 0.3);
      const threadbare = dayNumber > 1 && laid.stops.length <= 1 && laid.visitMinutes < floor;
      if (!laid.stops.length || threadbare) {
        carry = allocated - nth;
        break;
      }

      const meals = planMeals(laid.stops, base, data.meals, takenMeals);
      if (meals.some((m) => !m.restaurantId)) notices.add("mealsUnknown");
      if (laid.hoursUnknown) notices.add("hoursUnknown");

      // An island stop is reached by a boat this engine has no schedule for; say so rather than
      // pretending the drive estimate covers it.
      const islandStop = laid.stops.some((s) => {
        const c = base.candidates.find((x) => x.place.id === s.destinationId);
        return c?.place.type === "island";
      });
      if (islandStop) notices.add("waterCrossing");
      if (transfer && previousBase && reachKm(previousBase, base) > WATER_CROSSING_HINT_KM * 3) {
        notices.add("waterCrossing");
      }

      const theme = deriveTheme(dayNumber, laid.stops, base.candidates, {
        transfer,
        fromProvince: previousBase?.slug ?? null,
        toProvince: base.slug,
      });

      days.push({
        day: dayNumber,
        themeKey: theme.themeKey,
        themeParams: theme.themeParams,
        // You sleep at the base and the next day starts from there — `layOutDay` is handed the
        // base as its origin for every non-transfer day, so reporting the last stop's province
        // instead would promise a bed the following morning silently teleports you away from.
        nightProvince: base.slug,
        estimatedTravelMinutes: laid.travelMinutes,
        estimatedVisitMinutes: laid.visitMinutes,
        stops: laid.stops,
        meals,
        // A reroll that returns the same day looks broken; with 2–3 usable places per base that
        // is common, so the UI is told up front whether the button is worth showing.
        rerollable: base.candidates.filter((c) => !used.has(c.place.id)).length > 0,
      });

      previousBase = base;
      dayNumber++;
    }
  }

  if (days.length < input.days) notices.add("shortened");

  return {
    originProvince: input.originProvince,
    // Everywhere the trip actually touches: somewhere you stop, or somewhere you sleep. Listing
    // only provinces containing a stop dropped the very place the plan told you to spend the
    // night in — sleeping in one province and day-tripping out of it is normal, not an anomaly.
    provinces: orderProvinces(input.originProvince, provinceOrder, days),
    requestedDays: input.days,
    totalDays: days.length,
    totalStops: days.reduce((sum, d) => sum + d.stops.length, 0),
    estimatedTravelMinutes: days.reduce((sum, d) => sum + d.estimatedTravelMinutes, 0),
    precision: "estimate",
    days,
    notices: [...notices],
    engineVersion: ENGINE_VERSION,
  };
}
