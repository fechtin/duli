// i18n guardrail — run in CI / pre-commit (`npm run check:i18n`).
//
// Two checks, both aimed at the root cause of "new features ship missing translations":
//   1. Key parity — every locale (en/ko/ja/zh) must define exactly the keys vi.ts defines.
//   2. No hardcoded Vietnamese in rendered JSX — scans src/**/*.tsx for Vietnamese-diacritic
//      text that isn't going through t(). Proper-noun DATA maps live in .ts files and are
//      intentionally not scanned, and neither are *.test.tsx (fixture text, not UI); use
//      `// i18n-ignore` to whitelist a genuine exception line.
//
// Exits non-zero on any violation so it can gate a build.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOCALES_DIR = join(ROOT, "src/lib/i18n/locales");
const TAGS_DIR = join(ROOT, "src/lib/i18n/tags");
const SCAN_DIR = join(ROOT, "src");

// Vietnamese-specific letters (diacritics + đ). ASCII English never matches this.
const VN = /[àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/i;

function keysOf(file) {
  const src = readFileSync(join(LOCALES_DIR, file), "utf8");
  const keys = new Set();
  for (const m of src.matchAll(/^\s*"([\w.-]+)":/gm)) keys.add(m[1]);
  return keys;
}

function checkParity() {
  const vi = keysOf("vi.ts");
  const problems = [];
  for (const loc of ["en", "ko", "ja", "zh"]) {
    const keys = keysOf(`${loc}.ts`);
    for (const k of vi) if (!keys.has(k)) problems.push(`  ${loc}.ts is MISSING key "${k}"`);
    for (const k of keys) if (!vi.has(k)) problems.push(`  ${loc}.ts has EXTRA key "${k}" (not in vi.ts)`);
  }
  return problems;
}

function walk(dir, out = [], ext = ".tsx") {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === "i18n") continue; // skip the dictionaries themselves
      walk(p, out, ext);
    } else if (name.endsWith(ext)) {
      out.push(p);
    }
  }
  return out;
}

// Strip content that legitimately contains Vietnamese: comments and t("…") / t('…') arguments.
function stripAllowed(line) {
  let s = line.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, ""); // {/* JSX comment */}
  s = s.replace(/\/\*[\s\S]*?\*\//g, "");                  // /* inline block comment */
  s = s.replace(/\/\/.*$/, "");                            // line comments (incl. i18n-ignore marker)
  if (/^\s*\*/.test(s) || /^\s*\/\*/.test(s) || /\*\/\s*\}?$/.test(s)) return ""; // JSDoc / comment body
  s = s.replace(/\bt\(\s*["'][^"']*["']/g, "t(");          // drop the key string inside t("…")
  return s;
}

function checkHardcoded() {
  const problems = [];
  for (const file of walk(SCAN_DIR)) {
    // Tests are not UI. Their Vietnamese is fixture text — the very input a renderer must
    // handle — so scanning them only produces noise that trains people to ignore this check.
    if (file.endsWith(".test.tsx")) continue;
    const text = readFileSync(file, "utf8");
    if (text.includes("i18n-ignore-file")) continue; // whole-file opt-out (e.g. dead/standalone export cards)
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      if (line.includes("i18n-ignore")) return;
      if (VN.test(stripAllowed(line))) {
        problems.push(`  ${relative(ROOT, file)}:${i + 1}  ${line.trim().slice(0, 80)}`);
      }
    });
  }
  return problems;
}

// Tag labels live in their own modules (src/lib/i18n/tags) because they are content
// vocabulary, not chrome, and 265 keys would push the locale files past 500 LOC. Their keys
// are raw tag strings — diacritics and spaces — so they need their own key regex.
function tagKeysOf(file) {
  const src = readFileSync(join(TAGS_DIR, file), "utf8");
  const keys = new Set();
  for (const m of src.matchAll(/^\s*"((?:[^"\\]|\\.)+)":/gm)) keys.add(m[1]);
  return keys;
}

function checkTagParity() {
  const vi = tagKeysOf("vi.ts");
  const problems = [];
  for (const loc of ["en", "ko", "ja", "zh"]) {
    const keys = tagKeysOf(`${loc}.ts`);
    for (const k of vi) if (!keys.has(k)) problems.push(`  tags/${loc}.ts is MISSING tag "${k}"`);
    for (const k of keys) if (!vi.has(k)) problems.push(`  tags/${loc}.ts has EXTRA tag "${k}" (not in tags/vi.ts)`);
  }
  return problems;
}

// Parity alone would not catch the real failure: a tag added to src/data that no dictionary
// knows about. That renders as the raw Vietnamese word in the Korean UI — the bug this
// dictionary exists to prevent — so check coverage against the data itself.
function checkTagCoverage() {
  const known = tagKeysOf("vi.ts");
  const seen = new Map(); // tag -> first file that used it
  for (const file of walk(join(ROOT, "src/data"), [], ".ts")) {
    for (const m of readFileSync(file, "utf8").matchAll(/^\s*tags:\s*\[([^\]]*)\]/gm)) {
      for (const q of m[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
        if (!seen.has(q[1])) seen.set(q[1], relative(ROOT, file));
      }
    }
  }
  return [...seen]
    .filter(([tag]) => !known.has(tag))
    .map(([tag, file]) => `  tag "${tag}" (${file}) has no entry in src/lib/i18n/tags/vi.ts`);
}

const parity = [...checkParity(), ...checkTagParity(), ...checkTagCoverage()];
const hardcoded = checkHardcoded();

if (parity.length) {
  console.error("✗ i18n key parity failures:\n" + parity.join("\n"));
}
if (hardcoded.length) {
  console.error(
    "\n✗ Hardcoded Vietnamese in JSX (route it through t(), or add `// i18n-ignore` if intentional):\n" +
      hardcoded.join("\n"),
  );
}

if (parity.length || hardcoded.length) {
  console.error(`\n${parity.length + hardcoded.length} i18n issue(s) found.`);
  process.exit(1);
}
console.log("✓ i18n OK — locales in parity, no hardcoded Vietnamese in JSX.");
