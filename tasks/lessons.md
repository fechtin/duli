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
- **A frozen video passes every perf test.** `zoompan` with `d=1` does not accumulate zoom — the
  first ambient master was a still image wrapped in a video codec. Decode really happened, so LCP,
  FPS and byte counts were all valid and all meaningless. Correct idiom: one input frame,
  `d=<total frames>`, ramp on `on` (`z='1+0.34*on/89':d=90`). Verify by seeking the element to
  fixed `currentTime` marks and diffing frames (`scripts/verify-motion.mjs`) — wall-clock
  screenshots are useless because a palindrome loop revisits similar zoom levels by chance.
- **Query-param feature flags must be read at module load.** `useUrlSync` rebuilds the path from
  selection state and drops unknown params, so a flag read at render time is already gone. This
  bit twice: the first `?novideo=1` A/B silently measured video-on in both arms.
- **Ambient video: duration costs bandwidth, not speed.** 8s vs 32s changed nothing in LCP,
  time-to-first-frame or FPS — but the whole file is fetched within the first loop either way
  (a loop has no "abandon halfway"), so duration is a 1:1 multiplier on every viewer's data.
  Keep ambient clips at 4–6s; longer belongs to a click-to-play surface.
- **Codec ranking flips with content.** Static-ish frames: H.264 beat AV1 (242 vs 327 KB). Real
  motion: VP9 beat H.264 (639 vs 696 KB). Encode both and ship the smaller; never assume.
- **Never quote a perf number without a same-scenario baseline.** A drag at overview zoom measured
  29 FPS with video and looked damning — the no-video arm measured 28.7.
- **`zoompan`'s `s=` scales non-uniformly.** (Still relevant for curated footage.) Feeding it a 1.43 photo and asking for 4:3 squashes
  the frame horizontally. Centre-crop to the target aspect BEFORE zoompan, or a clip that settles
  back onto an `object-cover` still lands visibly off (measured pixel diff 12.19 → 6.61).
- **A compressed video frame is softer than the webp behind it.** Even with pixel-perfect
  geometry, swapping video → still reads as a faint "sharpen" pop. A 500ms fade-out hides it
  completely (6.61 → 0.09). Diagnose the difference by rendering an amplified diff map: uniform
  noise = compression, ghosted edges = misalignment.
- **A self-unmounting element races any test that waits a fixed few seconds.** The play-once
  ambient clip removes itself when it ends, so `waitForTimeout(4000)` then `querySelector("video")`
  intermittently found nothing. Poll for the element and pause it the instant it appears.
- **Generated assets that are gitignored need a step in the REAL deploy path.** Ambient clips were
  excluded from git and rendered by `scripts/deploy.sh` — but deploys actually run through the
  GitHub Action, which knew nothing about them. Production would have shipped zero video with no
  error anywhere. (That pipeline was later deleted, but the rule stands for any generated asset.)
- **Ask what the motion actually is before reaching for a heavier medium.** A whole ffmpeg
  pipeline — 92 clips, 42 MB, build script, guardrail, CI step, cache — was built to pan and zoom
  across still photos. `transform: scale()` does exactly that with zero bytes, at full source
  resolution, for 100% of seeds instead of 90%, and none of the handover bugs exist because the
  thing being moved *is* the image. Video earns its cost only when something moves INSIDE the
  frame. The measurement discipline was still worth it; the medium was not.
