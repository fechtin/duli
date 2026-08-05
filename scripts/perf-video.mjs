// SPIKE (030) — A/B perf harness for the ambient video layer.
// Runs the SAME build twice: once normally, once with the `?novideo=1` kill switch.
// Usage: node scripts/perf-video.mjs <baseUrl>
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:5173";
const DEST = "/vn/quang-ninh/ha-long-bay";

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

async function measure(label, suffix) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  // Count video bytes actually pulled over the wire.
  let videoBytes = 0;
  let videoRequests = 0;
  page.on("response", async (r) => {
    if (/\.(webm|mp4)$/.test(new URL(r.url()).pathname)) {
      videoRequests++;
      const len = r.headers()["content-length"];
      if (len) videoBytes += Number(len);
    }
  });

  // LCP observer must be installed before navigation.
  await page.addInitScript(() => {
    window.__lcp = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });

  await page.goto(base + DEST + suffix, { waitUntil: "networkidle" });
  await page.waitForTimeout(5000); // let idle gates fire and the clip start

  const lcp = await page.evaluate(() => window.__lcp);

  const heroVideos = await page.evaluate(() => document.querySelectorAll("video").length);

  // Now the map scenario: close the panel (frees the hero decode slot, as it would in real
  // use), zoom past level 4 so living medallions arm, and let them settle.
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  const mapEl = page.locator('[role="application"]');
  for (let i = 0; i < 14; i++) {
    await page.mouse.move(700, 450);
    await page.mouse.wheel(0, -260);
    await page.waitForTimeout(140);
  }
  await page.waitForTimeout(3500);
  const zoomLevel = await mapEl.getAttribute("data-zoom-level");

  await page.evaluate(() => {
    window.__frames = [];
    let last = performance.now();
    window.__stop = false;
    const tick = (t) => {
      window.__frames.push(t - last);
      last = t;
      if (!window.__stop) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  // A real drag across the map: 120 mouse moves over ~2s.
  await page.mouse.move(700, 450);
  await page.mouse.down();
  for (let i = 0; i < 120; i++) {
    await page.mouse.move(700 + Math.sin(i / 8) * 220, 450 + Math.cos(i / 11) * 130);
    await page.waitForTimeout(12);
  }
  await page.mouse.up();

  const frames = await page.evaluate(() => {
    window.__stop = true;
    return window.__frames.slice(1);
  });

  const playing = await page.evaluate(() =>
    [...document.querySelectorAll("video")].map((v) => ({
      src: v.currentSrc.split("/").pop(),
      paused: v.paused,
      t: +v.currentTime.toFixed(2),
      w: v.videoWidth,
    })),
  );

  frames.sort((a, b) => a - b);
  const pct = (p) => frames[Math.floor(frames.length * p)] ?? 0;
  const avg = frames.reduce((s, x) => s + x, 0) / (frames.length || 1);

  await ctx.close();
  return {
    label,
    lcp: Math.round(lcp),
    heroVideos,
    zoomLevel,
    fpsAvg: +(1000 / avg).toFixed(1),
    frameAvg: +avg.toFixed(2),
    frameP95: +pct(0.95).toFixed(2),
    frameWorst: +(frames[frames.length - 1] ?? 0).toFixed(2),
    longFrames: frames.filter((f) => f > 33).length,
    samples: frames.length,
    videoRequests,
    videoKB: Math.round(videoBytes / 1024),
    videos: playing,
    errors: errors.slice(0, 5),
  };
}

const off = await measure("VIDEO OFF (?novideo=1)", "?novideo=1");
const on = await measure("VIDEO ON", "");
await browser.close();

for (const r of [off, on]) {
  console.log(`\n── ${r.label} ─────────────────────────────`);
  console.log(`  LCP              ${r.lcp} ms   (hero <video> mounted: ${r.heroVideos})`);
  console.log(`  zoom level       ${r.zoomLevel}`);
  console.log(`  FPS (pan/drag)   ${r.fpsAvg}  (avg frame ${r.frameAvg}ms, p95 ${r.frameP95}ms, worst ${r.frameWorst}ms)`);
  console.log(`  frames > 33ms    ${r.longFrames} / ${r.samples}`);
  console.log(`  video fetched    ${r.videoRequests} req, ${r.videoKB} KB`);
  console.log(`  <video> elements ${JSON.stringify(r.videos)}`);
  if (r.errors.length) console.log(`  errors: ${r.errors.join(" | ")}`);
}
console.log(`\n── DELTA ─────────────────────────────`);
console.log(`  LCP   ${on.lcp - off.lcp >= 0 ? "+" : ""}${on.lcp - off.lcp} ms`);
console.log(`  FPS   ${(on.fpsAvg - off.fpsAvg).toFixed(1)}`);
