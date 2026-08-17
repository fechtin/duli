// Trang duyệt ảnh, chạy CỤC BỘ. Không có auth vì nó không bao giờ rời khỏi máy này.
//
// Vì sao tồn tại: đường tự động phải tự chắc chắn mới được ghi, nên nó từ chối mọi thứ không
// chứng minh được và để trống 66 seed — đúng phần đuôi khó nhất. Có người duyệt thì đổi được
// giao kèo: `PROPOSE=1 node scripts/fetch-images.mjs` gom ứng viên một cách hào phóng, ở đây
// một người nhìn và quyết. Bước gom KHÔNG tải ảnh: trang này hotlink bản xem trước thẳng từ
// CDN của nguồn, và chỉ tấm được duyệt mới tải về. Phần lớn ứng viên bị bỏ, nên tải trước là
// tải phí — một lượt 52 điểm từng ngốn ~400 MB tạm cho những tấm không ai dùng.
//
//   PROPOSE=1 node --experimental-strip-types scripts/fetch-images.mjs vn
//   npm run review            → http://localhost:5180
//
// Duyệt xong: ảnh vào public/img/, manifest có đủ provenance, thumb dựng sẵn. Rồi `git push`.

import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, extname } from "node:path";
import sharp from "sharp";
import { forbidsDerivatives, downloadWebp } from "./lib/image-sources.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const r = (p) => resolve(root, p);
const PORT = Number(process.env.PORT ?? 5180);

const QUEUE = r("tasks/review-queue.json");
const REJECTED = r("tasks/review-rejected.json");
const MANIFEST = r("src/data/generated/image-manifest.json");
const THUMB_DIR = r("public/img/thumb");
const LG_DIR = r("public/img/lg");
/** Nơi tấm vừa duyệt được tải về trước khi cắt ra các bản. Xoá ngay sau đó. */
const TMP_DIR = r("public/img/_tmp");

/** Trần ảnh mỗi điểm đến — giữ khớp với MAX_TILES trong src/lib/media/gallery.ts. */
const MAX_TILES = 10;

/** Bản hiển thị: đủ cho ô gallery và ảnh bìa, không hơn — đây là bản MỌI người tải. */
const DISPLAY_W = 1280;
/** Bản cho lightbox: chỉ tải khi người dùng mở phóng to. */
const LG_W = 2048;
/** Dưới ngưỡng này thì bản lớn không nét hơn bản thường, đừng tốn byte. */
const LG_MIN_SRC = 1600;

const readJson = (p, fallback) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : fallback);
const send = (res, code, body, type = "application/json") =>
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" }).end(body);
const sendJson = (res, code, obj) => send(res, code, JSON.stringify(obj));

const MIME = { ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".html": "text/html; charset=utf-8" };

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString() || "{}");
}

/** Bỏ một điểm đến khỏi hàng đợi. */
function dropDestination(destId) {
  const queue = readJson(QUEUE, []).filter((q) => q.id !== destId);
  writeFileSync(QUEUE, JSON.stringify(queue, null, 1));
  return queue.length;
}

/**
 * Duyệt một ứng viên cho một seed: tải bản gốc về, cắt ra bản hiển thị + bản lớn + thumb,
 * rồi ghi manifest kèm đủ provenance.
 *
 * KHÔNG ghi caption ở đây. Người duyệt chỉ làm việc mà chỉ người mới làm được — đúng chỗ
 * chưa, đẹp chưa. Caption viết sau, theo ảnh, 5 thứ tiếng, bằng scripts/apply-captions.mjs.
 */
/**
 * Seed cho một ảnh mới. Seed KHÔNG còn là chỗ đặt trước khai báo sẵn trong dữ liệu điểm đến —
 * nó chỉ là khoá trong manifest và là tên file. Vậy nên sinh ra lúc cần, không đăng ký trước.
 */
function nextSeed(manifest, destId) {
  for (let n = 1; n <= 99; n++) {
    const seed = `${destId}-${n}`;
    if (!manifest[seed]) return seed;
  }
  throw new Error(`${destId}: hết chỗ đặt tên seed`);
}

