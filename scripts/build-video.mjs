// Generate tier-2 ambient clips (Bible 030 §3) — a slow Ken Burns move over a photo we have
// already verified, so the Atlas has motion everywhere without any new licensing question.
//
// For each eligible seed:
//   1. render a palindrome master (move forward, then the same move reversed → seamless loop)
//   2. encode VP9/WebM and H.264/MP4
//   3. keep BOTH (browsers differ) but record which is smaller, and fail the seed if the
//      smaller one still busts the byte budget
// Writes src/data/generated/video-manifest.json.
//
// Resumable: a seed whose two files already exist is skipped, so this can be run in batches.
//
//   npm run video:build                    → every eligible seed not yet rendered
//   ONLY=halong-1,hoian-1 npm run video:build
//   LIMIT=10 npm run video:build           → first 10 pending seeds (batching)
//   FORCE=1 npm run video:build            → re-render even if files exist, retry over-budget seeds
//
// Requires ffmpeg on PATH (brew install ffmpeg).

import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { destinations } from "../src/data/destinations.ts";
import { destinationsKr } from "../src/data/kr/index.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);

// ── Budget (Bible 030 §6) ────────────────────────────────────────────────────
// Play ONCE and settle, never loop (030 §6.2). The move goes in and comes back out, so BOTH ends
// sit on exactly the poster framing: nothing jumps when the clip fades in, and when it finishes
// the client drops the <video> and the still shows through with no visible change at all.
// One pass instead of an endless loop is what frees the decode slot and the memory.
const MOVE_SECONDS = 3; // mirrored → a 6s one-shot
// 24fps, not 30: an ambient drift has no fast motion to resolve, and it saves ~20% of the bytes
// that every viewer pays for on every visit (030 §6.1).
const FPS = 24;
// Peak zoom at the midpoint; both ends sit at 1.00 = the poster framing.
const ZOOM = 0.22;
// The panel hero paints at ~400 CSS px, so 800px covers 2x displays. Rendering at 900+ spent
// bytes on detail no one can see and pushed a third of the seeds over budget.
const HERO = { w: 800, h: 600 };
const CRF = { vp9: 36, x264: 28 };
const MAX_BYTES = 900 * 1024;

const OUT_DIR = r("public/video");
const MANIFEST = r("src/data/generated/video-manifest.json");
const TMP = r("public/video/.tmp");

const only = process.env.ONLY ? new Set(process.env.ONLY.split(",").map((s) => s.trim())) : null;
const limit = process.env.LIMIT ? Number(process.env.LIMIT) : Infinity;
const force = process.env.FORCE === "1";

const images = JSON.parse(readFileSync(r("src/data/generated/image-manifest.json"), "utf8"));

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: ["ignore", "ignore", "pipe"] });
}

/** The hero seed of a destination is the first gallery image — the one the panel paints. */
function heroSeed(d) {
  return d.gallery?.[0]?.seed ?? null;
}

// Tier 2 covers `featured` destinations that actually have a verified photo. A seed with no
// photo falls to tier 3 (no video) — we never animate the illustrated fallback (030 §3).
const eligible = [];
const seen = new Set();
for (const d of [...destinations, ...destinationsKr]) {
  if (!d.featured) continue;
  const seed = heroSeed(d);
  if (!seed || seen.has(seed)) continue;
  const photo = images[seed];
  if (!photo?.src) continue;
  seen.add(seed);
  eligible.push({ seed, src: photo.src, name: d.name });
}

// Seeds whose photo is too detailed to fit the budget. Without this memo every run re-renders
// them, fails them again, and throws the work away — the encode is the slow part of this script.
const OVERSIZE_MEMO = r("scripts/.video-oversize.json");
const knownOversize = new Set(existsSync(OVERSIZE_MEMO) ? JSON.parse(readFileSync(OVERSIZE_MEMO, "utf8")) : []);

// A seed with curated real footage never needs a generated stand-in (030 §3).
const curated = new Set(Object.keys(existsSync(MANIFEST) ? (JSON.parse(readFileSync(MANIFEST, "utf8")).tier1 ?? {}) : {}));

const pending = eligible
  .filter((e) => !curated.has(e.seed))
  .filter((e) => (only ? only.has(e.seed) : true))
  .filter((e) => force || only || !knownOversize.has(e.seed))
  .filter((e) => force || !(existsSync(`${OUT_DIR}/${e.seed}.webm`) && existsSync(`${OUT_DIR}/${e.seed}.mp4`)))
  .slice(0, limit);

console.log(`▸ ${eligible.length} eligible seeds, ${pending.length} to render (budget ${Math.round(MAX_BYTES / 1024)} KB/clip)`);

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(TMP, { recursive: true });

// Tier-1 entries are hand-curated real footage with provenance; we carry them through untouched.
// Tier 2 is a bare seed list — paths are conventional (`/video/<seed>.{webm,mp4}`), and spelling
// them out per seed cost ~13 KB of client bundle at full scale, blowing the JS budget (030 §9).
const prev = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
const manifest = { tier1: prev.tier1 ?? {}, tier2: [] };
const rendered = new Set();
const oversized = [];

