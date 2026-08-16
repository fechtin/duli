/**
 * Turning bases and candidates into dated, clocked days — docs/031.md §§Phase 6, 9.
 *
 * The load-bearing decision here is that a day is a **minutes budget**, not a place count. Pace
 * sets the budget; how many stops fit is an outcome. That is what stops the engine proposing three
 * half-day sites in one afternoon, and it is why `PACE.maxStops` is a safety cap rather than a
 * target.
 *
 * Guarantees this module owns (all pinned in `schedule.test.ts`):
 *   - a place appears at most once in the whole trip;
 *   - a stop is never scheduled outside a *known* opening window — if it cannot fit, it is dropped;
 *   - nothing runs past the end of the day;
 *   - a full-day place does not share its day with unrelated stops;
 *   - lunch costs an hour of the clock, so a day that eats has room for one less stop.
 *
 * Relative imports only (Worker bundle) — see `types.ts`.
 */

import type { Candidate } from "./candidates.ts";
import { nearbyBonus, patternBonus } from "./candidates.ts";
import type { Base } from "./cluster.ts";
import type { PaceProfile } from "./config.ts";
import {
  BUFFER_PER_STOP_MIN,
  MAX_TRAVEL_TO_VISIT_RATIO,
  DAY_END_MIN,
  DAY_START_MIN,
  LATEST_HOME_MIN,
  LUNCH_EARLIEST_MIN,
  LUNCH_LATEST_MIN,
  MEAL_DURATION_MIN,
  PACE,
  PATTERN_SEED_MIN_CONFIDENCE,
  SCORE,
  TRAVEL,
  TYPE_PROFILE,
} from "./config.ts";
import { fitVisit } from "./hours.ts";
import { sequence } from "./route.ts";
import type { TravelTimeProvider } from "./travel.ts";
import type { PatternRow, TripInput, TripPace, TripStop } from "./types.ts";

export interface DayPlan {
  day: number;
  base: Base;
  stops: TripStop[];
  travelMinutes: number;
  visitMinutes: number;
  /** True when the traveller slept somewhere else last night. */
  transfer: boolean;
  rerollable: boolean;
  /** Any stop whose opening hours could not be established. */
  hoursUnknown: boolean;
}

/**
 * Hand out the trip's days along the route.
 *
 * Walking the route in order and letting each base take as many days as it can genuinely fill is
 * what keeps transfers down: the days are spent before the far end of the corridor is reached, so
 * a short trip stays near home and a long one reaches further, without either being a rule.
 *
 * Capacity is counted in days a base can *populate*, not in raw minutes. A full-day place occupies
 * a day by itself no matter how the arithmetic divides, so it is counted separately — measuring
 * only `weight / budget` under-counts Đà Nẵng (one full-day cable car plus two half-days is three
 * days of content, not two).
 */
export function allocateDays(
  bases: Base[],
  days: number,
  _originSlug: string,
  pace: TripPace,
): Map<string, number> {
  const budget = PACE[pace].activeMinutes;

  const capOf = (base: Base) => {
    let fullDays = 0;
    let rest = 0;
    for (const c of base.candidates) {
      if (c.visit.fullDay || TYPE_PROFILE[c.place.type]?.fullDayProne) fullDays++;
      else rest += c.visit.minutes + BUFFER_PER_STOP_MIN;
    }
    return Math.max(1, fullDays + Math.ceil(rest / budget));
  };

  const alloc = new Map<string, number>();
  let remaining = days;
  for (const base of bases) {
    if (remaining <= 0) break;
    const take = Math.min(capOf(base), remaining);
    alloc.set(base.slug, take);
    remaining -= take;
  }
  return alloc;
}

