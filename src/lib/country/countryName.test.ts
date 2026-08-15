import { describe, it, expect } from "vitest";
import { countryLabel, COUNTRIES } from "./index";
import { vi as viDict } from "@/lib/i18n/locales/vi";
import { en as enDict } from "@/lib/i18n/locales/en";
import { ko as koDict } from "@/lib/i18n/locales/ko";
import { ja as jaDict } from "@/lib/i18n/locales/ja";
import { zh as zhDict } from "@/lib/i18n/locales/zh";
import type { Locale } from "@/lib/i18n/dictionaries";

const DICTS: Record<Locale, Record<string, string>> = {
  vi: viDict, en: enDict, ko: koDict, ja: jaDict, zh: zhDict,
};

// Keys whose copy names the atlas being browsed. Hardcoding a country into any of these is
// how "Hộ chiếu Việt Nam" ended up over a map of Korea.
const COUNTRY_KEYS = [
  "app.tagline", "nav.home", "map.loading",
  "ai.placeholderGeneric", "passport.title", "share.tagline",
];

describe("country-aware copy", () => {
  it("keeps a {country} placeholder in every key that names the atlas", () => {
    for (const [locale, dict] of Object.entries(DICTS)) {
      for (const key of COUNTRY_KEYS) {
        expect(dict[key], `${locale}/${key}`).toContain("{country}");
      }
    }
  });

  it("names no country literally in those keys", () => {
    const LITERAL = /Vietnam|Việt Nam|베트남|ベトナム|越南|Korea|Hàn Quốc|한국|韓国|韩国/;
    for (const [locale, dict] of Object.entries(DICTS)) {
      for (const key of COUNTRY_KEYS) {
        expect(dict[key], `${locale}/${key}`).not.toMatch(LITERAL);
      }
    }
  });

  it("resolves a localised country name for every country and locale", () => {
    for (const code of Object.keys(COUNTRIES) as (keyof typeof COUNTRIES)[]) {
      for (const locale of Object.keys(DICTS) as Locale[]) {
        expect(countryLabel(code, locale)).toBeTruthy();
      }
    }
    expect(countryLabel("kr", "ko")).toBe("대한민국");
    expect(countryLabel("vn", "ko")).toBe("베트남");
  });
});
