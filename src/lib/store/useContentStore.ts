import { create } from "zustand";
import { fetchDestinationsLight } from "@/lib/api/content";
import type { DestinationLight } from "@/lib/types";

interface ContentState {
  destinations: DestinationLight[];
  ready: boolean;
  error: boolean;
  load: () => void;
}

/** Lightweight destinations loaded once from the API — feeds map markers + search. */
export const useContentStore = create<ContentState>((set, get) => ({
  destinations: [],
  ready: false,
  error: false,
  load: () => {
    if (get().ready || get().destinations.length) return;
    fetchDestinationsLight()
      .then((destinations) => set({ destinations, ready: true }))
      .catch(() => set({ error: true, ready: true }));
  },
}));

// Sync lookups for non-React callers (URL sync, doc meta).
export const findDestination = (id: string) =>
  useContentStore.getState().destinations.find((d) => d.id === id);

export const findDestinationBySlug = (provinceSlug: string, slug: string) =>
  useContentStore.getState().destinations.find((d) => d.provinceSlug === provinceSlug && d.slug === slug);
