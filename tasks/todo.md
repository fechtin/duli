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
