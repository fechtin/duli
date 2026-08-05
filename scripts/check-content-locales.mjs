// Guard the hand-authored content translations (src/data/**/i18n/*.{ko,ja,zh}.ts) against
// text that leaked in from another language while writing. Two classes of defect:
//
//   1. Cyrillic anywhere — never legitimate in these files.
//   2. A run of Latin letters inside a ko/ja/zh string that is not a known proper noun or
//      acronym. Catches half-translated phrases like "木造風車still立在原處".
//
// Whitelist real ones in ALLOWED below. Run: npm run check:content
// Sibling of check-i18n.mjs, which covers UI-string parity instead.

import { readFileSync, readdirSync } from "node:fs";
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

if (problems.length) {
  console.error(
    "✗ Content translation issues (fix the text, or add the token to ALLOWED in this script):\n" +
      problems.join("\n"),
  );
  console.error(`\n${problems.length} issue(s) found.`);
  process.exit(1);
}
console.log("✓ content locales OK — no stray Cyrillic or untranslated Latin in ko/ja/zh copy.");
