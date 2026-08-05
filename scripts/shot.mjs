// Headless screenshots for visual verification (see MEMORY: always verify the map visually).
// Usage: node scripts/shot.mjs <url> <outfile> [waitMs] [width] [height]
import { chromium } from "playwright-core";

const [url, out, waitMs = "6000", w = "1440", h = "900"] = process.argv.slice(2);

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(+waitMs);
await page.screenshot({ path: out });
console.log("url:", page.url());
if (errors.length) console.log("errors:\n" + errors.slice(0, 8).join("\n"));
await browser.close();
