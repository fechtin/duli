# Lessons & Patterns

## User corrections
- (none yet)

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
- **Cloudflare deploy gotchas:** (1) the API token needs **D1 Edit** in addition to Workers, else
  `d1 create/list` → error 10000. (2) First Worker deploy fails if the account has no `workers.dev`
  subdomain; register it via `PUT /accounts/{id}/workers/subdomain {"subdomain":"name"}` then
  re-deploy. (3) Local D1 dev: `wrangler d1 migrations apply <db> --local` + `d1 execute --local
  --file=db/seed.sql`; client now fetches from the API so `wrangler dev` must run with Vite.
