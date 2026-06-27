// Fetch real, openly-licensed, LOCATION-VERIFIED photos for every destination and
// optimize to WebP. The selection strategy, in priority order:
//   1) Commons GEOSEARCH around the destination's lat/lng (escalating radius). Geotagged
//      photos are the strongest guarantee that the image was actually taken at the place.
//   2) Commons text search by name — accepted ONLY if the file's title/categories contain
//      a name token (guards against same-named places abroad and unrelated junk).
//   3) Wikipedia lead image — accepted ONLY if the resolved article title matches a name token.
// Every candidate is filtered to be a real PHOTO (rejects maps, flags, logos, manuscripts,
// drawings, specimens, SVG, low-res). Picks are de-duplicated globally by Commons file title.
// Writes src/data/generated/image-manifest.json with full provenance per seed:
//   { src, credit, license, sourceTitle, sourceUrl, via, width }
// Modes:
//   npm run images:fetch                 → fill only seeds that have no image yet
//   REFETCH=scripts/.refetch-seeds.json  → re-fetch exactly the listed seeds (overwrite)
//   FORCE=1                              → re-fetch every seed
// Resumable + rate-limited. Run: npm run images:fetch

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import { destinations } from "../src/data/destinations.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);
const geo = JSON.parse(readFileSync(r("src/data/generated/geo-meta.json"), "utf8"));
const provinceEn = new Map(geo.provinces.map((p) => [p.slug, p.nameEn]));

const UA = "VietnamAtlas/1.0 (https://github.com/fechtin/duli; educational tourism map)";
const OUT_DIR = r("public/img");
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const stripHtml = (s) => (s ? s.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim().slice(0, 120) : "");

// Anything that is NOT a representative photo of a place. Matched against title + categories.
const JUNK =
  /\b(map|maps|carte|mapa|karte|plan|diagram|schema|chart|flag|flags|bandera|drapeau|banner|logo|emblem|coat of arms|escudo|seal|stamp|banknote|document|documents|manuscript|sắc phong|woodblock|mộc bản|poster|drawing|drawings|painting|paintings|engraving|gravure|illustration|sketch|icon|specimen|herbarium|insect|moth|butterfly|beetle|portrait of|svg|iss|astronaut|satellite|space station|view of earth|from space|nasa|landsat|sentinel|signboard|signpost|noticeboard|information board|tấm bia|bảng giới thiệu)\b/i;

