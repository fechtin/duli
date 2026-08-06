# 033 — Phủ sâu địa điểm Việt Nam (mọi tỉnh ≥ 3 điểm)

## Bối cảnh
Atlas VN đang có **115 địa điểm / 63 tỉnh** (không tỉnh nào trống), nhưng 43 tỉnh mới có
1–2 điểm trong khi atlas KR đã 189 entry. Mục tiêu đợt này: nâng **mọi tỉnh lên ≥ 3 điểm**
→ **+74 địa điểm**, tổng ~189, ngang bộ KR.

## Nguyên tắc dữ liệu
- Tọa độ **không được bịa**: tra Wikipedia (`prop=coordinates`) → Wikidata (P625) → OSM
  Nominatim, theo thứ tự đó. Ứng viên không tra được tọa độ thì **đổi ứng viên**, không đoán.
- Mỗi entry mới có `sourceUrl` + `verifiedAt` (chuẩn của bộ KR; bộ VN cũ chưa có).
- Registry tỉnh của atlas là **63 tỉnh cũ**; Wikipedia đã theo bản sáp nhập 2025 nên phần
  "thuộc tỉnh X" trong extract có thể lệch — bám theo `geo-meta.vn.json`, không theo Wikipedia.
- File mới đặt ở `src/data/regions/depth/<regionId>.ts` (8 vùng theo `VnRegionId`) để không
  đụng tên file cũ và giữ mỗi file dưới trần 500 LOC.
- Bản dịch: `src/data/i18n/content/depth/<regionId>.{en,ja,ko,zh}.ts`, đăng ký ở
  `src/data/i18n/index.ts`.

## Khối lượng theo vùng
| Vùng | Cần thêm |
|---|---|
| northeast | 14 |
| mekong-delta | 15 |
| red-river-delta | 12 |
| south-central-coast | 11 |
| southeast | 7 |
| central-highlands | 6 |
| northwest | 6 |
| north-central-coast | 3 |

## Tiến độ
- [x] Đếm lại hiện trạng, xác định 74 chỗ trống
- [x] **Batch 1 — northeast (14)**: content + 4 bản dịch + wire + typecheck ✅
- [x] **Batch 2 — red-river-delta (11/12)**: xong; **Hà Nam vẫn 2 điểm** — không nguồn nào
      (vi/en Wikipedia, Wikidata, OSM Nominatim, Overpass) có tọa độ cho chùa Long Đọi Sơn,
      chùa Bà Đanh, đền Lảnh Giang, Kẽm Trống, nhà thờ Sở Kiện. Chưa bịa tọa độ; cần nguồn khác.
- [x] **Batch 3 — mekong-delta (14/15)**: xong; **Hậu Giang vẫn 2 điểm** — không nguồn nào có
      tọa độ cho đền Đồng Bằng, công viên Xà No, di tích Chương Thiện.
- [x] **Batch 4 — south-central-coast (11)**
- [x] **Batch 5 — southeast (7)**
- [x] **Batch 6 — central-highlands (6)**
- [x] **Batch 7 — northwest (6)**
- [x] **Batch 8 — north-central-coast (3)**
- [x] `npm run verify:vn` → sửa Cô Tô lệch 7,7km (lấy nhầm tọa độ đặc khu thay vì đảo);
      thêm 14 pin vào `scripts/.verify-map.json`
- [x] `npm run typecheck` + `check:i18n` + `check:content` + `test` (45/45)
- [ ] `npm run images:fetch` → **Read từng .webp để duyệt bằng mắt**, ảnh sai thì xóa seed
- [ ] Chạy lại `verify:vn` sau khi có ảnh, xử lý phần integrity còn lại
- [ ] `npm run db:seed:build` (seed D1 chạy tay, xem MEMORY)

## Kết quả
**115 → 187 địa điểm (+72)**, 61/63 tỉnh đạt ≥3 điểm. Mỗi entry mới có `sourceUrl` +
`verifiedAt` và đủ 4 bản dịch en/ko/ja/zh.

Hai tỉnh **cố ý** dừng ở 2 điểm — Hà Nam và Hậu Giang. Mọi ứng viên còn lại đều không tra
được tọa độ qua vi/en Wikipedia → Wikidata → OSM Nominatim → Overpass. Không bịa tọa độ vì
`images:fetch` dùng geosearch quanh lat/lng: tọa độ sai sẽ kéo về ảnh của một nơi khác.

## Batch 1 — northeast: tọa độ đã xác thực
| Tỉnh | Địa điểm | lng, lat | Nguồn |
|---|---|---|---|
| bac-giang | Suối Mỡ | 106.4837, 21.2695 | vi.wiki |
| bac-kan | Động Puông | 105.6578, 22.4575 | vi.wiki |
| bac-kan | Thác Đầu Đẳng | 105.5704, 22.4526 | vi.wiki |
| cao-bang | Khu di tích Pác Bó | 106.0498, 22.9813 | vi.wiki |
| lang-son | Cửa khẩu Hữu Nghị | 106.7110, 21.9718 | vi.wiki |
| lao-cai | Fansipan | 103.7771, 22.3043 | vi.wiki |
| lao-cai | Chợ phiên Bắc Hà | 104.2908, 22.5409 | vi.wiki |
| phu-tho | VQG Xuân Sơn | 104.9333, 21.1500 | en.wiki + Wikidata |
| phu-tho | Đền Mẫu Âu Cơ | 104.9150, 21.6033 | vi.wiki |
| quang-ninh | Yên Tử | 106.7151, 21.1605 | vi.wiki (khớp OSM chùa Đồng) |
| quang-ninh | Đảo Cô Tô | 107.6981, 20.9472 | vi.wiki |
| thai-nguyen | Hang Phượng Hoàng – suối Mỏ Gà | 106.1183, 21.7785 | OSM (2 node khớp) |
| tuyen-quang | Thác Bản Ba | 105.0679, 22.3374 | vi.wiki |
| yen-bai | Đèo Khau Phạ | 104.2717, 21.7750 | vi.wiki |

Ứng viên đã **loại vì không có tọa độ xác thực**: Ải Chi Lăng, ATK Định Hóa, Đền Đuổm,
Bảo tàng Văn hóa các dân tộc VN → thay bằng Cửa khẩu Hữu Nghị và Hang Phượng Hoàng.
