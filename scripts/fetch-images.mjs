// Fetch openly-licensed, NAME-VERIFIED photos for every destination and optimize to WebP.
//
// Rewritten 2026-08-16 onto scripts/lib/image-sources.mjs. The version before it ranked
// candidates itself and — crucially — accepted a file for being *geotagged near* the place even
// when nothing about it named the place. That produced 13 wrong heroes out of 14 on its last
// run: a shipyard for the whale village, a high school, an IDF house-damage photo for Nhà Trăm
// Cột, Côn Đảo prison for Sơn La prison. The failure is structural: a destination is still
// unphotographed precisely *because* nothing correct is geotagged there, so geosearch has only
// neighbours left to return. Proximity is now a tiebreaker among files that already name the
// place (`commonsGeo`), never evidence on its own.
//
// The other thing the lib brings is one serialised request queue with a per-host gap. An
// unpaced run once got this machine 429'd on every Wikimedia endpoint for hours.
//
// Source order per destination, first hit wins:
//   exact Wikipedia title (EN then local) → Wikipedia search → Wikidata P18 → Commons category
//   → Commons geosearch (name-validated) → Commons full-text → Openverse
//
// Writes src/data/generated/image-manifest.json: { src, credit, license, sourceTitle, sourceUrl,
// via, width } per gallery seed.
//
// Modes:
//   npm run images:fetch                 → fill only seeds with no image yet (Vietnam)
//   npm run images:fetch -- kr           → same, for the Korea atlas
//   LIMIT=8                              → stop after 8 destinations (sampling before a full run)
//   ONLY=slug-a,slug-b                   → restrict to these destination ids
//   REFETCH=scripts/.refetch-seeds.json  → re-fetch exactly the listed seeds (overwrite)
//   FORCE=1                              → re-fetch every seed
//   DRY=1                                → resolve and report, download nothing, write nothing

