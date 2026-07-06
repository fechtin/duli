import { BookMarked, Compass, Search, Sparkles } from "lucide-react";
import { useUIStore } from "@/lib/store/useUIStore";
import { useT } from "@/lib/i18n";

/** Mobile bottom navigation — thumb-reachable (Bible 003 §2.6, 007 §16). */
export function BottomNav() {
  const t = useT();
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const setAiOpen = useUIStore((s) => s.setAiOpen);
  const setPassportOpen = useUIStore((s) => s.setPassportOpen);
  const openSidebar = useUIStore((s) => s.setSidebarMobileOpen);

  const items = [
    { key: "explore", label: t("nav.explore"), icon: <Compass size={20} />, onClick: () => openSidebar(true) },
    { key: "search", label: t("nav.search"), icon: <Search size={20} />, onClick: () => setSearchOpen(true) },
    { key: "guide", label: t("nav.guide"), icon: <Sparkles size={20} />, onClick: () => setAiOpen(true) },
    { key: "passport", label: t("nav.passport"), icon: <BookMarked size={20} />, onClick: () => setPassportOpen(true) },
  ];

  return (
    <nav className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-border bg-surface/90 pb-safe backdrop-blur md:hidden">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={it.onClick}
          className="flex flex-1 flex-col items-center gap-0.5 py-2 text-muted transition-colors active:text-primary"
        >
          {it.icon}
          <span className="text-[10px] font-medium">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
