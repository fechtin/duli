import { create } from "zustand";
import { fetchDestinationsLight } from "@/lib/api/content";
import type { CountryCode, DestinationLight } from "@/lib/types";
import type { Locale } from "@/lib/i18n/dictionaries";

interface ContentState {
  destinations: DestinationLight[];
  ready: boolean;
  error: boolean;
  locale: Locale | null;
  country: CountryCode | null;
  load: (locale: Locale, country: CountryCode) => void;
}

/** Lightweight destinations loaded from the API — feeds map markers + search.
 *  Refetches when the locale or the active country changes. */
export const useContentStore = create<ContentState>((set, get) => ({
  destinations: [],
  ready: false,
  error: false,
  locale: null,
  country: null,
  load: (locale, country) => {
    if (get().locale === locale && get().country === country && get().ready) return;
    // Markers from the previous atlas must not linger over the new map.
    const switching = get().country !== country;
    set({ locale, country, ...(switching ? { destinations: [], ready: false } : {}) });
    fetchDestinationsLight(locale, country)
      .then((destinations) => {
        // Drop a response that lost the race to a newer country/locale selection.
        if (get().locale !== locale || get().country !== country) return;
        set({ destinations, ready: true, error: false });
      })
      .catch(() => set({ error: true, ready: true }));
  },
}));

// Sync lookups for non-React callers (URL sync, doc meta).
export const findDestination = (id: string) =>
  useContentStore.getState().destinations.find((d) => d.id === id);

export const findDestinationBySlug = (provinceSlug: string, slug: string) =>
  useContentStore.getState().destinations.find((d) => d.provinceSlug === provinceSlug && d.slug === slug);
