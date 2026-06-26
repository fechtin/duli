import { lazy, Suspense } from "react";
import { useMapStore } from "@/lib/store/useMapStore";
import { ResponsivePanel } from "./ResponsivePanel";

const DestinationPanel = lazy(() => import("./DestinationPanel").then((m) => ({ default: m.DestinationPanel })));
const ProvincePanel = lazy(() => import("./ProvincePanel").then((m) => ({ default: m.ProvincePanel })));

export function PanelContainer() {
  const selectedProvince = useMapStore((s) => s.selectedProvince);
  const selectedDestination = useMapStore((s) => s.selectedDestination);
  const selectDestination = useMapStore((s) => s.selectDestination);
  const reset = useMapStore((s) => s.reset);
  const requestFocus = useMapStore((s) => s.requestFocus);

  const open = Boolean(selectedDestination || selectedProvince);

  const onClose = () => {
    if (selectedDestination) {
      // Step back to the province context rather than closing entirely.
      selectDestination(null);
      if (selectedProvince) requestFocus({ kind: "province", slug: selectedProvince });
    } else {
      reset();
    }
  };

  const contentKey = selectedDestination ? `dest:${selectedDestination}` : `prov:${selectedProvince}`;

  return (
    <ResponsivePanel open={open} onClose={onClose} contentKey={contentKey}>
      <Suspense fallback={null}>
        {selectedDestination ? (
          <DestinationPanel id={selectedDestination} />
        ) : selectedProvince ? (
          <ProvincePanel slug={selectedProvince} />
        ) : null}
      </Suspense>
    </ResponsivePanel>
  );
}
