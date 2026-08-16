# 038 — Làm giàu địa điểm Việt Nam (hub depth + venue types)

Plan: `~/.claude/plans/greedy-rolling-valiant.md`.
Song song với **038b** (`tasks/todo.md`, phiên khác) đang dựng itinerary engine từ `docs/031.md`.
038 lo **dữ liệu**, 038b lo **engine + UI**. Hai bên gặp nhau ở 5 `DestinationType` mới.

---

## Wave 0 — nền (XONG)

**5 `DestinationType` mới:** `cafe` · `viewpoint` · `nightlife` · `themepark` · `street`
([src/lib/types.ts](../src/lib/types.ts)). Cột `type` trong D1 là `TEXT` không `CHECK` → **không cần
migration**. Cả 3 nơi tiêu thụ đều là `Record<DestinationType, …>` nên TS bắt lỗi ngay nếu thiếu key:

| File | Bổ sung |
|---|---|
| [markerIcons.tsx](../src/components/map/markerIcons.tsx) | `Coffee` `Binoculars` `Martini` `FerrisWheel` `Signpost` |
| [PhotoMedallion.tsx](../src/components/map/PhotoMedallion.tsx) | tint: nâu ấm cho cafe/street, tím cho nightlife |
| [landmarks.tsx](../src/components/map/landmarks.tsx) | 2 SVG mới (`CoffeeCup`, `FerrisWheel`); 3 loại còn lại dùng lại art sẵn có |

**8 tag mới** (`adventure` `architecture` `cafe` `family` `nightlife` `shopping` `sunset` `viewpoint`)
vào cả 5 từ điển `src/lib/i18n/tags/`. Đặt thành **một khối có comment** thay vì rải theo bảng chữ cái —
danh sách vốn đã trộn hai hệ chữ, nhóm lại dễ bảo trì hơn.

> ⚠️ **Không có tag `street`.** Key đó đã bị tag món ăn đường phố chiếm. Nghĩa "phố đi bộ" nằm ở
> `DestinationType`, không phải tag. Nhắc lại bẫy cũ: `unesco` là **badge**, không phải tag.

**`scripts/resolve-sources.mjs --candidates <file.json>`** — chế độ mới cho địa điểm CHƯA có trong atlas:
- Chuỗi: vi.wikipedia → en.wikipedia → Wikidata P625 → **Nominatim** → **Overpass**
  (hai bước OSM là mới; Wikipedia không bao giờ có bài cho một quán cà phê hay một con phố).
- Không có toạ độ cũ để đo drift → thay bằng **khoảng cách tới centroid tỉnh**, ngưỡng 200km.
- Validate theo `namedetails.name`, **không** theo `display_name` — địa chỉ đầy đủ chứa tên tỉnh nên
  chấm điểm vào đó sẽ cho mọi POI trong tỉnh đi qua bằng chính tên tỉnh.
- Output suy ra từ tên input (`X-candidates.json` → `X-coords.json`) để lần chạy lại không đè kết quả cũ.

---

## Wave 1 — Đà Nẵng + Hội An (XONG)

**+26 địa điểm.** Atlas VN **187 → 213**. `da-nang` 3 → **18**, `quang-nam` 3 → **14**.

| File nguồn | Cụm | Số điểm |
|---|---|---|
| [hubs/daNangCore.ts](../src/data/regions/hubs/daNangCore.ts) | trung tâm & sông Hàn | 8 |
| [hubs/daNangOuter.ts](../src/data/regions/hubs/daNangOuter.ts) | Sơn Trà / Ngũ Hành Sơn / Bà Nà / Hải Vân | 7 |
| [hubs/hoiAnOldTown.ts](../src/data/regions/hubs/hoiAnOldTown.ts) | trong phố cổ | 6 |
| [hubs/hoiAnAround.ts](../src/data/regions/hubs/hoiAnAround.ts) | làng nghề, biển, sông | 5 |

Chia file **theo cụm địa lý**, không chia tuỳ tiện — đó cũng là cụm mà 038b Phase 5 cần, nên `nearby`
nối trong cụm đã là tín hiệu clustering, tốn 0 công thêm.

**i18n đủ 5 ngôn ngữ:** `src/data/i18n/content/hubs/{daNang,hoiAn}.{en,ko,ja,zh}.ts`, đăng ký trong
[i18n/index.ts](../src/data/i18n/index.ts). Bucket chia **theo hub**, không theo vùng.

