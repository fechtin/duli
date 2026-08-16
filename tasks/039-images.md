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

## Trạng thái

- **159/327 destination VN chưa có ảnh** (140 mới của 038 + 19 tồn đọng).
- Mẫu DRY đã đạt: Long Sơn, Bình Ba, Dốc Lết, Y Tý, Hạ Long, Phát Diệm, Hang Múa, Vân Đồn,
  Hà Tiên, Train Street đều ra ảnh đúng chủ thể.
- **Chưa chạy thật** — job dài gọi API ngoài, phải xin phép user.

## Việc còn lại

- **Audit 189 ảnh cũ `via: "geosearch"`.** Đó là nhánh không validate. Không phải tất cả đều sai —
  geosearch đúng khi nơi đó thật sự có ảnh gắn toạ độ — nhưng chưa cái nào được kiểm. Cách làm:
  chạy lại chuỗi mới cho từng seed đó và so `sourceTitle`; cái nào chuỗi mới từ chối thì đưa vào
  danh sách người xem. Đây là đợt riêng.
- `tasks/039-tour-stops.md` (phiên khác) sẽ liệt 20-35 destination mới; chúng **không** nằm trong
  159 của đợt này và cần một lượt ảnh sau.
