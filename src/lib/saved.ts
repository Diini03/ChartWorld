import { create } from "zustand";

const FAV_KEY = "chartworld-favorites";
const RECENT_KEY = "chartworld-recent";
const COLLECTIONS_KEY = "chartworld-collections";
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

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export interface Collection {
  id: string;
  name: string;
  slugs: string[];
}

function readCollections(): Collection[] {
  try {
    const raw = localStorage.getItem(COLLECTIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (c): c is Collection =>
          c && typeof c.id === "string" && typeof c.name === "string" && Array.isArray(c.slugs),
      )
      .map((c) => ({ ...c, slugs: c.slugs.filter((s) => typeof s === "string") }));
  } catch {
    return [];
  }
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface SavedState {
  favorites: string[];
  recent: string[];
  collections: Collection[];
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
  clearFavorites: () => void;
  visit: (slug: string) => void;
  clearRecent: () => void;
  createCollection: (name: string) => void;
  renameCollection: (id: string, name: string) => void;
  deleteCollection: (id: string) => void;
  toggleInCollection: (id: string, slug: string) => void;
  collectionsFor: (slug: string) => Collection[];
}

export const useSaved = create<SavedState>((set, get) => {
  const setCollections = (collections: Collection[]) => {
    write(COLLECTIONS_KEY, collections);
    set({ collections });
  };

  return {
    favorites: read(FAV_KEY),
    recent: read(RECENT_KEY),
    collections: readCollections(),
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
    createCollection: (name) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setCollections([...get().collections, { id: newId(), name: trimmed, slugs: [] }]);
    },
    renameCollection: (id, name) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setCollections(
        get().collections.map((c) => (c.id === id ? { ...c, name: trimmed } : c)),
      );
    },
    deleteCollection: (id) => {
      setCollections(get().collections.filter((c) => c.id !== id));
    },
    toggleInCollection: (id, slug) => {
      setCollections(
        get().collections.map((c) =>
          c.id === id
            ? {
                ...c,
                slugs: c.slugs.includes(slug)
                  ? c.slugs.filter((s) => s !== slug)
                  : [...c.slugs, slug],
              }
            : c,
        ),
      );
    },
    collectionsFor: (slug) => get().collections.filter((c) => c.slugs.includes(slug)),
  };
});
