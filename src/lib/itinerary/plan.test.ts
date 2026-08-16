import { describe, expect, it } from "vitest";
import { destinations } from "@/data/destinations";
import { restaurants } from "@/data/food/restaurants";
import geoVn from "@/data/generated/geo-meta.vn.json";
import {
  DAY_END_MIN,
  DAY_START_MIN,
  LUNCH_EARLIEST_MIN,
  LUNCH_LATEST_MIN,
  MAX_TRAVEL_TO_VISIT_RATIO,
  MEAL_DURATION_MIN,
} from "./config.ts";
import { fitVisit, parseOpeningHours } from "./hours.ts";
import { generateTrip } from "./plan.ts";
import type { MealRow, PlaceRow, ProvinceNode, TripData, TripInput, TripPlan } from "./types.ts";

// docs/031.md §Phase 18 lists what a generated itinerary must never do. This file is that list,
// as assertions, run against the real atlas rather than a toy fixture — the failures that matter
// (a full-day cable car sharing a day, a site scheduled after it shuts, a province visited twice)
// only appear once real durations and real opening hours are in play.

const data: TripData = {
  places: destinations.map(
    (d): PlaceRow => ({
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
    }),
  ),
  provinces: geoVn.provinces.map((p): ProvinceNode => ({ slug: p.slug, lng: p.centroid[0], lat: p.centroid[1] })),
  meals: restaurants.map(
    (r): MealRow => ({
      id: r.id,
      name: r.name,
      provinceSlug: r.provinceSlug,
      lng: r.lng,
      lat: r.lat,
      openHours: r.openHours,
      atlasScore: r.atlasScore,
    }),
  ),
};

const base: TripInput = {
  originProvince: "da-nang",
  days: 5,
  style: "heritage",
  pace: "balanced",
  interests: [],
  country: "vn",
};

const hoursOf = (id: string) => parseOpeningHours(data.places.find((p) => p.id === id)!.openingHours);

/** The matrix docs/031.md asks to be tested. */
const CASES: TripInput[] = [
  { ...base, days: 3 },
  { ...base, days: 5 },
  { ...base, days: 7 },
  { ...base, pace: "relaxed" },
  { ...base, pace: "packed" },
  { ...base, style: "food" },
  { ...base, style: "nature" },
  { ...base, style: "mixed" },
  { ...base, originProvince: "ha-noi", days: 5 },
  { ...base, originProvince: "khanh-hoa", days: 4, style: "beach" },
  { ...base, originProvince: "ha-giang", days: 5, style: "nature" },
];

describe("invariants that hold for every trip", () => {
  for (const input of CASES) {
    const label = `${input.originProvince} ${input.days}d ${input.style}/${input.pace}`;
    const plan = generateTrip(input, data);

    it(`${label}: never schedules the same place twice`, () => {
      const ids = plan.days.flatMap((d) => d.stops.map((s) => s.destinationId));
      expect(ids.length).toBe(new Set(ids).size);
    });

    it(`${label}: never schedules a place outside hours it knows`, () => {
      for (const day of plan.days) {
        for (const stop of day.stops) {
          const spec = hoursOf(stop.destinationId);
          if (spec.kind !== "interval") continue;
          expect(stop.arrivalMinutes).toBeGreaterThanOrEqual(spec.openMin);
          expect(stop.departureMinutes).toBeLessThanOrEqual(spec.closeMin);
        }
      }
    });

    it(`${label}: keeps every stop inside the day`, () => {
      for (const day of plan.days) {
        for (const stop of day.stops) {
          expect(stop.arrivalMinutes).toBeGreaterThanOrEqual(DAY_START_MIN);
          expect(stop.departureMinutes).toBeLessThanOrEqual(DAY_END_MIN);
          expect(stop.departureMinutes).toBeGreaterThan(stop.arrivalMinutes);
        }
      }
    });

    it(`${label}: never promises more days than it asked for, and numbers them 1..n`, () => {
      expect(plan.totalDays).toBeLessThanOrEqual(input.days);
      expect(plan.days.map((d) => d.day)).toEqual(plan.days.map((_, i) => i + 1));
      // An empty day is never emitted — it would render as a blank tab.
      expect(plan.days.every((d) => d.stops.length > 0)).toBe(true);
    });

    it(`${label}: says so when it could not fill the request`, () => {
      if (plan.totalDays < input.days) expect(plan.notices).toContain("shortened");
    });

    it(`${label}: labels every duration an estimate`, () => {
      expect(plan.precision).toBe("estimate");
      // Rounded to 5 minutes so nothing can render as measured precision.
      for (const day of plan.days) {
        for (const stop of day.stops) expect(stop.travelFromPreviousMinutes % 5).toBe(0);
      }
    });
  }
});

