import { Hono } from "hono";
import { cors } from "hono/cors";
import * as db from "./db";
import type { D1Like } from "./db";
import { mockProvider } from "../src/lib/ai";
import { createGatewayProvider } from "../src/lib/ai/gatewayProvider";
import type { AIContext, AIMessage, AIProvider } from "../src/lib/ai";
import type { Locale } from "../src/lib/i18n/dictionaries";
import { ok, fail, streamText } from "./respond";
import { buildMeta, injectMeta } from "./meta";

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  DB: D1Like;
  UPLOADS: R2Bucket;
  FIREBASE_PROJECT_ID: string;
  /** Fechtin AI Gateway — OpenAI-compatible pool. Set via `wrangler secret put`. */
  FECHTIN_GATEWAY_URL?: string;
  FECHTIN_GATEWAY_KEY?: string;
}

// ── Firebase JWT verification via Google JWKS ──────────────────
const JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

// Module-level cache: {keys, fetchedAt}
let jwksCache: { keys: Record<string, CryptoKey>; at: number } | null = null;

async function getJwks(): Promise<Record<string, CryptoKey>> {
  const now = Date.now();
  if (jwksCache && now - jwksCache.at < 3_600_000) return jwksCache.keys;

  const res = await fetch(JWKS_URL);
  const { keys } = await res.json() as { keys: (JsonWebKey & { kid: string })[] };
  const imported: Record<string, CryptoKey> = {};
  await Promise.all(
    keys.map(async (jwk) => {
      imported[jwk.kid] = await crypto.subtle.importKey(
        "jwk",
        jwk,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["verify"],
      );
    }),
  );
  jwksCache = { keys: imported, at: now };
  return imported;
}

async function verifyFirebaseToken(token: string, projectId: string): Promise<string | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const header = JSON.parse(atob(parts[0])) as { kid: string; alg: string };
    const payloadRaw = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(payloadRaw)) as {
      sub: string; aud: string; iss: string; exp: number; iat: number;
    };

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;
    if (payload.aud !== projectId) return null;
    if (payload.iss !== `https://securetoken.google.com/${projectId}`) return null;

    const keys = await getJwks();
    const key = keys[header.kid];
    if (!key) return null;

    const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const sig = Uint8Array.from(atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")), (c) =>
      c.charCodeAt(0),
    );
    const valid = await crypto.subtle.verify({ name: "RSASSA-PKCS1-v1_5" }, key, sig, data);
    return valid ? payload.sub : null;
  } catch {
    return null;
  }
}

async function requireAuth(c: { req: { header: (k: string) => string | undefined }; env: Env }): Promise<string | null> {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const projectId = c.env.FIREBASE_PROJECT_ID ?? "fechtingo";
  return verifyFirebaseToken(token, projectId);
}

// ── App ────────────────────────────────────────────────────────
const app = new Hono<{ Bindings: Env }>();
const api = app.basePath("/api/v1");
api.use("*", cors());

api.get("/health", (c) => ok(c, { status: "ok" }, 0));

// ── Content from D1 ───────────────────────────────────────────
const loc = (c: { req: { query: (k: string) => string | undefined } }) => c.req.query("locale");
/** Which atlas the request is about; Vietnam stays the default so old clients keep working. */
const cty = (c: { req: { query: (k: string) => string | undefined } }) => {
  const q = c.req.query("country");
  return q === "kr" ? "kr" : "vn";
};

api.get("/regions", async (c) => ok(c, await db.getRegions(c.env.DB, cty(c)), 3600));
api.get("/provinces", async (c) => ok(c, await db.getProvinces(c.env.DB, loc(c), cty(c)), 3600));
api.get("/destinations", async (c) => ok(c, await db.getDestinationsLight(c.env.DB, loc(c), cty(c)), 600));

api.get("/province/:slug", async (c) => {
  const bundle = await db.getProvinceBundle(c.env.DB, c.req.param("slug"), loc(c), cty(c));
  return bundle ? ok(c, bundle, 600) : fail(c, "not_found", "Province not found", 404);
});

api.get("/destination/:id", async (c) => {
  const d = await db.getDestination(c.env.DB, c.req.param("id"), loc(c), cty(c));
  return d ? ok(c, d, 600) : fail(c, "not_found", "Destination not found", 404);
});

// ── Food Explorer (Bible 026) ─────────────────────────────────
api.get("/food/dishes", async (c) =>
  ok(c, await db.getDishes(c.env.DB, c.req.query("province") || undefined, loc(c), cty(c)), 86400),
);

