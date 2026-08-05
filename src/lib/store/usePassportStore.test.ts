import { describe, it, expect, beforeEach } from "vitest";
import { usePassportStore } from "./usePassportStore";
import type { CountryCode } from "@/lib/types";

const checkin = (destinationId: string, provinceSlug: string, country: CountryCode = "vn") => ({
  country,
  destinationId,
  destinationName: destinationId,
  provinceSlug,
  caption: "hi",
  photoSeed: "s",
});

describe("usePassportStore", () => {
  beforeEach(() => usePassportStore.setState({ checkins: [], tasted: [] }));

  it("adds a check-in with an id + timestamp", () => {
    usePassportStore.getState().addCheckin(checkin("hoi-an-ancient-town", "quang-nam"));
    const { checkins } = usePassportStore.getState();
    expect(checkins).toHaveLength(1);
    expect(checkins[0].id).toBeTruthy();
    expect(checkins[0].createdAt).toBeGreaterThan(0);
  });

  it("deduplicates visited provinces", () => {
    const s = usePassportStore.getState();
    s.addCheckin(checkin("a", "quang-nam"));
    s.addCheckin(checkin("b", "quang-nam"));
    s.addCheckin(checkin("c", "ha-noi"));
    expect(usePassportStore.getState().visitedProvinceSlugs("vn").sort()).toEqual(["ha-noi", "quang-nam"]);
  });

  it("keeps each country's passport separate", () => {
    const s = usePassportStore.getState();
    s.addCheckin(checkin("a", "quang-nam", "vn"));
    s.addCheckin(checkin("b", "seoul", "kr"));
    s.addCheckin(checkin("c", "busan", "kr"));
    expect(usePassportStore.getState().visitedProvinceSlugs("vn")).toEqual(["quang-nam"]);
    expect(usePassportStore.getState().visitedProvinceSlugs("kr").sort()).toEqual(["busan", "seoul"]);
    // A Korean trip must not push the Vietnamese passport forward.
    expect(usePassportStore.getState().badges("vn").some((b) => b.id === "wanderer")).toBe(false);
  });

  it("tracks hasVisited", () => {
    usePassportStore.getState().addCheckin(checkin("x", "ha-noi"));
    expect(usePassportStore.getState().hasVisited("x")).toBe(true);
    expect(usePassportStore.getState().hasVisited("y")).toBe(false);
  });

  it("awards the first-step badge after one check-in and more with progress", () => {
    const s = usePassportStore.getState();
    s.addCheckin(checkin("a", "p1"));
    expect(usePassportStore.getState().badges("vn").some((b) => b.id === "first-step")).toBe(true);
    for (const p of ["p2", "p3", "p4", "p5"]) s.addCheckin(checkin(`d-${p}`, p));
    const ids = usePassportStore.getState().badges("vn").map((b) => b.id);
    expect(ids).toContain("explorer"); // ≥5 check-ins
    expect(ids).toContain("wanderer"); // ≥3 provinces
  });

  it("scales the country milestones to the atlas size", () => {
    const s = usePassportStore.getState();
    for (const p of ["seoul", "busan", "daegu", "incheon", "jeju"]) s.addCheckin(checkin(`d-${p}`, p, "kr"));
    // 5 of Korea's 17 units clears `spanAt`, while 5 of Vietnam's 63 would not.
    expect(usePassportStore.getState().badges("kr").some((b) => b.id === "north-south")).toBe(true);
  });
});
