// Prove a hero photo actually MOVES, whichever mechanism is carrying it (Bible 030 §3).
//
//   node scripts/verify-motion.mjs <url> <outPrefix>
//
// Tier 2 (CSS Ken Burns) — screenshot across the animation and diff.
// Tier 1 (curated footage) — seek the element to fixed currentTime marks and diff, then let it
// run to the end and check that the settle back to the still is invisible.
//
// Why frame diffing and not a smarter check: perf metrics cannot tell a playing clip from a
// frozen one, and neither can "is the element there". An early build shipped a still image
// wrapped in a video codec (`zoompan` with d=1 does not accumulate zoom) and every measurement
// looked healthy. Only comparing pixels catches that.

import { chromium } from "playwright-core";
import sharp from "sharp";

const [url, out] = process.argv.slice(2);
if (!url || !out) {
  console.error("usage: node scripts/verify-motion.mjs <url> <outPrefix>");
  process.exit(1);
}

const shrink = (f) => sharp(f).greyscale().resize(160, 120, { fit: "fill" }).raw().toBuffer();
const mad = (a, b) => {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i]);
  return sum / a.length;
};

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });

// Whichever layer mounts first decides which set of checks runs.
const found = await page
  .waitForFunction(
    () => {
      const v = document.querySelector("video");
      if (v && v.duration) {
        v.pause(); // a tier-1 clip removes itself when it ends — freeze it before it escapes
        const r = v.getBoundingClientRect();
        return { kind: "video", dur: v.duration, box: { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) } };
      }
      const img = document.querySelector("img.ken-burns-settle");
      if (img) {
        const r = img.getBoundingClientRect();
        return { kind: "css", box: { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) } };
      }
      return null;
    },
    null,
    { timeout: 15000 },
  )
  .then((h) => h.jsonValue())
  .catch(() => null);

if (!found) {
  console.error("✗ neither a <video> nor a .ken-burns-settle photo appeared — the hero has no motion");
  await browser.close();
  process.exit(1);
}

const { kind, box: clip } = found;
console.log(`  mechanism       ${kind === "css" ? "CSS Ken Burns (tier 2)" : "curated footage (tier 1)"}`);
console.log(`  element size    ${clip.width}x${clip.height}`);

let drift = 0;
let settleDiff = null;

if (kind === "css") {
  // The animation is already running; sample it across its 6s span.
  const shots = [];
  for (const label of ["start", "mid", "end"]) {
    const f = `${out}-${label}.png`;
    await page.screenshot({ path: f, clip });
    shots.push(f);
    if (label !== "end") await page.waitForTimeout(2600);
  }
  const raw = await Promise.all(shots.map(shrink));
  drift = Math.max(mad(raw[0], raw[1]), mad(raw[0], raw[2]));
  console.log(`  start→mid       pixel diff ${mad(raw[0], raw[1]).toFixed(2)}`);
  console.log(`  start→end       pixel diff ${mad(raw[0], raw[2]).toFixed(2)}`);
  const resting = await page.evaluate(() => getComputedStyle(document.querySelector("img.ken-burns-settle")).transform);
  console.log(`  resting transform  ${resting}`);
  if (resting !== "matrix(1, 0, 0, 1, 0, 0)" && resting !== "none") {
    console.error("\n✗ the photo did not settle back to its natural framing");
    await browser.close();
    process.exit(1);
  }
} else {
  const marks = [0, found.dur / 4, found.dur / 2];
  const files = [];
  for (const t of marks) {
    await page.evaluate((tt) => {
      const v = document.querySelector("video");
      v.pause();
      v.currentTime = tt;
    }, t);
    await page.waitForTimeout(800);
    const f = `${out}-t${t.toFixed(1)}.png`;
    await page.screenshot({ path: f, clip });
    files.push(f);
  }
  const raw = await Promise.all(files.map(shrink));
  marks.slice(1).forEach((t, i) => console.log(`  t=0 → t=${t.toFixed(1)}s  pixel diff ${mad(raw[0], raw[i + 1]).toFixed(2)}`));
  drift = Math.max(...raw.slice(1).map((b) => mad(raw[0], b)));

  // Let it play through and confirm the unmount is invisible.
  await page.reload({ waitUntil: "networkidle" });
  let sawVideo = false;
  let before = null;
  let after = null;
  for (let i = 0; i < 250; i++) {
    const s = await page.evaluate(() => {
      const v = document.querySelector("video");
      return v ? { n: 1, t: v.currentTime, dur: v.duration, loop: v.loop } : { n: 0 };
    });
    if (s.n) {
      sawVideo = true;
      if (s.loop) {
        console.error("✗ the element has loop=true — curated clips play once and settle (030 §6.2)");
        await browser.close();
        process.exit(1);
      }
      if (s.t > s.dur - 0.2) {
        before = `${out}-settle-before.png`;
        await page.screenshot({ path: before, clip });
      }
    } else if (sawVideo) {
      await page.waitForTimeout(300);
      after = `${out}-settle-after.png`;
      await page.screenshot({ path: after, clip });
      break;
    }
    await page.waitForTimeout(100);
  }
  if (!before || !after) {
    console.error("✗ the clip never finished and unmounted — it should play once and settle (030 §6.2)");
    await browser.close();
    process.exit(1);
  }
  const [a, b] = await Promise.all([before, after].map(shrink));
  settleDiff = mad(a, b);
  console.log(`  settle: last frame vs still  pixel diff ${settleDiff.toFixed(2)}`);
}

await browser.close();

if (drift < 2) {
  console.error(`\n✗ frames barely differ (${drift.toFixed(2)}) — nothing is actually moving (030 §9.1)`);
  process.exit(1);
}
if (settleDiff !== null && settleDiff > 4) {
  console.error("\n✗ visible pop when the clip unmounts — check the aspect crop and the fade-out (030 §6.2)");
  process.exit(1);
}
console.log(`\n✓ the hero moves${settleDiff !== null ? ", and settles back into the still invisibly" : " and settles at its natural framing"}`);
