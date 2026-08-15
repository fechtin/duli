// Normalise every Chinese string in the repo to Simplified, and keep it that way.
//
//   node scripts/zh-simplify.mjs           rewrite files in place
//   node scripts/zh-simplify.mjs --check   report drift and exit non-zero  (npm run check:zh)
//
// Why this exists: the atlas shipped one `zh` locale written in two scripts — the Korea content
// was authored in Traditional, the Vietnam content in Simplified, and the UI strings were a mix
// of both. A reader switching atlas got their writing system switched with it, and hreflang
// could only honestly claim a script-less "zh". One locale, one script.
//
// Two rules keep this from destroying content:
//
//  1. Preset `t` -> `cn`, never `tw` -> `cn`. The Taiwan presets also rewrite VOCABULARY
//     (資訊 -> 信息, 網路 -> 网络). We want script normalisation, not dialect translation —
//     `tw` touched 12 Vietnamese files that were already Simplified; `t` touches 6 that genuinely
//     still hold Traditional characters.
//
//  2. Japanese is never converted. Japanese kanji share glyphs with Traditional Chinese
//     (観光/觀光, 韓国/韓國) and much Japanese copy here has no kana to detect it by — the
//     restaurant names are bare kanji. So conversion is scoped by DECLARATION, not by
//     character-sniffing: whole file only when the file is unambiguously zh, otherwise the
//     named zh block inside a file that holds several locales at once.

import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";
import * as OpenCC from "opencc-js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const r = (p) => resolve(ROOT, p);
const convert = OpenCC.Converter({ from: "t", to: "cn" });

const CHECK = process.argv.includes("--check");

/** Files whose entire contents are Chinese copy. */
function wholeFileTargets() {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.zh\.ts$/.test(entry.name)) out.push(p);
    }
  };
  walk(r("src"));
  out.push(r("src/lib/i18n/locales/zh.ts"), r("src/lib/i18n/tags/zh.ts"));
  return out.filter((p) => statSync(p).isFile());
}

/**
 * Files holding several locales side by side. `markers` name the start of each zh declaration;
 * only the braces that follow are converted, so the Japanese block two lines up is untouched.
 */
const SCOPED = [
  { file: "src/data/kr/living-i18n.ts", markers: ["const seasonalZh", "\n  zh: {"] },
  { file: "src/data/kr/i18n/restaurants.ts", markers: ["const zh"] },
];

/**
 * Span of the `{...}` block that follows `marker`, skipping braces that live inside string
 * literals — the copy contains "{count}" placeholders that would otherwise unbalance the count.
 */
function blockSpan(src, marker) {
  const at = src.indexOf(marker);
  if (at === -1) throw new Error(`marker not found: ${JSON.stringify(marker)}`);
  const open = src.indexOf("{", at);
  if (open === -1) throw new Error(`no block after marker: ${JSON.stringify(marker)}`);

  let depth = 0;
  let quote = null;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) return [open, i + 1];
  }
  throw new Error(`unbalanced block after ${JSON.stringify(marker)}`);
}

/** Single values inside a shared object, too small to have a block of their own. */
const INLINE = [
  {
    file: "src/lib/country/names.ts",
    // COUNTRY_LABELS: one line per country, every locale on it. Only the zh value converts.
    pattern: /(\bzh:\s*")([^"]*)(")/g,
  },
];

const drift = [];

function apply(path, next) {
  const rel = relative(ROOT, path);
  const current = readFileSync(path, "utf8");
  if (next === current) return;
  drift.push(rel);
  if (!CHECK) writeFileSync(path, next);
}

for (const path of wholeFileTargets()) {
  apply(path, convert(readFileSync(path, "utf8")));
}

for (const { file, markers } of SCOPED) {
  const path = r(file);
  let src = readFileSync(path, "utf8");
  for (const marker of markers) {
    const [start, end] = blockSpan(src, marker);
    src = src.slice(0, start) + convert(src.slice(start, end)) + src.slice(end);
  }
  apply(path, src);
}

for (const { file, pattern } of INLINE) {
  const path = r(file);
  const src = readFileSync(path, "utf8");
  apply(path, src.replace(pattern, (_, lead, value, tail) => lead + convert(value) + tail));
}

if (CHECK) {
  if (drift.length) {
    console.error(`✗ ${drift.length} file(s) hold Traditional Chinese in a zh string:`);
    for (const f of drift) console.error(`  ${f}`);
    console.error("\nRun `npm run fix:zh` to normalise them.");
    process.exit(1);
  }
  console.log("✓ zh OK — every Chinese string is Simplified.");
} else {
  console.log(`[zh-simplify] normalised ${drift.length} file(s) to Simplified.`);
}
