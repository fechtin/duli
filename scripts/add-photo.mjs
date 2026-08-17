// Thêm một ảnh cho một điểm đến từ URL người dùng đưa.
//
// Cùng đường đi với trang duyệt (tải → 1280 + lg 2048 + thumb → manifest kèm provenance), chỉ
// khác là nguồn do người chọn chứ không phải máy đề xuất. Vẫn qua đủ các chốt: giấy phép ND và
// GFDL-đơn bị từ chối, tác giả và giấy phép LUÔN phải ghi được — không có hai thứ đó thì ta lặp
// lại đúng lớp lỗi đã dọn ngày 17/08, khi 815 ảnh không truy được nguồn.
//
//   node scripts/add-photo.mjs <destId> <url>
//   node scripts/add-photo.mjs <destId> <url> --credit "Tên tác giả" --license "Tự chụp"
//
// Pexels / Unsplash / Wikimedia Commons: chỉ cần URL, script tự đọc tác giả và giấy phép.
// Nguồn khác: bắt buộc --credit và --license, vì không có cách nào tự biết.

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import { downloadWebp, commonsAttribution, forbidsDerivatives, gfdlOnly, UA } from "./lib/image-sources.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const r = (p) => resolve(root, p);
const MANIFEST = r("src/data/generated/image-manifest.json");
const DISPLAY_W = 1280, LG_W = 2048, LG_MIN_SRC = 1600;

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const [destId, url] = argv.filter((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));

if (!destId || !url) {
  console.error("dùng: node scripts/add-photo.mjs <destId> <url> [--credit X --license Y]");
  process.exit(1);
}

/** Đọc tác giả + giấy phép + URL ảnh gốc từ chính nguồn, khi nguồn cho biết. */
async function resolveSource(u) {
  const pexels = u.match(/pexels\.com\/.*?(\d+)\/?(?:\?|$)/);
  if (pexels) {
    const key = process.env.PEXELS_API_KEY;
    if (!key) throw new Error("cần PEXELS_API_KEY trong .env");
    const p = await fetch(`https://api.pexels.com/v1/photos/${pexels[1]}`, {
      headers: { Authorization: key },
    }).then((x) => x.json());
    if (!p?.src) throw new Error(`Pexels không trả về ảnh ${pexels[1]}`);
    return { download: p.src.original, credit: p.photographer ?? "", license: "Pexels License",
      sourceTitle: p.alt ?? "", sourceUrl: p.url, via: "pexels", width: p.width };
  }

  const commons = u.match(/(?:commons\.wikimedia\.org\/wiki\/|Special:FilePath\/)(File:.+?)(?:[?#]|$)/);
  if (commons) {
    const file = decodeURIComponent(commons[1]);
    const attr = await commonsAttribution(file);
    if (!attr.credit && !attr.license) throw new Error(`Commons không có dữ liệu cho ${file}`);
    return { download: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/^File:/, ""))}`,
      credit: attr.credit, license: attr.license, sourceTitle: file, sourceUrl: u, via: "commons-manual", width: 0 };
  }

  const unsplash = u.match(/unsplash\.com\/photos\/(?:.*-)?([A-Za-z0-9_-]{11})/);
  if (unsplash) {
    const key = process.env.UNSPLASH_ACCESS_KEY;
    if (!key) throw new Error("cần UNSPLASH_ACCESS_KEY trong .env");
    const p = await fetch(`https://api.unsplash.com/photos/${unsplash[1]}`, {
      headers: { Authorization: `Client-ID ${key}`, "User-Agent": UA },
    }).then((x) => x.json());
    if (p?.links?.download_location) {
      await fetch(p.links.download_location, { headers: { Authorization: `Client-ID ${key}` } }).catch(() => {});
    }
    return { download: p.urls?.full ?? p.urls?.regular, credit: p.user?.name ?? "", license: "Unsplash License",
      sourceTitle: p.alt_description ?? "", sourceUrl: p.links?.html ?? u, via: "unsplash", width: p.width };
  }

  // Nguồn không tự khai được: người đưa link phải khai thay, không có đường tắt.
  const credit = flag("credit"), license = flag("license");
  if (!credit || !license) {
    throw new Error(
      "Nguồn này không tự khai tác giả/giấy phép được.\n" +
      "  Thêm: --credit \"Tên tác giả\" --license \"CC BY 4.0\" (hoặc \"Tự chụp\", \"Được tác giả cho phép\")\n" +
      "  Ảnh lấy từ blog/báo/mạng xã hội mà không có phép thì KHÔNG dùng được.",
    );
  }
  return { download: u, credit, license, sourceTitle: flag("title") ?? "", sourceUrl: u, via: "manual", width: 0 };
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const src = await resolveSource(url);

if (forbidsDerivatives(src.license)) throw new Error(`giấy phép ${src.license} cấm phái sinh — không dùng được`);
if (gfdlOnly(src.license)) throw new Error(`${src.license} đòi đính kèm toàn văn giấy phép — không dùng được`);

// Seed sinh tại chỗ, cùng quy tắc với trang duyệt.
let seed;
for (let n = 1; n <= 99; n++) if (!manifest[`${destId}-${n}`]) { seed = `${destId}-${n}`; break; }

const tmp = r(`public/img/_tmp/${seed}.webp`);
mkdirSync(r("public/img/_tmp"), { recursive: true });
await downloadWebp(src.download, tmp, { width: LG_W, quality: 80 });
const meta = await sharp(tmp).metadata();

await sharp(tmp).resize({ width: DISPLAY_W, withoutEnlargement: true }).webp({ quality: 74 })
  .toFile(r(`public/img/${seed}.webp`));
let hasLg = false;
if ((meta.width ?? 0) >= LG_MIN_SRC) {
  mkdirSync(r("public/img/lg"), { recursive: true });
  await sharp(tmp).resize({ width: LG_W, withoutEnlargement: true }).webp({ quality: 78 })
    .toFile(r(`public/img/lg/${seed}.webp`));
  hasLg = true;
}
mkdirSync(r("public/img/thumb"), { recursive: true });
await sharp(tmp).resize(96, 96, { fit: "cover", position: "attention" }).webp({ quality: 70 })
  .toFile(r(`public/img/thumb/${seed}.webp`));
try { rmSync(tmp); } catch {}

const siblings = Object.values(manifest).filter((v) => v.dest === destId);
manifest[seed] = {
  src: `/img/${seed}.webp`,
  dest: destId,
  order: siblings.length ? Math.max(...siblings.map((v) => v.order ?? 0)) + 1 : 0,
  credit: src.credit, license: src.license,
  sourceTitle: src.sourceTitle, sourceUrl: src.sourceUrl, via: src.via,
  width: src.width || meta.width || 0,
  ...(hasLg ? { lg: true } : {}),
  reviewedAt: new Date().toLocaleDateString("sv-SE"),
};
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 0));

console.log(`✓ ${seed}`);
console.log(`  ${meta.width}×${meta.height}${hasLg ? " · có bản zoom" : ""}`);
console.log(`  © ${src.credit || "(không có)"} · ${src.license}`);
console.log(`  ${src.sourceTitle || "(không có tiêu đề)"}`);
console.log(`\n  caption: chạy npm run captions khi xong lô`);
