import { create } from "zustand";
import type { FocusTarget } from "@/lib/types";

interface FocusRequest {
  target: FocusTarget;
  nonce: number;
}

interface MapState {
  /** Currently selected province slug (drives panel + highlight). */
  selectedProvince: string | null;
  /** Currently selected destination id. */
  selectedDestination: string | null;
  /** Hovered feature id (province slug or destination id) for live highlight. */
  hovered: string | null;
  /** Live zoom level 0..4 reported by the engine (Bible 005 §4). */
  zoomLevel: number;
  /** Imperative focus command consumed by the map engine. */
  focusRequest: FocusRequest;

  selectProvince: (slug: string | null) => void;
  selectDestination: (id: string | null, provinceSlug?: string) => void;
  setHovered: (id: string | null) => void;
  setZoomLevel: (z: number) => void;
  requestFocus: (target: FocusTarget) => void;
  reset: () => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  selectedProvince: null,
  selectedDestination: null,
  hovered: null,
  zoomLevel: 0,
  focusRequest: { target: { kind: "reset" }, nonce: 0 },

  selectProvince: (slug) => {
    set({ selectedProvince: slug, selectedDestination: null });
    if (slug) get().requestFocus({ kind: "province", slug });
  },

  selectDestination: (id, provinceSlug) => {
    set((s) => ({
      selectedDestination: id,
      selectedProvince: provinceSlug ?? s.selectedProvince,
    }));
  },

  setHovered: (id) => set({ hovered: id }),
  setZoomLevel: (z) => set((s) => (s.zoomLevel === z ? s : { zoomLevel: z })),

  requestFocus: (target) => set((s) => ({ focusRequest: { target, nonce: s.focusRequest.nonce + 1 } })),

  reset: () => {
    set({ selectedProvince: null, selectedDestination: null, hovered: null });
    get().requestFocus({ kind: "reset" });
  },
}));
