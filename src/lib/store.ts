import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PanelState {
  sideNavCollapsed: boolean;
  inspectorOpen: boolean;
  activityOpen: boolean;
  sideNavSize: number; // percent
  inspectorSize: number;
  activitySize: number;
}

interface UIState extends PanelState {
  paletteOpen: boolean;
  selectedNodeId: string | null;
  theme: "light" | "dark";
  toggleSideNav: () => void;
  toggleInspector: () => void;
  toggleActivity: () => void;
  setPaletteOpen: (open: boolean) => void;
  selectNode: (id: string | null) => void;
  setTheme: (t: "light" | "dark") => void;
  setPanelSizes: (sizes: Partial<Pick<PanelState, "sideNavSize" | "inspectorSize" | "activitySize">>) => void;
}

export const useAppStore = create<UIState>()(
  persist(
    (set) => ({
      sideNavCollapsed: false,
      inspectorOpen: true,
      activityOpen: true,
      sideNavSize: 16,
      inspectorSize: 24,
      activitySize: 22,
      paletteOpen: false,
      selectedNodeId: null,
      theme: "dark",
      toggleSideNav: () => set((s) => ({ sideNavCollapsed: !s.sideNavCollapsed })),
      toggleInspector: () => set((s) => ({ inspectorOpen: !s.inspectorOpen })),
      toggleActivity: () => set((s) => ({ activityOpen: !s.activityOpen })),
      setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
      selectNode: (selectedNodeId) => set({ selectedNodeId }),
      setTheme: (theme) => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.classList.toggle("light", theme === "light");
        set({ theme });
      },
      setPanelSizes: (sizes) => set((s) => ({ ...s, ...sizes })),
    }),
    {
      name: "raadraac-ui",
      partialize: (s) => ({
        sideNavCollapsed: s.sideNavCollapsed,
        inspectorOpen: s.inspectorOpen,
        activityOpen: s.activityOpen,
        sideNavSize: s.sideNavSize,
        inspectorSize: s.inspectorSize,
        activitySize: s.activitySize,
        theme: s.theme,
      }),
    }
  )
);

/** Apply the persisted theme class on first import so there is no flash. */
export function initTheme() {
  let t = useAppStore.getState().theme;
  if (typeof window !== "undefined" && !localStorage.getItem("raadraac-ui")) {
    const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
    t = prefersLight ? "light" : "dark";
    useAppStore.setState({ theme: t });
  }
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(t);
}