async function getJson(url, tries = 4) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.status === 429 || res.status === 503) throw new Error(`throttled ${res.status}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`http ${res.status}`);
      const j = await res.json();
      if (j.error?.code === "maxlag") throw new Error("maxlag");
      return j;
    } catch (e) {
      if (attempt === tries) return null;
      await sleep(400 * attempt + 200);
    }
  }
}

const commonsApi = (params) =>
  getJson(`https://commons.wikimedia.org/w/api.php?${new URLSearchParams({ format: "json", maxlag: "5", ...params })}`);

// ── Candidate sources ──
async function geoTitles(lat, lng, radius, limit = 40) {
  const j = await commonsApi({
    action: "query",
    list: "geosearch",
    gscoord: `${lat}|${lng}`,
    gsradius: String(radius),
    gsnamespace: "6",
    gslimit: String(limit),
  });
  return (j?.query?.geosearch ?? []).map((s) => s.title);
}

async function textTitles(query, limit = 12) {
  const j = await commonsApi({ action: "query", list: "search", srnamespace: "6", srsearch: query, srlimit: String(limit) });
  return (j?.query?.search ?? []).map((s) => s.title);
}

async function wikiLeadCandidate(queries, tokens, langs = ["en", "vi"]) {
  for (const lang of langs) {
    for (const q of queries) {
      const s = await getJson(
        `https://${lang}.wikipedia.org/w/api.php?${new URLSearchParams({ format: "json", action: "query", list: "search", srsearch: q, srlimit: "1" })}`,
      );
      const title = s?.query?.search?.[0]?.title;
      if (!title || !matchesTokens(title, tokens)) continue; // article must actually be this place
      const j = await getJson(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
      if (!j || j.type === "disambiguation") continue;
      const src = j.originalimage?.source || j.thumbnail?.source;
      if (src) return commonsFileFromUrl(src);
    }
  }
  return null;
}

// Pull imageinfo (url/size/mime/credit) + categories for a batch of File: titles.
async function infoFor(titles) {
  const out = {};
  for (let i = 0; i < titles.length; i += 25) {
    const batch = titles.slice(i, i + 25);
    const j = await commonsApi({
      action: "query",
      titles: batch.join("|"),
      prop: "imageinfo|categories",
      cllimit: "max",
      iiprop: "url|extmetadata|mime|size",
      iiurlwidth: "1280",
    });
    for (const page of Object.values(j?.query?.pages ?? {})) {
      const ii = page.imageinfo?.[0];
      if (!ii) continue;
      out[page.title] = {
        title: page.title,
        thumb: ii.thumburl,
        descUrl: ii.descriptionurl || ii.descriptionshorturl || "",
        mime: ii.mime,
        width: ii.width || 0,
        height: ii.height || 0,
        credit: stripHtml(ii.extmetadata?.Artist?.value),
        license: ii.extmetadata?.LicenseShortName?.value ?? "",
        cats: (page.categories ?? []).map((c) => c.title).join(" "),
      };
    }
  }
  return out;
}

function commonsFileFromUrl(url) {
  const m = url.match(/\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+?)(?:\/\d+px-[^/]+)?$/);
  return m ? "File:" + decodeURIComponent(m[1]) : null;
}

// ── Filtering & scoring ──
function tokensOf(d) {
  const raw = `${d.nameEn} ${d.name}`
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // strip Vietnamese accents
    .toLowerCase();
  const stop = new Set(["the", "of", "and", "lake", "mountain", "cave", "beach", "temple", "pagoda", "river",
    "island", "waterfall", "bay", "valley", "village", "market", "hill", "hills", "pass", "national", "park",
    "cao", "nguyen", "ho", "nui", "hang", "bai", "den", "chua", "thac", "song", "dao", "deo", "cua", "khu"]);
  return [...new Set(raw.split(/[^a-z0-9]+/).filter((t) => t.length >= 4 && !stop.has(t)))];
}

function matchesTokens(text, tokens) {
  if (!tokens.length) return false;
  const t = text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  return tokens.some((tok) => t.includes(tok));
}

// Biodiversity observations (iNaturalist etc.) are geotagged inside parks/reserves and
// pollute geosearch with specimen close-ups of fauna — never a view of the place.
const BIO = /\b(inaturalist|coleoptera|lepidoptera|odonata|cicindela|specimen|observation|herpetolog|entomolog|aves of|fauna of|flora of|mollusca|arachnida)\b/i;

function isPhoto(info) {
  if (!info || !info.thumb) return false;
  if (!/image\/(jpeg|png)/.test(info.mime || "")) return false; // no svg/tiff/gif
  if (info.width && info.width < 700) return false;
  if (JUNK.test(info.title) || JUNK.test(info.cats)) return false;
  if (BIO.test(info.cats)) return false;
  return true;
}

async function downloadWebp(url, destFile) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`img ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 74 }).toFile(destFile);
}

// ── Per-destination processing ──
async function candidatesFor(d, tokens) {
  const seen = new Set();
  const titles = [];
  const add = (arr) => arr.forEach((t) => { if (t && !seen.has(t)) { seen.add(t); titles.push(t); } });

  // 1) geosearch, escalating radius
  for (const radius of [1500, 5000, 12000]) {
    add(await geoTitles(d.lat, d.lng, radius));
    if (titles.length >= 24) break;
  }
  const geoSet = new Set(titles); // remember which came from geo
  // 2) wikipedia lead (validated) — curated, most representative; reserved for the hero.
  const prov = provinceEn.get(d.provinceSlug) ?? "Vietnam";
  const lead = await wikiLeadCandidate([`${d.nameEn}`, `${d.nameEn} ${prov}`, d.name], tokens);
  if (lead) add([lead]);
  const curated = new Set(lead ? [lead] : []);
  // 3) text search fallback
  for (const q of [`${d.nameEn} ${prov}`, `${d.nameEn} Vietnam`, d.name]) add(await textTitles(q));

  const info = await infoFor(titles);
  // Rank candidates. A curated Wikipedia lead should top a merely-geotagged signboard of the
  // same place; large landscape photos beat small tall ones (which tend to be signs/documents).
  const ranked = [];
  for (const t of titles) {
    const i = info[t];
    if (!isPhoto(i)) continue;
    const isGeo = geoSet.has(t);
    const isCurated = curated.has(t);
    const named = matchesTokens(t, tokens) || matchesTokens(i.cats, tokens);
    if (!isGeo && !isCurated && !named) continue; // could be anywhere → reject
    const aspect = i.height ? i.width / i.height : 1;
    // Heroes are landscape scenery; tall portraits are overwhelmingly signs/plaques/documents.
    const orient = aspect >= 1.2 ? 18 : aspect < 0.8 ? -35 : 0;
    const score =
      (isCurated ? 60 : 0) + (isGeo ? 40 : 0) + (named ? 20 : 0) + orient + Math.min(i.width / 500, 12);
    ranked.push({ ...i, isGeo, isCurated, named, score });
  }
  ranked.sort((a, b) => b.score - a.score);
  return ranked;
}

async function processDestination(d, manifest, used, fillFn, stats) {
  const seeds = (d.gallery ?? []).map((g) => g.seed);
  const toFill = seeds.filter(fillFn);
  if (!toFill.length) { stats.done++; return; }

  const tokens = tokensOf(d);
  const ranked = await candidatesFor(d, tokens);
  let i = 0;
  for (const seed of toFill) {
    // next candidate not already used anywhere
    let pick = null;
    while (i < ranked.length) {
      const c = ranked[i++];
      if (used.has(c.title)) continue;
      pick = c;
      break;
    }
    if (!pick) { stats.unfilled.push(seed); continue; }
    try {
      await downloadWebp(pick.thumb, `${OUT_DIR}/${seed}.webp`);
      used.add(pick.title);
      manifest[seed] = {
        src: `/img/${seed}.webp`,
        credit: pick.credit,
        license: pick.license || "Wikimedia Commons",
        sourceTitle: pick.title,
        sourceUrl: pick.descUrl,
        via: pick.isCurated ? "wikipedia" : pick.isGeo ? "geosearch" : pick.named ? "name" : "other",
        width: pick.width,
      };
      stats.images++;
    } catch {
      stats.failed++;
    }
  }
  stats.done++;
  process.stdout.write(`\r  ${stats.done}/${destinations.length} · ${stats.images} imgs · ${stats.unfilled.length} unfilled`);
}

async function pool(items, size, fn) {
  const queue = [...items];
  await Promise.all(Array.from({ length: size }, async () => { while (queue.length) await fn(queue.shift()); }));
}

// ── Entry ──
mkdirSync(OUT_DIR, { recursive: true });
const manifestPath = r("src/data/generated/image-manifest.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};

const refetchPath = process.env.REFETCH;
const force = process.env.FORCE === "1";
const refetchSeeds = refetchPath && existsSync(r(refetchPath)) ? new Set(JSON.parse(readFileSync(r(refetchPath), "utf8"))) : null;
const fillFn = force ? () => true : refetchSeeds ? (s) => refetchSeeds.has(s) : (s) => !manifest[s];

// Reserve already-kept source titles so we never duplicate them onto a refetched seed.
const used = new Set();
for (const [seed, m] of Object.entries(manifest)) {
  if (m.sourceTitle && !fillFn(seed)) used.add(m.sourceTitle);
}

const mode = force ? "FORCE all" : refetchSeeds ? `REFETCH ${refetchSeeds.size} seeds` : "fill missing";
console.log(`Fetching geo-verified photos (${mode})…`);
const stats = { done: 0, images: 0, failed: 0, unfilled: [] };
await pool(destinations, 2, (d) => processDestination(d, manifest, used, fillFn, stats).then(() => sleep(200)));

writeFileSync(manifestPath, JSON.stringify(manifest, null, 0));
const covered = destinations.filter((d) => (d.gallery ?? []).some((g) => manifest[g.seed])).length;
console.log(`\n[fetch-images] ${stats.images} new imgs · ${stats.failed} failed · ${covered}/${destinations.length} places covered`);
if (stats.unfilled.length) console.log(`[unfilled] ${stats.unfilled.length}: ${stats.unfilled.join(", ")}`);
