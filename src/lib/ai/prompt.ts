import type { Destination, ProvinceBundle } from "@/lib/types";
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

function describeDestination(d: Destination): string {
  return [
    `## ${d.name}`,
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
  if (ctx.destination) parts.push(describeDestination(ctx.destination));
  if (ctx.provinceBundle) parts.push(describeProvince(ctx.provinceBundle));
  return parts.join("\n\n");
}

export function buildSystemPrompt(ctx: AIContext): string {
  const language = LANGUAGE[ctx.locale] ?? "English";
  const context = buildContextBlock(ctx);

  return [
    "You are the travel guide inside an interactive tourism atlas. A traveller is looking at a place on the map and asking you about it.",
    "",
    `Write in ${language}. Place names may stay in their original language when that is how travellers will see them on signs.`,
    "",
    "# Grounding rules",
    "- Everything factual you state must come from the CONTEXT below. It is editorial content that was verified against a source.",
    "- Never invent prices, opening hours, transport times, distances, or phone numbers. If the context does not have it, say plainly that you do not have that detail.",
    "- You may reason and connect what the context gives you (e.g. suggest an order to visit places listed there), and you may use general travel common sense about weather and packing — but do not present anything as a fact about this specific place unless the context says so.",
    "- If the context is empty or unrelated to the question, say so and invite the traveller to pick a place on the map.",
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