import { writeFileSync, mkdirSync, existsSync, readFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import { destinations } from "../src/data/destinations.ts";
import { destinationsKr } from "../src/data/kr/index.ts";
import {
  wikiTitle, wikiLead, wikidataImage, commonsCategory, commonsGeo, commonsSearch, openverse,
  commonsAttribution, downloadWebp, sleep, tokens,
} from "./lib/image-sources.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);

const cc = (process.argv[2] ?? process.env.COUNTRY ?? "vn").toLowerCase();
// `qid` is the Wikidata country entity, used by wikidataImage to reject a same-named place
// abroad on a FACT about the subject rather than on how its title reads.
const ATLASES = {
  vn: { destinations, countryEn: "Vietnam", wikiLangs: ["en", "vi"], qid: "Q881" },
  kr: { destinations: destinationsKr, countryEn: "South Korea", wikiLangs: ["en", "ko"], qid: "Q884" },
};
const atlas = ATLASES[cc];
if (!atlas) {
  console.error(`[fetch-images] unknown country "${cc}" (expected: ${Object.keys(ATLASES).join(", ")})`);
  process.exit(1);
}

const geo = JSON.parse(readFileSync(r(`src/data/generated/geo-meta.${cc}.json`), "utf8"));
const provinceEn = new Map(geo.provinces.map((p) => [p.slug, p.nameEn]));
const OUT_DIR = r("public/img");
const manifestPath = r("src/data/generated/image-manifest.json");

// Words that never identify a *place*. Kept here rather than in the shared STOP set because
// several are ordinary food words too — "chua" is `chùa` (pagoda) here and *sour* in a dish name.
const PLACE_STOP = new Set([
  "national", "park", "lake", "mountain", "cave", "waterfall", "island", "temple", "pagoda",
  "beach", "village", "bay", "valley", "market", "hill", "hills", "pass", "river", "street",
  "museum", "bridge", "palace", "fortress", "tower", "garden", "town", "city", "square",
  "peak", "site", "complex", "old", "quarter", "ancient", "royal", "grand", "great", "new",
  "nui", "hang", "bai", "den", "chua", "thac", "song", "dao", "deo", "cua", "khu", "cao",
  "nguyen", "ho", "cung", "bien", "thanh", "lang", "cho", "cong", "vien", "pho", "dinh",
  "thap", "hoa", "quoc", "gia", "vuon", "mo", "tranh", "khac", "rung", "tre", "doi", "che",
  "duong", "ham", "bao", "tang", "trung", "tam", "khach", "san", "diem",
]);

// ── Concurrency guard ────────────────────────────────────────────────────────
// A run from an earlier session once kept going for hours, writing wrong photos, and would
// have clobbered the manifest from its stale in-memory copy on exit. Two fetchers must never
// share the Wikimedia budget or this file.
const LOCK = r("scripts/.images.lock");
if (existsSync(LOCK) && !process.env.FORCE_UNLOCK) {
  console.error(`[fetch-images] another run holds ${LOCK} (pid ${readFileSync(LOCK, "utf8").trim()}).`);
  console.error("If you are sure it is dead: rm scripts/.images.lock");
  process.exit(1);
}

const opts = { place: true, stop: PLACE_STOP, minLen: 3 };

// The 038 venue types are modern businesses and city features whose names are ordinary English
// words, so a name match alone proves nothing: "The Note Coffee" (Hà Nội) matched "Ghost Note
// Coffee, Seattle" and a stray Seattle street photo, both perfectly, on the tokens note+coffee.
// Heritage and landscape names carry their own distinctive Vietnamese tokens and need no help;
// these do, so free-text sources must also name the province or the country.
const VENUE_TYPES = new Set(["cafe", "nightlife", "street", "viewpoint", "themepark"]);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Ordinary English words that name a venue without identifying one. A name built only from
// these could be anywhere on earth, which is the whole failure: "The Note Coffee" is note+coffee.
// A name that keeps even one Vietnamese token ("Hải Vân", "Bitexco", "Mường Hoa") is already
// distinctive and must NOT be anchored — Hải Vân straddles two provinces, so demanding the title
// say "Da Nang" would reject correctly-named photos captioned from the Huế side, or captioned
// with nothing but the pass's own name.
const GENERIC_EN = new Set([
  "coffee", "cafe", "tea", "house", "bar", "club", "lounge", "rooftop", "deck", "observation",
  "landmark", "walking", "night", "train", "sky", "view", "point", "central", "grand", "plaza",
  "mall", "center", "centre", "wonders", "world", "land", "resort", "note", "corner", "hidden",
]);

/** A geographic anchor the title has to carry before a free-text hit can win. */
function geoCue(d) {
  if (!VENUE_TYPES.has(d.type)) return undefined;
  // Only anchor when the name has nothing distinctive left to match on.
  const distinctive = tokens(`${d.nameEn} ${d.name}`, opts).filter((t) => !GENERIC_EN.has(t));
  if (distinctive.length) return undefined;
  const prov = provinceEn.get(d.provinceSlug);
  const words = [prov, d.provinceSlug.replace(/-/g, " "), atlas.countryEn, cc === "vn" ? "viet ?nam" : "hanguk"]
    .filter(Boolean)
    .map(esc);
  return new RegExp(words.join("|"), "i");
}

/** Candidate sources for one destination, cheapest and most trustworthy first. */
function stepsFor(d) {
  const prov = provinceEn.get(d.provinceSlug) ?? atlas.countryEn;
  const cue = geoCue(d);
  const free = cue ? { ...opts, cue } : opts; // free-text sources, optionally geo-anchored
  const steps = [];
  // Exact article title needs no name validation — it cannot be about something else — and it
  // uses the REST endpoint, which keeps answering when w/api.php is throttled.
  for (const lang of atlas.wikiLangs) steps.push(() => wikiTitle(lang, d.nameEn, opts));
  steps.push(() => wikiTitle(atlas.wikiLangs[1], d.name, opts));
  for (const lang of atlas.wikiLangs) steps.push(() => wikiLead(lang, `${d.nameEn} ${prov}`, opts));
  // Curated pick, and the only step that validates on a fact (P17) rather than on the title.
  steps.push(() => wikidataImage(d.nameEn, { ...opts, country: atlas.qid, langs: atlas.wikiLangs }));
  steps.push(() => commonsCategory(d.nameEn, free));
  steps.push(() => commonsGeo(d.lat, d.lng, d.nameEn, free));
  steps.push(() => commonsSearch(`${d.nameEn} ${prov}`, free));
  steps.push(() => commonsSearch(d.nameEn, free));
  steps.push(() => openverse(`${d.nameEn} ${prov}`, free));
  steps.push(() => openverse(d.nameEn, free));
  return steps;
}

/** Walk the chain collecting up to `need` distinct picks nothing else has claimed. */
async function collect(d, need, used) {
  const picks = [];
  for (const step of stepsFor(d)) {
    if (picks.length >= need) break;
    let pick = null;
    try {
      pick = await step();
    } catch {
      continue;
    }
    if (!pick) continue;
    const key = pick.sourceTitle || pick.url;
    if (used.has(key) || picks.some((p) => (p.sourceTitle || p.url) === key)) continue;
    picks.push(pick);
  }
  return picks;
}

// ── Entry ────────────────────────────────────────────────────────────────────
const dry = process.env.DRY === "1";
const force = process.env.FORCE === "1";
const limit = Number(process.env.LIMIT ?? 0);
const only = process.env.ONLY ? new Set(process.env.ONLY.split(",").map((s) => s.trim())) : null;
const refetchPath = process.env.REFETCH;
const refetchSeeds =
  refetchPath && existsSync(r(refetchPath)) ? new Set(JSON.parse(readFileSync(r(refetchPath), "utf8"))) : null;

mkdirSync(OUT_DIR, { recursive: true });
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
const fillFn = force ? () => true : refetchSeeds ? (s) => refetchSeeds.has(s) : (s) => !manifest[s];

let places = atlas.destinations.filter((d) => (d.gallery ?? []).some((g) => fillFn(g.seed)));
if (only) places = places.filter((d) => only.has(d.id));
if (limit) places = places.slice(0, limit);

// Reserve source titles already kept, so a refetch never duplicates one onto another seed.
const used = new Set();
for (const [seed, m] of Object.entries(manifest)) {
  if (m.sourceTitle && !fillFn(seed)) used.add(m.sourceTitle);
}

if (!dry) writeFileSync(LOCK, String(process.pid));
const releaseLock = () => { try { if (!dry) unlinkSync(LOCK); } catch {} };
process.on("exit", releaseLock);
process.on("SIGINT", () => { releaseLock(); process.exit(130); });

const mode = dry ? "DRY" : force ? "FORCE all" : refetchSeeds ? `REFETCH ${refetchSeeds.size}` : "fill missing";
console.log(`[fetch-images] ${cc.toUpperCase()} · ${places.length} destinations · ${mode}`);

const stats = { done: 0, images: 0, failed: 0, unfilled: [], via: {} };
let sinceSave = 0;

for (const d of places) {
  const toFill = (d.gallery ?? []).map((g) => g.seed).filter(fillFn);
  const picks = await collect(d, toFill.length, used);

  for (let i = 0; i < toFill.length; i++) {
    const seed = toFill[i];
    const pick = picks[i];
    if (!pick) { stats.unfilled.push(seed); continue; }
    if (dry) {
      console.log(`  ${d.nameEn}\n    ${seed} ← [${pick.via}] ${pick.sourceTitle}`);
      used.add(pick.sourceTitle || pick.url);
      stats.images++;
      stats.via[pick.via] = (stats.via[pick.via] ?? 0) + 1;
      continue;
    }
    try {
      const file = `${OUT_DIR}/${seed}.webp`;
      await downloadWebp(pick.url, file);
      if (pick.credit === undefined || pick.license === undefined) {
        const attr = await commonsAttribution(pick.file);
        pick.credit ??= attr.credit;
        pick.license ??= attr.license;
      }
      const meta = await sharp(file).metadata();
      used.add(pick.sourceTitle || pick.url);
      manifest[seed] = {
        src: `/img/${seed}.webp`,
        credit: pick.credit ?? "",
        license: pick.license || "Wikimedia Commons",
        sourceTitle: pick.sourceTitle ?? "",
        sourceUrl: pick.sourceUrl ?? "",
        via: pick.via,
        width: meta.width ?? 0,
      };
      stats.images++;
      stats.via[pick.via] = (stats.via[pick.via] ?? 0) + 1;
      sinceSave++;
    } catch {
      stats.failed++;
    }
  }

  stats.done++;
  // Save often. The old save-only-at-the-end behaviour is exactly what orphaned 35 downloaded
  // files when an earlier run was interrupted.
  if (!dry && sinceSave >= 5) {
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 0));
    sinceSave = 0;
  }
  if (!dry) process.stdout.write(`\r  ${stats.done}/${places.length} · ${stats.images} imgs · ${stats.unfilled.length} unfilled  `);
  await sleep(60);
}

if (!dry) writeFileSync(manifestPath, JSON.stringify(manifest, null, 0));
const covered = atlas.destinations.filter((d) => (d.gallery ?? []).some((g) => manifest[g.seed])).length;
console.log(`\n[fetch-images] ${stats.images} picks · ${stats.failed} failed · ${stats.unfilled.length} unfilled`);
console.log(`[fetch-images] via: ${JSON.stringify(stats.via)}`);
console.log(`[fetch-images] coverage: ${covered}/${atlas.destinations.length} ${cc.toUpperCase()} destinations`);
