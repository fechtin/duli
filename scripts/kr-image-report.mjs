// List KR destination seeds and whether the manifest has a photo (audit helper).
import { readFileSync } from "node:fs";
import { destinationsKr } from "../src/data/kr/index.ts";
const m = JSON.parse(readFileSync(new URL("../src/data/generated/image-manifest.json", import.meta.url), "utf8"));
let have = 0, miss = [];
for (const d of destinationsKr) {
  for (const g of d.gallery ?? []) {
    if (m[g.seed]) { have++; if (process.env.LIST) console.log(`${g.seed}\t${m[g.seed].via}\t${m[g.seed].sourceTitle}`); }
    else miss.push(g.seed);
  }
}
console.log(`\n[kr-images] ${have} seeds with photos, ${miss.length} without: ${miss.join(", ")}`);
