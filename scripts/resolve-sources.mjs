// Resolve an authoritative source + coordinates for every VN destination that has no
// `verifiedAt`, so the legacy entries can be given the same provenance the 033 batch has.
//
// Resolution chain, first hit wins (same order the task doc mandates):
//   1. a pin in scripts/.verify-map.json          (hand-curated, always trusted)
//   2. vi.wikipedia by `name`                     (exact title, then search)
//   3. en.wikipedia by `nameEn`
//   4. Wikidata P625 via the viwiki sitelink
// A hit only counts when the resolved article carries coordinates AND the title shares a
// token with the destination name — that guards against the failure this script exists to
// fix, where verify-content.mjs matched "Tràng An" to the article for "Nha Trang".
//
// Writes tasks/resolve-sources.json. It does NOT edit content: a human reviews the table,
// then scripts/apply-sources.mjs writes the accepted rows back.
//
// Run: node --experimental-strip-types scripts/resolve-sources.mjs
//
// ── Candidate mode (038) ─────────────────────────────────────────────────────
// Same chain, but for places that are NOT in the atlas yet — the hub-depth batch has to
// resolve ~150 new coordinates before a single entry can be authored, and 033's rule stands:
// a candidate whose coordinate cannot be looked up gets REPLACED, never guessed, because
// image sourcing geosearches around lng/lat and a wrong coordinate pulls a wrong photo.
//
//   node --experimental-strip-types scripts/resolve-sources.mjs --candidates tasks/038-candidates.json
//
// Input rows: {id, name, nameEn, provinceSlug, query?}  (`query` overrides the search term)
// Output:     tasks/038-coords.json
//
// Two things differ from atlas mode:
//   * There is no existing coordinate to measure drift against, so the sanity check is
//     distance from the PROVINCE CENTROID (geo-meta.vn.json) instead — a "Đà Nẵng" cafe
//     that resolves into Hà Nội is rejected on exactly the same principle.
//   * Two extra steps run after Wikidata: Nominatim, then Overpass. Wikipedia has an article
//     for Ngũ Hành Sơn; it has nothing for Café Giảng or a walking street, and OSM has both.
//     Nominatim's terms require ≤1 req/s and an identifying UA — hence the pacing below.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { destinations } from "../src/data/destinations.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const r = (p) => resolve(__dirname, "..", p);

const UA = "VietnamAtlas/1.0 (https://github.com/fechtin/duli; educational tourism map)";
const PINS = existsSync(r("scripts/.verify-map.json"))
  ? JSON.parse(readFileSync(r("scripts/.verify-map.json"), "utf8"))
  : {};

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function getJson(url, tries = 4) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      const text = await res.text();
      if (!text.startsWith("{")) throw new Error("throttled");
      return JSON.parse(text);
    } catch {
      if (i === tries) return null;
      await sleep(4000 * i);
    }
  }
}

// Strip diacritics and punctuation so "Thác Bản Giốc" and "Ban Gioc Waterfall" share tokens.
const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ");

const STOP = new Set([
  "thac", "nui", "chua", "den", "dao", "ho", "bai", "khu", "di", "tich", "vuon", "quoc", "gia",
  "waterfall", "mountain", "pagoda", "temple", "island", "lake", "beach", "national", "park",
  "cave", "dong", "bien", "sea", "the", "of", "and", "cua", "phu", "thanh", "pho", "co",
]);
const tokens = (s) => new Set(norm(s).split(/\s+/).filter((t) => t.length > 2 && !STOP.has(t)));

// Beyond this a same-name article is a different place, not a drifted coordinate:
// "Chùa Vĩnh Nghiêm" resolves to a pagoda in Ho Chi Minh City 1,164km from the Bac Giang one.
const MAX_DRIFT_KM = 50;

function titleMatches(dest, title) {
  const want = new Set([...tokens(dest.name), ...tokens(dest.nameEn)]);
  const got = tokens(title);
  for (const t of got) if (want.has(t)) return true;
  // Short names ("Sa Pa", "Đền Đô", "Núi Bà Đen") lose every token to the length and
  // stop-word filters, so fall back to comparing the normalised strings directly.
  if (want.size === 0 || got.size === 0) {
    const a = norm(dest.name).replace(/\s+/g, " ").trim();
    const b = norm(title).replace(/\s+/g, " ").trim();
    return a.includes(b) || b.includes(a);
  }
  return false;
}

