import { Search, Sun, Moon, Sparkles, BookMarked } from "lucide-react";
import { useUIStore } from "@/lib/store/useUIStore";
import { useT } from "@/lib/i18n";
import { LanguageMenu } from "./LanguageMenu";
import { LoginButton } from "@/components/auth/LoginButton";
import { SIDEBAR_COLLAPSED, SIDEBAR_EXPANDED } from "@/components/sidebar/LeftSidebar";

/** Desktop top bar — minimal, floating over the map, right of the sidebar (Bible 007 §16). */
export function TopBar() {
  const t = useT();
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const setAiOpen = useUIStore((s) => s.setAiOpen);
  const setPassportOpen = useUIStore((s) => s.setPassportOpen);
  const collapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <header
      className="pointer-events-none absolute inset-x-0 top-0 z-30 hidden items-center justify-end gap-4 p-4 transition-[padding] duration-[280ms] ease-out md:flex"
      style={{ paddingLeft: (collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED) + 24 }}
    >
      <button
        onClick={() => setSearchOpen(true)}
        className="pointer-events-auto mr-auto flex h-11 w-full max-w-sm items-center gap-2.5 rounded-full border border-border bg-surface/85 px-4 text-left text-sm text-muted shadow-[var(--shadow-e1)] backdrop-blur transition-colors hover:bg-surface"
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
          <BookMarked size={18} />
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
