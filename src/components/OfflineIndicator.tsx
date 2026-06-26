import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { WifiOff } from "lucide-react";
import { useT } from "@/lib/i18n";
import { springSoft } from "@/design/motion";

/** Friendly offline banner (Bible 003 §14). */
export function OfflineIndicator() {
  const t = useT();
  const [offline, setOffline] = useState(() => typeof navigator !== "undefined" && !navigator.onLine);

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={springSoft}
          role="status"
          className="pointer-events-none absolute inset-x-0 top-0 z-[70] flex justify-center p-3 pt-safe"
        >
          <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-border bg-surface/95 px-4 py-2 shadow-[var(--shadow-e2)] backdrop-blur">
            <WifiOff size={16} className="text-warning" />
            <div className="text-xs">
              <p className="font-semibold text-foreground">{t("offline.title")}</p>
              <p className="text-muted">{t("offline.body")}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
