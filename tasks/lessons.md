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
- **Hỏi trước khi tiêu tài nguyên thật của user** (2026-08-05). Tôi tự `npm start` gateway ở
  background để test AI — nó nạp `.env` với key provider thật và tiêu 16 request free-tier mà
  không xin phép. Chi phí $0, nhưng vấn đề là quyền quyết định. `npm start` trong repo có `.env`
  **không phải sandbox**. Đề xuất thì được, tự làm thì không. Test/build/typecheck trong repo
  vẫn chạy bình thường — giới hạn này chỉ áp cho thứ gọi ra ngoài hoặc dùng credential thật.

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

## 033 — AI thật qua gateway
- **Một filter có buffer mà quên `flush()` trông y hệt model bị cắt token.** Nhánh caption gọi
  `ThinkFilter.push()` không kèm `flush()`, mất đúng 7 ký tự cuối ("…tự hào ✨" → "…tự h"). Suýt
  đổ lỗi cho lane và đi thêm guard `finish_reason`. Dấu hiệu nhận biết: **luôn thiếu đúng N ký
  tự** — model cắt thật thì độ dài ngẫu nhiên. Filter có state phải có một hàm "chạy trọn chuỗi".
- **Một test pass có thể là do bug che.** Test bóc ngoặc kép pass chỉ vì dấu `"` cuối đã bị filter
  nuốt sẵn; sửa bug xong test mới đỏ và lộ ra lỗi thứ tự xử lý. Test xanh trên đường đi có bug
  không chứng minh được gì.
- **`finish_reason` không phải tín hiệu truncation đáng tin.** Đo nhiều lane: có lane cắt ngang câu
  vẫn trả `"stop"`. Đừng xây logic chỉ dựa vào nó.
- **Đo latency theo tính chất request, không theo một con số chung.** Cùng tier, cùng prompt:
  stream trả chữ ngay, còn blocking call trên lane reasoning mất 34s. Request có streaming thì
  người dùng chờ được; request blocking phải có timeout ngắn + fallback.
- **Grounding chống bịa mạnh hơn chọn model.** Llama-3.1-8b với luật "chỉ dùng CONTEXT, không có
  thì nói không có" đã từ chối bịa giá vé máy bay. Đây là chuyện prompt + dữ liệu, không phải
  chuyện tier.
- **Đặt luật cạnh dữ liệu mà nó điều chỉnh, đừng để ở mục "luật" phía trên.** Prompt đã cấm nói
  thời gian di chuyển, nhưng luật nằm cách khối dữ liệu vài dòng; model đọc "~200 km từ Hà Nội"
  rồi tự thêm "4-5 giờ xe máy". Chuyển đúng câu cấm xuống ngay dưới dòng khoảng cách là hết.
  Với lane nhỏ, khoảng cách giữa luật và dữ liệu là có thật.
- **Cấm một loại thông tin trước khi hỏi mình có tính được nó không.** Tôi xếp `distances` cạnh
  giá vé và số điện thoại, trong khi mọi destination trong D1 đều có `lng`/`lat` — guide đã từ
  chối trả lời thứ nó tính ra được chính xác. Phân biệt: **thứ hay đổi** (giá, giờ mở cửa) thì
  cấm; **thứ suy ra được từ dữ liệu của mình** thì đi mà tính rồi đưa vào context.
- **Locale của UI không phải ngôn ngữ của người dùng.** Người dùng gõ tiếng Việt trong UI tiếng
  Anh bị trả lời bằng tiếng Anh. Luật đúng: trả lời theo ngôn ngữ của tin nhắn, locale chỉ là
  fallback khi không đoán được.

## 036 — Đọc memory/từ điển trước khi dựng nguồn dữ liệu mới

Tôi đi tra Wikidata để dựng bảng tên tỉnh ko/ja/zh, rồi mới phát hiện `src/lib/i18n/locales/*.ts`
đã có `province.<slug>` cho đủ 80 tỉnh × 5 ngôn ngữ — và memory `vivel-i18n` đã ghi rõ điều đó.
Vấn đề thật không phải "thiếu bản dịch" mà là "bản dịch chưa tới D1/geo-meta".

**Bài học:** khi thấy dữ liệu "thiếu", tìm xem nó đã tồn tại ở đâu chưa TRƯỚC khi đi lấy nguồn
ngoài. Triệu chứng ("trang Hàn hiện tên tiếng Việt") không chỉ ra nguyên nhân (đường dẫn dữ liệu),
và đoán sai nguyên nhân thì tạo ra nguồn thứ hai — thứ chắc chắn sẽ lệch nhau về sau.

