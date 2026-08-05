# Vietnam Interactive Tourism Atlas — Build Plan

> Stack: Vite + React + TS + Tailwind v4 + Motion + Cloudflare Workers (Hono)
> Map data: self-sourced GeoJSON. Content: seed data. AI: abstraction + mock provider.

## Decisions (confirmed with user 2026-06-27)
- Scope: full MVP, built in layers, reported incrementally.
- Frontend: Vite + React + Cloudflare Workers (Bible 000 allowed swap per 019).
- Map: self-sourced Vietnam GeoJSON (8 regions + 63 provinces).
- AI: mock provider behind a provider-abstraction interface.

## Sprint 0 — Foundation
- [ ] Project scaffold (vite, ts, tailwind v4, configs)
- [ ] Design tokens (color/spacing/radius/typography/motion) as CSS @theme + TS
- [ ] Core UI components (Button, Card, Badge, Chip, Panel, BottomSheet, Skeleton, Tooltip, Toast)
- [ ] i18n foundation (VI/EN, translation keys, no hardcoded text)
- [ ] App shell + routing (map-centric, URL sync)
- [ ] Worker API (Hono) /api/v1 skeleton + client data layer

## Sprint 1 — Interactive Map
- [ ] Vietnam GeoJSON -> projected SVG (regions + provinces)
- [ ] Camera system (pan/zoom, spring, zoom levels 0-4)
- [ ] Illustrated markers + states (idle/hover/selected/visited...)
- [ ] Hover preview + click -> camera fly + panel open

## Sprint 2 — Destination
- [ ] Seed data (regions, ~8 provinces, ~20 destinations)
- [ ] Destination panel (progressive disclosure order from Bible 003)
- [ ] Gallery, story, travel info, nearby

## Sprint 3 — AI
- [ ] AI provider abstraction + mock streaming
- [ ] AI Summary + contextual chat + suggestions

## Sprint 4 — Community
- [ ] Mock auth, Passport, Check-in flow (3 steps), Collections
- [ ] Share card (SVG -> image)

## Sprint 5 — Optimization
- [ ] Search (fuzzy, alias, multi-lang)
- [ ] Cache strategy, lazy loading, a11y, dark mode, SEO meta

## Review (2026-06-27)
All sprint slices delivered as a runnable MVP. Verified: app + worker typecheck, production
build, Worker API end-to-end (regions/province/search-alias/AI-stream), SPA + asset serving,
and browser screenshots (overview/province/dark/mobile) with zero console errors.

Key bug found & fixed via visual verification: d3-geo (spherical) requires **clockwise**
exterior rings; the source GeoJSON is CCW (RFC 7946), so every province path filled the whole
globe. Fixed by reversing ring winding in `scripts/build-map.mjs`. Also fixed: map framing must
use a winding-free MultiPoint frame (a lon/lat polygon frame is mis-read as the whole sphere).

Deferred (post-MVP): real photos via R2, real AI provider, more provinces' editorial content,
offline/service-worker cache, full KO/JA/ZH dictionaries, unit/integration tests.

---

# 023.md — AI Discovery Experience Layer (2026-06-29)

Hiện thực hoá đề xuất UX 2.0. Chia 6 phase, mỗi phase deploy độc lập.
**Phạm vi lần này: Phase 1 + Phase 3** (AI giữ static/mock; model thật + KV để Phase 6).

## Hiện trạng (đã verify)
- Heartbeat: tính sẵn lúc load nhưng panel chỉ hiện khi click; map chỉ pulse/glow ở zoom ≥2.
  `lib/living/heartbeat.ts`, `store/useLivingStore.ts`, `map/MapEngine.tsx`, `panel/HeartbeatSection.tsx`
- Morning Brief: popup 1.2s, dismiss 1 lần/session rồi biến mất; nội dung static theo tháng+giờ.
  `brief/DailyBrief.tsx`, `lib/living/briefGenerator.ts`
- Camera fly-to sẵn: `useMapStore.requestFocus` + `useCamera.focusPoint/focusBox`.
- CSS sẵn: `heartbeat-ring`, `seasonal-dot` trong `src/index.css`.

## PHASE 1 — Ambient Heartbeat phân tầng theo zoom
- [ ] 1.1 `index.css`: keyframe `ambient-glow` (breathing nhẹ) + class.
- [ ] 1.2 `MapEngine.tsx`: helper `heartbeatGlow(hb)` → màu theo signal trội.
- [ ] 1.3 `MapEngine.tsx`: `GlowLayer` render sau province, trước markers, ở mọi zoom.
      Zoom toàn quốc (markers ẩn) → chỉ quầng sáng = ánh sáng nhẹ, không icon/popup.
- [ ] 1.4 Cường độ theo `hb.score`; cull viewport (`inView`).

