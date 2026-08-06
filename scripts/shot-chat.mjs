// Screenshot the AI chat panel in three states, WITHOUT calling the gateway.
// The reply is stubbed with text a real lane actually produced in production, so the markdown
// and the first-token wait are reproduced exactly at zero quota cost.
//
// Usage: node scripts/shot-chat.mjs <baseUrl> <outPrefix>
import { chromium } from "playwright-core";

const [base = "http://localhost:5173", prefix = "/tmp/chat"] = process.argv.slice(2);

// Verbatim from https://go.fechtin.com/api/v1/ai/chat on 2026-08-06 (the web-search pass).
const REPLY =
  "Giá vé máy bay một chiều từ Hà Nội đến Yên Bái hiện nay thường bắt đầu khoảng " +
  "**399.000 đồng** (theo sanvemaybay.vn). Giá này chỉ là mức thấp nhất được quảng cáo và có " +
  "thể thay đổi tùy vào hãng, thời gian đặt và ngày bay. Bạn nên kiểm tra trực tiếp trên " +
  "website của các hãng để có mức giá cập nhật nhất. " +
  "*(Số liệu này lấy từ web, không phải dữ liệu xác thực của atlas và có thể thay đổi.)*";

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2 });

// Stub the chat endpoint: 2.5s of silence (a real first-token wait), then stream in chunks.
await page.route("**/api/v1/ai/chat", async (route) => {
  await new Promise((r) => setTimeout(r, 2500));
  await route.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: REPLY });
});

await page.goto(`${base}/vn`, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

// Open the guide panel.
// Bottom nav on mobile widths: the "guide" tab has no aria-label, only its visible text.
const opener = page.getByRole("button", { name: /Hướng dẫn viên AI|AI Guide/i }).first();
await opener.click({ timeout: 15000 });
await page.waitForTimeout(800);
await page.screenshot({ path: `${prefix}-1-empty.png` });

// Ask something, then catch the panel mid-wait (before any token arrives).
const input = page.locator('input[placeholder]').last();
await input.fill("Giá vé máy bay Hà Nội đi Yên Bái bao nhiêu?");
await input.press("Enter");
await page.waitForTimeout(1200);
await page.screenshot({ path: `${prefix}-2-waiting.png` });

// And once the whole answer has landed.
await page.waitForTimeout(4000);
await page.screenshot({ path: `${prefix}-3-answered.png` });

console.log("saved:", `${prefix}-{1-empty,2-waiting,3-answered}.png`);
await browser.close();
