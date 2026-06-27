import { create } from "zustand";
import { fetchDestinationsLight } from "@/lib/api/content";
import type { DestinationLight } from "@/lib/types";
import type { Locale } from "@/lib/i18n/dictionaries";

interface ContentState {
  destinations: DestinationLight[];
  ready: boolean;
  error: boolean;
  locale: Locale | null;
  load: (locale: Locale) => void;
}

/** Lightweight destinations loaded from the API — feeds map markers + search.
 *  Refetches when the locale changes so marker/search names follow the language. */
export const useContentStore = create<ContentState>((set, get) => ({
  destinations: [],
  ready: false,
  error: false,
  locale: null,
  load: (locale) => {
    if (get().locale === locale && get().ready) return;
    set({ locale });
    fetchDestinationsLight(locale)
      .then((destinations) => set({ destinations, ready: true, error: false }))
      .catch(() => set({ error: true, ready: true }));
  },
}));

// Sync lookups for non-React callers (URL sync, doc meta).
export const findDestination = (id: string) =>
  useContentStore.getState().destinations.find((d) => d.id === id);

export const findDestinationBySlug = (provinceSlug: string, slug: string) =>
  useContentStore.getState().destinations.find((d) => d.provinceSlug === provinceSlug && d.slug === slug);
