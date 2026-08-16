// Deciding whether a map provider's search result IS the place our entry describes.
//
// Shared by scripts/resolve-naver-places.mjs and scripts/resolve-google-places.mjs, because the
// hard part is identical whoever is answering: a name we wrote for a reader ("담양 죽녹원",
// "Chợ Bến Thành") against a name an operator registered, with only a coordinate to arbitrate.
//
// The bias throughout is to reject. An unmatched entry costs a fallback link; a wrong match sends
// the user confidently to another place, and nothing downstream would ever catch it.
export const R_KM = 6371;
const rad = (deg) => (deg * Math.PI) / 180;

export function distanceKm(a, b) {
  const [dLat, dLng] = [rad(b.lat - a.lat), rad(b.lng - a.lng)];
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R_KM * Math.asin(Math.sqrt(h));
}

/**
 * Spacing and punctuation carry no meaning in either language's place names.
 *
 * NFC first, and it is not decoration: Google answers in decomposed Vietnamese, so its
 * "Động Ngườm Ngao" is 17 code points against our 15 for a string that renders identically.
 * Without this the two never compare equal and a correct match is thrown away in silence.
 */
export const norm = (s) => s.normalize("NFC").replace(/[\s·・.,()（）'"’-]/g, "").toLowerCase();

/** Same name, or one name inside the other — the only relations that count as "this is it". */
export function relates(ours, theirs) {
  const [a, b] = [norm(ours), norm(theirs)];
  if (a === b || a.includes(b) || b.includes(a)) return true;
  // Every word we wrote appears in their name, which merely adds one of its own: our
  // "서산 마애여래삼존상" against Naver's "서산 용현리 마애여래삼존상", 10 m apart.
  return ours.split(/\s+/).every((w) => b.includes(norm(w)));
}

/**
 * Our editorial names lead with the province a reader needs ("담양 죽녹원", "Huế Đại Nội");
 * providers index the bare landmark. Null when there is only one word and nothing to drop.
 */
export function bareName(query) {
  const words = query.split(/\s+/);
  return words.length > 1 ? words.slice(1).join(" ") : null;
}

/**
 * Words we wrote, long enough to identify anything. Korean glues its "and" onto the noun, so
 * "해인사와 팔만대장경" carries the token 해인사와 — a string no register will ever hold. Both
 * forms are kept: stripping is a guess, and the raw word is the one that is certainly ours.
 */
const tokens = (s) =>
  s
    .split(/\s+/)
    .flatMap((w) => [w, w.replace(/(?:와|과)$/, "")])
    .map(norm)
    .filter((w) => w.length >= 2);

/** Do the two names share any word at all — the weakest evidence worth acting on. */
export function sharesToken(ours, theirs) {
  const t = norm(theirs);
  return tokens(ours).some((w) => t.includes(w));
}

/**
 * Choose among candidates — each `{ title, dist, ctg? }`, nearest first.
 *
 * Three tiers, each buying a looser name test with a tighter distance:
 *
 *   exact — same name, or same once the leading province is dropped, within `maxKm`. Our
 *           coordinate is an entrance where theirs is a centroid, so this one gets room.
 *   near  — one name inside the other, within `nearKm`.
 *   close — merely a shared word, within `closeKm` (opt-in). This is for the places an operator
 *           registered under a name nobody says out loud: our "경주 불국사" against Google's
 *           "대한불교조계종 제11교구 본사 불국사", 20 m away. At that range the coordinate is
 *           the evidence and the name is only a sanity check — which is exactly why `reject`
 *           matters most here. A cafe named after the landmark it sits in also shares a word.
 *
 * A same-named candidate beyond `maxKm` is returned as `far` rather than accepted or discarded:
 * the name says it is the place, the distance says one of the two coordinates is wrong, and only
 * a human can say which — ours is what the atlas actually draws on the map.
 */
export function pickPlace(query, places, { maxKm, nearKm, closeKm = 0, reject = () => false }) {
  const wanted = norm(query);
  const bare = bareName(query);
  const bareNorm = bare ? norm(bare) : null;

  const sameName = places.find(
    (p) => norm(p.title) === wanted || (bareNorm && norm(p.title) === bareNorm),
  );
  if (sameName) {
    if (sameName.dist > maxKm) return { hit: null, miss: sameName, far: true };
    return { hit: sameName, how: "exact" };
  }

  const near = places.find(
    (p) => p.dist <= nearKm && !reject(p, query) && relates(query, p.title),
  );
  if (near) return { hit: near, how: "near" };

  const close =
    closeKm > 0 &&
    places.find((p) => p.dist <= closeKm && !reject(p, query) && sharesToken(query, p.title));
  if (close) return { hit: close, how: "close" };

  return { hit: null, miss: places[0] };
}