/** Pick the places for one day out of what its base has left. */
function pickForDay(
  base: Base,
  used: Set<string>,
  input: TripInput,
  seed: number,
  patterns?: PatternRow[],
): Candidate[] {
  const pace = PACE[input.pace];
  const pool = base.candidates.filter((c) => !used.has(c.place.id));
  if (!pool.length) return [];

  // The seed rotates which of the equally-good candidates leads the day, so a future
  // "regenerate day 3" can differ without touching any other day. Deterministic: no RNG.
  const rotated = seed > 0 ? [...pool.slice(seed % pool.length), ...pool.slice(0, seed % pool.length)] : pool;

  // A full-day place owns its day — but only when it is the day's BEST candidate, not merely
  // present among them. Scanning the whole pool for one meant that in a region with several
  // (the Red River Delta has Tràng An, Tam Chúc, Côn Sơn…) every single day collapsed to one
  // lone site, and a five-day Hà Nội request came back with three days of one stop each.
  const lead = rotated[0];
  const leadIsFullDay = lead && (lead.visit.fullDay || TYPE_PROFILE[lead.place.type]?.fullDayProne);
  if (lead && leadIsFullDay && lead.visit.minutes >= pace.activeMinutes * 0.7) return [lead];

  const chosen: Candidate[] = [];
  const chosenIds = new Set<string>();
  let budget = pace.activeMinutes;

  // Pins go in before anything else. A pin is an instruction; a mined grouping is a habit. When
  // the grouping seeded first it spent the day's budget and the pinned place — Bãi biển Mỹ Khê in
  // `dn-short-3` — never got a slot, which is precisely the promise a preset makes.
  const pinned = new Set(input.pinned ?? []);
  if (pinned.size) {
    for (const c of rotated) {
      if (chosen.length >= pace.maxStops) break;
      if (!pinned.has(c.place.id) || chosenIds.has(c.place.id) || c.visit.minutes > budget) continue;
      const anchorPoint = chosen.length ? chosen[chosen.length - 1].place : base;
      if (legMinutes(anchorPoint, c.place) > legLimitFor({ visitMinutes: c.visit.minutes }, chosen.length === 0, pace)) {
        continue;
      }
      chosen.push(c);
      chosenIds.add(c.place.id);
      budget -= c.visit.minutes + BUFFER_PER_STOP_MIN;
    }
  }

  // Seed the day from the best mined grouping still available.
  //
  // Two earlier attempts were too weak. A bonus applied during the greedy fill is too late — the
  // first pick sets the day's shape and spends the budget. Seeding from the *leading* candidate's
  // group is also too late, because the places a grouping is about are rarely the highest-scoring
  // thing left: "Bán đảo Sơn Trà" never led a day, so its pagoda got absorbed into the Hải Vân day
  // and the peninsula was orphaned to day five — one day apart, though three sources put them
  // together.
  //
  // Real itineraries are built the other way round: you decide today is the Sơn Trà day, then fill
  // it. So the best-attested grouping with members still free claims the day, and the greedy loop
  // below fills whatever room is left.
  const available = new Set(rotated.map((c) => c.place.id));
  const group = patterns
    ?.filter(
      (p) =>
        // Confident enough to override the day's own ranking. A grouping seen once should colour
        // the order of a day, not seize it.
        p.confidence >= PATTERN_SEED_MIN_CONFIDENCE &&
        p.destinationIds.filter((id) => available.has(id)).length >= 2,
    )
    .sort((a, b) => b.confidence - a.confidence || a.id.localeCompare(b.id))[0];
  if (group) {
    for (const id of group.destinationIds) {
      if (chosen.length >= pace.maxStops) break;
      const c = rotated.find((x) => x.place.id === id);
      if (!c || chosenIds.has(id) || c.visit.minutes > budget) continue;
      // The same reach rule as the greedy fill — a grouping is a reason to visit together, not a
      // licence to cross a province mid-afternoon.
      const anchorPoint = chosen.length ? chosen[chosen.length - 1].place : base;
      if (legMinutes(anchorPoint, c.place) > legLimitFor({ visitMinutes: c.visit.minutes }, chosen.length === 0, pace)) {
        continue;
      }
      chosen.push(c);
      chosenIds.add(id);
      budget -= c.visit.minutes + BUFFER_PER_STOP_MIN;
    }
  }

  while (chosen.length < pace.maxStops) {
    let best: Candidate | null = null;
    let bestScore = -Infinity;
    for (const candidate of rotated) {
      if (chosenIds.has(candidate.place.id)) continue;
      if (candidate.visit.minutes > budget) continue;
      // A base spans everything within day-trip reach, so its pool holds places hours apart in
      // opposite directions. Reaching OUT that far is the point of a day trip; hopping that far
      // once you are already out there is what produces a 16:10 arrival for a one-hour visit.
      const anchorPoint = chosen.length ? chosen[chosen.length - 1].place : base;
      const limit = legLimitFor({ visitMinutes: candidate.visit.minutes }, chosen.length === 0, pace);
      if (legMinutes(anchorPoint, candidate.place) > limit) continue;
      // Travel cost is charged against the day's own shape, so a stop far from what is already
      // picked has to be much better to earn its place.
      const detour = travelPenalty(anchorPoint, candidate.place);
      const score =
        candidate.score +
        nearbyBonus(candidate.place, chosenIds) +
        patternBonus(candidate.place, chosenIds, patterns) -
        detour;
      if (score > bestScore || (score === bestScore && best && candidate.place.id < best.place.id)) {
        bestScore = score;
        best = candidate;
      }
    }
    if (!best) break;
    chosen.push(best);
    chosenIds.add(best.place.id);
    // Visiting plus a nominal hop; the real clock is laid down in `layOutDay`.
    budget -= best.visit.minutes + BUFFER_PER_STOP_MIN;
    if (budget <= 30) break;
  }
  return chosen;
}

