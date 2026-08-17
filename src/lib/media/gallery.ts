import manifest from "@/data/generated/image-manifest.json";
import { buildPhotoIndex, type PhotoEntry } from "./photoIndex";
import type { Locale } from "@/lib/i18n/dictionaries";

// Gallery của một điểm đến suy ra từ MANIFEST, không phải từ D1.
//
// Trước đây mảng `gallery` trong D1 quyết định có những ô nào, và mỗi ô mang sẵn một caption viết
// trước khi ảnh tồn tại. Hệ quả là hai thứ: caption trôi khỏi ảnh (109 ô phải tách lại hôm 17/08),
// và mọi lần thêm ảnh đều kéo theo một lần reseed D1. Giờ ảnh nào có trong manifest thì ô đó có
// thật, thứ tự do `order` quyết, caption đi kèm ảnh — thêm ảnh chỉ cần `git push`.
//
// Có bao nhiêu ảnh thì hiện bấy nhiêu ô. Không còn ô gradient nào: một ô trống là một lời hứa
// chưa giữ, và trưng nó ra cho người đọc không phục vụ ai. Điểm đến chưa có ảnh thì đơn giản là
// chưa có thư viện ảnh — ảnh bìa vẫn lùi về gradient như cũ.
//
// Và KHÔNG mượn caption của ô cũ nữa. 815/819 ảnh từng mượn như thế, nên phần lớn caption đang
// hiện là câu viết cho một tấm ảnh khác — "Triền đồi xương rồng nghiêng xuống bãi biển vắng" đặt
// dưới một tấm hoàng hôn. Một caption có thể sai còn tệ hơn không có caption: người đọc không có
// cách nào biết. Ảnh nào chưa được viết caption riêng thì chỉ hiện dòng ghi công.
//
// `alt` thì KHÔNG bỏ trống — nó lùi về tên điểm đến, câu luôn đúng. Đó là thứ screen reader đọc
// và Google Images lập chỉ mục, mất nó là mất thật.

/** Một điểm đến hiển thị tối đa ngần này ô. Quá số đó thì thư viện thôi còn là thư viện. */
export const MAX_TILES = 10;

/**
 * Trọng tài DUY NHẤT cho "ảnh nào đại diện cho X" ở phía trình duyệt.
 *
 * Mọi ô ảnh gọi `photos.thumbSeedFor(dest.id)`. Đọc `dest.gallery[0].seed` là dựng lại đúng cái
 * bảng song song đã đẻ ra 17 ô gradient trên ảnh có thật — `check:photos` (I2) chặn ở CI.
 */
export const photos = buildPhotoIndex(manifest as Record<string, PhotoEntry>);

/** Ảnh bìa: ô đầu tiên. Panel dựng hero từ đúng seed này. */
export function heroSeedFor(destId: string): string | null {
  return photos.heroSeedFor(destId);
}

/** Seed để vẽ cho một điểm đến — ảnh bìa, hoặc chính id khi chưa có ảnh nào (→ gradient). */
export function thumbSeedFor(destId: string): string {
  return photos.thumbSeedFor(destId);
}

export interface Tile {
  seed: string;
  /** Chỉ có khi ảnh đã được viết caption cho CHÍNH nó. Rỗng nghĩa là chỉ hiện ghi công. */
  caption: string;
  /** Luôn có nội dung, kể cả khi không hiện caption. Dùng cho thuộc tính alt. */
  alt: string;
}

/** Một ô cho MỖI ảnh có thật của điểm đến, kể cả ảnh bìa. Dùng khi ảnh bìa chưa hiện ở đâu cả. */
export function tilesFor(destId: string, locale: Locale, destName: string): Tile[] {
  return photos
    .seedsFor(destId)
    .slice(0, MAX_TILES)
    .map((seed) => {
      const caption = photos.captionFor(seed, locale);
      return { seed, caption, alt: caption || destName };
    });
}

/**
 * Các ô của thư viện ảnh — đúng bằng số ảnh có thật, TRỪ ảnh bìa.
 *
 * Ô đầu tiên đã hiện to hết chiều ngang ở đầu panel rồi; lặp lại nó ngay bên dưới chỉ tốn một
 * màn hình cuộn để nói lại điều người đọc vừa thấy. Điểm đến chỉ có một ảnh thì không có thư
 * viện — và panel bỏ luôn mục đó thay vì để lại một tiêu đề rỗng.
 *
 * Trần vẫn tính cả ảnh bìa: tối đa MAX_TILES ảnh cho một điểm đến, 1 bìa + phần còn lại.
 */
export function galleryFor(destId: string, locale: Locale, destName: string): Tile[] {
  return tilesFor(destId, locale, destName).slice(1);
}

/** Còn nhận thêm được bao nhiêu ảnh trước khi chạm trần. */
export function slotsLeft(destId: string): number {
  return Math.max(0, MAX_TILES - photos.seedsFor(destId).length);
}
