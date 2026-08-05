// Square 96px crops of every photo in image-manifest.json, for the map marker medallions (031).
//
// Why a derivative instead of reusing /img/<seed>.webp: the source photos are 1280px wide and
// average ~180 KB. A marker medallion paints them at 20-28 px, and dozens are on screen at once —
// reusing the hero file would mean several MB of decode work for a thumbnail. At 96px/q70 each
// crop is ~3 KB, so the whole marker layer costs less than one hero photo.
//
// Output is committed (like the source photos, unlike the ambient clips): it is small, and it
// means the map never depends on a build step having run.
//
//   npm run images:thumbs          → fill only missing thumbs
//   FORCE=1 npm run images:thumbs  → rebuild every thumb

import { readFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);

const SIZE = 96;
const QUALITY = 70;
const OUT_DIR = r("public/img/thumb");

const manifest = JSON.parse(readFileSync(r("src/data/generated/image-manifest.json"), "utf8"));
const force = process.env.FORCE === "1";

mkdirSync(OUT_DIR, { recursive: true });

let built = 0;
let skipped = 0;
let missing = 0;
let bytes = 0;

for (const [seed, entry] of Object.entries(manifest)) {
  // manifest src is site-absolute ("/img/foo.webp"); dishes live in a subfolder and keep it.
  const srcFile = r(`public${entry.src}`);
  const outFile = `${OUT_DIR}/${seed}.webp`;

  if (!existsSync(srcFile)) {
    console.warn(`  ! ${seed}: source photo missing (${entry.src})`);
    missing++;
    continue;
  }
  if (!force && existsSync(outFile)) {
    skipped++;
    bytes += statSync(outFile).size;
    continue;
  }

  await sharp(srcFile)
    .resize(SIZE, SIZE, { fit: "cover", position: "attention" })
    .webp({ quality: QUALITY })
    .toFile(outFile);

  built++;
  bytes += statSync(outFile).size;
}

// A manifest of its own would duplicate image-manifest exactly: a thumb exists iff a photo does.
// Runtime derives the path by convention, so the only thing to assert here is that parity holds.
const expected = Object.keys(manifest).length - missing;
const actual = Object.keys(manifest).filter((s) => existsSync(`${OUT_DIR}/${s}.webp`)).length;
if (actual !== expected) {
  console.error(`[thumbs] parity broken: ${actual} thumbs for ${expected} photos`);
  process.exit(1);
}

console.log(
  `[thumbs] ${built} built, ${skipped} kept, ${missing} source(s) missing — ` +
    `${actual} thumbs, ${(bytes / 1024).toFixed(0)} KB total, avg ${(bytes / actual / 1024).toFixed(1)} KB`,
);
