// Guard: mọi ảnh có thật đều được hiện, mọi seed được gọi tên đều có ảnh.
//
//   node --experimental-strip-types scripts/check-photos.mjs        (npm run check:photos)
//
// Vì sao cần: manifest ảnh là nguồn sự thật, nhưng suốt một thời gian dài có tới ba bảng viết tay
// song song trả lời cùng câu hỏi "ảnh nào đại diện cho X" — mảng `gallery` slot trong D1,
// `CALENDAR_SEEDS`, `HERO_PLACES`. Không bảng nào được đối chiếu với manifest. Đợt audit 044 xoá
// 66 ảnh sai chủ thể; mọi slot trỏ vào chúng lặng lẽ tụt về gradient. Hậu quả nằm im hai tuần:
// 17 điểm đến có ảnh mà không hiện, 5 thẻ living-calendar cũng vậy, 17 trang crawler lên Google
// không còn tấm ảnh nào — không lỗi, không test trượt, diff nhìn vẫn lành.
//
// Nên guard này KHÔNG kiểm một bảng cụ thể nào. Nó kiểm bất biến. Bảng thứ tư mọc lên tháng sau
// vẫn bị bắt, vì câu hỏi vẫn là: có ảnh nào không ai hiện không, có tên ảnh nào không có ảnh
// không, và có ai đang tự trả lời câu hỏi này ngoài `photoIndex` không.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { buildPhotoIndex } from "../src/lib/media/photoIndex.ts";
import {
  CALENDAR_DESTINATION,
  CALENDAR_PROVINCE,
  CALENDAR_SEED_OVERRIDES,
  HERO_PLACES,
} from "../src/lib/living/calendarJoin.ts";
import { destinations } from "../src/data/destinations.ts";
import { destinationsKr } from "../src/data/kr/index.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const manifest = read("src/data/generated/image-manifest.json");
const photos = buildPhotoIndex(manifest);
const seasonal = read("src/data/living/seasonal-calendar.json");
const flower = read("src/data/living/flower-calendar.json");
const festival = read("src/data/living/festival-calendar.json");

const allDestinations = [...destinations, ...destinationsKr];
const destIds = new Set(allDestinations.map((d) => d.id));

const livingIds = [
  ...new Set([
    ...Object.values(seasonal).flatMap((es) => es.map((e) => e.destinationId)),
    ...Object.values(flower).flatMap((es) => es.map((e) => e.destinationId)),
    ...festival.festivals.flatMap((f) => f.destinationIds),
  ]),
].sort();

/**
 * Thẻ living-calendar được phép để trống — nhưng chỉ khi lý do còn đúng. Ngày `chua-huong` có ảnh
 * duyệt xong, guard sẽ đòi xoá dòng này thay vì để thẻ trống mãi mãi. Một danh sách miễn trừ
 * không tự hết hạn thì chính nó thành chỗ giấu lỗi.
 */
const NO_PHOTO_YET = {
  "ho-chi-minh-city": "là một tỉnh, mở ProvincePanel — không có điểm đến để lấy ảnh bìa",
  // `perfume-pagoda` từng ở đây. Guard đã đòi xoá đúng như thiết kế, ngày chua-huong-1 về.
};

const failures = [];
const notes = [];
const fail = (inv, msg) => failures.push(`${inv}  ${msg}`);

// ── I1 · Mọi seed viết tay đều phải có ảnh ────────────────────────────────────
// Bảng curated là nơi duy nhất còn được phép gõ tên seed bằng tay. Đổi lại, chúng phải đúng.
for (const p of HERO_PLACES) {
  if (!photos.has(p.seed)) fail("I1", `HERO_PLACES "${p.id}" trỏ seed không có ảnh: ${p.seed}`);
}
for (const [id, seed] of Object.entries(CALENDAR_SEED_OVERRIDES)) {
  if (!photos.has(seed)) fail("I1", `CALENDAR_SEED_OVERRIDES "${id}" trỏ seed không có ảnh: ${seed}`);
}

