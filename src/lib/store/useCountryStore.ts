import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_COUNTRY, isCountryCode } from "@/lib/country";
import type { CountryCode } from "@/lib/types";

interface CountryState {
  country: CountryCode;
  /** Set the active atlas. Callers are responsible for resetting selection + navigating. */
  setCountry: (c: CountryCode) => void;
}

/**
 * Which atlas is on screen. The URL prefix (/vn, /kr) is the source of truth on load —
 * useUrlSync calls setCountry from it; the persisted value only decides where "/" lands.
 */
export const useCountryStore = create<CountryState>()(
  persist(
    (set) => ({
      country: DEFAULT_COUNTRY,
      setCountry: (country) => set((s) => (s.country === country ? s : { country })),
    }),
    {
      name: "vivel:country",
      partialize: (s) => ({ country: s.country }),
      merge: (persisted, current) => {
        const c = (persisted as Partial<CountryState> | undefined)?.country;
        return { ...current, country: isCountryCode(c) ? c : DEFAULT_COUNTRY };
      },
    },
  ),
);

/** Active country for non-React callers (URL sync, api layer, doc meta). */
export const activeCountry = (): CountryCode => useCountryStore.getState().country;
