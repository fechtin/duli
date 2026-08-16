// Read-only audit of src/data/generated/image-manifest.json: which photos can still be shown to
// name the thing they illustrate, and which are only there because something once trusted a
// coordinate.
//
// Why this exists: the atlas has shipped wrong photos twice, and both times the manifest looked
// perfectly healthy — every seed had a file, the site rendered, nothing errored. The only way to
// see the damage was to re-read `sourceTitle` against the destination name by hand. This does
// that in bulk, and it never writes: it prints a report and, with --json, the seed list to feed
// back into `REFETCH=`.
//
//   node --experimental-strip-types scripts/audit-images.mjs [vn|kr] [--json out.json]
//
// Verdicts:
//   named      — the source title carries the place's distinctive tokens. Trustworthy.
//   unrecorded — kept from before provenance was stored: no sourceTitle at all. NOT evidence of
//                a wrong photo, and not evidence of a right one either — it simply predates the
//                field this audit reads.
//   anchored   — title misses the name but carries the province/country, and the pick came from
//                a source that validated the name upstream. Weak but plausible.
//   SUSPECT    — has provenance, and nothing in it ties the file to the place. Look at these.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { destinations } from "../src/data/destinations.ts";
import { destinationsKr } from "../src/data/kr/index.ts";
import { titleMatches, fold } from "./lib/image-sources.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const r = (p) => resolve(__dirname, "..", p);

const cc = (process.argv.find((a) => /^(vn|kr)$/.test(a)) ?? "vn").toLowerCase();
const jsonAt = process.argv.indexOf("--json");
const outPath = jsonAt > -1 ? process.argv[jsonAt + 1] : null;

const places = cc === "kr" ? destinationsKr : destinations;
const geo = JSON.parse(readFileSync(r(`src/data/generated/geo-meta.${cc}.json`), "utf8"));
const provinceEn = new Map(geo.provinces.map((p) => [p.slug, p.nameEn]));
const manifest = JSON.parse(readFileSync(r("src/data/generated/image-manifest.json"), "utf8"));

// Same stopwords the fetcher uses, so the audit judges by the fetcher's own standard.
const PLACE_STOP = new Set([
  "national", "park", "lake", "mountain", "cave", "waterfall", "island", "temple", "pagoda",
  "beach", "village", "bay", "valley", "market", "hill", "hills", "pass", "river", "street",
  "museum", "bridge", "palace", "fortress", "tower", "garden", "town", "city", "square",
  "peak", "site", "complex", "old", "quarter", "ancient", "royal", "grand", "great", "new",
  "nui", "hang", "bai", "den", "chua", "thac", "song", "dao", "deo", "cua", "khu", "cao",
  "nguyen", "ho", "cung", "bien", "thanh", "lang", "cho", "cong", "vien", "pho", "dinh",
  "thap", "hoa", "quoc", "gia", "vuon", "mo", "tranh", "khac", "rung", "tre", "doi", "che",
  "duong", "ham", "bao", "tang", "trung", "tam", "khach", "san", "diem",
]);
const opts = { stop: PLACE_STOP, minLen: 3 };

// A Commons category hit was validated against the category name upstream, so its file title is
// allowed not to repeat the place name. A bare geosearch hit had no such check — that is the
// whole point of the audit.
const VALIDATED_VIA = /^(wikipedia|commons-category|commons-geo|commons-search|openverse)/;

const rows = [];
for (const d of places) {
  const prov = provinceEn.get(d.provinceSlug) ?? "";
  for (const g of d.gallery ?? []) {
    const m = manifest[g.seed];
    if (!m) continue;
    const title = m.sourceTitle ?? "";
    const named =
      titleMatches(d.nameEn, title, undefined, opts) || titleMatches(d.name, title, undefined, opts);
    const anchored = prov && fold(title).includes(fold(prov));
    const trustedVia = VALIDATED_VIA.test(m.via ?? "");
    // An entry from before provenance was recorded has no title to judge. Calling that
    // "suspect" would be dishonest in both directions: it is not evidence of a wrong photo, and
    // burying it in the same bucket hides how many entries simply cannot be checked this way.
    const verdict = !title
      ? "unrecorded"
      : named
        ? "named"
        : anchored && trustedVia
          ? "anchored"
          : "SUSPECT";
    rows.push({ seed: g.seed, id: d.id, name: d.nameEn, via: m.via ?? "?", title, verdict });
  }
}

const by = (v) => rows.filter((x) => x.verdict === v);
const suspect = by("SUSPECT");

console.log(`[audit-images] ${cc.toUpperCase()} · ${rows.length} photos in manifest`);
console.log(`  named      ${by("named").length}   (title carries the place's own tokens)`);
console.log(`  anchored   ${by("anchored").length}   (province in title, from a validated source)`);
console.log(`  unrecorded ${by("unrecorded").length}   (pre-provenance entry — nothing to judge)`);
console.log(`  SUSPECT    ${suspect.length}`);

const viaCount = {};
for (const s of suspect) viaCount[s.via] = (viaCount[s.via] ?? 0) + 1;
console.log(`\nSUSPECT by source: ${JSON.stringify(viaCount)}\n`);

for (const s of suspect.slice(0, 40)) {
  console.log(`  ${s.name}\n      [${s.via}] ${s.title}\n      seed ${s.seed}`);
}
if (suspect.length > 40) console.log(`  … and ${suspect.length - 40} more`);

if (outPath) {
  writeFileSync(r(outPath), JSON.stringify(suspect.map((s) => s.seed), null, 2));
  console.log(`\n[audit-images] ${suspect.length} seeds -> ${outPath}  (feed to REFETCH=)`);
}
