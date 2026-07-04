// Fetch real photos for Food Explorer dishes (026) into public/img/dishes/ and register them
// in the shared image-manifest under seed `dish-<id>` (IllustratedImage picks them up).
// Strategy per dish: Wikipedia lead image (vi → en, dish articles are usually excellent)
// → fallback Wikimedia Commons search with junk filtering. Run: node scripts/fetch-dish-images.mjs
// FORCE=1 refetches all. After running, VISUALLY AUDIT — blank wrong seeds from the manifest.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import { dishes } from "../src/data/food.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);
const OUT_DIR = r("public/img/dishes");
const MANIFEST = r("src/data/generated/image-manifest.json");
const UA = "VietnamAtlas/1.0 (food explorer; contact via github.com/fechtin/duli)";
const FORCE = process.env.FORCE === "1";

const JUNK = /\b(map|bản đồ|logo|flag|coat of arms|diagram|chart|montage|collage|seal|emblem|locator|icon|screenshot|menu|sign)\b/i;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function j(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) return res.json();
    if (res.status === 429 || res.status >= 500) {
      const wait = Number(res.headers.get("retry-after")) * 1000 || (i + 1) * 8000;
      await sleep(wait);
      continue;
    }
    throw new Error(`${res.status} ${url}`);
  }
  throw new Error(`429 (retries exhausted) ${url}`);
}

/** Wikipedia lead image for the best-matching article on a wiki. */
async function wikiLead(lang, term) {
  const search = await j(
    `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&srlimit=1&format=json&origin=*`,
  );
  const hit = search.query?.search?.[0];
  if (!hit) return null;
  const sum = await j(
    `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hit.title.replace(/ /g, "_"))}`,
  );
  const img = sum.originalimage ?? sum.thumbnail;
  if (!img?.source || (img.width ?? 0) < 450) return null;
  if (JUNK.test(img.source)) return null;
  // File name for attribution lookup on Commons.
  const pi = await j(
    `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(hit.title)}&prop=pageimages&piprop=name&format=json&origin=*`,
  );
  const page = Object.values(pi.query?.pages ?? {})[0];
  return {
    url: img.source,
    file: page?.pageimage ? `File:${page.pageimage}` : null,
    sourceTitle: sum.title,
    sourceUrl: sum.content_urls?.desktop?.page ?? "",
    via: `wikipedia-${lang}`,
  };
}

/** Commons full-text search fallback. */
async function commonsSearch(term) {
  const data = await j(
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term)}%20filetype:bitmap&gsrlimit=8&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1280&format=json&origin=*`,
  );
  const pages = Object.values(data.query?.pages ?? {});
  for (const p of pages.sort((a, b) => (a.index ?? 9) - (b.index ?? 9))) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    if (!/image\/(jpeg|png)/.test(ii.mime)) continue;
    if ((ii.width ?? 0) < 700) continue;
    if (JUNK.test(p.title)) continue;
    if (ii.height > ii.width * 1.6) continue; // hard portrait penalty
    return { url: ii.thumburl ?? ii.url, file: p.title, sourceTitle: p.title, sourceUrl: ii.descriptionurl ?? "", via: "commons-search" };
  }
  return null;
}

/** Commons attribution (Artist + license) for a File: title. */
async function attribution(file) {
  if (!file) return { credit: "", license: "Wikimedia Commons" };
  try {
    const data = await j(
      `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(file)}&prop=imageinfo&iiprop=extmetadata&format=json&origin=*`,
    );
    const meta = Object.values(data.query?.pages ?? {})[0]?.imageinfo?.[0]?.extmetadata ?? {};
    const strip = (html) => (html ?? "").replace(/<[^>]+>/g, "").trim();
    return {
      credit: strip(meta.Artist?.value).slice(0, 80),
      license: strip(meta.LicenseShortName?.value) || "Wikimedia Commons",
    };
  } catch {
    return { credit: "", license: "Wikimedia Commons" };
  }
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 74 }).toFile(dest);
}

mkdirSync(OUT_DIR, { recursive: true });
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};

let done = 0, skipped = 0, failed = [];
for (const d of dishes) {
  const seed = `dish-${d.id}`;
  if (!FORCE && manifest[seed]) { skipped++; continue; }
  try {
    // vi article on the exact dish name → en article (English name) → Commons search.
    const pick =
      (await wikiLead("vi", d.name)) ??
      (await wikiLead("en", d.nameEn.replace(/\s*\(.*\)$/, ""))) ??
      (await commonsSearch(`${d.name} Vietnam food`));
    if (!pick) { failed.push(d.id); continue; }
    await download(pick.url, `${OUT_DIR}/${d.id}.webp`);
    const attr = await attribution(pick.file);
    manifest[seed] = {
      src: `/img/dishes/${d.id}.webp`,
      credit: attr.credit,
      license: attr.license,
      sourceTitle: pick.sourceTitle,
      sourceUrl: pick.sourceUrl,
      via: pick.via,
    };
    done++;
    console.log(`✓ ${d.id}  (${pick.via})`);
  } catch (e) {
    failed.push(d.id);
    console.log(`✗ ${d.id}: ${e.message}`);
  }
  await sleep(1500);
}

writeFileSync(MANIFEST, JSON.stringify(manifest));
console.log(`\n[dish-images] fetched ${done}, skipped ${skipped}, failed ${failed.length}${failed.length ? ": " + failed.join(", ") : ""}`);
