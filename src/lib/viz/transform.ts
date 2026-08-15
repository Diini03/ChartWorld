import type { Agg, Dataset, FieldType, Row, VizConfig } from "./types";

export interface BoxStat { name: string; min: number; q1: number; median: number; q3: number; max: number; count: number }
export interface MatrixCell { x: string; y: string; v: number }

export interface VizFrame {
  ok: boolean;
  error?: string;
  hint?: string;
  warnings: string[];
  xKey: string;
  xType: FieldType | "bin";
  seriesKeys: string[];
  data: Record<string, string | number>[];
  box?: BoxStat[];
  matrix?: { xs: string[]; ys: string[]; cells: MatrixCell[]; min: number; max: number };
  total?: number;
  rowsUsed: number;
}

const num = (v: unknown) => (typeof v === "number" ? v : Number(v));

export function aggregate(values: number[], agg: Agg): number {
  const v = values.filter((n) => Number.isFinite(n));
  if (agg === "count") return values.length;
  if (!v.length) return 0;
  switch (agg) {
    case "sum": return v.reduce((a, b) => a + b, 0);
    case "mean": return v.reduce((a, b) => a + b, 0) / v.length;
    case "min": return Math.min(...v);
    case "max": return Math.max(...v);
    case "median": return quantile(v.slice().sort((a, b) => a - b), 0.5);
  }
}

export function quantile(sorted: number[], q: number) {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] !== undefined
    ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
    : sorted[base];
}

const roundTo = (n: number) => (Math.abs(n) >= 1000 ? Math.round(n) : Number(n.toFixed(2)));

function groupBy(rows: Row[], key: string) {
  const m = new Map<string, Row[]>();
  rows.forEach((r) => {
    const k = String(r[key] ?? "—");
    const arr = m.get(k);
    if (arr) arr.push(r); else m.set(k, [r]);
  });
  return m;
}

function sortKeys(keys: string[], xType: FieldType, values: Map<string, number>, order: VizConfig["sort"]) {
  if (order === "none") {
    return xType === "date" ? keys.slice().sort() : keys;
  }
  return keys.slice().sort((a, b) =>
    order === "desc" ? (values.get(b) ?? 0) - (values.get(a) ?? 0) : (values.get(a) ?? 0) - (values.get(b) ?? 0));
}

const fail = (error: string, hint: string): VizFrame => ({
  ok: false, error, hint, warnings: [], xKey: "x", xType: "category", seriesKeys: [], data: [], rowsUsed: 0,
});

