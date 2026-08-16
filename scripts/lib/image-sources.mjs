// Shared photo sourcing for the atlas: candidate lookup, name validation, download.
//
// The rule this module exists to enforce: **a candidate must prove it is about the thing we
// asked for.** `scripts/fetch-images.mjs` learned that lesson for destinations (name-token
// validation on text/wiki hits); `scripts/fetch-dish-images.mjs` never did, and took
// `search[0]` blind — so "Nem lụi Huế" resolved to the *city of Huế* and "Vịt quay Lạng Sơn"
// to a mắc mật shrub. 10 of the 16 photos that run left on disk were wrong. Everything here
// runs a candidate through `titleMatches` before it can win.
//
// Sources, in the order a caller should try them:
//   wikiLead(lang)   — Wikipedia lead image. Best quality when the article exists.
//   commonsCategory  — Commons category per subject. Hits far more often than a file-title search.
//   commonsSearch    — Commons full-text, validated against the file title.
//   openverse        — Flickr/others under a commercial-use CC licence. No credential.
//   stock            — Pexels / Unsplash. Needs a key; last resort, see PEXELS_API_KEY below.

import sharp from "sharp";

export const UA = "VietnamAtlas/1.0 (tourism atlas imagery; github.com/fechtin/duli)";
export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// ── Text normalisation ────────────────────────────────────────────────────────
// Vietnamese diacritics folded away so "Bánh cuốn" and "Banh cuon" compare equal.
export const fold = (s) =>
  (s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Words that carry no identity — every second dish is a "bánh" or a "soup", so matching on
// them is how "Bánh xíu páo" ends up as a Cantonese cha siu bao.
const STOP = new Set([
  "banh", "bun", "chao", "com", "goi", "lau", "nem", "cha", "ca", "bo", "ga", "vit", "thit",
  "keo", "mon", "che", "xoi", "mien", "pho", "hu", "tieu", "canh", "cake", "cakes", "soup",
  "noodle", "noodles", "rice", "pork", "beef", "chicken", "duck", "fish", "salad", "candy",
  "rolls", "roll", "grilled", "fried", "steamed", "fermented", "sour", "sweet", "hot",
  "hotpot", "pot", "with", "and", "the", "of", "a", "in", "leaf", "leaves", "style", "dried",
  "raw", "braised", "porridge", "dumpling", "dumplings", "pancake", "stew", "sausage",
  "vietnam", "vietnamese", "korea", "korean", "food", "dish", "dishes", "national", "park",
  "lake", "mountain", "cave", "waterfall", "island", "temple", "pagoda", "beach", "village",
]);

/**
 * `stop` lets a caller add its own no-identity words without polluting the shared set.
 * Destinations need it: "núi", "chùa", "thác", "đảo" carry no identity for a place, but "chua"
 * also means *sour* and would wreck dish matching if it went into the global list.
 *
 * `minLen` raises the bar for what counts as a distinctive token. Destinations pass 3, because
 * a 2-letter token matches almost anything on earth: "Y Tý" kept the single token "ty" and so
 * scored a perfect 1-of-1 against a Welsh farmhouse, "Ty-Hwnt-y-Bwlch". Dropping it leaves no
 * distinctive token at all, which falls through to the verbatim check below — the right answer
 * for a name this short.
 */
export const tokens = (s, { stop, minLen = 2 } = {}) =>
  fold(s).split(" ").filter((t) => t.length >= minLen && !STOP.has(t) && !stop?.has(t));

/**
 * Does `title` actually name the thing `query` asked for?
 * Requires `ratio` of the query's distinctive tokens to appear in the title.
 */
export function titleMatches(query, title, ratio, opts = {}) {
  const q = tokens(query, opts);
  // Short names are *all* stopwords ("Bún cá", "Chè Huế") — there is no distinctive token to
  // score, so fall back to requiring the whole folded name to appear in the title verbatim.
  if (!q.length) {
    const f = fold(query);
    return f.length > 2 && fold(title).includes(f);
  }
  // With only a few tokens, every one of them is load-bearing: dropping the odd one out is how
  // "Trà Thái Nguyên" matched the article for Thai tea ("Trà Thái") at a 2-of-3 score. Partial
  // credit is only safe once there are enough tokens that a miss is plausibly noise.
  const need = ratio ?? (q.length <= 3 ? 1 : 0.6);
  const t = new Set(fold(title).split(" "));
  return q.filter((x) => t.has(x)).length / q.length >= need;
}

// ── Rejection filters ─────────────────────────────────────────────────────────
export const JUNK =
  /\b(map|bản đồ|logo|flag|coat of arms|diagram|chart|montage|collage|seal|emblem|locator|icon|screenshot|menu|sign|poster|banner|stamp|postcard)\b/i;

// A Wikipedia hit whose short description says "city / plant / person" is not a photo of a
// dish, however well the title matched. This is the filter that stops the shrub and the city.
// Split in two, because "is this article about a town?" is a rejection for a dish and a
// CONFIRMATION for a destination. Hà Tiên, Vân Đồn and Y Tý are all legitimately described as a
// town or commune; rejecting those would throw away exactly the articles we want.
const NOT_A_PLACE =
  /\b(politician|singer|writer|footballer|actor|company|university|list of|lists of|species|genus)\b/i;
const NOT_A_PLACE_VI = /(danh sách|chính trị gia|ca sĩ|nhà văn|cầu thủ|loài|chi )/i;
const IS_A_SETTLEMENT =
  /\b(city|town|province|district|commune|ward|municipality|county)\b/i;
const IS_A_SETTLEMENT_VI = /(thành phố|tỉnh|huyện|xã |phường|thị trấn|thị xã)/i;
// A province is never a destination — the atlas models provinces as their own entity — so the
// province article is always the wrong subject, even in `place` mode. Without this, "Hoa Binh
// Lake" resolved to the article for *Hòa Bình province*: the lake's name tokens are the
// province's name tokens, and "lake" is a stopword, so nothing else could tell them apart.
const IS_A_PROVINCE = /\b(province|prefecture)\b/i;
const IS_A_PROVINCE_VI = /(^|\s)tỉnh\s/i;

/** Extra rejections that only make sense for food (a plant is not a plate of food). */
const NOT_FOOD = /\b(plant|tree|shrub|flower|crop|cultivar|orchard|plantation|bird|animal|insect)\b/i;

/**
 * Free-text sources (Openverse/Flickr) caption photos with place names, so a dish named after
 * a province matches travel photography of that province: "Don Quảng Ngãi" scored a hit on
 * "Quảng Ngãi 1971 — Đường Ngô Quyền … Don Kilgore Collection". Requiring some word that means
 * *food* kills that whole class without needing to enumerate what a street photo looks like.
 */
// Deliberately excludes "market", "fish" and "rice": they are as common in travel and archive
// captions as in food ones, and "Ky Hoa fish market 1970" sailed straight through a cue list
// that had them.
export const FOOD_CUE =
  /(món ăn|ẩm thực|đặc sản|quán ăn|nhà hàng|bánh|bún|phở|cơm |chè |xôi|cháo|miến|nem |chả |gỏi|lẩu|kẹo|mứt|cà phê|nướng|luộc|hấp|chiên|food|dish|cuisine|restaurant|meal|plate|bowl|soup|noodle|cake|snack|dessert|cooking|recipe|street ?food)/i;

/** Archive and historical-survey photography: captioned with the place, never about the dish. */
export const ARCHIVAL = /\b(19\d\d|200\d)\b|\b(collection|archive|archives|museum of|historical society)\b/i;

/**
 * `place: true` keeps the settlement descriptors, because a destination article that says
 * "commune in Lào Cai" is the right article. Everything else — people, companies, list pages,
 * biological taxa — is still wrong for either kind of subject.
 */
export function describesSomethingElse(text, { food = false, place = false } = {}) {
  if (NOT_A_PLACE.test(text) || NOT_A_PLACE_VI.test(text)) return true;
  if (IS_A_PROVINCE.test(text) || IS_A_PROVINCE_VI.test(text)) return true;
  if (!place && (IS_A_SETTLEMENT.test(text) || IS_A_SETTLEMENT_VI.test(text))) return true;
  if (food && NOT_FOOD.test(text)) return true;
  return false;
}

/** Landscape-ish bitmap, big enough to be a hero. */
export function usableImage({ width, height, mime }) {
  if (mime && !/image\/(jpeg|png|webp)/.test(mime)) return false;
  if ((width ?? 0) < 700) return false;
  if (height && width && height > width * 1.6) return false; // hard portrait penalty
  return true;
}

// ── HTTP ──────────────────────────────────────────────────────────────────────
// Wikimedia rate-limits per IP, and it is easy to get the whole machine throttled for a long
// while: an earlier unpaced run of the dish fetcher did exactly that, and every endpoint —
// action API, Core REST, Commons — returned 429 for everything afterwards. So all traffic
// from this module is serialised through one queue with a minimum gap per host, and a 429
// puts that host in a cooldown every later request waits out.

const MIN_GAP_MS = { "wikipedia.org": 1100, "wikimedia.org": 1100, default: 350 };
const lastCall = new Map();
const coolUntil = new Map();
let queue = Promise.resolve();

const hostKey = (url) => {
  const h = new URL(url).hostname;
  const m = h.match(/[^.]+\.[^.]+$/);
  return m ? m[0] : h;
};

/** Serialise every request and keep a polite gap; never let two run at once. */
function schedule(fn, key) {
  const run = queue.then(async () => {
    const gap = MIN_GAP_MS[key] ?? MIN_GAP_MS.default;
    const wait = Math.max(
      (lastCall.get(key) ?? 0) + gap - Date.now(),
      (coolUntil.get(key) ?? 0) - Date.now(),
    );
    if (wait > 0) await sleep(wait);
    lastCall.set(key, Date.now());
    return fn();
  });
  queue = run.catch(() => {});
  return run;
}

export async function getJson(url, { tries = 3, headers = {}, timeout = 15000 } = {}) {
  const key = hostKey(url);
  for (let i = 0; i < tries; i++) {
    const res = await schedule(
      () =>
        fetch(url, {
          headers: { "User-Agent": UA, ...headers },
          signal: AbortSignal.timeout(timeout),
        }).catch(() => null),
      key,
    );
    if (!res) continue; // timeout or network blip
    if (res.ok) return res.json();
    if (res.status === 429 || res.status >= 500) {
      const retryAfter = Number(res.headers.get("retry-after")) * 1000;
      const backoff = retryAfter || (i + 1) * 10000;
      coolUntil.set(key, Date.now() + backoff);
      continue;
    }
    return null;
  }
  return null;
}

/** True once `key` has been quiet long enough that it is worth trying again. */
export const cooling = (key) => (coolUntil.get(key) ?? 0) > Date.now();

export async function downloadWebp(url, destFile, { width = 1280, quality = 74, tries = 4 } = {}) {
  for (let i = 1; i <= tries; i++) {
    const res = await schedule(() => fetch(url, { headers: { "User-Agent": UA } }), hostKey(url));
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      await sharp(buf).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(destFile);
      return;
    }
    if ((res.status === 429 || res.status >= 500) && i < tries) {
      await sleep(Number(res.headers.get("retry-after")) * 1000 || i * 10000);
      continue;
    }
    throw new Error(`download ${res.status}`);
  }
  throw new Error("download 429 (retries exhausted)");
}

