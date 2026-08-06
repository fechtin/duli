import { mockProvider } from "./mockProvider";
import { NEED_SEARCH, buildCaptionPrompt, buildSystemPrompt } from "./prompt";
import type { AIContext, AIMessage, AIProvider } from "./types";

/**
 * Real AI through the Fechtin Gateway (../fechtin-gateway/docs/agent-guide.en.md).
 *
 * The gateway is OpenAI-compatible, so this is a plain fetch — no vendor SDK in the Worker
 * bundle. It runs ONLY in the Worker: the API key never reaches the browser (Bible 015 §2).
 *
 * Every failure degrades to `mockProvider` rather than surfacing an error. That is safe here
 * because the mock is templated from the same verified D1 content — a traveller gets a shorter
 * answer, never a wrong one. The failure is logged so a dead pool is still visible in `wrangler
 * tail` instead of hiding behind a plausible reply.
 */

export interface GatewayConfig {
  /** e.g. https://gw.fechtin.com/v1 */
  baseUrl: string;
  apiKey: string;
  /** Tier, never a model name — free-tier model names die without warning (guide §2.1). */
  tier?: string;
}

interface ChatChoice {
  message?: { content?: string | null };
  delta?: { content?: string | null };
  finish_reason?: string | null;
}

/**
 * Some lanes leak their reasoning into `content` as `<think>…</think>` (guide §6.2). The
 * gateway strips this for Google lanes but does not guarantee it for the rest, so filter before
 * anything reaches a user. Stateful because a tag can straddle two stream chunks.
 */
class ThinkFilter {
  private buf = "";
  private inside = false;

  private static readonly OPEN = "<think>";
  private static readonly CLOSE = "</think>";
  /** Longest prefix of either tag that could still be completed by the next chunk. */
  private static readonly HOLD = ThinkFilter.CLOSE.length - 1;

  push(chunk: string): string {
    this.buf += chunk;
    let out = "";

    for (;;) {
      if (this.inside) {
        const end = this.buf.indexOf(ThinkFilter.CLOSE);
        if (end === -1) {
          this.buf = this.buf.slice(-ThinkFilter.HOLD);
          return out;
        }
        this.buf = this.buf.slice(end + ThinkFilter.CLOSE.length);
        this.inside = false;
        continue;
      }

      const start = this.buf.indexOf(ThinkFilter.OPEN);
      if (start === -1) break;
      out += this.buf.slice(0, start);
      this.buf = this.buf.slice(start + ThinkFilter.OPEN.length);
      this.inside = true;
    }

    // Hold back a tail that could be the start of a tag; emit the rest.
    const safe = Math.max(0, this.buf.length - ThinkFilter.HOLD);
    out += this.buf.slice(0, safe);
    this.buf = this.buf.slice(safe);
    return out;
  }

  flush(): string {
    const rest = this.inside ? "" : this.buf;
    this.buf = "";
    return rest;
  }
}

/**
 * Filter a complete, non-streamed string. `push` alone holds back the last few characters in
 * case they are the start of a tag split across chunks — forgetting `flush` silently truncates
 * every answer by up to 7 characters, which reads exactly like a model cutting off mid-word.
 */
function stripThinking(text: string): string {
  const filter = new ThinkFilter();
  return filter.push(text) + filter.flush();
}

/**
 * The gateway's own failover budget is 90s (guide §6.4). A streamed answer can use it, because
 * the traveller sees words appear meanwhile. A non-streamed one cannot: a measured run took 34s
 * on a reasoning lane, which is a dead button. Give up earlier and serve the template instead.
 */
const BLOCKING_TIMEOUT_MS = 12_000;
const STREAM_TIMEOUT_MS = 90_000;

