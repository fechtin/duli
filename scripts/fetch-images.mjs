// Fetch real, openly-licensed photos for every destination from multiple sources and
// optimize to WebP. Sources, in priority order:
//   1) Wikipedia lead image (curated, most representative) — used for the HERO (overwrites
//      to improve weak heroes), resolved via search → REST summary on en + vi Wikipedia.
//   2) Wikimedia Commons search — fills the rest of the gallery + obscure places.
// Writes src/data/generated/image-manifest.json (seed -> {src, credit, license}).
// Resumable + rate-limited (Commons/Wikipedia throttle bursts). Run: npm run images:fetch

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
const PER_DESTINATION = 4;
const OUT_DIR = r("public/img");
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const stripHtml = (s) => (s ? s.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim().slice(0, 120) : "");

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

// ── Wikipedia lead image (the representative photo) ──
async function wikiTopTitle(query, lang) {
  const j = await getJson(
    `https://${lang}.wikipedia.org/w/api.php?${new URLSearchParams({ format: "json", action: "query", list: "search", srsearch: query, srlimit: "1" })}`,
  );
  return j?.query?.search?.[0]?.title ?? null;
}

async function wikiLeadImage(queries, langs = ["en", "vi"]) {
  for (const lang of langs) {
    for (const q of queries) {
      const title = await wikiTopTitle(q, lang);
      if (!title) continue;
      const j = await getJson(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
      if (!j || j.type === "disambiguation") continue;
      const src = j.originalimage?.source || j.thumbnail?.source;
      if (src) return src;
    }
  }
  return null;
}

// ── Commons ──
async function commonsSearch(query, limit = 8) {
  const j = await commonsApi({ action: "query", list: "search", srnamespace: "6", srsearch: query, srlimit: String(limit) });
  return (j?.query?.search ?? []).map((s) => s.title);
}

async function commonsInfo(titles) {
  if (!titles.length) return {};
  const j = await commonsApi({ action: "query", titles: titles.join("|"), prop: "imageinfo", iiprop: "url|extmetadata|mime", iiurlwidth: "1280" });
  const out = {};
  for (const page of Object.values(j?.query?.pages ?? {})) {
    const ii = page.imageinfo?.[0];
    if (!ii) continue;
    out[page.title] = {
      thumb: ii.thumburl,
      mime: ii.mime,
      credit: stripHtml(ii.extmetadata?.Artist?.value),
      license: ii.extmetadata?.LicenseShortName?.value ?? "",
    };
  }
  return out;
}

function commonsFileFromUrl(url) {
  const m = url.match(/\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+?)(?:\/\d+px-[^/]+)?$/);
  return m ? "File:" + decodeURIComponent(m[1]) : null;
}

async function downloadWebp(url, destFile) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`img ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 74 }).toFile(destFile);
}

async function processDestination(d, manifest, heroSet, stats) {
  const seeds = d.gallery.slice(0, PER_DESTINATION).map((g) => g.seed);
  if (!seeds.length) return;
  const prov = provinceEn.get(d.provinceSlug) ?? "Vietnam";
  const haveHero = heroSet.has(seeds[0]); // hero already upgraded from Wikipedia in a prior run

  // Skip only if hero is already upgraded AND every seed has an image.
  if (haveHero && seeds.every((s) => manifest[s])) {
    stats.withPhotos++;
    stats.done++;
    process.stdout.write(`\r  ${stats.done}/${destinations.length} · ${stats.images} imgs`);
    return;
  }

  // 1) Wikipedia hero (representative). Overwrite seed[0] to improve weak heroes.
  const heroUrl = await wikiLeadImage([`${d.nameEn}`, `${d.nameEn} ${prov}`, d.name]);
  let heroCredit = "";
  let heroLicense = "Wikimedia Commons";
  if (heroUrl) {
    const file = commonsFileFromUrl(heroUrl);
    if (file) {
      const info = await commonsInfo([file]);
      const m = info[file];
      if (m) {
        heroCredit = m.credit;
        heroLicense = m.license || heroLicense;
      }
    }
    try {
      await downloadWebp(heroUrl, `${OUT_DIR}/${seeds[0]}.webp`);
      manifest[seeds[0]] = { src: `/img/${seeds[0]}.webp`, credit: heroCredit, license: heroLicense };
      heroSet.add(seeds[0]);
      stats.images++;
    } catch {
      stats.failed++;
    }
  }

  // 2) Commons for the remaining gallery seeds (fill only those still missing).
  const missing = seeds.slice(1).filter((s) => !manifest[s]);
  if (missing.length) {
    const titles = [];
    for (const q of [`${d.nameEn} ${prov}`, `${d.nameEn} Vietnam`, d.name]) {
      if (titles.length >= missing.length + 4) break;
      for (const t of await commonsSearch(q)) if (!titles.includes(t)) titles.push(t);
    }
    const info = await commonsInfo(titles.slice(0, 10));
    const heroFile = heroUrl ? commonsFileFromUrl(heroUrl) : null;
    const photos = titles
      .filter((t) => t !== heroFile) // don't duplicate the hero
      .map((t) => info[t])
      .filter((x) => x && x.thumb && /image\/(jpeg|png|webp)/.test(x.mime || ""));
    let i = 0;
    for (const seed of missing) {
      const photo = photos[i++];
      if (!photo) break;
      try {
        await downloadWebp(photo.thumb, `${OUT_DIR}/${seed}.webp`);
        manifest[seed] = { src: `/img/${seed}.webp`, credit: photo.credit, license: photo.license };
        stats.images++;
      } catch {
        stats.failed++;
      }
    }
  }

  if (seeds.some((s) => manifest[s])) stats.withPhotos++;
  stats.done++;
  process.stdout.write(`\r  ${stats.done}/${destinations.length} · ${stats.images} imgs`);
}

async function pool(items, size, fn) {
  const queue = [...items];
  await Promise.all(Array.from({ length: size }, async () => { while (queue.length) await fn(queue.shift()); }));
}

mkdirSync(OUT_DIR, { recursive: true });
const manifestPath = r("src/data/generated/image-manifest.json");
const statePath = r("scripts/.image-state.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
const heroSet = new Set(existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")).heroes ?? [] : []);
const stats = { done: 0, images: 0, failed: 0, withPhotos: 0 };

console.log(`Fetching photos for ${destinations.length} destinations (Wikipedia hero + Commons gallery)…`);
await pool(destinations, 2, (d) => processDestination(d, manifest, heroSet, stats).then(() => sleep(250)));

writeFileSync(manifestPath, JSON.stringify(manifest, null, 0));
writeFileSync(statePath, JSON.stringify({ heroes: [...heroSet] }, null, 0));
const covered = destinations.filter((d) => d.gallery.some((g) => manifest[g.seed])).length;
console.log(`\n[fetch-images] ${stats.images} images this run · ${covered}/${destinations.length} places have photos · ${Object.keys(manifest).length} seeds`);
