import { useT } from "@/lib/i18n";
import { useTripStore } from "@/lib/store/useTripStore";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { TripForm } from "./TripForm";
import { TripResult } from "./TripResult";

/**
 * Status router for the trip layer. Keeping the branch here means `PanelContainer` only has to
 * know whether a trip is open, not what state it is in.
 */
export function TripPanel() {
  const t = useT();
  const status = useTripStore((s) => s.status);
  const plan = useTripStore((s) => s.plan);
  const generate = useTripStore((s) => s.generate);

  if (status === "form") return <TripForm />;

  if (status === "loading") {
    return (
      <div className="p-5">
        <Skeleton className="h-40 w-full" />
        <div className="mt-3 flex gap-2">
          <Skeleton className="h-14 flex-1" />
          <Skeleton className="h-14 flex-1" />
          <Skeleton className="h-14 flex-1" />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <p className="mt-4 text-center text-xs text-muted">{t("trip.result.loading")}</p>
      </div>
    );
  }

  if (status === "error" || (status === "ready" && !plan)) {
    return (
      <div className="p-5">
        <p className="text-sm text-muted">{t("trip.result.error")}</p>
        <Button variant="secondary" className="mt-3" onClick={() => generate()}>
          {t("trip.result.retry")}
        </Button>
      </div>
    );
  }

  return plan ? <TripResult plan={plan} /> : null;
}
