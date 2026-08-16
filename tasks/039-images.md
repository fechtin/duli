# 039 — Ảnh cho địa điểm: migrate fetch-images sang resolver đã validate

## Vì sao

`scripts/fetch-images.mjs` là script cuối cùng chưa dùng `scripts/lib/image-sources.mjs`. Nó tự
xếp hạng ứng viên và — chỗ chết người — **chấp nhận một file chỉ vì file đó được gắn toạ độ gần
điểm đến**, kể cả khi không có gì trong tên file nhắc tới điểm đến. Lần chạy gần nhất cho ra
**13 hero sai trên 14**: một xưởng đóng tàu cho làng cá voi, một trường cấp ba, một ảnh nhà bị
phá ở Israel cho Nhà Trăm Cột, nhà tù Côn Đảo cho nhà tù Sơn La.

Lỗi này mang tính cấu trúc chứ không phải xui: một điểm đến **chưa có ảnh chính là vì không có gì
đúng được gắn toạ độ ở đó**, nên geosearch chỉ còn hàng xóm để trả về.

## Đã làm

### `scripts/lib/image-sources.mjs`
- **`commonsGeo(lat, lng, term, opts)`** — geosearch nhưng **vẫn bắt buộc khớp tên**. Gần chỉ còn
  là tiêu chí phụ giữa các file đã nêu đúng tên, không bao giờ là bằng chứng độc lập.
- **`describesSomethingElse(text, {food, place})`** tách làm ba nhóm. Trước đây mô tả "city/town/
  district" luôn bị loại — đúng cho món ăn, nhưng **sai cho điểm đến**: Hà Tiên, Vân Đồn, Y Tý
  đều được Wikipedia mô tả là thị xã/huyện/xã, và đó chính là bài đúng. Nay `place: true` giữ lại
  nhóm hành chính, nhưng **`province`/`tỉnh` thì luôn loại** ở cả hai chế độ — vì atlas mô hình
  hoá tỉnh thành thực thể riêng, một destination không bao giờ là cả tỉnh.
- **`tokens(s, {stop, minLen})`** — tham số thứ tư của `titleMatches` đổi từ một `Set` thành
  object tuỳ chọn. Mặc định `minLen = 2` **tương đương hệt** bộ lọc cũ `t.length > 1`, đã kiểm
  bằng phép so; nên `fetch-dish-images.mjs` không đổi hành vi.

### `scripts/fetch-images.mjs` — viết lại
Chuỗi nguồn, hit đầu tiên thắng: tiêu đề Wikipedia chính xác (en, rồi bản ngữ) → tìm kiếm
Wikipedia → Commons category → **Commons geosearch có validate** → Commons full-text → Openverse.

Thêm:
- **Lockfile `scripts/.images.lock`** — hai fetcher không bao giờ được chia nhau ngân sách
  Wikimedia. Một lần chạy từ phiên trước từng chạy hàng giờ rồi ghi đè manifest bằng bản trong
  bộ nhớ đã cũ.
- **Lưu manifest mỗi 5 ảnh** thay vì chỉ lưu lúc kết thúc — đúng hành vi cũ đã bỏ rơi 35 file.
- `DRY=1`, `LIMIT=n`, `ONLY=id,id` để lấy mẫu trước khi chạy thật.

## Hai bug do chính DRY run phát hiện

| Ca | Kết quả sai | Nguyên nhân | Sửa |
|---|---|---|---|
| `hoa-binh-lake` | bài **tỉnh Hoà Bình** | token tên hồ trùng token tên tỉnh, "lake" là stopword | luôn loại mô tả `province`/`tỉnh` |
| `y-ty-village` | **trang trại ở Wales** `Ty-Hwnt-y-Bwlch` | chỉ còn token `ty` dài 2 ký tự → khớp 1/1 | `minLen: 3` cho destination |
| `the-note-coffee` | **hai ảnh ở Seattle** (`Ghost Note Coffee`) | tên quán toàn từ tiếng Anh phổ thông | neo địa lý cho type venue |

**Neo địa lý** áp cho 5 type venue của 038 (`cafe` `nightlife` `street` `viewpoint` `themepark`):
nguồn free-text phải nhắc tên tỉnh hoặc tên nước. Tên di sản/thiên nhiên có token tiếng Việt đặc
trưng nên không cần; tên quán tiếng Anh thì cần. Sau khi neo, `the-note-coffee` ra **0 ảnh** —
đúng, vì không có ảnh tự do nào của đúng quán đó, và placeholder gradient là câu trả lời trung thực.

## Trạng thái (chốt lúc dừng — commit `5ef5864`)

