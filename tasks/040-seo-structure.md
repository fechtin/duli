# 040 / SEO structure — h1 + a crawlable link graph

**Không dùng `tasks/todo.md`:** phiên 038b đang giữ file đó. Kế hoạch này đứng riêng.

## Đo được gì trước khi sửa

Render `go.fechtin.com` bằng Chrome thật, UA Googlebot, không localStorage
(`scratchpad/render-check.mjs`, `render-check2.mjs`):

| URL | visible words | h1 | `<a href>` internal |
|---|---|---|---|
| `/vn/quang-nam/hoi-an-ancient-town` | 636 | **0** | **0** |
| `/vn/quang-nam` | 927 | **0** | **0** |
| `/vn` | 279 (crawler body có 854) | **0** | **0** |

Nội dung thì ổn — mô tả, giá vé, tháng đẹp, thời lượng, fact UNESCO đều VISIBLE sau render.
Meta/canonical/hreflang/JSON-LD đúng. Ba lỗi thật:

1. **h1 = 0 trên mọi trang.** `<h1>` của crawler body bị `createRoot()` xoá; panel chỉ có `<h2>`,
   và `<h2>` đầu tiên là "Cầu Vàng" (HeroBanner) — sai chủ đề trang.
2. **Internal link = 0 sau render.** Mọi điều hướng là `<button onClick>`. Google chỉ biết
   3.970 URL qua sitemap; không có PageRank chảy trong site, không anchor text.
3. **`/vn` teo sau render:** 63 tên tỉnh + danh sách món biến mất khỏi DOM (bản đồ là SVG,
   không phải link).

## Việc

- [x] `src/lib/seo/urls.ts` — thêm `countryPath` / `provincePath` / `destinationPath` / `dishPath`
- [x] `src/lib/store/useUrlSync.ts` — dùng chính các builder đó (hết đường drift link ↔ URL)
- [x] `src/components/ui/AppLink.tsx` (mới) — `<a href>` thật + onNavigate, giữ cmd/middle-click
- [x] `src/components/shell/CrawlNav.tsx` (mới) — `sr-only` nav 63 tỉnh + h1 fallback cho trang quốc gia
- [x] `DestinationPanel` — `h2`→`h1`, danh sách "Gần đây" → `AppLink`
- [x] `ProvincePanel` — `h2`→`h1`, danh sách điểm đến + món → `AppLink`
- [x] `DishPanel` — `h2`→`h1`
- [x] `HeroBanner` — `h2`→`p` (thẻ quảng bá, không phải tiêu đề mục)
- [x] `FoodExplorerSection` — thẻ món → `AppLink`
- [x] `App.tsx` — gắn `CrawlNav`
- [x] Verify: `npm test`, `tsc`, `check:i18n`, build, rồi chạy lại render-check trên bản build

## Không làm trong slice này

- Chiều sâu nội dung cho ~20–30 trang ưu tiên (bước sau, sau khi có Search Console)
- Search Console — user phải tự thêm TXT record trên Cloudflare
- Backlink

## Review

Đo lại bằng đúng script cũ, Chrome thật + UA Googlebot, trên vite dev (5199) đã có thay đổi:

| URL | h1 | text của h1 | `<a href>` internal |
|---|---|---|---|
| `/vn/quang-nam/hoi-an-ancient-town` | 1 | Phố cổ Hội An | 67 |
| `/vn/quang-nam` | 1 | Quảng Nam | **85** (63 tỉnh + 14 điểm đến + 8 món) |
| `/vn` | 1 | Việt Nam | 67 |
| `/en/vn/quang-nam/hoi-an-ancient-town` | 1 | Hoi An Ancient Town | 67 |
| `/vn?dish=pho-bo` | 1 | 🍜 Phở bò | 67 |
| `/vn/ha-giang/ma-pi-leng-pass` | 1 | Đèo Mã Pì Lèng | 69 (kèm 2 link "gần đây") |

`0 → 67–85` link nội bộ và `0 → 1` h1 đúng chủ đề trên mọi loại trang. Ngoài ra:

- `/en`: **0** href thiếu tiền tố `/en` — `AppLink` đi qua `withLocale`
- Kích hoạt link: `/vn` → `/vn/quang-nam`, **cùng document** (không reload, camera bản đồ còn nguyên), h1 đổi thành "Quảng Nam"
- cmd-click: `defaultPrevented=false` → vẫn mở tab mới thật
- `GET` `/vn`, `/vn/quang-nam`, `/vn/quang-nam/hoi-an-ancient-town`, `/en/vn/quang-nam` → **200** cả bốn

Xanh: 197 test / 16 file, `tsc -b --noEmit`, `check:content`, `check:zh`, và `vite build`
(build vào outDir scratch — xem ghi chú dưới).

**Đo được ở `hoi-an-ancient-town` là 67 chứ không phải 69 vì `nearby: []` rỗng trong dữ liệu**,
không phải lỗi code: 12/27 điểm có khai `nearby` đang để rỗng. Xác nhận bằng `ma-pi-leng-pass`
(có `nearby` thật) → đúng 2 anchor 3-segment. Lấp `nearby` là việc nội dung, đáng làm sau.

### Va chạm với phiên khác (đã xử lý, không phải lỗi của slice này)

- `npm run check:i18n` báo `tag "wildlife" (src/data/regions/tours/central.ts)` thiếu entry.
  Thư mục `src/data/regions/tours/` là **untracked mới**, `central.ts` ghi lúc 18:39:59 — do
  phiên 038 đang làm. Không đụng vào.
- **Không chạy `npm run build` vào `dist/`**: một phiên khác đang chạy `wrangler dev` serve
  `dist/`. Build đã verify bằng `--outDir` scratch. Deploy là `git push` (xem `vivel-deploy-push`),
  nên `dist/` không cần commit.

### Bẫy đã gặp

`withLocale()` prefix cả chuỗi, nên `dishPath` phải trả path **kèm** query (`/vn?dish=x`) trong
một chuỗi — tách ra thì `/en` chèn sau dấu `?`.

Link `sr-only` nằm ngoài viewport nên Playwright `page.click()` không chạm tới được (sidebar chặn
pointer). Kích hoạt bằng `el.click()` — đúng cách người dùng bàn phím/screen-reader làm.

## Còn lại (theo thứ tự, chưa làm)

1. **Verify Search Console + submit sitemap** — user phải tự thêm TXT record trên Cloudflare.
   Chưa có nó thì không đo được trang nào đã index.
2. Lấp `nearby` cho các điểm đến đang rỗng — mỗi entry là một cạnh thật trong link graph.
3. Chiều sâu nội dung cho ~20–30 trang long-tail có cửa thắng.
4. Backlink — khoảng trống lớn nhất của domain mới.
</content>
