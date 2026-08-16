# 038b / Trip Planner — Slice 1 (engine + UI + map)

Plan: `~/.claude/plans/swift-petting-pretzel.md`. Spec: `docs/031.md` (re-scoped — see plan Context).

**Parallel session warning.** Task 038 (another session) is sourcing 29 city POIs for
`da-nang`/`quang-nam` and has uncommitted edits in `src/lib/types.ts`,
`src/components/map/{PhotoMedallion,landmarks,markerIcons}.tsx`, `src/lib/i18n/tags/*`.
→ Engine config must be ready for the 5 new venue types; `src/lib/types.ts` edits go LAST.

## A. Engine — `src/lib/itinerary/` (pure, relative imports only)
- [x] `types.ts` — TripInput / TripPlan / PlaceRow / VisitSpec / OpenSpec / ThemeKey
- [x] `config.ts` — weights, pace budgets, radius ladder, per-type profiles (incl. 038 types)
- [x] `duration.ts` — parseVisitDuration, total over the 34-value vocabulary
- [x] `hours.ts` — parseOpeningHours, total classifier (interval | always | unknown)
- [x] `travel.ts` — TravelTimeProvider + haversine×terrain default
- [x] `candidates.ts` — radius ladder → interest filter → score
- [x] `cluster.ts` — overnight bases
- [x] `route.ts` — base sequencing (NN + 2-opt)
- [x] `schedule.ts` — day allocation, ordering, clock, buffers
- [x] `meals.ts` — restaurant slots, 3-tier degradation
- [x] `theme.ts` — ThemeKey + params, never prose
- [x] `plan.ts` — orchestrator

### A2. Calibration against real itineraries (added on user instruction)
- [x] Researched real Đà Nẵng 5N/3N + Hà Giang 4N itineraries; extracted structured signals only
- [x] `DAY_TRIP_KM` — one constant reproduces both "stay put" (Đà Nẵng) and "move nightly" (Hà Giang)
- [x] `maxOutboundMinutes` vs `maxLegMinutes` split — stops the Mỹ Sơn↔Huế same-day pairing
- [x] Co-located full-day dedupe — Cầu Vàng / Bà Nà Hills were landing on different days
- [x] Per-day retry when every pick is blocked by opening hours (Cù Lao Chàm closed 16:00)
- [ ] Evening slot (038 `nightlife` type) — real itineraries schedule Cầu Rồng / chợ đêm after 19:00
- [ ] Lighter arrival/departure days — real itineraries do; needs an arrival-mode input first

### A3. Mined patterns + presets (docs/031.md §Phase 8)
- [x] `src/data/itinerary-patterns.ts` — 7 co-occurrence groups from 6 published itineraries,
      Đà Nẵng + Quảng Nam only (the sole provinces dense enough for pattern ids to resolve),
      every claim carrying source URLs + verifiedAt. Signals only, never copied structure.
- [x] `patternBonus` + pattern-seeded days — a bonus alone did nothing; the grouping has to claim
      the day before the greedy fill spends the budget
- [x] `PATTERN_SEED_MIN_CONFIDENCE` — a grouping seen once colours a day, one seen 3× decides it
- [x] `TripInput.pinned` + ladder widens until every pin is reachable (Hội An is cross-province)
- [x] `src/data/trip-presets.ts` — 4 Đà Nẵng presets, stored as engine INPUTS not day plans
- [x] `trip.preset.*` × 5 locales, `check:i18n` green
- [x] `CROSS_PROVINCE_LEG_MINUTES = 35` — measured: attested Ngũ Hành Sơn→Hội An is 25 min, the
      bad Sơn Trà→Chùa Cầu hop is 45. Enforced in `layOutDay` too, because `sequence()` re-orders
      the day and a pair never adjacent at pick time can be adjacent when driven (caught a 59-min
      hop in a Hà Nội day).

## B. Worker
- [x] `worker/db.ts` — getItineraryPlaces + getProvinceNodes + getRestaurantsByProvinces (base
      columns only, never toDestination)
- [x] `worker/index.ts` — GET /api/v1/trip/plan, canonicalised query, TTL 3600, verified by curl

## C. Client state + URL
- [x] `src/lib/api/trip.ts` (+ round-trip test), `src/lib/store/useTripStore.ts`
- [x] `useUrlSync` — ?trip=, depth half-rung, URLSearchParams write-back; verified in a browser
- [x] switchCountry closes the trip

