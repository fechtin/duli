import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search as SearchIcon, MapPin, X, Compass } from "lucide-react";
import { searchContent, type SearchResult } from "@/lib/api/search";
import { getProvinces } from "@/lib/api/content";
import { useContentStore } from "@/lib/store/useContentStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { useMapStore } from "@/lib/store/useMapStore";
import { useT } from "@/lib/i18n";
import { springSoft, duration, easeOut } from "@/design/motion";
import { cn } from "@/lib/utils/cn";

export function SearchOverlay() {
  const t = useT();
  const open = useUIStore((s) => s.searchOpen);
  const setOpen = useUIStore((s) => s.setSearchOpen);
  const selectProvince = useMapStore((s) => s.selectProvince);
  const selectDestination = useMapStore((s) => s.selectDestination);
  const requestFocus = useMapStore((s) => s.requestFocus);

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const destinations = useContentStore((s) => s.destinations);
  const provinces = useMemo(() => getProvinces(), []);
  const results = useMemo(
    () => (query.trim() ? searchContent(query, provinces, destinations, 8) : []),
    [query, provinces, destinations],
  );
  const featured = useMemo(() => destinations.filter((d) => d.featured).slice(0, 5), [destinations]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const go = (r: SearchResult) => {
    if (r.kind === "province") {
      selectProvince(r.id);
    } else {
      const d = destinations.find((x) => x.id === r.id);
      selectDestination(r.id, r.provinceSlug);
      if (d) requestFocus({ kind: "point", lng: d.lng, lat: d.lat, zoom: 7 });
    }
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      go(results[active]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center bg-overlay px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="w-full max-w-xl overflow-hidden rounded-[var(--radius-panel)] border border-border bg-surface shadow-[var(--shadow-e3)]"
            initial={{ y: -16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={springSoft}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <SearchIcon size={18} className="shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={t("search.placeholder")}
                className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint"
              />
              <button onClick={() => setOpen(false)} aria-label={t("panel.close")} className="text-muted hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="no-scrollbar max-h-[50vh] overflow-y-auto p-2">
              {query.trim() && results.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-muted">{t("search.empty")}</p>
              )}

              {!query.trim() && (
                <>
                  <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-faint">
                    {t("search.hintTitle")}
                  </p>
                  {featured.map((d) => (
                    <button
                      key={d.id}
                      onClick={() =>
                        go({ kind: "destination", id: d.id, title: d.name, subtitle: "", provinceSlug: d.provinceSlug, score: 0 })
                      }
                      className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left hover:bg-surface-2"
                    >
                      <Compass size={16} className="text-primary" />
                      <span className="text-sm font-medium text-foreground">{d.name}</span>
                    </button>
                  ))}
                </>
              )}

              {results.map((r, i) => (
                <motion.button
                  key={`${r.kind}-${r.id}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: duration.fast, ease: easeOut, delay: Math.min(i * 0.02, 0.1) }}
                  onClick={() => go(r)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left",
                    i === active ? "bg-surface-2" : "hover:bg-surface-2",
                  )}
                >
                  <MapPin size={16} className={r.kind === "province" ? "text-secondary" : "text-primary"} />
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-foreground">{r.title}</span>
                    {r.subtitle && <span className="block text-xs text-muted">{r.subtitle}</span>}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-faint">
                    {r.kind === "province" ? t("search.provinces") : t("search.destinations")}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
