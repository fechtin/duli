# 039 — Tour-stop mining, 9 hubs

Extends the §Phase 8 co-occurrence signal (`docs/031.md:267`) from 2 provinces to 11, and records the
places published itineraries visit that the atlas has no row for.

Read 2026-08-16. Method per `src/data/itinerary-patterns.ts:24-26`: read several independent
itineraries per hub, record ONLY groups that share one day, count how many sources showed each,
cite every one. No prose, no day titles, no ordering is copied — `docs/031.md:272`.

## Sources read

| hub | sources |
|---|---|
| ha-noi | sinhtour, traveloka, gonow |
| ho-chi-minh | greensm (ex-xanhsm), luhanhvietnam |
| lam-dong | mia, dulichviet, traveloka |
| thua-thien-hue | sigo, xehoangphu |
| quang-ninh | phanvantravel, catbaduky |
| khanh-hoa | nhatrang-tourist, vietnambooking |
| kien-giang | traveloka, findtour |
| lao-cai | traveloka, thesinhtour |
| ninh-binh | vexere, bamozo |

Blocked by the publisher, not read: klook.com and vinwonders.com both return 403 to WebFetch.
Nothing is cited from a page that could not be read in full — a search-result summary is not a source.

## Same-day groups → patterns

Only groups where every id already exists in the atlas. Confidence follows the existing scale:
2+ independent sources → 0.7–0.85, a single sighting → ≤0.6 (`patterns.test.ts:56` enforces the cap).

| province | group | src | conf |
|---|---|---|---|
| ha-noi | hoan-kiem-lake + ta-hien-street | 2 | 0.75 |
| ha-noi | hoan-kiem-lake + ngoc-son-temple + st-joseph-cathedral-hanoi | 1 | 0.5 |
| ha-noi | ho-chi-minh-mausoleum + one-pillar-pagoda | 1 | 0.5 |
| ha-noi | temple-of-literature + imperial-citadel-thang-long | 1 | 0.5 |
| ha-noi | west-lake-hanoi + tran-quoc-pagoda | 1 | 0.5 |
| ho-chi-minh | independence-palace + notre-dame-saigon + saigon-central-post-office + nguyen-hue-walking-street | 2 | 0.85 |
| ho-chi-minh | war-remnants-museum + independence-palace | 1 | 0.5 |
| ho-chi-minh | ben-thanh-market + cho-lon-district + bui-vien-street | 1 | 0.5 |
| ho-chi-minh | landmark-81 + bach-dang-wharf | 1 | 0.5 |
| lam-dong | xuan-huong-lake + da-lat-railway-station + da-lat-cathedral | 1 | 0.55 |
| lam-dong | tuyen-lam-lake + truc-lam-monastery + bao-dai-summer-palace + datanla-waterfall | 1 | 0.55 |
| lam-dong | xuan-huong-lake + da-lat-market | 1 | 0.5 |
| thua-thien-hue | hue-imperial-city + thien-mu-pagoda + perfume-river | 2 | 0.85 |
| thua-thien-hue | khai-dinh-tomb + tu-duc-tomb + dong-ba-market | 1 | 0.55 |
| quang-ninh | ha-long-bay + sung-sot-cave + ti-top-island | 2 | 0.8 |
| khanh-hoa | ponagar-towers + long-son-pagoda + nha-trang-cathedral + hon-chong-promontory | 1 | 0.55 |
| kien-giang | dinh-cau-phu-quoc + ham-ninh-fishing-village + phu-quoc-night-market | 1 | 0.55 |
| kien-giang | bai-sao-beach + ham-ninh-fishing-village | 1 | 0.5 |
| kien-giang | phu-quoc-prison + vinwonders-phu-quoc | 1 | 0.5 |
| kien-giang | hon-thom-cable-car + phu-quoc-night-market | 1 | 0.5 |
| lao-cai | cat-cat-village + silver-waterfall-sapa | 1 | 0.5 |
| lao-cai | fansipan + muong-hoa-valley | 1 | 0.5 |
| lao-cai | ham-rong-mountain + sa-pa-town | 1 | 0.5 |
| ninh-binh | trang-an + bai-dinh-pagoda | 2 | 0.8 |
| ninh-binh | tam-coc-bich-dong + mua-cave | 2 | 0.8 |