describe("full-day places", () => {
  it("gives a whole-day site the day to itself", () => {
    // Cầu Vàng is authored "1 ngày"; docs/031.md §Phase 6 forbids pairing it with several others.
    const plan = generateTrip({ ...base, days: 5, style: "mixed" }, data);
    const goldenDay = plan.days.find((d) => d.stops.some((s) => s.destinationId === "golden-bridge"));
    expect(goldenDay).toBeDefined();
    expect(goldenDay!.stops).toHaveLength(1);
  });

  it("never puts the same outing on two different days", () => {
    // Cầu Vàng and Bà Nà Hills are separate rows 630 m apart behind one cable-car ticket, both
    // authored "1 ngày". Before they were deduped the engine headlined one on day 1 and the other
    // on day 2, which is the most obviously wrong output it can produce.
    for (const input of CASES) {
      const plan = generateTrip(input, data);
      const fullDayStops = plan.days
        .flatMap((d) => d.stops.map((s) => ({ day: d.day, place: data.places.find((p) => p.id === s.destinationId)! })))
        .filter(({ place }) => /^(cả ngày|1 ngày)/i.test(place.visitDuration));
      for (const a of fullDayStops) {
        for (const b of fullDayStops) {
          if (a.place.id >= b.place.id) continue;
          const km = Math.hypot((a.place.lng - b.place.lng) * 108, (a.place.lat - b.place.lat) * 111);
          expect(km, `${a.place.id} and ${b.place.id} are ${km.toFixed(2)}km apart`).toBeGreaterThan(2);
        }
      }
    }
  });

  it("never schedules a multi-day place unless asked", () => {
    const multiDay = new Set(
      data.places.filter((p) => /\d\s*(-|–)?\s*\d?\s*ngày\s*\d+\s*đêm|[2-9]\s*(-|–)\s*\d\s*ngày/.test(p.visitDuration)).map((p) => p.id),
    );
    for (const input of CASES) {
      const ids = generateTrip(input, data).days.flatMap((d) => d.stops.map((s) => s.destinationId));
      expect(ids.filter((id) => multiDay.has(id))).toEqual([]);
    }
  });
});

describe("legs are worth the driving", () => {
  it("never drives longer than the place it drives to is worth", () => {
    // The rule that replaced a cross-province leg limit. Sơn Trà → Chùa Cầu was 45 minutes of
    // driving for a 30-minute visit; the pairings two sources agree on (Ngũ Hành Sơn → Hội An at
    // 25 min, Mỹ Sơn → Hội An at 43 min) both lead to half-day sites and are untouched. Province
    // lines separate none of those three, which is why they are not what this checks.
    const approxKm = (a: PlaceRow, b: PlaceRow) => Math.hypot((a.lng - b.lng) * 108, (a.lat - b.lat) * 111);
    const legMinutes = (a: PlaceRow, b: PlaceRow) => ((approxKm(a, b) * 1.25) / 45) * 60;

    for (const input of CASES) {
      const plan = generateTrip(input, data);
      for (const day of plan.days) {
        for (let i = 1; i < day.stops.length; i++) {
          const from = data.places.find((p) => p.id === day.stops[i - 1].destinationId)!;
          const stop = day.stops[i];
          const to = data.places.find((p) => p.id === stop.destinationId)!;
          expect(
            legMinutes(from, to),
            `${input.originProvince} d${day.day}: ${from.id} → ${to.id}`,
          ).toBeLessThanOrEqual(stop.visitMinutes * MAX_TRAVEL_TO_VISIT_RATIO + 1);
        }
      }
    }
  });
});

