// Resolve every atlas entry to its Google place id, so the Google button opens the place itself.
//
//   npm run maps:google          — reads GOOGLE_MAPS_API_KEY from .env (gitignored)
//     --limit=5        smoke test
//     --missing        ask only for entries the manifest lacks
//     --country=vn     sweep one atlas
//     --max-calls=500  lower the billing guard (default 1000)
//
// Same shape and the same matching rules as the Naver resolver (scripts/lib/place-match.mjs) —
// what differs is only how the candidates are asked for.
//
// Why an id: `?api=1&query=lat,lng` drops a pin, and Google shows the place card only when those
// coordinates happen to sit on its own centroid; otherwise the user gets "Dropped pin" and none
// of the photos, hours and reviews they opened the app for. `&query_place_id=` names the place
// outright. Unlike Naver's, this id has no free public surface — the Places API needs a key with
// billing enabled — so this script is the one place a key is used, at build time, never shipped.
//
// The lookup is Text Search (New) with the entry's coordinate as a location BIAS, not a filter:
// biasing ranks the right candidate first without hiding a genuinely mis-pinned place, which is
// what lets a same-name-far-pin land in the audit list below instead of vanishing.
import { readFileSync, writeFileSync } from "node:fs";
import { destinations } from "../src/data/destinations.ts";
import { restaurants } from "../src/data/food/restaurants.ts";
import { destinationsKr, restaurantsKr } from "../src/data/kr/index.ts";
import { destinationI18nKr, restaurantI18nKr } from "../src/data/kr/i18n/index.ts";
import { distanceKm, pickPlace, relates } from "./lib/place-match.mjs";

const OUT = new URL("../src/data/generated/google-places.json", import.meta.url);
const ENDPOINT = "https://places.googleapis.com/v1/places:searchText";
/** Only the three fields the match needs — every extra field moves the call to a dearer SKU. */
const FIELDS = "places.id,places.displayName,places.location";

const KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!KEY) {
  console.error(
    "GOOGLE_MAPS_API_KEY is not set.\n" +
      "Add it to .env (gitignored — see .env.example) with the Places API (New) enabled on the\n" +
      "key's project, then re-run: npm run maps:google",
  );
  process.exit(1);
}

const MAX_KM = 3;
const NEAR_KM = 1.5;
/** Radius of the ranking bias. Wide enough for a park's far entrance, tight enough to mean it. */
const BIAS_M = 10_000;
/** Google is happy well above this; the pace is politeness, not a limit. */
const DELAY_MS = 120;
const BACKOFF_MS = [2_000, 8_000, 30_000];
const GIVE_UP_AFTER = 3;

/**
 * Hard ceiling on billable requests. Google's free allowance is a cliff, not a throttle: past it
 * the calls still succeed and simply cost money, so nothing outside this counter would ever stop
 * them. Retries count, because Google bills those too.
 */
const maxCallsArg = process.argv.find((a) => a.startsWith("--max-calls="));
const MAX_CALLS = maxCallsArg ? Number(maxCallsArg.split("=")[1]) : 1000;
let calls = 0;

const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? Number(limitArg.split("=")[1]) : Infinity;
const MISSING_ONLY = process.argv.includes("--missing");
const countryArg = process.argv.find((a) => a.startsWith("--country="));
const ONLY_COUNTRY = countryArg ? countryArg.split("=")[1] : null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Ask in the language the place is registered in: Vietnamese for Vietnam, Korean for Korea (from
 * the ko overlay, the same names that made the Naver sweep work). An English name is a fallback
 * that resolves far less often.
 */
function localName(entry, atlas) {
  if (atlas.cc === "kr") return atlas.overlaysFor(entry)[entry.id]?.ko?.name || entry.nameEn || entry.name;
  return entry.name || entry.nameEn;
}

async function candidates(query, entry, atlas) {
  const body = JSON.stringify({
    textQuery: query,
    languageCode: atlas.lang,
    regionCode: atlas.region,
    maxResultCount: 10,
    locationBias: {
      circle: { center: { latitude: entry.lat, longitude: entry.lng }, radius: BIAS_M },
    },
  });
  for (let attempt = 0; ; attempt++) {
    if (calls >= MAX_CALLS) throw new Error(`call budget of ${MAX_CALLS} reached`);
    calls++;
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": KEY, "X-Goog-FieldMask": FIELDS },
      body,
    });
    if (res.ok) {
      const places = (await res.json()).places ?? [];
      return places
        .filter((p) => p.location)
        .map((p) => ({
          id: p.id,
          title: p.displayName?.text ?? "",
          lat: p.location.latitude,
          lng: p.location.longitude,
          dist: distanceKm(entry, { lat: p.location.latitude, lng: p.location.longitude }),
        }))
        .sort((a, b) => a.dist - b.dist);
    }
    // 400 means the request itself is wrong (bad key, API not enabled) — retrying cannot fix it.
    const detail = await res.text();
    if (res.status === 400 || res.status === 403 || attempt === BACKOFF_MS.length) {
      throw new Error(`HTTP ${res.status} for "${query}" — ${detail.slice(0, 160)}`);
    }
    await sleep(BACKOFF_MS[attempt]);
  }
}

