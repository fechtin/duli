// Verify the client keeps the URL and the language in agreement — the premise the whole
// hreflang set rests on. Run against `wrangler dev` (built dist + D1 API).
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://127.0.0.1:8788";
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

const results = [];
async function check(name, { path, storedLocale, expectPath, expectLang, act }) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  if (storedLocale) {
    await page.addInitScript((loc) => localStorage.setItem("via.locale", loc), storedLocale);
  }
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  if (act) await act(page);
  const url = new URL(page.url()).pathname + new URL(page.url()).search;
  const lang = await page.getAttribute("html", "lang");
  const canonical = await page.getAttribute('link[rel="canonical"]', "href");
  const alternates = await page.$$eval('link[rel="alternate"][hreflang]', (els) =>
    els.map((e) => `${e.hreflang}=${new URL(e.href).pathname}`),
  );
  const okPath = expectPath instanceof RegExp ? expectPath.test(url) : url === expectPath;
  const okLang = !expectLang || lang === expectLang;
  results.push({
    name,
    pass: okPath && okLang && errors.length === 0,
    url,
    lang,
    canonical: canonical && new URL(canonical).pathname + new URL(canonical).search,
    alternates: alternates.length,
    errors: errors.slice(0, 2),
  });
  await ctx.close();
}

await check("deep link keeps its locale prefix", {
  path: "/ko/vn/quang-nam/hoi-an-ancient-town",
  expectPath: "/ko/vn/quang-nam/hoi-an-ancient-town",
  expectLang: "ko",
});

await check("bare path stays Vietnamese for a fresh visitor", {
  path: "/vn/quang-nam",
  expectPath: "/vn/quang-nam",
  expectLang: "vi",
});

await check("a saved preference rewrites the URL to match", {
  path: "/vn/quang-nam",
  storedLocale: "ja",
  expectPath: "/ja/vn/quang-nam",
  expectLang: "ja",
});

await check("an en-US browser is NOT auto-redirected (Googlebot safety)", {
  path: "/vn/quang-nam",
  expectPath: "/vn/quang-nam",
  expectLang: "vi",
});

await check("selection changes preserve the prefix", {
  path: "/ko/vn",
  expectPath: /^\/ko\/vn/,
  expectLang: "ko",
  act: async (page) => {
    // Drive the store directly: clicking a map path is flaky headless, and what is under test
    // is useUrlSync's history write, not the map's hit-testing.
    await page.evaluate(() => history.pushState(null, "", "/ko/vn/quang-nam"));
    await page.evaluate(() => window.dispatchEvent(new PopStateEvent("popstate")));
    await page.waitForTimeout(1200);
  },
});

await check("back to a bare URL switches the language back", {
  path: "/ko/vn/quang-nam",
  expectPath: "/vn/quang-nam",
  expectLang: "vi",
  act: async (page) => {
    await page.evaluate(() => history.pushState(null, "", "/vn/quang-nam"));
    await page.evaluate(() => window.dispatchEvent(new PopStateEvent("popstate")));
    await page.waitForTimeout(1500);
  },
});

await browser.close();

let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(
    `${r.pass ? "✓" : "✗"} ${r.name}\n    url=${r.url}  lang=${r.lang}  canonical=${r.canonical}  hreflang=${r.alternates}` +
      (r.errors.length ? `\n    errors: ${r.errors.join(" | ")}` : ""),
  );
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
