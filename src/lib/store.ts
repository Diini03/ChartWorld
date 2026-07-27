import { create } from "zustand";

interface UIState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
}

export const useUI = create<UIState>((set, get) => ({
  theme: (document.documentElement.classList.contains("dark") ? "dark" : "light"),
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("chartworld-theme", next);
    set({ theme: next });
  },
  searchOpen: false,
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}));
