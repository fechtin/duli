import { describe, it, expect } from "vitest";
import { tagLabel } from "./index";
import { tagsVi } from "./vi";
import { destinationsKr } from "@/data/kr";
import { destinations } from "@/data/destinations";
import type { Locale } from "../dictionaries";

const LOCALES: Locale[] = ["vi", "en", "ko", "ja", "zh"];

describe("destination tag labels", () => {
  it("covers every tag used by either atlas", () => {
    const used = new Set<string>();
    for (const d of [...destinationsKr, ...destinations]) for (const t of d.tags) used.add(t);
    expect([...used].filter((t) => !(t in tagsVi))).toEqual([]);
  });

  it("returns a non-Vietnamese label for Korean UI on the tags that reported the bug", () => {
    // The panel footer showed "bảo tàng · quốc bảo · lịch sử" while the UI was Korean.
    expect(["bảo tàng", "quốc bảo", "lịch sử"].map((t) => tagLabel(t, "ko"))).toEqual([
      "박물관",
      "국보",
      "역사",
    ]);
  });

  it("localises the Vietnam atlas's English vocabulary too", () => {
    expect(tagLabel("mountain", "vi")).toBe("núi");
    expect(tagLabel("temple", "ko")).toBe("사찰");
  });

  it("falls back to the raw tag rather than rendering blank", () => {
    expect(tagLabel("a-tag-nobody-defined", "ko")).toBe("a-tag-nobody-defined");
  });

  it("never leaves Vietnamese diacritics in a non-Vietnamese label", () => {
    const VN = /[àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/i;
    for (const locale of LOCALES.filter((l) => l !== "vi")) {
      const leaked = Object.keys(tagsVi).filter((t) => VN.test(tagLabel(t, locale)));
      expect(leaked, `${locale} leaks Vietnamese`).toEqual([]);
    }
  });
});
