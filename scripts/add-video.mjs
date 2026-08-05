// Register curated real footage for a seed — tier 1 in Bible 030 §3.
//
// Takes a source clip, conforms it to the ambient budget, and registers it in the manifest with
// provenance. Everything else gets its motion from a CSS Ken Burns on the photo itself (030 §3.1);
// this is for the handful of places where something moves INSIDE the scene. Registering a seed
// here makes IllustratedImage play the footage instead of running the CSS move — no code change.
//
//   node scripts/add-video.mjs --seed halong-1 --file ~/clips/halong.mp4 \
//     --credit "Nguyen Van A" --license "CC BY 4.0" --url https://example.com/clip [--start 12]
//
//   --start   seconds into the source to begin (default 0) — pick the calmest 6 seconds
//   --no-loop skip the palindrome; use when the footage already loops seamlessly
//
// Output goes to public/video/curated/, which IS committed: real footage cannot be regenerated.

import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);

const SECONDS = 6; // 030 §6.1 — duration is a 1:1 multiplier on every viewer's data
const SIZE = { w: 800, h: 600 };
const FPS = 24;
const MAX_BYTES = 900 * 1024;

const CURATED = r("public/video/curated");
const MANIFEST = r("src/data/generated/video-manifest.json");
const IMAGES = r("src/data/generated/image-manifest.json");

// ── args ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const flag = (name) => argv.includes(`--${name}`);

const seed = arg("seed");
const file = arg("file");
const credit = arg("credit");
const license = arg("license");
const url = arg("url");
const start = Number(arg("start") ?? 0);
const loop = !flag("no-loop");

const missing = Object.entries({ seed, file, credit, license, url })
  .filter(([, v]) => !v)
  .map(([k]) => `--${k}`);
if (missing.length) {
  console.error(`✗ missing required argument(s): ${missing.join(", ")}\n`);
  console.error(readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(2, 16).join("\n"));
  process.exit(1);
}
if (!existsSync(file)) {
  console.error(`✗ source clip not found: ${file}`);
  process.exit(1);
}

// Provenance is not optional. Tier 1 is the tier where we make a claim about where footage came
// from, and an unattributed clip is exactly the failure mode the photo pipeline already fixed.
const images = JSON.parse(readFileSync(IMAGES, "utf8"));
if (!images[seed]) {
  console.error(`✗ "${seed}" is not a seed in image-manifest.json — a clip must belong to a real photo seed`);
  process.exit(1);
}

mkdirSync(CURATED, { recursive: true });
const tmp = `${CURATED}/.${seed}.master.mp4`;
const webm = `${CURATED}/${seed}.webm`;
const mp4 = `${CURATED}/${seed}.mp4`;

const ffmpeg = (args) =>
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: ["ignore", "ignore", "pipe"] });

// Conform: trim, strip audio, scale-and-crop to the ambient frame, drop to 24fps.
// `-an` removes the audio TRACK — ambient video is silent by design, and muted playback of a
// clip that still carries audio just pays for bytes nobody hears.
const conform =
  `scale=${SIZE.w}:${SIZE.h}:force_original_aspect_ratio=increase,` +
  `crop=${SIZE.w}:${SIZE.h},fps=${FPS},setpts=PTS-STARTPTS`;

console.log(`▸ conforming ${file} → ${SECONDS}s @ ${SIZE.w}x${SIZE.h} ${FPS}fps${loop ? " (palindrome)" : ""}`);
try {
  if (loop) {
    // Half the clip forward, then its reverse — a seamless loop out of footage that does not
    // naturally return to its first frame.
    const half = SECONDS / 2;
    ffmpeg([
      "-ss", String(start), "-t", String(half), "-i", file,
      "-filter_complex", `[0:v]${conform}[fw];[fw]split[a][b];[b]reverse[rv];[a][rv]concat=n=2:v=1:a=0[out]`,
      "-map", "[out]", "-an", "-pix_fmt", "yuv420p", "-c:v", "libx264", "-crf", "12", "-preset", "veryfast", tmp,
    ]);
  } else {
    ffmpeg([
      "-ss", String(start), "-t", String(SECONDS), "-i", file,
      "-vf", conform, "-an", "-pix_fmt", "yuv420p", "-c:v", "libx264", "-crf", "12", "-preset", "veryfast", tmp,
    ]);
  }

  // Encode both and keep both: which codec wins depends on the content, not on the codec
  // (measured — see docs/030 §6). The client picks per browser; the budget applies to the smaller.
  ffmpeg(["-i", tmp, "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-g", "60",
          "-pix_fmt", "yuv420p", "-an", webm]);
  ffmpeg(["-i", tmp, "-c:v", "libx264", "-crf", "28", "-preset", "slow", "-profile:v", "main", "-g", "60",
          "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", mp4]);
} catch (e) {
  console.error(`✗ ffmpeg failed: ${String(e.stderr ?? e).slice(0, 400)}`);
  rmSync(tmp, { force: true });
  process.exit(1);
} finally {
  rmSync(tmp, { force: true });
}

const bytes = { webm: statSync(webm).size, mp4: statSync(mp4).size };
const kb = (n) => Math.round(n / 1024);
const smallest = Math.min(bytes.webm, bytes.mp4);

if (smallest > MAX_BYTES) {
  rmSync(webm, { force: true });
  rmSync(mp4, { force: true });
  console.error(
    `✗ ${kb(smallest)} KB — over the ${kb(MAX_BYTES)} KB budget. Try a calmer ${SECONDS}s window ` +
      `(--start), or footage with less motion/grain. Nothing was registered.`,
  );
  process.exit(1);
}

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : { tier1: {} };
manifest.tier1 = manifest.tier1 ?? {};
manifest.tier1[seed] = {
  webm: `/video/curated/${seed}.webm`,
  mp4: `/video/curated/${seed}.mp4`,
  source: { url, credit, license },
};
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

console.log(`✓ ${seed} registered as tier-1 footage — webm ${kb(bytes.webm)} KB · mp4 ${kb(bytes.mp4)} KB`);
console.log(`  files: public/video/curated/${seed}.{webm,mp4}  (committed — real footage is not regenerable)`);
console.log(`  credit: ${credit} · ${license} · ${url}`);
console.log(`\n  Next, verify it moves and settles cleanly:`);
console.log(`    node scripts/verify-motion.mjs "http://localhost:5173/<path to the destination>" /tmp/v-${seed}`);
