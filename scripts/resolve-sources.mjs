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