Loại mới dùng thật: `cafe` ×2 (Faifo Coffee, Reaching Out Teahouse) · `nightlife` ×2 · `viewpoint` ×2
· `themepark` ×1 (Bà Nà). **`street` chưa có entry nào** — để dành cho Hà Nội (phố đường tàu) và
TP.HCM (Bùi Viện, phố đi bộ Nguyễn Huệ) ở Wave 2.

### 5 ứng viên bị LOẠI vì không tra được toạ độ

Luật 033 giữ nguyên: không tra được thì **đổi ứng viên**, không đoán — vì `images:fetch` geosearch
quanh lat/lng nên toạ độ sai kéo về ảnh sai chỗ.

| Ứng viên | Chuyện gì đã xảy ra |
|---|---|
| Sun World Asia Park | Chuỗi trả về "Asia Park" ở **Kazakhstan, cách 3.028km** |
| Sơn Trà Marina | Không nguồn nào tìm ra, kể cả OSM. Vốn đã là ứng viên yếu nhất theo luật độ bền |
| **Làng gốm Thanh Hà** | OSM trả POI tên "thanh hà" ở **vĩ độ 16,10 — trong Đà Nẵng, cách Hội An 25km**. Tên hợp lý, chỗ sai. Đúng lớp lỗi mà memory cảnh báo |
| Biển An Bàng (2 vòng đầu) | "An Banh City of Ghosts" cách 93km; rồi hải đăng **An Bang ở Trường Sa, cách 1.012km** |
| Biển Cửa Đại (vòng đầu) | Đồn biên phòng cảng Thuận An, cách 112km, lệch tên |

An Bàng và Cửa Đại **cứu được** ở vòng tra thủ công bằng Nominatim với query ngắn hơn.
Ba cái còn lại đã bỏ. Ghi lại vì đây là bằng chứng guard chạy đúng: cả ba lần nếu tin
`search[0]` thì atlas đã có một công viên Kazakhstan và một hải đăng Trường Sa.

**Chùa Cầu lấy toạ độ OSM chứ không lấy vi.wikipedia.** Giá trị Wikipedia (15,8694) nằm cách mọi
hàng xóm cùng phố (15,877) khoảng 900m về phía nam — trong một phố cổ đi bộ mười lăm phút là hết,
chừng đó đủ làm hỏng cụm.

### Kỷ luật đã áp cho `cafe`

Chỉ nhận quán đã thành địa danh. Faifo Coffee (sân thượng nhìn xuống mái ngói phố cổ) và Reaching Out
Teahouse (doanh nghiệp xã hội, hoạt động từ đầu 2000s) đều qua được; Sơn Trà Marina thì không —
và nó cũng trượt luôn khâu tra toạ độ. **Đà Nẵng hiện chưa có entry `cafe` nào** — chấp nhận được
cho Wave 1 vì hành lang Đà Nẵng–Hội An đã có hai quán.

