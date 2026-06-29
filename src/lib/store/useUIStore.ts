import { create } from "zustand";

type Theme = "light" | "dark";

function initialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("via.theme") as Theme | null;
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

interface UIState {
  theme: Theme;
  searchOpen: boolean;
  aiOpen: boolean;
  passportOpen: boolean;
  /** Once-a-day Morning Brief popup is showing — Companion Card hides while it is open (023). */
  briefOpen: boolean;
  /** Destination id pending a check-in flow, or null. */
  checkinTarget: string | null;

  toggleTheme: () => void;
  applyTheme: () => void;
  setSearchOpen: (v: boolean) => void;
  setAiOpen: (v: boolean) => void;
  setPassportOpen: (v: boolean) => void;
  setBriefOpen: (v: boolean) => void;
  openCheckin: (destinationId: string) => void;
  closeCheckin: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: initialTheme(),
  searchOpen: false,
  aiOpen: false,
  passportOpen: false,
  briefOpen: false,
  checkinTarget: null,

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
  setBriefOpen: (v) => set({ briefOpen: v }),
  openCheckin: (destinationId) => set({ checkinTarget: destinationId, aiOpen: false }),
  closeCheckin: () => set({ checkinTarget: null }),
}));
