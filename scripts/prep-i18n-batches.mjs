// One-off helper: extract translatable source content, grouped into 6 region buckets that
// mirror src/data/regions/*.ts. Writes JSON batches to the scratchpad for translation agents.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { destinations } from "../src/data/destinations.ts";
import { provinceContent } from "../src/data/provinceContent.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const geo = JSON.parse(
  await import("node:fs").then((fs) => fs.readFileSync(resolve(root, "src/data/generated/geo-meta.json"), "utf8")),
);

const OUT = process.argv[2] || resolve(root, "scratch-i18n");
mkdirSync(OUT, { recursive: true });

// regionId (8 geo regions) -> bucket (6 data files)
const bucketOf = {
  northeast: "northMountains",
  northwest: "northMountains",
  "red-river-delta": "redRiverDelta",
  "north-central-coast": "northCentral",
  "south-central-coast": "southCentralHighlands",
  "central-highlands": "southCentralHighlands",
  southeast: "southeast",
  "mekong-delta": "mekong",
};

const provRegion = Object.fromEntries(geo.provinces.map((p) => [p.slug, p.regionId]));
const buckets = {};
const ensure = (b) => (buckets[b] ??= { destinations: [], provinces: [] });

for (const d of destinations) {
  const region = provRegion[d.provinceSlug];
  const bucket = bucketOf[region] ?? "mekong";
  ensure(bucket).destinations.push({
    id: d.id,
    name: d.name,
    summary: d.summary,
    story: d.story,
    facts: d.facts,
    travelTips: d.travelTips,
    bestTime: d.bestTime,
    visitDuration: d.visitDuration,
    ticket: d.ticket,
    openingHours: d.openingHours,
    galleryCaptions: (d.gallery ?? []).map((g) => g.caption),
  });
}

for (const [slug, c] of Object.entries(provinceContent)) {
  const region = provRegion[slug];
  const bucket = bucketOf[region] ?? "mekong";
  ensure(bucket).provinces.push({
    slug,
    summary: c.summary,
    story: c.story,
    bestTime: c.bestTime,
    specialties: c.specialties,
  });
}

let totalD = 0;
let totalP = 0;
for (const [bucket, data] of Object.entries(buckets)) {
  writeFileSync(resolve(OUT, `${bucket}.json`), JSON.stringify(data, null, 2));
  totalD += data.destinations.length;
  totalP += data.provinces.length;
  console.log(`${bucket}: ${data.destinations.length} destinations, ${data.provinces.length} provinces`);
}

// Province names for ALL provinces (proper nouns) -> provinceNames.ts source.
writeFileSync(
  resolve(OUT, "_province-names.json"),
  JSON.stringify(geo.provinces.map((p) => ({ slug: p.slug, name: p.name, nameEn: p.nameEn })), null, 2),
);
console.log(`buckets=${Object.keys(buckets).length} totalDest=${totalD} totalProv=${totalP} provNames=${geo.provinces.length}`);