// ── Commons attribution ───────────────────────────────────────────────────────
export async function commonsAttribution(file) {
  if (!file) return { credit: "", license: "Wikimedia Commons" };
  const data = await getJson(
    `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(file)}&prop=imageinfo&iiprop=extmetadata&format=json&origin=*`,
  );
  const meta = Object.values(data?.query?.pages ?? {})[0]?.imageinfo?.[0]?.extmetadata ?? {};
  const strip = (html) => (html ?? "").replace(/<[^>]+>/g, "").trim();
  return {
    credit: strip(meta.Artist?.value).slice(0, 80),
    license: strip(meta.LicenseShortName?.value) || "Wikimedia Commons",
  };
}

// ── Sources ───────────────────────────────────────────────────────────────────
// Every source returns { url, file, sourceTitle, sourceUrl, via, credit?, license? } or null.

/** Shared tail of the two Wikipedia paths: validate a summary payload and build the pick. */
async function leadFromSummary(lang, sum, opts) {
  if (!sum || sum.type === "disambiguation") return null;
  if (describesSomethingElse(`${sum.description ?? ""} ${sum.extract?.slice(0, 160) ?? ""}`, opts)) return null;
  const img = sum.originalimage ?? sum.thumbnail;
  if (!img?.source || !usableImage({ width: img.width, height: img.height })) return null;
  if (JUNK.test(img.source)) return null;
  // The action API carries the Commons file name for attribution. It is rate-limited far more
  // aggressively than REST, so a miss here costs the credit line, not the photo.
  const pi = await getJson(
    `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(sum.title)}&prop=pageimages&piprop=name&format=json&origin=*`,
    { tries: 1 },
  );
  const page = Object.values(pi?.query?.pages ?? {})[0];
  return {
    url: img.source,
    file: page?.pageimage ? `File:${page.pageimage}` : null,
    sourceTitle: sum.title,
    sourceUrl: sum.content_urls?.desktop?.page ?? `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(sum.title)}`,
    via: `wikipedia-${lang}`,
  };
}

