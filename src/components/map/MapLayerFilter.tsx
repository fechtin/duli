import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Layers, X } from "lucide-react";
import { springSoft } from "@/design/motion";
import { useT } from "@/lib/i18n";
import { MAP_LAYERS } from "@/lib/map/layers";
import { useUIStore } from "@/lib/store/useUIStore";
import { cn } from "@/lib/utils/cn";

/**
 * Which kinds of place the map draws.
 *
 * The atlas passed the density where every marker could be shown at once — around Hội An eight
 * sit inside a couple of kilometres — and suppressing labels only treats the symptom. This lets
 * the traveller say what they came for.
 *
 * Lives in the map's own glass chrome next to zoom, because it is a property of the map rather
 * than of the app. State is HIDDEN layers, so the default is empty and everything shows.
 */
export function MapLayerFilter() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const hidden = useUIStore((s) => s.hiddenMapLayers);
  const toggle = useUIStore((s) => s.toggleMapLayer);
  const showAll = useUIStore((s) => s.showAllMapLayers);
  const filtering = hidden.length > 0;

  return (
    <div className="relative">
      <button
        aria-label={t("map.layers")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative grid h-11 w-11 place-items-center rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[color:var(--glass-text)] shadow-[var(--glass-shadow)] backdrop-blur-xl transition-colors hover:bg-[var(--glass-hover)] hover:text-[color:var(--glass-gold)]",
          (open || filtering) && "text-[color:var(--glass-gold)]",
        )}
      >
        <Layers size={19} />
        {/* A filter you forgot you left on is the classic trap of this control, so say so. */}
        {filtering && (
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[color:var(--glass-gold)]" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 6 }}
            transition={springSoft}
            className="absolute bottom-0 right-[calc(100%+10px)] w-56 origin-bottom-right rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 text-[color:var(--glass-text)] shadow-[var(--glass-shadow)] backdrop-blur-xl"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wide">{t("map.layers")}</span>
              <button
                aria-label={t("map.layers.close")}
                onClick={() => setOpen(false)}
                className="grid h-6 w-6 place-items-center rounded-full transition-colors hover:bg-[var(--glass-hover)]"
              >
                <X size={13} />
              </button>
            </div>
            <p className="mb-2.5 text-[11px] leading-relaxed opacity-70">{t("map.layers.hint")}</p>

            <div className="flex flex-wrap gap-1.5">
              {MAP_LAYERS.map((layer) => {
                const on = !hidden.includes(layer);
                return (
                  <button
                    key={layer}
                    aria-pressed={on}
                    onClick={() => toggle(layer)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                      on
                        ? "border-[color:var(--glass-gold)] bg-[var(--glass-hover)] text-[color:var(--glass-gold)]"
                        : "border-[var(--glass-border)] opacity-50 hover:opacity-80",
                    )}
                  >
                    {t(`map.layer.${layer}`)}
                  </button>
                );
              })}
            </div>

            {filtering && (
              <button
                onClick={showAll}
                className="mt-2.5 w-full rounded-full border border-[var(--glass-border)] py-1 text-[11px] font-semibold transition-colors hover:bg-[var(--glass-hover)]"
              >
                {t("map.layers.all")}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
