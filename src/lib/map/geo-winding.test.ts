import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { geoArea } from "d3-geo";
import type { Feature } from "geojson";

// Regression guard for the ring-winding bug: d3-geo (spherical) needs clockwise exterior
// rings. With the wrong winding, geoArea(feature) ≈ 4π (the whole globe) instead of a tiny
// fraction. This catches a recurrence of "every province fills the map".
describe("vn-provinces winding", () => {
  const geo = JSON.parse(readFileSync(resolve("public/geo/vn-provinces.json"), "utf8")) as {
    features: Feature[];
  };

  it("has 63 provinces", () => {
    expect(geo.features.length).toBe(63);
  });

  it("every province covers a tiny fraction of the sphere (not the whole globe)", () => {
    for (const f of geo.features) {
      const area = geoArea(f); // steradians; full sphere = 4π ≈ 12.566
      expect(area).toBeGreaterThan(0);
      expect(area).toBeLessThan(0.5);
    }
  });
});
