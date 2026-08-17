// A province's editorial `specialties` list and the Food Explorer's dishes name the same food
// from two sides. The list came first — four or five strings per province; the dish entries grew
// over it later (Bible 026), each with a card, a photo and a page of its own. Where both name the
// same thing the chip is just the card again in smaller type: Quảng Nam showed cards for Bánh mì,
// Cao lầu, Cơm gà Hội An and Mì Quảng, then a chip reading "Cơm gà" underneath them.
//
// The panel used to settle this itself — hide the chip when its text contains the dish's name.
// That is a Vietnamese-only heuristic wearing a dedup's clothes. It fires only when the chip is
// the longer of the two ("Bánh mì Hội An" ⊃ "Bánh mì"), so "Cơm gà" sailed past "Cơm gà Hội An";
// and in every other language the pair is written differently again ("Chicken rice" against
// "Hoi An Chicken Rice", 「鶏飯」 against 「コムガー・ホイアン」), where it matched almost nothing.
// Of Vietnam's 155 duplicate chips, 145 reached the screen in English — against 34 in Vietnamese.
//
// So the join runs once, on the Vietnamese base names, in the Worker (worker/db.ts), and the
// panel is handed the answer. Nothing is deleted from the data: the whole list still grounds the
// AI (src/lib/ai/prompt.ts) and fills the crawler body (worker/seo-body.ts), neither of which
// mentions a dish at all.

const PARENTHETICAL = /[（(]([^）)]*)[）)]/g;

const tokenise = (s: string): string[] =>
  s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim().split(" ").filter(Boolean);

/** Tokens of the name proper, with any parenthesised aside removed. */
const bareWords = (name: string): string[] => tokenise(name.replace(PARENTHETICAL, " "));

/**
 * The romanised aliases a dish carries in brackets — "Lòng nướng Daegu (makchang)". They are how
 * the Korea atlas names a dish twice, and the specialty lists reach for the romanisation inline
 * ("Lòng nướng makchang"), so nothing but the alias joins those two.
 *
 * Only a lowercase aside counts. A capitalised one is a place — "Bulgogi Eonyang (Ulsan)",
 * "Bánh mì Sungsimdang (Daejeon)" — and matching on that would swallow "Canh cá nóng Ulsan" and
 * "Canh xương Daejeon", which are different dishes that merely share a city.
 */
function aliases(name: string): string[][] {
  const out: string[][] = [];
  for (const [, inner] of name.matchAll(PARENTHETICAL)) {
    const aside = inner.trim();
    if (!aside || aside[0] !== aside[0].toLowerCase()) continue;
    const words = tokenise(aside);
    if (words.length) out.push(words);
  }
  return out;
}

/**
 * One name is the other plus a trailing qualifier — "Cơm gà" / "Cơm gà Hội An", "Bún đỏ" /
 * "Bún đỏ Buôn Ma Thuột". Vietnamese puts the head noun first, so only a shared *prefix* means
 * the same dish: drop a leading word instead and the dish changes under you. "Bưởi Tân Triều" is
 * the pomelo and "Gỏi bưởi Tân Triều" is the salad made from it; "Bào ngư" is the abalone and
 * "Cháo bào ngư Jeju" is the porridge. Those keep their chips.
 */
function sharePrefix(a: string[], b: string[]): boolean {
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return short.length > 0 && short.every((w, i) => w === long[i]);
}

/** Does `needle` appear in `haystack` as a run of whole words? */
function containsRun(haystack: string[], needle: string[]): boolean {
  if (!needle.length || needle.length > haystack.length) return false;
  for (let i = 0; i + needle.length <= haystack.length; i++) {
    if (needle.every((w, j) => haystack[i + j] === w)) return true;
  }
  return false;
}

/** Is this specialty already on screen as one of the province's dish cards? */
export function specialtyHasDish(specialty: string, dishNames: string[]): boolean {
  const bare = bareWords(specialty);
  if (!bare.length) return false;
  const full = tokenise(specialty);
  return dishNames.some(
    (name) => sharePrefix(bare, bareWords(name)) || aliases(name).some((a) => containsRun(full, a)),
  );
}

/**
 * Which of `specialties` already have a dish card, index-aligned with the input.
 *
 * Feed it the Vietnamese base names — they are the only pair of lists written in one language.
 * The caller drops the same slots from whichever translation it is about to render, which holds
 * because every locale's array is authored slot-for-slot against the base (asserted in
 * specialtyJoin.test.ts).
 */
export function coveredByDish(specialties: string[], dishNames: string[]): boolean[] {
  return specialties.map((s) => specialtyHasDish(s, dishNames));
}

/**
 * What to show when the answer above never arrived — a bundle answered before this join existed.
 * `/province/:slug` carries `stale-while-revalidate=86400`, so a browser may run today's code
 * against yesterday's JSON for a day after any deploy.
 *
 * This is the guess this file replaced: same locale, and only when the chip is the longer of the
 * two strings. It stays for that window and no other reason — handing back the raw list instead
 * would put every duplicate on screen, which is worse than what shipped before the fix.
 */
export function chipsBeforeJoin(specialties: string[], dishNames: string[]): string[] {
  return specialties.filter(
    (s) => !dishNames.some((name) => s.toLowerCase().includes(name.toLowerCase())),
  );
}
