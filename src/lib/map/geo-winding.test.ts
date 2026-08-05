import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { geoArea } from "d3-geo";
import type { Feature } from "geojson";

// Regression guard for the ring-winding bug: d3-geo (spherical) needs clockwise exterior
// rings. With the wrong winding, geoArea(feature) ≈ 4π (the whole globe) instead of a tiny
// fraction. This catches a recurrence of "every province fills the map" — for every atlas.
const ATLASES = [
  { cc: "vn", provinces: 63 },
  { cc: "kr", provinces: 17 },
];

describe.each(ATLASES)("$cc-provinces winding", ({ cc, provinces }) => {
  const geo = JSON.parse(readFileSync(resolve(`public/geo/${cc}-provinces.json`), "utf8")) as {
    features: Feature[];
  };

  it(`has ${provinces} provinces`, () => {
    expect(geo.features.length).toBe(provinces);
  });

  it("every province covers a tiny fraction of the sphere (not the whole globe)", () => {
    for (const f of geo.features) {
      const area = geoArea(f); // steradians; full sphere = 4π ≈ 12.566
      expect(area).toBeGreaterThan(0);
      expect(area).toBeLessThan(0.5);
    }
  });

  it("every province has a unique slug", () => {
    const slugs = geo.features.map((f) => (f.properties as { slug: string }).slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
