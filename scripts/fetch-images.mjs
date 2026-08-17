// Fetch openly-licensed, NAME-VERIFIED photos for every destination and optimize to WebP.
//
// Rewritten 2026-08-16 onto scripts/lib/image-sources.mjs. The version before it ranked
// candidates itself and — crucially — accepted a file for being *geotagged near* the place even
// when nothing about it named the place. That produced 13 wrong heroes out of 14 on its last
// run: a shipyard for the whale village, a high school, an IDF house-damage photo for Nhà Trăm
// Cột, Côn Đảo prison for Sơn La prison. The failure is structural: a destination is still
// unphotographed precisely *because* nothing correct is geotagged there, so geosearch has only
// neighbours left to return. Proximity is now a tiebreaker among files that already name the
// place (`commonsGeo`), never evidence on its own.
//
// The other thing the lib brings is one serialised request queue with a per-host gap. An
// unpaced run once got this machine 429'd on every Wikimedia endpoint for hours.
//
// Source order per destination, first hit wins:
//   exact Wikipedia title (EN then local) → Wikipedia search → Wikidata P18 → Commons category
//   → Commons geosearch (name-validated) → Commons full-text → Openverse
//
// Writes src/data/generated/image-manifest.json: { src, credit, license, sourceTitle, sourceUrl,
// via, width } per gallery seed.
//
// Modes:
//   npm run images:fetch                 → fill only seeds with no image yet (Vietnam)
//   npm run images:fetch -- kr           → same, for the Korea atlas
//   LIMIT=8                              → stop after 8 destinations (sampling before a full run)
//   ONLY=slug-a,slug-b                   → restrict to these destination ids
//   REFETCH=scripts/.refetch-seeds.json  → re-fetch exactly the listed seeds (overwrite)
//   FORCE=1                              → re-fetch every seed
//   DRY=1                                → resolve and report, download nothing, write nothing
//
// Chế độ có người duyệt (xem scripts/review-server.mjs):
//   PROPOSE=1                            → gom ứng viên, KHÔNG tải ảnh, ghi tasks/review-queue.json
//   PROPOSE=1 FEATURED=1                 → chỉ điểm `featured`, lô đáng làm trước
//   PROPOSE=1 UPGRADE=1                  → đề xuất cả cho ô đã có ảnh, để thay bằng ảnh đẹp hơn
//   PROPOSE=1 ALL_SOURCES=1              → bật lại chuỗi free-culture (mặc định chỉ Pexels)

