import { BookMarked, Compass, Search, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useUIStore } from "@/lib/store/useUIStore";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils/cn";

/** Mobile bottom navigation — thumb-reachable (Bible 003 §2.6, 007 §16). Glass + gold (029). */
export function BottomNav() {
  const t = useT();
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const setAiOpen = useUIStore((s) => s.setAiOpen);
  const setPassportOpen = useUIStore((s) => s.setPassportOpen);
  const openSidebar = useUIStore((s) => s.setSidebarMobileOpen);
  const sidebarOpen = useUIStore((s) => s.sidebarMobileOpen);

  const items: { key: string; label: string; icon: LucideIcon; active: boolean; onClick: () => void }[] = [
    { key: "explore", label: t("nav.explore"), icon: Compass, active: sidebarOpen, onClick: () => openSidebar(true) },
    { key: "search", label: t("nav.search"), icon: Search, active: false, onClick: () => setSearchOpen(true) },
    { key: "guide", label: t("nav.guide"), icon: Sparkles, active: false, onClick: () => setAiOpen(true) },
    { key: "passport", label: t("nav.passport"), icon: BookMarked, active: false, onClick: () => setPassportOpen(true) },
  ];

  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-safe md:hidden">
      <div className="pointer-events-auto mb-3 flex w-full max-w-md items-stretch justify-around gap-1 rounded-[26px] border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] p-1.5 shadow-[var(--glass-shadow)] backdrop-blur-xl">
        {items.map(({ key, label, icon: Icon, active, onClick }) => (
          <button
            key={key}
            onClick={onClick}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-[20px] py-2 transition-colors",
              active
                ? "bg-[var(--glass-gold-soft)] text-[color:var(--glass-gold)]"
                : "text-[color:var(--glass-text-dim)] active:text-[color:var(--glass-text)]",
            )}
          >
            <Icon size={21} strokeWidth={active ? 2.2 : 1.9} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
