import { describe, expect, it } from "vitest";
import { destinations } from "@/data/destinations";
import { destinationsKr } from "@/data/kr/index";
import { tryParseVisitDuration } from "./duration.ts";
import { parseOpeningHours } from "./hours.ts";

// The engine reads two free-text Vietnamese columns and turns them into a clock. Those columns are
// hand-authored, so the risk is not that today's parser is wrong — it is that tomorrow's *data*
// quietly outgrows it and the planner starts silently defaulting places to two hours.
//
// So this file asserts against the shipped seeds rather than fixtures: it fails when someone
// authors a duration nobody taught the parser to read, on the commit that authors it.

const ALL = [...destinations, ...destinationsKr];

describe("visitDuration coverage", () => {
  it("reads every duration in both atlases", () => {
    const unreadable = ALL.filter((d) => !tryParseVisitDuration(d.visitDuration)).map(
      (d) => `${d.id}: ${d.visitDuration}`,
    );
    expect(unreadable).toEqual([]);
  });

  it("never budgets a nonsensical amount of time", () => {
    for (const d of ALL) {
      const spec = tryParseVisitDuration(d.visitDuration)!;
      expect(spec.minutes).toBeGreaterThanOrEqual(15);
      // 4 days is the longest thing the atlas describes ("Tour 4 ngày 3 đêm").
      expect(spec.minutes).toBeLessThanOrEqual(4 * 480);
      expect(spec.fullDay && spec.multiDay).toBe(false);
    }
  });
});

describe("openingHours classification", () => {
  // Deliberately NOT "100% of rows yield an interval" — 29% of them contain no digit at all, and
  // chasing coverage is what drives an implementer to first-match extraction, which closes
  // 24-hour sites in the evening. What is guaranteed is that classification is total and that
  // anything it does claim, it can defend.
  it("classifies every row into a known bucket", () => {
    const kinds = new Set(ALL.map((d) => parseOpeningHours(d.openingHours).kind));
    for (const kind of kinds) expect(["interval", "always", "unknown"]).toContain(kind);
    expect(ALL.every((d) => parseOpeningHours(d.openingHours).raw === d.openingHours)).toBe(true);
  });

  it("produces only sane windows when it does commit to one", () => {
    for (const d of ALL) {
      const spec = parseOpeningHours(d.openingHours);
      if (spec.kind !== "interval") continue;
      expect(spec.closeMin).toBeGreaterThan(spec.openMin);
      // Nothing in the atlas is open for 20 hours or shut after 45 minutes; either would mean the
      // parser latched onto something that was not the site's own window.
      expect(spec.closeMin - spec.openMin).toBeGreaterThanOrEqual(60);
      expect(spec.closeMin - spec.openMin).toBeLessThanOrEqual(20 * 60);
    }
  });

  it("keeps the share it can schedule high enough to be useful", () => {
    // A regression fence, not a target: if a data change pushes usable hours below half the atlas
    // the planner has quietly become a guesser and someone should look.
    const usable = ALL.filter((d) => parseOpeningHours(d.openingHours).kind !== "unknown").length;
    expect(usable / ALL.length).toBeGreaterThan(0.7);
  });

  it("does not mistake another venue's hours for the site's own", () => {
    // Real rows, each of which a first-match regex gets wrong.
    expect(
      parseOpeningHours("Ngõ mở cả ngày, không có giờ quy định; quán cà phê và nhà hàng thường 11:00–23:00").kind,
    ).toBe("unknown");
    expect(parseOpeningHours("Đường tham quan mở 24 giờ; có 5 tuyến từ 1 km (30 phút)").kind).toBe("always");
    // "quanh năm" means all *year*; the window is still the window.
    expect(parseOpeningHours("03:00–22:00, mở cửa quanh năm")).toMatchObject({
      kind: "interval",
      openMin: 180,
      closeMin: 1320,
    });
    // A whole-site window that simply does not start the sentence.
    expect(parseOpeningHours("Họp chợ từ 04:00 - 08:00 hằng ngày")).toMatchObject({
      kind: "interval",
      openMin: 240,
      closeMin: 480,
    });
  });
});
