// Fetch real photos for Food Explorer dishes (026) into public/img/dishes/ and register them
// in the shared image-manifest under seed `dish-<id>` (IllustratedImage picks them up).
//
// Every candidate is name-validated by scripts/lib/image-sources.mjs before it can win. The
// first version of this script took the top Wikipedia search hit blind, which is how "Nem lụi
// Huế" became a photo of the city of Huế and "Vịt quay Lạng Sơn" a mắc mật shrub — 10 of 16
// photos wrong. A plausible-looking wrong photo is worse than no photo.
//
// Modes:
//   node scripts/fetch-dish-images.mjs         → Vietnam dishes
//   node scripts/fetch-dish-images.mjs kr      → Korea dishes
//   FORCE=1 refetches all;  ONLY=id1,id2 restricts to those dish ids
//   DRY=1 resolves without downloading (prints what each dish would get)
// After running, VISUALLY AUDIT — blank wrong seeds from the manifest.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { dishes } from "../src/data/food.ts";
import { dishesKr } from "../src/data/kr/index.ts";
import {
  sleep, downloadWebp, firstHit, wikiTitle, wikiLead, commonsCategory, commonsSearch, openverse,
  stock, stockAvailable, FOOD_CUE,
} from "./lib/image-sources.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);
const OUT_DIR = r("public/img/dishes");
const MANIFEST = r("src/data/generated/image-manifest.json");
const FORCE = process.env.FORCE === "1";
const DRY = process.env.DRY === "1";
const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(",").map((s) => s.trim())) : null;

// ── Atlas selection ──
// Each atlas brings its dishes and the wiki language its names are written in.
const ATLASES = {
  vn: { dishes, nameLang: "vi" },
  kr: { dishes: dishesKr, nameLang: "ko" },
};
const cc = (process.argv[2] ?? process.env.COUNTRY ?? "vn").toLowerCase();
const atlas = ATLASES[cc];
if (!atlas) {
  console.error(`[fetch-dish-images] unknown country "${cc}" (expected: ${Object.keys(ATLASES).join(", ")})`);
  process.exit(1);
}

// Regional dishes are named "<dish> <place>" — Wikipedia and Commons carry the bare dish, so
// "Bún cá Kiên Giang" also has to be tried as "Bún cá". Stripping is only safe when what
// remains is still nameable: strip at most the trailing place, never down to a bare noun.
const PLACE_TAIL_VI =
  /\s+(Hà Nội|Hải Phòng|Hải Dương|Hà Tĩnh|Hà Nam|Hà Giang|Cao Bằng|Bắc Kạn|Bắc Giang|Bắc Ninh|Lạng Sơn|Thái Nguyên|Tuyên Quang|Phú Thọ|Vĩnh Phúc|Hưng Yên|Thái Bình|Nam Định|Ninh Bình|Thanh Hóa|Nghệ An|Quảng Bình|Quảng Trị|Quảng Nam|Quảng Ngãi|Quảng Ninh|Thừa Thiên Huế|Huế|Đà Nẵng|Hội An|Bình Định|Quy Nhơn|Phú Yên|Khánh Hòa|Nha Trang|Ninh Thuận|Phan Rang|Bình Thuận|Phan Thiết|Kon Tum|Gia Lai|Đắk Lắk|Buôn Ma Thuột|Đắk Nông|Lâm Đồng|Đà Lạt|Bình Phước|Tây Ninh|Bình Dương|Đồng Nai|Biên Hòa|Bà Rịa|Vũng Tàu|Long An|Tiền Giang|Bến Tre|Trà Vinh|Vĩnh Long|Đồng Tháp|Sa Đéc|An Giang|Châu Đốc|Kiên Giang|Phú Quốc|Cần Thơ|Hậu Giang|Sóc Trăng|Bạc Liêu|Cà Mau|Lào Cai|Yên Bái|Điện Biên|Lai Châu|Sơn La|Hòa Bình|Mộc Châu|Ba Bể|Sài Gòn|miền Tây)$/u;
const GENERIC_TAIL_EN = /\s+(dishes|bbq|barbecue|set|platter)$/i;
const TOO_GENERIC = new Set([
  "rice", "cake", "pork", "beef", "chicken", "octopus", "oyster", "oysters", "garlic",
  "soup", "stew", "noodles", "noodle", "fish", "crab", "squid", "porridge", "dumpling",
  "dumplings", "pancake", "tea", "wine", "bread", "salad", "candy",
]);

