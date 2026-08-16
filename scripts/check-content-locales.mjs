// Guard the hand-authored content translations (src/data/**/i18n/*.{ko,ja,zh}.ts) against
// text that leaked in from another language while writing. Two classes of defect:
//
//   1. Cyrillic anywhere — never legitimate in these files.
//   2. A run of Latin letters inside a ko/ja/zh string that is not a known proper noun or
//      acronym. Catches half-translated phrases like "木造風車still立在原處".
//
// Whitelist real ones in ALLOWED below. Run: npm run check:content
// Sibling of check-i18n.mjs, which covers UI-string parity instead.
//
// Also asserts marker-thumbnail parity — see the section at the bottom. It rides along here
// because it is the same kind of defect: content that is present in the data but does not reach
// the screen, invisible until someone looks at the right pixel.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Cyrillic is checked everywhere; the Latin-run check only runs on the Korea atlas, where a
// Latin word in the middle of CJK prose is almost always a slip. The Vietnam files quote
// romanised dish names constantly ("bánh canh hẹ"), so the same rule there is pure noise.
const CYRILLIC_DIRS = ["src/data/i18n", "src/data/i18n/food", "src/data/kr/i18n"];
const LATIN_DIRS = ["src/data/kr/i18n"];
const CJK_LOCALES = ["ko", "ja", "zh"];

// Measurement units written in Latin are normal in all three languages ("7.42km", "5m").
const UNITS = new Set(["km", "m", "cm", "mm", "ha", "kg", "g", "ml", "l", "kw", "mw"]);
// Lowercase words that really do belong in CJK copy. Acronyms need no entry: an all-caps
// token (APEC, BIFF, KTX, DDP) is always allowed.
const ALLOWED = new Set([
  "ondol", "hanok", "makgeolli", "oreum", "olle",
  // romanised dish names the food copy introduces before glossing them
  "makguksu", "ongsimi", "kalguksu", "saealsim", "makchang", "milmyeon", "melchijeot",
]);

const STRING_RE = /"((?:[^"\\]|\\.)*)"/g;
const CYRILLIC_RE = /[Ѐ-ӿ]/;
const LATIN_RUN_RE = /[A-Za-z][A-Za-z'’-]*/g;
const HAS_CJK_RE = /[぀-ヿ㐀-鿿가-힯]/;

function filesToCheck(dirs) {
  const out = [];
  for (const dir of dirs) {
    let entries;
    try {
      entries = readdirSync(resolve(ROOT, dir));
    } catch {
      continue;
    }
    for (const f of entries) {
      const m = f.match(/\.(\w+)\.ts$/);
      if (m && CJK_LOCALES.includes(m[1])) out.push(resolve(ROOT, dir, f));
    }
  }
  return out;
}

/** Parenthesised asides are where a romanised name legitimately appears. */
const stripParenthesised = (s) => s.replace(/[（(][^）)]*[）)]/g, " ");

const problems = [];
const latinFiles = new Set(filesToCheck(LATIN_DIRS).map(String));

for (const file of filesToCheck(CYRILLIC_DIRS)) {
  const text = readFileSync(file, "utf8");
  const checkLatin = latinFiles.has(String(file));
  text.split("\n").forEach((line, i) => {
    const where = `${relative(ROOT, file)}:${i + 1}`;
    for (const m of line.matchAll(STRING_RE)) {
      const value = m[1];
      if (CYRILLIC_RE.test(value)) {
        problems.push(`  ${where}  Cyrillic in translated text: ${value.slice(0, 70)}`);
        continue;
      }
      // Only judge Latin runs inside strings that are otherwise CJK prose.
      if (!checkLatin || !HAS_CJK_RE.test(value)) continue;
      for (const w of stripParenthesised(value).match(LATIN_RUN_RE) ?? []) {
        // All-caps reads as an acronym; capitalised reads as a proper noun. The realistic
        // slip is an ordinary lowercase English word left mid-sentence.
        if (w.length < 3 || w !== w.toLowerCase()) continue;
        if (UNITS.has(w) || ALLOWED.has(w)) continue;
        problems.push(`  ${where}  untranslated Latin "${w}" in: ${value.slice(0, 70)}`);
      }
    }
  });
}

let failed = false;

if (problems.length) {
  console.error(
    "✗ Content translation issues (fix the text, or add the token to ALLOWED in this script):\n" +
      problems.join("\n"),
  );
  console.error(`\n${problems.length} issue(s) found.`);
  failed = true;
} else {
  console.log("✓ content locales OK — no stray Cyrillic or untranslated Latin in ko/ja/zh copy.");
}

// ── Marker thumbnails ───────────────────────────────────────────────────────────────────────
// The map medallion derives its crop path by convention — `/img/thumb/<seed>.webp`, gated only
// on the seed being in the image manifest (src/lib/media/thumbs.ts). It never checks the file is
// there. So a photo batch landed without `npm run images:thumbs` gives every one of those markers
// a 404, and each silently falls back to its type icon while the panel still shows the photo.
//
// build-thumbs.mjs does assert parity, but only while it is itself running — which is exactly the
// run that did not happen. 383 photos drifted this way across batches 037 and 039 before anyone
// noticed. Hence the same assertion from the outside, where forgetting is the failure being caught.
const THUMB_DIR = "public/img/thumb";
const manifestSeeds = Object.keys(
  JSON.parse(readFileSync(resolve(ROOT, "src/data/generated/image-manifest.json"), "utf8")),
);
const missingThumbs = manifestSeeds.filter(
  (seed) => !existsSync(resolve(ROOT, THUMB_DIR, `${seed}.webp`)),
);

if (missingThumbs.length) {
  const shown = missingThumbs.slice(0, 10).map((s) => `  ${s}`).join("\n");
  console.error(
    `✗ ${missingThumbs.length} photo(s) have no marker thumbnail — those markers render as a ` +
      `generic type icon on the map. Fix: npm run images:thumbs\n${shown}` +
      (missingThumbs.length > 10 ? `\n  … and ${missingThumbs.length - 10} more` : ""),
  );
  failed = true;
} else {
  console.log(`✓ marker thumbnails OK — ${manifestSeeds.length} photos, ${manifestSeeds.length} thumbs.`);
}

// Orphans are the harmless direction: a crop whose photo left the manifest still costs ~2 KB in
// the repo but nothing at runtime, so it warns rather than fails.
const seedSet = new Set(manifestSeeds);
const orphanThumbs = (readdirSync(resolve(ROOT, THUMB_DIR)) ?? [])
  .filter((f) => f.endsWith(".webp"))
  .map((f) => f.slice(0, -".webp".length))
  .filter((seed) => !seedSet.has(seed));
if (orphanThumbs.length) {
  console.warn(
    `! ${orphanThumbs.length} thumbnail(s) with no photo left in the manifest — dead weight, ` +
      `safe to delete: ${orphanThumbs.join(", ")}`,
  );
}

process.exit(failed ? 1 : 0);
