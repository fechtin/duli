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
