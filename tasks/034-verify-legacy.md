# 034 — Verify 115 địa điểm VN cũ

Đợt 033 để lại 115 entry không có `sourceUrl`/`verifiedAt`, trong khi vẫn hiển thị giá vé và
giờ mở cửa. Đợt này gắn nguồn cho phần **tra được**, và nói thẳng phần không tra được.

## Phạm vi đã chốt với chủ repo
Giữ nguyên `ticket`/`openingHours` (không xóa), chỉ bảo chứng **địa điểm tồn tại + tọa độ**.
Vì vậy comment của `sourceUrl` trong `src/lib/types.ts` đã được viết lại cho đúng nghĩa —
nếu để nguyên bản cũ thì 132 entry đang mang một lời hứa sai về giá vé.

## Công cụ (mới)
- `scripts/resolve-sources.mjs` — tra nguồn: pin → vi.wiki → en.wiki → Wikidata. Hai lớp chặn
  khớp nhầm: bài phải chia sẻ token tên, **và** lệch ≤ 50km.
- `scripts/apply-sources.mjs` — ghi `sourceUrl`+`verifiedAt` ngược lại file, sửa tọa độ theo
  **loại địa điểm** chứ không theo khoảng cách. Có dry-run.

## Kết quả
| | |
|---|---|
| Có `verifiedAt` | **132 / 187** (72 của 033 + 60 của đợt này) |
| Chưa verify | **55** |
| Tọa độ đã sửa | **7** |

**7 tọa độ sai đã sửa:** Chùa Keo 32,4km · Chùa Hương Tích (Hà Tĩnh) 20,6km · Gành Đá Đĩa
14,4km · Chùa Vàm Ray 11,5km · Địa đạo Vịnh Mốc 10,6km · Đảo Cò Chi Lăng Nam 10,3km ·
Khu di tích Tân Trào 33,5km.

**1 bẫy đã chặn được:** `Chùa Vĩnh Nghiêm` (Bắc Giang) khớp sang chùa cùng tên ở TP.HCM,
cách 1.164km. Đây chính là lý do resolver có ngưỡng 50km — trùng tên khác nơi, không phải
lệch tọa độ.

## Còn tồn — cần người quyết
**6 điểm lệch >8km nhưng là vùng rộng, KHÔNG tự dời** (tọa độ atlas có thể còn tốt hơn bài
Wikipedia, vì bài mô tả cả vùng): Hồ Thác Bà 27,3km · Vườn quốc gia Pù Mát 22,9km ·
Vịnh Hạ Long 20,8km · Tam Đảo 16,7km · Đèo Mã Pì Lèng 14,8km · Vườn quốc gia Cát Tiên 13,4km.

**55 điểm không tra được nguồn** — Wikipedia không có bài hoặc bài không có tọa độ. Chủ yếu là
chợ nổi, làng nghề, bãi biển nhỏ, khu du lịch tư nhân: chợ nổi Cái Bè / Ngã Bảy, làng hoa Sa Đéc,
lò gạch Mang Thít, Cồn Phụng, nhà Công tử Bạc Liêu, Đại Nam, biển Sầm Sơn / Cửa Lò / Cồn Vành…
Muốn phủ nốt thì phải dùng nguồn khác (cổng du lịch tỉnh, OSM có kiểm chứng), hoặc chấp nhận
để trống — trống vẫn trung thực hơn là gắn nguồn sai.

Chi tiết từng dòng: `tasks/resolve-sources.json`.
