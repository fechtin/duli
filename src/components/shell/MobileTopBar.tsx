import { Search } from "lucide-react";
import { useUIStore } from "@/lib/store/useUIStore";
import { useT } from "@/lib/i18n";
import { LoginButton } from "@/components/auth/LoginButton";

/** Mobile header (029) — full-width search + account avatar floating over the map.
 *  Language & theme now live in the Settings sheet (reached from the Explore drawer). */
export function MobileTopBar() {
  const t = useT();
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center gap-2.5 p-3 pt-safe md:hidden">
      <button
        onClick={() => setSearchOpen(true)}
        className="pointer-events-auto flex h-12 flex-1 items-center gap-2.5 rounded-full border border-border bg-surface/90 px-4 text-left text-sm text-muted shadow-[var(--shadow-e2)] backdrop-blur-xl transition-colors active:bg-surface"
      >
        <Search size={18} className="shrink-0 text-primary" />
        <span className="truncate">{t("search.placeholder")}</span>
      </button>

      <div className="pointer-events-auto grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-surface/90 shadow-[var(--shadow-e2)] backdrop-blur-xl">
        <LoginButton />
      </div>
    </div>
  );
}
