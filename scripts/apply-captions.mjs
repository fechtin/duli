// Đổ caption vào manifest cho những ảnh vừa được duyệt.
//
// Caption THUỘC VỀ TẤM ẢNH, không thuộc ô gallery. Mô hình cũ đặt caption ở ô: viết trước, nằm
// trong D1, năm mảng khớp chỉ số, mô tả một tấm ảnh chưa tồn tại — đó chính là thứ đẻ ra 109 ô
// caption tả một đằng ảnh một nẻo. Caption gắn vào ảnh thì không thể trôi khỏi ảnh, và vì nó nằm
// trong manifest (file tĩnh) nên KHÔNG cần reseed D1.
//
// Phân công: người duyệt chọn ảnh, không gõ chữ. Caption do người viết nội dung soạn lại từ
// `sourceTitle` của nguồn, bằng giọng của FechTin Go, đủ 5 thứ tiếng.
//
//   node scripts/apply-captions.mjs --todo                 → liệt kê ảnh còn thiếu caption
//   node scripts/apply-captions.mjs tasks/captions-NNN.json → áp vào manifest
//
// File caption có dạng: { "<seed>": { vi, en, ja, ko, zh }, … } — thiếu ngôn ngữ nào cũng được,
// photoCaption() sẽ lùi locale → vi → en → caption cũ của ô.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = resolve(root, "src/data/generated/image-manifest.json");
const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const LOCALES = ["vi", "en", "ja", "ko", "zh"];

const arg = process.argv[2];

if (!arg || arg === "--todo") {
  // Chỉ ảnh ĐI QUA TRANG DUYỆT (`reviewedAt`) mới thuộc mô hình caption-theo-ảnh. ~750 ảnh cũ
  // vẫn dùng caption của ô trong D1 và phần lớn là đúng — viết lại hết chỉ tạo churn vô ích.
  // `--all` khi nào thật sự muốn xem cả kho cũ.
  const every = process.argv.includes("--all");
  const todo = Object.entries(manifest).filter(
    ([, v]) => !v.caption && v.sourceTitle && (every || v.reviewedAt),
  );
  console.log(`${todo.length} ảnh chưa có caption theo ảnh${every ? " (kể cả kho cũ)" : " (đã qua trang duyệt)"}\n`);
  for (const [seed, v] of todo) console.log(`${seed}\n   [${v.via}] ${v.sourceTitle}`);
  if (todo.length) {
    console.log(`\nSoạn một file { "<seed>": { vi, en, ja, ko, zh } } rồi:`);
    console.log("  node scripts/apply-captions.mjs tasks/captions-xxx.json");
  }
  process.exit(0);
}

const file = resolve(root, arg);
if (!existsSync(file)) {
  console.error(`không thấy ${arg}`);
  process.exit(1);
}
const captions = JSON.parse(readFileSync(file, "utf8"));

let applied = 0;
const problems = [];
for (const [seed, cap] of Object.entries(captions)) {
  if (!manifest[seed]) { problems.push(`${seed}: không có trong manifest`); continue; }
  const clean = {};
  for (const l of LOCALES) if (typeof cap[l] === "string" && cap[l].trim()) clean[l] = cap[l].trim();
  if (!clean.vi) { problems.push(`${seed}: thiếu tiếng Việt — đó là bản mọi locale khác lùi về`); continue; }
  manifest[seed].caption = clean;
  applied++;
}

if (!problems.length) writeFileSync(MANIFEST, JSON.stringify(manifest, null, 0));
console.log(`${applied}/${Object.keys(captions).length} caption áp vào manifest`);
if (problems.length) {
  console.log("\nKHÔNG ghi gì cả — sửa các lỗi này trước:");
  problems.forEach((p) => console.log("  ·", p));
  process.exit(1);
}
const left = Object.values(manifest).filter((v) => !v.caption && v.sourceTitle && v.reviewedAt).length;
console.log(`còn ${left} ảnh đã duyệt chưa có caption`);
