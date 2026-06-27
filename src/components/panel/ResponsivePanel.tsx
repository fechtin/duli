import { type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useIsDesktop } from "@/lib/utils/useMediaQuery";
import { panelTransition } from "@/design/motion";
import { useT } from "@/lib/i18n";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Stable key so content swaps animate (province <-> destination). */
  contentKey?: string;
}

/**
 * Right panel on desktop, draggable bottom sheet on mobile (Bible 002 §5, 007 §14/§15).
 * Never a popup/modal that covers the map.
 */
export function ResponsivePanel({ open, onClose, children, contentKey }: Props) {
  const isDesktop = useIsDesktop();
  const t = useT();

  if (isDesktop) {
    return (
      <AnimatePresence>
        {open && (
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={panelTransition}
            className="absolute right-0 top-0 z-30 flex h-full w-[400px] flex-col border-l border-border bg-surface shadow-[var(--shadow-e3)]"
            aria-label={t("panel.aria")}
          >
            <button
              onClick={onClose}
              aria-label={t("panel.close")}
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-surface/80 text-muted backdrop-blur transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <X size={18} />
            </button>
            <div key={contentKey} className="no-scrollbar h-full overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-20 bg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            className="absolute inset-x-0 bottom-0 z-30 flex max-h-[88%] flex-col rounded-t-[var(--radius-sheet)] border-t border-border bg-surface shadow-[var(--shadow-e3)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={panelTransition}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
          >
            <div className="flex justify-center pt-2.5">
              <span className="h-1.5 w-10 rounded-full bg-border-strong" />
            </div>
            <div key={contentKey} className="no-scrollbar overflow-y-auto overscroll-contain pb-safe">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
