import { describe, it, expect, beforeEach } from "vitest";
import { usePassportStore } from "./usePassportStore";

const checkin = (destinationId: string, provinceSlug: string) => ({
  destinationId,
  destinationName: destinationId,
  provinceSlug,
  caption: "hi",
  photoSeed: "s",
});

describe("usePassportStore", () => {
  beforeEach(() => usePassportStore.setState({ checkins: [] }));

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
    expect(usePassportStore.getState().visitedProvinceSlugs().sort()).toEqual(["ha-noi", "quang-nam"]);
  });

  it("tracks hasVisited", () => {
    usePassportStore.getState().addCheckin(checkin("x", "ha-noi"));
    expect(usePassportStore.getState().hasVisited("x")).toBe(true);
    expect(usePassportStore.getState().hasVisited("y")).toBe(false);
  });

  it("awards the first-step badge after one check-in and more with progress", () => {
    const s = usePassportStore.getState();
    s.addCheckin(checkin("a", "p1"));
    expect(usePassportStore.getState().badges().some((b) => b.id === "first-step")).toBe(true);
    for (const p of ["p2", "p3", "p4", "p5"]) s.addCheckin(checkin(`d-${p}`, p));
    const ids = usePassportStore.getState().badges().map((b) => b.id);
    expect(ids).toContain("explorer"); // ≥5 check-ins
    expect(ids).toContain("wanderer"); // ≥3 provinces
  });
});
