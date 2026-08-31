import type { BuildableMeta, BuildableType, Dataset, FieldType } from "./types";

export const BUILDABLE: Record<BuildableType, BuildableMeta> = {
  bar: { id: "bar", label: "Bar", category: "Comparison", blurb: "Compare a value across categories.", enc: { x: "any", y: "number" }, learn: "bar-chart" },
  groupedBar: { id: "groupedBar", label: "Grouped Bar", category: "Comparison", blurb: "Two categorical dimensions side by side.", enc: { x: "any", y: "number", series: true }, learn: "grouped-bar" },
  stackedBar: { id: "stackedBar", label: "Stacked Bar", category: "Comparison", blurb: "Totals split into parts.", enc: { x: "any", y: "number", series: true }, learn: "stacked-bar" },
  hbar: { id: "hbar", label: "Horizontal Bar", category: "Comparison", blurb: "Long category labels, ranked.", enc: { x: "any", y: "number" }, learn: "horizontal-bar" },
  lollipop: { id: "lollipop", label: "Lollipop", category: "Comparison", blurb: "A lighter bar chart for rankings.", enc: { x: "any", y: "number" }, learn: "lollipop-chart" },
  line: { id: "line", label: "Line", category: "Time Series", blurb: "Show change over an ordered axis.", enc: { x: "any", y: "number", series: true }, learn: "line-chart" },
  area: { id: "area", label: "Area", category: "Time Series", blurb: "A line with volume underneath.", enc: { x: "any", y: "number", series: true }, learn: "area-chart" },
  stackedArea: { id: "stackedArea", label: "Stacked Area", category: "Time Series", blurb: "Composition changing over time.", enc: { x: "any", y: "number", series: true }, learn: "stacked-area" },
  step: { id: "step", label: "Step", category: "Time Series", blurb: "Values that hold then jump.", enc: { x: "any", y: "number", series: true }, learn: "step-chart" },
  scatter: { id: "scatter", label: "Scatter", category: "Relationship", blurb: "Relationship between two numbers.", enc: { x: "number", y: "number", series: true }, learn: "scatter-plot" },
  bubble: { id: "bubble", label: "Bubble", category: "Relationship", blurb: "Scatter with a third numeric encoded as size.", enc: { x: "number", y: "number", series: true, size: true }, learn: "bubble-chart" },
  heatmap: { id: "heatmap", label: "Heatmap", category: "Relationship", blurb: "A value across two categorical axes.", enc: { x: "any", y: "number", series: true }, learn: "heatmap" },
  pie: { id: "pie", label: "Pie", category: "Composition", blurb: "Parts of a whole — few slices only.", enc: { x: "category", y: "number" }, learn: "pie-chart" },
  donut: { id: "donut", label: "Donut", category: "Composition", blurb: "Pie with room for a headline number.", enc: { x: "category", y: "number" }, learn: "donut-chart" },
  treemap: { id: "treemap", label: "Treemap", category: "Composition", blurb: "Nested rectangles sized by value.", enc: { x: "category", y: "number" }, learn: "treemap" },
  funnel: { id: "funnel", label: "Funnel", category: "Flow", blurb: "Drop-off across ordered stages.", enc: { x: "category", y: "number" }, learn: "funnel-chart" },
  waterfall: { id: "waterfall", label: "Waterfall", category: "Flow", blurb: "How a total is built up or eroded.", enc: { x: "category", y: "number" }, learn: "waterfall" },
  histogram: { id: "histogram", label: "Histogram", category: "Distribution", blurb: "The shape of one numeric column.", enc: { x: "number", yOptional: true }, learn: "histogram" },
  density: { id: "density", label: "Density", category: "Distribution", blurb: "A smoothed histogram.", enc: { x: "number", yOptional: true }, learn: "density-plot" },
  box: { id: "box", label: "Box Plot", category: "Distribution", blurb: "Spread and outliers per group.", enc: { x: "category", y: "number" }, learn: "box-plot" },
  radar: { id: "radar", label: "Radar", category: "Comparison", blurb: "Several metrics on one profile.", enc: { x: "category", y: "number", series: true }, learn: "radar-chart" },
};

