// Download specific, hand-picked Commons files for hero seeds that the automated pipeline
// couldn't resolve. Reads a seed→"File:Title" map (scripts/.curate-map.json), fetches each
// file's imageinfo (url/credit/license), optimizes to WebP, and writes the manifest entry
// with provenance (via:"curated"). Run: node --experimental-strip-types scripts/curate-images.mjs
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const r = (p) => resolve(__dirname, "..", p);
const UA = "VietnamAtlas/1.0 (https://github.com/fechtin/duli; educational tourism map)";
const OUT_DIR = r("public/img");
const stripHtml = (s) => (s ? s.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim().slice(0, 120) : "");
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function getJson(url, tries = 4) {
  for (let a = 1; a <= tries; a++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`http ${res.status}`);
      return await res.json();
    } catch (e) {
      if (a === tries) return null;
      await sleep(400 * a + 200);
    }
  }
}

async function infoFor(title) {
  const j = await getJson(
    `https://commons.wikimedia.org/w/api.php?${new URLSearchParams({
      format: "json", action: "query", titles: title, prop: "imageinfo",
      iiprop: "url|extmetadata|mime|size", iiurlwidth: "1280",
    })}`,
  );
  const page = Object.values(j?.query?.pages ?? {})[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) return null;
  return {
    title: page.title,
    thumb: ii.thumburl,
    descUrl: ii.descriptionurl || "",
    width: ii.width || 0,
    credit: stripHtml(ii.extmetadata?.Artist?.value),
    license: ii.extmetadata?.LicenseShortName?.value ?? "Wikimedia Commons",
  };
}

async function downloadWebp(url, destFile) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`img ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 74 }).toFile(destFile);
}

mkdirSync(OUT_DIR, { recursive: true });
const manifestPath = r("src/data/generated/image-manifest.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
const map = JSON.parse(readFileSync(r("scripts/.curate-map.json"), "utf8"));

let ok = 0, fail = 0;
for (const [seed, title] of Object.entries(map)) {
  if (!title) continue;
  const info = await infoFor(title);
  if (!info?.thumb) { console.log(`  ✗ ${seed}: no imageinfo for ${title}`); fail++; continue; }
  try {
    await downloadWebp(info.thumb, `${OUT_DIR}/${seed}.webp`);
    manifest[seed] = {
      src: `/img/${seed}.webp`, credit: info.credit, license: info.license,
      sourceTitle: info.title, sourceUrl: info.descUrl, via: "curated", width: info.width,
    };
    console.log(`  ✓ ${seed} ← ${info.title} (${info.width}px)`);
    ok++;
  } catch (e) {
    console.log(`  ✗ ${seed}: download failed ${title}`); fail++;
  }
  await sleep(150);
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 0));
console.log(`\n[curate] ${ok} curated, ${fail} failed`);
