import { create } from "zustand";

type Theme = "light" | "dark";

function initialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("via.theme") as Theme | null;
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Hidden map layers, persisted. Stored as the HIDDEN set so "show everything" is the empty
 *  default and a fresh visitor gets the whole atlas without us writing anything. */
function initialHiddenLayers(): string[] {
  if (typeof window === "undefined") return [];
  return (window.localStorage.getItem("via.map.hiddenLayers") ?? "").split(",").filter(Boolean);
}

function initialCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("via.sidebar.collapsed") === "1";
}

interface UIState {
  theme: Theme;
  searchOpen: boolean;
  aiOpen: boolean;
  passportOpen: boolean;
  /** Left sidebar collapsed to the 72px icon rail (desktop, persisted). */
  sidebarCollapsed: boolean;
  /** Left sidebar drawer open (mobile only). */
  sidebarMobileOpen: boolean;
  /** Settings sheet (language + theme) open. */
  settingsOpen: boolean;
  /** Destination id pending a check-in flow, or null. */
  checkinTarget: string | null;
  /**
   * Gallery lightbox: the tiles being viewed and which one is showing. Null when closed.
   * Only tiles that actually have a photo are ever put here — a gradient has nothing to enlarge.
   */
  lightbox: { images: { seed: string; caption: string; alt: string }[]; index: number } | null;
  /** Map layers switched OFF. Empty = show everything (see `src/lib/map/layers.ts`). */
  hiddenMapLayers: string[];

  toggleTheme: () => void;
  applyTheme: () => void;
  setSearchOpen: (v: boolean) => void;
  setAiOpen: (v: boolean) => void;
  setPassportOpen: (v: boolean) => void;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (v: boolean) => void;
  setSettingsOpen: (v: boolean) => void;
  openCheckin: (destinationId: string) => void;
  closeCheckin: () => void;
  openLightbox: (images: { seed: string; caption: string; alt: string }[], index: number) => void;
  closeLightbox: () => void;
  setLightboxIndex: (index: number) => void;
  toggleMapLayer: (layer: string) => void;
  showAllMapLayers: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: initialTheme(),
  searchOpen: false,
  aiOpen: false,
  passportOpen: false,
  sidebarCollapsed: initialCollapsed(),
  sidebarMobileOpen: false,
  settingsOpen: false,
  checkinTarget: null,
  lightbox: null,
  hiddenMapLayers: initialHiddenLayers(),

  openLightbox: (images, index) => set({ lightbox: { images, index } }),
  closeLightbox: () => set({ lightbox: null }),
  setLightboxIndex: (index) => {
    const lb = get().lightbox;
    if (lb) set({ lightbox: { ...lb, index } });
  },

  toggleMapLayer: (layer) => {
    const hidden = get().hiddenMapLayers;
    const next = hidden.includes(layer) ? hidden.filter((l) => l !== layer) : [...hidden, layer];
    set({ hiddenMapLayers: next });
    window.localStorage.setItem("via.map.hiddenLayers", next.join(","));
  },

  showAllMapLayers: () => {
    set({ hiddenMapLayers: [] });
    window.localStorage.removeItem("via.map.hiddenLayers");
  },

  toggleTheme: () => {
    const next: Theme = get().theme === "light" ? "dark" : "light";
    set({ theme: next });
    window.localStorage.setItem("via.theme", next);
    get().applyTheme();
  },

  applyTheme: () => {
    const { theme } = get();
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  },

  setSearchOpen: (v) => set({ searchOpen: v }),
  setAiOpen: (v) => set({ aiOpen: v }),
  setPassportOpen: (v) => set({ passportOpen: v }),
  toggleSidebar: () => {
    const next = !get().sidebarCollapsed;
    set({ sidebarCollapsed: next });
    window.localStorage.setItem("via.sidebar.collapsed", next ? "1" : "0");
  },
  setSidebarMobileOpen: (v) => set({ sidebarMobileOpen: v }),
  setSettingsOpen: (v) => set({ settingsOpen: v }),
  openCheckin: (destinationId) => set({ checkinTarget: destinationId, aiOpen: false }),
  closeCheckin: () => set({ checkinTarget: null }),
}));
