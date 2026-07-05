import { lazy, Suspense } from "react";
import { useMapStore } from "@/lib/store/useMapStore";
import { useFoodStore } from "@/lib/store/useFoodStore";
import { ResponsivePanel } from "./ResponsivePanel";

const DestinationPanel = lazy(() => import("./DestinationPanel").then((m) => ({ default: m.DestinationPanel })));
const ProvincePanel = lazy(() => import("./ProvincePanel").then((m) => ({ default: m.ProvincePanel })));
const DishPanel = lazy(() => import("./DishPanel").then((m) => ({ default: m.DishPanel })));

export function PanelContainer() {
  const selectedProvince = useMapStore((s) => s.selectedProvince);
  const selectedDestination = useMapStore((s) => s.selectedDestination);
  const reset = useMapStore((s) => s.reset);
  const openDishId = useFoodStore((s) => s.openDishId);
  const closeDish = useFoodStore((s) => s.closeDish);

  const open = Boolean(openDishId || selectedDestination || selectedProvince);

  const onClose = () => {
    // X closes everything, whatever layer is on top (dish / destination / province).
    closeDish();
    reset();
  };

  const contentKey = openDishId
    ? `dish:${openDishId}`
    : selectedDestination
      ? `dest:${selectedDestination}`
      : `prov:${selectedProvince}`;

  return (
    <ResponsivePanel open={open} onClose={onClose} contentKey={contentKey}>
      <Suspense fallback={null}>
        {openDishId ? (
          <DishPanel />
        ) : selectedDestination ? (
          <DestinationPanel id={selectedDestination} />
        ) : selectedProvince ? (
          <ProvincePanel slug={selectedProvince} />
        ) : null}
      </Suspense>
    </ResponsivePanel>
  );
}
