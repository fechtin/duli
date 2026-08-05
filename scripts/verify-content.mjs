// Cross-check editorial destination data against an outside authority and report what looks
// wrong or stale. This does NOT edit content — it produces tasks/verify-<cc>-report.md so a
// human decides. Checks, per destination:
//
//   1. Article match  — resolve the place on Wikipedia (en, then ko/vi) by nameEn.
//   2. Coordinates    — haversine between our lng/lat and the article's; >1.5km warn, >5km error.
//   3. Provenance     — `ticket`/`openingHours` are volatile; flag them when `verifiedAt` is
//                       missing or older than STALE_MONTHS.
//   4. Numeric facts  — pull numbers out of `facts` and say whether they appear in the article
//                       extract. Advisory only: absence is a prompt to look, not a verdict.
//   5. Integrity      — duplicate ids/slugs, `nearby` pointing at nothing, gallery seeds with
//                       no entry in the image manifest.
//
// Pin a stubborn lookup by adding "<destination-id>": "<Wikipedia title>" to
// scripts/.verify-map.json (checked in, same idea as .curate-map.json).
//
// Run: npm run verify:kr   /   node --experimental-strip-types scripts/verify-content.mjs vn

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { destinations } from "../src/data/destinations.ts";
import { destinationsKr } from "../src/data/kr/index.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);

const ATLASES = {
  vn: { destinations, countryEn: "Vietnam", wikiLangs: ["en", "vi"] },
  kr: { destinations: destinationsKr, countryEn: "South Korea", wikiLangs: ["en", "ko"] },
};

const cc = (process.argv[2] ?? process.env.COUNTRY ?? "kr").toLowerCase();
const atlas = ATLASES[cc];
if (!atlas) {
  console.error(`[verify] unknown country "${cc}" (expected: ${Object.keys(ATLASES).join(", ")})`);
  process.exit(1);
}

const UA = "VietnamAtlas/1.0 (https://github.com/fechtin/duli; educational tourism map)";
const WARN_KM = 1.5;
const ERROR_KM = 5;
const STALE_MONTHS = 12;
const TODAY = process.env.TODAY ?? new Date().toISOString().slice(0, 10);

const PINS = existsSync(r("scripts/.verify-map.json"))
  ? JSON.parse(readFileSync(r("scripts/.verify-map.json"), "utf8"))
  : {};
