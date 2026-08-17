import { describe, expect, it } from "vitest";
import { chipsBeforeJoin, coveredByDish, specialtyHasDish } from "./specialtyJoin";
import { provinceContent } from "@/data/provinceContent";
import { dishes } from "@/data/food";
import { provinceI18n } from "@/data/i18n";
import { provinceContentKr, dishesKr } from "@/data/kr";
import { provinceI18nKr } from "@/data/kr/i18n";
import type { ContentLocale } from "@/lib/types";

const LOCALES: ContentLocale[] = ["en", "ja", "ko", "zh"];

describe("specialtyHasDish", () => {
  it("hides a chip the province already shows as a card, in either direction", () => {
    // The bug as reported: Quảng Nam's card said "Cơm gà Hội An", the chip under it said "Cơm gà".
    expect(specialtyHasDish("Cơm gà", ["Cơm gà Hội An"])).toBe(true);
    expect(specialtyHasDish("Bánh mì Hội An", ["Bánh mì"])).toBe(true);
    expect(specialtyHasDish("Bún đỏ", ["Bún đỏ Buôn Ma Thuột"])).toBe(true);
    expect(specialtyHasDish("Cá nướng sông Đà", ["Cá nướng sông Đà (pa pỉnh tộp)"])).toBe(true);
  });

  it("keeps a chip that only shares an ingredient with a dish", () => {
    // The pomelo and the salad made from it; the abalone and the porridge made from it.
    expect(specialtyHasDish("Bưởi Tân Triều", ["Gỏi bưởi Tân Triều"])).toBe(false);
    expect(specialtyHasDish("Bào ngư", ["Cháo bào ngư Jeju (jeonbok-juk)"])).toBe(false);
    expect(specialtyHasDish("Hàu Seosan", ["Cơm hàu Seosan (gulbap)"])).toBe(false);
  });

  it("matches on a bracketed romanisation, which is all the Korea atlas shares", () => {
    expect(specialtyHasDish("Lòng nướng makchang", ["Lòng nướng Daegu (makchang)"])).toBe(true);
    expect(specialtyHasDish("Gà xào cay dakgalbi", ["Gà xào cay Chuncheon (dakgalbi)"])).toBe(true);
    expect(specialtyHasDish("Jjajangmyeon", ["Mì tương đen (jjajangmyeon)"])).toBe(true);
    expect(
      specialtyHasDish("Canh giá đỗ kongnamul-gukbap", ["Canh giá đỗ Jeonju (kongnamul-gukbap)"]),
    ).toBe(true);
  });

  it("does not treat a bracketed place name as a second name for the dish", () => {
    expect(specialtyHasDish("Canh xương Daejeon", ["Bánh mì Sungsimdang (Daejeon)"])).toBe(false);
    expect(specialtyHasDish("Canh cá nóng Ulsan", ["Bulgogi Eonyang (Ulsan)"])).toBe(false);
  });

  it("answers index-aligned with the list it was given", () => {
    const covered = coveredByDish(
      ["Cao lầu", "Mì Quảng", "Bánh mì Hội An", "Cơm gà"],
      ["Bánh mì", "Cao lầu", "Cơm gà Hội An", "Mì Quảng"],
    );
    expect(covered).toEqual([true, true, true, true]);
  });
});

// A bundle cached before the join existed answers nothing, and the panel has to draw something.
// Showing the raw list would be a regression — Quảng Nam would go from one stray chip to four.
describe("chipsBeforeJoin", () => {
  const specialties = ["Cao lầu", "Mì Quảng", "Bánh mì Hội An", "Cơm gà"];
  const dishNames = ["Bánh mì", "Cao lầu", "Cơm gà Hội An", "Mì Quảng"];

  it("still removes what the old same-locale guess could see", () => {
    expect(chipsBeforeJoin(specialties, dishNames)).toEqual(["Cơm gà"]);
  });

  it("holds the whole list when the dishes have not loaded yet", () => {
    expect(chipsBeforeJoin(specialties, [])).toEqual(specialties);
  });
});

// The Worker computes the join on the Vietnamese base names and drops the same slots from the
// translation it is about to render. That only holds while every locale's list is authored
// against the base one for one — a locale that grows or loses an entry would take the wrong chip
// off the screen, silently and only in that language.
describe("translated specialty lists stay slot-for-slot with the base", () => {
  for (const [label, base, i18n] of [
    ["vn", provinceContent, provinceI18n],
    ["kr", provinceContentKr, provinceI18nKr],
  ] as const) {
    it(`${label}: every locale array matches the Vietnamese length`, () => {
      const drift: string[] = [];
      for (const [slug, content] of Object.entries(base)) {
        for (const locale of LOCALES) {
          const translated = i18n[slug]?.[locale]?.specialties;
          if (translated && translated.length !== content.specialties.length) {
            drift.push(`${slug}.${locale}: ${translated.length} vs ${content.specialties.length}`);
          }
        }
      }
      expect(drift).toEqual([]);
    });
  }
});

describe("the atlas as authored", () => {
  const chipsFor = (
    slug: string,
    base: typeof provinceContent,
    all: typeof dishes,
  ): string[] => {
    const names = all.filter((d) => d.provinceSlugs.includes(slug)).map((d) => d.name);
    const covered = coveredByDish(base[slug].specialties, names);
    return base[slug].specialties.filter((_, i) => !covered[i]);
  };

  it("leaves Quảng Nam with cards only — all four specialties are dishes", () => {
    expect(chipsFor("quang-nam", provinceContent, dishes)).toEqual([]);
  });

  it("keeps what no dish covers", () => {
    // Hà Giang has cards for three of its four; only the corn wine has none.
    expect(chipsFor("ha-giang", provinceContent, dishes)).toEqual(["Rượu ngô"]);
    expect(chipsFor("jeju", provinceContentKr, dishesKr)).toContain("Quýt Jeju");
  });
});