**Giữ lại được gì:** phần tra cứu không bỏ đi mà đổi vai thành đối chiếu (`check:provinces`), và
nó tìm ra 2 chữ sai thật trong 400 tên viết tay. Kiểm tra chéo một nguồn có sẵn thì có ích;
thay thế nó thì không.

## 038b — Hiệu chỉnh engine bằng lịch trình thật, không bằng số học

Tôi dựng engine lịch trình rồi tự đánh giá bằng lý lẽ hình học ("cụm gần nhau thì chung ngày,
xa thì đổi base"). Người dùng dừng lại và bảo: tham khảo lịch trình thật đã chia sẻ trên mạng
trước, so với lịch tự tính, rồi mới quyết. Đúng — và nó lật ngược một giả định cốt lõi.

**Ba tín hiệu đo được, mỗi cái sửa một hằng số:**

| Quan sát từ lịch trình thật | Engine đang làm | Sửa |
|---|---|---|
| Đà Nẵng 5N: **một khách sạn cả chuyến**, Hội An/Bà Nà/kể cả Huế đi về trong ngày | đổi base 2–3 lần | `DAY_TRIP_KM = 110` |
| Hà Giang 4N: **đổi chỗ ngủ mỗi đêm** (Phó Bảng→Đồng Văn→Mèo Vạc) | — | cùng một hằng số tái hiện cả hai |
| 2–3 điểm/ngày | tới 5 | `PACE.maxStops` 3/4/5 → 2/3/4 |

Điểm mấu chốt: **một hằng số duy nhất tái hiện cả hai hành vi**, thay vì hardcode "thành phố thì
ở yên, vùng núi thì đi tiếp". Bán kính 110km nằm vừa trên Huế (~100km) và vừa dưới Đồng Văn.

**Ba bug chỉ lộ ra khi so với lịch thật:**
- Một giới hạn chặng duy nhất cho phép ghép Mỹ Sơn (nam) với Thiên Mụ (Huế, bắc) — 2h50 giữa hai
  điểm, tới nơi 16:10 thăm 1 tiếng. Cấu trúc thật là **chặng đi ra dài, chặng giữa các điểm ngắn**
  → tách `maxOutboundMinutes` / `maxLegMinutes`.
- Cầu Vàng và Bà Nà Hills là hai row cách nhau 630m sau cùng một vé cáp treo, cùng "1 ngày" → bị
  xếp vào hai ngày khác nhau. Không sửa được ở tầng xếp lịch (chồng 8h lên 8h); phải khử trùng lặp
  ở tầng ứng viên. Chỉ áp cho điểm trọn-ngày — trung tâm Đà Nẵng có 8 điểm trong 1,5km và gộp hết
  thì mất nguyên khu phố.
- Ngày mà mọi điểm được chọn đều vướng giờ mở cửa (Cù Lao Chàm cần trọn ngày nhưng đóng 16:00) →
  engine bỏ luôn cả chuyến thay vì chọn lại. Retry theo ngày, loại trừ tạm thời.

**Bài học:** với thứ mô phỏng hành vi con người, "đúng về hình học" và "đúng về thực tế" là hai
chuyện khác nhau, và test tự viết chỉ bảo vệ được cái thứ nhất. 93 test xanh trong khi engine vẫn
bắt người ta đổi khách sạn 3 lần ở Đà Nẵng. Ranh giới bản quyền (docs/031.md §Phase 8): lấy tín
hiệu có cấu trúc (đi cùng ngày, mấy điểm/ngày, ngủ ở đâu), không chép mô tả hành trình.

## 038b (tiếp) — Hai con số được đặt cho quy mô dữ liệu cũ

**Zoom tối đa.** Người dùng báo bản đồ rối, tôi sửa bằng cách giấu bớt nhãn. Sai hướng. Đo ra mới
thấy vấn đề là *thang đo*: ở mức zoom tối đa cũ (18× khung toàn quốc), **1 km chỉ chiếm 9,5 px màn
hình**, nên 8 địa điểm trong trung tâm Đà Nẵng chia nhau **14 px** trong khi mỗi nhãn rộng 120 px.
Không bao giờ giấu nhãn cho đủ được. 18× hợp lý khi atlas chỉ có danh thắng cấp tỉnh cách nhau
hàng chục km; nó vô nghĩa khi một tỉnh có 18 điểm nội đô. Nâng lên 400×.

Kèm theo là hệ quả phải xử lý: quá ~40× thì hình học đã simplify không còn đủ chi tiết — dải sáng
ven biển phình thành mảng trắng nửa màn hình, đường bờ thành vài đoạn thẳng dài hàng km, trông như
bản đồ hỏng. Thêm nấc `zoomLevel 5` (`CITY_DETAIL_RATIO`) để bản đồ **thôi vẽ chi tiết nó không
có**, trả về nền phẳng sạch. Thà thành thật là tấm bảng ghim ở cấp đường phố còn hơn giả vờ.

**Thứ tự trong ngày phải tính tới giờ đóng cửa.** `layOutDay` xếp thứ tự thuần theo địa lý, nên Bán
đảo Sơn Trà (cần 4 tiếng, đóng 18:00 ⇒ phải bắt đầu trước 14:00) bị đẩy xuống thứ ba rồi bị loại vì
không kịp giờ. Ngày trông gọn gàng về mặt hình học nhưng **âm thầm đánh rơi đúng điểm người dùng đã
ghim**. Luật mới: chỗ nào đóng sớm thì đi trước, và chỉ áp khi thật sự gấp (giờ khởi hành muộn nhất
trước 15:00), còn lại vẫn để khoảng cách quyết định.

**Bài học chung:** khi triệu chứng là "rối/thiếu", hãy đo đại lượng vật lý (px trên km, phút còn
lại trước giờ đóng) trước khi chỉnh phần hiển thị. Cả hai lần, thứ trông như vấn đề thẩm mỹ hoá ra
là một hằng số được đặt cho quy mô dữ liệu của năm ngoái.

## 038b (tiếp) — Luật đặt sai trục thì chỉ đúng ở nơi mình đã thử

Tôi thêm `CROSS_PROVINCE_LEG_MINUTES = 35` để chặn một ngày ghép Sơn Trà với Chùa Cầu. Nó chặn
được, và test xanh. Nhưng người dùng thử **Hà Nội 5 ngày → ra 3 ngày, mỗi ngày 1 điểm, và không
có Hà Nội trong đó**.

Nguyên nhân: tôi lấy **ranh giới hành chính** làm trục, trong khi cái sai thật nằm ở chỗ khác.

| Chặng | Di chuyển | Tham quan | Vượt tỉnh? |
|---|---|---|---|
| Sơn Trà → Chùa Cầu (cần chặn) | 45p | **30p** | có |
| Ngũ Hành Sơn → Hội An (cho qua) | 25p | 4–8h | có |
| Mỹ Sơn → Hội An (cho qua) | 43p | 4–8h | **không** |

Ranh giới tỉnh không tách được ca nào cả. Thứ tách được cả ba là **"đừng lái lâu hơn thời gian
mình ở lại"** — `MAX_TRAVEL_TO_VISIT_RATIO`. Và luật cũ phá nát đồng bằng sông Hồng, nơi các tỉnh
cách nhau 20–30km nên vượt tỉnh là chuyện thường ngày.

Hai bug khác cùng lộ ra nhờ một lần thử ở vùng khác:
- **Điểm trọn-ngày cướp mọi ngày.** `rotated.find(fullDay)` quét cả pool, nên vùng có nhiều điểm
  trọn ngày (Tràng An, Tam Chúc, Côn Sơn…) thì ngày nào cũng còn đúng một điểm. Sửa: chỉ khi nó là
  ứng viên **tốt nhất** của ngày, không phải chỉ cần có mặt.
- **Base lấy tên theo tỉnh nhiều điểm nhất**, nên chuyến "từ Hà Giang" neo vào Bắc Kạn và Hà Giang
  biến mất khỏi tuyến lẫn khỏi dòng "nghỉ đêm tại…". Sửa: tỉnh xuất phát luôn neo base của nó.

**Bài học:** một ràng buộc chỉ được kiểm ở một vùng thì mới chỉ là quan sát của vùng đó. Trước khi
chốt một luật hình học, chạy nó qua ít nhất một vùng có hình thái ngược lại (tỉnh nhỏ sát nhau vs
tỉnh lớn thưa) — và ưu tiên trục **vật lý** (phút, km, giá trị đổi lại) hơn trục **hành chính**.

**Bỏ tỉnh làm proxy — rà hết, không chỉ chỗ vừa sai.** Sau khi thay luật chặng, người dùng nhắc
"quan trọng là thời gian và khoảng cách, tỉnh nào không quan trọng". Rà lại thì tỉnh vẫn còn làm
proxy ở ba chỗ nữa:

- **Chọn ứng viên** lọc theo *cả tỉnh* nằm trong bán kính tính từ **centroid tỉnh**. Đo ra: centroid
  Nghệ An cách chính các điểm của nó **31–94km**, Quảng Nam 26–73km. Nên nó vừa kéo vào điểm cách
  250km vừa bỏ sót điểm cách 40km. Sửa: lọc theo **từng điểm**, mốc là trọng tâm các điểm thật của
  tỉnh xuất phát (không phải centroid đa giác). `provinces` giờ là *kết quả*, không còn là đầu vào.
- **Gom base** tạo một base cho mỗi tỉnh rồi mới gộp. Nghĩa là hai chỗ cách nhau 5km có thể rơi vào
  hai base khác nhau, còn hai chỗ cách 200km lại chung một base — chỉ vì đường ranh giới nằm ở đâu.
  Sửa: gom **các điểm** theo khoảng cách, seed từ chỗ gần nhà nhất.
- **Chọn quán ăn** lọc theo cùng tỉnh. Sửa: lọc theo km.

Hai bug lộ ra ngay sau đó, và đều là hệ quả của việc thứ tự ưu tiên chưa rõ ràng: điểm **ghim** bị
nhóm pattern giành mất ngân sách ngày (pin là *mệnh lệnh*, pattern là *thói quen* — pin phải vào
trước), và một test cũ vẫn ép ngày 1 phải nằm trong tỉnh xuất phát. Cái giữ cho ngày đầu hợp lý là
**quãng đường đi đầu tiên dài bao nhiêu**, đã có `maxOutboundMinutes` lo bằng phút.

## 038b (tiếp) — Quét toàn không gian đầu vào, đừng đọc code rồi suy luận

Sau bốn lần liên tiếp một hằng số đặt cho vùng này làm hỏng vùng khác, tôi dựng
`npm run sweep:trips`: chạy engine trên **toàn bộ tỉnh của cả hai atlas × {3,5,7} ngày × 3 cặp
style/pace = 720 lịch trình**, kiểm invariant cứng + đếm tín hiệu chất lượng.

Nó tìm ra trong vài giây những thứ 194 test không hề thấy:

| Lỗi | Ảnh hưởng | Vì sao test không bắt |
|---|---|---|
| `nightProvince` không nằm trong `plan.provinces` | **324/720** | Test chỉ chạy vài origin quen thuộc |
| Tỉnh xuất phát không đứng đầu tuyến | 75/720 | Như trên |
| Base cạn một ngày → **mất sạch số ngày còn lại** của base đó | Bình Phước xin 7 ra **1** | Không origin nào trong test rơi vào |
| `"1 ngày"` hiểu nguyên văn 480 phút | **3 vườn quốc gia không bao giờ xếp được**, ở mọi chuyến | Không test nào kiểm "điểm X có bao giờ xuất hiện không" |

Cái cuối đáng nhớ nhất: `visitDuration: "1 ngày"` là **một ngày du lịch**, không phải 8 tiếng liên
tục trong cổng. Cát Tiên mở 07:00–17:00, đòi đủ 480 phút nghĩa là phải vào trước 09:00 — tới nơi
09:40 là vĩnh viễn bị loại. Sửa: `fitVisit()` co thời gian tham quan cho vừa khung giờ thay vì từ
chối, và chỉ bỏ khi phần còn lại không đáng công đi.

Cũng học được: **siết một đầu thì phải đo đầu kia.** Siết ngưỡng "ngày quá mỏng" theo nhịp đi giúp
giảm ngày rác 103→57, nhưng làm tái phát 7 ca tỉnh xuất phát bị rớt — vì ngày 1 mỏng bị loại thì
chuyến bắt đầu ở tỉnh hàng xóm. Phải miễn trừ ngày 1.

**Bài học:** với thuật toán chạy trên dữ liệu không đồng đều, unit test ghim *luật*, còn quét toàn
bộ ghim *hành vi tổng thể* — và hầu hết lỗi thật nằm ở loại thứ hai. Chi phí: 40 dòng script.

## 038 — Guard xanh không có nghĩa là dữ liệu đủ

Đợt làm giàu 11 hub (+140 địa điểm) chạy sạch `typecheck`, `test`, `check:i18n`, `check:content`,
`check:zh` ngay từ khi 46 entry chưa có một dòng dịch nào. Không guard nào kêu, vì `check:i18n`
so **parity giữa các file locale**, không so độ phủ **theo entry** — thiếu cả một bucket thì nó
không có gì để so, thế là qua. Fallback trả tiếng Việt nên giao diện cũng không vỡ.

**Bài học:** guard chỉ bắt được thứ nó được viết để bắt. Khi thêm một *chiều* dữ liệu mới (ở đây là
bucket theo hub thay vì theo vùng), phải hỏi "guard nào biết chiều này tồn tại?" trước khi tin vào
màu xanh. Cách đếm thật nằm trong `tasks/038-vn-hubs.md`; đáng thêm một test dựng `destinationI18n`
rồi assert mọi id có đủ 4 locale.

## 038 — Tên riêng: tra trong repo trước, đừng dịch lại từ đầu

Trước khi viết bản ko/ja/zh cho 5 hub cuối, tôi `grep` các file locale sẵn có để lấy biến thể atlas
đang dùng. Hoá ra Nha Trang đã xuất hiện 17–20 lần dưới dạng `나트랑`/`ニャチャン`/`芽庄`. Nếu tự đặt
theo cảm tính thì rất dễ ra `나짱` — vốn đã có đúng 1 lần trong repo, tức là dấu vết của một lần
trước cũng tự đặt.

Riêng zh có hai luật rõ: dùng tên **Hán-Việt** khi có (`华闾` `云屯` `河仙` `老街` `三谷碧洞` `发艳`),
phiên âm chữ Hán khi không có (`蒲盆岛` `坑加` `依底`, cùng lối với `农渃` từ 033).

**Bài học:** với dữ liệu đa ngôn ngữ, `grep` rẻ hơn nhiều so với việc dọn hai cách gọi cho cùng một
địa danh sau khi cả hai đã nằm trong D1.

## 038 — Đọc `verify:vn` bằng danh sách id, đừng bằng tổng số

`verify:vn` resolve theo `nameEn` trên Wikipedia nên đẻ ra false match rất đều tay, và **tập lỗi
trôi giữa các lần chạy**: lần này 3 id cũ tự biến mất trong khi 5 id mới hiện ra. So tổng số (14 → 16)
sẽ kết luận sai là "đợt này làm hỏng thêm 2 chỗ".

Cách đọc đúng: `comm` danh sách id với `git show HEAD:tasks/verify-vn-report.md`. Làm vậy ra 5 id
mới, tra tay từng cái thì 3 cái khớp **0.0 km** với bài đúng — tức toạ độ atlas vốn chuẩn, chỉ mỗi
resolver bắt nhầm ("Binh Ba Island" → Battle of Binh Gia cách 251km). Hai cái còn lại có bài nhưng
bài **không mang toạ độ**; ghim vào vẫn hơn, vì `verify` sẽ ghi "position unchecked" thay vì dựng
lên một lỗi 423km không có thật. Sau khi ghim: 11 lỗi, ít hơn HEAD, 0 id mới.

**Bài học:** một công cụ advisory có nhiễu thì con số tổng vô nghĩa; chỉ có phần *sai khác* mới nói
được điều gì.

## 038b — Palette đảo chiều theo theme thì `text-white` là bug đang ngủ

Đổi badge chặng dừng từ `1` sang `1.1`. Ảnh chụp light mode: đẹp. Ảnh chụp dark mode: gần như
không đọc nổi — `TRIP_DAY_PALETTE` cố ý tune **ngược chiều** giữa hai cột (light lấy tương phản
bằng ĐỘ TỐI `#0f6b52`, dark lấy bằng ĐỘ SÁNG `#4ee0ac`), mà cả hai đều dùng chung một
`text-white` hard-code. Trắng trên `#4ee0ac` là 1.4:1.

Bug này có từ trước, không phải do tôi sinh ra — nhưng một chữ số đơn thì đoán được từ vị trí,
còn `1.1` thì bắt buộc phải đọc. Nên nó chỉ *thành* bug đúng lúc nhãn mang thêm thông tin. Sửa gốc:
`tripDayColor()` trả thêm `ink`, lật theo theme (8–12:1 trên cả 7 hue), thay vì vá `text-white`
tại chỗ.

**Bài học:** hễ một palette có hai cột tune ngược chiều nhau thì **mọi màu chữ đặt lên nó cũng
phải đến từ palette đó**. Và chụp một mode rồi kết luận là chưa chụp gì — screenshot light mode
không nhìn thấy được lỗi tương phản của dark mode.
