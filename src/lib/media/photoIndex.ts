import type { Locale } from "@/lib/i18n/dictionaries";

// MỘT trọng tài cho câu hỏi "ảnh nào đại diện cho điểm đến này".
//
// Trước đây câu đó có năm câu trả lời song song: manifest (đúng), quy ước `dish-<id>` (đúng), và
// ba bảng viết tay — mảng `gallery` slot trong D1, `CALENDAR_SEEDS`, `HERO_PLACES`. Ba bảng sau
// không ai đối chiếu với manifest, nên đợt audit 044 xoá 66 ảnh sai chủ thể là mọi slot trỏ vào
// chúng lặng lẽ tụt về gradient: 17 điểm đến có ảnh thật mà không hiện, 5 thẻ living-calendar
// cũng vậy, và 17 trang crawler lên Google không còn tấm ảnh nào.
//
// Sai lầm không phải ở chỗ bảng thiếu — bảng viết tay nào rồi cũng thiếu — mà ở chỗ **fallback im
// lặng**: `?? d.id` biến "seed này đã chết" thành "nơi này chưa có ảnh", hai trạng thái hiện ra y
// hệt nhau. Nên module này cố tình KHÔNG nhận manifest qua import: nó nhận vào như tham số, để
// `scripts/check-photos.mjs` chạy đúng đoạn code mà trình duyệt chạy thay vì chép lại logic —
// một bản chép lại chính là thứ đã đẻ ra lỗi này.

/** Một ảnh trong image-manifest.json. */
export interface PhotoEntry {
  src: string;
  credit?: string;
  license?: string;
  sourceUrl?: string;
  /** Có bản 2048px ở /img/lg/<seed>.webp — chỉ tải khi mở lightbox. */
  lg?: boolean;
  /**
   * Điểm đến mà tấm ảnh này minh hoạ. Do `fetch-images.mjs` ghi lúc tải về, và là join DUY NHẤT
   * giữa ảnh và nơi chốn có thật. Ảnh món ăn không có trường này (chúng đi theo quy ước khoá
   * `dish-<id>`), nên `dest` rỗng nghĩa là "không thuộc điểm đến nào", không phải "chưa biết".
   */
  dest?: string;
  /** Thứ tự trong thư viện ảnh của điểm đến; nhỏ nhất là ảnh bìa. */
  order?: number;
  /**
   * Caption viết cho CHÍNH tấm ảnh này lúc duyệt, ở những ngôn ngữ đã có.
   *
   * Mô hình cũ đặt caption lên Ô của thư viện: viết trước, nằm trong D1, năm mảng khớp theo chỉ
   * số, tả một tấm ảnh chưa tồn tại. Đó là thứ đẻ ra 109 ô mà caption tả một đằng ảnh một nẻo.
   * Caption thuộc về tấm ảnh thì không trôi khỏi nó được, và nó nằm ở đây — tĩnh, không reseed.
   *
   * Thiếu ngôn ngữ là chuyện bình thường — `captionFor` tự lùi về vi rồi en.
   */
  caption?: Partial<Record<Locale, string>>;
}

export interface PhotoIndex {
  /** Seed này có ảnh thật đằng sau không? */
  has(seed: string | undefined | null): boolean;
  /** Mọi thứ biết về ảnh của một seed: nguồn, ghi công, có bản phóng to hay không. */
  meta(seed: string | undefined | null): PhotoEntry | undefined;
  /** Seed của một điểm đến, đã sắp theo `order`. Rỗng khi điểm đến chưa có ảnh nào. */
  seedsFor(destId: string): string[];
  /** Ảnh bìa của điểm đến, hoặc null khi chưa có ảnh nào. */
  heroSeedFor(destId: string): string | null;
  /**
   * Seed để vẽ cho một điểm đến — ảnh bìa, hoặc chính id khi chưa có ảnh (→ gradient).
   *
   * Đây là thứ MỌI ô ảnh nên gọi: thumbnail, medallion trên bản đồ, thẻ sidebar, dòng thời gian
   * chuyến đi. Gọi thẳng `heroSeedFor` chỉ khi cần phân biệt "chưa có ảnh" với "có ảnh".
   */
  thumbSeedFor(destId: string): string;
  /** Seed đầu tiên trong danh sách có ảnh thật, không có cái nào thì trả về cái đầu tiên. */
  firstWithPhoto(...seeds: (string | undefined | null)[]): string;
  /**
   * Caption của CHÍNH tấm ảnh này, lùi vi → en, rỗng khi chưa ai viết cho nó.
   *
   * Rỗng là một câu trả lời hợp lệ và người gọi phải tôn trọng: chỗ nào cần chữ thì dùng tên
   * điểm đến cho `alt`, đừng đi mượn caption của ô bên cạnh — đó đúng là cách 109 ô từng mang
   * câu tả một tấm ảnh khác.
   */
  captionFor(seed: string, locale: Locale): string;
  /** Mọi id điểm đến mà manifest có ảnh — dùng cho guard, không dùng lúc chạy. */
  destIds(): string[];
}

export function buildPhotoIndex(images: Record<string, PhotoEntry>): PhotoIndex {
  const byDest = new Map<string, string[]>();
  const rows: { dest: string; seed: string; order: number }[] = [];
  for (const [seed, v] of Object.entries(images)) {
    if (v.dest) rows.push({ dest: v.dest, seed, order: v.order ?? 999 });
  }
  rows.sort((a, b) => a.order - b.order);
  for (const r of rows) {
    const list = byDest.get(r.dest) ?? [];
    list.push(r.seed);
    byDest.set(r.dest, list);
  }

  const has = (seed: string | undefined | null) => !!seed && !!images[seed];
  const heroSeedFor = (destId: string) => byDest.get(destId)?.[0] ?? null;

  return {
    has,
    meta: (seed) => (seed ? images[seed] : undefined),
    seedsFor: (destId) => byDest.get(destId) ?? [],
    heroSeedFor,
    thumbSeedFor: (destId) => heroSeedFor(destId) ?? destId,
    firstWithPhoto: (...seeds) => seeds.find(has) ?? seeds.find(Boolean) ?? "",
    captionFor: (seed, locale) => {
      const c = images[seed]?.caption;
      return c?.[locale] ?? c?.vi ?? c?.en ?? "";
    },
    destIds: () => [...byDest.keys()],
  };
}
