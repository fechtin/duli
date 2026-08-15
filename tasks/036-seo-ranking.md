# 036 — SEO: từ "crawl được" sang "xếp hạng được"

Nền kỹ thuật (032) đã xong: edge meta, crawler body, canonical, JSON-LD, sitemap đúng origin.
Việc còn lại là những thứ thật sự quyết định thứ hạng. Bốn nhánh, xếp theo tỉ lệ lợi/công.

## W1 — Vệ sinh kỹ thuật (rò rỉ đang có thật) ✅

- [x] **Soft-404**: `/vn/quang-nam/slug-sai` trả 200 + nội dung tỉnh + canonical trỏ chính nó
      → sinh vô hạn URL trùng. Nay `buildMeta` không bao giờ trả `null`: đường không giải được
      thành 404 thật + `noindex,follow`. Kiểm chứng: slug sai → 404, slug đúng → 200.
- [x] **Dish trùng lặp**: canonical của dish nay luôn là `/{cc}?dish={id}` bất kể đang đứng ở
      ngữ cảnh bản đồ nào. Ba URL từng là ba bản trùng, nay là một trang.
- [x] **`<lastmod>` thật**: `verifiedAt` (KR), fallback = ngày commit git của file dữ liệu khai
      báo slug đó. 654/654 trang có ngày. Bỏ `changefreq` (Google công khai bỏ qua).
- [x] Dish vào sitemap **và** có internal link từ trang quốc gia — trước đó không gì trỏ tới.

## W2 — Ảnh cho crawler ✅

- [x] `seo-body.ts` nay xuất `<img>` + `alt` + credit cho địa điểm, tỉnh và món ăn.
      Chỉ xuất khi seed có file thật (98/531 seed không có ảnh → `<img>` 404 còn tệ hơn thiếu).
- [x] Image sitemap: 637 ảnh đã khai báo.

## W3 — Long-tail ✅

- [x] Heading dạng câu hỏi thay cho danh sách nhãn: "Vé vào Phố cổ Hội An giá bao nhiêu?"
      thay vì "Vé: 120.000đ". Cùng dữ liệu, khác cách hỏi — và cách hỏi mới là truy vấn thật.
- [x] `FAQPage` JSON-LD **dùng chung `faqPairs()`** với phần hiển thị, nên markup không thể
      lệch khỏi nội dung (lệch là rủi ro manual action, không chỉ phí công).
- [x] `TouristAttraction` làm giàu: `image[]`, `openingHoursSpecification` (chỉ khi parse được
      khoảng giờ rõ ràng — "Cả ngày" bị bỏ qua thay vì đoán), `isAccessibleForFree`, `sameAs`,
      `dateModified`. Thêm `BreadcrumbList` cho mọi trang.

## W4 — hreflang ✅

- [x] Sơ đồ URL: `vi` giữ đường trần, locale khác thêm prefix (`/en/vn/…`). `/vi/…` → 301.
- [x] Worker parse locale → truyền vào D1 → render meta + body đúng ngôn ngữ, `<html lang>`,
      `og:locale`, và bộ `hreflang` đầy đủ + `x-default`.
- [x] **Bẫy đã dính và đã gỡ**: `index.html` mang sẵn cụm hreflang của trang chủ, nên mọi trang
      khác có *hai* cụm mâu thuẫn → Google bỏ cả hai. Phải `remove()` cụm tĩnh rồi mới append,
      đúng kiểu canonical đang được retarget chứ không append.
- [x] Client: URL là nguồn sự thật cho ngôn ngữ; `useUrlSync` giữ nguyên prefix khi ghi lại.
- [x] Sitemap: mỗi bản ngôn ngữ là một `<url>` riêng, mang đủ cụm alternates (hreflang chỉ có
      hiệu lực khi đối xứng và tự trỏ về mình).

## Kiểm chứng

- `npm test` — 65 test toàn bộ (đợt này thêm 10 cho `src/lib/seo/urls.ts`, module 3 nơi cùng phụ thuộc).
- `npm run verify:seo` — 6/6 trên trình duyệt thật: deep link giữ prefix, đường trần vẫn là
  tiếng Việt, preference đã lưu thì viết lại URL, chọn địa điểm không rụng prefix, back đổi
  ngôn ngữ ngược lại. Cần `wrangler dev` chạy sẵn.