const pick = (query, places) => pickPlace(query, places, { maxKm: MAX_KM, nearKm: NEAR_KM });

const ATLASES = [
  {
    cc: "vn",
    lang: "vi",
    region: "VN",
    entries: [...destinations, ...restaurants],
    overlaysFor: () => ({}),
  },
  {
    cc: "kr",
    lang: "ko",
    region: "KR",
    entries: [...destinationsKr, ...restaurantsKr],
    overlaysFor: (entry) => (entry.dishId ? restaurantI18nKr : destinationI18nKr),
  },
].filter((a) => !ONLY_COUNTRY || a.cc === ONLY_COUNTRY);

// Always start from what is already resolved: this script only ever adds and updates, so a
// `--limit=5` smoke test cannot silently throw the rest of the manifest away.
const known = JSON.parse(readFileSync(OUT, "utf8"));
const corpus = ATLASES.flatMap((atlas) => atlas.entries.map((entry) => ({ entry, atlas })));
const todo = (MISSING_ONLY ? corpus.filter(({ entry }) => !known[entry.id]) : corpus).slice(0, LIMIT);

const resolved = { ...known };
const unresolved = [];
const suspect = [];
let failures = 0;
let inARow = 0;

/** Sorted so a re-run diffs cleanly instead of reshuffling. */
const flush = () => {
  const sorted = Object.fromEntries(Object.keys(resolved).sort().map((k) => [k, resolved[k]]));
  writeFileSync(OUT, `${JSON.stringify(sorted, null, 2)}\n`);
};

console.log(`Resolving ${todo.length} entries against Google Places…\n`);

for (const { entry, atlas } of todo) {
  if (calls >= MAX_CALLS) {
    console.log(`\nStopped at the ${MAX_CALLS}-call budget. Re-run with --missing to continue.`);
    break;
  }
  const query = localName(entry, atlas);
  try {
    const found = pick(query, await candidates(query, entry, atlas));
    const { how, miss, far } = found;
    // Whatever was asked, the answer has to be the entry's own place.
    const hit = found.hit && relates(query, found.hit.title) ? found.hit : null;
    if (hit) {
      resolved[entry.id] = { id: hit.id, name: hit.title };
      console.log(`  ✓ ${entry.id.padEnd(32)} ${hit.title} (${how}, ${hit.dist.toFixed(2)} km)`);
    } else if (far) {
      suspect.push({ id: entry.id, google: miss });
      console.log(`  ! ${entry.id.padEnd(32)} "${miss.title}" is ${miss.dist.toFixed(1)} km away`);
    } else {
      unresolved.push({ id: entry.id, query });
      const why = miss ? `nearest "${miss.title}" ${miss.dist.toFixed(2)} km` : "no candidates";
      console.log(`  · ${entry.id.padEnd(32)} unmatched — ${query} → ${why}`);
    }
    inARow = 0;
  } catch (err) {
    failures++;
    inARow++;
    console.log(`  ✗ ${entry.id.padEnd(32)} ${err.message}`);
    if (inARow >= GIVE_UP_AFTER) {
      console.log(`\nGoogle keeps refusing. Stopping — fix the key or quota, then re-run --missing.`);
      break;
    }
  }
  // Checkpoint: these calls cost money, so a crash must not throw away what they already bought.
  if (calls % 50 === 0) flush();
  await sleep(DELAY_MS);
}

flush();

if (suspect.length) {
  console.log(`\nSame name, far pin — compare with OUR coordinate for these ${suspect.length}:`);
  for (const s of suspect) {
    console.log(
      `  ${s.id.padEnd(32)} ${s.google.dist.toFixed(1).padStart(5)} km off` +
        `  google "${s.google.title}" at ${s.google.lat.toFixed(5)},${s.google.lng.toFixed(5)}`,
    );
  }
}

const total = Object.keys(resolved).length;
console.log(
  `\n${total}/${corpus.length} entries have a Google place id` +
    `, ${corpus.length - total} fall back to a coordinate pin` +
    `${failures ? `, ${failures} request failures` : ""}.`,
);
console.log(`${calls} API calls used of the ${MAX_CALLS} allowed.`);
console.log(`Wrote ${OUT.pathname.split("/").slice(-4).join("/")}`);
if (failures) process.exitCode = 1;
