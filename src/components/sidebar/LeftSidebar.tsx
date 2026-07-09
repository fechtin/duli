import { useMemo } from "react";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { generateBrief } from "@/lib/living/briefGenerator";
import { useI18n } from "@/lib/i18n";
import { useUIStore } from "@/lib/store/useUIStore";
import { useIsDesktop } from "@/lib/utils/useMediaQuery";
import { cn } from "@/lib/utils/cn";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { HeroBanner } from "./HeroBanner";
import { HighlightsSection } from "./HighlightsSection";
import { AIRecommendation } from "./AIRecommendation";
import { HiddenGemSection } from "./HiddenGemSection";
import { FoodExplorerSection } from "./FoodExplorerSection";
import { FestivalSection } from "./FestivalSection";

export const SIDEBAR_EXPANDED = 300;
export const SIDEBAR_COLLAPSED = 72;

/**
 * Left Sidebar — the app's navigation + daily discovery feed (027 Adventure Premium).
 * Desktop: a persistent deep-teal rail (collapsible to 72px). Mobile: an off-canvas drawer.
 * Map stays the hero; the sidebar is one of its two "wings" (the passport is the other).
 */
export function LeftSidebar() {
  const { t, locale } = useI18n();
  const isDesktop = useIsDesktop();
  const collapsedPref = useUIStore((s) => s.sidebarCollapsed);
  const mobileOpen = useUIStore((s) => s.sidebarMobileOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setMobileOpen = useUIStore((s) => s.setSidebarMobileOpen);

  // On mobile the drawer always shows the full feed; collapse is a desktop-only affordance.
  const collapsed = isDesktop && collapsedPref;
  const brief = useMemo(() => generateBrief(t, locale), [t, locale]);
  const width = isDesktop ? (collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED) : SIDEBAR_EXPANDED;

  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "sidebar-theme fixed left-0 top-0 z-40 flex h-full flex-col border-r border-[var(--sb-border)] bg-[var(--sb-bg)]/95 backdrop-blur-[24px]",
          "transition-[width,transform] duration-[280ms] ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        )}
        style={{
          width,
          borderRadius: "0 30px 30px 0",
          boxShadow: "var(--sb-shadow)",
        }}
      >
        {/* Header */}
        <div className={cn("flex items-center gap-2 pt-safe", collapsed ? "px-2 pt-3" : "px-3 pt-3")}>
          <div className="min-w-0 flex-1">
            <SidebarHeader greeting={brief.greeting} collapsed={collapsed} />
          </div>
          {!collapsed && (
            <button
              onClick={() => setMobileOpen(false)}
              aria-label={t("panel.close")}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[color:var(--sb-text-dim)] transition-colors hover:bg-[var(--sb-hover)] hover:text-[color:var(--sb-text)] md:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="my-2.5 h-px bg-[var(--sb-border)]" style={{ marginInline: collapsed ? 10 : 14 }} />

        {/* Scroll area: nav + daily feed */}
        <div className={cn("no-scrollbar flex-1 overflow-y-auto", collapsed ? "px-2" : "px-3")}>
          <span id="sb-top" className="block" />
          <SidebarNav collapsed={collapsed} />

          {!collapsed && (
            <div className="mt-4 flex flex-col gap-4 pb-4">
              <HeroBanner />
              <HighlightsSection />
              <AIRecommendation text={brief.aiRecommendation} />
              <HiddenGemSection />
              <FoodExplorerSection />
              <FestivalSection />
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={toggleSidebar}
          aria-label={collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
          className={cn(
            "hidden shrink-0 items-center gap-2 border-t border-[var(--sb-border)] px-4 py-3 text-[color:var(--sb-text-dim)] transition-colors hover:bg-[var(--sb-hover)] hover:text-[color:var(--sb-text)] md:flex",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          {!collapsed && <span className="text-[12.5px] font-medium">{t("sidebar.collapse")}</span>}
        </button>
      </aside>
    </>
  );
}