const MANIFEST = existsSync(r("src/data/generated/image-manifest.json"))
  ? JSON.parse(readFileSync(r("src/data/generated/image-manifest.json"), "utf8"))
  : {};

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function getJson(url, tries = 4) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.status === 429 || res.status === 503) throw new Error(`throttled ${res.status}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      if (attempt === tries) return null;
      await sleep(400 * attempt * attempt);
    }
  }
  return null;
}

const api = (lang, params) =>
  `https://${lang}.wikipedia.org/w/api.php?${new URLSearchParams({ format: "json", origin: "*", ...params })}`;

/** Great-circle distance in km. */
function haversine(lng1, lat1, lng2, lat2) {
  const R = 6371;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

const STOP = new Set([
  "the", "of", "and", "a", "national", "park", "temple", "palace", "mountain", "island",
  "beach", "museum", "market", "village", "bridge", "tower", "cave", "lake", "river",
  "valley", "fortress", "shrine", "peak", "gate", "hall", "street", "south", "korea",
]);
/** Distinctive lowercase tokens of a place name — proper nouns, not the generic noun. */
const tokens = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 2 && !STOP.has(t));

/**
 * Does the article title plausibly refer to the same place? The leading token carries the
 * proper name, so it must be present, and half the distinctive tokens overall must match.
 * Both halves earn their keep: without the ratio "Expo Science Park & Expo Bridge" matches
 * "Expo 2010" in Shanghai; without the leading token "Jeonju Hanok Village" matches
 * "Bukchon Hanok Village" in Seoul.
 */
function titleMatches(title, nameEn) {
  const want = [...new Set(tokens(nameEn))];
  if (!want.length) return true; // nothing distinctive to test against — accept
  const have = new Set(tokens(title));
  if (!have.has(want[0])) return false;
  return want.filter((t) => have.has(t)).length / want.length >= 0.5;
}

/** Resolve a destination to { lang, title, lng, lat, extract } or null. */
async function resolveArticle(dest) {
  const pinned = PINS[dest.id];
  for (const lang of atlas.wikiLangs) {
    let title = null;

    if (pinned) {
      title = pinned;
    } else {
      const search = await getJson(
        api(lang, {
          action: "query",
          list: "search",
          srsearch: `${dest.nameEn} ${atlas.countryEn}`,
          srlimit: "5",
        }),
      );
      const hits = search?.query?.search ?? [];
      title = hits.find((h) => titleMatches(h.title, dest.nameEn))?.title ?? null;
      await sleep(120);
    }
    if (!title) continue;

    const page = await getJson(
      api(lang, {
        action: "query",
        titles: title,
        prop: "coordinates|extracts",
        explaintext: "1",
        exsectionformat: "plain",
        redirects: "1",
      }),
    );
    await sleep(120);
    const pages = page?.query?.pages ?? {};
    const p = Object.values(pages)[0];
    if (!p || p.missing !== undefined) continue;
    const coord = p.coordinates?.[0];
    // A place with no article of its own often redirects to its city or park. Those
    // coordinates describe the container, not the place, so they cannot judge ours.
    const broadened = !pinned && p.title !== title && !titleMatches(p.title, dest.nameEn);
    return {
      lang,
      title: p.title,
      searchedTitle: title,
      broadened,
      url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(p.title.replace(/ /g, "_"))}`,
      lng: coord?.lon ?? null,
      lat: coord?.lat ?? null,
      extract: (p.extract ?? "").replace(/\s+/g, " "),
      pinned: !!pinned,
    };
  }
  return null;
}

/** Numbers worth eyeballing: years, heights, counts. Skips prices/hours (checked separately). */
function numericFacts(dest) {
  const out = [];
  for (const f of dest.facts ?? []) {
    for (const m of f.matchAll(/\b(\d[\d.,]*)\s*(m|km|ha|năm|tuổi|bậc|cột|tầng)?\b/gi)) {
      const raw = m[1].replace(/[.,]$/, "");
      const n = Number(raw.replace(/[.,]/g, ""));
      if (!Number.isFinite(n) || n < 10) continue;
      out.push({ fact: f, value: raw, normalized: n, unit: m[2] ?? "" });
    }
  }
  return out;
}

/** Does the article extract mention this number in any common thousands formatting? */
function extractMentions(extract, n) {
  if (!extract) return false;
  const plain = String(n);
  const variants = new Set([plain, n.toLocaleString("en-US"), n.toLocaleString("de-DE")]);
  const stripped = extract.replace(/[ ]/g, " ");
  for (const v of variants) if (stripped.includes(v)) return true;
  return false;
}

function monthsSince(iso) {
  if (!iso) return Infinity;
  const then = new Date(`${iso}T00:00:00Z`);
  const now = new Date(`${TODAY}T00:00:00Z`);
  if (Number.isNaN(then.getTime())) return Infinity;
  return (now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
}

// ── integrity checks that need no network ──
function integrityIssues(places) {
  const issues = [];
  const byId = new Map();
  const bySlug = new Map();
  for (const d of places) {
    if (byId.has(d.id)) issues.push(`duplicate id \`${d.id}\``);
    if (bySlug.has(d.slug)) issues.push(`duplicate slug \`${d.slug}\``);
    byId.set(d.id, d);
    bySlug.set(d.slug, d);
  }
  for (const d of places) {
    for (const n of d.nearby ?? []) {
      if (!bySlug.has(n) && !byId.has(n)) issues.push(`\`${d.id}\`.nearby → \`${n}\` does not exist`);
    }
    for (const g of d.gallery ?? []) {
      if (!MANIFEST[g.seed]) issues.push(`\`${d.id}\` gallery seed \`${g.seed}\` has no image in the manifest`);
    }
  }
  return issues;
}

// ── run ──
const places = atlas.destinations;
console.log(`[verify] ${cc}: ${places.length} destinations, today=${TODAY}`);