export const BUILDABLE_LIST = Object.values(BUILDABLE);

export const BUILDABLE_CATEGORIES = Array.from(new Set(BUILDABLE_LIST.map((b) => b.category)));

export function fieldsOfType(ds: Dataset, t: FieldType | "any") {
  return t === "any" ? ds.fields : ds.fields.filter((f) => f.type === t);
}

/** Which chart types make sense for the currently picked fields. */
export function suggestTypes(xType?: FieldType, yType?: FieldType, hasSeries?: boolean): BuildableType[] {
  if (xType === "number" && yType === "number") return ["scatter", "bubble", "heatmap", "line"];
  if (xType === "date") return hasSeries ? ["line", "stackedArea", "area", "groupedBar"] : ["line", "area", "step", "bar"];
  if (xType === "category" && yType === "number") {
    return hasSeries ? ["groupedBar", "stackedBar", "heatmap", "radar"] : ["bar", "hbar", "lollipop", "pie", "treemap"];
  }
  if (xType === "number" && !yType) return ["histogram", "density", "box"];
  return ["bar", "line", "scatter"];
}

export function defaultConfigFor(ds: Dataset) {
  const date = ds.fields.find((f) => f.type === "date");
  const cat = ds.fields.find((f) => f.type === "category");
  const nums = ds.fields.filter((f) => f.type === "number");
  const y = nums[nums.length - 1] ?? nums[0];
  return {
    type: (date ? "line" : "bar") as BuildableType,
    x: (date ?? cat ?? nums[0])?.name,
    y: y?.name,
    series: undefined as string | undefined,
    size: undefined as string | undefined,
  };
}

/**
 * Re-map the encodings when the user switches chart type so every type in the
 * picker renders something valid instead of an error state.
 */
export function configForType<C extends { x?: string; y?: string; series?: string; size?: string; agg?: string }>(
  ds: Dataset,
  cfg: C,
  type: BuildableType,
): { x?: string; y?: string; series?: string; size?: string } {
  const enc = BUILDABLE[type].enc;
  const nums = ds.fields.filter((f) => f.type === "number");
  const cats = ds.fields.filter((f) => f.type === "category");
  const dates = ds.fields.filter((f) => f.type === "date");
  const typeOf = (n?: string) => ds.fields.find((f) => f.name === n)?.type;
  const first = <T,>(...v: (T | undefined)[]) => v.find((x) => x !== undefined);

  let x = cfg.x;
  let y = cfg.y;
  let series = cfg.series;
  let size = cfg.size;

  /* X ------------------------------------------------------------------ */
  if (enc.x === "number") {
    if (typeOf(x) !== "number") x = first(nums[0]?.name);
  } else if (enc.x === "category") {
    if (typeOf(x) !== "category") x = first(cats[0]?.name, dates[0]?.name, x);
  } else if (!x) {
    x = first(dates[0]?.name, cats[0]?.name, nums[0]?.name);
  }

  /* Y ------------------------------------------------------------------ */
  if (enc.yOptional) {
    // histogram / density read the numeric column from X
    if (typeOf(x) !== "number") x = first(nums[0]?.name, x);
    y = undefined;
  } else if (typeOf(y) !== "number" || y === x) {
    y = first(nums.find((f) => f.name !== x)?.name, nums[0]?.name, y);
  }

  /* Series -------------------------------------------------------------- */
  if (!enc.series) {
    series = undefined;
  } else if (type === "heatmap") {
    // heatmap needs both axes — pick a second categorical field
    if (!series || series === x || typeOf(series) === "number") {
      series = first(cats.find((f) => f.name !== x)?.name, dates.find((f) => f.name !== x)?.name, cats[0]?.name);
    }
  } else if (series && (series === x || typeOf(series) === "number")) {
    series = undefined;
  }

  /* Size ---------------------------------------------------------------- */
  if (!enc.size) size = undefined;
  else if (typeOf(size) !== "number") size = first(nums.find((f) => f.name !== x && f.name !== y)?.name, nums[0]?.name);

  return { x, y, series, size };
}
