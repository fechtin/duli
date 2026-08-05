import { AnimatePresence, motion } from "motion/react";
import { Check, Moon, Sun, X } from "lucide-react";
import { useUIStore } from "@/lib/store/useUIStore";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { COUNTRIES, COUNTRY_CODES } from "@/lib/country";
import { switchCountry } from "@/lib/country/switch";
import { useI18n, useT } from "@/lib/i18n";
import { duration, easeOut } from "@/design/motion";
import { cn } from "@/lib/utils/cn";

/** Settings sheet — gathers language + light/night in one place (029).
 *  Bottom sheet on mobile, centered dialog on desktop. */
export function SettingsSheet() {
  const t = useT();
  const { locale, setLocale, locales } = useI18n();
  const open = useUIStore((s) => s.settingsOpen);
  const setOpen = useUIStore((s) => s.setSettingsOpen);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const country = useCountryStore((s) => s.country);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[var(--overlay)] backdrop-blur-sm md:items-center"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: duration.medium, ease: easeOut }}
            onClick={(e) => e.stopPropagation()}
            className="sidebar-theme w-full max-w-md rounded-t-[var(--radius-sheet)] border border-[var(--sb-border-strong)] bg-[var(--sb-bg)] pb-safe text-[color:var(--sb-text)] shadow-[var(--sb-shadow)] md:mb-0 md:rounded-[var(--radius-panel)]"
          >
            <div className="flex items-center justify-between px-5 pt-5">
              <h2 className="font-display text-base font-semibold">{t("settings.title")}</h2>
              <button
                aria-label={t("settings.close")}
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full text-[color:var(--sb-text-dim)] transition-colors hover:bg-[var(--sb-hover)] hover:text-[color:var(--sb-text)]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Appearance */}
            <div className="px-5 pt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--sb-text-faint)]">
                {t("settings.appearance")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["light", "dark"] as const).map((mode) => {
                  const active = theme === mode;
                  const Icon = mode === "light" ? Sun : Moon;
                  return (
                    <button
                      key={mode}
                      onClick={() => {
                        if (!active) toggleTheme();
                      }}
                      className={cn(
                        "flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                        active
                          ? "border-[var(--sb-gold)] bg-[var(--sb-gold-soft)] text-[color:var(--sb-gold)]"
                          : "border-[var(--sb-border)] text-[color:var(--sb-text-dim)] hover:bg-[var(--sb-hover)]",
                      )}
                    >
                      <Icon size={18} strokeWidth={2} />
                      {t(mode === "light" ? "settings.light" : "settings.dark")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Country — same switch as the sidebar logo, reachable on mobile */}
            <div className="px-5 pt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--sb-text-faint)]">
                {t("country.switch")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {COUNTRY_CODES.map((code) => {
                  const active = country === code;
                  return (
                    <button
                      key={code}
                      onClick={() => {
                        if (!active) {
                          switchCountry(code);
                          setOpen(false);
                        }
                      }}
                      className={cn(
                        "flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                        active
                          ? "border-[var(--sb-gold)] bg-[var(--sb-gold-soft)] text-[color:var(--sb-gold)]"
                          : "border-[var(--sb-border)] text-[color:var(--sb-text-dim)] hover:bg-[var(--sb-hover)]",
                      )}
                    >
                      <span className="text-base leading-none">{COUNTRIES[code].flag}</span>
                      <span className="flex-1 text-left">{COUNTRIES[code].label[locale]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language */}
            <div className="px-5 py-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--sb-text-faint)]">
                {t("settings.language")}
              </p>
              <div className="flex flex-col gap-1">
                {locales.map((l) => {
                  const active = locale === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => setLocale(l.code)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-[var(--sb-gold-soft)] text-[color:var(--sb-gold)]"
                          : "text-[color:var(--sb-text)] hover:bg-[var(--sb-hover)]",
                      )}
                    >
                      <span className="text-base leading-none">{l.flag}</span>
                      <span className="flex-1 text-left font-medium">{l.label}</span>
                      {active && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