- typecheck app + worker, `check:i18n`, `check:content`, `seo:build`, `build` — sạch.
- Ảnh chụp `/ko/vn/quang-nam/hoi-an-ancient-town`: UI Hàn đầy đủ, bản đồ không vỡ.

## Quyết định đáng nhớ

- **Bỏ auto-detect `navigator.language`.** Googlebot render với navigator en-US và không có
  localStorage — sniff trình duyệt sẽ lật mọi URL tiếng Việt sang bản tiếng Anh *trong lúc
  index* rồi trỏ canonical sang đó. Google cũng khuyến nghị đừng auto-redirect theo ngôn ngữ
  đoán được; để hreflang làm việc đó. Đổi lại: khách lần đầu dùng trình duyệt tiếng Anh vào
  đường trần sẽ thấy tiếng Việt cho tới khi tự đổi (lựa chọn đó được nhớ và viết vào URL).
- **`fetch-depth: 0` trong CI.** `seo:build` nay chạy trong CI (trước đây sitemap chỉ đúng khi
  ai đó nhớ chạy tay). Nhưng shallow clone làm mọi file báo cùng một ngày commit → mọi
  `<lastmod>` thành "hôm nay" mỗi lần deploy, tệ hơn là không có.

## Ngoài phạm vi (cần bạn làm / đo trước)

- **Search Console** — chưa verify thì mọi thứ trên đây là bay mù. Việc của bạn.
- **Cloudflare Managed robots.txt** — dashboard vẫn chèn `Disallow` cho ClaudeBot/GPTBot/
  PerplexityBot *trước* phần `Allow` của repo. Không ảnh hưởng Googlebot. Toggle ở dashboard.
- **Backlink** — không có đường tắt kỹ thuật.
- **Core Web Vitals** — Google Fonts vẫn render-blocking từ CDN ngoài. Đo bằng PageSpeed trước.

## Nội dung

- [x] **`zh` đã thống nhất giản thể.** Trước đó atlas Hàn viết phồn thể 100%, atlas Việt giản
  thể, file UI lẫn cả hai — người đọc đổi bản đồ là bị đổi luôn hệ chữ. `scripts/zh-simplify.mjs`
  chuẩn hoá 27 file và `npm run check:zh` giữ cho nó không trôi lại. Hai luật cứu nội dung khỏi
  bị phá: dùng preset `t`→`cn` chứ không phải `tw`→`cn` (preset Đài Loan còn viết lại *từ vựng*,
  nó đụng 12 file Việt vốn đã đúng), và **không bao giờ** đụng tiếng Nhật — kanji Nhật trùng
  glyph với phồn thể và nhiều câu tiếng Nhật ở đây không có kana để nhận diện, nên phạm vi
  chuyển đổi được xác định theo *khối khai báo*, không theo ký tự. hreflang nay khai `zh-Hans`.

- **Tên tỉnh không được dịch**: `provinces.i18n` có `summary`/`story` nhưng không có `name`,
  nên trang tiếng Hàn vẫn hiện "Quảng Nam" trong khi tên địa điểm đã là "호이안 구시가지".
  Không phải lỗi code — là khoảng trống dữ liệu, 63 + 17 tỉnh × 4 locale.

## Re-seed production (2026-08-15)

`src/data` có 187 địa điểm VN nhưng `db/seed.sql` và D1 production chỉ có 115 — 72 địa điểm đã
viết xong nhưng chưa ai chạy bước seed thủ công. Với 404 thật của W1, sitemap dựng từ file TS sẽ
quảng cáo 360 URL chết. Đã: regenerate seed → đối chiếu id cũ/mới (mất 0, thêm 72) → thử local
→ `wrangler d1 execute --remote`. Production nay trả 187. Sitemap 582 → 654 trang (3 270 URL).

`scripts/build-sitemap.mjs` lọc theo `db/seed.sql` chứ không theo file TS, và in WARNING kèm số
lượng khi hai bên lệch — để lần sau quên seed thì thấy ngay, thay vì âm thầm hứa URL không có.
