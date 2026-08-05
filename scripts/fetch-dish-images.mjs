// Fetch real photos for Food Explorer dishes (026) into public/img/dishes/ and register them
// in the shared image-manifest under seed `dish-<id>` (IllustratedImage picks them up).
// Strategy per dish: Wikipedia lead image (source language → en, dish articles are usually
// excellent) → fallback Wikimedia Commons search with junk filtering.
// Modes:
//   node scripts/fetch-dish-images.mjs        → Vietnam dishes
//   node scripts/fetch-dish-images.mjs kr     → Korea dishes
// FORCE=1 refetches all. After running, VISUALLY AUDIT — blank wrong seeds from the manifest.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import { dishes } from "../src/data/food.ts";
import { dishesKr } from "../src/data/kr/index.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);
const OUT_DIR = r("public/img/dishes");
const MANIFEST = r("src/data/generated/image-manifest.json");
const UA = "VietnamAtlas/1.0 (food explorer; contact via github.com/fechtin/duli)";
const FORCE = process.env.FORCE === "1";

// ── Atlas selection ──
// Each atlas brings its dishes, the wiki language its names are written in, and the phrase
// appended to a Commons text search when the Wikipedia lookups come up empty.
const ATLASES = {
  vn: { dishes, nameLang: "vi", commonsSuffix: "Vietnam food" },
  kr: { dishes: dishesKr, nameLang: "ko", commonsSuffix: "Korean food" },
};
const cc = (process.argv[2] ?? process.env.COUNTRY ?? "vn").toLowerCase();
const atlas = ATLASES[cc];
if (!atlas) {
  console.error(`[fetch-dish-images] unknown country "${cc}" (expected: ${Object.keys(ATLASES).join(", ")})`);
  process.exit(1);
}

const JUNK = /\b(map|bản đồ|logo|flag|coat of arms|diagram|chart|montage|collage|seal|emblem|locator|icon|screenshot|menu|sign)\b/i;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Regional dishes are named "<place> <dish>" — Wikipedia only carries the bare dish, so
// "Suwon Galbi" has to become "Galbi". Strip a trailing generic and then one leading word.
// Never strip down to a bare English food noun: "Busan Fish Cake" → "Cake" would fetch a
// birthday cake, and a plausible-looking wrong photo is worse than no photo.
const GENERIC_TAIL = /\s+(dishes|bbq|barbecue|set|platter)$/i;
const TOO_GENERIC = new Set([
  "rice", "cake", "pork", "beef", "chicken", "octopus", "oyster", "oysters", "garlic",
  "soup", "stew", "noodles", "noodle", "fish", "crab", "squid", "porridge", "dumpling",
  "dumplings", "pancake", "tea", "wine", "bread",
]);
function nameVariants(name) {
  const out = [];
  const n = name.replace(GENERIC_TAIL, "").trim();
  if (n !== name) out.push(n);
  const words = n.split(/\s+/);
  if (words.length > 1) out.push(words.slice(1).join(" "));
  return [...new Set(out)].filter(
    (v) => v && v !== name && !TOO_GENERIC.has(v.toLowerCase()),
  );
}

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

// upload.wikimedia.org throttles hard when several of these scripts run at once, so back off
// and retry rather than losing the dish to a transient 429.
async function download(url, dest, tries = 4) {
  for (let i = 1; i <= tries; i++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 74 }).toFile(dest);
      return;
    }
    if ((res.status === 429 || res.status >= 500) && i < tries) {
      await sleep(Number(res.headers.get("retry-after")) * 1000 || i * 10000);
      continue;
    }
    throw new Error(`download ${res.status}`);
  }
}

mkdirSync(OUT_DIR, { recursive: true });
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};

let done = 0, skipped = 0, failed = [];
for (const d of atlas.dishes) {
  const seed = `dish-${d.id}`;
  if (!FORCE && manifest[seed]) { skipped++; continue; }
  try {
    // The Korea atlas is authored in Vietnamese, so `name` is a Vietnamese rendering and is
    // useless against ko.wikipedia — for kr the English name is the only reliable key.
    // Regional dishes are named "<place> <dish>" ("Suwon Galbi"), and Wikipedia only has the
    // bare dish. Try the full name first, then progressively drop the leading place word.
    const base = d.nameEn.replace(/\s*\(.*\)$/, "");
    const variants = [base, ...(cc === "kr" ? nameVariants(base) : [])];
    let pick = cc === "vn" ? await wikiLead("vi", d.name) : null;
    for (const v of variants) {
      if (pick) break;
      pick = await wikiLead("en", v);
    }
    for (const v of variants) {
      if (pick || cc !== "kr") break;
      pick = await wikiLead("ko", v);
    }
    pick ??= await commonsSearch(`${base} ${atlas.commonsSuffix}`);
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
