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
import { SITE_URL } from "./site.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);

const SITE = SITE_URL;

// Crawlers Cloudflare's "Managed robots.txt" (AI Crawl Control) blocks by default. We want the
// atlas quoted and cited, so each one gets an explicit Allow group: per the robots.txt spec a
// group is merged by user-agent and, between an Allow and a Disallow of equal specificity, the
// least restrictive rule wins. That only re-opens well-behaved crawlers — the dashboard toggle
// is still the real fix. See tasks/todo.md §032.
const AI_CRAWLERS = [
  "Amazonbot",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "ClaudeBot",
  "GPTBot",
  "Google-Extended",
  "OAI-SearchBot",
  "PerplexityBot",
  "meta-externalagent",
];
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

const robots = `# FechTin Go — crawling policy.
# AI crawlers are welcome: this atlas exists to be found, quoted and cited.
#
# NOTE: Cloudflare's "Managed robots.txt" (AI Crawl Control) prepends its own block to this
# file at the edge. The Allow groups below re-open the crawlers it blocks, but the dashboard
# toggle is the authoritative switch — check the served /robots.txt, not this file.

User-agent: *
Content-Signal: search=yes,ai-train=yes,ai-input=yes
Allow: /

${AI_CRAWLERS.map((ua) => `User-agent: ${ua}\nAllow: /`).join("\n\n")}

Sitemap: ${SITE}/sitemap.xml
`;

writeFileSync(r("public/sitemap.xml"), xml);
writeFileSync(r("public/robots.txt"), robots);

console.log(`[build-sitemap] ${urls.length} URLs -> public/sitemap.xml (+ robots.txt)`);
