// Guardrail for the ambient video layer (Bible 030 §8) — same shape as check:i18n / check:content.
// Fails if the manifest and the files on disk disagree, or if any clip busts the budget.
// Run: npm run check:video

import { existsSync, readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);

const MAX_BYTES = 900 * 1024;
const MAX_SECONDS = 6.5; // 030 §6.1 — duration is a linear multiplier on every viewer's data
const MANIFEST = r("src/data/generated/video-manifest.json");

if (!existsSync(MANIFEST)) {
  console.log("✓ no video manifest — ambient video not built, nothing to check");
  process.exit(0);
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const errors = [];
let checked = 0;
let totalBytes = 0;

let ffprobeMissing = false;
const probe = (file) => {
  if (ffprobeMissing) return null;
  try {
    return Number(
      execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], {
        encoding: "utf8",
      }).trim(),
    );
  } catch {
    ffprobeMissing = true; // absent (e.g. CI without ffmpeg) — size checks still apply
    return null;
  }
};

/** Every clip, tier 1 and 2 alike, resolved to the two files it must have on disk. */
const entries = [
  ...Object.entries(manifest.tier1 ?? {}).map(([seed, e]) => ({ seed, webm: e.webm, mp4: e.mp4, tier: 1 })),
  ...(manifest.tier2 ?? []).map((seed) => ({ seed, webm: `/video/${seed}.webm`, mp4: `/video/${seed}.mp4`, tier: 2 })),
];

for (const entry of entries) {
  const sizes = [];
  for (const kind of ["webm", "mp4"]) {
    const file = r(`public${entry[kind]}`);
    if (!existsSync(file)) {
      errors.push(`${entry.seed}: manifest lists a tier-${entry.tier} clip but ${entry[kind]} does not exist`);
      continue;
    }
    checked++;
    sizes.push(statSync(file).size);
    const dur = probe(file);
    if (dur !== null && dur > MAX_SECONDS) {
      errors.push(`${entry.seed}: ${kind} runs ${dur.toFixed(1)}s, over the ${MAX_SECONDS}s ambient limit`);
    }
  }
  if (!sizes.length) continue;
  const smallest = Math.min(...sizes);
  totalBytes += smallest;
  if (smallest > MAX_BYTES) {
    errors.push(
      `${entry.seed}: smaller codec is ${Math.round(smallest / 1024)} KB, over the ${Math.round(MAX_BYTES / 1024)} KB budget`,
    );
  }
}

if (ffprobeMissing) console.log("⚠ ffprobe not found — duration limits not verified, sizes were");
if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s) in the video manifest:\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(
  `✓ ${entries.length} clips (${checked} files, ${Math.round(totalBytes / 1024 / 1024)} MB served) — all within budget`,
);
