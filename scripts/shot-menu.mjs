// Screenshot with an interaction: node scripts/shot-menu.mjs <url> <out> <selector> [w] [h]
import { chromium } from "playwright-core";

const [url, out, selector, w = "1440", h = "900"] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(5000);
if (selector) {
  await page.click(selector);
  await page.waitForTimeout(800);
}
await page.screenshot({ path: out });
console.log("shot:", out, "->", page.url());
await browser.close();
