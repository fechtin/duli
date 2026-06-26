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