api.get("/food/dish/:id", async (c) => {
  const d = await db.getDish(c.env.DB, c.req.param("id"), loc(c), cty(c));
  return d ? ok(c, d, 43200) : fail(c, "not_found", "Dish not found", 404);
});

// ── Search ────────────────────────────────────────────────────
api.get("/search", async (c) => {
  const q = (c.req.query("q") ?? "").toLowerCase().trim();
  if (!q) return ok(c, [], 60);
  const like = `%${q}%`;
  const country = cty(c);
  const provinces = await c.env.DB.prepare(
    "SELECT slug, name, region_name FROM provinces WHERE country = ? AND (lower(name) LIKE ? OR lower(name_en) LIKE ?) LIMIT 6",
  )
    .bind(country, like, like)
    .all<{ slug: string; name: string; region_name: string }>();
  const dests = await c.env.DB.prepare(
    "SELECT id, name, province_slug FROM destinations WHERE country = ? AND (lower(name) LIKE ? OR lower(name_en) LIKE ?) LIMIT 8",
  )
    .bind(country, like, like)
    .all<{ id: string; name: string; province_slug: string }>();
  const dishRows = await c.env.DB.prepare(
    "SELECT id, name, emoji, origin_province FROM dishes WHERE country = ? AND (lower(name) LIKE ? OR lower(name_en) LIKE ?) LIMIT 5",
  )
    .bind(country, like, like)
    .all<{ id: string; name: string; emoji: string | null; origin_province: string | null }>();
  return ok(c, [
    ...provinces.results.map((p) => ({ kind: "province", id: p.slug, title: p.name, subtitle: p.region_name, provinceSlug: p.slug })),
    ...dests.results.map((d) => ({ kind: "destination", id: d.id, title: d.name, subtitle: "", provinceSlug: d.province_slug })),
    ...dishRows.results.map((d) => ({ kind: "dish", id: d.id, title: `${d.emoji ?? "🍽️"} ${d.name}`, subtitle: "Ẩm thực", provinceSlug: d.origin_province ?? "" })),
  ], 60);
});

// ── AI ────────────────────────────────────────────────────────
/**
 * Real answers come from the Fechtin Gateway; without credentials the templated mock still
 * serves, so local dev needs no key and a missing secret degrades instead of 500ing.
 * Built per request — Workers isolates are reused, but `env` is only available here.
 */
function aiProvider(env: Env): AIProvider {
  if (!env.FECHTIN_GATEWAY_KEY) return mockProvider;
  return createGatewayProvider({
    baseUrl: env.FECHTIN_GATEWAY_URL ?? "https://gw.fechtin.com/v1",
    apiKey: env.FECHTIN_GATEWAY_KEY,
  });
}

/** Content is looked up here, from D1 — the client sends ids only, never the facts themselves. */
async function aiContext(env: Env, body: Record<string, unknown>): Promise<AIContext> {
  const country = body.country === "kr" ? "kr" : "vn";
  const locale = (body.locale as Locale) ?? "vi";
  const destinationId = body.destinationId as string | undefined;
  const destination = destinationId
    ? (await db.getDestination(env.DB, destinationId, locale, country)) ?? undefined
    : undefined;
  const provinceSlug = (body.provinceSlug as string | undefined) ?? destination?.provinceSlug;
  const provinceBundle = provinceSlug
    ? (await db.getProvinceBundle(env.DB, provinceSlug, locale, country)) ?? undefined
    : undefined;
  return { locale, country, destinationId, provinceSlug, destination, provinceBundle };
}

/** A chat panel needs a few turns of memory, not an unbounded transcript to pay for. */
const MAX_TURNS = 12;
const MAX_CHARS = 2000;

function sanitizeMessages(input: unknown): AIMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((m): m is AIMessage => {
      const r = (m as AIMessage)?.role;
      return (r === "user" || r === "assistant") && typeof (m as AIMessage).content === "string";
    })
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
}

api.post("/ai/chat", async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const messages = sanitizeMessages(body.messages);
  if (!messages.length) return fail(c, "bad_request", "No messages", 400);
  return streamText(aiProvider(c.env).streamChat(messages, await aiContext(c.env, body)));
});
api.post("/ai/summary", async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  return streamText(aiProvider(c.env).summary(await aiContext(c.env, body)));
});
api.post("/ai/caption", async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  return ok(c, { caption: await aiProvider(c.env).caption(await aiContext(c.env, body)) }, 0);
});

