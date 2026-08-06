import type { CountryCode, Destination, ProvinceBundle } from "@/lib/types";
import type { AIContext } from "./types";

/**
 * Prompt construction for the real provider (Bible 010 §5 grounded answers).
 *
 * The atlas's whole claim to trustworthy advice is that every fact it states comes from D1
 * content that was verified against a source (see docs/031 provenance). So the model is given
 * that content verbatim and told it may not go beyond it — a wrong opening time invented by an
 * LLM costs a real traveller a wasted morning, and no amount of fluent prose makes up for it.
 */

const LANGUAGE: Record<string, string> = {
  vi: "Vietnamese",
  en: "English",
  ko: "Korean",
  ja: "Japanese",
  zh: "Simplified Chinese",
};

/** Non-empty lines only — an empty field in D1 must not become a blank bullet the model fills in. */
function line(label: string, value: string | undefined | null): string[] {
  const v = value?.trim();
  return v ? [`${label}: ${v}`] : [];
}

function list(label: string, values: string[] | undefined): string[] {
  const v = values?.filter((s) => s?.trim());
  return v?.length ? [`${label}: ${v.join(" | ")}`] : [];
}

/**
 * Where travellers arrive from. "How far is this from Hanoi?" is one of the most common
 * questions, and the answer is computable from data we already hold — every destination in D1
 * carries lng/lat. Leaving it out made the guide say "I don't have that" about something it
 * could derive exactly.
 */
const HUBS: Record<CountryCode, { name: string; lng: number; lat: number }[]> = {
  vn: [
    { name: "Hà Nội", lng: 105.8342, lat: 21.0278 },
    { name: "Đà Nẵng", lng: 108.2208, lat: 16.0544 },
    { name: "TP. Hồ Chí Minh", lng: 106.6297, lat: 10.8231 },
  ],
  kr: [
    { name: "Seoul", lng: 126.978, lat: 37.5665 },
    { name: "Busan", lng: 129.0756, lat: 35.1796 },
  ],
};

