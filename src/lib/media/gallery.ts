import manifest from "@/data/generated/image-manifest.json";
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

interface Entry {
  dest?: string;
  order?: number;
  caption?: Partial<Record<Locale, string>>;
}
const images = manifest as Record<string, Entry>;

/** destId → seed đã sắp thứ tự. Dựng một lần, manifest là hằng số lúc chạy. */
let index: Map<string, string[]> | null = null;
function byDest(): Map<string, string[]> {
  if (index) return index;
  const rows: { dest: string; seed: string; order: number }[] = [];
  for (const [seed, v] of Object.entries(images)) {
    if (v.dest) rows.push({ dest: v.dest, seed, order: v.order ?? 999 });
  }
  rows.sort((a, b) => a.order - b.order);
  index = new Map();
  for (const r of rows) {
    const list = index.get(r.dest) ?? [];
    list.push(r.seed);
    index.set(r.dest, list);
  }
  return index;
}

export interface Tile {
  seed: string;
  /** Chỉ có khi ảnh đã được viết caption cho CHÍNH nó. Rỗng nghĩa là chỉ hiện ghi công. */
  caption: string;
  /** Luôn có nội dung, kể cả khi không hiện caption. Dùng cho thuộc tính alt. */
  alt: string;
}

/** Ảnh bìa: ô đầu tiên. Panel dựng hero từ đúng seed này. */
export function heroSeedFor(destId: string): string | null {
  return byDest().get(destId)?.[0] ?? null;
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
  const seeds = byDest().get(destId);
  if (!seeds?.length) return [];
  return seeds.slice(1, MAX_TILES).map((seed) => {
    const c = images[seed]?.caption;
    const caption = c?.[locale] ?? c?.vi ?? c?.en ?? "";
    return { seed, caption, alt: caption || destName };
  });
}

/** Còn nhận thêm được bao nhiêu ảnh trước khi chạm trần. */
export function slotsLeft(destId: string): number {
  return Math.max(0, MAX_TILES - (byDest().get(destId)?.length ?? 0));
}
