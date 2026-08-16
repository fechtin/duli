import { describe, expect, it } from "vitest";
import { tryParseVisitDuration } from "./duration.ts";

// Two readings of a range point in opposite directions, and getting either backwards produces a
// plan that is wrong in a way nobody notices until they are standing somewhere:
//
//   - a *choice* ("cable car or two days on foot") must take the cheap branch, or the engine drops
//     a half-day site as a multi-day expedition and never schedules it;
//   - an *uncertainty* ("2–3 hours") must take the upper bound, or three sites get promised in an
//     afternoon that fits two.
//
// Every string below is real, taken from the shipped seeds.

const minutes = (raw: string) => tryParseVisitDuration(raw)!.minutes;

describe("plain quantities", () => {
  it("reads hours, half-hours and minutes", () => {
    expect(minutes("1 giờ")).toBe(60);
    expect(minutes("45 phút")).toBe(45);
    expect(minutes("1,5 giờ")).toBe(90); // comma is the decimal separator in the source
  });

  it("reads the day vocabulary", () => {
    expect(tryParseVisitDuration("Nửa ngày")).toMatchObject({ minutes: 240, fullDay: false });
    expect(tryParseVisitDuration("Cả ngày")).toMatchObject({ minutes: 480, fullDay: true });
    expect(tryParseVisitDuration("1 ngày")).toMatchObject({ minutes: 480, fullDay: true });
  });
});

describe("ranges are budgeted upward", () => {
  it("takes the top of an hour range so the day is not overpacked", () => {
    expect(minutes("2–3 giờ")).toBe(180);
    expect(minutes("1 - 2 giờ")).toBe(120);
    expect(minutes("1,5–2 giờ")).toBe(120);
    expect(minutes("4–6 giờ mỗi chặng")).toBe(360);
  });

  it("normalises every dash the data uses", () => {
    expect(minutes("2-3 giờ")).toBe(minutes("2–3 giờ"));
    expect(minutes("2 - 3 giờ")).toBe(minutes("2–3 giờ"));
  });
});

describe("day-scale ranges are budgeted downward", () => {
  // The opposite rule, and it is what keeps these places in the trip at all: taking the top of
  // "Cả ngày đến 3 ngày" would classify a perfectly schedulable site as multi-day and drop it.
  it("keeps a wide day range usable", () => {
    expect(tryParseVisitDuration("Cả ngày đến 3 ngày")).toMatchObject({ fullDay: true, multiDay: false });
    expect(tryParseVisitDuration("1 - 2 ngày")).toMatchObject({ minutes: 480, multiDay: false });
    expect(tryParseVisitDuration("Nửa ngày đến 1 ngày")).toMatchObject({ minutes: 240 });
  });

  it("still flags what genuinely needs more than a day", () => {
    expect(tryParseVisitDuration("2 ngày 1 đêm")).toMatchObject({ multiDay: true });
    expect(tryParseVisitDuration("Tour 4 ngày 3 đêm")).toMatchObject({ multiDay: true });
    expect(tryParseVisitDuration("2 - 3 ngày")).toMatchObject({ multiDay: true });
  });
});

describe("alternatives take the cheapest branch", () => {
  it("chooses the cable car over the two-day climb", () => {
    expect(tryParseVisitDuration("Nửa ngày (cáp treo) hoặc 2 ngày (leo bộ)")).toMatchObject({
      minutes: 240,
      multiDay: false,
    });
  });

  it("prefers the day trip over the overnight", () => {
    expect(minutes("Nửa ngày hoặc 1 đêm")).toBe(240);
    expect(tryParseVisitDuration("1 ngày hoặc 1 đêm")).toMatchObject({ minutes: 480, fullDay: true });
  });

  it("strips parentheticals without reading them", () => {
    // "kể cả phà" contains "cả", which would otherwise match "cả ngày" and turn a half day whole.
    expect(tryParseVisitDuration("Nửa ngày (kể cả phà)")).toMatchObject({ minutes: 240, fullDay: false });
  });
});

describe("failure is explicit", () => {
  it("returns null rather than guessing", () => {
    expect(tryParseVisitDuration("")).toBeNull();
    expect(tryParseVisitDuration("tuỳ bạn")).toBeNull();
  });
});