Chạy 3h55 rồi **dừng chủ động** bằng SIGINT, không phải lỗi.

| | |
|---|---|
| Đã lấp | **78/159** điểm · **172 ảnh mới** |
| Chất lượng 172 ảnh mới | named 145 · anchored 4 · **SUSPECT 23** |
| Atlas có ảnh | 246/343 |

**Vì sao dừng:** phần còn lại là đuôi khó. Một điểm *không* tìm được ảnh tốn nhiều thời gian hơn
một điểm tìm được, vì nó phải đi hết cả 10 nguồn rồi mới chịu thua — nên 3,5 tiếng còn lại chỉ
đổi được vài chục ảnh. Dừng không mất gì: manifest lưu mỗi 5 ảnh, lần chạy sau tự bỏ qua seed đã có.

**Đã xoá 2 file tải xong nhưng chưa kịp ghi bản ghi** (`crazy-house-dalat-1/2.webp`) — không có
credit và license thì không ship được. Hai seed đó sẽ được lấy lại ở lượt sau.

## CHẠY TIẾP — phiên mới bắt đầu từ đây

```bash
# 1. Kiểm tra không có fetcher nào đang chạy (bắt buộc — đã va chạm thật)
pgrep -f "fetch-.*images" ; ls scripts/.images.lock

# 2. Chạy nốt phần chưa có ảnh. Tự bỏ qua seed đã xong, an toàn khi lặp lại.
node --experimental-strip-types scripts/fetch-images.mjs vn

# 3. Chấm điểm những gì vừa lấy
node --experimental-strip-types scripts/audit-images.mjs vn
```

Ước tính: ~2,5 phút/điểm, còn ~81 điểm → **3-4 tiếng**. Chạy nền, đừng ngồi đợi.

**Ba việc nên làm trong cùng phiên đó:**

1. **Chạy lại 22 venue bị neo oan.** Job vừa rồi neo địa lý cho cả 25 venue type; luật đã sửa để
   chỉ neo 3 cái không còn token đặc trưng (`ba-na-hills`, `the-note-coffee`, `landmark-81`).
   22 cái còn lại chạy dưới luật quá chặt nên có thể đã bỏ sót ảnh đúng:
   ```bash
   ONLY=son-tra-night-market,ban-co-peak,hai-van-pass,hoi-an-night-market,faifo-coffee,\
   reaching-out-teahouse,ta-hien-street,hanoi-train-street,lotte-observation-deck,\
   nguyen-hue-walking-street,bitexco-tower,bui-vien-street,cau-dat-tea-hill,me-linh-coffee-garden,\
   hon-chong-promontory,nha-trang-night-market,phu-quoc-night-market,hon-thom-cable-car,\
   ganh-dau-cape,vinwonders-phu-quoc,muong-hoa-valley,mua-cave \
   FORCE=1 node --experimental-strip-types scripts/fetch-images.mjs vn
   ```
2. **Soi 136 seed trong `tasks/039-suspect-seeds.json`.** Trong đó **80 là `geosearch` cũ** —
   nhánh chưa từng bị ràng buộc tên nào. Đây là nhóm rủi ro cao nhất còn lại trên production.
   ```bash
   REFETCH=tasks/039-suspect-seeds.json node --experimental-strip-types scripts/fetch-images.mjs vn
   ```
   **Nhưng xem bằng mắt trước khi thay.** Nhóm SUSPECT lẫn lộn thật: `AnDinhResidence1.jpg` cho
   An Định, `LakLake.jpg` cho hồ Lắk, `Cau Trang tien ve dem.jpg` cho cầu Trường Tiền đều ĐÚNG mà
   vẫn bị gắn cờ vì tiêu đề không lặp lại tên. Thay mù có thể làm xấu đi.
3. **Ảnh cho destination mới của phiên `vivel-c1`** — xem `tasks/039-tour-stops.md`. Chúng không
   nằm trong 159 của lượt này.

## Cảnh báo cho phiên mới

- **Ảnh KHÔNG cần reseed D1.** Chúng là asset tĩnh trong `public/img/` + manifest bundle lúc build,
  nên `git push` là đủ. Chỉ khi **thêm/sửa destination** mới phải reseed `--remote` — và đó là nút
  của user.
- **Nhiều phiên cùng repo này.** Kiểm `git status` trước khi commit: cây thường có việc dở của phiên
  khác (đợt này có tính năng map links trong `components/panel/`, `lib/maps/`, `locales/*` —
  KHÔNG phải của 039). Stage theo tên file, đừng `git add -A`.
- **Lockfile `scripts/.images.lock`** chặn fetcher thứ hai. Nếu tiến trình chết bẩn thì xoá tay.
