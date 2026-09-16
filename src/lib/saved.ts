import { create } from "zustand";

const FAV_KEY = "chartworld-favorites";
const RECENT_KEY = "chartworld-recent";
const RECENT_MAX = 12;

function read(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

interface SavedState {
  favorites: string[];
  recent: string[];
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
  clearFavorites: () => void;
  visit: (slug: string) => void;
  clearRecent: () => void;
}

export const useSaved = create<SavedState>((set, get) => ({
  favorites: read(FAV_KEY),
  recent: read(RECENT_KEY),
  isFavorite: (slug) => get().favorites.includes(slug),
  toggleFavorite: (slug) => {
    const next = get().favorites.includes(slug)
      ? get().favorites.filter((s) => s !== slug)
      : [slug, ...get().favorites];
    write(FAV_KEY, next);
    set({ favorites: next });
  },
  clearFavorites: () => {
    write(FAV_KEY, []);
    set({ favorites: [] });
  },
  visit: (slug) => {
    const next = [slug, ...get().recent.filter((s) => s !== slug)].slice(0, RECENT_MAX);
    write(RECENT_KEY, next);
    set({ recent: next });
  },
  clearRecent: () => {
    write(RECENT_KEY, []);
    set({ recent: [] });
  },
}));
