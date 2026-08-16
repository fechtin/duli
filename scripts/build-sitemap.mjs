// Generate sitemap.xml + robots.txt from the content (Bible 004 §10).
// Run: npm run seo:build   (uses Node's TS type-stripping to import the seed module)
//
// URLs carry the country prefix (/vn, /kr) and, for every locale but the default, a locale
// prefix (/en/vn/…). Country-less links minted before the Korea atlas still work — the Worker
// 301s them — but only the canonical form is listed.
//
// Three things Google actually uses are built here:
//   • <lastmod>  — from real dates (verifiedAt, else the git commit that last touched the data
//                  file). changefreq is gone: Google has said publicly it ignores it, and a
//                  made-up lastmod is worse than none, so anything undatable is left bare.
//   • xhtml:link — the hreflang cluster, one <url> entry per language version.
//   • image:image — the 400-odd photos, which are otherwise invisible to Google Images.

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { destinations } from "../src/data/destinations.ts";
import { destinationsKr } from "../src/data/kr/index.ts";
import { dishes } from "../src/data/food.ts";
import { dishesKr } from "../src/data/kr/index.ts";
import { DEFAULT_LOCALE, FOOD_SEGMENT, HREFLANG, SEO_LOCALES, withLocale } from "../src/lib/seo/urls.ts";
import { SITE_URL } from "./site.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);

const SITE = SITE_URL;
const IMAGES = JSON.parse(readFileSync(r("src/data/generated/image-manifest.json"), "utf8"));

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

// The TS modules are the AUTHORING source; D1 is what actually answers a request, and it is
// seeded from db/seed.sql by a manual step (see the deploy workflow — re-seeding is destructive
// so CI doesn't do it). Those two drift: the VN atlas grew 115 -> 187 destinations in the source
// while the seed still held 115, which would have put 360 URLs in the sitemap that resolve to a
// hard 404. A sitemap must never promise more than the deployed data can serve.
const SEED = readFileSync(r("db/seed.sql"), "utf8");
const seeded = (id) => SEED.includes(`'${id}'`);

// Destinations are declared in BOTH the atlas entry file and its regions/ directory — a sweep
// of regions/ alone silently dated nothing for Vietnam.
const ATLASES = [
  {
    cc: "vn",
    geo: geoMeta("vn"),
    destinations,
    dishes,
    sources: ["src/data/destinations.ts", "src/data/regions"],
  },
  {
    cc: "kr",
    geo: geoMeta("kr"),
    destinations: destinationsKr,
    dishes: dishesKr,
    sources: ["src/data/kr/index.ts", "src/data/kr/regions"],
  },
];

// ── Dates ─────────────────────────────────────────────────────
/** ISO date (YYYY-MM-DD) of the last commit touching a file, or null outside a git checkout. */
function gitDate(relPath) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", relPath], {
      cwd: root,
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out.toString().trim().slice(0, 10) || null;
  } catch {
    return null;
  }
}

const newer = (a, b) => (!a ? b : !b ? a : a > b ? a : b);

/**
 * slug → the commit date of the data file that declares it. One `git log` per file (26 of them),
 * not per destination — the naive version shelled out 300 times.
 */
function datesBySlug(sources) {
  const files = sources.flatMap((source) =>
    statSync(r(source)).isDirectory()
      ? readdirSync(r(source))
          .filter((f) => f.endsWith(".ts"))
          .map((f) => `${source}/${f}`)
      : [source],
  );
  const out = new Map();
  for (const relPath of files) {
    const date = gitDate(relPath);
    if (!date) continue;
    for (const m of readFileSync(r(relPath), "utf8").matchAll(/slug:\s*"([^"]+)"/g)) {
      out.set(m[1], newer(out.get(m[1]), date));
    }
  }
  return out;
}

const provinceContentDate = gitDate("src/data/provinceContent.ts");

// ── Entries ───────────────────────────────────────────────────
/** @type {{path: string, query?: string, lastmod?: string, images?: string[]}[]} */
const entries = [];
let homeDate = null;

const imagesOf = (d) =>
  (d.gallery ?? []).map((g) => IMAGES[g.seed]?.src).filter(Boolean).map((src) => `${SITE}${src}`);