async function articleCoords(lang, title) {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=coordinates&redirects=1&format=json&titles=${encodeURIComponent(title)}`;
  const j = await getJson(url);
  const page = j && Object.values(j.query?.pages ?? {})[0];
  if (!page || page.missing !== undefined) return null;
  const c = page.coordinates?.[0];
  return c ? { title: page.title, lng: c.lon, lat: c.lat, lang } : null;
}

async function wikidataCoords(title) {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&sites=viwiki&titles=${encodeURIComponent(title)}&props=claims&format=json`;
  const j = await getJson(url);
  const ent = j && Object.values(j.entities ?? {})[0];
  const c = ent?.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
  return c ? { title, lng: c.longitude, lat: c.latitude, lang: "wikidata", qid: ent.id } : null;
}

// Nominatim and Overpass answer with arrays / objects and, when throttled, with HTML.
async function getAny(url, init, tries = 4) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { ...init, headers: { "User-Agent": UA, ...init?.headers } });
      const text = await res.text();
      if (!/^[[{]/.test(text)) throw new Error("throttled");
      return JSON.parse(text);
    } catch {
      if (i === tries) return null;
      await sleep(4000 * i);
    }
  }
}

/**
 * OSM by name, biased toward the province.
 * Validated against `namedetails.name`, never `display_name`: the full address contains the
 * province, so scoring against it would let any hit in the right province pass on the
 * province's own name — the same trap that put a shrub on a duck dish in the image pipeline.
 */
async function nominatimCoords(name, [cLng, cLat]) {
  const box = [cLng - 1.5, cLat + 1.5, cLng + 1.5, cLat - 1.5].join(",");
  const url =
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=vn` +
    `&namedetails=1&viewbox=${box}&q=${encodeURIComponent(name)}`;
  const list = await getAny(url);
  if (!Array.isArray(list)) return null;
  for (const h of list) {
    const label = h.namedetails?.name ?? h.name;
    if (!label) continue;
    return {
      title: label,
      lng: Number(h.lon),
      lat: Number(h.lat),
      lang: "osm",
      url: `https://www.openstreetmap.org/${h.osm_type}/${h.osm_id}`,
    };
  }
  return null;
}

/** Last resort: Overpass name regex in a radius around the province centroid. */
async function overpassCoords(name, [cLng, cLat]) {
  const safe = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const q = `[out:json][timeout:30];nwr(around:100000,${cLat},${cLng})["name"~"${safe}",i];out center 5;`;
  const j = await getAny("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(q)}`,
  });
  const el = j?.elements?.find((e) => e.tags?.name && (e.lat ?? e.center?.lat));
  if (!el) return null;
  return {
    title: el.tags.name,
    lng: el.lon ?? el.center.lon,
    lat: el.lat ?? el.center.lat,
    lang: "osm",
    url: `https://www.openstreetmap.org/${el.type}/${el.id}`,
  };
}

