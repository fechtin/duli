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
- [x] **F2.** Screenshots — done after the local reseed (peer released `wrangler dev` first; note a
      different `--port` does NOT isolate local D1, only `--persist-to` does).
      `late-start-no-transfer` rose 23 → 37 in the sweep, expected: the new rows include a night
      market, a late food street and an evening square, and `DAY_END_MIN` still forbids the evening
      slot (already tracked under A2).
- [x] **G. SHIPPED.** Pushed as `02ff139` + `b877f82`; Action green on `6fc4ef3`. Production D1
      reseeded on user instruction — 4,644 rows / 7 tables. **go.fechtin.com now serves 343 vn /
      189 kr**, the 16 new destination pages return 200, the trip API answers for all 9 hubs, and
      the preset panel renders live. Only the seed step was run: `deploy.sh` also contains
      `wrangler deploy`, which stays the Action's job.

### Found while building the presets — worth a look
- [ ] **Pinning `ho-chi-minh-mausoleum` together with `temple-of-literature` collapses a 3-day Hà
      Nội trip to ONE day.** Either pin alone is fine. Two of the city's most-visited sites, so a
      user hitting it by hand would see the same thing. `presets.test.ts` catches it only because
      every preset is probed; nothing guards the hand-built case. Reproduce:
      `generateTrip({originProvince:"ha-noi",days:3,style:"mixed",pace:"balanced",
      pinned:["ho-chi-minh-mausoleum","temple-of-literature"]})` → `totalDays === 1`.
- [ ] `sa-pa-town` carries `visitDuration: "2 ngày"`, so any 3-day trip that pins it drops it. Not a
      bug in itself, but it means the province's own headline row cannot anchor a short preset.

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

# 042 — Food index page (`/{cc}/food`)

Nút "Tất cả" của `FoodExplorerSection` gọi `setSearchOpen(true)`: ẩm thực không có trang danh
sách nào để trỏ tới, nên ô search bị mượn tạm — và empty-state của search chỉ liệt kê
*destination* featured, nên bấm "Tất cả" ở mục ẩm thực ra một hộp không có món nào.

**Route: `/{cc}/food`** — anh em ngang hàng với trang tỉnh, không phải overlay.
- Segment tiếng Anh chứ không phải `am-thuc`: locale nằm ở prefix (`/en/vn/food`), và cùng một
  segment phải phục vụ `/kr/food`. Đã kiểm tra không đụng slug tỉnh nào (vn 63 + kr).
- Canonical của dish giữ nguyên `/{cc}?dish=`. Mở món từ trang index cho URL `/{cc}/food?dish=x`,
  canonical hoá về `/{cc}?dish=x` — đúng luật `useDocumentMeta`/`worker/meta` đã áp cho món mở
  trên trang tỉnh.

## A. URL + state
- [x] `urls.ts` — `FOOD_SEGMENT` + `foodPath(cc)`, một nguồn sự thật cho client/worker/sitemap
- [x] `useFoodStore` — `listOpen` / `openList()` / `closeList()`
- [x] `useUrlSync` — parse `/{cc}/food`, write-back, `depthOf` coi index = bậc 1 (như tỉnh)
- [x] `usePanelOpen` — tính cả `listOpen`

## B. UI
- [x] `FoodListPanel.tsx` — `<h1>` + toàn bộ món, mỗi thẻ là `AppLink` tới `dishPath`
- [x] `PanelContainer` — thứ tự dish > dest > province > food index > trip; đóng dish rơi về index
- [x] `FoodExplorerSection` — `<button onClick>` → `AppLink` tới `foodPath`

## C. SEO
- [x] `worker/meta.ts` — nhánh `/{cc}/food` (chặn trước lookup province bundle)
- [x] `worker/seo-body.ts` — `foodBody()`; `countryBody` link tới index
- [x] `worker/seo-jsonld.ts` — ItemList
- [x] `useDocumentMeta` — title/description/JSON-LD client-side
- [x] `build-sitemap.mjs` — thêm entry `/{cc}/food`

## D. i18n + verify
- [x] Key mới cho cả 5 locale
- [x] `npm run check:i18n`, `check:zh`, `typecheck`, `test`, build, curl qua `wrangler dev`

## Review — 042

Nguyên nhân đúng như báo cáo và đã sửa tận gốc: `FoodExplorerSection` giờ là `AppLink`
tới `/{cc}/food`, một trang thật.

