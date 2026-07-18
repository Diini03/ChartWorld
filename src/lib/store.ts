import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";
type ViewMode = "grid" | "table";

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  viewMode: ViewMode;
  paletteOpen: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  setViewMode: (v: ViewMode) => void;
  setPaletteOpen: (v: boolean) => void;
}

export const useUI = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "light",
      sidebarCollapsed: false,
      viewMode: "grid",
      paletteOpen: false,
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      toggleTheme: () => {
        const next: Theme = get().theme === "dark" ? "light" : "dark";
        applyTheme(next);
        set({ theme: next });
      },
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      setViewMode: (viewMode) => set({ viewMode }),
      setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
    }),
    { name: "raadraac-ui" }
  )
);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

export function initTheme() {
  try {
    const raw = localStorage.getItem("raadraac-ui");
    const theme: Theme =
      (raw && JSON.parse(raw)?.state?.theme) ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(theme);
  } catch {
    applyTheme("light");
  }
}