async function approve({ destId, n }) {
  const queue = readJson(QUEUE, []);
  const dest = queue.find((q) => q.id === destId);
  const cand = dest?.candidates.find((c) => c.n === n);
  if (!cand) throw new Error(`không thấy ứng viên ${n} của ${destId}`);
  const seed = nextSeed(readJson(MANIFEST, {}), destId);

  // Tải Ở ĐÂY, không phải lúc gom. Bước gom chỉ hotlink ảnh xem trước từ CDN của nguồn, nên
  // chỉ tấm thực sự được chọn mới tốn băng thông và chỗ trên đĩa.
  mkdirSync(TMP_DIR, { recursive: true });
  const srcFile = `${TMP_DIR}/${seed}.webp`;
  await downloadWebp(cand.url, srcFile, { width: LG_W, quality: 80 });
  const meta = await sharp(srcFile).metadata();

  mkdirSync(r("public/img"), { recursive: true });
  await sharp(srcFile).resize({ width: DISPLAY_W, withoutEnlargement: true }).webp({ quality: 74 })
    .toFile(r(`public/img/${seed}.webp`));

  // Bản lớn chỉ tạo khi nguồn thật sự lớn hơn bản hiển thị — nếu không thì nó chỉ là cùng một
  // ảnh nặng gấp đôi, và chi phí đó rơi vào người mở lightbox mà chẳng nét thêm.
  let hasLg = false;
  if ((meta.width ?? 0) >= LG_MIN_SRC) {
    mkdirSync(LG_DIR, { recursive: true });
    await sharp(srcFile).resize({ width: LG_W, withoutEnlargement: true }).webp({ quality: 78 })
      .toFile(`${LG_DIR}/${seed}.webp`);
    hasLg = true;
  }

  // Thumb marker dựng TRƯỚC khi ghi manifest — trừ ảnh ND, thứ không được phép cắt cúp.
  // Thứ tự này quan trọng: server chết giữa chừng thì để lại file thừa (vô hại, build-thumbs dọn
  // được) chứ không để lại một bản ghi manifest trỏ vào bộ tài sản còn thiếu. Đã xảy ra thật với
  // phong-nha-cave-2 ngày 17/08.
  if (!forbidsDerivatives(cand.license || "")) {
    mkdirSync(THUMB_DIR, { recursive: true });
    await sharp(srcFile).resize(96, 96, { fit: "cover", position: "attention" }).webp({ quality: 70 })
      .toFile(`${THUMB_DIR}/${seed}.webp`);
  }
  try { rmSync(srcFile); } catch {}

  const manifest = readJson(MANIFEST, {});
  // `dest` + `order` là thứ để src/lib/media/gallery.ts dựng lại gallery từ manifest. Không có
  // chúng thì ảnh vẫn tải về nhưng không bao giờ xuất hiện trong thư viện của điểm đến.
  const siblings = Object.values(manifest).filter((v) => v.dest === destId);
  const order = siblings.length ? Math.max(...siblings.map((v) => v.order ?? 0)) + 1 : 0;
  manifest[seed] = {
    src: `/img/${seed}.webp`,
    dest: destId,
    order: manifest[seed]?.order ?? order,
    credit: cand.credit ?? "",
    license: cand.license || "Wikimedia Commons",
    sourceTitle: cand.sourceTitle ?? "",
    sourceUrl: cand.sourceUrl ?? "",
    via: cand.via,
    // `width` giữ đúng nghĩa như mọi bản ghi khác: kích thước ẢNH GỐC ở nguồn, không phải
    // kích thước bản ta lưu. Nó là thứ cho biết sau này còn phóng to được nữa hay không.
    width: cand.srcWidth ?? cand.width ?? meta.width ?? 0,
    ...(hasLg ? { lg: true } : {}),
    // Ngày địa phương. toISOString() trả về UTC, và ở +07/+09 thì trước trưa nó lùi mất một ngày.
    reviewedAt: new Date().toLocaleDateString("sv-SE"),
  };
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 0));

  // Ứng viên vừa dùng không được đề xuất lại cho seed khác.
  dest.candidates = dest.candidates.filter((c) => c.n !== n);
  const rest = queue.filter((q) => q.id !== destId);
  const next = dest.candidates.length ? [dest, ...rest] : rest;
  writeFileSync(QUEUE, JSON.stringify(next, null, 1));

  return { seed, hasLg, license: manifest[seed].license, remaining: next.length };
}

/** Anh em cùng điểm đến, đã sắp theo `order`. */
function siblingsOf(manifest, dest) {
  return Object.entries(manifest)
    .filter(([, v]) => v.dest === dest)
    .sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0))
    .map(([k]) => k);
}

/** Ghi lại `order` 0..n theo đúng mảng truyền vào. */
function writeOrder(manifest, ordered) {
  ordered.forEach((k, i) => { manifest[k].order = i; });
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 0));
}

/** Dời một ảnh lên/xuống một bậc. Thứ tự này là thứ tự hiển thị thật trong thư viện. */
function reorder(seed, delta) {
  const manifest = readJson(MANIFEST, {});
  const rec = manifest[seed];
  if (!rec?.dest) throw new Error(`${seed} chưa gắn với điểm đến nào`);
  const list = siblingsOf(manifest, rec.dest);
  const i = list.indexOf(seed);
  const j = i + delta;
  if (j < 0 || j >= list.length) return { order: list };
  [list[i], list[j]] = [list[j], list[i]];
  writeOrder(manifest, list);
  return { order: list };
}