for (const [i, item] of pending.entries()) {
  const { seed, src } = item;
  const input = r(`public${src}`);
  if (!existsSync(input)) {
    console.log(`  ✗ ${seed} — source photo missing at ${src}`);
    continue;
  }
  const master = `${TMP}/${seed}.mp4`;
  const webm = `${OUT_DIR}/${seed}.webm`;
  const mp4 = `${OUT_DIR}/${seed}.mp4`;
  const frames = MOVE_SECONDS * FPS;

  // A single input frame with d=<frames> and an `on`-driven ramp. NOT d=1 — with d=1 the zoom
  // accumulator does not carry and the result is a still image wrapped in a video codec, which
  // no perf metric can detect (030 §9.1). Upscale first so the zoomed-in start stays sharp.
  //
  // The ramp runs UP to peak zoom, and `reverse`+`concat` mirrors it back down, so the FIRST and
  // LAST frames are both the poster, pixel for pixel. That is what makes both the fade-in and the
  // unmount-on-end invisible.
  //
  // The centre crop to the target aspect BEFORE zoompan is load-bearing: zoompan's `s=` scales
  // non-uniformly, so feeding it a 1.43 photo and asking for 4:3 squashed the frame horizontally
  // — the settle-back to the poster (which <img object-cover> centre-crops) was then visibly off.
  const kenBurns =
    `[0:v]scale=${HERO.w * 4}:-2,` +
    `crop='min(iw,ih*${HERO.w}/${HERO.h})':'min(ih,iw*${HERO.h}/${HERO.w})',` +
    `zoompan=z='1+${ZOOM}*on/${frames - 1}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':` +
    `d=${frames}:s=${HERO.w}x${HERO.h}:fps=${FPS}[fw];` +
    `[fw]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[out]`;

  try {
    ffmpeg(["-i", input, "-filter_complex", kenBurns, "-map", "[out]", "-an", "-pix_fmt", "yuv420p",
            "-c:v", "libx264", "-crf", "12", "-preset", "veryfast", master]);
    // -an on every encode: no audio TRACK at all, not merely muted playback (030 §6).
    ffmpeg(["-i", master, "-c:v", "libvpx-vp9", "-crf", String(CRF.vp9), "-b:v", "0", "-row-mt", "1",
            "-g", "60", "-pix_fmt", "yuv420p", "-an", webm]);
    ffmpeg(["-i", master, "-c:v", "libx264", "-crf", String(CRF.x264), "-preset", "slow", "-profile:v", "main",
            "-g", "60", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", mp4]);
  } catch (e) {
    console.log(`  ✗ ${seed} — ffmpeg failed: ${String(e.stderr ?? e).slice(0, 200)}`);
    continue;
  } finally {
    rmSync(master, { force: true });
  }

  const bytes = { webm: statSync(webm).size, mp4: statSync(mp4).size };
  const smallest = Math.min(bytes.webm, bytes.mp4);
  const kb = (n) => Math.round(n / 1024);

  if (smallest > MAX_BYTES) {
    // Never ship over budget. Drop the files so the seed cleanly falls back to the still photo.
    rmSync(webm, { force: true });
    rmSync(mp4, { force: true });
    oversized.push(`${seed} (${kb(smallest)} KB)`);
    knownOversize.add(seed);
    console.log(`  ✗ ${seed} — ${kb(smallest)} KB over the ${kb(MAX_BYTES)} KB budget, dropped`);
    continue;
  }

  rendered.add(seed);
  console.log(
    `  ✓ ${String(i + 1).padStart(3)}/${pending.length} ${seed}  webm ${kb(bytes.webm)} KB · mp4 ${kb(bytes.mp4)} KB` +
      `  (${bytes.webm < bytes.mp4 ? "webm" : "mp4"} smaller)`,
  );
}

// Rebuild the tier-2 list from what is actually on disk, not from what this run happened to
// render. Skipped-because-already-present seeds must still make the manifest, and a clip deleted
// by hand must drop out of it — otherwise the two silently drift apart.
manifest.tier2 = eligible
  .map((e) => e.seed)
  .filter((seed) => !curated.has(seed))
  .filter((seed) => existsSync(`${OUT_DIR}/${seed}.webm`) && existsSync(`${OUT_DIR}/${seed}.mp4`))
  .sort();

rmSync(TMP, { recursive: true, force: true });
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
writeFileSync(OVERSIZE_MEMO, JSON.stringify([...knownOversize].sort(), null, 2) + "\n");

const total = manifest.tier2.reduce(
  (s, seed) => s + Math.min(statSync(`${OUT_DIR}/${seed}.webm`).size, statSync(`${OUT_DIR}/${seed}.mp4`).size),
  0,
);
console.log(
  `\n▸ manifest: ${manifest.tier2.length} tier-2 + ${Object.keys(manifest.tier1).length} tier-1 clips, ` +
    `${Math.round(total / 1024 / 1024)} MB (smaller codec), ${rendered.size} rendered this run`,
);
if (oversized.length) console.log(`▸ over budget, dropped: ${oversized.join(", ")}`);
