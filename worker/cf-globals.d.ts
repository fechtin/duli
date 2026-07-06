// Minimal ambient declarations for the Cloudflare Workers runtime globals we use.
// The project doesn't install @cloudflare/workers-types; wrangler bundles the worker
// and the runtime provides these. Kept intentionally small — just what worker/ touches.

interface HTMLRewriterElement {
  setInnerContent(content: string, opts?: { html?: boolean }): HTMLRewriterElement;
  setAttribute(name: string, value: string): HTMLRewriterElement;
  append(content: string, opts?: { html?: boolean }): HTMLRewriterElement;
}

interface HTMLRewriterHandlers {
  element?: (element: HTMLRewriterElement) => void;
}

declare class HTMLRewriter {
  on(selector: string, handlers: HTMLRewriterHandlers): HTMLRewriter;
  transform(response: Response): Response;
}

interface R2Object {
  body: ReadableStream;
  writeHttpMetadata(headers: Headers): void;
}

interface R2Bucket {
  get(key: string): Promise<R2Object | null>;
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | string,
    opts?: { httpMetadata?: { contentType?: string } },
  ): Promise<R2Object>;
}