// ── I2 · Chỉ một trọng tài ────────────────────────────────────────────────────
// Mảng `gallery` slot trong dữ liệu tác giả KHÔNG nói được ảnh nào còn sống — nó là danh sách ô
// viết trước khi ảnh tồn tại. Ai đọc `gallery[0].seed` để chọn ảnh là đang dựng lại đúng cái bảng
// song song vừa gỡ đi.
const SEED_FROM_SLOT = /\.gallery\s*\??\.?\s*\[\s*0\s*\]\s*\??\.\s*seed/;
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const sources = [...walk(join(root, "src")), ...walk(join(root, "worker"))].filter((p) =>
  /\.tsx?$/.test(p),
);
for (const file of sources) {
  const rel = file.slice(root.length + 1);
  if (rel.startsWith("src/lib/media/")) continue; // trọng tài được phép đọc dữ liệu thô
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (SEED_FROM_SLOT.test(line)) {
        fail("I2", `${rel}:${i + 1} chọn ảnh từ gallery slot — dùng photos.thumbSeedFor(id)`);
      }
    });
}

// ── I3 · Thẻ living-calendar ──────────────────────────────────────────────────
// Id lịch mùa vụ nằm trong namespace riêng. Đây là chỗ `ha-giang-loop` từng mở đúng panel Đèo Mã
// Pì Lèng nhưng hiện gradient: bảng điều hướng đủ, bảng ảnh thiếu, cùng một id.
for (const id of livingIds) {
  const seed = CALENDAR_SEED_OVERRIDES[id] ?? photos.thumbSeedFor(CALENDAR_DESTINATION[id] ?? id);
  const shows = photos.has(seed);
  const excused = NO_PHOTO_YET[id];

  if (shows && excused) {
    fail("I3", `"${id}" đã có ảnh (${seed}) — xoá nó khỏi NO_PHOTO_YET`);
  } else if (!shows && !excused) {
    const destId = CALENDAR_DESTINATION[id] ?? id;
    const known = destIds.has(destId);
    fail(
      "I3",
      `"${id}" hiện gradient — ${
        CALENDAR_PROVINCE[id]
          ? "là tỉnh, cần một dòng NO_PHOTO_YET"
          : known
            ? `điểm đến ${destId} chưa có ảnh nào`
            : `không tới được điểm đến nào (${destId})`
      }`,
    );
  }
}

// ── I4 · Ảnh mồ côi ───────────────────────────────────────────────────────────
// Một tấm ảnh gắn `dest` không khớp id nào là ảnh nằm trên đĩa mà không bề mặt nào hiện được:
// tốn dung lượng, và thường là dấu vết của một id bị đổi tên nửa chừng.
for (const destId of photos.destIds()) {
  if (!destIds.has(destId)) {
    const seeds = photos.seedsFor(destId);
    fail("I4", `${seeds.length} ảnh gắn dest "${destId}" — không có điểm đến nào mang id này`);
  }
}

// ── I5 · Manifest nói có, đĩa nói không ───────────────────────────────────────
for (const destId of photos.destIds()) {
  for (const seed of photos.seedsFor(destId)) {
    const src = photos.meta(seed)?.src;
    if (src && !existsSync(join(root, "public", src))) {
      fail("I5", `${seed} có trong manifest nhưng public${src} không tồn tại`);
    }
  }
}

// ── Báo cáo ───────────────────────────────────────────────────────────────────
// Không phải mọi khoảng trống đều là lỗi: 44 điểm đến thật sự chưa có ảnh nào, và gradient ở đó
// là câu trả lời trung thực. Chúng được đếm, không được coi là trượt.
const withPhotos = allDestinations.filter((d) => photos.heroSeedFor(d.id)).length;
notes.push(`${withPhotos}/${allDestinations.length} điểm đến có ảnh bìa`);
notes.push(`${livingIds.length} id living-calendar, ${Object.keys(NO_PHOTO_YET).length} miễn trừ`);
notes.push(`${sources.length} file .ts/.tsx đã quét cho I2`);

console.log("check:photos");
for (const n of notes) console.log(`  · ${n}`);
if (failures.length) {
  console.error(`\n${failures.length} vi phạm:\n`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log("\n✓ mọi ảnh có thật đều có chỗ hiện, mọi seed được gọi tên đều có ảnh");