The groups worth having are the ones geometry would miss: Thác Bạc sits 12 km northwest of Sa Pa on
the Ô Quy Hồ road while Cát Cát is south of town, Văn Miếu is across Hà Nội from the citadel, and
Tràng An and Bái Đính are 15 km apart. Distance alone would separate all three; the sources do not.

## Rejected — observed but deliberately not stored

| group | why |
|---|---|
| imperial-citadel-thang-long + hanoi-flag-tower | The flag tower stands inside the citadel grounds. Same reasoning as the existing `ba-na-hills` + `golden-bridge` rejection (`itinerary-patterns.ts:146`) — geometry already collapses them, so a bonus has nothing to act on. |
| thien-cung-cave + sung-sot-cave | phanvantravel lists them as alternatives for one slot ("Thiên Cung, Đầu Gỗ, **or** Sửng Sốt"), not as a same-day pair. An either/or is not a co-occurrence. |
| tuan-chau-island + the cruise stops | catbaduky uses Tuần Châu as the embarkation port, not a visit. Recording it would schedule a stop where the source only parked a car. |
| valley-of-love + tuyen-lam-lake | Both sources do put them on one day, but Valley of Love is north of the city and Tuyền Lâm is south. The engine's travel-time model would reject the day anyway; encouraging it would only produce trips that fail `fitVisit`. |
| cuc-phuong-national-park + thung-nham-bird-park | bamozo's second itinerary splits these across day 1 and day 2. Not a same-day group. |
| ben-thanh-market + cho-lon-district (greensm) | greensm day 3 lists them among four alternatives for one shopping slot. Counted once from luhanhvietnam only, where they genuinely share a day. |

## Source-independence caveat

`mia.vn` and `dulichviet.com.vn` publish near-identical Đà Lạt day splits — same stops, same order,
across all three days. Treated as **one** observation, not two, so every Đà Lạt group carries
`occurrenceCount: 1` even though two URLs are cited. Counting them as two would manufacture evidence
that does not exist, which is the one thing `patterns.test.ts:45` is there to catch.

## Unmatched places → destination candidates

Named in a published itinerary, no atlas row. `src` = independent sources naming it.

| province | place | src |
|---|---|---|
| ha-noi | Bảo tàng Hồ Chí Minh | 2 |
| ha-noi | Nhà hát múa rối nước Thăng Long | 2 |
| ha-noi | Phủ Tây Hồ | 1 |
| ha-noi | Bảo tàng Lịch sử Quốc gia | 1 |
| ha-noi | Phố Tống Duy Tân | 1 |
| ho-chi-minh | Chùa Bà Thiên Hậu | 1 |
| ho-chi-minh | Đường sách Nguyễn Văn Bình | 1 |
| ho-chi-minh | Hồ Con Rùa | 1 |
| ho-chi-minh | Chợ đêm Hồ Thị Kỷ | 1 |
| ho-chi-minh | Phố thuốc bắc Hải Thượng Lãn Ông | 1 |
| lam-dong | Quảng trường Lâm Viên | 2 |
| lam-dong | Vườn hoa thành phố Đà Lạt | 1 |
| lam-dong | Chùa Vạn Hạnh | 1 |
| lam-dong | Làng Cù Lần | 1 |
| lam-dong | Vườn hoa cẩm tú cầu | 1 |
| thua-thien-hue | Làng hương Thủy Xuân | 1 |
| thua-thien-hue | Phố đi bộ Nguyễn Đình Chiểu | 2 |
| quang-ninh | Hang Luồn | 1 |
| quang-ninh | Sun World Hạ Long | 1 |
| quang-ninh | Chợ Hạ Long | 1 |
| khanh-hoa | VinWonders Nha Trang | 2 |
| khanh-hoa | Bãi Tranh | 2 |
| khanh-hoa | Làng chài Nha Trang | 2 |
| khanh-hoa | I-Resort suối khoáng nóng | 2 |
| khanh-hoa | Hòn Tằm | 1 |
| kien-giang | Chùa Hộ Quốc | 2 |
| kien-giang | Hòn Móng Tay | 2 |
| kien-giang | Bãi Dài Phú Quốc | 1 |
| kien-giang | Sunset Town | 1 |
| kien-giang | Nhà thùng nước mắm | 1 |
| kien-giang | Grand World Phú Quốc | 1 |
| lao-cai | Nhà thờ Đá Sa Pa | 2 |
| lao-cai | Chợ đêm Sa Pa | 1 |
| lao-cai | Thác Tiên Sa | 1 |
| ninh-binh | Đầm Vân Long | 1 |