export function buildFrame(ds: Dataset, cfg: VizConfig): VizFrame {
  const fieldType = (name?: string): FieldType | undefined => ds.fields.find((f) => f.name === name)?.type;
  const warnings: string[] = [];
  const rows = ds.rows;
  const t = cfg.type;

  /* ---- distribution charts need one numeric column ---- */
  if (t === "histogram" || t === "density") {
    const col = cfg.x;
    if (!col || fieldType(col) !== "number") {
      return fail("Choose a numerical column.", "Histograms describe the spread of numbers — pick a numeric field for the value axis.");
    }
    const values = rows.map((r) => num(r[col])).filter(Number.isFinite);
    if (!values.length) return fail("This column has no usable numbers.", "Try another column or check your file for empty values.");
    const min = Math.min(...values), max = Math.max(...values);
    const bins = Math.max(3, Math.min(60, cfg.bins || 12));
    const width = (max - min) / bins || 1;
    const counts = new Array(bins).fill(0);
    values.forEach((v) => { counts[Math.min(bins - 1, Math.floor((v - min) / width))]++; });
    const data = counts.map((c, i) => ({
      x: `${roundTo(min + i * width)}`,
      binStart: roundTo(min + i * width),
      Count: c,
      Density: Number(((c / values.length) / width).toFixed(6)),
    }));
    return { ok: true, warnings, xKey: "x", xType: "bin", seriesKeys: [t === "density" ? "Density" : "Count"], data, rowsUsed: values.length };
  }

  /* ---- box plot ---- */
  if (t === "box") {
    if (!cfg.x || !cfg.y || fieldType(cfg.y) !== "number") {
      return fail("Box plots need a group and a numeric column.", "Pick a category for the groups and a numeric column for the values.");
    }
    const groups = groupBy(rows, cfg.x);
    const box: BoxStat[] = [];
    groups.forEach((rs, name) => {
      const v = rs.map((r) => num(r[cfg.y!])).filter(Number.isFinite).sort((a, b) => a - b);
      if (!v.length) return;
      box.push({
        name,
        min: roundTo(v[0]), q1: roundTo(quantile(v, 0.25)), median: roundTo(quantile(v, 0.5)),
        q3: roundTo(quantile(v, 0.75)), max: roundTo(v[v.length - 1]), count: v.length,
      });
    });
    box.sort((a, b) => (cfg.sort === "asc" ? a.median - b.median : cfg.sort === "desc" ? b.median - a.median : 0));
    const limited = box.slice(0, cfg.limit || 12);
    if (box.length > limited.length) warnings.push(`Showing the top ${limited.length} of ${box.length} groups.`);
    return {
      ok: true, warnings, xKey: "name", xType: "category", seriesKeys: ["median"],
      data: limited.map((b) => ({ name: b.name, base: b.q1, iqr: b.q3 - b.q1, median: b.median, min: b.min, max: b.max, q1: b.q1, q3: b.q3 })),
      box: limited, rowsUsed: rows.length,
    };
  }

  /* ---- point charts ---- */
  if (t === "scatter" || t === "bubble") {
    if (fieldType(cfg.x) !== "number" || fieldType(cfg.y) !== "number") {
      return fail("Scatter plots need two numerical columns.", "Choose numbers for both X and Y — categories can be used for colour instead.");
    }
    const cap = 2000;
    const source = rows.slice(0, cap);
    if (rows.length > cap) warnings.push(`Plotting the first ${cap} of ${rows.length} rows for speed.`);
    const seriesField = cfg.series;
    const data = source.map((r) => ({
      x: num(r[cfg.x!]),
      y: num(r[cfg.y!]),
      z: cfg.size ? num(r[cfg.size]) : 1,
      group: seriesField ? String(r[seriesField]) : "All",
    })).filter((d) => Number.isFinite(d.x) && Number.isFinite(d.y));
    const seriesKeys = Array.from(new Set(data.map((d) => d.group))).slice(0, 8);
    return { ok: true, warnings, xKey: "x", xType: "number", seriesKeys, data, rowsUsed: data.length };
  }

  /* ---- heatmap: two categorical axes ---- */
  if (t === "heatmap") {
    if (!cfg.x || !cfg.series || !cfg.y) {
      return fail("Heatmaps need two axes and a value.", "Pick a column for X, a column for Y (the “Split by” field) and a numeric value.");
    }
    const map = new Map<string, number[]>();
    rows.forEach((r) => {
      const k = `${r[cfg.x!]}||${r[cfg.series!]}`;
      const arr = map.get(k);
      const v = num(r[cfg.y!]);
      if (arr) arr.push(v); else map.set(k, [v]);
    });
    const xs = Array.from(new Set(rows.map((r) => String(r[cfg.x!])))).slice(0, 24);
    const ys = Array.from(new Set(rows.map((r) => String(r[cfg.series!])))).slice(0, 16);
    const cells: MatrixCell[] = [];
    let min = Infinity, max = -Infinity;
    xs.forEach((x) => ys.forEach((y) => {
      const v = roundTo(aggregate(map.get(`${x}||${y}`) ?? [], cfg.agg));
      min = Math.min(min, v); max = Math.max(max, v);
      cells.push({ x, y, v });
    }));
    return { ok: true, warnings, xKey: "x", xType: "category", seriesKeys: ys, data: [], matrix: { xs, ys, cells, min, max }, rowsUsed: rows.length };
  }

  /* ---- aggregated categorical / temporal charts ---- */
  if (!cfg.x) return fail("Choose a column for the X axis.", "The X axis decides how your rows are grouped.");
  const xType = fieldType(cfg.x) ?? "category";
  const needsY = cfg.agg !== "count";
  if (needsY && (!cfg.y || fieldType(cfg.y) !== "number")) {
    return fail("This chart needs a numerical value.", "Pick a numeric column for Y, or switch the aggregation to “Count of rows”.");
  }

  const seriesField = cfg.series && cfg.series !== cfg.x ? cfg.series : undefined;
  const grouped = groupBy(rows, cfg.x);
  const totals = new Map<string, number>();
  const perSeries = new Map<string, Map<string, number[]>>();

  grouped.forEach((rs, xVal) => {
    const inner = new Map<string, number[]>();
    rs.forEach((r) => {
      const s = seriesField ? String(r[seriesField]) : "value";
      const v = needsY ? num(r[cfg.y!]) : 1;
      const arr = inner.get(s);
      if (arr) arr.push(v); else inner.set(s, [v]);
    });
    perSeries.set(xVal, inner);
    const all: number[] = [];
    inner.forEach((v) => all.push(...v));
    totals.set(xVal, aggregate(all, cfg.agg));
  });

  let keys = sortKeys(Array.from(grouped.keys()), xType, totals, cfg.sort);
  const limit = Math.max(2, cfg.limit || 15);
  if (keys.length > limit) {
    warnings.push(`Showing ${limit} of ${keys.length} groups — raise the limit or aggregate further.`);
    keys = cfg.sort === "none" ? keys.slice(0, limit) : keys.slice(0, limit);
  }

  let seriesKeys = seriesField
    ? Array.from(new Set(rows.map((r) => String(r[seriesField])))).slice(0, 10)
    : ["value"];
  if (seriesField && seriesKeys.length === 10) warnings.push("Only the first 10 series are shown.");

  const data = keys.map((k) => {
    const row: Record<string, string | number> = { x: k };
    const inner = perSeries.get(k)!;
    seriesKeys.forEach((s) => { row[s] = roundTo(aggregate(inner.get(s) ?? [], cfg.agg)); });
    row.__total = roundTo(totals.get(k) ?? 0);
    return row;
  });

  if (t === "waterfall") {
    let running = 0;
    data.forEach((d) => {
      const v = Number(d[seriesKeys[0]]);
      d.__base = running;
      d.__delta = v;
      running += v;
    });
  }

  if ((t === "pie" || t === "donut") && keys.length > 8) {
    warnings.push("Pie charts get hard to read past ~6 slices — a bar chart ranks these more clearly.");
  }

  const label = seriesField ? undefined : (cfg.agg === "count" ? "Count" : `${cfg.agg} of ${cfg.y}`);
  if (label) {
    data.forEach((d) => { d[label] = d.value; delete d.value; });
    seriesKeys = [label];
  }

  return {
    ok: true, warnings, xKey: "x", xType, seriesKeys, data,
    total: data.reduce((a, d) => a + Number(d.__total ?? 0), 0),
    rowsUsed: rows.length,
  };
}