describe("the origin province is honoured", () => {
  it("appears in every trip, from every origin", () => {
    // Two separate bugs put the origin outside its own itinerary. A base took its name from
    // whichever province held the most content, so "5 days from Hà Giang" was anchored on Bắc Kạn
    // and Hà Giang never appeared — in the route, in the stops, or in "overnight in…".
    for (const input of CASES) {
      const plan = generateTrip(input, data);
      expect(plan.provinces[0], `${input.originProvince} ${input.days}d`).toBe(input.originProvince);
    }
  });

  it("fills the days it was asked for wherever the atlas has the content", () => {
    // A single low-ranked full-day place used to hijack every day, one stop at a time, until the
    // trip ran dry: "5 days from Hà Nội" returned three days of one stop each.
    for (const input of CASES) {
      const plan = generateTrip(input, data);
      if (plan.notices.includes("shortened")) continue;
      expect(plan.totalDays, `${input.originProvince} ${input.days}d`).toBe(input.days);
      expect(plan.totalStops).toBeGreaterThan(plan.totalDays);
    }
  });

  it("has the traveller sleeping where the itinerary says they do", () => {
    // Two things have to agree and previously did not: `nightProvince` reported the last stop's
    // province while the next morning `layOutDay` started from the base — so the plan promised a
    // bed it then silently teleported you away from. And the base itself sat at the province
    // polygon's centroid, 11–94 km from any actual place, so every day opened with a phantom
    // drive in from a field.
    for (const input of CASES) {
      const plan = generateTrip(input, data);
      for (const day of plan.days) {
        expect(plan.provinces, `${input.originProvince} d${day.day}`).toContain(day.nightProvince);
      }
      // Nights only change when the trip genuinely relocates, never mid-cluster.
      const nights = plan.days.map((d) => d.nightProvince);
      expect(nights[0]).toBe(input.originProvince);
    }
  });

  it("involves the origin even when the style filter would exclude everything in it", () => {
    // Đà Nẵng's own entries are bridges, beaches and markets — nothing a heritage filter wants. A
    // heritage trip from Đà Nẵng that never sets foot there is the bug a user notices first.
    //
    // Deliberately NOT asserting that day one's first stop sits inside the origin province: what
    // keeps an arrival day sane is how far the first drive is, which `maxOutboundMinutes` governs
    // in minutes. Where an administrative line happens to fall says nothing about that.
    const plan = generateTrip({ ...base, style: "heritage" }, data);
    expect(plan.provinces[0]).toBe("da-nang");
  });
});

describe("things the whole-atlas sweep caught", () => {
  // `npm run sweep:trips` runs all 720 combinations; these pin the three defects it found that no
  // unit test would have, so they cannot come back quietly.

  it("fits a long visit into a short opening window instead of refusing it", () => {
    // Cát Tiên is authored "1 ngày" (480 min) but opens 07:00–17:00. Demanding the literal figure
    // made it — and two other national parks — unschedulable in EVERY trip the atlas can build.
    const spec = parseOpeningHours("07:00 - 17:00");
    expect(fitVisit(spec, 9 * 60 + 40, 480)).toEqual({ start: 9 * 60 + 40, minutes: 440 });
    // Still refused when what is left is not worth the drive.
    expect(fitVisit(spec, 16 * 60 + 30, 480)).toBeNull();
    // No window means no constraint.
    expect(fitVisit({ kind: "always", raw: "" }, 600, 240)).toEqual({ start: 600, minutes: 240 });
  });

  it("hands a base's unused days to the next one rather than ending the trip", () => {
    // A single unschedulable morning used to cost the base every remaining night it held: seven
    // days from Bình Phước came back as one.
    const plan = generateTrip(
      { ...base, originProvince: "binh-phuoc", days: 7, style: "nature", pace: "packed" },
      data,
    );
    expect(plan.totalDays).toBeGreaterThan(1);
    expect(plan.provinces[0]).toBe("binh-phuoc");
  });

  it("would rather be short than pad a day out", () => {
    // Every emitted day carries real content; a sixty-minute day dressed up as a day is worse
    // than an honest `shortened`.
    for (const input of CASES) {
      const plan = generateTrip(input, data);
      for (const day of plan.days.slice(1)) {
        if (day.stops.length > 1) continue;
        expect(day.estimatedVisitMinutes, `${input.originProvince} d${day.day}`).toBeGreaterThanOrEqual(120);
      }
    }
  });
});

