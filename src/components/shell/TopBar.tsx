import { Search, Sun, Moon, Sparkles, Compass } from "lucide-react";
import { useUIStore } from "@/lib/store/useUIStore";
import { useMapStore } from "@/lib/store/useMapStore";
import { useT } from "@/lib/i18n";
import { LanguageMenu } from "./LanguageMenu";
import { LoginButton } from "@/components/auth/LoginButton";

/** Desktop top bar — minimal, floating over the map (Bible 007 §16). */
export function TopBar() {
  const t = useT();
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const setAiOpen = useUIStore((s) => s.setAiOpen);
  const setPassportOpen = useUIStore((s) => s.setPassportOpen);
  const reset = useMapStore((s) => s.reset);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 hidden items-center justify-between gap-4 p-4 md:flex">
      <button
        onClick={reset}
        aria-label={t("nav.home")}
        className="pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-surface/85 py-2 pl-3 pr-4 shadow-[var(--shadow-e1)] backdrop-blur transition-colors hover:bg-surface"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
          <Compass size={16} />
        </span>
        <span className="font-display text-sm font-bold text-foreground">{t("app.name")}</span>
      </button>

      <button
        onClick={() => setSearchOpen(true)}
        className="pointer-events-auto flex h-11 w-full max-w-sm items-center gap-2.5 rounded-full border border-border bg-surface/85 px-4 text-left text-sm text-muted shadow-[var(--shadow-e1)] backdrop-blur transition-colors hover:bg-surface"
      >
        <Search size={17} />
        {t("search.placeholder")}
      </button>

      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-surface/85 px-1 shadow-[var(--shadow-e1)] backdrop-blur">
        <button
          aria-label={t("nav.guide")}
          onClick={() => setAiOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-primary"
        >
          <Sparkles size={18} />
        </button>
        <button
          aria-label={t("nav.passport")}
          onClick={() => setPassportOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          🛂
        </button>
        <LoginButton />
        <LanguageMenu />
        <button
          aria-label={t("nav.theme")}
          onClick={toggleTheme}
          className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}
