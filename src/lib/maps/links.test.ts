import { describe, it, expect } from "vitest";
import { googleMapsUrl, naverMapUrl, mapLinks } from "./links";

const haeundae = { name: "Haeundae Beach", lng: 129.16, lat: 35.1587 };

const GOOGLE_ID = "ChIJxTV0Jz2ZaDURf3Ny4Bpqy2s";

describe("map deep links", () => {
  it("opens Google's place card when the id is resolved", () => {
    expect(googleMapsUrl(haeundae, GOOGLE_ID)).toBe(
      `https://www.google.com/maps/search/?api=1&query=Haeundae%20Beach&query_place_id=${GOOGLE_ID}`,
    );
  });

  it("falls back to the exact coordinates in Google, lat first — never a bare name", () => {
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

  it("offers Naver only in Korea, and routes each id to its own provider", () => {
    expect(mapLinks(haeundae, "kr", { google: GOOGLE_ID, naver: "13139146" }).map((l) => l.url)).toEqual([
      `https://www.google.com/maps/search/?api=1&query=Haeundae%20Beach&query_place_id=${GOOGLE_ID}`,
      "https://map.naver.com/p/entry/place/13139146",
    ]);
    expect(mapLinks(haeundae, "vn").map((l) => l.provider)).toEqual(["google"]);
  });

  it("keeps a missing id from becoming a name search", () => {
    const [google] = mapLinks(haeundae, "vn", { naver: "13139146" });
    expect(google.url).toContain("query=35.1587,129.16");
  });
});
