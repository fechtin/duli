// Build the web-ready map data for one country.
// Input : the simplified GeoJSON named by data/registry/<cc>.mjs (mapshaper output)
// Output: public/geo/<cc>-provinces.json      (geometry + props, lazy-loaded by the map)
//         src/data/generated/geo-meta.<cc>.json (provinces + regions, no geometry)
//
// Run: npm run data:build          (vn, the default)
//      npm run data:build -- kr    (or: node scripts/build-map.mjs kr)

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { geoArea, geoCentroid } from "d3-geo";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);

const cc = (process.argv[2] ?? "vn").toLowerCase();
const registry = await import(`../data/registry/${cc}.mjs`);
const { regions, provinces, mainlandBounds, source } = registry;

// Province META is static reference data the client reads without a fetch (src/lib/api/content),
// so the localized NAMES have to ride along with it — otherwise a Korean page renders Korean
// prose over a map still labelled in Vietnamese. Same aggregate the D1 seed reads, so the map
// and the API can't disagree.
const i18nIndex =
  cc === "kr" ? await import("../src/data/kr/i18n/index.ts") : await import("../src/data/i18n/index.ts");
const provinceTranslations = cc === "kr" ? i18nIndex.provinceI18nKr : i18nIndex.provinceI18n;
const CONTENT_LOCALES = ["en", "ko", "ja", "zh"];

/** { ko: "꽝남성", … } for one province — omitted entirely when nothing is known. */
function localeNames(slug, nameEn) {
  const tr = provinceTranslations[slug] ?? {};
  const names = {};
  for (const locale of CONTENT_LOCALES) {
    const name = tr[locale]?.name;
    if (name) names[locale] = name;
  }
  // Every province carries an English name already; no translation set needs to repeat it.
  if (!names.en && nameEn) names.en = nameEn;
  return Object.keys(names).length ? names : null;
}
// Older registries (vn) predate the `source` export — fall back to their historical layout.
const srcFile = source?.file ?? `data/geo/${cc}-provinces.simplified.geojson`;
const nameProp = source?.nameProp ?? "Name";

const src = JSON.parse(readFileSync(r(srcFile), "utf8"));
const regionById = Object.fromEntries(regions.map((x) => [x.id, x]));

// Merge features that share a slug (e.g. mainland + offshore islands) into one MultiPolygon.
/** @type {Map<string, {meta: any, polygons: any[]}>} */
const bySlug = new Map();
const unmatched = new Set();

for (const f of src.features) {
  const reg = provinces[f.properties?.[nameProp]];
  if (!reg) {
    unmatched.add(f.properties?.[nameProp] ?? "(no name)");
    continue;
  }
  const rawPolys =
    f.geometry.type === "MultiPolygon"
      ? f.geometry.coordinates
      : f.geometry.type === "Polygon"
        ? [f.geometry.coordinates]
        : [];
  // d3-geo (spherical) wants clockwise exterior rings — the opposite of RFC 7946.
  // Reverse every ring so geoPath fills the province, not the whole globe.
  const polys = rawPolys.map((polygon) => polygon.map((ring) => ring.slice().reverse()));
  if (!bySlug.has(reg.slug)) bySlug.set(reg.slug, { meta: reg, polygons: [] });
  bySlug.get(reg.slug).polygons.push(...polys);
}

if (unmatched.size) {
  console.warn("[build-map] WARNING unmatched features:", [...unmatched]);
}

// Centroid placed on the province's largest polygon, so labels never drift to islands.
function mainlandCentroid(polygons) {
  let best = null;
  let bestArea = -1;
  for (const ring of polygons) {
    const poly = { type: "Polygon", coordinates: ring };
    const a = geoArea(poly);
    if (a > bestArea) {
      bestArea = a;
      best = poly;
    }
  }
  return best ? geoCentroid(best).map((n) => +n.toFixed(4)) : [0, 0];
}

const features = [];
const provinceMeta = [];

for (const { meta, polygons } of [...bySlug.values()].sort((a, b) => a.meta.slug.localeCompare(b.meta.slug))) {
  const centroid = mainlandCentroid(polygons);
  const region = regionById[meta.region];
  const props = {
    slug: meta.slug,
    name: meta.name,
    nameEn: meta.nameEn,
    regionId: meta.region,
    regionName: region?.name ?? "",
    color: region?.color ?? "#888",
    centroid,
    // Native script name, when the romanized `name` isn't what locals read (e.g. 서울특별시).
    ...(meta.nameKo ? { nameKo: meta.nameKo } : {}),
    ...((names) => (names ? { names } : {}))(localeNames(meta.slug, meta.nameEn)),
  };
  features.push({
    type: "Feature",
    properties: props,
    geometry: { type: "MultiPolygon", coordinates: polygons },
  });
  provinceMeta.push(props);
}

const geo = {
  type: "FeatureCollection",
  bbox: mainlandBounds,
  features,
};

mkdirSync(r("public/geo"), { recursive: true });
mkdirSync(r("src/data/generated"), { recursive: true });

const geoPath = `public/geo/${cc}-provinces.json`;
writeFileSync(r(geoPath), JSON.stringify(geo));
writeFileSync(
  r(`src/data/generated/geo-meta.${cc}.json`),
  JSON.stringify(
    {
      country: cc,
      bounds: mainlandBounds,
      regions,
      provinces: provinceMeta,
    },
    null,
    0,
  ),
);

const size = readFileSync(r(geoPath)).length;
console.log(
  `[build-map] ${cc}: ${features.length} provinces, ${regions.length} regions -> ${geoPath} (${(size / 1024).toFixed(0)} KB)`,
);
