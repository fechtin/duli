import { describe, expect, it } from "vitest";
import { decodeTripId, encodeTripId } from "./trip";

// This string is three contracts at once: the in-memory cache key, the `?trip=` URL parameter, and
// the share link. If encode and decode ever disagree by one character, a shared itinerary opens as
// a different trip — or as none at all — and nothing else in the app would notice.
//
// The hazard is province slugs: they contain hyphens, and plenty of them contain three
// (`ba-ria-vung-tau`). Splitting from the left would eat the province name.

describe("trip id round trip", () => {
  it("survives multi-hyphen province slugs", () => {
    for (const originProvince of ["da-nang", "quang-nam", "ba-ria-vung-tau", "seoul", "thua-thien-hue"]) {
      const params = { originProvince, days: 5, style: "heritage" as const, pace: "balanced" as const };
      expect(decodeTripId(encodeTripId(params))).toEqual(params);
    }
  });

  it("round trips every style and pace", () => {
    for (const style of ["nature", "heritage", "food", "beach", "mixed"] as const) {
      for (const pace of ["relaxed", "balanced", "packed"] as const) {
        const params = { originProvince: "da-nang", days: 3, style, pace };
        expect(decodeTripId(encodeTripId(params))).toEqual(params);
      }
    }
  });

  it("reads like a URL rather than a hash", () => {
    // Readability is the reason params were chosen over a server id, so it is worth asserting.
    expect(encodeTripId({ originProvince: "da-nang", days: 5, style: "mixed", pace: "balanced" })).toBe(
      "da-nang-5-mixed-balanced",
    );
  });
});

describe("a malformed id opens nothing", () => {
  // Half-opening a trip is worse than ignoring the parameter: the write-back then strips it, so a
  // bad link heals itself into a clean URL.
  it("rejects anything it cannot fully validate", () => {
    for (const bad of [
      "",
      "da-nang",
      "da-nang-5-mixed",
      "da-nang-5-bogus-balanced",
      "da-nang-5-mixed-sprinting",
      "da-nang-0-mixed-balanced",
      "da-nang-99-mixed-balanced",
      "da-nang-x-mixed-balanced",
      "-5-mixed-balanced",
    ]) {
      expect(decodeTripId(bad), bad).toBeNull();
    }
  });
});
