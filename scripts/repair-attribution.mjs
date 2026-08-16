// Hỏi lại Wikimedia về tác giả + giấy phép cho những ảnh trong manifest còn mờ nguồn.
// CHỈ gọi metadata — không tải một byte ảnh nào.
//
// Vì sao cần: ngày 2026-06-27, commit 48b57bc ghi đè ảnh Commons bằng lead image của Wikipedia
// và đường ghi đè đó không mang theo attribution. Manifest từ 201 ảnh / 1 ảnh thiếu tác giả
// nhảy lên 296 ảnh / 100 ảnh thiếu tác giả, và nằm im hai tháng. Phần lớn đã khôi phục được
// từ chính lịch sử git; phần còn lại phải hỏi lại nguồn.
//
// Bẫy đã gặp: nhiều bản ghi chỉ lưu tên BÀI VIẾT chứ không lưu tên file. Lead image của một bài
// có thể đã bị thay từ lúc ảnh được lấy về, nên tin thẳng sẽ ghi NHẦM tác giả — tệ hơn để trống.
// Chốt chặn: so tỉ lệ khung hình của file trên đĩa với ảnh mà bài đang trỏ tới; lệch quá 1,5%
// thì bỏ qua, để người xem lại.
//
// Chạy:  DRY=1 node scripts/repair-attribution.mjs     (xem trước, không ghi)
//        node scripts/repair-attribution.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const P = resolve(root, "src/data/generated/image-manifest.json");
const manifest = JSON.parse(readFileSync(P, "utf8"));
const DRY = process.env.DRY === "1";

const UA = "FechTinGo/1.0 (https://go.fechtin.com; attribution repair)";
let lastCall = 0;
/** Wikimedia phạt nặng nếu dồn dập — giữ đúng khoảng cách 1,1s như mọi fetcher khác trong repo. */
async function paced(url) {
  const wait = 1100 - (Date.now() - lastCall);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCall = Date.now();
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  return res.ok ? res.json() : null;
}

const clean = (h) => (h ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, 80);
const vague = (l) => !l || l === "Wikimedia Commons" || l === "Attribution";

async function fileMeta(fileTitle) {
  const t = encodeURIComponent(fileTitle.startsWith("File:") ? fileTitle : `File:${fileTitle}`);
  const j = await paced(
    `https://commons.wikimedia.org/w/api.php?action=query&titles=${t}` +
      `&prop=imageinfo&iiprop=extmetadata|size&format=json&origin=*`,
  );
  const info = Object.values(j?.query?.pages ?? {})[0]?.imageinfo?.[0];
  if (!info) return null;
  const em = info.extmetadata ?? {};
  return { credit: clean(em.Artist?.value), license: clean(em.LicenseShortName?.value) };
}

async function leadImage(lang, articleTitle) {
  const j = await paced(
    `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}` +
      `&prop=pageimages&piprop=original|name&format=json&origin=*`,
  );
  const page = Object.values(j?.query?.pages ?? {})[0];
  if (!page?.original || !page?.pageimage) return null;
  return { file: page.pageimage, width: page.original.width, height: page.original.height };
}

const todo = Object.entries(manifest).filter(([, v]) => (!v.credit || vague(v.license)) && v.sourceTitle);
console.log(`cần hỏi lại: ${todo.length}\n`);

const skipped = [];
let applied = 0;

for (const [seed, rec] of todo) {
  let meta = null;
  let resolvedFile = rec.sourceTitle;

  if (rec.sourceTitle.startsWith("File:")) {
    meta = await fileMeta(rec.sourceTitle);
  } else {
    const lang = rec.via?.endsWith("-en") ? "en" : "vi";
    const lead = await leadImage(lang, rec.sourceTitle);
    if (!lead) { skipped.push([seed, "bài không còn lead image"]); continue; }

    const local = await sharp(resolve(root, `public${rec.src}`)).metadata();
    const drift = Math.abs(local.width / local.height - lead.width / lead.height) / (lead.width / lead.height);
    if (drift > 0.015) {
      skipped.push([seed, `tỉ lệ lệch ${(drift * 100).toFixed(1)}% — lead image có thể đã bị thay`]);
      continue;
    }
    resolvedFile = `File:${lead.file}`;
    meta = await fileMeta(lead.file);
  }

  if (!meta || (!meta.credit && vague(meta.license))) { skipped.push([seed, "Commons không trả về gì"]); continue; }
  const before = `${rec.credit || "—"} / ${rec.license}`;
  if (meta.credit) rec.credit = meta.credit;
  if (meta.license && !vague(meta.license)) rec.license = meta.license;
  rec.sourceTitle = resolvedFile;
  applied++;
  console.log(`  ✓ ${seed.padEnd(26)} ${before}  →  ${rec.credit || "—"} / ${rec.license}`);
}

console.log(`\náp được: ${applied} | bỏ qua: ${skipped.length}`);
skipped.forEach(([s, why]) => console.log(`  · ${s.padEnd(26)} ${why}`));
if (!DRY) { writeFileSync(P, JSON.stringify(manifest, null, 0)); console.log("\nđã ghi manifest"); }
else console.log("\n(DRY, không ghi)");