## PHASE 3 — AI Companion Card (thay popup Brief)
- [ ] 3.1 `useUIStore.ts`: cờ `briefOpen` + setter.
- [ ] 3.2 `DailyBrief.tsx`: popup 1 lần/NGÀY (localStorage); set `briefOpen`.
- [ ] 3.3 `companion/CompanionCard.tsx`: collapsed 1 dòng teaser theo giờ; expand → 5 điểm +
      Hidden Gem + AI Pick + CTA; desktop dưới Search; mobile sticky đáy kéo lên (Apple Maps).
- [ ] 3.4 `App.tsx`: mount `<CompanionCard />`.

## Verify
- [x] `tsc --noEmit` + `npm run build` pass (2296 modules, built 1.67s).
- [ ] App (visual, chưa chạy): quầng sáng zoom toàn quốc; card luôn hiện; expand/collapse; mobile drag.

## Review (2026-06-29)
Phase 1 + 3 đã code xong, build pass. Files:
- `src/index.css` — keyframe + class `ambient-glow`.
- `src/components/map/MapEngine.tsx` — helper `heartbeatGlow()` + `GlowLayer` (quầng sáng mọi zoom,
  cull viewport, size theo score); marker tái dùng helper.
- `src/lib/store/useUIStore.ts` — cờ `briefOpen` + `setBriefOpen`.
- `src/components/brief/DailyBrief.tsx` — popup 1 lần/NGÀY (localStorage `vivel:brief-popup`).
- `src/lib/living/briefGenerator.ts` — thêm `emoji` + `teaser` (Dynamic Brief theo giờ).
- `src/components/companion/CompanionCard.tsx` — MỚI, desktop dưới search + mobile draggable.
- `src/App.tsx` — mount `<CompanionCard />`.
Còn lại: visual verification trên browser (quầng sáng + card desktop/mobile).

## Phase sau (ngoài phạm vi)
- P2 Heartbeat Timeline · P4 Discovery Feed + Ambient Suggestions · P5 Discovery Mode + Queue ·
  P6 Cloudflare KV + Claude thật.

---

# Đa ngôn ngữ nội dung Food (2026-07-05)
Ngôn ngữ: en, ko, ja, zh. Nội dung: 149 Dish (66 dish + 83 đặc sản) + 26 nhà hàng. Bản dịch: AI.
Nhân bản đúng pattern destination/province i18n (cột i18n JSON + pickTranslation overlay).

## A. Hạ tầng code
- [x] types.ts: DishTranslation, RestaurantTranslation, DishI18n, RestaurantI18n; `i18n?` vào Dish & Restaurant
- [x] migration mới 0005_food_i18n.sql: cột `i18n` cho bảng dishes & restaurants
- [x] src/data/i18n/food/index.ts: dishI18n, restaurantI18n maps
- [x] build-d1-seed.mjs: seed cột i18n cho dishes & restaurants
- [x] worker/db.ts: pickTranslation overlay trong mapDish/getDishes/getDish + restaurants
- [x] worker/index.ts: thread `?locale=` cho /food routes
- [x] src/lib/api/food.ts: localeQuery + cache theo locale + getStoredLocale
- [x] DishPanel.tsx: chuỗi hardcode → useT() + refetch khi đổi locale
- [x] 5 locale UI dicts: key DishPanel

## B. Sinh bản dịch (workflow wf_725298cf — 22 agent, 0 lỗi)
- [x] Dịch 149 Dish × 4 lang → src/data/i18n/food/dishes.<locale>.ts (ingredients giữ đúng số phần tử)
- [x] Dịch 26 Restaurant × 4 lang → src/data/i18n/food/restaurants.<locale>.ts (reasons giữ đúng số)

## C. Kiểm chứng — ĐÃ QUA
- [x] db:seed:build (149 dishes, 26 restaurants với cột i18n)
- [x] tsc --noEmit sạch; npm run build pass
- [x] db:setup (migration 0005 + seed local)
- [x] wrangler dev: /food/dish/pho-bo?locale=ja|en|zh trả nội dung dịch; ?locale=vi fallback tiếng Việt

## Review
Nhân bản pattern i18n của destination/province cho Food. Nội dung món ăn/đặc sản/nhà hàng giờ
đa ngôn ngữ (en/ko/ja/zh), fallback tiếng Việt khi thiếu. DishPanel dùng useT, tự refetch khi
đổi ngôn ngữ. Bản dịch do AI sinh — nên rà soát lại trước khi production nếu cần độ chính xác cao.

