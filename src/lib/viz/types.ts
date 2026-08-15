export type FieldType = "number" | "category" | "date";

export interface Field {
  name: string;
  type: FieldType;
  description?: string;
}

export interface Dataset {
  id: string;
  name: string;
  domain: string;
  description: string;
  fields: Field[];
  rows: Row[];
  source: "sample" | "upload";
}

export type Row = Record<string, string | number>;

export type Agg = "sum" | "mean" | "median" | "count" | "min" | "max";
export type SortOrder = "none" | "asc" | "desc";

export type BuildableType =
  | "bar" | "groupedBar" | "stackedBar" | "hbar" | "lollipop"
  | "line" | "area" | "stackedArea" | "step"
  | "scatter" | "bubble"
  | "pie" | "donut" | "treemap" | "funnel" | "waterfall"
  | "histogram" | "box" | "density"
  | "heatmap" | "radar";

export interface VizConfig {
  type: BuildableType;
  x?: string;
  y?: string;
  series?: string;
  size?: string;
  agg: Agg;
  sort: SortOrder;
  limit: number;
  bins: number;
}

export interface VizStyle {
  title: string;
  subtitle: string;
  xLabel: string;
  yLabel: string;
  legend: boolean;
  grid: boolean;
  dataLabels: boolean;
  markers: boolean;
  fontSize: number;
  lineWidth: number;
  opacity: number;
  height: number;
  palette: PaletteId;
  rounded: boolean;
}

export type PaletteId = "signal" | "ember" | "botanic" | "ink" | "candy";

export interface EncodingSpec {
  x?: FieldType | "any";
  y?: FieldType | "any";
  series?: boolean;
  size?: boolean;
  /** y is derived (histogram/box/density need only a numeric field) */
  yOptional?: boolean;
}

export interface BuildableMeta {
  id: BuildableType;
  label: string;
  category: string;
  blurb: string;
  enc: EncodingSpec;
  /** slug in the learning catalog, when one exists */
  learn?: string;
}