/** Query variants for a dish, most specific first. */
function variants(d) {
  const out = [];
  const vi = d.name.replace(/\s*\(.*\)$/, "").trim();
  const en = d.nameEn.replace(/\s*\(.*\)$/, "").trim();
  out.push({ q: vi, lang: atlas.nameLang }, { q: en, lang: "en" });

  const viBare = vi.replace(PLACE_TAIL_VI, "").trim();
  if (viBare !== vi && viBare.split(/\s+/).length >= 2) out.push({ q: viBare, lang: atlas.nameLang });

  // Korean regional dishes are "<place> <dish>" in English — drop the leading place word.
  const enTrimmed = en.replace(GENERIC_TAIL_EN, "").trim();
  const enWords = enTrimmed.split(/\s+/);
  if (enWords.length > 1) {
    const tail = enWords.slice(1).join(" ");
    if (!TOO_GENERIC.has(tail.toLowerCase())) out.push({ q: tail, lang: "en" });
  }
  // A one-word query is not a search key: "Don (river clam soup)" reduces to "Don", which
  // matched a Commons category for the cartoonist Don Rosa. Anything this short can only be
  // resolved by the exact-title path, never by a search.
  const usable = (q) => q.split(/\s+/).length >= 2 || q.replace(/\s/g, "").length >= 5;
  const seen = new Set();
  return out.filter((v) => v.q && usable(v.q) && !seen.has(v.q) && seen.add(v.q));
}

/**
 * Ordered source chain: best-quality first, stock only when nothing free exists.
 * Deliberately short — a dish with no photo anywhere walks the whole chain, and every extra
 * step multiplies across the ~130 unphotographed dishes.
 */
function chain(d) {
  const vs = variants(d).slice(0, 3);
  const food = { food: true, cue: FOOD_CUE };
  const steps = [];
  // Cheapest and most reliable first: an exact article title needs one REST call, and REST
  // keeps answering when `w/api.php` is rate-limited. Most dishes are titled as they're named.
  for (const v of vs) steps.push(() => wikiTitle(v.lang, v.q, food));
  // Openverse next — it indexes Commons *and* Flickr, and spends no Wikimedia quota.
  for (const v of vs) steps.push(() => openverse(v.q, food));
  // Then the search-based Wikimedia paths, which are the ones that get throttled.
  for (const v of vs) steps.push(() => wikiLead(v.lang, v.q, food));
  for (const v of vs) steps.push(() => commonsCategory(v.q, food));
  steps.push(() => commonsSearch(vs[0].q, food));
  steps.push(() => stock(vs.at(-1).q, food));
  return steps;
}

mkdirSync(OUT_DIR, { recursive: true });
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
const save = () => writeFileSync(MANIFEST, JSON.stringify(manifest));

const todo = atlas.dishes.filter(
  (d) => (!ONLY || ONLY.has(d.id)) && (FORCE || !manifest[`dish-${d.id}`]),
);
console.log(
  `[dish-images] ${cc}: ${todo.length} to resolve${DRY ? " (DRY)" : ""}` +
    `${stockAvailable() ? "" : "  · no stock key set — free sources only"}`,
);

let done = 0, n = 0;
const failed = [];
for (const d of todo) {
  n++;
  const seed = `dish-${d.id}`;
  try {
    const pick = await firstHit(chain(d));
    if (!pick) { failed.push(d.id); console.log(`${String(n).padStart(3)}/${todo.length} ·  ${d.id} — no photo in any source`); continue; }
    if (!DRY) {
      await downloadWebp(pick.url, `${OUT_DIR}/${d.id}.webp`);
      manifest[seed] = {
        src: `/img/dishes/${d.id}.webp`,
        credit: pick.credit ?? "",
        license: pick.license ?? "Wikimedia Commons",
        sourceTitle: pick.sourceTitle,
        sourceUrl: pick.sourceUrl,
        via: pick.via,
      };
      // Written as we go: the previous version saved only at the end, so an interrupted run
      // left 16 downloaded files that no manifest entry pointed at — invisible to the app.
      if (n % 5 === 0) save();
    }
    done++;
    console.log(`${String(n).padStart(3)}/${todo.length} ✓  ${d.id}  (${pick.via}) ${pick.sourceTitle}`);
  } catch (e) {
    failed.push(d.id);
    console.log(`${String(n).padStart(3)}/${todo.length} ✗  ${d.id}: ${e.message}`);
  }
  await sleep(400);
}

if (!DRY) save();
console.log(`\n[dish-images] resolved ${done}/${todo.length}, unresolved ${failed.length}${failed.length ? ": " + failed.join(", ") : ""}`);
