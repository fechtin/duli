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
