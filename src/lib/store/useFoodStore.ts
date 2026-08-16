import { create } from "zustand";
import { fetchDish } from "@/lib/api/food";
import { useMapStore } from "@/lib/store/useMapStore";
import type { DishWithRestaurants } from "@/lib/types";

/**
 * Food Explorer UI state (Bible 026). A dish opens ON TOP of the current panel context —
 * closing it returns to the province/destination underneath. While a dish is open its
 * restaurants become a map layer (026 §Food Explorer Map).
 */
interface FoodState {
  openDishId: string | null;
  dish: DishWithRestaurants | null;
  loading: boolean;
  /**
   * The cuisine index (`/{cc}/food`) is open. It sits UNDER a dish the same way a province sits
   * under a destination, so opening a card from the index and closing it again returns to the
   * list instead of dumping the reader on the bare map.
   */
  listOpen: boolean;

  openDish: (id: string) => void;
  closeDish: () => void;
  openList: () => void;
  closeList: () => void;
}

export const useFoodStore = create<FoodState>((set, get) => ({
  openDishId: null,
  dish: null,
  loading: false,
  listOpen: false,

  openDish: (id) => {
    set({ openDishId: id, dish: null, loading: true });
    fetchDish(id).then((d) => {
      // Ignore stale responses if the user already opened another dish.
      if (get().openDishId === id) set({ dish: d, loading: false });
    });
  },

  closeDish: () => set({ openDishId: null, dish: null, loading: false }),

  /**
   * The index is a page, not an overlay: it occupies the same rung as a province, so opening it
   * clears whatever map selection was showing. Without this, clicking "view all" while Quảng Nam
   * was selected left the province panel on top and the reader never saw the list they asked for.
   *
   * It deliberately does NOT touch the dish layer. That layer has one referee — the URL, via
   * `useUrlSync.applyFromUrl` — and having this clear it too made the two fight: `applyFromUrl`
   * re-runs when content becomes ready, and on that second pass a deep link to
   * `/{cc}/food?dish=x` lost its dish. A caller that means "index, no dish" says so itself.
   */
  openList: () => {
    useMapStore.getState().reset();
    set({ listOpen: true });
  },
  closeList: () => set({ listOpen: false }),
}));
