import { Sparkles, Map, UtensilsCrossed, Gem, PartyPopper, Bot, Heart, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMapStore } from "@/lib/store/useMapStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils/cn";

type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
};

/** Sidebar primary navigation (027 §Sidebar Structure — max 8 items, one icon style). */
export function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const t = useT();
  const reset = useMapStore((s) => s.reset);
  const setAiOpen = useUIStore((s) => s.setAiOpen);
  const setPassportOpen = useUIStore((s) => s.setPassportOpen);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const closeMobile = useUIStore((s) => s.setSidebarMobileOpen);

  // In the expanded feed, sections scroll into view; overlay items open their store.
  const scrollTo = (id: string) => {
    reset();
    closeMobile(false);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const items: NavItem[] = [
    { key: "today", label: t("nav.today"), icon: Sparkles, onClick: () => scrollTo("sb-top") },
    { key: "explore", label: t("nav.explore"), icon: Map, onClick: () => { reset(); closeMobile(false); } },
    { key: "food", label: t("nav.food"), icon: UtensilsCrossed, onClick: () => scrollTo("sb-food") },
    { key: "gems", label: t("nav.gems"), icon: Gem, onClick: () => scrollTo("sb-gem") },
    { key: "festivals", label: t("nav.festivals"), icon: PartyPopper, onClick: () => scrollTo("sb-festival") },
    { key: "ai", label: t("nav.aiPlanner"), icon: Bot, onClick: () => { setAiOpen(true); closeMobile(false); } },
    { key: "saved", label: t("nav.saved"), icon: Heart, onClick: () => { setPassportOpen(true); closeMobile(false); } },
  ];

  return (
    <nav className="flex flex-col gap-0.5">
      {items.map(({ key, label, icon: Icon, onClick }) => (
        <NavButton key={key} label={label} Icon={Icon} onClick={onClick} collapsed={collapsed} />
      ))}
      <div className="my-1.5 h-px bg-[var(--sb-border)]" />
      <NavButton
        label={t("nav.settings")}
        Icon={Settings}
        onClick={() => { setSettingsOpen(true); closeMobile(false); }}
        collapsed={collapsed}
      />
    </nav>
  );
}

function NavButton({
  label,
  Icon,
  onClick,
  collapsed,
}: {
  label: string;
  Icon: LucideIcon;
  onClick: () => void;
  collapsed: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={collapsed ? label : undefined}
      className={cn(
        "group flex items-center rounded-[14px] text-[color:var(--sb-text-dim)] transition-colors hover:bg-[var(--sb-hover)] hover:text-[color:var(--sb-text)]",
        collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
      )}
    >
      <Icon size={19} className="shrink-0" strokeWidth={1.9} />
      {!collapsed && <span className="truncate text-[13.5px] font-medium">{label}</span>}
    </button>
  );
}
