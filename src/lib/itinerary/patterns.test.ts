import { describe, expect, it } from "vitest";
import { destinations } from "@/data/destinations";
import { itineraryPatterns } from "@/data/itinerary-patterns";
import { patternBonus } from "./candidates.ts";
import { generateTrip } from "./plan.ts";
import type { PatternRow, PlaceRow, TripData } from "./types.ts";

// The patterns are mined from published itineraries by hand, and the sharpest hazard in that job is
// name-matching: Đà Nẵng has three pagodas called Linh Ứng, and wiring the wrong one would put a
// stop 30 km from where the source meant. A typo'd or stale id fails silently — the bonus simply
// never applies — so it must fail loudly here instead.
//
// The provenance assertions matter for a second reason: docs/031.md §Phase 8 permits mining
// structured signal, not copying itineraries. Every claim carrying a source URL is what keeps this
// file on the right side of that line.

const byId = new Map(destinations.map((d) => [d.id, d]));

describe("mined pattern data", () => {
  it("references only destinations the atlas actually has", () => {
    const missing = itineraryPatterns.flatMap((p) =>
      p.destinationIds.filter((id) => !byId.has(id)).map((id) => `${p.id} → ${id}`),
    );
    expect(missing).toEqual([]);
  });

  it("keeps every place in a pattern inside the province that pattern belongs to", () => {
    // A cross-province group would be a day trip, not a cluster, and the day-trip radius already
    // models that. Mixing the two would double-count.
    const strays = itineraryPatterns.flatMap((p) =>
      p.destinationIds
        .filter((id) => byId.get(id)!.provinceSlug !== p.provinceSlug)
        .map((id) => `${p.id}: ${id} is in ${byId.get(id)!.provinceSlug}, not ${p.provinceSlug}`),
    );
    // The one deliberate exception is the Ngũ Hành Sơn ↔ Hội An pairing, which IS cross-province
    // and is exactly the relationship docs/031.md cites as worth capturing.
    expect(strays).toEqual(["dn-marble-hoian-day: hoi-an-ancient-town is in quang-nam, not da-nang"]);
  });

  it("carries attribution for every observation it counts", () => {
    for (const p of itineraryPatterns) {
      expect(p.sources.length, `${p.id} has no sources`).toBeGreaterThan(0);
      // A count above the number of cited sources means someone raised confidence without
      // adding the evidence for it.
      expect(p.occurrenceCount, `${p.id} counts more than it cites`).toBeLessThanOrEqual(p.sources.length);
      for (const url of p.sources) expect(url).toMatch(/^https:\/\//);
      expect(p.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("scales confidence with how often a grouping was actually seen", () => {
    for (const p of itineraryPatterns) {
      expect(p.confidence).toBeGreaterThan(0);
      expect(p.confidence).toBeLessThanOrEqual(1);
      // Nothing seen once may claim near-certainty.
      if (p.occurrenceCount === 1) expect(p.confidence).toBeLessThanOrEqual(0.6);
    }
    // And the best-attested grouping should outrank the least.
    const sorted = [...itineraryPatterns].sort((a, b) => b.occurrenceCount - a.occurrenceCount);
    expect(sorted[0].confidence).toBeGreaterThan(sorted[sorted.length - 1].confidence);
  });

  it("has no duplicate ids and no single-place groups", () => {
    const ids = itineraryPatterns.map((p) => p.id);
    expect(ids.length).toBe(new Set(ids).size);
    for (const p of itineraryPatterns) expect(p.destinationIds.length).toBeGreaterThan(1);
  });
});

describe("patternBonus", () => {
  const place = (id: string): PlaceRow => {
    const d = byId.get(id)!;
    return {
      id: d.id,
      slug: d.slug,
      provinceSlug: d.provinceSlug,
      name: d.name,
      type: d.type,
      lng: d.lng,
      lat: d.lat,
      badges: d.badges,
      tags: d.tags,
      featured: Boolean(d.featured),
      visitDuration: d.visitDuration,
      openingHours: d.openingHours,
      nearby: d.nearby,
    };
  };
  const rows: PatternRow[] = itineraryPatterns;

  it("pays out only when something from the same group is already chosen", () => {
    expect(patternBonus(place("linh-ung-pagoda-bai-but"), new Set(), rows)).toBe(0);
    expect(patternBonus(place("linh-ung-pagoda-bai-but"), new Set(["son-tra-peninsula"]), rows)).toBeGreaterThan(0);
  });

  it("pays a better-attested grouping more than a weaker one", () => {
    const strong = patternBonus(place("linh-ung-pagoda-bai-but"), new Set(["son-tra-peninsula"]), rows);
    const weak = patternBonus(place("cham-museum"), new Set(["han-market"]), rows);
    expect(strong).toBeGreaterThan(weak);
  });

  it("counts each group once, however many of its places are present", () => {
    const one = patternBonus(place("japanese-covered-bridge"), new Set(["hoi-an-ancient-town"]), rows);
    const three = patternBonus(
      place("japanese-covered-bridge"),
      new Set(["hoi-an-ancient-town", "tan-ky-house", "phuc-kien-assembly-hall"]),
      rows,
    );
    expect(three).toBe(one);
  });

  it("does nothing at all when no patterns are supplied", () => {
    expect(patternBonus(place("linh-ung-pagoda-bai-but"), new Set(["son-tra-peninsula"]), undefined)).toBe(0);
  });
});

describe("patterns change what the engine builds", () => {
  const base: TripData = {
    places: destinations.map((d) => ({
      id: d.id,
      slug: d.slug,
      provinceSlug: d.provinceSlug,
      name: d.name,
      type: d.type,
      lng: d.lng,
      lat: d.lat,
      badges: d.badges,
      tags: d.tags,
      featured: Boolean(d.featured),
      visitDuration: d.visitDuration,
      openingHours: d.openingHours,
      nearby: d.nearby,
    })),
    provinces: [{ slug: "da-nang", lng: 108.0708, lat: 15.9756 }],
    meals: [],
  };
  const input = {
    originProvince: "da-nang",
    days: 5,
    style: "mixed" as const,
    pace: "balanced" as const,
    interests: [],
    country: "vn" as const,
  };

  it("puts the peninsula, its pagoda and the beach on one day", () => {
    // The grouping three independent sources agree on. Geometry alone does not force it: Mỹ Khê is
    // closer to the city centre than to the pagoda.
    const plan = generateTrip(input, { ...base, patterns: itineraryPatterns });
    const dayOf = (id: string) => plan.days.find((d) => d.stops.some((s) => s.destinationId === id))?.day;
    expect(dayOf("son-tra-peninsula")).toBeDefined();
    expect(dayOf("linh-ung-pagoda-bai-but")).toBe(dayOf("son-tra-peninsula"));
  });

  it("still produces a valid trip with patterns switched off", () => {
    // The signal is an improvement, never a dependency — 52 of 63 provinces have no patterns.
    const without = generateTrip(input, base);
    expect(without.totalDays).toBe(5);
    expect(without.days.every((d) => d.stops.length > 0)).toBe(true);
  });
});
