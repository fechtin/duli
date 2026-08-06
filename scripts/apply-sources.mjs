// Write the reviewed output of resolve-sources.mjs back into the destination files:
// add `sourceUrl` + `verifiedAt` to legacy entries, and correct coordinates that drifted.
//
// Reads tasks/resolve-sources.json. A row is applied only when it resolved to an article
// whose title shares a token with the destination — resolve-sources.mjs already enforced
// that, so anything with `resolved: null` is skipped and stays for a human.
//
// Coordinates are only rewritten for POINT-like places — a temple either sits at the
// article's coordinate or the atlas is wrong. For area-like places (a bay, a park, a range)
// a large drift usually just means the two sources picked different centroids, and the
// atlas value can be the better one: the article for "Khu di tích Tân Trào" describes a
// whole war-base region 33km wide. Those are printed for a human instead of moved.
//
//   node --experimental-strip-types scripts/apply-sources.mjs           # dry run
//   node --experimental-strip-types scripts/apply-sources.mjs --write   # apply

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { destinationById } from "../src/data/destinations.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const r = (p) => resolve(__dirname, "..", p);

const WRITE = process.argv.includes("--write");
const TODAY = process.env.TODAY ?? new Date().toISOString().slice(0, 10);
const COORD_FIX_KM = 8;
// A drift this large on a point-like place means the atlas coordinate is simply wrong.
const POINT_TYPES = new Set(["temple", "museum", "palace", "bridge", "market", "cave", "village"]);
// Typed as areas but compact enough on the ground that a >8km drift is an atlas error, not a
// centroid disagreement: Ganh Da Dia is a single basalt formation a few hundred metres wide,
// Dao Co a single islet in one lake. Both were checked by hand against the article.
const FORCE_POINT = new Set(["pye-ganh-da-dia", "hd-dao-co"]);

const rows = JSON.parse(readFileSync(r("tasks/resolve-sources.json"), "utf8"));

// Every file that can hold a Destination literal.
const files = [
  r("src/data/destinations.ts"),
  ...readdirSync(r("src/data/regions"))
    .filter((f) => f.endsWith(".ts"))
    .map((f) => r(join("src/data/regions", f))),
];
const source = new Map(files.map((f) => [f, readFileSync(f, "utf8")]));

let added = 0, moved = 0, skipped = 0, review = 0;

for (const row of rows) {
  if (!row.resolved) { skipped++; continue; }

  const file = files.find((f) => source.get(f).includes(`    id: "${row.id}",`));
  if (!file) { console.warn(`  ! không tìm thấy entry ${row.id}`); skipped++; continue; }

  let text = source.get(file);
  const idLine = `    id: "${row.id}",`;
  const at = text.indexOf(idLine);
  // The entry ends at the next line that closes an object at this indent level.
  const end = text.indexOf("\n  },", at);
  const block = text.slice(at, end);

  if (block.includes("sourceUrl:")) { skipped++; continue; }

  let newBlock = block;

  const type = destinationById.get(row.id)?.type;
  const pointLike = POINT_TYPES.has(type) || FORCE_POINT.has(row.id);
  if (row.driftKm > COORD_FIX_KM && !pointLike) {
    console.log(`  ? ${row.name} (${type}): lệch ${row.driftKm}km — vùng rộng, cần người xem, KHÔNG tự dời`);
    review++;
  }
  if (row.driftKm > COORD_FIX_KM && pointLike) {
    const [lng, lat] = [row.resolved.lng, row.resolved.lat];
    newBlock = newBlock
      .replace(/\n    lng: [-\d.]+,/, `\n    lng: ${Number(lng.toFixed(4))},`)
      .replace(/\n    lat: [-\d.]+,/, `\n    lat: ${Number(lat.toFixed(4))},`);
    moved++;
    console.log(`  ~ ${row.name}: dời ${row.driftKm}km → ${lng}, ${lat}`);
  }

  // Insert provenance right after the id line: valid anywhere inside the object literal.
  newBlock = newBlock.replace(
    idLine,
    `${idLine}\n    sourceUrl: "${row.resolved.url}",\n    verifiedAt: "${TODAY}",`,
  );

  source.set(file, text.slice(0, at) + newBlock + text.slice(end));
  added++;
}

if (WRITE) for (const [f, text] of source) writeFileSync(f, text);

console.log(
  `\n[apply] ${added} entry được gắn nguồn · ${moved} tọa độ sửa (>${COORD_FIX_KM}km) · ${skipped} bỏ qua` +
    (WRITE ? "" : "\n(dry run — thêm --write để ghi)"),
);
