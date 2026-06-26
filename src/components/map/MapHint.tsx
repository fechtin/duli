import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMapStore } from "@/lib/store/useMapStore";
import { useT } from "@/lib/i18n";
import { fade } from "@/design/motion";

/** A one-time gentle hint at the overview (no tutorial/onboarding — Bible 003 §2.1). */
export function MapHint() {
  const t = useT();
  const zoomLevel = useMapStore((s) => s.zoomLevel);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (zoomLevel > 0) setDismissed(true);
  }, [zoomLevel]);

  const show = !dismissed && zoomLevel === 0;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          {...fade}
          className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center px-4 md:bottom-8"
        >
          <span className="rounded-full bg-foreground/85 px-4 py-2 text-xs font-medium text-background shadow-[var(--shadow-e2)] backdrop-blur">
            {t("map.hint")}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