## UI Elevation — "Living Atlas" (2026-07-04, spec docs/025.md)
- [x] Tokens: regionPalette.ts (light/dark), map atmosphere tokens, type-scale utilities
- [x] Map: palette mới + coastal glow 2 lớp + vignette + sea sâu hơn
- [x] Night Atlas: dark land/sea riêng, bờ biển phát sáng
- [x] Nhãn: region/province = text+halo (bỏ pill), marker phân hạng theo tier
- [x] Intro cinematic: coastline draw + land fade so le (skip khi reduced-motion)
- [x] Story dock: xóa DailyBrief popup, CompanionCard auto-expand lần đầu/ngày
- [x] Emoji→lucide (🛂🤖💎), radius về token
- [x] Panel: hero scrim 2 lớp + type-display, Heartbeat gauge SVG
- [x] Passport: token --pp-* (.passport-theme), stamp animation khi check-in
- [x] Verify: build + test + screenshots 4 trạng thái trước/sau

## 027 — Adventure Premium UI Redesign (Left Sidebar)
- [ ] Add `.sidebar-theme` teal/gold tokens to index.css
- [ ] Extend useUIStore: sidebarCollapsed + mobile drawer state (persisted)
- [ ] navHelpers.ts — daily hero picker + focusDestination resolver
- [ ] SidebarHeader (logo + greeting)
- [ ] SidebarNav (8-item menu, collapse-aware)
- [ ] HeroBanner (daily image)
- [ ] HighlightsSection (Today's Highlights cards)
- [ ] AIRecommendation card
- [ ] HiddenGemSection
- [ ] FoodExplorerSection (fetch dishes)
- [ ] FestivalSection (this month)
- [ ] LeftSidebar shell (desktop rail + collapse + mobile drawer)
- [ ] Wire into App.tsx; remove CompanionCard; adjust TopBar/MobileTopBar
- [ ] typecheck + build + visual verify

### 027 Review (done 2026-07-06)
All items complete. New `src/components/sidebar/` (LeftSidebar + 8 sub-components + navHelpers).
Sidebar uses `.sidebar-theme` fixed teal/gold tokens (index.css). useUIStore gained
sidebarCollapsed(persisted)/sidebarMobileOpen. App renders <LeftSidebar/> instead of
<CompanionCard/> (CompanionCard.tsx now UNUSED — kept, not deleted). TopBar offset right of
sidebar + logo removed; MobileTopBar left button now opens the drawer.
Verified: desktop expanded/collapsed, dark theme, mobile drawer (screenshots). tsc + build pass.
Note: highlight/food/festival thumbnails using calendar-ids fall back to gradient (no manifest
photo) — clean per project rule; hero uses verified seeds so it always shows a real photo.

---

# 028 — Dọn sạch tiếng Việt rò ra sidebar khi đổi locale (i18n tổng thể) (2026-07-06)

Bug: chọn ko/ja/zh/en nhưng sidebar vẫn còn nhiều chuỗi VI (highlight state, hidden gem summary,
festival name/desc, AI rec đuôi câu). Debt 3 lớp, ánh xạ 2 hệ thống + mở rộng D1 cho living
(quyết định của user: đồng nhất kiến trúc, chấp nhận living subsystem chuyển sync→async).

## Workstream 1 — Scaffolding về dictionary (Lớp A) [system #1]
- [ ] 1.1 Thêm keys `src/lib/i18n/locales/*.ts` (5 locale): `brief.teaser.*`, `brief.heroIntro.*`, `hero.subtitle.<id>` (7).
- [ ] 1.2 `briefGenerator.ts`: xoá TEASERS/HERO_INTROS/DEST_NAMES → dùng `t()` + `t(\`province.${slug}\`)`; heroStory/teaser/highlights/hiddenGem qua t().
- [ ] 1.3 `navHelpers.ts`: xoá CALENDAR_NAMES + HERO_PLACES.subtitle VI-hardcode → resolve qua t().
- [ ] 1.4 check:i18n + typecheck xanh.

## Workstream 2 — Living-calendar CLIENT overlay (Lớp B) [đổi từ D1 → client overlay]
Lý do đổi: living data nhỏ, dev-author, đọc ĐỒNG BỘ trong hot path (computeHeartbeat/marker).
D1 sẽ thêm round-trip vào hot path + loading state → lùi performance & UX. Client overlay bundle
cùng chỗ với JSON gốc, giữ đồng bộ, đổi locale tức thì. Giữ nguyên ngữ nghĩa fallback VI như pickTranslation.
- [ ] 2.1 types.ts: SeasonalTranslation/FestivalTranslation/FlowerTranslation + *I18n wrappers (client-only, không đụng D1).
- [ ] 2.2 src/data/i18n/living/{seasonal,festival,flower}.<locale>.ts (4 locale) + index.ts aggregator (mirror food/index.ts).
      Key: seasonal/flower = `${month}:${destId}`, festival = `id`. Bundle client (KHÔNG seed D1).
- [ ] 2.3 Helper `resolveLiving` (src/lib/living/i18n.ts): (entry, locale) → field đã dịch, fallback VI. Ngữ nghĩa như pickTranslation.
- [ ] 2.4 Consumers GIỮ ĐỒNG BỘ, thêm tham số locale: navHelpers.seasonalHighlights, FestivalSection, briefGenerator, heartbeat.ts (seasonalState/festivalName/flowerName).
- [ ] 2.5 Dịch ~117 chuỗi × 4 locale (60 state + 20 festival + 37 flower) — subagent, index-aligned + fallback VI.
- [ ] KHÔNG: migration, worker route, api fetcher, async refactor, loading state.

## Workstream 3 — Sidebar dùng destination đã dịch (Lớp C) [system #2 có sẵn]
- [ ] 3.1 HiddenGemSection: bỏ authoring `gemOfTheDay()` → fetch `fetchDestination(id, locale)`; giữ vòng quay theo ngày, resolve nội dung qua API.
- [ ] 3.2 Kiểm tra 8 hidden-gem destination đã có bản dịch D1; bổ sung nếu thiếu.

## Verify / Done
- [ ] typecheck + check:i18n xanh.
- [ ] db:seed:build + db:setup chạy, seed có 3 bảng living; wrangler dev trả nội dung dịch theo ?locale=.
- [ ] Chạy app, đổi ko → chụp sidebar: không còn VI ngoài danh từ riêng địa danh.
- [ ] Cập nhật memory: vivel-i18n (living ở D1), vivel-sidebar (sections async).

## Review (2026-07-06) — HOÀN THÀNH
Sửa triệt để rò tiếng Việt ở sidebar khi đổi locale. 3 workstream:
- WS1: gộp 3 map VI hardcode (DEST_NAMES/CALENDAR_NAMES/HERO_PLACES.name+subtitle) thành 1 nguồn
  dictionary `place.<id>` (26) + `hero.subtitle.<id>` (7), dịch 5 locale. briefGenerator slim còn
  greeting+aiRecommendation, hết VI hardcode.
- WS2: living-calendar overlay CLIENT-SIDE (không D1 — lý do: hot path đồng bộ, xem memory vivel-i18n).
  src/data/i18n/living/{seasonal,flower,festival}.<locale>.ts (117 chuỗi ×4) + livingI18n.ts resolver.
  Consumers giữ đồng bộ, nhận locale. Panel HeartbeatSection localize display-time.
- WS3: HiddenGemSection fetch fetchDestination(id,locale) từ D1 (bản dịch đã có sẵn cho cả 8 gem).
- Xoá CompanionCard.tsx (unused) theo yêu cầu user.
Verify: tsc + check:i18n xanh, build pass. Chạy vite+wrangler, đổi ko → screenshot: toàn bộ sidebar
(greeting, hero, highlights+state, AI rec, festival, hidden gem, food) tiếng Hàn. Không còn VI ngoài
tên riêng đã chuyển tự. ("한(Hàn)강변" là chú thích phân biệt sông Hàn có chủ ý.)
Còn VI ngoài scope (panel-only, task khác): heartbeat SIGNAL_META labels + weatherLabel.

---

# 029 — Nâng cấp giao diện Mobile (2026-07-06)

Mục tiêu: mobile home đẹp & pro như mockup. Trọng tâm MÀU. Bỏ 2 card "Gợi ý". Bỏ nút "Lớp bản đồ".
Gom Ngôn ngữ + Light/Night vào Settings.

- [x] Màu: sea teal richer + land lush (index.css + regionPalette)
- [x] Glass tokens (teal-charcoal + gold) cho control nổi
- [x] MobileTopBar → search bar full-width + avatar (bỏ lang/theme rời)
- [x] WeatherWidget.tsx (mới) — glass card, Open-Meteo thật theo tỉnh
- [x] MapControls restyle glass (KHÔNG nút Lớp bản đồ)
- [x] BottomNav upgrade — active vàng, glass, chip bo tròn
- [x] Marker pill — chip medallion màu theo loại (MARKER_TINT, bridge=tím)
- [x] SettingsSheet.tsx (mới) + useUIStore.settingsOpen; wire sidebar Settings
- [x] i18n keys 5 locale + typecheck/check:i18n xanh
- [x] Visual verify light + dark + settings (screenshots)

## Review (2026-07-06)
Nâng cấp mobile home khớp mockup, tông glass teal-charcoal + gold thống nhất với sidebar/passport.
- Màu bản đồ: sea light xám nhạt → aqua teal (`--map-sea*`); dark moonlit teal; land palette lush hơn.
- Glass tokens `--glass-*` (index.css, cố định 2 theme) dùng cho weather/zoom/bottom-nav.
- MobileTopBar: search full-width + avatar (LoginButton); bỏ language/theme rời.
- WeatherWidget.tsx: card glass góc phải, dùng fetchCityWeather (Open-Meteo) theo destination/province, default Đà Nẵng.
- BottomNav: pill glass nổi, active = gold chip. MapControls: glass bo 2xl, active gold.
- Marker: medallion nền màu theo DestinationType (MARKER_TINT).
- SettingsSheet.tsx (bottom sheet mobile/dialog desktop): Appearance (Light/Dark) + Language;
  useUIStore.settingsOpen; mount trong Overlays; sidebar Settings mở sheet (thay toggleTheme placeholder).
- i18n: settings.* + weather.cond.* × 5 locale. tsc + check:i18n + build xanh.
Còn theo mockup nhưng CHƯA làm (user bỏ qua có chủ ý): 2 card "Gợi ý hôm nay" + "Gợi ý nhanh", nút "Lớp bản đồ".

---

## Sprint 031 — Korea atlas expansion + data verification (confirmed with user 2026-08-04)

**Decisions:** target ~180 destinations (77 → ~185, +108) · full 5 locales per batch (vi source + en/ko/ja/zh) · add `sourceUrl` + `verifiedAt` to `Destination` and ship a cross-check script covering old AND new entries.

**Why a refactor comes first:** `regions/gyeongnam.ts` (525) and `regions/sudogwon.ts` (505) already breach the 500-LOC rule; Seoul alone growing to 18 would push `sudogwon.ts` past 1,100. Content and i18n both move to per-province files.

### Phase 0 — Restructure (no content change)
- [x] Split `src/data/kr/regions/<region>.ts` → `<province>.ts` (17 files)
- [x] Split `src/data/kr/i18n/<region>.<locale>.ts` → `<province>.<locale>.ts` (68 files)
- [x] Rewire `src/data/kr/index.ts` + `src/data/kr/i18n/index.ts`
- [x] Prove parity: typecheck + `build-d1-seed` emits the same 77 destinations / 17 provinces

### Phase 1 — Verification infrastructure
- [x] `Destination.sourceUrl?` + `Destination.verifiedAt?` in `src/lib/types.ts` (+ D1 column, seed builder)
- [x] `scripts/verify-content.mjs`: Wikidata/Wikipedia cross-check of coords + official name, staleness flag on `ticket`/`openingHours`
- [x] Baseline report over the existing 77 → `tasks/verify-kr-report.md`

**Phase 0/1 outcome (2026-08-04):** 17 province modules + 68 i18n modules; largest file now 242 LOC (was 525). Seed output row-identical to the pre-split build. `npm run verify:kr` cross-checks against Wikipedia — the baseline pass found 5 coordinate errors: `guinsa` (7.2 km) and `hyangiram` (5.4 km) were genuinely wrong and are fixed; `daejeon-expo-park`, `may18-memorial-park`, `naejangsan` were mis-resolved articles, now pinned in `scripts/.verify-map.json`. 0 errors remain; 72 entries carry unverified `ticket`/`openingHours`.

### Phase 2 — Content batches (vi + en/ko/ja/zh + gallery seeds per batch)
Targets — Seoul 6→18 · Busan 6→14 · Gyeonggi 4→14 · Gangwon 6→14 · Jeju 6→14 · Gyeongbuk 7→15 · Gyeongnam 5→12 · Jeonnam 5→12 · Incheon 4→10 · Jeonbuk 4→10 · Chungnam 4→10 · Chungbuk 4→10 · Daegu 4→9 · Ulsan 4→8 · Daejeon 3→7 · Gwangju 3→7 · Sejong 2→5
- [x] 2a Sudogwon (Seoul, Incheon, Gyeonggi) — +28
- [x] 2b Gyeongnam region (Busan, Gyeongnam, Ulsan) — +19
- [x] 2c Gangwon + Jeju — +16
- [x] 2d Gyeongbuk (Gyeongbuk, Daegu) — +13
- [x] 2e Honam (Jeonnam, Jeonbuk, Gwangju) — +17
- [x] 2f Chungcheong (Chungnam, Chungbuk, Daejeon, Sejong) — +18

### Phase 3 — Photos & ship
- [x] `npm run images:fetch -- kr` for the new seeds; visual audit; curate corrections
- [x] `npm run data:build` + `build-d1-seed` + sitemap; verify:kr over the full set
- [x] Build + smoke-test a few `/kr/...` deep links

### Review — completed 2026-08-04

**Delivered.** KR atlas 77 → **189 destinations**, every one in all five locales (vi source +
en/ko/ja/zh), 0 gaps. 183/190 gallery seeds carry a real photo; 46/46 dishes carry a real photo.
`tsc`, `check:i18n`, `check:content`, `vitest` (18), `db:seed:build`, `seo:build` (387 URLs) and
`npm run build` all pass; `/kr/...` deep links verified against a local worker in all five locales.

**Structure.** 17 per-province content modules, four of which needed a second module to stay
under 500 LOC (`seoul-modern`, `gyeonggi-north`, `gyeongju`). 68 per-province i18n modules.
Seed output was proved row-identical to the pre-split build before any content was added.

**What the guards actually caught.**
- `scripts/check-content-locales.mjs` (new): 8 real defects of mine — Cyrillic and stray English
  words inside Chinese/Japanese copy. All 8 would have shipped into D1 without it.
- `scripts/verify-content.mjs` (new): 5 coordinate errors in the original 77 (2 real: `guinsa`
  7.2km, `hyangiram` 5.4km) and 6 more in the new content (3 real: `petite-france`,
  `seosan-maae-buddha`, `namhae-german-village`). All fixed; report now shows 0 errors.
- Image audit: 16 destinations had the wrong photo, mostly because Commons geosearch returns
  whatever is geotagged nearby — a cat for Yongmunsa, a shipyard for the whale museum, a
  shopping street for the Independence Hall.

**Pipeline bugs found and fixed.** Neither `curate-images.mjs` nor `fetch-dish-images.mjs` backed
off on HTTP 429, so a long run failed 30/43 downloads and silently left the wrong images in
place. Both now retry with exponential backoff. `fetch-dish-images.mjs` also gained KR atlas
support and a name-variant fallback ("Suwon Galbi" → "Galbi"), guarded by a stoplist so it never
degrades to a bare English noun ("Busan Fish Cake" → "Cake" would have fetched a birthday cake).

**Known gaps, deliberately left.**
- 7 destinations show the illustrated placeholder because no correct Commons photo was found:
  `ganghwa-peace-observatory`, `mancheonha-skywalk`, `jangtaesan-metasequoia`, `daejeon-skyroad`,
  `bimatgil-geumgang`, `gurye-sansuyu`, `jangsaengpo-whale-village`. A plausible-looking wrong
  photo is worse than none.
- The name-token guard in `fetch-images.mjs` still does not gate the geosearch path. That is the
  root cause of the wrong photos and is worth closing before the next bulk run.

### Phase 4 — `ticket` / `openingHours` verified against sources (finished 2026-08-05)

All 189 destinations now carry `sourceUrl` + `verifiedAt`; `verify:kr` reports **0 never-verified**
and **0 coordinate errors**. Two tiers of evidence, and the difference matters:

- **148 checked individually** against an operator or government page (VisitKorea, city/county
  tourism sites, park and museum operators). These are the entries that state a price or a clock
  time.
- **41 checked as a class** — unfenced open-air public space, no gate and no ticket (beaches,
  riverside parks, capes, mural villages, coastal walks). Their `sourceUrl` is the KTO portal, not
  a per-site page. Treat their stamp as weaker evidence than the first tier.

**Roughly 60% of the individually checked entries were wrong.** Three causes, in order of how
badly they'd have misled a reader:

1. *Policy changed after my knowledge cutoff.* From 2023-05-04 Korea's revised Cultural Heritage
   Protection Act abolished admission at 65 Jogye Order temples holding **nationally** designated
   heritage. 16 entries charged money for something free for three years. The rule has a real edge:
   Maisan's Tapsa holds only *provincial* heritage, so it still charges 3,000 KRW — the abolition
   is not "temples are free now".
2. *Prices drifted.* Nami Island 16,000 → **19,000** (up 3,000 in one year), Ulleungdo ferry
   ~130,000 → **160,000–180,000** return, Muju gondola 18,000 → **25,000**, Gwangmyeong/Gosu/
   Mancheonha each off by 1,000–2,000.
3. *False precision.* I had written single clock ranges for places that run on seasons, tides or
   sunlight. Hahoe opens sunrise-to-sunset, not 09:00–18:00. Where sources genuinely disagree
   (Boseong, Everland, Chungju ferry) the field now carries a range plus the reason it varies,
   rather than a confident wrong number.

**Facts a reader would have been burned by, now in the data:** Bukchon-ro 11-gil is closed to
tourists outside 10:00–17:00 with a 100,000 KRW fine, enforced from 2026-01-01. Manjanggul only
reopened 2026-05-30 after repairs. Jangtaesan's Skytower is shut for safety inspection. Daegu's
missionary houses are closed for conversion. The Sejong rooftop garden runs only two seasonal
windows a year, not year-round. Gwangjang's food alley is the part open every day — I had it
backwards. Hallasan's summit trails need advance booking.

**Tooling.** `scripts/apply-verified.mjs` applies a batch from `scripts/.verified-kr.json` across
the Vietnamese source and all four locale files plus provenance in one pass, mapping overflow
modules back to their province's i18n file. Re-run it for future corrections rather than editing
five files by hand.

**Still open.** 93 advisory warnings in `tasks/verify-kr-report.md`, all from the Wikipedia
cross-check rather than from the data: 76 are "no article resolved" (Korean sites Wikipedia has no
English page for), 17 are sub-5km coordinate drift on area features (a river, a market district),
12 are numbers in `facts` the matched article does not mention. None is a known defect.

---

# 031 — Photo medallions on map markers ✅

Markers now carry the destination's own photo instead of a generic type icon.

- `scripts/build-thumbs.mjs` (`npm run images:thumbs`) — 96px square `attention` crops of every
  seed in image-manifest → `public/img/thumb/<seed>.webp`. 498 thumbs, **921 KB total, avg 1.8 KB**.
  Committed like the source photos (unlike ambient clips), so the map never depends on a build step.
  A thumb exists iff a photo does, so the path is derived by convention — no second manifest; the
  script exits non-zero if that parity ever breaks.
- `src/lib/media/thumbs.ts` — `thumbSrc(seed)`.
- `src/components/map/PhotoMedallion.tsx` — icon paints first, photo crossfades over it on load.
  Falls back to the icon on 404/decode error and for seeds with no photo (11 of 304 destinations).
  `MARKER_TINT` moved here from MapEngine (its only consumer); MapEngine 748 → 720 LOC.

**Why a derivative and not the hero file:** sources are 1280px / ~180 KB and the medallion paints
them at 20–28px, with dozens on screen. Reusing them would cost several MB of decode for thumbnails.

Verified: typecheck clean, screenshot at Ha Long Bay shows photos in every marker, no console errors.

**Not done (deliberate):** the "selected marker expands into a living video card" idea (proposal 2)
is still blocked on the design call in docs/030 §224 — whether a card duplicating the panel hero
right next to it is worth it.

---

# 030 — Ambient motion for hero photos (Living Atlas)

Spec: `docs/030.md`. Spike & measurements: `tasks/030-spike-ambient-video.md`.

Hero photos now move, under a hard rule: **motion is never on the critical path and never an LCP
candidate**. Strip the layer away and the product is exactly what it was.

Two tiers, split by **where the motion lives**:

## Tier 2 — frame movement, CSS, every photo

- `.ken-burns-settle` in `src/index.css` — `scale(1.18) → scale(1)` over 6s, `forwards`, once.
- `IllustratedImage` gains `ambient` (opt-in; only the destination hero uses it today). The class
  is applied after `onLoad`, so the move never runs behind a blank frame.
- Reduced-motion needs no special case: the base layer collapses animation duration to 0.01ms and
  `forwards` holds the resting transform.
- **Zero bytes, zero build step, zero manifest.**

## Tier 1 — motion inside the scene, real footage, ~10–15 places

- `src/lib/media/videoBudget.ts` — decode-slot registry (2 desktop / 1 mobile), granted by
  distance from screen centre; the global gates (reduced-motion, save-data, link quality); and the
  `?novideo=1` A/B kill switch.
- `src/components/ui/AmbientVideo.tsx` — the gated layer. The `<video>` is not created until the
  poster has painted, the browser is idle, and the surface is 50% on screen. Fades in on `playing`
  (not `canplay`, which shows a black frame first). **Plays once, fades out over 500ms, unmounts**
  — the last frame is the poster, so nothing changes on screen while the decode slot and the
  decoded frames go back. `?videodebug=1` paints a state badge.
- `scripts/add-video.mjs` (`npm run video:add`) — conforms a source clip to the budget and
  registers it with **mandatory** provenance. A registered seed plays footage instead of running
  the CSS move; no code change, no deletion. Clips live in `public/video/curated/` and **are
  committed** — unlike anything generated, they cannot be rebuilt.
- Currently **0 tier-1 clips**: none have been sourced yet.

## Verification

- `scripts/verify-motion.mjs` — detects which mechanism is live and proves it actually moves by
  diffing pixels. Necessary because no perf metric can tell a moving clip from a frozen one: an
  early build shipped a still image wrapped in a video codec and every measurement looked healthy.
- `scripts/perf-video.mjs` — A/B on one build via the kill switch.

**Measured:** LCP 524 vs 548 ms (no video bytes fetched at all now), FPS 60.0 vs 60.0, 0/103 long
frames. `verify-motion.mjs` on Ha Long and Sa Pa: moves (pixel diff 8.0 / 13.1), settles to
`matrix(1, 0, 0, 1, 0, 0)`.

## What was built, measured, and then deleted

The first implementation generated a Ken Burns **video** per destination with ffmpeg: 92 clips,
42 MB, a build script, a budget guardrail, a manifest, a CI step with an ffmpeg install and a
content-hashed cache. It worked and it passed every threshold.

It was all replaced by one CSS keyframe, which is better on every axis: 0 bytes instead of 42 MB,
the full-resolution webp instead of an 800px re-encode, 100% of seeds instead of 92/102 (10 photos
were too detailed to fit the byte budget), and no infrastructure at all. Every trap the video
version needed solving — the `zoompan` aspect squash, the sharpness pop on handover, the decode-
slot budget — simply does not exist when the thing being moved *is* the image.

Deleted: `scripts/build-video.mjs`, `scripts/check-video.mjs`, `scripts/perf-duration.mjs`, the
`video:build` / `check:video` npm scripts, the ffmpeg + cache steps in `.github/workflows/deploy.yml`
and `scripts/deploy.sh`, and 42 MB of clips. Kept: everything in tier 1, which is still the only
way to make something move inside a photo.

**Deliberately not done:** living map medallions (docs/030 §10 — passes perf, but motion is
imperceptible at 28 px; a design call), Story Reels, soundscape.

---

# 032 — SEO + AI discoverability (2026-08-05)

Chẩn đoán trên site live `go.fechtin.com`: meta SSR ở edge đã đúng, nhưng (a) sitemap +
robots trỏ về `vietnam-atlas.pages.dev` — domain đã chết, nên Google bỏ qua toàn bộ 388 URL;
(b) không trang nào có canonical; (c) `<body>` chỉ có `<div id="root">` rỗng nên crawler
không chạy JS (gần như mọi bot của LLM) thấy trang trắng; (d) Cloudflare Managed robots.txt
đang chặn GPTBot / ClaudeBot / Google-Extended / CCBot ở tầng edge.

- [x] `scripts/build-sitemap.mjs` — `SITE_URL` default → `https://go.fechtin.com`
- [x] robots.txt sinh ra mở cho AI bots (Content-Signal + Allow từng bot Cloudflare chặn)
- [x] Sinh lại `public/sitemap.xml` (390 URL) + `public/robots.txt`
- [x] `worker/db.ts` — `getProvinceIndex()` cho trang landing `/vn`, `/kr`
- [x] `worker/seo-body.ts` (mới) — nội dung crawler đọc được, inject vào `#root`
- [x] `worker/meta.ts` — canonical, og:locale, meta cho `/` và `/{cc}`, inject body
- [x] Typecheck + test + verify bằng wrangler dev

## Ngoài repo — cần user làm trên Cloudflare dashboard

- [ ] AI Crawl Control → tắt block cho GPTBot / ClaudeBot / Google-Extended / CCBot
- [ ] Google Search Console: thêm property `go.fechtin.com`, submit sitemap

## Đa quốc gia — meta không còn hardcode "Việt Nam"

`src/lib/country/names.ts` là nguồn duy nhất cho tên quốc gia, tách khỏi `country/index.ts`
để Worker và vite.config đọc được mà không kéo theo 2 blob geo-meta. Thêm quốc gia mới =
một dòng ở đây + một entry trong registry; homepage title/description/link, SEO body và
JSON-LD tự theo.

- [x] `names.ts` + `COUNTRIES.label` trỏ vào nó
- [x] Plugin `homepage-seo` trong vite.config bake title/description/link cho `/`
- [x] `useDocumentMeta` dùng `t("seo.description", {country})` + `addressCountry` theo atlas
- [x] `scripts/site.ts` — canonical origin dùng chung cho sitemap và vite

## Không làm (có lý do)

- **hreflang**: locale không nằm trong URL (`useUrlSync` chỉ mã hoá country/province/
  destination; ngôn ngữ ở store + localStorage). hreflang cần URL riêng cho từng locale —
  đó là thay đổi kiến trúc routing, task riêng.
- **`run_worker_first`**: đã thử để ép `/` qua Worker, phải bỏ. Liệt kê route ở đó ĐẢO
  mặc định cho mọi route còn lại, và với `not_found_handling = single-page-application`
  thì `/api/*` lẫn `/vn/*` đều bị SPA shell nuốt — API trả về HTML. Homepage vì vậy được
  bake tĩnh trong index.html.

## Review (2026-08-05)

Verify trên `wrangler dev` với bản build thật: `/`, `/vn`, `/kr`, `/kr/seoul`,
`/vn/quang-nam/hoi-an-ancient-town`, `/vn?dish=pho-bo` — mỗi trang đúng **một** canonical
khớp URL, một og:url, JSON-LD đúng type, body 164–2969 ký tự với 2–64 link nội bộ. Đường đi
của crawler giờ liền mạch: `/` → `/{cc}` → tỉnh → địa điểm. `/vn/khong-ton-tai` không bị
canonical hoá. `/api/v1/*` vẫn trả JSON, asset tĩnh vẫn bypass Worker.

Screenshot VN + KR + homepage: app boot bình thường, fallback bị React xoá sạch, không lỗi
console. tsc, check:i18n, check:content, vitest (26) đều xanh.

**Hai lỗi tự gây ra rồi tự bắt được, đáng ghi lại:**
1. `run_worker_first = ["/"]` làm mọi route API trả về SPA shell (xem mục trên).
2. Worker `append` canonical trong khi index.html đã có sẵn một cái → 2 canonical/trang,
   Google bỏ cả hai. Giờ Worker `setAttribute` để ghi đè, không append. Cùng cách với og:url.
