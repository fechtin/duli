import { describe, expect, it } from "vitest";
import { alternatesOf, DEFAULT_LOCALE, SEO_LOCALES, splitLocale, withLocale } from "./urls";

// This module is the contract three independent renderers agree on: the Worker's canonical +
// hreflang, the client router's history writes, and the sitemap. If they disagree by one
// character, Google sees duplicates — so the round-trip is what's pinned here.

describe("splitLocale", () => {
  it("reads a prefixed locale and hands back the locale-free path", () => {
    expect(splitLocale("/en/vn/quang-nam/hoi-an-ancient-town")).toEqual({
      locale: "en",
      path: "/vn/quang-nam/hoi-an-ancient-town",
      prefixed: true,
      redundant: false,
    });
  });

  it("treats a bare path as the default locale", () => {
    expect(splitLocale("/vn/quang-nam")).toEqual({
      locale: DEFAULT_LOCALE,
      path: "/vn/quang-nam",
      prefixed: false,
      redundant: false,
    });
  });

  it("flags an explicit /vi prefix as redundant so the Worker can 301 it away", () => {
    const split = splitLocale("/vi/vn/quang-nam");
    expect(split.redundant).toBe(true);
    expect(split.path).toBe("/vn/quang-nam");
  });

  it("handles a locale with nothing after it", () => {
    expect(splitLocale("/ko")).toMatchObject({ locale: "ko", path: "/" });
  });

  it("does not mistake a country code for a locale", () => {
    // "vn"/"kr" and "en"/"ko"/"ja"/"zh" are disjoint, which is what makes the prefix unambiguous.
    expect(splitLocale("/vn").locale).toBe(DEFAULT_LOCALE);
    expect(splitLocale("/kr").locale).toBe(DEFAULT_LOCALE);
    expect(splitLocale("/kr").path).toBe("/kr");
  });
});

describe("withLocale", () => {
  it("leaves the default locale on the bare path", () => {
    expect(withLocale("vi", "/vn/quang-nam")).toBe("/vn/quang-nam");
    expect(withLocale("vi", "/")).toBe("/");
  });

  it("prefixes every other locale", () => {
    expect(withLocale("ja", "/vn/quang-nam")).toBe("/ja/vn/quang-nam");
    expect(withLocale("ja", "/")).toBe("/ja");
  });
});

describe("round trip", () => {
  it("splitLocale undoes withLocale for every locale and path", () => {
    for (const locale of SEO_LOCALES) {
      for (const path of ["/", "/vn", "/vn/quang-nam", "/vn/quang-nam/hoi-an-ancient-town"]) {
        expect(splitLocale(withLocale(locale, path))).toMatchObject({ locale, path });
      }
    }
  });
});

describe("alternatesOf", () => {
  it("produces one entry per locale, self-reference included", () => {
    const alts = alternatesOf("/vn/quang-nam");
    expect(alts).toHaveLength(SEO_LOCALES.length);
    expect(alts.map((a) => a.path)).toEqual([
      "/vn/quang-nam",
      "/en/vn/quang-nam",
      "/ko/vn/quang-nam",
      "/ja/vn/quang-nam",
      "/zh/vn/quang-nam",
    ]);
  });

  it("is reciprocal — every alternate resolves back to the same page", () => {
    const alts = alternatesOf("/vn/quang-nam/hoi-an-ancient-town");
    for (const { path } of alts) {
      expect(alternatesOf(splitLocale(path).path)).toEqual(alts);
    }
  });
});
