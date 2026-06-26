# Vietnam Interactive Tourism Atlas

A **living interactive map** to explore Vietnam — not a travel website. The whole product is one map: zoom into regions and provinces, open destination stories, ask an AI guide, check in, and build a personal travel passport.

Built to the spec in [`docs/`](./docs) (the Project Bible).

## Stack

- **Frontend:** Vite + React 19 + TypeScript + Tailwind v4 + [Motion](https://motion.dev)
- **Map:** custom SVG engine — d3-geo projection + a spring camera (pan / zoom / pinch / fly-to). No tile server.
- **Backend:** Cloudflare Worker (Hono) serving `/api/v1` + static assets
- **Data:** self-sourced GeoJSON (63 provinces, 8 regions) simplified to ~115 KB; seed content for iconic destinations
- **AI:** provider abstraction with a grounded **mock** guide (swap in Cloudflare AI / OpenAI / Gemini without touching callers)
- **State:** Zustand · **i18n:** VI (source) + EN, translation-key based

## Run

```bash
npm install
npm run data:build      # regenerate map data from the registry (optional; output is committed)
npm run dev             # Vite dev server  →  http://localhost:5173
```

Full stack (SPA served by the Worker + live API):

```bash
npm run build           # build the SPA into dist/
npx wrangler dev        # http://localhost:8787  (serves SPA + /api/v1/*)
```

> Note: the React app reads the seed data directly, so `npm run dev` works without the Worker.
> The Worker is the production API design (same data, with caching + response envelope).

## API (Worker)

`GET /api/v1/health` · `/regions` · `/provinces` · `/province/:slug` · `/destination/:id` · `/search?q=`
`POST /api/v1/ai/chat` · `/ai/summary` · `/ai/caption` (chat/summary stream).

## Map data pipeline

`data/geo/raw-provinces.geojson` (source) → mapshaper simplify (`rfc7946`) → `data/registry/vn.mjs`
(province → region + slug map) → `scripts/build-map.mjs` → `public/geo/vn-provinces.json`
(geometry, rings rewound clockwise for d3-geo) + `src/data/generated/geo-meta.json`.

Source data: [nguyenduy1133/Free-GIS-Data](https://github.com/nguyenduy1133/Free-GIS-Data) (free for public use, attribution requested).

## Project layout

```
src/
  components/   map · panel · search · ai · checkin · passport · share · shell · ui
  lib/          map (projection, camera) · store (zustand) · api (content, search) · ai · i18n · share
  data/         destinations, provinceContent, generated geo-meta
worker/         Hono API (/api/v1) + SPA fallback
data/           geo source + registry; scripts/build-map.mjs
docs/           Project Bible (000–019)
```

## Status

MVP scope is in place end-to-end: interactive map, province/destination panels (progressive
disclosure), search (alias + diacritic-tolerant), AI guide (streaming mock), check-in (3 steps),
passport + shareable card, light/dark, mobile + desktop, URL sync. AI uses a mock provider; real
photos use unified illustrated placeholders (ready to swap for R2 assets).
