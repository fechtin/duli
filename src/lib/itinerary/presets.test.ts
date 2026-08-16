import { describe, expect, it } from "vitest";
import { destinations } from "@/data/destinations";
import { itineraryPatterns } from "@/data/itinerary-patterns";
import { presetsFor, tripPresets } from "@/data/trip-presets";
import geoVn from "@/data/generated/geo-meta.vn.json";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { generateTrip } from "./plan.ts";
import type { PlaceRow, ProvinceNode, TripData } from "./types.ts";

// A preset is a promise made in the UI ("Đà Nẵng cổ điển · 5 ngày") and kept by the engine. The
// two ways it can quietly break are a pinned id that no longer exists, and a pin the radius ladder
// never reaches — in both cases the trip silently omits the thing it advertised. Neither throws,
// so both are asserted here.

const byId = new Map(destinations.map((d) => [d.id, d]));

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
  meals: [],
  patterns: itineraryPatterns,
};

describe("preset definitions", () => {
  it("pins only destinations the atlas has", () => {
    const missing = tripPresets.flatMap((p) =>
      p.pinned.filter((id) => !byId.has(id)).map((id) => `${p.id} → ${id}`),
    );
    expect(missing).toEqual([]);
  });

  it("names every preset in all five languages", () => {
    for (const preset of tripPresets) {
      for (const [locale, dict] of Object.entries(dictionaries)) {
        expect(dict[preset.labelKey], `${preset.labelKey} missing in ${locale}`).toBeTruthy();
      }
    }
  });

  it("has unique ids and a sane length", () => {
    const ids = tripPresets.map((p) => p.id);
    expect(ids.length).toBe(new Set(ids).size);
    for (const p of tripPresets) {
      expect(p.days).toBeGreaterThanOrEqual(2);
      expect(p.days).toBeLessThanOrEqual(10);
      expect(p.pinned.length).toBeGreaterThan(0);
    }
  });

  it("offers nothing for a province with no presets, without throwing", () => {
    expect(presetsFor("bac-lieu", "vn")).toEqual([]);
    expect(presetsFor("da-nang", "vn").length).toBeGreaterThan(0);
    // Country is part of the key: Đà Nẵng presets must not surface on the Korean atlas.
    expect(presetsFor("da-nang", "kr")).toEqual([]);
  });
});

describe("presets survive the engine", () => {
  for (const preset of tripPresets) {
    const plan = generateTrip(
      {
        originProvince: preset.provinceSlug,
        days: preset.days,
        style: preset.style,
        pace: preset.pace,
        interests: [],
        country: preset.country,
        pinned: preset.pinned,
      },
      data,
    );

    it(`${preset.id}: fills the days it advertises`, () => {
      expect(plan.totalDays).toBe(preset.days);
    });

    it(`${preset.id}: actually delivers the places it pins`, () => {
      // The ladder must widen far enough to reach a pin in a neighbouring province — Hội An is in
      // quang-nam, and Đà Nẵng alone has enough content to satisfy the day budget without it, so
      // without the explicit pin-coverage check this silently returned a Hội An-less trip.
      const scheduled = new Set(plan.days.flatMap((d) => d.stops.map((s) => s.destinationId)));
      const dropped = preset.pinned.filter((id) => !scheduled.has(id));
      expect(dropped).toEqual([]);
    });

    it(`${preset.id}: is still a well-formed trip`, () => {
      const ids = plan.days.flatMap((d) => d.stops.map((s) => s.destinationId));
      expect(ids.length).toBe(new Set(ids).size);
      expect(plan.days.every((d) => d.stops.length > 0)).toBe(true);
    });
  }
});
