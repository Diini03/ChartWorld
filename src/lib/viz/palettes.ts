import type { PaletteId } from "./types";

export interface Palette { id: PaletteId; label: string; colors: string[] }

/** All values are HSL triples resolved against CSS vars where possible. */
export const PALETTES: Palette[] = [
  { id: "signal", label: "Signal", colors: ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--chart-6))"] },
  { id: "ember", label: "Ember", colors: ["#f97316", "#ef4444", "#f59e0b", "#dc2626", "#fb7185", "#b45309"] },
  { id: "botanic", label: "Botanic", colors: ["#0d9488", "#65a30d", "#0891b2", "#15803d", "#a3e635", "#047857"] },
  { id: "ink", label: "Ink", colors: ["#1e293b", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#334155"] },
  { id: "candy", label: "Candy", colors: ["#8b5cf6", "#ec4899", "#06b6d4", "#f59e0b", "#22c55e", "#3b82f6"] },
];

/** Hex equivalents used for generated Python code. */
export const PALETTE_HEX: Record<PaletteId, string[]> = {
  signal: ["#0ea5a4", "#6366f1", "#f59e0b", "#ec4899", "#22c55e", "#38bdf8"],
  ember: ["#f97316", "#ef4444", "#f59e0b", "#dc2626", "#fb7185", "#b45309"],
  botanic: ["#0d9488", "#65a30d", "#0891b2", "#15803d", "#a3e635", "#047857"],
  ink: ["#1e293b", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#334155"],
  candy: ["#8b5cf6", "#ec4899", "#06b6d4", "#f59e0b", "#22c55e", "#3b82f6"],
};

export const paletteColors = (id: PaletteId) => (PALETTES.find((p) => p.id === id) ?? PALETTES[0]).colors;
export const colorAt = (id: PaletteId, i: number) => paletteColors(id)[i % paletteColors(id).length];