/**
 * Wikipedia lead image by *exact article title* — no search step.
 * Most dishes are titled exactly as they are named ("Bánh xèo", "Thắng cố"), and this path
 * uses only the REST endpoint, which survives the rate limiting that shuts `w/api.php` down.
 * An exact title hit also needs no name validation: it cannot be about something else.
 */
export async function wikiTitle(lang, term, opts = {}) {
  const title = term.trim().replace(/ /g, "_");
  const sum = await getJson(
    `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    { tries: 2 },
  );
  if (!sum || sum.title == null) return null;
  // A redirect can land somewhere broader ("Nem lụi" → "Huế"), so the landing title still has
  // to look like the thing we asked for.
  if (!titleMatches(term, sum.title, opts.ratio, opts)) return null;
  return leadFromSummary(lang, sum, opts);
}

/** Wikipedia lead image via search, name-validated and subject-validated. */
export async function wikiLead(lang, term, opts = {}) {
  const s = await getJson(
    `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&srlimit=5&format=json&origin=*`,
  );
  for (const hit of s?.query?.search ?? []) {
    if (!titleMatches(term, hit.title, opts.ratio, opts)) continue;
    const sum = await getJson(
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hit.title.replace(/ /g, "_"))}`,
    );
    const pick = await leadFromSummary(lang, sum, opts);
    if (pick) return pick;
  }
  return null;
}

