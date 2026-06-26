import { mockProvider } from "./mockProvider";
import type { AIProvider } from "./types";

// Provider selection. Today: mock. Later, swap to a Cloudflare AI / OpenAI / Gemini
// provider that implements the same AIProvider interface — no caller changes (Bible 000 §9).
export const ai: AIProvider = mockProvider;

export type { AIContext, AIMessage, AISuggestion, AIProvider } from "./types";