## D. UI — `src/components/trip/`
- [x] TripPanel / TripForm / TripResult / DayTimeline / primitives
- [ ] TripPeekBar — mobile sheet still scrims the map; the peek/expand state is the map/list toggle
- [x] PanelContainer branch (lowest priority) + ProvincePanel CTA
- [x] Opening a trip clears the map selection, or its panel never surfaces (found by screenshot)

## E. Map
- [x] `src/lib/map/tripPalette.ts`, `src/lib/trip/routeGeometry.ts` (bow chain, not Catmull-Rom)
- [x] TripRouteLayer + numbered Labels; trip stops suppress their ordinary marker
- [x] FocusTarget "bounds" with degenerate-box inflation

## F. i18n
- [x] 55 `trip.*` keys × 5 locales, check:i18n green

## G. Verify
- [x] purity / coverage / duration / plan tests (94 engine tests; mutation-checked)
- [x] npm test (186) + check:i18n + typecheck — all green
- [x] worker:dev curl (4 validation cases), screenshots desktop light+dark and phone — caught the
      blank hero (photos key on gallery seed, not destination id) and the panel-precedence bug

### A4. Map legibility (added after user review of the running app)
- [x] Layer filter — 7 groups DERIVED from the engine's `TYPE_PROFILE`, never a second taxonomy;
      hidden-set persisted; trip stops exempt; gold dot when a filter is left on
- [x] Max zoom 18× → 400× — measured: 1 km spanned 9.5 px, so 8 downtown places shared 14 px
- [x] `CITY_DETAIL_RATIO` (zoomLevel 5) — stop drawing coastal relief the geometry cannot support
- [x] Route stroke counter-scaled by 1/k (`vectorEffect` cannot beat a CSS transform)
- [x] Whole-route view shows medallions only; names only on a selected day
- [x] Off-route markers keep the medallion, lose the name, while a trip is open
- [x] Map chrome stops propagating pointer events into the map's pan gesture
- [x] AI guide grounds on the trip's origin province (opening a trip clears the map selection)
- [x] `startOf()` — earliest-closing stop leads the day; geography alone was dropping a pinned
      Sơn Trà (4 h visit, shuts 18:00, so it must start by 14:00)

### A5. Whole-atlas audit (`npm run sweep:trips`)
- [x] Sweep harness: 720 itineraries (every province × {3,5,7}d × 3 style/pace), hard invariants
      exit non-zero, quality counters printed
- [x] `plan.provinces` = stops ∪ nights (was stops only, so the night province was often missing)
- [x] Unused days carry to the next base (one bad morning cost Bình Phước 6 of its 7 days)
- [x] `fitVisit()` clamps a visit to the opening window — three national parks were unschedulable
      in every possible trip because "1 ngày" was read as 480 unbroken minutes
- [x] `LATEST_HOME_MIN` — a day must get you home; not applied to the day's only stop
- [x] `MIN_DAY_VISIT_MIN` + pace floor — refuse to pad a trip with a threadbare day; day 1 exempt
      so the origin is never ejected
- [x] Result: 0 hard-invariant failures, 90% of requested days delivered, 1.89 stops/day
- [ ] Known limits the sweep still reports, both needing the evening slot: 68 single-2h-stop days
      in sparse areas, 17 days that are just a night market opening at 17:00

### A6. Stop numbering `day.order` (added after user review of the whole-route view)
- [x] Badges read `1.1 … 3.2`, not a bare `1`. Day colour is a lookup, not an answer, and it is no
      answer at all to a red-green colour-blind reader. Costs ~8px of badge width in the densest
      part of the map; taken deliberately
- [x] One `StopLabel`, imported by both the map badge and `RailNode` — the number is the stop's
      NAME, so the two surfaces must not be free to spell it differently
- [x] Label is stable across views. Rejected the cheaper "prefix only in whole-route view": a name
      that changes when you switch tabs cannot be pointed at, shared, or screenshotted
- [x] `tripDayColor().ink` — dark mode was `text-white` on the BRIGHT dark column (`#ffffff` on
      `#4ee0ac` = 1.4:1). Pre-existing, invisible in light-mode screenshots, and load-bearing the
      moment the badge carried two digits. Now 8–12:1 on all seven hues

---

# 039 — Tour-stop mining, 9 hubs

Spec + mined evidence: `tasks/039-tour-stops.md`. Extends §Phase 8 signal from 2 provinces to 11.

- [x] **A. Mine** — 19 published itineraries across 9 hubs, same-day groups only. klook/vinwonders
      403 to WebFetch and are cited nowhere; a search summary is not a source.