/**
 * Đặt một ảnh làm ảnh chính của điểm đến.
 *
 * "Ảnh chính" không phải một cờ riêng — nó là tấm có `order` nhỏ nhất, thứ mà DestinationPanel
 * lấy làm ảnh bìa và Gallery lấy làm ô lớn đầu tiên. Một sự thật, một chỗ lưu: thêm cờ `hero`
 * nữa là mở đường cho hai nguồn nói khác nhau.
 */
function setHero(seed) {
  const manifest = readJson(MANIFEST, {});
  const rec = manifest[seed];
  if (!rec?.dest) throw new Error(`${seed} chưa gắn với điểm đến nào`);
  const ordered = [seed, ...siblingsOf(manifest, rec.dest).filter((k) => k !== seed)];
  writeOrder(manifest, ordered);
  return { hero: seed, order: ordered };
}

/**
 * Gỡ một ảnh đang dùng. Người duyệt là người duy nhất thấy được "tấm này trùng tấm kia" hay
 * "tấm này không phải chỗ đó" — không có nút gỡ thì cái thấy đó không đi tới đâu.
 */
function remove(seed) {
  const manifest = readJson(MANIFEST, {});
  const rec = manifest[seed];
  if (!rec) throw new Error(`không có ${seed} trong manifest`);
  for (const f of [r(`public${rec.src}`), `${LG_DIR}/${seed}.webp`, `${THUMB_DIR}/${seed}.webp`]) {
    try { rmSync(f); } catch {}
  }
  delete manifest[seed];
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 0));
  return { removed: seed };
}

/** Từ chối cả nhóm ứng viên của một điểm đến — ghi nhớ để lần chạy sau không đề xuất lại. */
function reject(destId) {
  const queue = readJson(QUEUE, []);
  const dest = queue.find((q) => q.id === destId);
  if (!dest) throw new Error(`không thấy ${destId}`);
  const rejected = new Set(readJson(REJECTED, []));
  for (const c of dest.candidates) if (c.sourceUrl) rejected.add(c.sourceUrl);
  writeFileSync(REJECTED, JSON.stringify([...rejected], null, 1));
  return { remaining: dropDestination(destId), rejected: dest.candidates.length };
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname === "/") {
      return send(res, 200, readFileSync(r("scripts/review-page.html"), "utf8"), MIME[".html"]);
    }
    if (url.pathname === "/api/queue") {
      const manifest = readJson(MANIFEST, {});
      const live = readJson(QUEUE, []).map((d) => {
        const current = Object.entries(manifest)
          .filter(([, v]) => v.dest === d.id)
          .sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0))
          .map(([seed, v]) => ({ seed, src: v.src, credit: v.credit, license: v.license, via: v.via }));
        return { ...d, current, slots: Math.max(0, MAX_TILES - current.length) };
      });
      return sendJson(res, 200, live);
    }
    if (url.pathname === "/api/approve" && req.method === "POST") {
      return sendJson(res, 200, await approve(await readBody(req)));
    }
    if (url.pathname === "/api/reject" && req.method === "POST") {
      return sendJson(res, 200, reject((await readBody(req)).destId));
    }
    if (url.pathname === "/api/reorder" && req.method === "POST") {
      const b = await readBody(req);
      return sendJson(res, 200, reorder(b.seed, b.delta));
    }
    if (url.pathname === "/api/hero" && req.method === "POST") {
      return sendJson(res, 200, setHero((await readBody(req)).seed));
    }
    if (url.pathname === "/api/remove" && req.method === "POST") {
      return sendJson(res, 200, remove((await readBody(req)).seed));
    }
    if (url.pathname === "/api/skip" && req.method === "POST") {
      return sendJson(res, 200, { remaining: dropDestination((await readBody(req)).destId) });
    }
    // Ảnh: cả ứng viên lẫn ảnh đang dùng, phục vụ thẳng từ public/.
    if (url.pathname.startsWith("/img/")) {
      const file = r(`public${url.pathname}`);
      if (!file.startsWith(r("public/img")) || !existsSync(file)) return send(res, 404, "not found", "text/plain");
      return res
        .writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream", "Content-Length": statSync(file).size })
        .end(readFileSync(file));
    }
    send(res, 404, "not found", "text/plain");
  } catch (err) {
    sendJson(res, 500, { error: String(err.message ?? err) });
  }
});

const queue = readJson(QUEUE, []);
if (!queue.length) {
  console.log("Hàng đợi rỗng. Gom ứng viên trước:");
  console.log("  PROPOSE=1 node --experimental-strip-types scripts/fetch-images.mjs vn");
  process.exit(0);
}
server.listen(PORT, () => {
  const total = queue.reduce((n, q) => n + q.candidates.length, 0);
  console.log(`[review] ${queue.length} điểm đến · ${total} ứng viên`);
  console.log(`[review] http://localhost:${PORT}`);
});
