import { lazy, Suspense } from "react";
import { useMapStore } from "@/lib/store/useMapStore";
import { useFoodStore } from "@/lib/store/useFoodStore";
import { useTripStore } from "@/lib/store/useTripStore";
import { usePanelOpen } from "@/lib/store/usePanelOpen";
import { ResponsivePanel } from "./ResponsivePanel";

const DestinationPanel = lazy(() => import("./DestinationPanel").then((m) => ({ default: m.DestinationPanel })));
const ProvincePanel = lazy(() => import("./ProvincePanel").then((m) => ({ default: m.ProvincePanel })));
const DishPanel = lazy(() => import("./DishPanel").then((m) => ({ default: m.DishPanel })));
const FoodListPanel = lazy(() => import("./FoodListPanel").then((m) => ({ default: m.FoodListPanel })));
const TripPanel = lazy(() => import("../trip/TripPanel").then((m) => ({ default: m.TripPanel })));

export function PanelContainer() {
  const selectedProvince = useMapStore((s) => s.selectedProvince);
  const selectedDestination = useMapStore((s) => s.selectedDestination);
  const reset = useMapStore((s) => s.reset);
  const openDishId = useFoodStore((s) => s.openDishId);
  const closeDish = useFoodStore((s) => s.closeDish);
  const foodListOpen = useFoodStore((s) => s.listOpen);
  const closeFoodList = useFoodStore((s) => s.closeList);
  const tripStatus = useTripStore((s) => s.status);
  const closeTrip = useTripStore((s) => s.close);

  const tripOpen = tripStatus !== "idle";
  const open = usePanelOpen();

  /**
   * The trip is the BASE layer, below province/destination/dish — not the top one.
   *
   * A trip is a context you explore inside of, so tapping a place while it is open stacks that
   * panel on top and closing it falls back to the itinerary. That is the same idiom `useFoodStore`
   * already established for dishes, with no new machinery. Putting the trip on top instead would
   * mean clicking a province polygon rendered nothing at all.
   */
  const onClose = () => {
    if (openDishId || selectedDestination || selectedProvince) {
      closeDish();
      reset();
      return;
    }
    // The cuisine index is a base layer too: closing a dish opened from it lands back on the
    // list, and only the next close leaves the page.
    if (foodListOpen) {
      closeFoodList();
      return;
    }
    closeTrip();
  };

  /**
   * NOT keyed on `activeDay` — that would remount the whole panel on every tab tap, replaying
   * every Section stagger and resetting the scroll position. Day switching animates locally.
   */
  const contentKey = openDishId
    ? `dish:${openDishId}`
    : selectedDestination
      ? `dest:${selectedDestination}`
      : selectedProvince
        ? `prov:${selectedProvince}`
        : foodListOpen
          ? "food"
          : `trip:${tripStatus === "form" ? "form" : "result"}`;

  return (
    <ResponsivePanel open={open} onClose={onClose} contentKey={contentKey}>
      <Suspense fallback={null}>
        {openDishId ? (
          <DishPanel />
        ) : selectedDestination ? (
          <DestinationPanel id={selectedDestination} />
        ) : selectedProvince ? (
          <ProvincePanel slug={selectedProvince} />
        ) : foodListOpen ? (
          <FoodListPanel />
        ) : tripOpen ? (
          <TripPanel />
        ) : null}
      </Suspense>
    </ResponsivePanel>
  );
}
