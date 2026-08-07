import { describe, it, expect } from "vitest";
import { googleMapsUrl, naverMapUrl, mapLinks } from "./links";

const haeundae = { name: "Haeundae Beach", lng: 129.16, lat: 35.1587 };

describe("map deep links", () => {
  it("points Google at the exact coordinates, lat first", () => {
    expect(googleMapsUrl(haeundae)).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=35.1587,129.16",
    );
  });

  it("points Naver at the exact coordinates, lng first", () => {
    expect(naverMapUrl(haeundae)).toBe(
      "https://map.naver.com/p/directions/-/129.16,35.1587,Haeundae%20Beach/-/transit",
    );
  });

  it("keeps a comma in the name out of Naver's path (it separates segments)", () => {
    const url = naverMapUrl({ ...haeundae, name: "Gwangjang, Seoul" });
    expect(url.split("/")[6].split(",")).toHaveLength(3);
  });

  it("offers Naver only in Korea", () => {
    expect(mapLinks(haeundae, "kr").map((l) => l.provider)).toEqual(["google", "naver"]);
    expect(mapLinks(haeundae, "vn").map((l) => l.provider)).toEqual(["google"]);
  });
});
