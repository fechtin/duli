// Curate dish photos from Wikimedia Commons CATEGORIES (026). A file that is a member of
// Category:Phở IS pho — category membership guarantees topical correctness, unlike full-text
// search which drifts to place names / generic articles. Per dish we try an ordered list of
// candidate category names + a strict search query; first photo that passes the filter wins.
// Run: node scripts/curate-dish-images.mjs  (ONLY=id1,id2 to redo specific seeds)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);
const OUT_DIR = r("public/img/dishes");
const MANIFEST = r("src/data/generated/image-manifest.json");
const UA = "VietnamAtlas/1.0 (food explorer; github.com/fechtin/duli)";
const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(",")) : null;

const JUNK = /\b(map|logo|flag|coat.?of.?arms|diagram|chart|montage|collage|seal|emblem|locator|icon|screenshot|menu|signature|banknote|stamp|statue|monument|temple|pagoda|church|market\b|building|street view|panorama|aerial|portrait|cave|waterfall|lake|river|mountain|city|town|street|road|bridge|square|park|gate|tree\b|plantation|field|boat|festival|ceremony|people|woman|man\b|person|gift|box\b)\b/i;
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// seed → ordered candidate Commons categories. Verified-plausible names; the script skips any
// that don't exist and falls through to a strict search. Non-photo dishes (fruit/candy) still
// resolve to a food photo of the item.
// Refined, higher-confidence Commons categories (well-known VN dishes that have real
// category pages). Obscure regional items are intentionally omitted → they keep the clean
// gradient fallback rather than risk a wrong photo.
const CATS = {
  "ca-phe-trung": ["Egg coffee"], "banh-mi": ["Bánh mì"], "banh-xeo": ["Bánh xèo"],
  "hu-tieu": ["Hủ tiếu"], "cao-lau": ["Cao lầu"], "bun-bo-hue": ["Bún bò Huế"],
  "ca-phe-sua-da": ["Vietnamese iced coffee", "Cà phê sữa đá"], "ca-phe-buon-ma-thuot": ["Vietnamese coffee"],
  "banh-khot-vung-tau": ["Bánh khọt"], "banh-can": ["Bánh căn"], "banh-pia": ["Bánh pía"],
  "banh-cuon-cao-bang": ["Bánh cuốn"], "banh-bot-loc": ["Bánh bột lọc"], "nem-lui": ["Nem lụi"],
  "banh-da-cua": ["Bánh đa cua"], "banh-dau-xanh": ["Bánh đậu xanh"], "cha-muc-ha-long": ["Chả mực"],
  "com-chay-ninh-binh": ["Cơm cháy"], "chao-luon-vinh": ["Cháo lươn"], "banh-it-la-gai": ["Bánh ít"],
  "bun-cha-ca-quy-nhon": ["Bún chả cá"], "pho-kho-gia-lai": ["Phở khô"], "banh-canh-cha-ca-phan-thiet": ["Bánh canh"],
  "chao-canh-quang-binh": ["Bánh canh"], "keo-dua-ben-tre": ["Coconut candy"], "chao-long-cai-tac": ["Cháo lòng"],
  "vit-quay-lang-son": ["Vịt quay"], "com-lam": ["Cơm lam"], "banh-trang-nuong-da-lat": ["Bánh tráng nướng"],
  "banh-beo-bi": ["Bánh bèo"], "goi-la-kon-tum": ["Gỏi lá"], "lau-mam": ["Vietnamese hot pot"],
};
// Strict search query fallback per dish.
const SEARCH = (name) => `${name} Vietnamese food`;

async function jr(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) return res.json();
    if (res.status === 429 || res.status >= 500) { await sleep((i + 1) * 6000); continue; }
    throw new Error(`${res.status}`);
  }
  throw new Error("429 exhausted");
}

function goodImageInfo(ii, title) {
  if (!ii) return false;
  if (!/image\/(jpeg|png)/.test(ii.mime)) return false;
  if ((ii.width ?? 0) < 640) return false;
  if (ii.height > ii.width * 1.5) return false;
  if (JUNK.test(title)) return false;
  return true;
}

async function fromCategory(cat) {
  const data = await jr(
    `https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=${encodeURIComponent("Category:" + cat)}&gcmtype=file&gcmlimit=30&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1280&format=json&origin=*`,
  );
  const pages = Object.values(data.query?.pages ?? {});
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (goodImageInfo(ii, p.title)) return { page: p, ii };
  }
  return null;
}

async function fromSearch(query) {
  const data = await jr(
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}%20filetype:bitmap&gsrlimit=12&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1280&format=json&origin=*`,
  );
  const pages = Object.values(data.query?.pages ?? {}).sort((a, b) => (a.index ?? 9) - (b.index ?? 9));
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (goodImageInfo(ii, p.title)) return { page: p, ii };
  }
  return null;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`dl ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 74 }).toFile(dest);
}

const { dishes } = await import("../src/data/food.ts");
mkdirSync(OUT_DIR, { recursive: true });
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};

let done = 0, failed = [];
for (const d of dishes) {
  if (ONLY && !ONLY.has(d.id)) continue;
  // Only attempt dishes we have a curated category for — skip the rest (keep gradient).
  if (!CATS[d.id]) continue;
  const seed = `dish-${d.id}`;
  try {
    let hit = null;
    for (const cat of CATS[d.id] ?? []) {
      hit = await fromCategory(cat);
      await sleep(2500);
      if (hit) break;
    }
    if (!hit) { hit = await fromSearch(SEARCH(d.name)); await sleep(2500); }
    if (!hit) { failed.push(d.id); console.log(`✗ ${d.id}: no image`); continue; }
    const { page, ii } = hit;
    await download(ii.thumburl ?? ii.url, `${OUT_DIR}/${d.id}.webp`);
    const meta = ii.extmetadata ?? {};
    const strip = (h) => (h?.value ?? "").replace(/<[^>]+>/g, "").trim();
    manifest[seed] = {
      src: `/img/dishes/${d.id}.webp`,
      credit: strip(meta.Artist).slice(0, 80),
      license: strip(meta.LicenseShortName) || "Wikimedia Commons",
      sourceTitle: page.title,
      sourceUrl: ii.descriptionurl ?? "",
      via: "commons-curated",
    };
    done++;
    console.log(`✓ ${d.id}  (${page.title.replace("File:", "").slice(0, 50)})`);
  } catch (e) {
    failed.push(d.id);
    console.log(`✗ ${d.id}: ${e.message}`);
  }
  await sleep(900);
}

writeFileSync(MANIFEST, JSON.stringify(manifest));
console.log(`\n[curate-dish] curated ${done}, failed ${failed.length}${failed.length ? ": " + failed.join(", ") : ""}`);
