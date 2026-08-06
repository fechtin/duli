import { httpProvider } from "./httpProvider";
import type { AIProvider } from "./types";

// Browser-side provider. It calls the Worker, which owns the gateway key and does the real
// model call (see gatewayProvider.ts). The Worker imports its provider directly — never this
// module — so no gateway code or credential can end up in the client bundle.
export const ai: AIProvider = httpProvider;

// `createGatewayProvider` is deliberately NOT re-exported here: the Worker imports it from
// ./gatewayProvider directly, so this barrel stays free of anything client code must not touch.
export { mockProvider } from "./mockProvider";
export type { AIContext, AIMessage, AISuggestion, AIProvider } from "./types";
