import { describe, expect, it } from "vitest";
import { resolveAppHeight, type ViewportReading } from "./viewportLock";

/** iPhone 16 Pro: 402 x 874pt, safe-area insets 59 (top) + 34 (bottom) = 93. */
const iphone = (over: Partial<ViewportReading> = {}): ViewportReading => ({
  innerHeight: 874,
  screenWidth: 402,
  screenHeight: 874,
  portrait: true,
  iosStandalone: true,
  ...over,
});

describe("resolveAppHeight", () => {
  it("lifts an inset-short standalone window to the full screen", () => {
    // The bug in the screenshot: innerHeight is the safe-area height, so the shell stopped 93pt
    // above the bottom of its own window.
    expect(resolveAppHeight(iphone({ innerHeight: 781 }))).toBe(874);
  });

  it("leaves a window that already fills the screen alone", () => {
    expect(resolveAppHeight(iphone())).toBe(874);
  });

  it("ignores the screen outside iOS standalone", () => {
    // Mobile Safari has browser chrome, so a shorter window is the truth there.
    expect(resolveAppHeight(iphone({ innerHeight: 781, iosStandalone: false }))).toBe(781);
  });

  it("keeps the keyboard from shrinking the shell", () => {
    expect(resolveAppHeight(iphone({ innerHeight: 781, visualHeight: 430 }))).toBe(874);
  });

  it("uses the larger reading when only the visual viewport is up to date", () => {
    expect(resolveAppHeight(iphone({ innerHeight: 700, visualHeight: 781 }))).toBe(874);
  });

  it("takes the short side of the screen in landscape", () => {
    // screen.width/height unswapped, window short by the landscape insets.
    expect(resolveAppHeight(iphone({ innerHeight: 360, portrait: false }))).toBe(402);
  });

  it("takes the short side even when iOS did swap the screen dimensions", () => {
    expect(
      resolveAppHeight(iphone({ innerHeight: 360, portrait: false, screenWidth: 874, screenHeight: 402 })),
    ).toBe(402);
  });

  it("does not lift a window that is genuinely smaller than its screen", () => {
    // iPad in Stage Manager: standalone, but the window is nowhere near the display.
    expect(
      resolveAppHeight({
        innerHeight: 500,
        screenWidth: 1024,
        screenHeight: 1366,
        portrait: true,
        iosStandalone: true,
      }),
    ).toBe(500);
  });

  it("falls back to the measurement when the screen is unreadable", () => {
    expect(resolveAppHeight(iphone({ innerHeight: 781, screenWidth: 0, screenHeight: 0 }))).toBe(781);
  });

  it("never returns more than the measurement when the window is taller than the screen", () => {
    expect(resolveAppHeight(iphone({ innerHeight: 900 }))).toBe(900);
  });
});
