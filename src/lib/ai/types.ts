import type { Locale } from "@/lib/i18n/dictionaries";
import type { Destination, ProvinceBundle } from "@/lib/types";

export interface AIContext {
  locale: Locale;
  provinceSlug?: string;
  destinationId?: string;
  provinceName?: string;
  destinationName?: string;
  /** Grounding content passed in by the caller (keeps the provider data-source agnostic). */
  destination?: Destination;
  provinceBundle?: ProvinceBundle;
}

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AISuggestion {
  label: string;
  prompt: string;
}

/**
 * Provider abstraction (Bible 000 §9, 010 §18). Swapping the mock for Cloudflare AI /
 * OpenAI / Gemini must not change any calling code.
 */
export interface AIProvider {
  /** Stream an answer token-by-token (Bible 010 §13). */
  streamChat(messages: AIMessage[], ctx: AIContext): AsyncGenerator<string>;
  /** Contextual ~80-word summary (Bible 009 §AI Summary). */
  summary(ctx: AIContext): AsyncGenerator<string>;
  /** Proactive suggestion chips for the current context (Bible 010 §7). */
  suggestions(ctx: AIContext): AISuggestion[];
  /** Share caption for a check-in (Bible 010 §10). */
  caption(ctx: AIContext): Promise<string>;
}