export function createGatewayProvider(config: GatewayConfig): AIProvider {
  const tier = config.tier ?? "fast";

  /**
   * Read just far enough to tell whether the model asked for a search, WITHOUT consuming the
   * stream — a `for await` that breaks would close the generator and throw the answer away.
   * The cost is holding back the first few characters; the alternative is the sentinel flashing
   * on screen before we can retract it.
   */
  async function peekForSearchSignal(
    gen: AsyncGenerator<string>,
  ): Promise<{ needsSearch: boolean; head: string; rest: AsyncGenerator<string> }> {
    let head = "";
    while (head.trimStart().length < NEED_SEARCH.length) {
      const next = await gen.next();
      if (next.done) break;
      head += next.value;
    }
    if (head.trimStart().startsWith(NEED_SEARCH)) {
      await gen.return(undefined as never); // close the upstream response
      return { needsSearch: true, head: "", rest: gen };
    }
    return { needsSearch: false, head, rest: gen };
  }

  async function call(body: Record<string, unknown>, timeoutMs: number): Promise<Response> {
    const res = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      signal: AbortSignal.timeout(timeoutMs),
      // No `max_tokens`: thinking tokens are charged against it, and a small budget gets fully
      // consumed by thought, leaving `content: null` (guide §6.1).
      body: JSON.stringify({ model: tier, ...body }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      // 429 means the WHOLE pool is exhausted — the gateway already tried every lane, so an
      // immediate retry is pointless (guide §2.2). Fall through to the mock.
      throw new Error(`gateway ${res.status}: ${detail.slice(0, 200)}`);
    }
    return res;
  }

  /** Log which lane actually answered — without it a bad reply is undebuggable (guide §2.3). */
  function logLane(res: Response, label: string): void {
    console.log(
      `[ai:${label}] model=${res.headers.get("x-fechtin-model")} ` +
        `lane=${res.headers.get("x-fechtin-lane")} ` +
        `tier=${res.headers.get("x-fechtin-tier-served")} ` +
        `cache=${res.headers.get("x-fechtin-cache") ?? "miss"}`,
    );
  }

  async function* streamCompletion(
    messages: { role: string; content: string }[],
    label: string,
    search = false,
  ): AsyncGenerator<string> {
    // `fechtin_search` narrows the pool to lanes that declare `search`; the gateway never
    // silently falls back to one that cannot search, so a thin pool surfaces as 429 rather than
    // as a fabricated answer the traveller would believe was sourced.
    const res = await call({ messages, stream: true, ...(search && { fechtin_search: true }) }, STREAM_TIMEOUT_MS);
    logLane(res, label);

    const reader = res.body?.getReader();
    if (!reader) throw new Error("gateway returned no body");

    const decoder = new TextDecoder();
    const think = new ThinkFilter();
    let sse = "";
    let emitted = false;

    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      sse += decoder.decode(value, { stream: true });

      // SSE frames are newline-delimited; keep the trailing partial line for the next read.
      const lines = sse.split("\n");
      sse = lines.pop() ?? "";

      for (const raw of lines) {
        const trimmed = raw.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") continue;

        let chunk: { choices?: ChatChoice[] };
        try {
          chunk = JSON.parse(payload) as { choices?: ChatChoice[] };
        } catch {
          continue; // a keep-alive or a frame we do not understand
        }

        // `reasoning_content` arrives on its own channel and is deliberately ignored (guide §4.2).
        const delta = chunk.choices?.[0]?.delta?.content;
        if (!delta) continue;
        const text = think.push(delta);
        if (text) {
          emitted = true;
          yield text;
        }
      }
    }

    const tail = think.flush();
    if (tail) {
      emitted = true;
      yield tail;
    }
    // A stream that produced only reasoning is a failed answer, not an empty one.
    if (!emitted) throw new Error("gateway stream produced no content");
  }

  return {
    async *streamChat(messages: AIMessage[], ctx: AIContext) {
      const turns = messages.map((m) => ({ role: m.role, content: m.content }));
      const withSystem = (mode: "atlas" | "web") => [
        { role: "system", content: buildSystemPrompt(ctx, mode) },
        ...turns,
      ];

      try {
        // Pass 1 on the full pool. Most questions are answerable from D1 and stop here.
        const { needsSearch, head, rest } = await peekForSearchSignal(
          streamCompletion(withSystem("atlas"), "chat"),
        );
        if (!needsSearch) {
          if (head) yield head;
          yield* rest;
          return;
        }

        // Pass 2: the atlas genuinely lacks it, so pay the thin search pool.
        try {
          yield* streamCompletion(withSystem("web"), "chat:search", true);
        } catch (err) {
          // No search lane free (429) — answer from the atlas and be honest about the gap
          // rather than dropping the traveller into a templated non-answer.
          console.error("[ai:chat] search unavailable, answering from atlas only:", err);
          yield* streamCompletion(withSystem("atlas").concat({
            role: "system",
            content: `Search is unavailable. Do not reply with ${NEED_SEARCH}. Answer from the CONTEXT, and say plainly which part you do not have.`,
          }), "chat:no-search");
        }
      } catch (err) {
        console.error("[ai:chat] falling back to mock:", err);
        yield* mockProvider.streamChat(messages, ctx);
      }
    },

    async *summary(ctx: AIContext) {
      const payload = [
        { role: "system", content: buildSystemPrompt(ctx) },
        {
          role: "user",
          content:
            "Introduce this place to a traveller who just opened it on the map: what it is, why it is worth the trip, and when to come. Two or three sentences, no heading.",
        },
      ];
      try {
        yield* streamCompletion(payload, "summary");
      } catch (err) {
        console.error("[ai:summary] falling back to mock:", err);
        yield* mockProvider.summary(ctx);
      }
    },

    // Purely local: derived from context data, no model call, no latency, no quota.
    suggestions: mockProvider.suggestions,

    async caption(ctx: AIContext) {
      try {
        const res = await call(
          { messages: [{ role: "user", content: buildCaptionPrompt(ctx) }] },
          BLOCKING_TIMEOUT_MS,
        );
        logLane(res, "caption");
        const json = (await res.json()) as { choices?: ChatChoice[] };
        const choice = json.choices?.[0];
        // Half a caption is worse than a templated one. Note `finish_reason` is not a complete
        // signal — some lanes cut a sentence short and still report "stop".
        if (choice?.finish_reason === "length") throw new Error("caption truncated");
        // `content` can be null on reasoning lanes even with HTTP 200 (guide §6.1/2.4).
        const raw = choice?.message?.content;
        const text = raw ? stripThinking(raw).trim() : "";
        if (!text) throw new Error("gateway returned empty caption");
        // Keep the first line (models add "Alt: …" variants despite being told not to), then
        // unwrap the quotes they like to put around a one-liner. Order matters: unwrapping
        // first leaves the closing quote stranded in the middle of the string.
        return text.split("\n")[0].trim().replace(/^["'“”]|["'“”]$/g, "").trim();
      } catch (err) {
        console.error("[ai:caption] falling back to mock:", err);
        return mockProvider.caption(ctx);
      }
    },
  };
}