Hai thứ chỉ lộ ra khi chạy app thật, không guardrail nào bắt được — lý do `tasks/lessons.md`
bắt phải nhìn:
- **Hai `<h1>` trên một trang.** `CrawlNav` phát `<h1 class="sr-only">Việt Nam</h1>` mỗi khi
  không panel nào "sở hữu" tiêu đề, và nó không biết về panel mới → `/vn/food` render
  "Việt Nam" rồi "Ẩm thực". Sửa: thêm `listOpen` vào `panelOwnsHeading`.
- **`openList()` phải `map.reset()`.** Bấm "Tất cả" khi đang chọn một tỉnh thì panel tỉnh vẫn
  thắng trong `PanelContainer` và người đọc không bao giờ thấy danh sách.

Đo được sau khi sửa (curl qua `wrangler dev` + Playwright):
- `/vn/food` 200, 149 món / 8 vùng; `/kr/food` 200, 46 món / 7 vùng. Số khớp nhau ở panel,
  crawler body, JSON-LD `numberOfItems` và meta description.
- `/vn/food?dish=x` canonical hoá về `/vn?dish=x` — không sinh URL trùng.
- `/vn/foods` → 404 thật, không phải soft-404.
- hreflang đủ 6 thẻ, có self-reference; `verify:seo` 6/6.
- Đóng món mở từ index thì rơi về index (không văng ra bản đồ trắng).

Chưa làm, cố ý:
- **Nav rail "Ẩm thực"** vẫn scroll tới `#sb-food` như "Điểm ẩn"/"Lễ hội". Đổi nó thành điều
  hướng sẽ phá thể thức của các mục anh em; nếu muốn đổi thì đổi cả nhóm.
- **`SearchOverlay` empty-state** vẫn chỉ gợi ý destination. Không còn là lỗi của mục ẩm thực
  nữa, nhưng thêm vài món vào gợi ý vẫn là cải thiện đúng.
- **`public/sitemap.xml`** khi build lại còn bắt kịp 16 điểm đến đã seed từ 039/041 mà sitemap
  cũ chưa liệt kê — ngoài phạm vi task này nhưng là thay đổi đúng.

### 042 — sửa sau khi user báo `/vn/food?dish=banh-mi` không hiện

Hai chuyện chồng lên nhau ở `localhost:5199`:

1. **Môi trường:** vite proxy `/api` sang `127.0.0.1:8787` (vite.config.ts:61). Không có
   `wrangler dev` nào ở 8787 → mọi API trả 500. Sidebar vẫn có dữ liệu là nhờ service-worker
   cache, nên trông như chỉ mỗi panel hỏng. **Lưu ý cổng: 8787, không phải 8788.**

2. **Lỗi thật, của 042:** deep link `/{cc}/food?dish=x` bị rụng món, URL tự viết lại về
   `/{cc}/food`. `openList()` xoá `openDishId`, trong khi `applyFromUrl` so sánh với `food` —
   một *snapshot* chụp TRƯỚC khi các lệnh đó chạy. `applyFromUrl` chạy lại khi `ready` bật
   (và chạy hai lần dưới StrictMode), lần sau snapshot còn `'banh-mi'` nên
   `food.openDishId !== dishId` là false → `openDish` không bao giờ được gọi.

   Sửa tận gốc — mỗi tầng một trọng tài:
   - `openList()` không đụng tầng dish nữa, chỉ `listOpen` + `map.reset()`.
   - `applyFromUrl` đọc `useFoodStore.getState().openDishId` LIVE, không đọc snapshot.
   - Chỗ nào có ý "mở index, không kèm món" thì tự gọi `closeDish()` — hiện là link "Tất cả".

   Chỉ chạy app thật mới thấy: bundle production ban đầu chỉ được test bằng *click*, mà click
   không đi qua `applyFromUrl`. Đã thêm ca deep-link và ca "bấm Tất cả khi đang mở món" vào
   kịch bản kiểm tra.

# 043 — Dishes get real path URLs (`/{cc}/food/{dish}`)

042 để lại một hạn chế: món ăn vẫn là query param. `/vn?dish=banh-mi` chạy được và canonical
đúng, nhưng yếu hơn `/vn/food/banh-mi` — không có từ khoá trong path, và breadcrumb đang khai
một trang cha mà URL không phản ánh. Giờ `/{cc}/food` đã tồn tại thì món ăn có chỗ để làm con.

