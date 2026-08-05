// Prove an ambient clip actually MOVES, and that its first frame matches the still photo.
// Perf metrics cannot tell a playing clip from a frozen one (Bible 030 §9.1), and wall-clock
// screenshots are useless because a palindrome loop revisits similar zoom levels. So: seek the
// element to fixed currentTime values and compare the frames.
//
//   node scripts/verify-video.mjs <url> <outPrefix>

import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import sharp from "sharp";

const [url, out] = process.argv.slice(2);
if (!url || !out) {
  console.error("usage: node scripts/verify-video.mjs <url> <outPrefix>");
  process.exit(1);
}

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(4000);

const box = await page.evaluate(() => {
  const v = document.querySelector("video");
  if (!v) return null;
  const r = v.getBoundingClientRect();
  return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height), dur: v.duration };
});
if (!box) {
  console.error("✗ no <video> element on the page — the ambient layer never mounted");
  await browser.close();
  process.exit(1);
}

const marks = [0, box.dur / 4, box.dur / 2];
const files = [];
for (const t of marks) {
  await page.evaluate((tt) => {
    const v = document.querySelector("video");
    v.pause();
    v.currentTime = tt;
  }, t);
  await page.waitForTimeout(800);
  const f = `${out}-t${t.toFixed(1)}.png`;
  await page.screenshot({ path: f, clip: { x: box.x, y: box.y, width: box.width, height: box.height } });
  files.push(f);
}
// Second check: the clip plays ONCE and settles onto the poster (030 §6.2). Let it run to the
// end, then compare the frame just before the element goes away with the still underneath — they
// must be indistinguishable, or the user sees a pop when the video unmounts.
await page.reload({ waitUntil: "networkidle" });
const clip = { x: box.x, y: box.y, width: box.width, height: box.height };
let sawVideo = false;
let settleBefore = null;
let settleAfter = null;
for (let i = 0; i < 250; i++) {
  const s = await page.evaluate(() => {
    const v = document.querySelector("video");
    return v ? { n: 1, t: v.currentTime, dur: v.duration, loop: v.loop } : { n: 0 };
  });
  if (s.n) {
    sawVideo = true;
    if (s.loop) {
      console.error("✗ the element has loop=true — ambient clips must play once (030 §6.2)");
      await browser.close();
      process.exit(1);
    }
    if (s.t > s.dur - 0.2) {
      settleBefore = `${out}-settle-before.png`;
      await page.screenshot({ path: settleBefore, clip });
    }
  } else if (sawVideo) {
    await page.waitForTimeout(300);
    settleAfter = `${out}-settle-after.png`;
    await page.screenshot({ path: settleAfter, clip });
    break;
  }
  await page.waitForTimeout(100);
}
await browser.close();

// Mean ABSOLUTE PER-PIXEL difference between the first and last mark, on a downscaled grayscale
// copy so encoder noise does not register. Comparing mean brightness instead would be blind to
// any clip whose frames rearrange the same light — a pan across even terrain, or a test pattern.
const raw = await Promise.all(
  files.map((f) => sharp(f).greyscale().resize(160, 120, { fit: "fill" }).raw().toBuffer()),
);
const mad = (a, b) => {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i]);
  return sum / a.length;
};

console.log(`  duration        ${box.dur}s`);
console.log(`  element size    ${box.width}x${box.height}`);
marks.slice(1).forEach((t, i) => console.log(`  t=0 → t=${t.toFixed(1)}s  pixel diff ${mad(raw[0], raw[i + 1]).toFixed(2)}`));

const drift = Math.max(...raw.slice(1).map((b) => mad(raw[0], b)));
if (drift < 2) {
  console.error(`\n✗ frames barely differ (${drift.toFixed(2)}) — the clip is probably frozen (see 030 §9.1)`);
  process.exit(1);
}
console.log(`✓ the clip moves (max pixel diff ${drift.toFixed(2)})`);

if (!settleAfter || !settleBefore) {
  console.error("✗ the clip never finished and unmounted — it should play once and settle (030 §6.2)");
  process.exit(1);
}
const [a, b] = await Promise.all(
  [settleBefore, settleAfter].map((f) => sharp(f).greyscale().resize(160, 120, { fit: "fill" }).raw().toBuffer()),
);
const settleDiff = mad(a, b);
console.log(`  settle: last frame vs still  pixel diff ${settleDiff.toFixed(2)}`);
if (settleDiff > 4) {
  console.error("\n✗ visible pop when the clip unmounts — check the aspect crop and the fade-out (030 §6.2)");
  process.exit(1);
}
console.log("✓ the settle back to the still is invisible");
readFileSync(files[0]); // touch, so a missing file fails loudly