// ── File uploads → R2 ────────────────────────────────────────
api.post("/upload", async (c) => {
  const form = await c.req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return fail(c, "bad_request", "No file", 400);
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  if (!["jpg", "jpeg", "png", "webp", "gif"].includes(ext))
    return fail(c, "bad_request", "Unsupported file type", 400);
  if (file.size > 10 * 1024 * 1024)
    return fail(c, "bad_request", "File too large (max 10 MB)", 400);
  const prefix = (form.get("prefix") as string | null) ?? "uploads";
  const key = `${prefix}/${crypto.randomUUID()}.${ext}`;
  await c.env.UPLOADS.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "image/jpeg" },
  });
  return ok(c, { url: `/api/v1/uploads/${key}` }, 0);
});

api.get("/uploads/*", async (c) => {
  const key = c.req.path.replace("/api/v1/uploads/", "");
  const obj = await c.env.UPLOADS.get(key);
  if (!obj) return fail(c, "not_found", "File not found", 404);
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(obj.body, { headers });
});

// ── User checkins (requires Firebase auth) ────────────────────
interface CheckinRow {
  id: string;
  destination_id: string;
  destination_name: string;
  province_slug: string;
  caption: string;
  photo_seed: string;
  photo_url: string | null;
  created_at: number;
  country: string;
}

api.get("/me/checkins", async (c) => {
  const uid = await requireAuth(c);
  if (!uid) return fail(c, "unauthorized", "Login required", 401);

  const rows = await c.env.DB.prepare(
    "SELECT id, destination_id, destination_name, province_slug, caption, photo_seed, photo_url, created_at, country FROM checkins WHERE uid = ? ORDER BY created_at DESC",
  )
    .bind(uid)
    .all<CheckinRow>();

  const checkins = rows.results.map((r) => ({
    id: r.id,
    country: r.country ?? "vn",
    destinationId: r.destination_id,
    destinationName: r.destination_name,
    provinceSlug: r.province_slug,
    caption: r.caption,
    photoSeed: r.photo_seed,
    photoUrl: r.photo_url ?? undefined,
    createdAt: r.created_at,
  }));
  return ok(c, checkins, 0);
});

api.post("/me/checkins", async (c) => {
  const uid = await requireAuth(c);
  if (!uid) return fail(c, "unauthorized", "Login required", 401);

  const body = await c.req.json<{
    id: string; destinationId: string; destinationName: string;
    provinceSlug: string; caption: string; photoSeed: string;
    photoUrl?: string; createdAt: number; country?: string;
  }>();

  await c.env.DB.prepare(
    `INSERT OR REPLACE INTO checkins
       (id, uid, destination_id, destination_name, province_slug, caption, photo_seed, photo_url, created_at, country)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      body.id, uid, body.destinationId, body.destinationName,
      body.provinceSlug, body.caption, body.photoSeed,
      body.photoUrl ?? null, body.createdAt, body.country === "kr" ? "kr" : "vn",
    )
    .all();

  return ok(c, { ok: true }, 0);
});

api.delete("/me/checkins/:id", async (c) => {
  const uid = await requireAuth(c);
  if (!uid) return fail(c, "unauthorized", "Login required", 401);
  await c.env.DB.prepare("DELETE FROM checkins WHERE id = ? AND uid = ?")
    .bind(c.req.param("id"), uid)
    .all();
  return ok(c, { ok: true }, 0);
});

api.notFound((c) => fail(c, "not_found", "Unknown endpoint", 404));

app.all("*", async (c) => {
  const url = new URL(c.req.url);
  const first = url.pathname.split("/").filter(Boolean)[0];
  // Links minted before the country prefix (/{province}/…) are indexed and shared — send
  // crawlers to the canonical /vn/… form instead of letting them 404 into the SPA.
  if (first && first !== "vn" && first !== "kr" && !first.includes(".")) {
    const row = await c.env.DB.prepare("SELECT slug FROM provinces WHERE slug = ? AND country = 'vn'")
      .bind(first)
      .first<{ slug: string }>();
    if (row) return c.redirect(`/vn${url.pathname}${url.search}`, 301);
  }

  const res = await c.env.ASSETS.fetch(c.req.raw);
  // Only touch the SPA shell (index.html); static assets pass through untouched.
  if (!(res.headers.get("content-type") ?? "").includes("text/html")) return res;
  const meta = await buildMeta(c.env, new URL(c.req.url));
  return meta ? injectMeta(res, meta) : res;
});

export default app;