/**
 * Wikidata P18 — the image an editor chose to represent the entity.
 *
 * Worth its own step for two reasons. It is *curated*: someone picked one photo as the
 * representative one, which is exactly the judgement a search cannot make. And the entity carries
 * **P17 (country)**, which is a far stronger validator than counting name tokens — it is a fact
 * about the subject rather than a guess about its title. That is the same guard that settled the
 * province-name work: resolve by entity with P17, never by article title, because several
 * Vietnamese place names are also Chinese ones. A Welsh farmhouse cannot pass P17 = Vietnam
 * however well its name happens to overlap.
 *
 * `opts.country` is a Wikidata QID (Vietnam Q881, South Korea Q884). Omit it to skip the check.
 */
export async function wikidataImage(term, opts = {}) {
  for (const lang of opts.langs ?? ["en"]) {
    const s = await getJson(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(term)}` +
        `&language=${lang}&uselang=${lang}&format=json&limit=5&origin=*`,
    );
    for (const hit of s?.search ?? []) {
      if (!titleMatches(term, hit.label ?? "", opts.ratio, opts)) continue;
      // wbgetentities, not wbgetclaims: the latter takes a SINGLE property, and asking it for
      // "P18|P17" returns {error} rather than claims. Reading `?.claims?.P18` off that error
      // object yields undefined, so the whole source failed silently on every subject — it
      // looked exactly like "no image recorded" and stayed invisible until the raw call was read.
      const data = await getJson(
        `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${hit.id}&props=claims&format=json&origin=*`,
      );
      const claims = data?.entities?.[hit.id]?.claims;
      if (!claims) continue;
      if (opts.country) {
        const country = claims.P17?.[0]?.mainsnak?.datavalue?.value?.id;
        if (country !== opts.country) continue; // right name, wrong country — the whole point
      }
      const fileName = claims.P18?.[0]?.mainsnak?.datavalue?.value;
      if (!fileName) continue;
      const file = `File:${fileName}`;
      const info = await getJson(
        `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(file)}` +
          `&prop=imageinfo&iiprop=url%7Csize%7Cmime&iiurlwidth=1280&format=json&origin=*`,
      );
      const page = Object.values(info?.query?.pages ?? {})[0];
      const ii = page?.imageinfo?.[0];
      if (!ii || !usableImage(ii) || JUNK.test(file)) continue;
      return {
        url: ii.thumburl ?? ii.url,
        file,
        sourceTitle: file,
        sourceUrl: ii.descriptionurl ?? `https://www.wikidata.org/wiki/${hit.id}`,
        via: "wikidata-p18",
      };
    }
  }
  return null;
}

