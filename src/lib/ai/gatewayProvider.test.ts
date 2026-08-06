import { describe, it, expect, vi, afterEach } from "vitest";
import { createGatewayProvider } from "./gatewayProvider";
import { buildSystemPrompt } from "./prompt";
import type { AIContext } from "./types";
import type { Destination } from "@/lib/types";

// The gateway is OpenAI-compatible SSE. These tests pin the two things that silently produce a
// bad answer rather than an error: leaked <think> reasoning reaching a user, and a lane failure
// turning into an empty chat bubble instead of the grounded fallback.

const CONFIG = { baseUrl: "https://gw.example/v1", apiKey: "k" };

const DEST = {
  id: "d1",
  slug: "d1",
  provinceSlug: "p1",
  name: "Hang Sơn Đoòng",
  nameEn: "Son Doong Cave",
  type: "nature",
  lng: 0,
  lat: 0,
  summary: "The world's largest cave passage.",
  story: "",
  facts: [],
  travelTips: [],
  bestTime: "February to August",
  visitDuration: "4 days",
  ticket: "",
  openingHours: "",
  badges: [],
  tags: [],
  gallery: [],
  nearby: [],
  sourceUrl: "https://example.org/son-doong",
} as unknown as Destination;

const CTX: AIContext = { locale: "en", country: "vn", destinationId: "d1", destination: DEST };

/** Build an SSE body out of the content deltas a lane would emit. */
function sseResponse(deltas: string[]): Response {
  const frames = deltas
    .map((content) => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`)
    .join("");
  return new Response(`${frames}data: [DONE]\n\n`, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
}

async function collect(gen: AsyncGenerator<string>): Promise<string> {
  let out = "";
  for await (const chunk of gen) out += chunk;
  return out;
}

afterEach(() => vi.unstubAllGlobals());

describe("gatewayProvider.streamChat", () => {
  it("streams content deltas as text", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => sseResponse(["Go in ", "February", "."])));
    const ai = createGatewayProvider(CONFIG);
    expect(await collect(ai.streamChat([{ role: "user", content: "When?" }], CTX))).toBe(
      "Go in February.",
    );
  });

  it("strips <think> blocks even when the tag straddles two chunks", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => sseResponse(["<th", "ink>Draft 1: hmm</thi", "nk>Go in February."])),
    );
    const ai = createGatewayProvider(CONFIG);
    expect(await collect(ai.streamChat([{ role: "user", content: "When?" }], CTX))).toBe(
      "Go in February.",
    );
  });

  it("falls back to grounded template text when the pool is exhausted (429)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("quota_exceeded", { status: 429 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const ai = createGatewayProvider(CONFIG);
    const text = await collect(ai.streamChat([{ role: "user", content: "When should I go?" }], CTX));
    // Whatever it says, it must be the mock's answer built from D1 — never empty.
    expect(text).toContain("February to August");
  });

  it("falls back when a lane returns only reasoning and no answer", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => sseResponse(["<think>all of it</think>"])));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const ai = createGatewayProvider(CONFIG);
    const text = await collect(ai.streamChat([{ role: "user", content: "When?" }], CTX));
    expect(text.length).toBeGreaterThan(0);
  });

  it("never sends max_tokens — thinking tokens would eat it and null the content", async () => {
    const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => sseResponse(["ok"]));
    vi.stubGlobal("fetch", fetchMock);
    await collect(createGatewayProvider(CONFIG).streamChat([{ role: "user", content: "hi" }], CTX));
    const body = JSON.parse(fetchMock.mock.calls[0]![1].body as string) as Record<string, unknown>;
    expect(body.max_tokens).toBeUndefined();
    expect(body.model).toBe("fast"); // a tier, never a model name
  });
});

describe("gatewayProvider.caption", () => {
  // Regression: the tag filter holds back its last characters in case they start a tag, so a
  // non-streamed caption that was only `push`ed lost its final 7 characters — "…và tự hào ✨"
  // arrived as "…và tự h" and looked like the model had been cut off.
  it("keeps the last characters of a clean caption", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({ choices: [{ message: { content: "Chạm tay vào kỳ quan, tự hào ✨" } }] }),
            { status: 200 },
          ),
      ),
    );
    expect(await createGatewayProvider(CONFIG).caption(CTX)).toBe("Chạm tay vào kỳ quan, tự hào ✨");
  });

  it("unwraps quotes and drops extra lines", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({ choices: [{ message: { content: '"Lost in Son Doong ✨"\nAlt: …' } }] }),
            { status: 200 },
          ),
      ),
    );
    const caption = await createGatewayProvider(CONFIG).caption(CTX);
    expect(caption).toBe("Lost in Son Doong ✨");
  });

  it("rejects a caption cut off mid-word by the token budget", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              choices: [
                { message: { content: "Một giấc mơ giữa lòng Sơn Đoòng hùn" }, finish_reason: "length" },
              ],
            }),
            { status: 200 },
          ),
      ),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await createGatewayProvider(CONFIG).caption(CTX)).not.toContain("hùn");
  });

  it("falls back when content is null (reasoning lane, HTTP 200)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ choices: [{ message: { content: null } }] }), { status: 200 }),
      ),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await createGatewayProvider(CONFIG).caption(CTX)).length).toBeGreaterThan(0);
  });
});

describe("buildSystemPrompt", () => {
  it("carries the verified content and its source into the prompt", () => {
    const prompt = buildSystemPrompt(CTX);
    expect(prompt).toContain("Hang Sơn Đoòng");
    expect(prompt).toContain("February to August");
    expect(prompt).toContain("https://example.org/son-doong");
  });

  it("forbids inventing facts and names the answer language", () => {
    expect(buildSystemPrompt(CTX)).toContain("Never invent prices");
    expect(buildSystemPrompt({ ...CTX, locale: "ko" })).toContain("Write in Korean");
  });

  it("marks an empty selection instead of leaving the model to fill the gap", () => {
    expect(buildSystemPrompt({ locale: "vi" })).toContain("(nothing selected)");
  });
});
