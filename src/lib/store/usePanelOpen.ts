import { useFoodStore } from "./useFoodStore";
import { useMapStore } from "./useMapStore";
import { useTripStore } from "./useTripStore";

/**
 * Is the side panel showing anything?
 *
 * Two places need this answer and they must never disagree: `PanelContainer` decides whether to
 * render the panel at all, and the map has to keep its controls clear of it. Computing the same
 * boolean twice is how the two quietly drift apart the next time a layer is added to the stack.
 */
export function usePanelOpen(): boolean {
  const selectedProvince = useMapStore((s) => s.selectedProvince);
  const selectedDestination = useMapStore((s) => s.selectedDestination);
  const openDishId = useFoodStore((s) => s.openDishId);
  const tripIdle = useTripStore((s) => s.status) === "idle";
  return Boolean(openDishId || selectedDestination || selectedProvince || !tripIdle);
}