/**
 * How long a hop may be, given where the day already is.
 *
 * Three regimes, and the distinction is the whole point: reaching OUT from the base is a day trip
 * and may be long; hopping between stops must stay short; and hopping across a province line
 * mid-day must stay shorter still, because the rest of the day's places are in the province you
 * are standing in.
 */
function legLimitFor(
  to: { visitMinutes: number },
  isFirstStop: boolean,
  pace: PaceProfile,
): number {
  if (isFirstStop) return pace.maxOutboundMinutes;
  // Whichever is stricter: the pace's own ceiling, or the worth of the place being driven to.
  return Math.min(pace.maxLegMinutes, to.visitMinutes * MAX_TRAVEL_TO_VISIT_RATIO);
}

/** Equirectangular approximation — fine at these distances and far cheaper than haversine. */
function approxKm(a: { lng: number; lat: number }, b: { lng: number; lat: number }): number {
  const dLng = (a.lng - b.lng) * 108;
  const dLat = (a.lat - b.lat) * 111;
  return Math.sqrt(dLng * dLng + dLat * dLat);
}

/** Cheap geographic penalty used only while choosing; the clock uses the real provider. */
function travelPenalty(a: { lng: number; lat: number }, b: { lng: number; lat: number }): number {
  return (approxKm(a, b) / TRAVEL.baseSpeedKmh) * SCORE.travelPenaltyPerHour;
}

/** Cheap leg estimate for the hard leg limit; deliberately consistent with `travelPenalty`. */
function legMinutes(a: { lng: number; lat: number }, b: { lng: number; lat: number }): number {
  return (approxKm(a, b) * TRAVEL.detourFactor.default) / TRAVEL.baseSpeedKmh * 60;
}

/**
 * Put a clock on one day's chosen places.
 *
 * Two things get DROPPED here rather than fudged, and both matter:
 *   - a stop that cannot honestly fit its opening window, because shifting it into a time the
 *     engine cannot vouch for is how you send someone to a locked gate;
 *   - a stop whose leg from the previous one breaks the reach rule.
 *
 * The second is not redundant with the check in `pickForDay`. That one runs in *pick* order, while
 * `sequence()` below re-orders the day geographically — so a pair that was never adjacent when
 * chosen can end up adjacent when driven. That gap put a 59-minute cross-province hop into a Hà Nội
 * day. The limit has to be enforced where the final order is decided.
 */
