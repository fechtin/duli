import { Hono } from "hono";
import { cors } from "hono/cors";
import * as db from "./db";
import type { D1Like } from "./db";
import { ai } from "../src/lib/ai";
import type { AIContext, AIMessage } from "../src/lib/ai";
import type { Locale } from "../src/lib/i18n/dictionaries";
import { ok, fail, streamText } from "./respond";

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  DB: D1Like;
}

const app = new Hono<{ Bindings: Env }>();
const api = app.basePath("/api/v1");
api.use("*", cors());

api.get("/health", (c) => ok(c, { status: "ok" }, 0));

// ── Content from D1 (Bible 013/015) ───────────────────────
api.get("/regions", async (c) => ok(c, await db.getRegions(c.env.DB), 3600));
api.get("/provinces", async (c) => ok(c, await db.getProvinces(c.env.DB), 3600));
api.get("/destinations", async (c) => ok(c, await db.getDestinationsLight(c.env.DB), 600));

api.get("/province/:slug", async (c) => {
  const bundle = await db.getProvinceBundle(c.env.DB, c.req.param("slug"));
  return bundle ? ok(c, bundle, 600) : fail(c, "not_found", "Province not found", 404);
});

api.get("/destination/:id", async (c) => {
  const d = await db.getDestination(c.env.DB, c.req.param("id"));
  return d ? ok(c, d, 600) : fail(c, "not_found", "Destination not found", 404);
});

// ── Search (basic LIKE; the client does diacritic-tolerant ranking) ──
api.get("/search", async (c) => {
  const q = (c.req.query("q") ?? "").toLowerCase().trim();
  if (!q) return ok(c, [], 60);
  const like = `%${q}%`;
  const provinces = await c.env.DB.prepare(
    "SELECT slug, name, region_name FROM provinces WHERE lower(name) LIKE ? OR lower(name_en) LIKE ? LIMIT 6",
  )
    .bind(like, like)
    .all<{ slug: string; name: string; region_name: string }>();
  const dests = await c.env.DB.prepare(
    "SELECT id, name, province_slug FROM destinations WHERE lower(name) LIKE ? OR lower(name_en) LIKE ? LIMIT 8",
  )
    .bind(like, like)
    .all<{ id: string; name: string; province_slug: string }>();
  const results = [
    ...provinces.results.map((p) => ({ kind: "province", id: p.slug, title: p.name, subtitle: p.region_name, provinceSlug: p.slug })),
    ...dests.results.map((d) => ({ kind: "destination", id: d.id, title: d.name, subtitle: "", provinceSlug: d.province_slug })),
  ];
  return ok(c, results, 60);
});

// ── AI (always streaming; content fetched from D1 + passed into the provider) ──
async function aiContext(env: Env, body: Record<string, unknown>): Promise<AIContext> {
  const destinationId = body.destinationId as string | undefined;
  const destination = destinationId ? (await db.getDestination(env.DB, destinationId)) ?? undefined : undefined;
  const provinceSlug = (body.provinceSlug as string | undefined) ?? destination?.provinceSlug;
  const provinceBundle = provinceSlug ? (await db.getProvinceBundle(env.DB, provinceSlug)) ?? undefined : undefined;
  return { locale: (body.locale as Locale) ?? "vi", destinationId, provinceSlug, destination, provinceBundle };
}

api.post("/ai/chat", async (c) => {
  const body = await c.req.json<{ messages: AIMessage[] } & Record<string, unknown>>();
  return streamText(ai.streamChat(body.messages ?? [], await aiContext(c.env, body)));
});

api.post("/ai/summary", async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  return streamText(ai.summary(await aiContext(c.env, body)));
});

api.post("/ai/caption", async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  return ok(c, { caption: await ai.caption(await aiContext(c.env, body)) }, 0);
});

api.notFound((c) => fail(c, "not_found", "Unknown endpoint", 404));

// Everything else → static SPA assets.
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
