import { Sun, Moon } from "lucide-react";
import { useUIStore } from "@/lib/store/useUIStore";
import { useT } from "@/lib/i18n";
import { LanguageMenu } from "./LanguageMenu";

/** Compact floating header for mobile (brand + theme + language). The menu drawer is
 *  reached from the bottom-nav "Explore" tab, so no hamburger here. */
export function MobileTopBar() {
  const t = useT();
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between p-3 pt-safe md:hidden">
      <div className="pointer-events-auto flex items-center rounded-full border border-border bg-surface/85 py-1.5 px-3.5 shadow-[var(--shadow-e1)] backdrop-blur">
        <span className="font-display text-xs font-bold text-foreground">{t("app.name")}</span>
      </div>

      <div className="pointer-events-auto flex items-center rounded-full border border-border bg-surface/85 px-0.5 shadow-[var(--shadow-e1)] backdrop-blur">
        <LanguageMenu />
        <button
          aria-label={t("nav.theme")}
          onClick={toggleTheme}
          className="grid h-10 w-10 place-items-center rounded-full text-muted hover:text-foreground"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </div>
  );
}
