// Food Explorer authoring seed (Bible 026) — dishes first, restaurants belong to a dish.
// Regional dish files keep each file under the 500-LOC rule; this index is the public surface.
import { northDishes } from "./food/dishes-north.ts";
import { centralDishes } from "./food/dishes-central.ts";
import { southDishes } from "./food/dishes-south.ts";
import type { Dish } from "@/lib/types";

export const dishes: Dish[] = [...northDishes, ...centralDishes, ...southDishes];

export { restaurants } from "./food/restaurants.ts";