`ticket`/`openingHours` chỉ điền khi có nguồn nói rõ, kèm hedging ("giá tham khảo", "xem giá công bố
trước khi đi"). `sourceUrl` bảo chứng **nơi đó tồn tại và toạ độ đúng**, không bảo chứng giá.

---

## Guard đã chạy

```
npm run typecheck    ✓ 0 lỗi
npm test             ✓ 15 file, 186 test
npm run check:i18n   ✓ parity 5 locale
npm run check:content ✓
npm run check:zh     ✓ Giản thể thuần
npm run check:provinces ✓ exit 0 (7 khác biệt phiên âm có sẵn, không liên quan)
npm run db:seed:build ✓ vn: 213 destinations
npm run seo:build    ✓ 680 trang × 5 locale = 3.400 URL
npm run verify:vn    ✓ 11 error — TOÀN BỘ là entry cũ, 0 cái thuộc 038
```

File dài nhất: `daNang.en.ts` 324 dòng. Tất cả dưới trần 500 LOC.

### Đọc `verify:vn` cho đúng

**Tập lỗi TRÔI giữa các lần chạy** vì resolver tra Wikipedia trực tiếp. Ba lần chạy trong đợt này ra
15 → 13 → 11 lỗi, và danh sách id đổi mỗi lần (`co-to-island`, `ganh-da-dia`, `chua-keo` tự hết).
**Đừng so tổng số lỗi.** So *danh sách id*:

```bash
git show HEAD:tasks/verify-vn-report.md | sed -n '/^## Errors/,/^## Warnings/p' \
  | grep -oE '^\- \*\*[a-z0-9-]+\*\*' | tr -d '*- ' | sort > /tmp/base.txt
sed -n '/^## Errors/,/^## Warnings/p' tasks/verify-vn-report.md \
  | grep -oE '^\- \*\*[a-z0-9-]+\*\*' | tr -d '*- ' | sort | comm -13 /tmp/base.txt -
```
→ rỗng. **038 không thêm một lỗi toạ độ nào.**

**18 pin mới trong `scripts/.verify-map.json`.** Hai cái quan trọng nhất là lỗi giả: "Chợ Cồn" bị
khớp thành **Con Thien** (bãi chiến trường Quảng Trị, cách 161km) và "My Khe Beach" thành **Battle of
Khe Sanh** (cách 175km). Toạ độ atlas đúng cả hai; resolver sai. Nhân tiện pin luôn 2 entry cũ cùng
lớp lỗi: `vinh-trang-pagoda` (khớp thành **thành phố Vinh**, 926km) và `thien-an-mountain` (277km).

139 "integrity issue" đều là `gallery seed … has no image in the manifest` — đúng như dự kiến, ảnh
nằm ngoài phạm vi đợt này.

**`npm run db:setup` CHƯA chạy** — phiên 038b đang chạy `wrangler dev` trên D1 local, re-seed giữa
chừng sẽ phá test của họ. Cần chạy tay khi họ xong.

---

---

## Wave 2 — Hà Nội (XONG)

**+20 địa điểm.** Atlas **213 → 233**, `ha-noi` 3 → **23**. Ba file theo cụm đi bộ thật:
[hanoiOldQuarter.ts](../src/data/regions/hubs/hanoiOldQuarter.ts) (7, phố cổ + Hồ Gươm) ·
[hanoiCitadel.ts](../src/data/regions/hubs/hanoiCitadel.ts) (7, Ba Đình + Hoàng thành) ·
[hanoiOuter.ts](../src/data/regions/hubs/hanoiOuter.ts) (6, hồ Tây + làng nghề).
i18n: `content/hubs/hanoi.{en,ko,ja,zh}.ts`. **Cả 233 entry VN giờ đủ 4 locale, không sót cái nào.**

`street` lần đầu có entry thật: **Phố đường tàu**. Entry này ghi rõ khu vực đã bị rào chắn nhiều
lần vì mất an toàn — đừng gỡ cảnh báo đó ra.

### Đã tra xong toạ độ cho TOÀN BỘ wave 2 + 3

| File | Nội dung |
|---|---|
| `tasks/038-w2-coords.json` | 67/73 — Hà Nội, TP.HCM, Huế, Đà Lạt |
| `tasks/038-w3-coords.json` | 48/57 — Nha Trang, Phú Quốc, Sa Pa, Hạ Long, Ninh Bình |
| `tasks/038-w23-retry-coords.json` | 6/19 vòng vớt |

Nội dung còn phải viết (toạ độ đã sẵn, chỉ còn soạn bài + dịch):
**TP.HCM 18 · Huế 15 · Đà Lạt 16 · Nha Trang 9 · Phú Quốc 10 · Sa Pa 9 · Hạ Long 9 · Ninh Bình 8**
→ +94, đưa atlas lên **327**.

### 14 ứng viên nữa bị loại (tổng cộng 19 cả đợt)

Guard tiếp tục bắt đúng loại lỗi cũ, và lần này có ba cái đáng nhớ:

| Ứng viên | Chuỗi trả về |
|---|---|
| Sun World Asia Park | công viên **ở Kazakhstan**, cách 3.028km |
| Đồi Thiên An (Huế) | **Công an tỉnh Thừa Thiên-Huế** — trùng token "Thiên"/"Huế" |
| Đầm Vân Long (Ninh Bình) | một cái đầm ở **Đông Anh, Hà Nội**, cách ~100km |
| Đền Thái Vi (Ninh Bình) | **đường Lý Thái Tổ**, Hà Nội |
| Chùa Bà Thiên Hậu | một ngôi chùa ở vĩ độ 10,98 — **Hóc Môn**, không phải Chợ Lớn |

Còn lại: VinWonders Nha Trang, Điệp Sơn, Sunset Town, chợ đêm Đà Lạt, XQ Sử quán, thác Tình Yêu,
nhà thờ đá Sa Pa, Quan Lạn, Sun World Hạ Long, Cafe Apartment.

**Ngưỡng 200km quá rộng cho đồng bằng Bắc Bộ.** Hà Nội chỉ cách Ninh Bình ~100km nên hai ứng viên
Ninh Bình lọt guard và resolve thẳng vào Hà Nội. Không hạ ngưỡng được — Phú Quốc cách centroid
Kiên Giang 110–140km và **đúng**. Thay vào đó `resolve-sources.mjs` giờ gắn cờ `needsReview` cho mọi
hit xa hơn `SOFT_REVIEW_KM = 70` và in ra cuối lần chạy. **Vẫn phải soi bằng mắt** — cờ chỉ nhắc.

### Một chi tiết ăn khớp với 038b

`visitDuration` của 038b là bộ đọc TOÀN PHẦN trên một từ vựng đóng, có `coverage.test.ts` gác.
Đã dò trước 19 giá trị mới trước khi wire — tất cả đọc được. Nhưng
`"30 phút bên ngoài; một buổi diễn khoảng 2 giờ"` (Nhà hát Lớn) đọc ra **120 phút**, tức là mặc định
mọi khách đều xem một buổi diễn. Đã đổi thành `"30 - 45 phút"` và chuyển ý kia sang `travelTips`.
**Bài học: viết `visitDuration` cho trường hợp phổ biến, mọi lựa chọn khác để ở `travelTips`.**

---

## Wave 2 + 3 — 8 hub còn lại (XONG cả nguồn lẫn dịch)

**+94 địa điểm.** Atlas **233 → 327**. Toàn bộ 11 hub đã xong phần nguồn tiếng Việt:

| Hub | Nay | File |
|---|---|---|
| TP.HCM | **20** | `hcmCenter.ts` (9) · `hcmOuter.ts` (8) |
| Huế | **18** | `hueRoyal.ts` (8) · `hueAround.ts` (7) |
| Đà Lạt | **19** | `daLatCity.ts` (8) · `daLatAround.ts` (8) |
| Nha Trang | **13** | `nhaTrang.ts` (10) |
| Phú Quốc + Hà Tiên | **13** | `phuQuoc.ts` (10) |
| Sa Pa | **11** | `sapa.ts` (8) |
| Hạ Long | **13** | `haLong.ts` (10) |
| Ninh Bình | **11** | `ninhBinh.ts` (8) |

### Tình trạng bản dịch — ĐỦ

| Hub | vi | en | ko | ja | zh |
|---|---|---|---|---|---|
| Cả 11 hub — 143 điểm mới, atlas 327 điểm | ✓ | ✓ | ✓ | ✓ | ✓ |

Số entry có bản dịch, theo locale: **vi 327 · en 327 · ko 327 · ja 327 · zh 327.**
**0 entry thiếu locale.** 44 bucket hub trong `content/hubs/` (11 hub × 4 locale), tất cả đã đăng ký
trong `byLocale` ở `src/data/i18n/index.ts` — mỗi locale ngoài `vi` có đủ 11 bucket hub.

Thứ tự ưu tiên đã chọn giữa chừng: **EN trước cho mọi hub**, rồi mới ko/ja/zh. Lý do: fallback trả
tiếng Việt, nên một entry có EN phục vụ được phần lớn khách quốc tế; để 16 entry đủ 4 locale trong
khi 46 entry trống thì tổng giá trị thấp hơn hẳn. Giữ nguyên thứ tự này cho các đợt sau.

**Quy ước tên riêng đã dùng** (tra rồi mới viết, đừng đặt lại): zh dùng tên Hán-Việt khi có
(`下龙` · `华闾` · `云屯` · `河仙` · `老街` · `芒花谷` · `三谷碧洞` · `拜顶寺` · `发艳`), phiên âm chữ Hán
khi không có (`农渃` kiểu 033, `蒲盆岛`, `坑加`, `依底`). ko/ja phiên âm theo âm Việt
(`나트랑`/`ニャチャン`, `푸꾸옥`/`フーコック`, `하롱`/`ハロン`, `사파`/`サパ`, `닌빈`/`ニンビン`) —
đã đối chiếu với các file locale có sẵn trước khi viết, đừng tự chế biến thể mới.

### ⚠️ Guard KHÔNG bắt được chuyện thiếu bản dịch

`check:i18n` chỉ so parity **giữa các file locale**, không kiểm tra độ phủ theo entry — nên một entry
không có bản dịch nào vẫn qua sạch mọi guard (fallback trả tiếng Việt, không vỡ gì, cũng không kêu).
Đợt này đã trả hết nợ đó, nhưng cái bẫy vẫn còn nguyên cho đợt sau. Cân nhắc thêm một test dựng
`destinationI18n` rồi assert mọi `destinations[].id` có đủ 4 locale.

Câu lệnh kiểm tra độ phủ (chạy tay, chưa có guard nào tự chạy):
```bash
node --experimental-strip-types -e "Promise.all([import('./src/data/destinations.ts'),\
import('./src/data/i18n/index.ts')]).then(([d,i])=>{const m=d.destinations.filter(x=>\
!i.destinationI18n[x.id]||Object.keys(i.destinationI18n[x.id]).length<4);console.log(m.length)})"
```

### 4 lỗi test đã sửa, và một lỗi để lại cho 038b

Ba lỗi do tôi, đã sửa:
1. **`o-quy-ho-pass` trùng id** — đèo Ô Quy Hồ đã có sẵn trong `regions/northMountains.ts`. Đã bỏ
   bản của tôi. Hub mới **phải** kiểm tra id trùng với 187 entry cũ trước khi viết.
2. **`"Hai ngày, nên ngủ lại"` không đọc được** — bộ đọc `visitDuration` của 038b nhận chữ số
   (`2 ngày`) chứ không nhận số viết bằng chữ. Đã đổi.
3. **`unesco` bị dùng làm tag** — đúng cái bẫy memory đã ghi. `unesco` là **badge**. Đã thay.
   Nhân tiện thêm `cave` và `palace` vào 5 từ điển tag: chúng là tag kiểu-loại y hệt `bridge`,
   `island`, `temple` vốn đã có sẵn.

**Còn 1 lỗi CHƯA sửa, và cố ý không sửa:**

```
FAIL src/lib/itinerary/presets.test.ts > dn-classic-5: actually delivers the places it pins
     dropped: ["son-tra-peninsula"]
```

Preset `dn-classic-5` ghim `son-tra-peninsula`, nhưng engine không còn xếp được nó vào lịch — vì
038 vừa thêm ba điểm **nằm ngay trên chính bán đảo đó** (`ban-co-peak`, `linh-ung-pagoda-bai-but`,
`my-khe-beach`), và chúng cạnh tranh hết chỗ trong ngày Sơn Trà. `PACE.maxStops` chỉ cho 2–4 điểm
mỗi ngày.

Đây là dữ liệu của 038 làm đổi kết quả của preset thuộc 038b. **`src/data/trip-presets.ts` là file
của 038b (chưa commit, họ đang dựng)** — sửa file đang dở của phiên khác đúng là kiểu va chạm mà
memory `vivel-concurrent-sessions` cảnh báo, nên tôi để nguyên. Hai hướng cho 038b chọn:

- Bỏ `son-tra-peninsula` khỏi `pinned` và ghim `ban-co-peak` — điểm cụ thể thắng điểm chung chung;
- Hoặc coi entry "cả bán đảo" là co-site của các điểm trên nó và dedupe như `CO_SITE_KM` đang làm
  cho Cầu Vàng / Bà Nà (ở đây khoảng cách >2km nên ngưỡng hiện tại không bắt được).

Bài học chung: **thêm điểm vào một tỉnh có thể làm rớt một điểm đang được ghim ở tỉnh đó.**

## Còn lại
- **`npm run db:setup` CHƯA chạy.** `db/seed.sql` đã dựng lại (327 destination, đủ 5 locale) nhưng
  chưa nạp vào D1 local vì 038b giữ `wrangler dev` trên đúng cái DB đó. Chạy khi họ xong.
- **Ảnh (039)** — 143 điểm mới đang dùng placeholder gradient. **Trước khi fetch phải migrate
  `scripts/fetch-images.mjs` sang `scripts/lib/image-sources.mjs`**: nhánh geosearch của nó vẫn không
  validate và lần chạy gần nhất cho ra 13/14 hero sai.
- **`tasks/038-candidates.json`** giữ danh sách ứng viên; các file `*-coords.json` giữ toạ độ đã
  resolve kèm nguồn. 038b Phase 8 (ItineraryPattern / co-occurrence) dùng lại được.