const R = 6371;
const rad = (x) => (x * Math.PI) / 180;
function km(aLat, aLng, bLat, bLng) {
  const dLat = rad(bLat - aLat), dLng = rad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const wikiUrl = (hit) =>
  hit.lang === "wikidata"
    ? `https://www.wikidata.org/wiki/${hit.qid}`
    : `https://${hit.lang}.wikipedia.org/wiki/${encodeURIComponent(hit.title.replace(/ /g, "_"))}`;

// ── Candidate mode ───────────────────────────────────────────────────────────
const candIdx = process.argv.indexOf("--candidates");
if (candIdx !== -1) {
  const file = process.argv[candIdx + 1];
  if (!file) throw new Error("--candidates needs a JSON file path");
  const cands = JSON.parse(readFileSync(r(file), "utf8"));
  const geo = JSON.parse(readFileSync(r("src/data/generated/geo-meta.vn.json"), "utf8"));
  const centroid = Object.fromEntries(geo.provinces.map((p) => [p.slug, p.centroid]));
  const taken = new Set(destinations.map((d) => d.id));

  // Generous on purpose. Nghệ An is ~200km across and Phú Quốc sits far off the Kiên Giang
  // mainland centroid, so a tight radius would reject good hits. The failure this guards
  // against — resolving to a same-named place in another city — is 300km+ in practice.
  const MAX_PROVINCE_KM = 200;
  /** Past this, a hit is still accepted but printed for a human to confirm. See `needsReview`. */
  const SOFT_REVIEW_KM = 70;

  const out = [];
  let n = 0;
  for (const c of cands) {
    const cen = centroid[c.provinceSlug];
    if (!cen) throw new Error(`unknown provinceSlug "${c.provinceSlug}" on ${c.id}`);
    const search = c.query ?? c.name;
    const self = { name: c.name, nameEn: c.nameEn ?? c.name };

    let hit = await articleCoords("vi", search);
    if (!hit) { await sleep(2500); hit = await articleCoords("en", self.nameEn); }
    if (!hit) { await sleep(2500); hit = await wikidataCoords(search); }
    if (!hit) { await sleep(1200); hit = await nominatimCoords(search, cen); }
    if (!hit) { await sleep(1200); hit = await overpassCoords(c.name, cen); }

    const far = hit ? km(cen[1], cen[0], hit.lat, hit.lng) : null;
    const named = hit ? titleMatches(self, hit.title) : false;
    const ok = hit && named && far <= MAX_PROVINCE_KM;

    out.push({
      id: c.id,
      name: c.name,
      province: c.provinceSlug,
      duplicateOfAtlasEntry: taken.has(c.id) || undefined,
      resolved: ok
        ? { lng: Number(hit.lng.toFixed(4)), lat: Number(hit.lat.toFixed(4)), via: hit.lang, title: hit.title, url: hit.url ?? wikiUrl(hit) }
        : null,
      kmFromProvinceCentroid: hit ? Number(far.toFixed(1)) : null,
      // A hit can pass both guards and still be the wrong place. The 200km ceiling has to be
      // generous enough for Phú Quốc (110-140km off the Kiên Giang mainland centroid), and that
      // same slack let a "Vân Long" in Đông Anh and a "Thái Vi" street both resolve into HÀ NỘI
      // for Ninh Bình candidates — ~100km away, well inside the ceiling. So anything past the
      // soft threshold is flagged for a human rather than trusted.
      needsReview: ok && far > SOFT_REVIEW_KM ? `${far.toFixed(0)}km from centroid — confirm this is the right place` : undefined,
      rejected: hit && !ok ? `${hit.title} (${hit.lang}, ${far.toFixed(0)}km, ${named ? "too far" : "name mismatch"})` : null,
    });

    n++;
    process.stdout.write(`\r  ${n}/${cands.length}`);
    await sleep(1500);
  }

  // Output name derives from the input so a retry batch never clobbers the first pass —
  // resolving is slow (~6s/row) and losing 20 good rows to re-run 9 bad ones is pure waste.
  const outPath = file.replace(/(-candidates)?\.json$/, "-coords.json");
  writeFileSync(r(outPath), JSON.stringify(out, null, 2) + "\n");
  const got = out.filter((x) => x.resolved);
  const review = out.filter((x) => x.needsReview);
  console.log(
    `\n[resolve] ${got.length}/${out.length} tra được toạ độ · ${out.length - got.length} phải ĐỔI ứng viên` +
      `\n          → ${outPath}`,
  );
  if (review.length) {
    console.log(`\n[resolve] ${review.length} điểm CẦN XEM BẰNG MẮT (xa centroid tỉnh):`);
    for (const x of review) console.log(`   ${x.id} — ${x.kmFromProvinceCentroid}km — "${x.resolved.title}"`);
  }
  process.exit(0);
}

const targets = destinations.filter((d) => !d.verifiedAt);
const rows = [];
let done = 0;

for (const d of targets) {
  let hit = null;
  const pin = PINS[d.id];
  if (pin) hit = (await articleCoords("vi", pin)) ?? (await articleCoords("en", pin));
  if (!hit) hit = await articleCoords("vi", d.name);
  if (!hit) { await sleep(2500); hit = await articleCoords("en", d.nameEn); }
  if (!hit) { await sleep(2500); hit = await wikidataCoords(d.name); }

  // A hit whose title shares no token with the destination is the wrong article; so is one
  // that matches by name but sits on the other side of the country.
  const drift = hit ? km(d.lat, d.lng, hit.lat, hit.lng) : null;
  const matched =
    hit && (pin || titleMatches(d, hit.title)) && drift <= MAX_DRIFT_KM;
  const farNamesake = hit && !matched && drift > MAX_DRIFT_KM ? `${hit.title} (${drift.toFixed(0)}km)` : null;
  rows.push({
    id: d.id,
    name: d.name,
    province: d.provinceSlug,
    atlas: [d.lng, d.lat],
    resolved: hit && matched ? { title: hit.title, url: wikiUrl(hit), lng: hit.lng, lat: hit.lat } : null,
    driftKm: matched ? Number(drift.toFixed(1)) : null,
    rejectedTitle: hit && !matched ? (farNamesake ?? hit.title) : null,
    ticket: d.ticket || "",
    openingHours: d.openingHours || "",
  });

  done++;
  process.stdout.write(`\r  ${done}/${targets.length}`);
  await sleep(2500);
}

writeFileSync(r("tasks/resolve-sources.json"), JSON.stringify(rows, null, 2) + "\n");

const ok = rows.filter((x) => x.resolved);
const drift = ok.filter((x) => x.driftKm > 5);
console.log(`\n[resolve] ${ok.length}/${rows.length} có nguồn khớp tên · ${drift.length} lệch >5km · ${rows.length - ok.length} không tra được`);
