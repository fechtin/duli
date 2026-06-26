// Fetch real, openly-licensed photos from Wikimedia Commons for every destination,
// optimize to WebP, and write an image manifest (seed -> {src, credit, license}).
// Images are served as static assets; IllustratedImage falls back to the illustration
// when a seed has no photo. Run: npm run images:fetch
//
// Attribution is captured per Commons license terms (Bible 009 §6).

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import { destinations } from "../src/data/destinations.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);
const geo = JSON.parse((await import("node:fs")).readFileSync(r("src/data/generated/geo-meta.json"), "utf8"));
const provinceEn = new Map(geo.provinces.map((p) => [p.slug, p.nameEn]));

const API = "https://commons.wikimedia.org/w/api.php";
const UA = "VietnamAtlas/1.0 (https://github.com/fechtin/duli; educational tourism map)";
const PER_DESTINATION = 3; // images per place (maps to first N gallery seeds)
const OUT_DIR = r("public/img");

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const stripHtml = (s) => (s ? s.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim().slice(0, 120) : "");

async function jget(params, tries = 4) {
  const url = `${API}?${new URLSearchParams({ format: "json", maxlag: "5", ...params })}`;
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.status === 429 || res.status === 503) throw new Error(`throttled ${res.status}`);
      if (!res.ok) throw new Error(`commons ${res.status}`);
      const j = await res.json();
      if (j.error?.code === "maxlag") throw new Error("maxlag");
      return j;
    } catch (e) {
      if (attempt === tries) throw e;
      await sleep(400 * attempt + 200); // backoff
    }
  }
}

async function searchFiles(query, limit = 8) {
  const j = await jget({ action: "query", list: "search", srnamespace: "6", srsearch: query, srlimit: String(limit) });
  return (j.query?.search ?? []).map((s) => s.title);
}

async function imageInfo(titles) {
  if (!titles.length) return {};
  const j = await jget({
    action: "query",
    titles: titles.join("|"),
    prop: "imageinfo",
    iiprop: "url|extmetadata|mime",
    iiurlwidth: "1280",
  });
  const out = {};
  for (const page of Object.values(j.query?.pages ?? {})) {
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

async function downloadWebp(thumbUrl, destFile) {
  const res = await fetch(thumbUrl, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`img ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 72 }).toFile(destFile);
}

async function processDestination(d, manifest, stats) {
  const seeds = d.gallery.slice(0, PER_DESTINATION).map((g) => g.seed);
  if (!seeds.length) return;
  // Already fully covered from a previous run — skip all network (resumable + avoids throttling).
  if (seeds.every((s) => manifest[s])) {
    stats.withPhotos++;
    stats.done++;
    return;
  }
  const prov = provinceEn.get(d.provinceSlug) ?? "Vietnam";
  const queries = [...new Set([`${d.nameEn} ${prov}`, `${d.nameEn} Vietnam`])];

  // Gather candidate file titles.
  const titles = [];
  for (const q of queries) {
    if (titles.length >= PER_DESTINATION + 4) break;
    try {
      for (const t of await searchFiles(q)) if (!titles.includes(t)) titles.push(t);
    } catch {
      /* keep going */
    }
  }
  const info = await imageInfo(titles.slice(0, 10)).catch(() => ({}));

  // Usable photos in search-rank order.
  const photos = titles
    .map((t) => info[t])
    .filter((x) => x && x.thumb && /image\/(jpeg|png|webp)/.test(x.mime || ""));

  let i = 0;
  for (const seed of seeds) {
    const photo = photos[i++];
    if (!photo) break;
    const file = `${OUT_DIR}/${seed}.webp`;
    try {
      if (!existsSync(file)) await downloadWebp(photo.thumb, file);
      manifest[seed] = { src: `/img/${seed}.webp`, credit: photo.credit, license: photo.license };
      stats.images++;
    } catch {
      stats.failed++;
    }
  }
  stats.withPhotos += seeds.some((s) => manifest[s]) ? 1 : 0;
  process.stdout.write(`\r  ${stats.done + 1}/${destinations.length} places · ${stats.images} images`);
  stats.done++;
}

async function pool(items, size, fn) {
  const queue = [...items];
  const workers = Array.from({ length: size }, async () => {
    while (queue.length) await fn(queue.shift());
  });
  await Promise.all(workers);
}

mkdirSync(OUT_DIR, { recursive: true });
// Preserve coverage across runs — re-runs only fill the gaps (additive, never lose entries).
const manifestPath = r("src/data/generated/image-manifest.json");
const manifest = existsSync(manifestPath) ? JSON.parse((await import("node:fs")).readFileSync(manifestPath, "utf8")) : {};
const stats = { done: 0, images: 0, failed: 0, withPhotos: 0 };

console.log(`Fetching photos for ${destinations.length} destinations from Wikimedia Commons…`);
// Low concurrency + polite delay to avoid Commons rate-limiting (the API throttles bursts).
await pool(destinations, 2, (d) => processDestination(d, manifest, stats).then(() => sleep(250)));

mkdirSync(r("src/data/generated"), { recursive: true });
writeFileSync(r("src/data/generated/image-manifest.json"), JSON.stringify(manifest, null, 0));
console.log(
  `\n[fetch-images] ${stats.images} images for ${stats.withPhotos}/${destinations.length} places (${Object.keys(manifest).length} seeds) -> public/img + image-manifest.json`,
);