describe("lunch is an hour of the clock", () => {
  // The engine used to pick a restaurant for 12:00 and then schedule straight through it: the hour
  // was a label on the timeline, never time spent. A plan that assumes the traveller eats in zero
  // minutes overstates how much fits in a day, which is the one thing a day planner must not do.

  it("never runs a stop through the lunch hour it charged", () => {
    for (const input of CASES) {
      const plan = generateTrip(input, data);
      for (const day of plan.days) {
        const lunch = day.meals.find((m) => m.slot === "lunch");
        if (!lunch) continue;

        // The traveller is mid-visit at lunchtime — a long site whose authored duration already
        // includes eating, and which nobody leaves at noon to drive to a restaurant. Nothing is
        // charged, deliberately; see `LUNCH_LATEST_MIN`.
        const onSite = day.stops.some(
          (s) => s.arrivalMinutes <= lunch.atMinutes && s.departureMinutes > lunch.atMinutes,
        );
        if (onSite) continue;

        for (const stop of day.stops) {
          const overlaps =
            stop.arrivalMinutes < lunch.atMinutes + MEAL_DURATION_MIN && stop.departureMinutes > lunch.atMinutes;
          expect(overlaps, `${input.originProvince} d${day.day}: ${stop.destinationId} eats the lunch hour`).toBe(
            false,
          );
        }
      }
    }
  });

  it("keeps the lunch slot at a time a human would call lunch", () => {
    // Charged at the first gap inside the lunch window, so it drifts with the day rather than
    // asserting a fictional 12:00 — 12:55 after Hội An, 11:55 walking out of Trà Quế. It may never
    // drift out of the window.
    for (const input of CASES) {
      const plan = generateTrip(input, data);
      for (const day of plan.days) {
        const lunch = day.meals.find((m) => m.slot === "lunch");
        if (!lunch) continue;
        expect(lunch.atMinutes, `${input.originProvince} d${day.day}`).toBeGreaterThanOrEqual(LUNCH_EARLIEST_MIN);
        expect(lunch.atMinutes, `${input.originProvince} d${day.day}`).toBeLessThanOrEqual(LUNCH_LATEST_MIN);
      }
    }
  });
});

describe("determinism", () => {
  const stable = (plan: TripPlan) => JSON.stringify(plan);

  it("returns byte-identical output for identical input", () => {
    for (const input of CASES) {
      expect(stable(generateTrip(input, data))).toBe(stable(generateTrip(input, data)));
    }
  });

  it("is not sensitive to the order places arrive from the database", () => {
    // D1 gives no ordering guarantee without ORDER BY. If the plan depended on row order the
    // same URL would render differently on different edge nodes.
    const shuffled: TripData = { ...data, places: [...data.places].reverse() };
    expect(stable(generateTrip(base, shuffled))).toBe(stable(generateTrip(base, data)));
  });

  it("varies only the seeded day", () => {
    const plain = generateTrip({ ...base, days: 5, style: "mixed" }, data);
    const rerolled = generateTrip({ ...base, days: 5, style: "mixed", seeds: [0, 0, 1, 0, 0] }, data);
    // Days before the reroll are untouched — docs/031.md is explicit that regenerating day 3 must
    // not disturb days 1 and 2.
    expect(JSON.stringify(rerolled.days.slice(0, 2))).toBe(JSON.stringify(plain.days.slice(0, 2)));
  });
});

describe("localized data would corrupt the plan", () => {
  it("produces a different plan when fed translated durations — which is why the Worker must not", () => {
    // `worker/db.ts toDestination()` overlays the i18n translation onto visitDuration and
    // openingHours. Feeding that to a Vietnamese-vocabulary parser makes every duration fall back
    // and every window unknown, so the SAME trip would differ by request locale and a shared link
    // would not reproduce. This test exists so the day someone "simplifies" the Worker query by
    // reusing toDestination(), something goes red.
    const korean: TripData = {
      ...data,
      places: data.places.map((p) => ({ ...p, visitDuration: "2시간", openingHours: "09:00~18:00" })),
    };
    expect(JSON.stringify(generateTrip(base, korean))).not.toBe(JSON.stringify(generateTrip(base, data)));
  });
});
