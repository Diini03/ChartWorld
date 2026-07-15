import { useMemo } from "react";
import Fuse from "fuse.js";
import type { CatalogNode } from "@/lib/mock/types";

/** Fuzzy search across all catalog nodes with reasonable weights. */
export function useCatalogSearch(items: CatalogNode[]) {
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        includeScore: true,
        threshold: 0.35,
        ignoreLocation: true,
        keys: [
          { name: "name", weight: 0.5 },
          { name: "fullyQualifiedName", weight: 0.3 },
          { name: "tags", weight: 0.15 },
          { name: "description", weight: 0.05 },
        ],
      }),
    [items]
  );

  return (query: string): CatalogNode[] => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 20).map((r) => r.item);
  };
}