**Not candidates** — resolved to rows that already exist under a different name:

- Chợ Âm Phủ / Chợ đêm Đà Lạt → `da-lat-market` (the same market after dark)
- Nhà thờ Con Gà → `da-lat-cathedral`
- Long Sơn Tự → `long-son-pagoda`; Nhà thờ Chánh Toà Nha Trang → `nha-trang-cathedral`
- Hòn đá Chữ → `hon-chong-promontory`
- Kinh thành Huế → `hue-imperial-city`
- Cổng trời Sa Pa → `o-quy-ho-pass`, which already exists but is filed under **lai-chau**, not
  lao-cai. The pass straddles the two provinces and the atlas picked the far side. Caught only
  because the candidate id collided; a different id would have created a second row for the same
  pass. Left as-is — one pass, one row — rather than duplicating it under Lào Cai.

That last table is the point of the exercise. `train-street-hanoi` does not exist but
`hanoi-train-street` does, and a name typed from memory rather than grepped is how a destination
gets added twice. Every row above was checked against the id list before being called missing.

## Coordinate resolution — what survived

35 candidates → two `resolve-sources.mjs --candidates` runs → **16 rows written**. 19 dropped.

The province centroid is the wrong referee for islands: Kiên Giang's sits on the mainland, so
`phu-quoc-island` itself is 108 km from it and `ganh-dau-cape` 127 km. Everything was therefore
re-measured against a same-cluster atlas row instead, which cleared two false alarms and caught five
matches that were confidently wrong:

| dropped | resolved to | why it is wrong |
|---|---|---|
| van-long-lagoon (run 1) | Đầm Vân **Trì** | a different lagoon, in Hà Nội, 101 km off |
| thien-hau-temple-hcm | a same-named pagoda in Hóc Môn | 24 km from Chợ Lớn, where the real one is |
| hon-mong-tay | an islet 61 km toward the mainland | wrong side of the sea from Phú Quốc |
| ha-long-market | a market 45 km northeast | not the Hòn Gai market the sources mean |
| nha-trang-fishing-village | "Làng Chài Hải Sản" | a seafood restaurant; the tours mean a floating farm |

`van-long-lagoon` and `ho-quoc-pagoda` were recovered on the retry run with better queries. The other
14 never resolved and were dropped rather than guessed, per the rule in `resolve-sources.mjs:20-23`.
Two hubs — **Quảng Ninh and Lào Cai — gained no rows at all**, because every one of their candidates
failed. Their mined patterns still landed; only the new places are missing.

## Rows written (16)

`ha-noi` 5 · `lam-dong` 3 · `kien-giang` 3 · `ho-chi-minh` 2 · `thua-thien-hue` 1 · `khanh-hoa` 1 ·
`ninh-binh` 1. Atlas 327 → 343.

    ho-chi-minh-museum  thang-long-water-puppet  phu-tay-ho  national-history-museum-vn
    tong-duy-tan-food-street  nguyen-van-binh-book-street  turtle-lake-hcm  lam-vien-square
    da-lat-flower-garden  cu-lan-village  thuy-xuan-incense-village  hon-tam-island
    bai-dai-phu-quoc  grand-world-phu-quoc  ho-quoc-pagoda  van-long-lagoon

## No photos in this batch

These 16 ids ship with `IllustratedImage` placeholders. vivel-33's image pass fixed its list of 159
before they existed, so they need a later run — the id list above is what that pass should take.

## Still owed

`db/seed.sql` is now out of step with production D1. The reseed is manual and belongs to the user:
`npm run db:seed:build`, then `npx wrangler d1 execute atlas_db --remote --file=db/seed.sql`.
