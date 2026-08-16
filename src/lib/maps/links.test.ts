import { describe, it, expect } from "vitest";
import { googleMapsUrl, naverMapUrl, mapLinks } from "./links";

const haeundae = { name: "Haeundae Beach", lng: 129.16, lat: 35.1587 };

describe("map deep links", () => {
  it("opens the place at the exact coordinates in Google, lat first", () => {
    expect(googleMapsUrl(haeundae)).toBe(
      "https://www.google.com/maps/search/?api=1&query=35.1587,129.16",
    );
  });

  it("opens Naver's place entry when the id is resolved", () => {
    expect(naverMapUrl(haeundae, "13139146")).toBe("https://map.naver.com/p/entry/place/13139146");
  });

  it("falls back to a Naver name search when no id was resolved", () => {
    expect(naverMapUrl(haeundae)).toBe("https://map.naver.com/p/search/Haeundae%20Beach");
  });

  it("lands on the place itself, not on a route", () => {
    for (const url of [googleMapsUrl(haeundae), naverMapUrl(haeundae, "13139146")]) {
      expect(url).not.toMatch(/dir|direction|route/);
    }
  });

  it("offers Naver only in Korea, and carries the place id into its link", () => {
    expect(mapLinks(haeundae, "kr", "13139146").map((l) => l.url)).toEqual([
      "https://www.google.com/maps/search/?api=1&query=35.1587,129.16",
      "https://map.naver.com/p/entry/place/13139146",
    ]);
    expect(mapLinks(haeundae, "vn").map((l) => l.provider)).toEqual(["google"]);
  });
});
