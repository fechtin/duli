// Build the web-ready Vietnam map data.
// Input : data/geo/vn-provinces.simplified.geojson (mapshaper output)
// Output: public/geo/vn-provinces.json   (geometry + props, lazy-loaded by the map)
//         src/data/generated/geo-meta.json (provinces + regions, no geometry)
//
// Run: npm run data:build

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { geoArea, geoCentroid } from "d3-geo";
import { regions, provinces, mainlandBounds } from "../data/registry/vn.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);

const src = JSON.parse(readFileSync(r("data/geo/vn-provinces.simplified.geojson"), "utf8"));
const regionById = Object.fromEntries(regions.map((x) => [x.id, x]));

// Merge features that share a slug (e.g. mainland + offshore islands) into one MultiPolygon.
/** @type {Map<string, {meta: any, polygons: any[]}>} */
const bySlug = new Map();
const unmatched = new Set();

for (const f of src.features) {
  const reg = provinces[f.properties?.Name];
  if (!reg) {
    unmatched.add(f.properties?.Name ?? "(no name)");
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

writeFileSync(r("public/geo/vn-provinces.json"), JSON.stringify(geo));
writeFileSync(
  r("src/data/generated/geo-meta.json"),
  JSON.stringify(
    {
      bounds: mainlandBounds,
      regions,
      provinces: provinceMeta,
    },
    null,
    0,
  ),
);

const size = readFileSync(r("public/geo/vn-provinces.json")).length;
console.log(
  `[build-map] ${features.length} provinces, ${regions.length} regions -> public/geo/vn-provinces.json (${(size / 1024).toFixed(0)} KB)`,
);
