/**
 * Which places are even eligible, and how good is each one.
 *
 * docs/031.md §Phase 4 asks for candidate selection; §Phase 16 demands the engine stay
 * destination-agnostic. Both fall out of one mechanism — an adaptive radius ladder anchored on the
 * origin province. Rung 0 is "this province only", which IS a city day-planner the moment a
 * province carries enough venues, so a single code path serves both a Seoul city trip and a
 * five-province Central-Vietnam route.
 *
 * Relative imports only (Worker bundle) — see `types.ts`.
 */

import {
  CO_SITE_KM,
  PACE,
  RADIUS_LADDER_KM,
  SCORE,
  STYLE_INTERESTS,
  TYPE_PROFILE,
} from "./config.ts";
import { parseVisitDuration } from "./duration.ts";
import { parseOpeningHours } from "./hours.ts";
import { reachKm } from "./travel.ts";
import type {
  OpenSpec,
  PatternRow,
  PlaceRow,
  ProvinceNode,
  TripData,
  TripInput,
  TripInterest,
  VisitSpec,
} from "./types.ts";

export interface Candidate {
  place: PlaceRow;
  visit: VisitSpec;
  hours: OpenSpec;
  /** Merit, before any day-specific travel penalty. */
  score: number;
}

export interface CandidateSet {
  candidates: Candidate[];
  /** Provinces the ladder settled on, origin first. */
  provinces: string[];
  radiusKm: number;
  /** True when even the widest rung could not supply the requested days. */
  short: boolean;
}

/** Interests come from the explicit picks, else from the style preset. Empty = no filter. */
export function resolveInterests(input: TripInput): TripInterest[] {
  return input.interests.length ? input.interests : STYLE_INTERESTS[input.style];
}

/** How many interests this place's type satisfies. */
function interestMatches(place: PlaceRow, interests: TripInterest[]): number {
  if (!interests.length) return 0;
  const types = TYPE_PROFILE[place.type];
  if (!types) return 0;
  return interests.filter((i) => types.interests.includes(i)).length;
}

function scoreOf(
  place: PlaceRow,
  hours: OpenSpec,
  interests: TripInterest[],
  pinned: Set<string>,
): number {
  let score = pinned.has(place.id) ? SCORE.pinned : 0;
  if (place.featured) score += SCORE.featured;
  for (const badge of place.badges) score += SCORE.badge[badge] ?? 0;
  score += interestMatches(place, interests) * SCORE.interestMatch;
  if (hours.kind !== "unknown") score += SCORE.hoursKnown;
  return score;
}

/**
 * Where the traveller actually is.
 *
 * NOT the province polygon's centroid, which is a poor stand-in for its contents: measured, Nghệ
 * An's centroid sits 31–94 km from its own destinations, and Quảng Nam's 26–73 km. Averaging the
 * province's real places puts the anchor where the places are.
 */
function originAnchor(origin: ProvinceNode, places: PlaceRow[]): { lng: number; lat: number } {
  const own = places.filter((p) => p.provinceSlug === origin.slug);
  if (!own.length) return origin;
  return {
    lng: own.reduce((sum, p) => sum + p.lng, 0) / own.length,
    lat: own.reduce((sum, p) => sum + p.lat, 0) / own.length,
  };
}

/**
 * Pick the narrowest rung that can actually fill the requested days.
 *
 * "Enough" is measured in MINUTES, not places. Counting places is what produces twelve-hour days:
 * of the fifteen places in the Đà Nẵng r150 corridor, four are full-day and seven more are
 * "Nửa ngày". The demand figure deliberately undershoots a full day's budget, because a day is
 * padded out with travel, meals and buffers as well as visiting.
 */
