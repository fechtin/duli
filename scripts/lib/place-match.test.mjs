import { describe, it, expect } from "vitest";
import { norm, relates, pickPlace, bareName } from "./place-match.mjs";

/** Same rendering, different code points: ours is precomposed, Google answers decomposed. */
const NFC = "Động Ngườm Ngao";
const NFD = NFC.normalize("NFD");

const at = (title, dist) => ({ title, dist, ctg: "" });

describe("place matching", () => {
  it("treats decomposed and precomposed Vietnamese as the same name", () => {
    expect(NFD).not.toBe(NFC); // guard: the fixture must actually differ
    expect(norm(NFD)).toBe(norm(NFC));
    expect(relates(NFC, NFD)).toBe(true);
    expect(pickPlace(NFC, [at(NFD, 0.45)], { maxKm: 3, nearKm: 1.5 }).how).toBe("exact");
  });

  it("accepts the bare landmark when we lead with the province", () => {
    expect(bareName("담양 죽녹원")).toBe("죽녹원");
    expect(pickPlace("담양 죽녹원", [at("죽녹원", 2.1)], { maxKm: 3, nearKm: 1.5 }).how).toBe("exact");
  });

  it("reports a same-named place beyond maxKm instead of accepting or dropping it", () => {
    const { hit, far } = pickPlace("Chùa Phổ Minh", [at("Chùa Phổ Minh", 71)], { maxKm: 3, nearKm: 1.5 });
    expect(hit).toBe(null);
    expect(far).toBe(true);
  });

  it("takes a partial name only when it is close, and lets the caller veto", () => {
    const opts = { maxKm: 3, nearKm: 1.5 };
    expect(pickPlace("인사동", [at("인사동문화의거리", 0.05)], opts).how).toBe("near");
    expect(pickPlace("인사동", [at("인사동문화의거리", 2.9)], opts).hit).toBe(null);
    const vetoed = pickPlace("통영 중앙시장", [at("블루샥 통영중앙시장점", 0.08)], {
      ...opts,
      reject: (p) => /점$/.test(p.title),
    });
    expect(vetoed.hit).toBe(null);
  });

  it("refuses a name that merely shares a word", () => {
    expect(relates("춘천과 소양호", "춘천시청")).toBe(false);
    expect(relates("서산 마애여래삼존상", "서산 용현리 마애여래삼존상")).toBe(true);
  });
});