export function layOutDay(
  chosen: Candidate[],
  base: Base,
  startFrom: { lng: number; lat: number } | null,
  provider: TravelTimeProvider,
  arriveAtMinutes: number,
  pace: PaceProfile = PACE.balanced,
): {
  stops: TripStop[];
  travelMinutes: number;
  visitMinutes: number;
  hoursUnknown: boolean;
  /** When the lunch hour was actually charged, or null if the day ate inside a long visit. */
  lunchAtMinutes: number | null;
} {
  if (!chosen.length) {
    return { stops: [], travelMinutes: 0, visitMinutes: 0, hoursUnknown: false, lunchAtMinutes: null };
  }

  const ordered = sequence(
    chosen.map((c) => ({ lng: c.place.lng, lat: c.place.lat, id: c.place.id, candidate: c })),
    startOf(startFrom ?? base, chosen),
    provider,
  );

  const stops: TripStop[] = [];
  let cursor = Math.max(DAY_START_MIN, arriveAtMinutes);
  let previous: { lng: number; lat: number; provinceSlug?: string } = startFrom
    ? { ...startFrom }
    : { lng: base.lng, lat: base.lat, provinceSlug: base.slug };
  let travelMinutes = 0;
  let visitMinutes = 0;
  let hoursUnknown = false;
  let lunchAtMinutes: number | null = null;

  for (const node of ordered) {
    const c = node.candidate;
    // Lunch is charged to the clock at the first gap inside the lunch window, and everything
    // downstream is pushed by it — which is the entire point: an hour spent eating is an hour that
    // is no longer available for a third stop, and the plan should say so rather than quietly
    // assuming the traveller eats in zero time. `cursor` only ever advances on a *scheduled* stop,
    // so this reads "the traveller is free at this moment".
    if (lunchAtMinutes === null && cursor >= LUNCH_EARLIEST_MIN && cursor <= LUNCH_LATEST_MIN) {
      lunchAtMinutes = cursor;
      cursor += MEAL_DURATION_MIN;
    }
    // Re-check reach against the ORDER THE DAY IS ACTUALLY DRIVEN, not the order it was picked in.
    if (legMinutes(previous, c.place) > legLimitFor({ visitMinutes: c.visit.minutes }, stops.length === 0, pace)) continue;
    const leg = provider.minutesBetween({ ...previous }, { lng: c.place.lng, lat: c.place.lat, type: c.place.type });
    const arriveBy = cursor + leg;
    // Fit the stay to the gate rather than demanding the nominal duration: "1 ngày" is a tourist
    // day, not eight unbroken hours, and insisting on the literal figure made three national parks
    // unschedulable in every trip the atlas can generate.
    const fit = fitVisit(c.hours, arriveBy, c.visit.minutes);
    if (fit === null) continue; // too little of the window left to be worth the journey
    // The rule is "don't drive longer than you'll STAY", so it must be measured against the visit
    // actually scheduled rather than the one hoped for. `fitVisit` trims a stay against the closing
    // time, and a leg justified by a nominal three hours is not justified by the eighty minutes
    // left before the gate shuts. The pre-check above uses the nominal figure and so is only ever
    // a cheap prune; this is where the promise is kept. Charging the lunch hour is what exposed the
    // gap — arriving an hour later trims more visits — but the defect predates it.
    if (stops.length > 0 && legMinutes(previous, c.place) > legLimitFor({ visitMinutes: fit.minutes }, false, pace)) {
      continue;
    }
    const start = fit.start;
    const end = start + fit.minutes;
    if (end > DAY_END_MIN) continue; // would run past the end of the day
    // …and you still have to get home. Enforced from the SECOND stop on: committing a whole day
    // to somewhere remote and getting back late is a real trip (Bù Gia Mập is exactly that), while
    // appending another stop that strands you there is not. Vetoing the day's only stop instead
    // emptied the day, and an empty day used to cost the base every remaining night it had.
    const home = provider.minutesBetween(
      { lng: c.place.lng, lat: c.place.lat, type: c.place.type },
      { lng: base.lng, lat: base.lat },
    );
    if (stops.length > 0 && end + home > LATEST_HOME_MIN) continue;

    stops.push({
      destinationId: c.place.id,
      provinceSlug: c.place.provinceSlug,
      order: stops.length + 1,
      arrivalMinutes: start,
      departureMinutes: end,
      visitMinutes: fit.minutes,
      travelFromPreviousMinutes: stops.length === 0 && !startFrom ? 0 : leg,
      hoursKnown: c.hours.kind !== "unknown",
    });
    if (c.hours.kind === "unknown") hoursUnknown = true;
    travelMinutes += stops.length === 1 && !startFrom ? 0 : leg;
    visitMinutes += fit.minutes;
    cursor = end + BUFFER_PER_STOP_MIN;
    previous = { lng: c.place.lng, lat: c.place.lat, provinceSlug: c.place.provinceSlug };
  }

  // The traveller sleeps at the base, so the drive home is part of the day whether or not the
  // timeline draws it. Leaving it out is what makes a Huế day trip look like a three-hour outing.
  if (stops.length) travelMinutes += provider.minutesBetween(previous, { lng: base.lng, lat: base.lat });

  return { stops, travelMinutes, visitMinutes, hoursUnknown, lunchAtMinutes };
}

/**
 * Which stop the day starts at.
 *
 * Normally the one nearest where the traveller wakes up. But a purely geographic order ignores
 * that some places shut before others: Bán đảo Sơn Trà wants four hours and closes at 18:00, so it
 * has to be under way by 14:00. Ordered by distance alone it landed third and got dropped for
 * hours — the day looked geographically tidy and quietly lost the thing the traveller pinned.
 *
 * So: whatever shuts first, goes first. Only when a stop is genuinely tight (its last possible
 * start is before mid-afternoon), otherwise distance decides as before.
 */
function startOf(from: { lng: number; lat: number }, candidates: Candidate[]): string {
  const TIGHT_BEFORE = 15 * 60;
  const latestStart = (c: Candidate) =>
    c.hours.kind === "interval" ? c.hours.closeMin - c.visit.minutes : Infinity;

  const tight = candidates
    .filter((c) => latestStart(c) < TIGHT_BEFORE)
    .sort((a, b) => latestStart(a) - latestStart(b) || a.place.id.localeCompare(b.place.id));

  return tight.length ? tight[0].place.id : nearestTo(from, candidates);
}

function nearestTo(from: { lng: number; lat: number }, candidates: Candidate[]): string {
  let bestId = candidates[0].place.id;
  let bestKm = Infinity;
  for (const c of candidates) {
    const dLng = (from.lng - c.place.lng) * 108;
    const dLat = (from.lat - c.place.lat) * 111;
    const km = Math.sqrt(dLng * dLng + dLat * dLat);
    if (km < bestKm || (km === bestKm && c.place.id < bestId)) {
      bestKm = km;
      bestId = c.place.id;
    }
  }
  return bestId;
}

export { pickForDay };
