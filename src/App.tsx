import { lazy, Suspense, useEffect } from "react";
import { MapEngine } from "@/components/map/MapEngine";
import { PanelContainer } from "@/components/panel/PanelContainer";
import { TopBar } from "@/components/shell/TopBar";
import { MobileTopBar } from "@/components/shell/MobileTopBar";
import { BottomNav } from "@/components/shell/BottomNav";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { useDocumentMeta } from "@/lib/seo/useDocumentMeta";
import { useUIStore } from "@/lib/store/useUIStore";
import { useContentStore } from "@/lib/store/useContentStore";
import { useUrlSync } from "@/lib/store/useUrlSync";
import { useI18n } from "@/lib/i18n";

const Overlays = lazy(() => import("@/components/Overlays"));

export default function App() {
  const applyTheme = useUIStore((s) => s.applyTheme);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const loadContent = useContentStore((s) => s.load);
  const { locale } = useI18n();

  useUrlSync();
  useDocumentMeta();

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  // (Re)load lightweight content whenever the language changes.
  useEffect(() => {
    loadContent(locale);
  }, [loadContent, locale]);

  // Global search shortcut (Cmd/Ctrl+K or "/").
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = ["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-background">
      <MapEngine />

      <TopBar />
      <MobileTopBar />
      <BottomNav />

      <PanelContainer />
      <OfflineIndicator />
      <Suspense fallback={null}>
        <Overlays />
      </Suspense>
    </main>
  );
}
