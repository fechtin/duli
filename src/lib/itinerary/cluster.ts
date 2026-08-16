/**
 * Grouping places into overnight bases — docs/031.md §Phase 5.
 *
 * The spec asks for geographic clustering so nearby attractions land on the same day. What decides
 * a base is not "which province is this in" but **where would you sleep** — and real itineraries
 * are unambiguous about that: a Đà Nẵng trip keeps one hotel and day-trips to Hội An, Bà Nà and
 * even Huế, while a Hà Giang trip moves bed every single night because the next town is four hours
 * of mountain road away.
 *
 * So provinces merge into one base whenever they are within day-trip reach of its anchor
 * (`DAY_TRIP_KM`), and relocation happens only where the geography genuinely forces it. One rule,
 * both observed behaviours, no special cases.
 *
 * A consequence worth stating: a single-province trip yields exactly one base, which is precisely
 * right — a city trip has one hotel.
 *
 * `nearby` is deliberately NOT used here. It maxes out at degree 2 with only two cross-province
 * edges in the whole VN atlas; it is a pair hint, not a graph, and clustering on it would produce
 * confident nonsense. It earns its keep as a scoring nudge in `candidates.ts` instead.
 *
 * Relative imports only (Worker bundle) — see `types.ts`.
 */

import type { Candidate, CandidateSet } from "./candidates.ts";
import { DAY_TRIP_MINUTES } from "./config.ts";
import { reachKm } from "./travel.ts";
import type { TravelTimeProvider } from "./travel.ts";

export interface Base {
  /** Province the traveller sleeps in — the one holding this cluster's seed. */
  slug: string;
  /** Every province this base covers. */
  provinces: string[];
  lng: number;
  lat: number;
  candidates: Candidate[];
  /** Total visitable minutes here; drives how many days the base earns. */
  weight: number;
}

export function buildBases(
  set: CandidateSet,
  provider: TravelTimeProvider,
  originSlug?: string,
): Base[] {
  if (!set.candidates.length) return [];

  /**
   * Where the traveller starts. Their own province's places if it has any, so the first base is
   * home rather than wherever the densest cluster happens to be.
   */
  const own = set.candidates.filter((c) => c.place.provinceSlug === originSlug);
  const seedPool = own.length ? own : set.candidates;
  const homeAnchor = {
    lng: seedPool.reduce((sum, c) => sum + c.place.lng, 0) / seedPool.length,
    lat: seedPool.reduce((sum, c) => sum + c.place.lat, 0) / seedPool.length,
  };

  // Cluster the PLACES, not their provinces. Grouping by province meant two spots 5 km apart could
  // land in different bases while two 200 km apart shared one, purely because of where an
  // administrative line happens to run.
  const remaining = [...set.candidates].sort(
    (a, b) => reachKm(homeAnchor, a.place) - reachKm(homeAnchor, b.place) || a.place.id.localeCompare(b.place.id),
  );

  const bases: Base[] = [];
  let first = true;
  while (remaining.length) {
    // Seed at whatever is now closest to home. The FIRST base additionally prefers a place in the
    // origin province: Ô Quý Hồ sits on the Lào Cai border and is nearer the Lào Cai centroid than
    // anything in Lào Cai, so a trip "from Lào Cai" was reporting nights in Lai Châu.
    let index = 0;
    if (first && own.length) {
      const preferred = remaining.findIndex((c) => c.place.provinceSlug === originSlug);
      if (preferred >= 0) index = preferred;
    }
    first = false;
    const seed = remaining.splice(index, 1)[0];
    const members = [seed];
    for (let i = remaining.length - 1; i >= 0; i--) {
      // Reachable and back in a day, in minutes with terrain — not straight-line kilometres.
      if (provider.minutesBetween(seed.place, remaining[i].place) <= DAY_TRIP_MINUTES) {
        members.push(...remaining.splice(i, 1));
      }
    }
    members.sort((a, b) => b.score - a.score || a.place.id.localeCompare(b.place.id));

    // Where you would actually sleep: the middle of what this base contains. NOT the province
    // centroid, which is 11–24 km from Đà Nẵng's own places and 31–94 km from Nghệ An's — every
    // day would then start with a phantom drive from a field. The province only names it.
    const centre = {
      lng: members.reduce((sum, m) => sum + m.place.lng, 0) / members.length,
      lat: members.reduce((sum, m) => sum + m.place.lat, 0) / members.length,
    };
    bases.push({
      slug: seed.place.provinceSlug,
      // Seed's province first: `plan.provinces` reads this in order, and a trip must open with
      // where it started rather than with whichever province the best-scoring member sits in.
      provinces: [...new Set([seed.place.provinceSlug, ...members.map((m) => m.place.provinceSlug)])],
      lng: centre.lng,
      lat: centre.lat,
      candidates: members,
      weight: members.reduce((sum, c) => sum + c.visit.minutes, 0),
    });
  }

  return bases;
}
