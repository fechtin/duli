import { create } from "zustand";
import { useFoodStore } from "@/lib/store/useFoodStore";
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

/**
 * Picking a place dismisses whatever is stacked on top of the map.
 *
 * A dish outranks every map layer in `PanelContainer`, so with one open, tapping a province or a
 * marker changed the selection underneath and the reader saw nothing happen at all. This lives
 * on the store rather than on the seven call sites that select a place — the map, the search
 * overlay, the passport, the sr-only nav — because every one of them is the same intent, and the
 * next one added would have forgotten.
 *
 * `getState()` is read inside the action, never at module scope, so the import cycle with
 * useFoodStore (which reaches the other way for `openList`) is inert.
 */
const dismissDish = () => {
  if (useFoodStore.getState().openDishId) useFoodStore.getState().closeDish();
};

export const useMapStore = create<MapState>((set, get) => ({
  selectedProvince: null,
  selectedDestination: null,
  hovered: null,
  zoomLevel: 0,
  focusRequest: { target: { kind: "reset" }, nonce: 0 },

  selectProvince: (slug) => {
    if (slug) dismissDish();
    set({ selectedProvince: slug, selectedDestination: null });
    if (slug) get().requestFocus({ kind: "province", slug });
  },

  selectDestination: (id, provinceSlug) => {
    if (id) dismissDish();
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
