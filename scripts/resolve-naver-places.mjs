// Resolve every Korean atlas entry to its Naver place id.
//
//   node --experimental-strip-types scripts/resolve-naver-places.mjs           (npm run maps:naver)
//   node --experimental-strip-types scripts/resolve-naver-places.mjs --limit=5 (smoke test)
//
// Why an id at all: a coordinate handed to map.naver.com only pans the map — the new /p/ app
// drops `lng`/`lat` outright, and a pin on an empty map tells the user nothing. The page worth
// landing on is /p/entry/place/{id}: photos, hours, menu, reviews. That id exists nowhere in our
// data and cannot be derived from coordinates, so it has to be looked up once, here, and shipped.
//
// The lookup asks pcmap — the server-rendered place list behind Naver Map's result panel — for
// the KOREAN name from our ko overlay, and reads the candidates out of the page's Apollo cache.
// Naver Map's own autocomplete endpoint carries the same data and was the first thing tried, but
// it rate-limits a sweep of this size into oblivion (400s that persist for the better part of an
// hour). pcmap answers 50 candidates a page and does not, so far, complain.
//
// It ranks nationally rather than by proximity, so the distance to the entry's own coordinate is
// computed here and every candidate is judged on it.
//
// Matching is deliberately unforgiving, because a wrong id is worse than no id — it sends the
// user confidently to another place, while an unmatched entry costs only a fallback to a name
// search. Two ways in, both gated on distance:
//
//   exact — same title once spacing and punctuation are stripped, within MAX_KM (our coordinate
//           is an entrance, Naver's a centroid, so a big park or island legitimately differs).
//   near  — one title contains the other and they sit within NEAR_KM of each other, e.g. our
//           "인사동" vs Naver's "인사동문화의거리" 50 m away. Infrastructure entries are excluded
//           here: a car park is a containment match for the park it belongs to.
//
// A query that returns nothing is retried once on its head noun, since our editorial names are
// sometimes phrases ("창덕궁과 후원") where Naver indexes the landmark alone. The retry changes
// only what is asked, never how strictly the answer is accepted.
import { readFileSync, writeFileSync } from "node:fs";
import { destinationsKr, restaurantsKr } from "../src/data/kr/index.ts";
import { destinationI18nKr, restaurantI18nKr } from "../src/data/kr/i18n/index.ts";
import { distanceKm, pickPlace, relates } from "./lib/place-match.mjs";

const OUT = new URL("../src/data/generated/naver-places.json", import.meta.url);
const ENDPOINT = "https://pcmap.place.naver.com/place/list";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const MAX_KM = 3;
/** A partial-name match gets less room than an exact one, but a museum's pin can still be off. */
const NEAR_KM = 1.5;
// No `closeKm` here on purpose: the shared-word tier was tried against the 24 entries Naver still
// misses and matched none of them. Leaving it on would loosen a finished, verified manifest for a
// measured gain of nothing — a later --missing run could then admit a match nobody reviewed.
/** Facilities that sit inside a landmark and inherit its name — never the place the user wants. */
const INFRA = /주차장|화장실|정류장|승강장|출입구|매표소|안내소|공영자전거/;
/** "블루샥 통영중앙시장점" is a coffee branch inside the market, not the market. A restaurant
 *  entry may legitimately name its own branch, so this only rejects what WE did not call a 점. */
const BRANCH = /점$/;
/** Each answer is half a megabyte of rendered HTML; no reason to ask faster than this. */
const DELAY_MS = 800;
const BACKOFF_MS = [5_000, 15_000, 45_000];
/** Past this many failures in a row the block is not going to lift; stop instead of hammering. */
const GIVE_UP_AFTER = 3;

const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? Number(limitArg.split("=")[1]) : Infinity;
/** Skip what the manifest already has — a full sweep costs 200 requests and hours of goodwill. */
const MISSING_ONLY = process.argv.includes("--missing");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** The Korean name is what Naver indexes; en/vi names are a last resort that rarely matches. */
function koreanName(entry, overlays) {
  return overlays[entry.id]?.ko?.name || entry.nameEn || entry.name;
}

/** The page ships its data as an Apollo cache; scan the braces so the JSON can be parsed whole. */
function apolloState(html) {
  const at = html.indexOf("__APOLLO_STATE__");
  if (at < 0) return null;
  const start = html.indexOf("{", at);
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let j = start; j < html.length; j++) {
    const c = html[j];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') inString = true;
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return JSON.parse(html.slice(start, j + 1));
  }
  return null;
}

/**
 * Naver answers a sweep it dislikes with a 400 on queries it served happily a minute earlier, so
 * a rejection is retried on a widening delay before it counts as a real failure.
 */
async function candidates(query, entry) {
  const url = `${ENDPOINT}?query=${encodeURIComponent(query)}`;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA, Referer: "https://map.naver.com/" } });
    if (res.ok) {
      const state = apolloState(await res.text());
      if (!state) return [];
      return Object.values(state)
        .filter((v) => v?.__typename === "PlaceListBusinessesItem" && v.x && v.y)
        .map((v) => ({
          id: v.id,
          title: v.name,
          ctg: v.category ?? "",
          lng: Number(v.x),
          lat: Number(v.y),
          dist: distanceKm(entry, { lat: Number(v.y), lng: Number(v.x) }),
        }))
        .sort((a, b) => a.dist - b.dist);
    }
    if (attempt === BACKOFF_MS.length) throw new Error(`HTTP ${res.status} for "${query}"`);
    await sleep(BACKOFF_MS[attempt]);
  }
}

