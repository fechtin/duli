// SPIKE (030) — does clip DURATION cost anything at load or interaction time?
// Compares an 8s loop against a 32s loop of the same move. Usage:
//   node scripts/perf-duration.mjs [baseUrl]
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:5173";
const DEST = "/vn/quang-ninh/ha-long-bay";

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

async function measure(label, suffix) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Bytes actually transferred, sampled continuously so we can ask "how many by first frame?"
  let videoBytes = 0;
  page.on("response", (r) => {
    if (/\.(webm|mp4)$/.test(new URL(r.url()).pathname)) {
      r.body()
        .then((b) => (videoBytes += b.length))
        .catch(() => {});
    }
  });

  await page.addInitScript(() => {
    window.__lcp = 0;
    window.__firstFrame = null;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    // Stamp the moment the first video frame is actually on screen.
    const iv = setInterval(() => {
      const v = document.querySelector("video");
      if (!v) return;
      v.addEventListener(
        "playing",
        () => {
          if (window.__firstFrame === null) window.__firstFrame = performance.now();
        },
        { once: true },
      );
      clearInterval(iv);
    }, 50);
  });

  const t0 = Date.now();
  await page.goto(base + DEST + suffix, { waitUntil: "commit" });

  // Poll until the first frame paints, so we capture bytes-at-that-instant rather than after.
  let firstFrame = null;
  let bytesAtFirstFrame = null;
  for (let i = 0; i < 240; i++) {
    firstFrame = await page.evaluate(() => window.__firstFrame);
    if (firstFrame !== null) {
      bytesAtFirstFrame = videoBytes;
      break;
    }
    await page.waitForTimeout(100);
  }

  await page.waitForTimeout(12000); // let it stream well past the 8s clip's full length
  const lcp = await page.evaluate(() => window.__lcp);
  const bytesAt12s = videoBytes;

  // Responsiveness: main-thread frame pacing during a real drag on the map.
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
  await page.mouse.move(600, 450);
  await page.mouse.down();
  for (let i = 0; i < 100; i++) {
    await page.mouse.move(600 + Math.sin(i / 7) * 200, 450 + Math.cos(i / 9) * 120);
    await page.waitForTimeout(12);
  }
  await page.mouse.up();
  const frames = (await page.evaluate(() => ((window.__stop = true), window.__frames.slice(1)))).sort((a, b) => a - b);
  const avg = frames.reduce((s, x) => s + x, 0) / (frames.length || 1);

  const info = await page.evaluate(() => {
    const v = document.querySelector("video");
    if (!v) return null;
    const buf = [];
    for (let i = 0; i < v.buffered.length; i++) buf.push(+v.buffered.end(i).toFixed(1));
    return { dur: +v.duration.toFixed(1), t: +v.currentTime.toFixed(1), bufferedTo: buf };
  });

  await ctx.close();
  return {
    label,
    lcp: Math.round(lcp),
    firstFrameMs: firstFrame === null ? null : Math.round(firstFrame),
    kbAtFirstFrame: bytesAtFirstFrame === null ? null : Math.round(bytesAtFirstFrame / 1024),
    kbAt12s: Math.round(bytesAt12s / 1024),
    fps: +(1000 / avg).toFixed(1),
    p95: +(frames[Math.floor(frames.length * 0.95)] ?? 0).toFixed(2),
    longFrames: frames.filter((f) => f > 33).length,
    samples: frames.length,
    info,
    wall: Date.now() - t0,
  };
}

// A no-video arm in the SAME scenario, so the FPS number has something to be compared against.
const none = await measure("no video (baseline)", "?novideo=1");
const short = await measure("8s loop  (639 KB total)", "");
const long = await measure("32s loop (1744 KB total)", "?longclip=1");
await browser.close();

for (const r of [none, short, long]) {
  console.log(`\n── ${r.label} ──────────────────────────`);
  console.log(`  LCP                       ${r.lcp} ms`);
  console.log(`  first video frame on screen  ${r.firstFrameMs} ms after navigation`);
  console.log(`  video KB transferred by then ${r.kbAtFirstFrame} KB`);
  console.log(`  video KB transferred by 12s  ${r.kbAt12s} KB`);
  console.log(`  FPS during drag           ${r.fps}  (p95 ${r.p95}ms, ${r.longFrames}/${r.samples} > 33ms)`);
  console.log(`  element                   ${JSON.stringify(r.info)}`);
}