/** Commons category for the subject, then the first usable file inside it. */
export async function commonsCategory(term, opts = {}) {
  const s = await getJson(
    `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&srnamespace=14&srlimit=5&format=json&origin=*`,
  );
  for (const hit of s?.query?.search ?? []) {
    if (!titleMatches(term, hit.title.replace(/^Category:/, ""), opts.ratio, opts)) continue;
    const members = await getJson(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=${encodeURIComponent(hit.title)}&gcmtype=file&gcmlimit=15&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1280&format=json&origin=*`,
    );
    // Matching the CATEGORY name is not the same as matching the photo. A category collects
    // everything loosely about a subject, so taking its first usable file gave Phố Hiến a "Beer
    // Hoi Corner Hanoi" panorama, Bitexco Tower the State Bank building, and Tao Đàn park a shot
    // of Bến Thành. Prefer a file that names the subject itself; fall back to the category's own
    // contents only when nothing inside does.
    const files = Object.values(members?.query?.pages ?? {}).filter((p) => {
      const ii = p.imageinfo?.[0];
      if (!ii || !usableImage(ii) || JUNK.test(p.title) || ARCHIVAL.test(p.title)) return false;
      return !opts.cue || opts.cue.test(`${hit.title} ${p.title}`);
    });
    const bare = (p) => p.title.replace(/^File:/, "").replace(/\.\w+$/, "");
    const best = files.find((p) => titleMatches(term, bare(p), opts.ratio, opts)) ?? files[0];
    if (best) {
      const ii = best.imageinfo[0];
      return {
        url: ii.thumburl ?? ii.url,
        file: best.title,
        sourceTitle: best.title,
        sourceUrl: ii.descriptionurl ?? "",
        // Flagged distinctly when only the category vouched for it, so the audit can tell the
        // two apart instead of trusting them equally.
        via: titleMatches(term, bare(best), opts.ratio, opts) ? "commons-category" : "commons-category-loose",
      };
    }
  }
  return null;
}

/**
 * Commons geosearch — files geotagged near a coordinate, **still name-validated**.
 *
 * The unvalidated version of this was the atlas' worst photo bug. Taking the nearest geotagged
 * file on trust gave a shipyard for a whale village, a high school, and Côn Đảo prison for Sơn
 * La prison: 13 wrong heroes out of 14. The reason is structural, not bad luck — a destination
 * is still unphotographed precisely *because* nothing correct is geotagged there, so geosearch
 * can only return its neighbours. Proximity is therefore treated as a tiebreaker among files
 * that already name the place, never as evidence on its own.
 */
export async function commonsGeo(lat, lng, term, opts = {}) {
  for (const radius of opts.radii ?? [2000, 8000]) {
    const d = await getJson(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=geosearch&ggscoord=${lat}|${lng}` +
        `&ggsradius=${radius}&ggsnamespace=6&ggslimit=40&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1280&format=json&origin=*`,
    );
    for (const p of Object.values(d?.query?.pages ?? {})) {
      const ii = p.imageinfo?.[0];
      if (!ii || !usableImage(ii) || JUNK.test(p.title)) continue;
      const bare = p.title.replace(/^File:/, "").replace(/\.\w+$/, "");
      if (!titleMatches(term, bare, opts.ratio, opts)) continue;
      if (ARCHIVAL.test(p.title)) continue;
      return {
        url: ii.thumburl ?? ii.url,
        file: p.title,
        sourceTitle: p.title,
        sourceUrl: ii.descriptionurl ?? "",
        via: "commons-geo",
      };
    }
  }
  return null;
}