const pick = (query, places) =>
  pickPlace(query, places, {
    maxKm: MAX_KM,
    nearKm: NEAR_KM,
    reject: (p, q) =>
      INFRA.test(p.title) || INFRA.test(p.ctg ?? "") || (BRANCH.test(p.title) && !BRANCH.test(q)),
  });

/**
 * "창덕궁과 후원" → "창덕궁" (the 과/와 connective), "익선동 한옥골목" → "익선동" (trailing
 * descriptor). Returns null when the name is already a single noun and there is nothing to trim.
 */
function headNoun(query) {
  const cut = query.replace(/(?:과|와)\s+.+$/, "").trim();
  if (cut && cut !== query) return cut;
  const words = query.split(/\s+/);
  return words.length > 1 ? words.slice(0, -1).join(" ") : null;
}

// Always start from what is already resolved: this script only ever adds and updates. Writing a
// fresh manifest would mean one `--limit=3` smoke test silently throwing away 177 rows.
const known = JSON.parse(readFileSync(OUT, "utf8"));

const corpus = [
  ...destinationsKr.map((d) => ({ entry: d, overlays: destinationI18nKr })),
  ...restaurantsKr.map((r) => ({ entry: r, overlays: restaurantI18nKr })),
];
const entries = (MISSING_ONLY ? corpus.filter(({ entry }) => !known[entry.id]) : corpus).slice(
  0,
  LIMIT,
);

const resolved = { ...known };
const unresolved = [];
const suspect = [];
let failures = 0;
let inARow = 0;

console.log(`Resolving ${entries.length} Korean entries against Naver Map…\n`);

for (const { entry, overlays } of entries) {
  const query = koreanName(entry, overlays);
  try {
    let asked = query;
    const first = await candidates(query, entry);
    let found = pick(query, first);
    // Only an empty answer earns a second ask. A miss among real candidates means the place is
    // there under another name, and a trimmed query would just wander off to the district.
    const retry = first.length === 0 ? headNoun(query) : null;
    if (retry) {
      await sleep(DELAY_MS);
      asked = retry;
      found = pick(retry, await candidates(retry, entry));
    }
    const { how, miss, far } = found;
    // A trimmed query is matched against the trimmed name, so the answer can drift: asking
    // "춘천" for "춘천과 소양호" once brought back the city hall. The entry's OWN name has the
    // last word, whatever we ended up asking.
    const hit = found.hit && relates(query, found.hit.title) ? found.hit : null;
    if (hit) {
      resolved[entry.id] = { id: hit.id, name: hit.title };
      const note = `${hit.title} (${how}, ${hit.dist.toFixed(2)} km)`;
      console.log(`  ✓ ${entry.id.padEnd(34)} ${hit.id.padEnd(10)} ${note}`);
    } else if (far) {
      suspect.push({ id: entry.id, naver: miss });
      console.log(`  ! ${entry.id.padEnd(34)} "${miss.title}" is ${miss.dist.toFixed(1)} km away`);
    } else {
      unresolved.push({ id: entry.id, asked, miss });
      const why = miss ? `nearest "${miss.title}" ${miss.dist.toFixed(2)} km` : "no candidates";
      console.log(`  · ${entry.id.padEnd(34)} unmatched — ${asked} → ${why}`);
    }
    inARow = 0;
  } catch (err) {
    failures++;
    inARow++;
    console.log(`  ✗ ${entry.id.padEnd(34)} ${err.message}`);
    if (inARow >= GIVE_UP_AFTER) {
      console.log(`\nNaver is refusing us. Stopping — re-run with --missing after a break.`);
      break;
    }
  }
  await sleep(DELAY_MS);
}

// Sorted so a re-run produces a reviewable diff rather than a reshuffle.
const sorted = Object.fromEntries(Object.keys(resolved).sort().map((k) => [k, resolved[k]]));
writeFileSync(OUT, `${JSON.stringify(sorted, null, 2)}\n`);

if (suspect.length) {
  console.log(`\nSame name, far pin — compare with OUR coordinate for these ${suspect.length}:`);
  for (const s of suspect) {
    console.log(
      `  ${s.id.padEnd(30)} ${s.naver.dist.toFixed(1).padStart(5)} km off` +
        `  naver "${s.naver.title}" at ${s.naver.lat.toFixed(5)},${s.naver.lng.toFixed(5)}`,
    );
  }
}

const total = Object.keys(resolved).length;
console.log(
  `\n${total}/${corpus.length} entries have a Naver place id` +
    `, ${corpus.length - total} still fall back to a name search` +
    `${failures ? `, ${failures} request failures` : ""}.`,
);
console.log(`Wrote ${OUT.pathname.split("/").slice(-4).join("/")}`);
if (failures) process.exitCode = 1;
