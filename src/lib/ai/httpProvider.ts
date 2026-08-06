import { mockProvider } from "./mockProvider";
import type { AIContext, AIMessage, AIProvider } from "./types";

/**
 * Browser-side provider. Talks to the Worker's /api/v1/ai/* endpoints, which hold the gateway
 * key and re-read the grounding content from D1 (Bible 015 §2).
 *
 * Only IDENTIFIERS are sent up, never the content objects the client already has in memory:
 * the Worker must ground on what D1 says, not on whatever a client claims the place is.
 */

const API = "/api/v1";

function body(ctx: AIContext, extra: Record<string, unknown> = {}): string {
  return JSON.stringify({
    locale: ctx.locale,
    country: ctx.country,
    destinationId: ctx.destinationId,
    provinceSlug: ctx.provinceSlug,
    ...extra,
  });
}

async function* readStream(path: string, payload: string): AsyncGenerator<string> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    if (text) yield text;
  }
}

export const httpProvider: AIProvider = {
  async *streamChat(messages: AIMessage[], ctx: AIContext) {
    try {
      yield* readStream("/ai/chat", body(ctx, { messages }));
    } catch (err) {
      console.error("[ai] chat request failed, using local fallback:", err);
      yield* mockProvider.streamChat(messages, ctx);
    }
  },

  async *summary(ctx: AIContext) {
    try {
      yield* readStream("/ai/summary", body(ctx));
    } catch (err) {
      console.error("[ai] summary request failed, using local fallback:", err);
      yield* mockProvider.summary(ctx);
    }
  },

  // Chips are derived from data already loaded — no round trip.
  suggestions: mockProvider.suggestions,

  async caption(ctx: AIContext) {
    try {
      const res = await fetch(`${API}/ai/caption`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body(ctx),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { data?: { caption?: string } };
      const caption = json.data?.caption?.trim();
      if (!caption) throw new Error("empty caption");
      return caption;
    } catch (err) {
      console.error("[ai] caption request failed, using local fallback:", err);
      return mockProvider.caption(ctx);
    }
  },
};