- [x] **B. Patterns** — 7 → 32 groups. `itinerary-patterns.ts` split into an aggregator (41 lines)
      over `patterns/{types,central,north,south}.ts`; import path unchanged for `worker/index.ts`
      and the tests. Fixed two comments 038 had made false (SCOPE block; "61 of 63" → 52 of 63).
- [x] **B. verified** — 197 tests, typecheck, check:i18n/content/provinces, `sweep:trips` 720 runs
      with every hard invariant holding. Measured effect over 3/5/7-day trips in all 9 hubs:
      mined pairs landing on one day **22.2% → 38.9%**; mined places reaching the trip 85.2% → 87.8%.
- [x] **C. Coordinates** — 35 candidates over two runs → **16 kept, 19 dropped**. Province centroid
      is the wrong referee for islands (every Phú Quốc row is ~110-135 km from it), so everything was
      re-measured against a same-cluster atlas row: cleared 2 false alarms, caught 5 confidently
      wrong matches (Đầm Vân **Trì** for Vân Long, a Hóc Môn pagoda for the Chợ Lớn one, a seafood
      restaurant for a fishing village). Quảng Ninh and Lào Cai gained no rows — all their candidates
      failed to resolve.
- [x] **D. Author** — 16 rows in `regions/tours/{hanoi,hcm,daLat,phuQuoc,central}.ts` + 12 locale
      files in `i18n/content/tours/`. Atlas 327 → **343**. `check:i18n` caught an invented `wildlife`
      tag before it shipped — tags come from the dictionary, never from the author's head.
- [x] **E.** 32 → **35 patterns** (3 new groups, 6 existing ones widened): the puppet theatre joined
      the Hoàn Kiếm evening (2 sources), the
      HCM museum the Ba Đình morning (2), the incense village the Huế tombs day (2), plus Vân Long +
      Thung Nham and the Phú Quốc north/south loops.
- [x] **F.** 197 tests, typecheck, all four guards, production build, `sweep:trips` 720 runs with
      every hard invariant holding. Live `wrangler dev` curl for all 9 hubs returns valid plans, and
      the Huế plan puts `hue-imperial-city` + `thien-mu-pagoda` on one day — the mined signal working
      end to end. Measured: mined pairs sharing a day **18.2% → 38.7%**.
- [ ] **F2.** Screenshots — blocked on a local D1 reseed while a peer session holds `wrangler dev`.
      `late-start-no-transfer` rose 23 → 37 in the sweep, expected: the new rows include a night
      market, a late food street and an evening square, and `DAY_END_MIN` still forbids the evening
      slot (already tracked under A2).
- [ ] **G.** **User runs the D1 reseed** — `npm run db:seed:build` then
      `npx wrangler d1 execute atlas_db --remote --file=db/seed.sql`. Not automated on purpose.

Caught in A, worth remembering: `o-quy-ho-pass` already existed under **lai-chau**, not lao-cai —
the pass straddles the border. Only an id collision revealed it; a name-based check would have
created a second row for one pass.

Concurrency: vivel-33 owns `scripts/**` + `image-manifest.json` this session. New 039 destinations
are NOT in its 159-image run and ship with illustrated placeholders. It also numbered its own doc
`tasks/039-images.md` — same batch number, different work.

## Review

Slice 1 is functionally complete and verified end to end: 192 tests, both typechecks, `check:i18n`,
a production build, live curl against `wrangler dev`, and screenshots at desktop light/dark and a
phone viewport.

Two things the screenshots caught that nothing else would have — the reason `tasks/lessons.md`
insists on looking: the trip panel never surfaced (a still-selected province outranked it in
`PanelContainer`), and every photo fell back to a gradient (`IllustratedImage` keys on the gallery
seed, not the destination id).

Not in this slice, in rough priority order:
- **TripPeekBar** — on mobile `ResponsivePanel`'s scrim dims and disables the map, so a route
  planner cannot show you the route. Do not remove the scrim globally; three shipped panels rely
  on it. A collapse-to-peek state is the fix and doubles as the map/list toggle.
- **Editing** — add/remove/reorder/regenerate-day. Seeds are already in `TripInput` and
  `rerollable` is already emitted per day, so the engine side is ready.
- **Evening slots** — real itineraries schedule Cầu Rồng and the night markets after 19:00; the
  038 `nightlife` type exists for exactly this and `DAY_END_MIN` currently forbids it.
- **`useCamera` inset** — `fitBox` centres in the whole container while the sidebar and panel cover
  ~49% of a 1440px screen, so a framed day drifts under the panel. Pre-existing; this feature makes
  it obvious.
- **check-i18n theme coverage** — parity is checked across locales but not against the `ThemeKey`
  union, so a new theme would render as its own key in all five languages.
