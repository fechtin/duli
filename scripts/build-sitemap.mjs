// Generate sitemap.xml + robots.txt from the content (Bible 004 §10).
// Run: npm run seo:build   (uses Node's TS type-stripping to import the seed module)
//
// URLs carry the country prefix (/vn, /kr). Country-less links minted before the Korea
// atlas still work — the Worker 301s them to /vn/… — but only the canonical form is listed.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { destinations } from "../src/data/destinations.ts";
import { destinationsKr } from "../src/data/kr/index.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);

const SITE = (process.env.SITE_URL || "https://vietnam-atlas.pages.dev").replace(/\/$/, "");
const geoMeta = (cc) => JSON.parse(readFileSync(r(`src/data/generated/geo-meta.${cc}.json`), "utf8"));

const ATLASES = [
  { cc: "vn", geo: geoMeta("vn"), destinations },
  { cc: "kr", geo: geoMeta("kr"), destinations: destinationsKr },
];

const urls = ["/"];
for (const { cc, geo, destinations: dests } of ATLASES) {
  const activeProvinces = new Set(dests.map((d) => d.provinceSlug));
  urls.push(`/${cc}`);
  for (const p of geo.provinces) if (activeProvinces.has(p.slug)) urls.push(`/${cc}/${p.slug}`);
  for (const d of dests) urls.push(`/${cc}/${d.provinceSlug}/${d.slug}`);
}

const body = urls
  .map((u) => `  <url><loc>${SITE}${u}</loc><changefreq>weekly</changefreq></url>`)
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(r("public/sitemap.xml"), xml);
writeFileSync(r("public/robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`[build-sitemap] ${urls.length} URLs -> public/sitemap.xml (+ robots.txt)`);
