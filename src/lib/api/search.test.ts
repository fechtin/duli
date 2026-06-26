import { describe, it, expect } from "vitest";
import { searchContent, normalize } from "./search";
import type { DestinationLight, ProvinceMeta } from "@/lib/types";

const provinces: ProvinceMeta[] = [
  { slug: "ho-chi-minh", name: "TP. Hồ Chí Minh", nameEn: "Ho Chi Minh City", regionId: "southeast", regionName: "Đông Nam Bộ", color: "#000", centroid: [106.7, 10.8] },
  { slug: "ha-noi", name: "Hà Nội", nameEn: "Hanoi", regionId: "red-river-delta", regionName: "Đồng bằng sông Hồng", color: "#000", centroid: [105.8, 21] },
  { slug: "quang-ninh", name: "Quảng Ninh", nameEn: "Quang Ninh", regionId: "northeast", regionName: "Đông Bắc", color: "#000", centroid: [107, 21] },
  { slug: "quang-nam", name: "Quảng Nam", nameEn: "Quang Nam", regionId: "south-central-coast", regionName: "Duyên hải Nam Trung Bộ", color: "#000", centroid: [108, 15.8] },
];

const destinations: DestinationLight[] = [
  { id: "hoi-an-ancient-town", slug: "hoi-an-ancient-town", provinceSlug: "quang-nam", name: "Phố cổ Hội An", nameEn: "Hoi An Ancient Town", type: "unesco", lng: 108.3, lat: 15.9, summary: "", tags: ["culture"], badges: [], gallery: [], featured: true },
];

describe("normalize", () => {
  it("strips Vietnamese diacritics and lowercases", () => {
    expect(normalize("Sài Gòn")).toBe("sai gon");
    expect(normalize("Đà Nẵng")).toBe("da nang");
  });
});

describe("searchContent", () => {
  it("returns nothing for an empty query", () => {
    expect(searchContent("", provinces, destinations)).toEqual([]);
  });

  it("resolves the 'saigon' alias to Hồ Chí Minh", () => {
    const top = searchContent("saigon", provinces, destinations)[0];
    expect(top.kind).toBe("province");
    expect(top.id).toBe("ho-chi-minh");
  });

  it("resolves the 'halong' alias to Quảng Ninh", () => {
    expect(searchContent("halong", provinces, destinations)[0].id).toBe("quang-ninh");
  });

  it("is diacritic-tolerant for destinations", () => {
    const results = searchContent("hoi an", provinces, destinations);
    expect(results.some((r) => r.id === "hoi-an-ancient-town")).toBe(true);
  });

  it("ranks an exact province match first", () => {
    const top = searchContent("Hà Nội", provinces, destinations)[0];
    expect(top.id).toBe("ha-noi");
  });
});