export function selectCandidates(input: TripInput, data: TripData): CandidateSet {
  const interests = resolveInterests(input);
  const pinned = new Set(input.pinned ?? []);
  const origin = data.provinces.find((p) => p.slug === input.originProvince);
  if (!origin) return { candidates: [], provinces: [], radiusKm: 0, short: true };

  const anchor = originAnchor(origin, data.places);

  const eligible = (place: PlaceRow): Candidate | null => {
    const profile = TYPE_PROFILE[place.type];
    const visit = parseVisitDuration(place.visitDuration, profile?.fallbackMinutes ?? 120);
    if (visit.multiDay && !input.allowMultiDay) return null;
    const hours = parseOpeningHours(place.openingHours);
    return { place, visit, hours, score: scoreOf(place, hours, interests, pinned) };
  };

  // Visiting minutes a day realistically absorbs, once travel/meals/buffers take their cut.
  // Set high on purpose: under-expanding is the worse failure, because a rung that *looks*
  // sufficient on paper (three places, 900 minutes) still yields a two-day trip once a full-day
  // place eats a whole day on its own.
  const demandMinutes = input.days * PACE[input.pace].activeMinutes * 0.9;

  const ladder = RADIUS_LADDER_KM[input.country] ?? RADIUS_LADDER_KM.vn;
  let best: CandidateSet | null = null;

  for (const radiusKm of ladder) {
    // Reach is measured to each PLACE, not to its province. A province is an administrative fact
    // with no bearing on how far anything is: selecting whole provinces by centroid pulled in
    // places 250 km away and left out others 40 km away.
    const pool = data.places.filter(
      (p) => p.provinceSlug === input.originProvince || reachKm(anchor, p) <= radiusKm,
    );
    const candidates = pool.map(eligible).filter((c): c is Candidate => c !== null);

    // The origin province is never filtered out. A "5 days from Đà Nẵng" that skips Đà Nẵng
    // because its three places happen to be a bridge and two mountains is not a heritage trip,
    // it is a bug the traveller notices first. Their own city always gets a vote.
    //
    // And an interest filter that empties the pool has told us nothing useful — fall back to the
    // whole pool rather than shipping a trip with two stops in it.
    const filtered = interests.length
      ? candidates.filter(
          (c) =>
            pinned.has(c.place.id) ||
            c.place.provinceSlug === input.originProvince ||
            interestMatches(c.place, interests) > 0,
        )
      : candidates;
    const chosen = filtered.length >= input.days ? filtered : candidates;

    const supply = chosen.reduce((sum, c) => sum + c.visit.minutes, 0);
    // Provinces are now a RESULT of which places were reachable, never an input to it.
    const provinces = [...new Set(chosen.map((c) => c.place.provinceSlug))];
    best = { candidates: chosen, provinces, radiusKm, short: supply < demandMinutes };

    // A pinned place outside the current rung is not in the pool at all, so it would drop out
    // silently — the trip would simply not contain the thing it was asked for. Keep widening until
    // every pin is reachable, even when this rung already had enough content on its own.
    const pinsCovered = [...pinned].every((id) => chosen.some((c) => c.place.id === id));
    if (supply >= demandMinutes && pinsCovered) break;
  }

  const result = best ?? { candidates: [], provinces: [origin.slug], radiusKm: 0, short: true };
  result.candidates.sort((a, b) => b.score - a.score || a.place.id.localeCompare(b.place.id));
  result.candidates = dedupeCoLocatedFullDays(result.candidates);
  return result;
}

/**
 * Collapse full-day entries that describe the same outing.
 *
 * Cầu Vàng and Bà Nà Hills are two rows 630 m apart behind one cable-car ticket, each authored
 * "1 ngày". They are not a sequence — you cannot spend eight hours at one and eight at the other —
 * so they are alternatives, and the trip should feature the better-scoring one exactly once.
 * Scheduling could not fix this: it would either double-count sixteen hours or, as it did, drop
 * the second and let it reappear as tomorrow's headline.
 *
 * Restricted to full-day entries on purpose. Downtown Đà Nẵng has eight entries inside 1.5 km that
 * are genuinely separate half-hour stops, and collapsing those would delete the city centre.
 */
function dedupeCoLocatedFullDays(candidates: Candidate[]): Candidate[] {
  const isFullDay = (c: Candidate) => c.visit.fullDay || TYPE_PROFILE[c.place.type]?.fullDayProne;
  const kept: Candidate[] = [];
  for (const candidate of candidates) {
    if (!isFullDay(candidate)) {
      kept.push(candidate);
      continue;
    }
    // Candidates arrive best-first, so the first of a co-located pair is the one worth keeping.
    const twin = kept.some((k) => isFullDay(k) && reachKm(k.place, candidate.place) <= CO_SITE_KM);
    if (!twin) kept.push(candidate);
  }
  return kept;
}

/** Co-occurrence bonus: `nearby` holds destination **ids**, not slugs. Verified 242/242 in VN. */
export function nearbyBonus(place: PlaceRow, chosenIds: Set<string>): number {
  if (!place.nearby.length) return 0;
  const hits = place.nearby.filter((id) => chosenIds.has(id)).length;
  return hits * SCORE.nearbyEdge;
}

/**
 * Bonus for a place that real itineraries schedule alongside something already on the day.
 *
 * This is what geometry cannot know. Ngũ Hành Sơn and Hội An are 20 km apart with several equally
 * close alternatives between them; what makes them one day is that they sit on the same road south
 * and everyone does them together. Only the mined patterns carry that.
 *
 * Counted once per pattern, not once per overlapping place, so a four-place group cannot pay out
 * four times and drown the editorial signal.
 */
export function patternBonus(
  place: PlaceRow,
  chosenIds: Set<string>,
  patterns: PatternRow[] | undefined,
): number {
  if (!patterns?.length || !chosenIds.size) return 0;
  let bonus = 0;
  for (const pattern of patterns) {
    if (!pattern.destinationIds.includes(place.id)) continue;
    const overlaps = pattern.destinationIds.some((id) => id !== place.id && chosenIds.has(id));
    if (overlaps) bonus += SCORE.patternEdge * pattern.confidence;
  }
  return bonus;
}