const rows = [];
for (let i = 0; i < places.length; i++) {
  const d = places[i];
  const art = await resolveArticle(d);
  const row = { d, art, level: "ok", notes: [] };

  if (!art) {
    row.level = "warn";
    row.notes.push("no Wikipedia article resolved — pin one in scripts/.verify-map.json");
  } else if (art.broadened) {
    row.level = "warn";
    row.notes.push(
      `"${art.searchedTitle}" redirects to the broader [${art.title}](${art.url}) — coordinates not comparable; pin a better article in scripts/.verify-map.json`,
    );
  } else if (art.lng == null) {
    row.notes.push(`article [${art.title}](${art.url}) has no coordinates — position unchecked`);
  } else {
    const km = haversine(d.lng, d.lat, art.lng, art.lat);
    row.km = km;
    if (km > ERROR_KM) {
      row.level = "error";
      row.notes.push(`coordinates off by **${km.toFixed(1)} km** vs [${art.title}](${art.url}) (${art.lat}, ${art.lng})`);
    } else if (km > WARN_KM) {
      row.level = row.level === "error" ? "error" : "warn";
      row.notes.push(`coordinates off by ${km.toFixed(1)} km vs [${art.title}](${art.url})`);
    }
  }

  const volatile = [];
  if (d.ticket) volatile.push(`ticket "${d.ticket}"`);
  if (d.openingHours) volatile.push(`openingHours "${d.openingHours}"`);
  const age = monthsSince(d.verifiedAt);
  if (volatile.length && age > STALE_MONTHS) {
    if (row.level === "ok") row.level = "warn";
    row.notes.push(
      d.verifiedAt
        ? `${volatile.join(", ")} last verified ${d.verifiedAt} (${Math.round(age)} months ago)`
        : `${volatile.join(", ")} — never verified (no \`verifiedAt\`)`,
    );
  }

  if (art?.extract) {
    const unseen = numericFacts(d).filter((f) => !extractMentions(art.extract, f.normalized));
    if (unseen.length) {
      row.notes.push(
        `numbers not found in the article (check by hand): ${unseen.map((f) => `${f.value}${f.unit}`).join(", ")}`,
      );
    }
  }

  rows.push(row);
  process.stdout.write(
    `\r[verify] ${i + 1}/${places.length} ${row.level === "ok" ? "·" : row.level.toUpperCase()}          `,
  );
}
process.stdout.write("\n");

const errors = rows.filter((r) => r.level === "error");
const warns = rows.filter((r) => r.level === "warn");
const integrity = integrityIssues(places);
const unverified = places.filter((p) => (p.ticket || p.openingHours) && !p.verifiedAt);

const section = (title, list) =>
  list.length
    ? `## ${title}\n\n${list
        .map(
          (r) =>
            `- **${r.d.id}** (${r.d.provinceSlug})\n${r.notes.map((n) => `  - ${n}`).join("\n")}`,
        )
        .join("\n")}\n`
    : `## ${title}\n\n_none_\n`;

const report = `# Verification report — ${cc.toUpperCase()} atlas

Generated ${TODAY} by \`scripts/verify-content.mjs\`. Authority: Wikipedia (${atlas.wikiLangs.join(", ")}).
This file is advisory — nothing here edits content.

| | |
|---|---|
| Destinations checked | ${places.length} |
| Coordinate errors (>${ERROR_KM} km) | ${errors.length} |
| Warnings | ${warns.length} |
| Never verified (\`ticket\`/\`openingHours\` present, no \`verifiedAt\`) | ${unverified.length} |
| Integrity issues | ${integrity.length} |

${section(`Errors — coordinates more than ${ERROR_KM} km out`, errors)}
${section("Warnings", warns)}
## Integrity

${integrity.length ? integrity.map((i) => `- ${i}`).join("\n") : "_none_"}

## Clean

${
  rows
    .filter((r) => r.level === "ok" && !r.notes.length)
    .map((r) => `- ${r.d.id}${r.km != null ? ` (${r.km.toFixed(2)} km)` : ""}`)
    .join("\n") || "_none_"
}
`;

const out = r(`tasks/verify-${cc}-report.md`);
writeFileSync(out, report);
console.log(
  `[verify] ${errors.length} error(s), ${warns.length} warning(s), ${integrity.length} integrity issue(s) -> tasks/verify-${cc}-report.md`,
);
process.exitCode = errors.length || integrity.length ? 1 : 0;
