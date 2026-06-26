import type { Context } from "hono";

// Uniform response envelope (Bible 015 §14) + cache headers (§4).

let seq = 0;
const requestId = () => `req_${Date.now().toString(36)}_${(seq++).toString(36)}`;

export function ok<T>(c: Context, data: T, cacheSeconds = 300) {
  c.header("Cache-Control", `public, max-age=${cacheSeconds}, stale-while-revalidate=86400`);
  return c.json({
    success: true,
    data,
    meta: null,
    error: null,
    requestId: requestId(),
    timestamp: new Date().toISOString(),
  });
}

export function fail(c: Context, code: string, message: string, status = 400) {
  return c.json(
    {
      success: false,
      data: null,
      meta: null,
      error: { code, message },
      requestId: requestId(),
      timestamp: new Date().toISOString(),
    },
    status as 400 | 404 | 500,
  );
}

/** Stream an async generator of text as a chunked response (Bible 015 §3 streaming). */
export function streamText(gen: AsyncGenerator<string>): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async pull(controller) {
      const { value, done } = await gen.next();
      if (done) controller.close();
      else controller.enqueue(encoder.encode(value));
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
