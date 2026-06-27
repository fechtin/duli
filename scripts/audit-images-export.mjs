// Export a flat seed -> metadata map for the image audit. Run:
//   node --experimental-strip-types scripts/audit-images-export.mjs
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { destinations } from "../src/data/destinations.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const r = (p) => resolve(__dirname, "..", p);
const geo = JSON.parse(readFileSync(r("src/data/generated/geo-meta.json"), "utf8"));
const provinceEn = new Map(geo.provinces.map((p) => [p.slug, p.nameEn]));
const manifest = JSON.parse(readFileSync(r("src/data/generated/image-manifest.json"), "utf8"));

const rows = [];
for (const d of destinations) {
  (d.gallery ?? []).forEach((g, i) => {
    const m = manifest[g.seed];
    rows.push({
      seed: g.seed,
      role: i === 0 ? "hero" : "gallery",
      destId: d.id,
      destName: d.name,
      destNameEn: d.nameEn,
      province: d.provinceSlug,
      provinceEn: provinceEn.get(d.provinceSlug) ?? "",
      type: d.type,
      lat: d.lat,
      lng: d.lng,
      caption: g.caption ?? "",
      file: m ? r("public" + m.src) : null,
      hasImage: !!m,
      credit: m?.credit ?? "",
      license: m?.license ?? "",
    });
  });
}
writeFileSync(r("scripts/.audit-rows.json"), JSON.stringify(rows, null, 0));
console.log(`Exported ${rows.length} seeds across ${destinations.length} destinations`);
console.log(`With image: ${rows.filter((x) => x.hasImage).length} | missing: ${rows.filter((x) => !x.hasImage).length}`);
