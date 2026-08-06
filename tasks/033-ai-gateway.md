# 033 — AI thật qua Fechtin Gateway

## Bối cảnh

`AIProvider` (src/lib/ai/types.ts) đã đúng abstraction, nhưng `index.ts` trỏ vào
`mockProvider` và **client gọi thẳng provider trong browser** — nên 3 endpoint
`/api/v1/ai/*` của Worker (đã có sẵn `aiContext()` load grounding từ D1) chưa
bao giờ chạy.

Gateway (`gw.fechtin.com/v1`) là OpenAI-compatible → chỉ đổi base_url, không cần
SDK riêng. Key nằm ở Worker, không bao giờ vào bundle browser.

## Việc

- [x] `src/lib/ai/prompt.ts` — system prompt + serialize context D1 thành block
      `<context>`; khóa model chỉ trả lời từ dữ liệu đã verify
- [x] `src/lib/ai/gatewayProvider.ts` — factory gọi gateway (tier `fast`, SSE,
      lọc `<think>`, xử lý `content: null`, 429)
- [x] `src/lib/ai/httpProvider.ts` — browser → Worker, đọc stream
- [x] `src/lib/ai/index.ts` — client dùng httpProvider
- [x] `worker/index.ts` — chọn provider theo env, truyền country + locale
- [x] `AIChat.tsx` + `CheckinFlow.tsx` — gửi country trong context
- [x] Test (12 unit) + typecheck + build + E2E thật với gateway local

## Quyết định

**`AISummary` giữ nguyên template.** Nó đã chính xác (đọc thẳng field D1 đã
verify), instant, miễn phí. Gọi LLM mỗi lần mở panel là đốt quota để diễn đạt
lại thứ mình đã có. Endpoint `/ai/summary` vẫn nối vào gateway cho chỗ cần
văn xuôi thật.

**Tier `fast`, không phải `smart`.** Task là tư vấn trên context có sẵn, không
phải suy luận khó. `fast` có 101 lane vs 76 — dai hơn nhiều.

**Không gửi `max_tokens`.** Bẫy §6.1 agent-guide: thinking token ăn vào
`max_tokens`; đặt thấp thì `content` về `null`.

**Không bật `fechtin_search`.** Grounding của ta là D1 đã verify (`sourceUrl` +
`verifiedAt`). Web search kéo vào nguồn không kiểm soát, và link redirect của
Google hết hạn sau ~30 ngày.

## Đã lên production (2026-08-06)

Client `vivel` đã thêm vào `FECHTIN_CLIENTS` trên VM gateway, secret
`FECHTIN_GATEWAY_KEY` đã set trên Worker `go`, commit `c592ee5` đã deploy.
Kiểm chứng trên `go.fechtin.com`: hỏi giá vé máy bay + thời điểm đi → **từ chối
bịa giá vé**, trả lời đúng phần có trong D1. Hỏi lịch trình Jeju bằng tiếng Anh
→ tên địa danh lấy từ D1 (Seongsan Ilchulbong, Manjanggul…) kèm suy luận hợp lệ
("tránh mất cả ngày di chuyển").

**Không bao giờ đổi sang SDK OpenAI cho đường này.** Cloudflare trước
`gw.fechtin.com` trả 403 cho User-Agent của SDK. Đo 2026-08-06: không UA → 200,
`Cloudflare-Workers` → 200, `OpenAI/JS 7.2.0` → **403**.

## Review

**Kiểm chứng thật với gateway local** (`gw` chạy open dev mode, không có
`FECHTIN_CLIENTS`), không chỉ mock:

- Hỏi "vé máy bay bao nhiêu, khi nào nên đi?" với context chỉ có `bestTime` →
  model **từ chối bịa giá vé**, chỉ trả lời phần có trong context. Grounding
  rule chạy đúng.
- Chat stream 4 chunk, nội dung đều rút từ context (4 ngày, tour Oxalis,
  tháng 2–8). Lane: `llama-3.1-8b-instant`, tier `fast`.

**Ba lỗi chỉ lộ ra khi chạy thật:**

1. **`ThinkFilter.push()` không kèm `flush()` ở nhánh caption nuốt mất 7 ký tự
   cuối.** "…và tự hào ✨" ra "…và tự h" — trông y hệt model bị cắt token, nên
   suýt sửa nhầm sang guard `finish_reason`. Test cũ "bóc ngoặc kép" trước đó
   **pass nhờ chính bug này** (dấu " bị nuốt). Đã tách `stripThinking()`.
2. **Caption mất 34s** trên lane reasoning → nút "viết bằng AI" coi như chết.
   Thêm timeout 12s cho request blocking (stream giữ 90s theo deadline của
   gateway), quá hạn thì rơi về template. Đo lại: fallback sau 11s.
3. **Thứ tự bóc ngoặc/cắt dòng bị ngược** — phải `split("\n")` trước rồi mới
   bóc ngoặc, không thì dấu đóng ngoặc kẹt giữa chuỗi.

**`finish_reason` không đủ tin.** Đo 6 lane: có lane cắt ngang câu vẫn báo
`"stop"`. Vẫn giữ guard `length` (đúng ở lane báo thật) nhưng không coi nó là
tín hiệu duy nhất.

**Bundle client sạch:** grep `dist/assets` không có `gw.fechtin.com`,
`FECHTIN_GATEWAY_KEY` hay `x-fechtin-lane` — gatewayProvider chỉ vào Worker.
