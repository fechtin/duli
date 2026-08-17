# 045 — Một trọng tài cho "ảnh nào đại diện cho X"

## Vấn đề (đã xác nhận bằng số liệu)

Hai lỗi người dùng bắt được — Động Phong Nha gradient trong ProvincePanel, Hà Giang gradient
trong sidebar — là **cùng một lỗi**, xuất hiện ở hai bảng khác nhau. Câu hỏi "ảnh nào đại diện
cho X" hiện đang được trả lời bởi 5 cơ chế song song:

| Cơ chế | Nguồn | Ai dùng | Hỏng khi nào |
|---|---|---|---|
| `heroSeedFor(id)` | manifest | DestinationPanel hero + gallery | không bao giờ |
| `dish-${id}` | quy ước | thẻ món ăn, `dishImageUrl` | không bao giờ |
| `d.gallery[0].seed` | slot cũ trong D1/destinations.ts | **11 call site** | mỗi lần ảnh bị xoá |
| `CALENDAR_SEEDS` | bảng chép tay | thẻ living-calendar | mỗi id mới |
| `HERO_PLACES[].seed` | bảng chép tay | hero banner sidebar | khi seed bị xoá |

3 cơ chế dưới là hằng số viết tay, không ai đối chiếu với manifest.

**Nguyên nhân gốc: fallback im lặng.** `?? d.id` biến "seed này đã chết" thành "nơi này chưa có
ảnh". Hai trạng thái đó hiện ra y hệt nhau — một ô gradient sạch sẽ — nên không có gì đỏ lên,
không test nào trượt, diff nhìn vẫn lành. Đợt audit 044 xoá 66 ảnh sai chủ thể; mọi slot trỏ vào
chúng lặng lẽ tụt về gradient ngay lúc đó.

### Thiệt hại đo được (533 điểm đến, 18 id living-calendar)

- **17 điểm đến** có ảnh thật nhưng thumbnail là gradient (Phong Nha, Mũi Né, Cát Tiên, Hoàng
  thành Thăng Long, Cát Cát, Ti Tốp, Bitexco, Tao Đàn, Thuận An…).
- **5 thẻ living-calendar** gradient dù đích đã có ảnh (`ha-giang-loop`, `phong-nha-caves`,
  `ninh-binh-trang-an`, `phan-thiet-coast`, `phu-yen-coast`).
- **Trang crawler cũng mất ảnh**: `figure()` trong `worker/seo-body.ts:69` trả `""` khi seed
  chết → 17 trang điểm đến đó lên Google **không có ảnh nào**, dù file vẫn nằm trong `/img`.
- 40 điểm đến khác hiện thumbnail khác với ảnh bìa trong panel (lệch, chưa chắc sai).

### Vì sao guard hiện có không bắt được

- `navHelpers.test.ts` đã là trọng tài cho join **điều hướng** (id → điểm đến) — nhưng không
  kiểm join **ảnh**. Đúng cái bẫy 027: một bảng đủ, một bảng thiếu, cùng một id.
- `scripts/audit-images.mjs` hỏi "ảnh này có đúng chủ thể không", không hỏi "ảnh này có ai hiện
  không".
- `.github/workflows/deploy.yml` **không chạy test hay check nào** — chỉ `seo:build` + `build` +
  deploy. Mọi guard đang phụ thuộc vào việc nhớ gõ tay.

## Phương án — 3 lớp

### Lớp 1 — Một trọng tài (xoá bảng song song)

`src/lib/media/gallery.ts` đã là resolver đúng, chỉ đang phục vụ mỗi DestinationPanel. Mở rộng
nó thành nguồn duy nhất và cho mọi bề mặt đi qua:

- [ ] Thêm `thumbSeedFor(destId)` (hero, fallback `destId` → gradient) và
      `calendarSeedFor(livingId)` = `CALENDAR_SEEDS[id] ?? heroSeedFor(CALENDAR_DESTINATION[id] ?? id)`.
- [ ] Thay 11 call site `d.gallery?.[0]?.seed ?? d.id`:
      `ProvincePanel:43,155` · `DestinationPanel:184` · `MapEngine:668` · `DayTimeline:94`
      `TripResult:65` · `CheckinFlow:44` · `navHelpers:19,216` · `FestivalSection:35`
- [ ] `worker/seo-body.ts:203,212,266` + `worker/seo-jsonld.ts:33` dùng cùng index manifest
      (worker không import được `src/lib/media` thì tách phần thuần dữ liệu ra chỗ dùng chung).
- [ ] `CALENDAR_SEEDS` và `HERO_PLACES[].seed` **chỉ còn là override có chủ đích** — giữ nguyên
      7 lựa chọn cố ý (vd `da-nang-coast` → Cầu Vàng), không đổi ngầm.

### Lớp 2 — Xoá dữ liệu chết (để lỗi này không viết lại được)

Chừng nào mảng `gallery` slot còn tồn tại thì còn có người gõ `gallery[0].seed`. Sau lớp 1 nó
chỉ còn 4 chỗ dùng, đều thay được bằng manifest:

- [ ] `CheckinFlow:176` (bộ chọn ảnh) → `galleryFor(dest.id, …)`
- [ ] `worker/db.ts:118-119` `galleryCaptions` — đường caption cũ mà 044 đã thay
- [ ] `worker/seo-body.ts` caption `d.gallery[0].caption` → caption của chính ảnh trong manifest
      (caption slot cũ chính là thứ đã lệch 109 ô)
