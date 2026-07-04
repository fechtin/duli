import { create } from "zustand";
import { fetchDish } from "@/lib/api/food";
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

  openDish: (id: string) => void;
  closeDish: () => void;
}

export const useFoodStore = create<FoodState>((set, get) => ({
  openDishId: null,
  dish: null,
  loading: false,

  openDish: (id) => {
    set({ openDishId: id, dish: null, loading: true });
    fetchDish(id).then((d) => {
      // Ignore stale responses if the user already opened another dish.
      if (get().openDishId === id) set({ dish: d, loading: false });
    });
  },

  closeDish: () => set({ openDishId: null, dish: null, loading: false }),
}));
