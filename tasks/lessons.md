# Lessons & Patterns

## User corrections
- **Photos must match the named place, not just pass a search.** The first image pipeline trusted
  the top Wikipedia/Commons text-search result blindly → ~38% of 296 images were flat wrong
  (Golden Gate SF for Cầu Vàng, Chinatown LA for a Bình Dương temple, maps/logos/manuscripts/
  insect specimens, foreign places sharing a name). Root-cause fix: select by **Commons geosearch
  on the destination lat/lng** (geotagged = actually taken there), validate text/wiki candidates
  against name tokens, reject non-photos (JUNK + BIO regex on title+categories, mime jpeg/png,
  width≥700, down-rank portraits = signs/docs), dedupe globally, and **record provenance**
  (sourceTitle/sourceUrl/via) in the manifest. When no valid candidate exists, **leave the seed
  blank** so the illustrated SVG fallback shows — never display a known-wrong image.

## Patterns established
- **d3-geo winding:** spherical geoPath wants CLOCKWISE exterior rings (opposite of RFC 7946).
  Symptom of getting it wrong: every feature's path fills the whole globe (`geoArea` ≈ 4π).
  Fix once in the data build by reversing rings; verify with `geoArea(feature)` being tiny.
- **Map framing:** fit the projection to a `MultiPoint` of the bbox corners, not a Polygon —
  a lon/lat polygon frame is winding-sensitive and d3 may read it as the entire sphere.
- **Zustand v5 selectors must be stable:** never return a freshly-built array/object from a
  selector (e.g. `useStore(s => s.derive())`) — it triggers an infinite render loop. Select raw
  state and derive with `useMemo`.
- **Cloudflare Worker + `@/` alias:** wrangler/esbuild does not resolve the `@/` path alias for
  subpaths. Files shared with the Worker use relative imports for runtime deps (type-only `@/`
  imports are fine — esbuild drops them).
- **Always visually verify a visual product.** Typecheck + build + API tests all passed while the
  map was completely broken on screen. A headless screenshot (system Chrome via playwright-core)
  caught it.
- **Node TS imports need explicit `.ts`** when running `node --experimental-strip-types` on a file
  that imports other local TS (extensionless fails); tsconfig `allowImportingTsExtensions` lets
  tsc + Vite accept them too.
- **Local D1 is keyed by `database_id`:** changing `database_id` in wrangler.toml (e.g. when
  `deploy.sh` pins the real remote id) points `wrangler dev` at a *different, empty* local D1 →
  `no such table`. Re-run `npm run db:setup` after the id changes.
- **Wikimedia Commons throttles bursts:** concurrency 2 + 250ms delay + retry/backoff + `maxlag`,
  and make the fetch **resumable** (preload existing manifest, skip fully-covered places). Running
  it a few times converges coverage; ~79/115 had photos, the rest fall back to illustrations.
- **Map perf with richer visuals:** keep 60fps by (1) viewport-culling markers/labels via an
  rAF-throttled camera subscription (`cam.x/y/scale.on("change")`), (2) memoizing the static
  province SVG layer so camera-driven re-renders skip it (stable `useCallback` handlers), (3)
  avoiding per-frame SVG blur filters — use a crisp offset silhouette for the "raised island"
  shadow. Measured ~16.7ms/frame (60fps) under continuous zoom with 115 destinations.
- **Cloudflare deploy gotchas:** (1) the API token needs **D1 Edit** in addition to Workers, else
  `d1 create/list` → error 10000. (2) First Worker deploy fails if the account has no `workers.dev`
  subdomain; register it via `PUT /accounts/{id}/workers/subdomain {"subdomain":"name"}` then
  re-deploy. (3) Local D1 dev: `wrangler d1 migrations apply <db> --local` + `d1 execute --local
  --file=db/seed.sql`; client now fetches from the API so `wrangler dev` must run with Vite.