- [ ] Bỏ `gallery` khỏi `destinations.ts`, `src/lib/types.ts`, seed D1 + migration
- ⚠️ Cần re-seed D1 thủ công (`bash scripts/deploy.sh`) — không nằm trong GitHub Action.

### Lớp 3 — Guard bất biến + chạy trong CI

- [ ] `scripts/check-photos.mjs` → `npm run check:photos`, trượt khi:
  - **I1** một seed viết tay trong `src/`/`worker/` không có trong manifest
  - **I2** một điểm đến có ảnh trong manifest nhưng bề mặt hiển thị resolve ra gradient (bắt 17)
  - **I3** một id living-calendar ra gradient trong khi đích của nó có ảnh (bắt 5)
  - **I4** một `dest` trong manifest không khớp id điểm đến nào (ảnh mồ côi nằm trên đĩa)
- [ ] Mở rộng `navHelpers.test.ts`: mỗi id living-calendar phải resolve **cả** panel **và** ảnh,
      hoặc nằm trong danh sách miễn có ghi lý do (`ho-chi-minh-city`, `perfume-pagoda`).
- [ ] Thêm job `verify` vào `deploy.yml` (typecheck + test + check:photos + check:content) chặn
      trước bước deploy. Đây là mảnh khiến hai lớp trên không mục lại sau 3 tháng.

## Thứ tự đề xuất

Lớp 3 (I2/I3) **trước** — để có danh sách đỏ làm bằng chứng, rồi lớp 1 làm nó xanh, rồi lớp 2
dọn. Ngược lại thì không chứng minh được là đã sửa hết.

## Ngoài phạm vi (ghi để khỏi quên)

- 40 thumbnail "khác ảnh bìa" — quyết định thiết kế, không phải lỗi. Sau lớp 1 chúng tự đồng bộ;
  nếu muốn giữ khác thì phải là override cố ý.
- `chua-huong` và `ho-chi-minh-city` vẫn gradient đúng — chờ ảnh duyệt / là tỉnh.

## Review — xong 17/08, cả 3 lớp

**Lớp 1 — một trọng tài.** `src/lib/media/photoIndex.ts` (mới) là bản cài đặt DUY NHẤT; nó nhận
manifest qua tham số chứ không import, nên guard chạy đúng đoạn code trình duyệt chạy.
`gallery.ts` + `worker/seo-body.ts` + `worker/seo-jsonld.ts` đều dựng index từ nó. 13 call site
chuyển sang `thumbSeedFor(id)` / `heroSeedFor(id)`. Hai bảng chép tay hạ xuống thành override:
`CALENDAR_SEED_OVERRIDES` giữ đủ 7 lựa chọn cũ (1 cố ý + 6 di sản, mỗi dòng ghi ảnh bìa tương
ứng để sau này ai đó so rồi bỏ), `HERO_PLACES` vẫn hand-pick vì banner là quyết định biên tập.

**Lớp 2 — xoá dữ liệu chết.** 238 file, **2 661 thuộc tính** `gallery`/`galleryCaptions` bị xoá
bằng parser TypeScript (không regex — xem `tasks/lessons.md`). Mỗi file được import trước/sau và
so sánh sâu; 238/238 khớp. `GalleryImage` và `galleryCaptions` biến khỏi `types.ts`, worker thôi
SELECT cột `gallery`, `seed.sql` nhỏ đi 307KB. Bằng chứng: 533/533 bản ghi giống hệt sau khi bỏ
`gallery`; API trả về không còn khoá đó.

**Lớp 3 — guard.** `npm run check:photos` (I1–I5) + 22 test mới trong `navHelpers.test.ts` + job
`verify` chặn trước deploy trong `deploy.yml`. Guard được **negative-test cả 4 bất biến**: bỏ
`ha-giang-loop` khỏi bảng → I3 đỏ; trỏ HERO_PLACES vào seed đã xoá → I1 đỏ; viết lại
`gallery[0].seed` → I2 đỏ; cho `chua-huong` một tấm ảnh → I3 đòi xoá dòng miễn trừ.

**Kết quả đo được**

| | trước | sau |
|---|---|---|
| điểm đến có ảnh mà hiện gradient | 17 | **0** |
| thẻ living-calendar gradient oan | 5 | **0** (2 còn lại là đúng) |
| trang crawler mất ảnh | 17 | **0** — đã curl từng trang |
| test | 309 | 330 |
| guard chạy trong CI | 0 | 6 |

**Còn lại (không chặn gì)**

- Cột `gallery` trong D1 vẫn tồn tại, chỉ không ai đọc. Bỏ nó cần migration, và phải để bản
  worker mới lên sóng TRƯỚC — nếu bỏ cột trong cùng lần deploy, worker cũ còn đang chạy sẽ
  SELECT một cột không còn tồn tại. Để lần sau.
- `galleryCaptions` cũ vẫn nằm trong cột `i18n` của D1 cho tới lần re-seed kế tiếp. Không lộ ra
  client (worker dựng response theo từng trường), chỉ là bytes nằm im.
- 44 điểm đến chưa có ảnh nào và `chua-huong` chưa có ảnh duyệt — gradient ở đó là trung thực.
