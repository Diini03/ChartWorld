import { create } from "zustand";
import { DEFAULT_DATASET, SAMPLE_DATASETS, getDataset } from "./datasets";
import { configForType, defaultConfigFor } from "./registry";
import type { BuildableType, Dataset, VizConfig, VizStyle } from "./types";

export const DEFAULT_STYLE: VizStyle = {
  title: "",
  subtitle: "",
  xLabel: "",
  yLabel: "",
  legend: true,
  grid: true,
  dataLabels: false,
  markers: false,
  fontSize: 12,
  lineWidth: 2,
  opacity: 0.9,
  height: 420,
  palette: "signal",
  rounded: true,
};

function initialConfig(ds: Dataset): VizConfig {
  const d = defaultConfigFor(ds);
  return { type: d.type, x: d.x, y: d.y, series: undefined, size: undefined, agg: "sum", sort: "none", limit: 15, bins: 12 };
}

interface VizState {
  dataset: Dataset;
  config: VizConfig;
  style: VizStyle;
  uploads: Dataset[];
  setDataset: (ds: Dataset) => void;
  loadSample: (id: string) => void;
  addUpload: (ds: Dataset) => void;
  setType: (t: BuildableType) => void;
  patchConfig: (p: Partial<VizConfig>) => void;
  patchStyle: (p: Partial<VizStyle>) => void;
  resetStyle: () => void;
  hydrate: (params: URLSearchParams) => void;
}

export const useViz = create<VizState>((set, get) => ({
  dataset: DEFAULT_DATASET,
  config: initialConfig(DEFAULT_DATASET),
  style: DEFAULT_STYLE,
  uploads: [],
  setDataset: (dataset) => set({ dataset, config: initialConfig(dataset) }),
  loadSample: (id) => {
    const ds = getDataset(id);
    if (ds) set({ dataset: ds, config: initialConfig(ds) });
  },
  addUpload: (ds) => set((s) => ({ uploads: [ds, ...s.uploads].slice(0, 8), dataset: ds, config: initialConfig(ds) })),
  setType: (type) =>
    set((s) => ({ config: { ...s.config, type, ...configForType(s.dataset, s.config, type) } })),
  patchConfig: (p) => set((s) => ({ config: { ...s.config, ...p } })),
  patchStyle: (p) => set((s) => ({ style: { ...s.style, ...p } })),
  resetStyle: () => set({ style: DEFAULT_STYLE }),
  hydrate: (params) => {
    const dsId = params.get("d");
    const ds = dsId ? getDataset(dsId) : undefined;
    const base = ds ?? get().dataset;
    const cfg = { ...initialConfig(base) };
    const map: Record<string, keyof VizConfig> = { t: "type", x: "x", y: "y", s: "series", z: "size", a: "agg", o: "sort" };
    Object.entries(map).forEach(([k, field]) => {
      const v = params.get(k);
      if (v) (cfg as Record<string, unknown>)[field] = v;
    });
    const limit = Number(params.get("l"));
    if (Number.isFinite(limit) && limit > 1) cfg.limit = limit;
    const style = { ...DEFAULT_STYLE };
    const title = params.get("ti");
    if (title) style.title = title;
    const pal = params.get("p");
    if (pal) style.palette = pal as VizStyle["palette"];
    Object.assign(cfg, configForType(base, cfg, cfg.type));
    set({ dataset: base, config: cfg, style });
  },
}));

export function shareParams(dataset: Dataset, config: VizConfig, style: VizStyle) {
  const p = new URLSearchParams();
  if (dataset.source === "sample") p.set("d", dataset.id);
  p.set("t", config.type);
  if (config.x) p.set("x", config.x);
  if (config.y) p.set("y", config.y);
  if (config.series) p.set("s", config.series);
  if (config.size) p.set("z", config.size);
  p.set("a", config.agg);
  p.set("o", config.sort);
  p.set("l", String(config.limit));
  if (style.title) p.set("ti", style.title);
  p.set("p", style.palette);
  return p;
}

export { SAMPLE_DATASETS };