Đổi luôn cả canonical, nên phải 301 dạng cũ: `?dish=` đã nằm trong index và đã được chia sẻ.

Việc này còn **xoá bớt** máy móc chứ không chỉ thêm: hết cảnh canonical phải gộp
`/vn/quang-nam?dish=x` về `/vn?dish=x`, nên `PageMeta.query` thành thừa.

- [x] `urls.ts` — `dishPath` → `/{cc}/food/{id}`
- [x] `useUrlSync` — parse `/{cc}/food/{dish}`; món thắng URL; `currentUrlDepth` phân biệt
      `food/{dish}` (bậc 3) với `{tỉnh}/{điểm}` (bậc 2); vẫn nhận `?dish=` cũ rồi tự chữa
- [x] `useFoodStore.openDish` — id sai thì tự đóng, đừng quay skeleton mãi (idiom của `openTrip`)
- [x] `worker/index.ts` — 301 mọi `?dish=` sang path mới, giữ locale prefix
- [x] `worker/meta.ts` — nhánh dish theo path; món lạ → 404 thật; bỏ `PageMeta.query`
- [x] `worker/seo-body.ts` + `seo-jsonld.ts` — link, ItemList, breadcrumb 4 bậc
- [x] `useDocumentMeta` — bỏ phần gộp canonical; **thêm nhánh dish** (hiện client không đặt
      title cho món, chỉ Worker đặt lúc tải trang — lỗ hổng có sẵn)
- [x] `build-sitemap.mjs` — dish entry thành path
- [x] Verify: 301 dạng cũ, 404 món lạ, canonical mới, hreflang, full suite

## Review — 043

Món ăn giờ là trang thật: `/{cc}/food/{id}`, canonical tự trỏ chính nó. Việc này **xoá** máy móc
chứ không thêm — hết cảnh gộp canonical, và `PageMeta.query` đã bỏ hẳn.

Đo trên `wrangler dev`:
- 301 đủ mọi dạng cũ, giữ locale và tham số khác:
  `/vn?dish=` · `/vn/quang-nam?dish=` · `/en/vn?dish=` · `/vn/food?dish=` · `?dish=&trip=`
- `/vn/food/banh-mi` 200, canonical tự trỏ, breadcrumb 4 bậc mà URL phản ánh đúng từng bậc
- `/vn/food/khong-co-mon-nay` và `/kr/food/<id sai>` → 404 thật
- 0 chuỗi `?dish=` còn sót ở bất kỳ trang nào; sitemap 0; ItemList trỏ path mới
- 149 link món trong crawler body của cả `/vn` lẫn `/vn/food`

Sửa kèm, phát sinh từ báo cáo của user giữa chừng:
- **Đang xem chi tiết món, click địa điểm trên bản đồ không có tác dụng.** `openDishId` đứng
  trên mọi thứ trong `PanelContainer`, nên chọn tỉnh/điểm chỉ đổi state bên dưới còn panel vẫn
  là món. Có 7 chỗ gọi `selectProvince`/`selectDestination` (bản đồ, search, passport, sr-only
  nav…) nên sửa ở `useMapStore` — chọn một địa điểm thì đóng món đang mở. Đây là lỗi **có từ
  trước 043**: trước đây URL đổi thành `/vn/quang-nam?dish=x` mà panel vẫn không đổi.
- **`openDish` với id sai** giờ tự đóng thay vì quay skeleton mãi (idiom của `openTrip`).
  `fetchDish` nuốt lỗi trả `null`, còn `DishPanel` chỉ có `loading || !dish` nên quay vô hạn —
  chính là thứ user gặp khi API chết.
- **`useDocumentMeta` thiếu hẳn nhánh dish** từ trước: Worker đặt title lúc tải trang, còn điều
  hướng trong app thì để nguyên title quốc gia. Đã thêm.

Chưa sửa, có chủ ý:
- **Đóng món mở từ panel tỉnh thì về `/vn`, không về tỉnh.** `PanelContainer.onClose` gọi
  `closeDish(); reset()` — đóng cả chồng. Đã kiểm tra bằng `git show 05c5f09`: hành vi này có
  từ trước 042. Nó lệch với nhánh food index (đóng món thì rơi về danh sách), nhưng sửa là đổi
  ngữ nghĩa nút đóng của cả ba panel đang chạy — việc riêng, không nhét vào đây.