/** Commons full-text search — the file title itself has to match. */
export async function commonsSearch(term, opts = {}) {
  const d = await getJson(
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term)}%20filetype:bitmap&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1280&format=json&origin=*`,
  );
  const pages = Object.values(d?.query?.pages ?? {}).sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii || !usableImage(ii) || JUNK.test(p.title)) continue;
    if (!titleMatches(term, p.title.replace(/^File:/, "").replace(/\.\w+$/, ""), opts.ratio, opts)) continue;
    if (opts.cue && !opts.cue.test(p.title)) continue;
    if (ARCHIVAL.test(p.title)) continue;
    return {
      url: ii.thumburl ?? ii.url,
      file: p.title,
      sourceTitle: p.title,
      sourceUrl: ii.descriptionurl ?? "",
      via: "commons-search",
    };
  }
  return null;
}

/**
 * Openverse — mostly Flickr, filtered to licences that allow commercial use so the atlas can
 * carry the photo without a per-image negotiation. No credential needed.
 *
 * `modification` is part of the filter, not decoration: build-thumbs.mjs makes a 96px square
 * CROP of every photo for the map medallions, and a crop is a derivative work. Filtering on
 * `commercial` alone let four BY-ND files through and each got a cropped thumbnail — see the
 * second guard in `firstHit`, which catches the same class if a source ever slips again.
 */
export async function openverse(term, opts = {}) {
  const d = await getJson(
    `https://api.openverse.org/v1/images/?q=${encodeURIComponent(term)}&license_type=commercial,modification&page_size=15&mature=false`,
    { tries: 2 },
  );
  for (const rec of d?.results ?? []) {
    if (!usableImage({ width: rec.width, height: rec.height })) continue;
    if (JUNK.test(rec.title ?? "")) continue;
    // Match on the *title* only. Flickr tag clouds carry every word a photo might relate to, so
    // scoring against them proves nothing about the frame: a cat photo tagged "tuna, eye" beat
    // "Mắt cá ngừ đại dương", and "Wedding Cake" beat "Bánh phu thê".
    const title = rec.title ?? "";
    if (!titleMatches(term, title, opts.ratio, opts)) continue;
    if (opts.cue && !opts.cue.test(title)) continue;
    if (ARCHIVAL.test(title)) continue;
    return {
      url: rec.url,
      file: null,
      sourceTitle: rec.title ?? "",
      sourceUrl: rec.foreign_landing_url ?? rec.url,
      via: `openverse-${rec.source}`,
      credit: (rec.creator ?? "").slice(0, 80),
      license: `${(rec.license ?? "").toUpperCase()} ${rec.license_version ?? ""}`.trim(),
    };
  }
  return null;
}

/**
 * Stock photography — the last resort for subjects with no free-culture photo anywhere.
 * Needs a key in the environment; without one this returns null and the caller falls back to
 * the illustrated placeholder, which is the honest outcome.
 *   PEXELS_API_KEY      → https://www.pexels.com/api/
 *   UNSPLASH_ACCESS_KEY → https://unsplash.com/developers
 * Both licences require attribution, which is why `credit` is always recorded.
 */
