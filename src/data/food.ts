// Food Explorer authoring seed (Bible 026) — dishes first, restaurants belong to a dish.
// Regional dish files keep each file under the 500-LOC rule; this index is the public surface.
import { northDishes } from "./food/dishes-north.ts";
import { centralDishes } from "./food/dishes-central.ts";
import { southDishes } from "./food/dishes-south.ts";
import { northSpecialties } from "./food/specialties-north.ts";
import { centralSpecialties } from "./food/specialties-central.ts";
import { southSpecialties } from "./food/specialties-south.ts";
import { northSpecialties2 } from "./food/specialties-north-2.ts";
import { centralSpecialties2 } from "./food/specialties-central-2.ts";
import { southSpecialties2 } from "./food/specialties-south-2.ts";
import type { Dish } from "@/lib/types";

export const dishes: Dish[] = [
  ...northDishes, ...centralDishes, ...southDishes,
  ...northSpecialties, ...centralSpecialties, ...southSpecialties,
  ...northSpecialties2, ...centralSpecialties2, ...southSpecialties2,
];

export { restaurants } from "./food/restaurants.ts";
