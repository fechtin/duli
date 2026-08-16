/**
 * Trip planner state.
 *
 * Mirrors `useFoodStore`'s id-carrying overlay pattern, including its stale-response guard: a
 * traveller who taps Generate twice with different settings must not get the first answer painted
 * over the second.
 *
 * The plan itself is never persisted. It is a pure function of `params`, so the parameters in the
 * URL are the whole of the state worth keeping — reload reproduces the same trip byte for byte.
 */

import { create } from "zustand";
import { decodeTripId, encodeTripId, fetchTripPlan } from "@/lib/api/trip";
import type { TripParams } from "@/lib/api/trip";
import { activeCountry } from "@/lib/store/useCountryStore";
import { useMapStore } from "@/lib/store/useMapStore";
import type { TripPlan } from "@/lib/itinerary/types";

export type TripStatus = "idle" | "form" | "loading" | "ready" | "error";

interface TripState {
  status: TripStatus;
  /** The encoded params; also the `?trip=` value. Null when no trip is open. */
  tripId: string | null;
  params: TripParams | null;
  plan: TripPlan | null;
  /** 1-based. 0 means "the whole route". */
  activeDay: number;
  activeStopId: string | null;
  /** Mobile only: false collapses the sheet to a peek bar so the map is readable. */
  expanded: boolean;

  openForm: (originProvince: string) => void;
  setParams: (patch: Partial<TripParams>) => void;
  generate: (params?: TripParams) => void;
  /** Deep-link entry: parse `?trip=`, validate, regenerate. */
  openTrip: (tripId: string) => void;
  setActiveDay: (day: number) => void;
  setActiveStop: (id: string | null) => void;
  setExpanded: (v: boolean) => void;
  close: () => void;
}

const DEFAULTS: Omit<TripParams, "originProvince"> = { days: 5, style: "mixed", pace: "balanced" };

export const useTripStore = create<TripState>((set, get) => ({
  status: "idle",
  tripId: null,
  params: null,
  plan: null,
  activeDay: 1,
  activeStopId: null,
  expanded: true,

  openForm: (originProvince) => {
    // The trip is the panel stack's BASE layer, so a province still selected would keep its own
    // panel on top and the form would never appear — the CTA would look broken. Clearing the
    // selection makes the trip the context; drilling into a place from it stacks back on top.
    useMapStore.getState().reset();
    set({
      status: "form",
      tripId: null,
      plan: null,
      params: { originProvince, ...DEFAULTS },
      activeDay: 1,
      activeStopId: null,
      expanded: true,
    });
  },

  setParams: (patch) => {
    const current = get().params;
    if (current) set({ params: { ...current, ...patch } });
  },

  generate: (override) => {
    const params = override ?? get().params;
    if (!params) return;
    const id = encodeTripId(params);
    useMapStore.getState().reset();
    // The id is set before the plan arrives on purpose: a share link is valid the instant the
    // traveller taps Generate, because the params alone reproduce the trip.
    set({ status: "loading", tripId: id, params, plan: null, activeDay: 1, activeStopId: null, expanded: true });
    fetchTripPlan(params, activeCountry())
      .then((plan) => {
        if (get().tripId !== id) return; // a newer request won
        if (plan) set({ plan, status: "ready" });
        else set({ status: "error" });
      })
      .catch(() => {
        if (get().tripId === id) set({ status: "error" });
      });
  },

  openTrip: (tripId) => {
    const params = decodeTripId(tripId);
    // A malformed or stale link opens nothing rather than half a trip; the URL write-back then
    // strips the parameter, so a bad link heals itself.
    if (!params) return;
    get().generate(params);
  },

  setActiveDay: (day) => set({ activeDay: day, activeStopId: null }),
  setActiveStop: (id) => set({ activeStopId: id }),
  setExpanded: (v) => set({ expanded: v }),

  close: () =>
    set({ status: "idle", tripId: null, params: null, plan: null, activeDay: 1, activeStopId: null }),
}));