export async function stock(term, opts = {}) {
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (pexelsKey) {
    const d = await getJson(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(term)}&per_page=15&orientation=landscape`,
      { tries: 2, headers: { Authorization: pexelsKey } },
    );
    for (const p of d?.photos ?? []) {
      if (!usableImage({ width: p.width, height: p.height })) continue;
      if (!titleMatches(term, p.alt ?? "", opts.ratio ?? 0.5)) continue;
      return {
        url: p.src?.large2x ?? p.src?.large ?? p.src?.original,
        file: null,
        sourceTitle: p.alt ?? `Pexels ${p.id}`,
        sourceUrl: p.url,
        via: "pexels",
        credit: p.photographer ?? "",
        license: "Pexels License",
      };
    }
  }

  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (unsplashKey) {
    const d = await getJson(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&per_page=15&orientation=landscape`,
      { tries: 2, headers: { Authorization: `Client-ID ${unsplashKey}` } },
    );
    for (const p of d?.results ?? []) {
      if (!usableImage({ width: p.width, height: p.height })) continue;
      const alt = `${p.alt_description ?? ""} ${p.description ?? ""}`;
      if (!titleMatches(term, alt, opts.ratio ?? 0.5)) continue;
      // Unsplash API terms require pinging the download endpoint when a photo is used.
      if (p.links?.download_location) {
        await fetch(p.links.download_location, {
          headers: { "User-Agent": UA, Authorization: `Client-ID ${unsplashKey}` },
        }).catch(() => {});
      }
      return {
        url: p.urls?.regular ?? p.urls?.full,
        file: null,
        sourceTitle: (p.alt_description ?? `Unsplash ${p.id}`).slice(0, 120),
        sourceUrl: p.links?.html ?? "",
        via: "unsplash",
        credit: p.user?.name ?? "",
        license: "Unsplash License",
      };
    }
  }

  return null;
}

export const stockAvailable = () => Boolean(process.env.PEXELS_API_KEY || process.env.UNSPLASH_ACCESS_KEY);

/**
 * A licence that forbids derivative works. The atlas cannot use one: every photo gets a 96px
 * square crop for its map medallion, and a crop is a derivative. Matches "BY-ND", "CC BY-NC-ND
 * 4.0" and the spelled-out "NoDerivatives". Verified against all 28 licence strings the manifest
 * actually holds — no false positive. Apply it to a LICENCE only: a credit line reading
 * "Nd Rahman" would match too.
 */
export const forbidsDerivatives = (license) => /(^|[\s-])nd([\s-]|$)|noderiv/i.test(license ?? "");

/**
 * GFDL without a Creative Commons alternative. The licence was written for documentation and
 * demands that a full copy of its text travel with every distributed copy — a photo caption
 * cannot carry that, which is why Commons stopped accepting GFDL-only uploads for media. A file
 * dual-licensed GFDL + CC is fine: we use the CC terms, and the string names them.
 */
export const gfdlOnly = (license) =>
  /gfdl|free documentation/i.test(license ?? "") && !/\bcc\b|creative commons|public domain|cc0/i.test(license ?? "");

/**
 * Walk a list of `() => Promise<pick|null>` thunks and return the first hit, tagging it with
 * Commons attribution when the source did not carry its own.
 */
export async function firstHit(steps) {
  for (const step of steps) {
    const pick = await step();
    if (!pick) continue;
    if (pick.credit === undefined || pick.license === undefined) {
      const attr = await commonsAttribution(pick.file);
      pick.credit ??= attr.credit;
      pick.license ??= attr.license;
    }
    // Second guard, deliberately after attribution is resolved: the licence is not always known
    // until then. A source filter can be incomplete — Openverse's `commercial` was — so the
    // funnel every pick passes through refuses ND rather than trusting the query string.
    if (forbidsDerivatives(pick.license)) {
      console.warn(`  ✗ bỏ qua ${pick.sourceTitle || pick.url} — giấy phép ${pick.license} cấm phái sinh`);
      continue;
    }
    if (gfdlOnly(pick.license)) {
      console.warn(`  ✗ bỏ qua ${pick.sourceTitle || pick.url} — ${pick.license} đòi đính kèm toàn văn giấy phép`);
      continue;
    }
    return pick;
  }
  return null;
}
