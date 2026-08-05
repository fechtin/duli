import { lazy, Suspense, useEffect } from "react";
import { MapEngine } from "@/components/map/MapEngine";
import { PanelContainer } from "@/components/panel/PanelContainer";
import { TopBar } from "@/components/shell/TopBar";
import { MobileTopBar } from "@/components/shell/MobileTopBar";
import { WeatherWidget } from "@/components/shell/WeatherWidget";
import { BottomNav } from "@/components/shell/BottomNav";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { useDocumentMeta } from "@/lib/seo/useDocumentMeta";
import { useUIStore } from "@/lib/store/useUIStore";
import { useContentStore } from "@/lib/store/useContentStore";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { useUrlSync } from "@/lib/store/useUrlSync";
import { useI18n } from "@/lib/i18n";
import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { useAuthStore } from "@/lib/store/useAuthStore";

const Overlays = lazy(() => import("@/components/Overlays"));

export default function App() {
  const applyTheme = useUIStore((s) => s.applyTheme);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const loadContent = useContentStore((s) => s.load);
  const country = useCountryStore((s) => s.country);
  const { locale } = useI18n();

  useUrlSync();
  useDocumentMeta();

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  // Listen to Firebase auth state changes.
  useEffect(() => {
    const unsub = useAuthStore.getState().init();
    return unsub;
  }, []);

  // (Re)load lightweight content whenever the language or the active atlas changes.
  useEffect(() => {
    loadContent(locale, country);
  }, [loadContent, locale, country]);

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
    <main className="relative h-full w-full overflow-hidden bg-background">
      <MapEngine />

      <LeftSidebar />

      <TopBar />
      <MobileTopBar />
      <WeatherWidget />
      <BottomNav />

      <PanelContainer />
      <OfflineIndicator />
      <Suspense fallback={null}>
        <Overlays />
      </Suspense>
    </main>
  );
}
