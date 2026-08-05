import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Compass } from "lucide-react";
import { useMapStore } from "@/lib/store/useMapStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { COUNTRIES, COUNTRY_CODES } from "@/lib/country";
import { switchCountry } from "@/lib/country/switch";
import { useI18n, useT } from "@/lib/i18n";
import { duration } from "@/design/motion";
import { cn } from "@/lib/utils/cn";

/**
 * Sidebar header — logo + a time-aware greeting (027 §Sidebar Header).
 * The logo is also the atlas switcher: it opens a country menu, and picking the country
 * you're already in behaves like the old logo (go home / reset the map).
 */
export function SidebarHeader({ greeting, collapsed }: { greeting: string; collapsed: boolean }) {
  const t = useT();
  const { locale } = useI18n();
  const reset = useMapStore((s) => s.reset);
  const closeMobile = useUIStore((s) => s.setSidebarMobileOpen);
  const country = useCountryStore((s) => s.country);
  const [open, setOpen] = useState(false);

  const choose = (code: (typeof COUNTRY_CODES)[number]) => {
    setOpen(false);
    closeMobile(false);
    if (code === country) reset();
    else switchCountry(code);
  };

  return (
    <div className="relative">
      <button
        aria-label={t("country.switch")}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 140)}
        className="flex w-full items-center gap-2.5 rounded-[16px] px-1.5 py-1 text-left transition-colors hover:bg-[var(--sb-hover)]"
      >
        <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--sb-gold)] text-[#102b30] shadow-[0_2px_8px_rgba(212,168,75,0.35)]">
          <Compass size={19} />
          <span className="absolute -bottom-0.5 -right-0.5 text-[11px] leading-none">
            {COUNTRIES[country].flag}
          </span>
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-[15px] font-bold text-[color:var(--sb-text)]">
                {t("app.name")}
              </span>
              <span className="block truncate text-[11.5px] text-[color:var(--sb-text-dim)]">{greeting}</span>
            </span>
            <ChevronDown
              size={15}
              className={cn("shrink-0 text-[color:var(--sb-text-dim)] transition-transform", open && "rotate-180")}
            />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: duration.fast }}
            className="absolute left-0 top-[52px] z-50 w-[248px] overflow-hidden rounded-[16px] border border-[var(--sb-border)] bg-[var(--sb-bg)] p-1 shadow-[var(--sb-shadow)]"
          >
            <p className="px-3 pb-1 pt-2 text-[10px] uppercase tracking-[0.18em] text-[color:var(--sb-text-dim)]">
              {t("country.switch")}
            </p>
            {COUNTRY_CODES.map((code) => (
              <button
                key={code}
                onMouseDown={() => choose(code)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--sb-hover)]",
                  code === country
                    ? "font-semibold text-[color:var(--sb-gold)]"
                    : "text-[color:var(--sb-text)]",
                )}
              >
                <span className="text-base leading-none">{COUNTRIES[code].flag}</span>
                <span className="flex-1 truncate">{COUNTRIES[code].label[locale]}</span>
                {code === country && <Check size={15} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
