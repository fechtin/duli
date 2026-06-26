import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { duration } from "@/design/motion";
import { cn } from "@/lib/utils/cn";

export function LanguageMenu() {
  const { locale, setLocale, locales, t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        aria-label={t("nav.language")}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
      >
        <Languages size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: duration.fast }}
            className="absolute right-0 top-12 z-50 w-40 overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface p-1 shadow-[var(--shadow-e2)]"
          >
            {locales.map((l) => (
              <button
                key={l.code}
                onMouseDown={() => {
                  setLocale(l.code);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors hover:bg-surface-2",
                  locale === l.code ? "font-semibold text-primary" : "text-foreground",
                )}
              >
                <span>{l.flag}</span>
                {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