/** Great-circle distance in km. */
function haversineKm(aLng: number, aLat: number, bLng: number, bLat: number): number {
  const R = 6371;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(bLat - aLat);
  const dLng = rad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Straight-line only. Road distance is meaningfully longer on mountain routes (Mù Cang Chải is
 * ~230 km as the crow flies but ~280 km by QL32), so the label has to say so — a guide that
 * passes this off as travel distance sends people out with the wrong plan.
 */
function describeDistances(d: Destination, country: CountryCode): string[] {
  const hubs = HUBS[country];
  if (!hubs) return [];
  const parts = hubs.map((h) => `~${Math.round(haversineKm(h.lng, h.lat, d.lng, d.lat))} km from ${h.name}`);
  return [
    `Straight-line distance: ${parts.join(" | ")}`,
    // The rule sits next to the data it governs. Stated only in the distant rules section, a
    // small lane read "~200 km from Hà Nội" and volunteered "4-5 hours by motorbike" — a number
    // nobody verified, attached to a mountain road it knows nothing about.
    "  ^ These are great-circle distances. The road is longer and you do not know by how much. NEVER turn them into a travel time, a route, or a road distance.",
  ];
}

function describeDestination(d: Destination, country: CountryCode): string {
  return [
    `## ${d.name}`,
    ...line("Coordinates", `${d.lat.toFixed(4)}, ${d.lng.toFixed(4)}`),
    ...describeDistances(d, country),
    ...line("Summary", d.summary),
    ...line("Story", d.story),
    ...line("Best time", d.bestTime),
    ...line("Typical visit duration", d.visitDuration),
    ...line("Ticket", d.ticket || "free"),
    ...line("Opening hours", d.openingHours),
    ...list("Facts", d.facts),
    ...list("Travel tips", d.travelTips),
    ...list("Tags", d.tags),
    ...line("Source", d.sourceUrl),
    ...line("Verified at", d.verifiedAt),
  ].join("\n");
}

function describeProvince(b: ProvinceBundle): string {
  const nearby = b.destinations.slice(0, 12).map((d) => `${d.name} (${d.type})`);
  return [
    `## ${b.meta.name} — ${b.meta.regionName}`,
    ...line("Summary", b.content?.summary),
    ...line("Story", b.content?.story),
    ...line("Best time", b.content?.bestTime),
    ...list("Local specialties", b.content?.specialties),
    ...list("Destinations in this province", nearby),
  ].join("\n");
}

/** The grounding block. Empty string when nothing is selected — the caller must handle that. */
export function buildContextBlock(ctx: AIContext): string {
  const parts: string[] = [];
  const country = ctx.country ?? "vn";
  if (ctx.destination) parts.push(describeDestination(ctx.destination, country));
  if (ctx.provinceBundle) parts.push(describeProvince(ctx.provinceBundle));
  return parts.join("\n\n");
}

/**
 * Emitted by the model when the atlas cannot answer, so the caller can retry on a search-capable
 * lane. Those lanes are a thin slice of the pool (429s easily), so the common case must not touch
 * them — hence a signal rather than enabling search on every request.
 */
export const NEED_SEARCH = "NEED_SEARCH";

export type PromptMode = "atlas" | "web";

export function buildSystemPrompt(ctx: AIContext, mode: PromptMode = "atlas"): string {
  const language = LANGUAGE[ctx.locale] ?? "English";
  const context = buildContextBlock(ctx);

  if (mode === "web") {
    return [
      "You are the travel guide inside an interactive tourism atlas. The atlas's own verified content did not cover the traveller's question, so you are answering from a web search.",
      "",
      `Reply in the same language the traveller wrote their last message in. If that is unclear, use ${language}.`,
      "",
      "- Search for the answer, then state it plainly in 2-4 short sentences.",
      "- Name the site you got it from, in the sentence itself (\"theo VnExpress…\", \"according to…\").",
      "- Say the figure is from the web rather than from the atlas's own verified data, and that it can change.",
      "- If the search does not settle it, say so — do not fill the gap from memory.",
      "",
      "# What the atlas does have (use it for context, and prefer it where it overlaps)",
      context || "(nothing selected)",
    ].join("\n");
  }

  return [
    "You are the travel guide inside an interactive tourism atlas. A traveller is looking at a place on the map and asking you about it.",
    "",
    `Reply in the same language the traveller wrote their last message in. If that is unclear, use ${language}. Place names may stay in their original language when that is how travellers will see them on signs.`,
    "",
    "# Grounding rules",
    "- Everything factual you state must come from the CONTEXT below. It is editorial content that was verified against a source.",
    "- Never invent prices, opening hours, phone numbers, or travel times. If the context does not have it, say plainly that you do not have that detail.",
    "- The context gives straight-line distances. Quote them as such. Do not convert one into a driving time or a road distance — that depends on the route and you were not given it.",
    "- You may reason and connect what the context gives you (e.g. suggest an order to visit places listed there), and you may use general travel common sense about weather and packing — but do not present anything as a fact about this specific place unless the context says so.",
    "- When you cannot answer something, do not stop there: say what you do have that is close, so the traveller gets somewhere useful.",
    "- If the context is empty or unrelated to the question, say so and invite the traveller to pick a place on the map.",
    "",
    "# When the atlas simply does not have it",
    `If answering would need a fact the CONTEXT does not contain — a price, a travel time, an opening hour, current conditions — reply with exactly \`${NEED_SEARCH}\` and nothing else. Do not apologise, do not explain, do not add a partial answer. Someone will look it up and take over.`,
    `Only do this when the missing fact IS the question. If you can answer well from the context, answer — do not reach for ${NEED_SEARCH} to be safe.`,
    "",
    "# Style",
    "- Answer in 2-4 short sentences. This is a chat panel on a phone, not an article.",
    "- Lead with the answer. No preamble, no restating the question, no bullet lists unless the traveller asked for a plan.",
    "- Warm and specific, like a local friend. No marketing adjectives.",
    "",
    "# CONTEXT",
    context || "(nothing selected)",
  ].join("\n");
}

/** Caption generation is a separate, tiny task — its own prompt keeps it from picking up guide tone. */
export function buildCaptionPrompt(ctx: AIContext): string {
  const language = LANGUAGE[ctx.locale] ?? "English";
  const name = ctx.destination?.name ?? ctx.destinationName ?? "";
  return [
    `Write one short social-media caption in ${language} for a traveller who just checked in at ${name || "a place in this atlas"}.`,
    "One sentence, under 15 words, warm, no hashtags, at most one emoji.",
    "Return only the caption text — no quotes, no explanation, no alternatives.",
    ctx.destination?.summary ? `\nAbout the place: ${ctx.destination.summary}` : "",
  ].join("\n");
}