let skipped = 0;
for (const { cc, geo, destinations: allDests, dishes: allDishes, sources } of ATLASES) {
  const dests = allDests.filter((d) => seeded(d.id));
  const dishList = allDishes.filter((d) => seeded(d.id));
  skipped += allDests.length - dests.length + (allDishes.length - dishList.length);
  const fileDates = datesBySlug(sources);
  const activeProvinces = new Set(dests.map((d) => d.provinceSlug));
  /** province slug → newest date among its destinations. */
  const provinceDates = new Map();

  const destEntries = dests.map((d) => {
    const lastmod = newer(d.verifiedAt ?? null, fileDates.get(d.slug) ?? null);
    provinceDates.set(d.provinceSlug, newer(provinceDates.get(d.provinceSlug), lastmod));
    return { path: `/${cc}/${d.provinceSlug}/${d.slug}`, lastmod, images: imagesOf(d) };
  });

  let countryDate = null;
  const provinceEntries = geo.provinces
    .filter((p) => activeProvinces.has(p.slug))
    .map((p) => {
      const lastmod = newer(provinceDates.get(p.slug) ?? null, provinceContentDate);
      countryDate = newer(countryDate, lastmod);
      return { path: `/${cc}/${p.slug}`, lastmod };
    });

  // Dishes are pages of their own since 043 (`/{cc}/food/{id}`); they used to be listed as the
  // country URL plus a `?dish=` query, which the Worker now 301s to these paths.
  const dishEntries = dishList.map((d) => ({
    path: `/${cc}/${FOOD_SEGMENT}/${d.id}`,
    lastmod: countryDate,
    images: IMAGES[`dish-${d.id}`] ? [`${SITE}${IMAGES[`dish-${d.id}`].src}`] : [],
  }));

  // The cuisine index — the page every one of those hangs off. Omitted when the atlas has no
  // seeded dishes, since the Worker answers that path with a 404.
  const foodEntries = dishList.length
    ? [{ path: `/${cc}/${FOOD_SEGMENT}`, lastmod: countryDate }]
    : [];

  entries.push(
    { path: `/${cc}`, lastmod: countryDate },
    ...foodEntries,
    ...provinceEntries,
    ...destEntries,
    ...dishEntries,
  );
  homeDate = newer(homeDate, countryDate);
}

entries.unshift({ path: "/", lastmod: homeDate });

// ── Render ────────────────────────────────────────────────────
const xmlEscape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const locOf = (locale, entry) => `${SITE}${withLocale(locale, entry.path)}${entry.query ?? ""}`;

function renderEntry(entry) {
  // Every language version is its own <url>, and each carries the complete alternate set —
  // hreflang is only honoured when it is reciprocal and includes a self-reference.
  const alternates = SEO_LOCALES.flatMap((locale) => {
    const href = xmlEscape(locOf(locale, entry));
    const tags = [`    <xhtml:link rel="alternate" hreflang="${HREFLANG[locale]}" href="${href}"/>`];
    if (locale === DEFAULT_LOCALE) {
      tags.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${href}"/>`);
    }
    return tags;
  }).join("\n");

  const images = (entry.images ?? [])
    .map((src) => `    <image:image><image:loc>${xmlEscape(src)}</image:loc></image:image>`)
    .join("\n");

  return SEO_LOCALES.map((locale) =>
    [
      "  <url>",
      `    <loc>${xmlEscape(locOf(locale, entry))}</loc>`,
      entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
      alternates,
      images || null,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n"),
  ).join("\n");
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map(renderEntry).join("\n")}
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

const dated = entries.filter((e) => e.lastmod).length;
const images = entries.reduce((n, e) => n + (e.images?.length ?? 0), 0);
console.log(
  `[build-sitemap] ${entries.length} pages × ${SEO_LOCALES.length} locales = ` +
    `${entries.length * SEO_LOCALES.length} URLs, ${dated} dated, ${images} images -> public/sitemap.xml (+ robots.txt)`,
);
// Never let this be silent: an entry authored but not seeded is content nobody can reach.
if (skipped) {
  console.warn(
    `[build-sitemap] WARNING: ${skipped} authored entries are absent from db/seed.sql and were ` +
      `left out. Run \`npm run db:seed:build\` and re-seed D1 to publish them.`,
  );
}