import { writeFileSync, mkdirSync, existsSync, readFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import { destinations } from "../src/data/destinations.ts";
import { destinationsKr } from "../src/data/kr/index.ts";
import {
  wikiTitle, wikiLead, wikidataImage, commonsCategory, commonsGeo, commonsSearch, openverse,
  commonsAttribution, downloadWebp, sleep, tokens, titleMatches, stock, stockAll, stockAvailable,
} from "./lib/image-sources.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);

const cc = (process.argv[2] ?? process.env.COUNTRY ?? "vn").toLowerCase();
// `qid` is the Wikidata country entity, used by wikidataImage to reject a same-named place
// abroad on a FACT about the subject rather than on how its title reads.
const ATLASES = {
  vn: { destinations, countryEn: "Vietnam", wikiLangs: ["en", "vi"], qid: "Q881" },
  kr: { destinations: destinationsKr, countryEn: "South Korea", wikiLangs: ["en", "ko"], qid: "Q884" },
};
const atlas = ATLASES[cc];
if (!atlas) {
  console.error(`[fetch-images] unknown country "${cc}" (expected: ${Object.keys(ATLASES).join(", ")})`);
  process.exit(1);
}

const geo = JSON.parse(readFileSync(r(`src/data/generated/geo-meta.${cc}.json`), "utf8"));
const provinceEn = new Map(geo.provinces.map((p) => [p.slug, p.nameEn]));
const OUT_DIR = r("public/img");
const manifestPath = r("src/data/generated/image-manifest.json");

// Words that never identify a *place*. Kept here rather than in the shared STOP set because
// several are ordinary food words too — "chua" is `chùa` (pagoda) here and *sour* in a dish name.
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

// ── Concurrency guard ────────────────────────────────────────────────────────
// A run from an earlier session once kept going for hours, writing wrong photos, and would
// have clobbered the manifest from its stale in-memory copy on exit. Two fetchers must never
// share the Wikimedia budget or this file.
const LOCK = r("scripts/.images.lock");
if (existsSync(LOCK) && !process.env.FORCE_UNLOCK) {
  console.error(`[fetch-images] another run holds ${LOCK} (pid ${readFileSync(LOCK, "utf8").trim()}).`);
  console.error("If you are sure it is dead: rm scripts/.images.lock");
  process.exit(1);
}

const opts = { place: true, stop: PLACE_STOP, minLen: 3 };

// The 038 venue types are modern businesses and city features whose names are ordinary English
// words, so a name match alone proves nothing: "The Note Coffee" (Hà Nội) matched "Ghost Note
// Coffee, Seattle" and a stray Seattle street photo, both perfectly, on the tokens note+coffee.
// Heritage and landscape names carry their own distinctive Vietnamese tokens and need no help;
// these do, so free-text sources must also name the province or the country.
const VENUE_TYPES = new Set(["cafe", "nightlife", "street", "viewpoint", "themepark"]);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Ordinary English words that name a venue without identifying one. A name built only from
// these could be anywhere on earth, which is the whole failure: "The Note Coffee" is note+coffee.
// A name that keeps even one Vietnamese token ("Hải Vân", "Bitexco", "Mường Hoa") is already
// distinctive and must NOT be anchored — Hải Vân straddles two provinces, so demanding the title
// say "Da Nang" would reject correctly-named photos captioned from the Huế side, or captioned
// with nothing but the pass's own name.
const GENERIC_EN = new Set([
  "coffee", "cafe", "tea", "house", "bar", "club", "lounge", "rooftop", "deck", "observation",
  "landmark", "walking", "night", "train", "sky", "view", "point", "central", "grand", "plaza",
  "mall", "center", "centre", "wonders", "world", "land", "resort", "note", "corner", "hidden",
]);

/** A geographic anchor the title has to carry before a free-text hit can win. */
function geoCue(d) {
  if (!VENUE_TYPES.has(d.type)) return undefined;
  // Only anchor when the name has nothing distinctive left to match on.
  const distinctive = tokens(`${d.nameEn} ${d.name}`, opts).filter((t) => !GENERIC_EN.has(t));
  if (distinctive.length) return undefined;
  const prov = provinceEn.get(d.provinceSlug);
  const words = [prov, d.provinceSlug.replace(/-/g, " "), atlas.countryEn, cc === "vn" ? "viet ?nam" : "hanguk"]
    .filter(Boolean)
    .map(esc);
  return new RegExp(words.join("|"), "i");
}

/**
 * Candidate sources for one destination, cheapest and most trustworthy first.
 *
 * `ratio` loosens `titleMatches` for PROPOSE mode. Only loosen it there: the automatic path has
 * no reviewer, so it keeps the strict threshold that stopped a Welsh farmhouse becoming Y Tý.
 */
function stepsFor(d, { ratio } = {}) {
  const prov = provinceEn.get(d.provinceSlug) ?? atlas.countryEn;
  const cue = geoCue(d);
  const base = ratio === undefined ? opts : { ...opts, ratio };
  const free = cue ? { ...base, cue } : base; // free-text sources, optionally geo-anchored
  const steps = [];
  // Exact article title needs no name validation — it cannot be about something else — and it
  // uses the REST endpoint, which keeps answering when w/api.php is throttled.
  for (const lang of atlas.wikiLangs) steps.push(() => wikiTitle(lang, d.nameEn, opts));
  steps.push(() => wikiTitle(atlas.wikiLangs[1], d.name, opts));
  for (const lang of atlas.wikiLangs) steps.push(() => wikiLead(lang, `${d.nameEn} ${prov}`, free));
  // Curated pick, and the only step that validates on a fact (P17) rather than on the title.
  steps.push(() => wikidataImage(d.nameEn, { ...opts, country: atlas.qid, langs: atlas.wikiLangs }));
  steps.push(() => commonsCategory(d.nameEn, free));
  steps.push(() => commonsGeo(d.lat, d.lng, d.nameEn, free));
  steps.push(() => commonsSearch(`${d.nameEn} ${prov}`, free));
  steps.push(() => commonsSearch(d.nameEn, free));
  steps.push(() => openverse(`${d.nameEn} ${prov}`, free));
  steps.push(() => openverse(d.nameEn, free));
  // Stock is LAST on purpose. Its licence is the most permissive we can get, but a stock title
  // is written to be found, not to be true, so it must never outrank a free-culture file that
  // actually names the place. Query in English with the province: Pexels files Vietnamese
  // subjects under English captions, and "Ba Na Hills Da Nang" returned 6 correctly-named hits
  // out of 8 where the bare name returned scenery.
  if (stockAvailable()) {
    steps.push(() => stock(`${d.nameEn} ${prov}`, free));
    steps.push(() => stock(d.nameEn, free));
  }
  return steps;
}

/** Walk the chain collecting up to `need` distinct picks nothing else has claimed. */
async function collect(d, need, used, stepOpts) {
  const picks = [];
  for (const step of stepsFor(d, stepOpts)) {
    if (picks.length >= need) break;
    let pick = null;
    try {
      pick = await step();
    } catch {
      continue;
    }
    if (!pick) continue;
    const key = pick.sourceTitle || pick.url;
    if (used.has(key) || picks.some((p) => (p.sourceTitle || p.url) === key)) continue;
    picks.push(pick);
  }
  return picks;
}

// ── PROPOSE mode ─────────────────────────────────────────────────────────────
// The automatic path has to be certain, so it rejects anything it cannot prove and leaves the
// seed empty — which is why 66 seeds are still empty and why they are the hard tail. With a
// human reviewer the trade inverts: gather generously, let a person pick. Everything below
// only runs under PROPOSE=1 and writes nothing into the manifest.

/** Trần ảnh mỗi điểm đến — giữ khớp với MAX_TILES trong src/lib/media/gallery.ts. */
const MAX_TILES = 10;

/** How generous to be. 0.34 lets a one-in-three token match through; strict is 1.0 / 0.6. */
const PROPOSE_RATIO = 0.34;
const PROPOSE_MAX = 5;
/**
 * URL the review grid hotlinks. Never the original file: a Commons original can be tens of MB,
 * and pulling a dozen of those per screen is slow for the reviewer and rude to Wikimedia.
 * `Special:FilePath?width=` is the documented resize redirect and works for any file we know the
 * name of; stock sources already hand us a sized CDN URL.
 */
function previewUrl(pick) {
  if (pick.preview) return pick.preview;
  const file = pick.file || (pick.sourceTitle?.startsWith("File:") ? pick.sourceTitle.slice(5) : null);
  if (file) {
    // Special:FilePath, KHÔNG phải URL thumb tự dựng trên CDN. Đường dẫn thumb tính được bằng
    // md5 và tôi đã thử — nhưng CDN trả 400 khi ảnh gốc hẹp hơn bề rộng yêu cầu, vì nó từ chối
    // phóng to. Special:FilePath gặp ca đó thì trả thẳng bản gốc, nên nó đúng cho mọi kích cỡ.
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/^File:/, ""))}?width=1200`;
  }
  return pick.url;
}

/**
 * Cờ chỉ có ích khi nó PHÂN BIỆT được. Bản đầu dán "ảnh stock" lên mọi ứng viên và "không gọi
 * đúng tên" lên 10/11 tấm — dán lên tất cả thì không còn là cờ, mắt người sẽ học cách lờ đi.
 * Nên giữ đúng những dấu hiệu hiếm và đáng dừng lại.
 */
function suspicions(d, pick) {
  const flags = [];
  const alt = pick.sourceTitle ?? "";
  const foldAlt = alt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase();

  // Dấu hiệu MẠNH nhất: tiêu đề gọi tên một tỉnh khác. Đây là thứ đã đưa ảnh Ninh Bình và
  // Bái Đính vào danh sách của Phong Nha.
  const here = (provinceEn.get(d.provinceSlug) ?? "").toLowerCase();
  for (const [slug, name] of provinceEn) {
    if (slug === d.provinceSlug) continue;
    const n = String(name).toLowerCase();
    if (n.length > 4 && foldAlt.includes(n)) { flags.push(`tiêu đề nhắc tới ${name}, không phải ${provinceEn.get(d.provinceSlug)}`); break; }
  }

  // Slug của Pexels sinh từ tiêu đề lúc tải lên, `alt` có thể sửa sau — hai bên nói hai nước
  // khác nhau là dấu hiệu gắn nhãn sai.
  const other = (pick.sourceUrl ?? "").toLowerCase()
    .match(/\b(thailand|cambodia|laos|china|indonesia|philippines|malaysia|myanmar|india|japan|korea)\b/);
  if (other) flags.push(`đường dẫn nguồn nhắc tới ${other[1].toUpperCase()}`);

  if (pick.via === "commons-geo") flags.push("chỉ khớp nhờ ở gần toạ độ");
  if (pick.via === "commons-category-loose") flags.push("khớp tên CATEGORY, không phải tên ảnh");
  if ((pick.width ?? 0) && pick.width < 1500) flags.push("nguồn nhỏ, phóng to sẽ mờ");
  return flags;
}

/**
 * Tiêu đề có gọi đúng tên điểm đến không — tín hiệu TÍCH CỰC, hiếm nên đáng làm nổi bật.
 *
 * Đòi ĐỦ token, không chấp nhận một nửa. Âm tiết tên riêng tiếng Việt ngắn và đụng nhau liên
 * tục: "Phong Nha" tách ra `phong`+`nha`, và ở ngưỡng 0.5 thì một tấm chụp ở **Hải Phòng** khớp
 * qua đúng chữ `phong` rồi được đánh dấu là đúng chỗ. Một nửa cái tên không phải là cái tên.
 */
function namesThePlace(d, pick) {
  return titleMatches(d.nameEn, pick.sourceTitle ?? "", 1, opts);
}

// ── Entry ────────────────────────────────────────────────────────────────────
const dry = process.env.DRY === "1";
const force = process.env.FORCE === "1";
const limit = Number(process.env.LIMIT ?? 0);
const only = process.env.ONLY ? new Set(process.env.ONLY.split(",").map((s) => s.trim())) : null;
const refetchPath = process.env.REFETCH;
const refetchSeeds =
  refetchPath && existsSync(r(refetchPath)) ? new Set(JSON.parse(readFileSync(r(refetchPath), "utf8"))) : null;

mkdirSync(OUT_DIR, { recursive: true });
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
const fillFn = force ? () => true : refetchSeeds ? (s) => refetchSeeds.has(s) : (s) => !manifest[s];

let places = atlas.destinations.filter((d) => (d.gallery ?? []).length);
if (only) places = places.filter((d) => only.has(d.id));
// Duyệt tay thì nên chia lô, và lô đáng làm trước là `featured`: chúng lên trang chủ nên mỗi ô
// trống ở đó đắt hơn hẳn một ô trống ở điểm ít ai mở.
if (process.env.FEATURED === "1") places = places.filter((d) => d.featured);
if (limit) places = places.slice(0, limit);

// Reserve source titles already kept, so a refetch never duplicates one onto another seed.
const used = new Set();
for (const [seed, m] of Object.entries(manifest)) {
  if (m.sourceTitle && !fillFn(seed)) used.add(m.sourceTitle);
}

if (!dry) writeFileSync(LOCK, String(process.pid));
const releaseLock = () => { try { if (!dry) unlinkSync(LOCK); } catch {} };
process.on("exit", releaseLock);
process.on("SIGINT", () => { releaseLock(); process.exit(130); });

const propose = process.env.PROPOSE === "1";
const upgrade = process.env.UPGRADE === "1";
const allSources = process.env.ALL_SOURCES === "1";
const mode = propose
  ? `PROPOSE ${allSources ? "mọi nguồn" : "chỉ Pexels"}${upgrade ? " · kể cả ô đã có ảnh" : ""}`
  : dry ? "DRY" : force ? "FORCE all" : refetchSeeds ? `REFETCH ${refetchSeeds.size}` : "fill missing";
console.log(`[fetch-images] ${cc.toUpperCase()} · ${places.length} destinations · ${mode}`);
if (propose && !stockAvailable()) console.log("  · chưa có PEXELS_API_KEY — chỉ dùng nguồn free-culture");

if (propose) {
  const queuePath = r("tasks/review-queue.json");
  const rejectedPath = r("tasks/review-rejected.json");
  // A photo the reviewer already turned down must not come back next run. Keyed on sourceUrl
  // because it is the one identifier stable across sources.
  const rejected = new Set(existsSync(rejectedPath) ? JSON.parse(readFileSync(rejectedPath, "utf8")) : []);
  // Place id từ batch 041. Trang địa điểm trên Google Maps là ảnh do khách chụp TẠI chỗ đó,
  // nên nó là bằng chứng đối chiếu mạnh hơn hẳn một lượt tìm ảnh theo từ khoá.
  const placesPath = r("src/data/generated/google-places.json");
  const googlePlaces = existsSync(placesPath) ? JSON.parse(readFileSync(placesPath, "utf8")) : {};

  const queue = [];
  let done = 0;
  for (const d of places) {
    // UPGRADE cũng đề xuất cho ô ĐÃ CÓ ảnh, để một tấm Pexels đẹp hơn được đứng cạnh tấm đang
    // dùng và người duyệt so trực tiếp. Không có nó thì chỉ lấp được chỗ trống, không nâng được
    // chất lượng chỗ đã có.
    // Chỗ trống tính theo SỐ ẢNH ĐÃ CÓ, không theo ô khai báo sẵn: seed chỉ là khoá, sinh ra khi
    // duyệt. Điểm đến nào cũng nhận được tới MAX_TILES ảnh, kể cả điểm xưa nay chỉ có 2 ô.
    const have = Object.values(manifest).filter((v) => v.dest === d.id);
    const slots = upgrade ? MAX_TILES : MAX_TILES - have.length;
    if (slots <= 0) continue;
    const current = have
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((v) => ({ src: v.src, credit: v.credit, license: v.license, via: v.via }));

    const prov = provinceEn.get(d.provinceSlug) ?? atlas.countryEn;
    // Mặc định CHỈ Pexels: nó là nguồn có chiều sâu lựa chọn và ảnh gốc lớn, mà lại không dính
    // nhịp giãn 1,1s của Wikimedia — một lượt 52 điểm rút từ ~70 phút xuống còn vài phút.
    // ALL_SOURCES=1 bật lại chuỗi free-culture khi cần.
    const free = allSources ? await collect(d, PROPOSE_MAX, used, { ratio: PROPOSE_RATIO }) : [];
    // Hai truy vấn, hai ngôn ngữ: Pexels lập chỉ mục cả tiếng Việt (người dùng tìm "động phong
    // nha" ra hàng loạt), và tên tiếng Anh kèm tỉnh bắt được nhóm ảnh do khách nước ngoài đặt tên.
    // `ratio: 0` = không lọc theo tên; `wide: false` = nhận cả ảnh dọc. Cả hai chỉ đúng ở đây,
    // nơi có người nhìn từng tấm.
    const stockOpts = { ...opts, ratio: 0, wide: false };
    const fromStock = stockAvailable()
      ? [
          ...(await stockAll(`${d.nameEn} ${prov}`, stockOpts, PROPOSE_MAX + 3)),
          ...(await stockAll(d.name, stockOpts, PROPOSE_MAX + 3)),
        ]
      : [];
    const seen = new Set();
    const picks = [...free, ...fromStock]
      .filter((p) => {
        const key = p.sourceUrl || p.url;
        if (rejected.has(key) || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      // Đủ để chọn cho mọi chỗ còn trống, cộng một ít dự phòng khi vài tấm bị loại.
      .slice(0, Math.min(PROPOSE_MAX + slots, 12));

    // Không tải gì ở bước này. Trang duyệt hotlink thẳng ảnh xem trước từ CDN của nguồn, và chỉ
    // tấm được DUYỆT mới tải về. Trước đây mỗi ứng viên là một file 2048px trên đĩa: 52 điểm
    // × 5 ứng viên ≈ 400 MB tạm cho một lượt mà phần lớn sẽ bị bỏ.
    const candidates = [];
    for (const pick of picks) {
      if (pick.credit === undefined || pick.license === undefined) {
        const attr = await commonsAttribution(pick.file);
        pick.credit ??= attr.credit;
        pick.license ??= attr.license;
      }
      candidates.push({
        n: candidates.length + 1,
        via: pick.via,
        // `preview` chỉ để nhìn; `url` mới là thứ tải về khi duyệt.
        preview: previewUrl(pick),
        url: pick.url,
        sourceTitle: pick.sourceTitle ?? "", sourceUrl: pick.sourceUrl ?? "",
        credit: pick.credit ?? "", license: pick.license || "Wikimedia Commons",
        srcWidth: pick.width ?? 0,
        flags: suspicions(d, pick), named: namesThePlace(d, pick),
      });
    }

    if (candidates.length) {
      queue.push({
        id: d.id, name: d.name, nameEn: d.nameEn,
        province: provinceEn.get(d.provinceSlug) ?? "",
        placeId: googlePlaces[d.id]?.id ?? null,
        summary: d.summary ?? "", slots, current, candidates,
      });
    }
    done++;
    process.stdout.write(`\r  ${done}/${places.length} · ${queue.length} điểm có ứng viên  `);
    await sleep(60);
  }

  writeFileSync(queuePath, JSON.stringify(queue, null, 1));
  const total = queue.reduce((n, q) => n + q.candidates.length, 0);
  console.log(`\n[fetch-images] ${queue.length} điểm đến · ${total} ứng viên → tasks/review-queue.json`);
  console.log("  duyệt bằng:  npm run review");
  process.exit(0);
}

const stats = { done: 0, images: 0, failed: 0, unfilled: [], via: {} };
let sinceSave = 0;

for (const d of places) {
  const toFill = (d.gallery ?? []).map((g) => g.seed).filter(fillFn);
  const picks = await collect(d, toFill.length, used);

  for (let i = 0; i < toFill.length; i++) {
    const seed = toFill[i];
    const pick = picks[i];
    if (!pick) { stats.unfilled.push(seed); continue; }
    if (dry) {
      console.log(`  ${d.nameEn}\n    ${seed} ← [${pick.via}] ${pick.sourceTitle}`);
      used.add(pick.sourceTitle || pick.url);
      stats.images++;
      stats.via[pick.via] = (stats.via[pick.via] ?? 0) + 1;
      continue;
    }
    try {
      const file = `${OUT_DIR}/${seed}.webp`;
      await downloadWebp(pick.url, file);
      if (pick.credit === undefined || pick.license === undefined) {
        const attr = await commonsAttribution(pick.file);
        pick.credit ??= attr.credit;
        pick.license ??= attr.license;
      }
      const meta = await sharp(file).metadata();
      used.add(pick.sourceTitle || pick.url);
      manifest[seed] = {
        src: `/img/${seed}.webp`,
        credit: pick.credit ?? "",
        license: pick.license || "Wikimedia Commons",
        sourceTitle: pick.sourceTitle ?? "",
        sourceUrl: pick.sourceUrl ?? "",
        via: pick.via,
        width: meta.width ?? 0,
      };
      stats.images++;
      stats.via[pick.via] = (stats.via[pick.via] ?? 0) + 1;
      sinceSave++;
    } catch {
      stats.failed++;
    }
  }

  stats.done++;
  // Save often. The old save-only-at-the-end behaviour is exactly what orphaned 35 downloaded
  // files when an earlier run was interrupted.
  if (!dry && sinceSave >= 5) {
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 0));
    sinceSave = 0;
  }
  if (!dry) process.stdout.write(`\r  ${stats.done}/${places.length} · ${stats.images} imgs · ${stats.unfilled.length} unfilled  `);
  await sleep(60);
}

if (!dry) writeFileSync(manifestPath, JSON.stringify(manifest, null, 0));
const covered = atlas.destinations.filter((d) => (d.gallery ?? []).some((g) => manifest[g.seed])).length;
console.log(`\n[fetch-images] ${stats.images} picks · ${stats.failed} failed · ${stats.unfilled.length} unfilled`);
console.log(`[fetch-images] via: ${JSON.stringify(stats.via)}`);
console.log(`[fetch-images] coverage: ${covered}/${atlas.destinations.length} ${cc.toUpperCase()} destinations`);
