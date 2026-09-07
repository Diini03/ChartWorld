/**
 * Ready-to-run Python templates for every chart in the learning catalog.
 *
 * Each template is a complete script: imports, a CSV load, and a clearly
 * marked configuration block at the top so a reader only has to swap the
 * column names for their own data.
 */

export type SnippetLibrary = "Matplotlib" | "Seaborn" | "Plotly";

export interface ReadySnippet {
  library: SnippetLibrary;
  code: string;
  note: string;
}

type Kind = string;

/** Which config slots a given chart actually uses. */
interface Slots {
  x?: string;
  y?: string;
  group?: string;
  size?: string;
  extra?: string[];
}

const CONFIG_DOC: Record<string, string> = {
  X_COL: "the column on the X axis",
  Y_COL: "the numeric column being measured",
  GROUP_COL: "optional column used for colour / sub-groups",
  SIZE_COL: "numeric column encoded as marker size",
  DATE_COL: "a date column (parsed automatically)",
  LABEL_COL: "the text label for each item",
  VALUE_COL: "the numeric value for each item",
  SOURCE_COL: "where the flow starts",
  TARGET_COL: "where the flow ends",
  LAT_COL: "latitude",
  LON_COL: "longitude",
  REGION_COL: "region / country code",
  START_COL: "task start date",
  END_COL: "task end date",
  TASK_COL: "task name",
};

function configBlock(vars: Record<string, string>) {
  const width = Math.max(...Object.keys(vars).map((k) => k.length));
  return Object.entries(vars)
    .map(([k, v]) => `${k.padEnd(width)} = ${JSON.stringify(v)}${CONFIG_DOC[k] ? `  # ${CONFIG_DOC[k]}` : ""}`)
    .join("\n");
}

function script(imports: string[], vars: Record<string, string>, body: string, parseDates?: string) {
  return `# ─── Ready to run ──────────────────────────────────────────────
# 1. Put your CSV next to this file
# 2. Change only the column names below — nothing else needs editing
${imports.join("\n")}

CSV_PATH = "your_data.csv"
${configBlock(vars)}

df = pd.read_csv(CSV_PATH${parseDates ? `, parse_dates=[${parseDates}]` : ""})

${body.trim()}
`;
}

const MPL = ["import pandas as pd", "import matplotlib.pyplot as plt"];
const MPL_NP = ["import numpy as np", "import pandas as pd", "import matplotlib.pyplot as plt"];
const SNS = ["import pandas as pd", "import seaborn as sns", "import matplotlib.pyplot as plt", "", 'sns.set_theme(style="whitegrid")'];
const PX = ["import pandas as pd", "import plotly.express as px"];

const XY = { X_COL: "category", Y_COL: "value" };
const XYG = { X_COL: "category", Y_COL: "value", GROUP_COL: "group" };
const NUM2 = { X_COL: "x_value", Y_COL: "y_value" };
const TS = { DATE_COL: "date", Y_COL: "value" };
const LV = { LABEL_COL: "label", VALUE_COL: "value" };

const show = (extra = "") => `${extra}plt.tight_layout()\nplt.show()`;

type Builder = () => ReadySnippet[];

/** Fallbacks used when a chart has no bespoke template. */
function genericCategorical(kindLabel: string): ReadySnippet[] {
  return [
    {
      library: "Matplotlib",
      code: script(MPL, XY, `agg = df.groupby(X_COL, as_index=False)[Y_COL].sum().sort_values(Y_COL, ascending=False)

fig, ax = plt.subplots(figsize=(9, 5))
ax.bar(agg[X_COL], agg[Y_COL], color="#4f46e5")
ax.set_title(f"{Y_COL} by {X_COL}")
ax.set_xlabel(X_COL); ax.set_ylabel(Y_COL)
plt.xticks(rotation=45, ha="right")
${show()}`),
      note: `A dependable ${kindLabel} starting point — aggregate, sort, plot.`,
    },
    {
      library: "Seaborn",
      code: script(SNS, XY, `sns.barplot(data=df, x=X_COL, y=Y_COL, estimator="sum", errorbar=None)
plt.xticks(rotation=45, ha="right")
${show()}`),
      note: "Seaborn aggregates for you — swap `estimator` for mean/median.",
    },
    {
      library: "Plotly",
      code: script(PX, XY, `agg = df.groupby(X_COL, as_index=False)[Y_COL].sum()

fig = px.bar(agg, x=X_COL, y=Y_COL, title=f"{Y_COL} by {X_COL}")
fig.update_layout(template="plotly_white")
fig.show()`),
      note: "Interactive out of the box — hover for exact values.",
    },
  ];
}

const BUILDERS: Record<Kind, Builder> = {
  bar: () => genericCategorical("bar chart"),

  hbar: () => [
    { library: "Matplotlib", code: script(MPL, XY, `agg = df.groupby(X_COL, as_index=False)[Y_COL].sum().sort_values(Y_COL)

fig, ax = plt.subplots(figsize=(8, 6))
ax.barh(agg[X_COL], agg[Y_COL], color="#4f46e5")
ax.set_xlabel(Y_COL)
${show()}`), note: "Horizontal bars give long category labels room to breathe." },
    { library: "Seaborn", code: script(SNS, XY, `agg = df.groupby(X_COL, as_index=False)[Y_COL].sum().sort_values(Y_COL, ascending=False)
sns.barplot(data=agg, y=X_COL, x=Y_COL, orient="h")
${show()}`), note: "Sort first — Seaborn keeps the order you give it." },
    { library: "Plotly", code: script(PX, XY, `agg = df.groupby(X_COL, as_index=False)[Y_COL].sum().sort_values(Y_COL)
px.bar(agg, x=Y_COL, y=X_COL, orientation="h", template="plotly_white").show()`), note: "`orientation='h'` is the only change from a vertical bar." },
  ],

  dot: () => [
    { library: "Matplotlib", code: script(MPL, XY, `agg = df.groupby(X_COL, as_index=False)[Y_COL].mean().sort_values(Y_COL)

fig, ax = plt.subplots(figsize=(8, 6))
ax.hlines(agg[X_COL], 0, agg[Y_COL], color="#d4d4d8")
ax.plot(agg[Y_COL], agg[X_COL], "o", color="#4f46e5", markersize=9)
ax.set_xlabel(Y_COL)
${show()}`), note: "Dots carry the value; the light rule guides the eye." },
    { library: "Seaborn", code: script(SNS, XY, `sns.pointplot(data=df, y=X_COL, x=Y_COL, join=False, errorbar=None)
${show()}`), note: "`join=False` turns a point plot into a dot plot." },
    { library: "Plotly", code: script(PX, XY, `agg = df.groupby(X_COL, as_index=False)[Y_COL].mean().sort_values(Y_COL)
px.scatter(agg, x=Y_COL, y=X_COL, template="plotly_white").show()`), note: "A scatter with a categorical axis is a dot plot." },
  ],

  lollipop: () => [
    { library: "Matplotlib", code: script(MPL, XY, `agg = df.groupby(X_COL, as_index=False)[Y_COL].sum().sort_values(Y_COL)

fig, ax = plt.subplots(figsize=(8, 6))
ax.hlines(agg[X_COL], 0, agg[Y_COL], color="#4f46e5", linewidth=2)
ax.plot(agg[Y_COL], agg[X_COL], "o", color="#4f46e5", markersize=8)
ax.set_xlabel(Y_COL)
${show()}`), note: "Stems plus dots — the low-ink version of a bar chart." },
    { library: "Seaborn", code: script(SNS, XY, `agg = df.groupby(X_COL, as_index=False)[Y_COL].sum().sort_values(Y_COL)
plt.hlines(agg[X_COL], 0, agg[Y_COL], color="#c7d2fe", linewidth=2)
sns.scatterplot(data=agg, x=Y_COL, y=X_COL, s=90)
${show()}`), note: "Draw the stems with matplotlib, the heads with Seaborn." },
    { library: "Plotly", code: script(PX, XY, `agg = df.groupby(X_COL, as_index=False)[Y_COL].sum().sort_values(Y_COL)
fig = px.scatter(agg, x=Y_COL, y=X_COL, template="plotly_white")
for _, r in agg.iterrows():
    fig.add_shape(type="line", x0=0, x1=r[Y_COL], y0=r[X_COL], y1=r[X_COL], line=dict(color="#c7d2fe", width=2))
fig.show()`), note: "Shapes provide the stems behind each marker." },
  ],

  groupedBar: () => [
    { library: "Matplotlib", code: script(MPL_NP, XYG, `pivot = df.pivot_table(index=X_COL, columns=GROUP_COL, values=Y_COL, aggfunc="sum").fillna(0)
x = np.arange(len(pivot)); width = 0.8 / len(pivot.columns)

fig, ax = plt.subplots(figsize=(9, 5))
for i, col in enumerate(pivot.columns):
    ax.bar(x + i * width - 0.4 + width / 2, pivot[col], width, label=str(col))
ax.set_xticks(x); ax.set_xticklabels(pivot.index, rotation=45, ha="right")
ax.legend(title=GROUP_COL, frameon=False)
${show()}`), note: "Pivot first, then offset each group by one bar width." },
    { library: "Seaborn", code: script(SNS, XYG, `sns.barplot(data=df, x=X_COL, y=Y_COL, hue=GROUP_COL, estimator="sum", errorbar=None)
plt.xticks(rotation=45, ha="right")
${show()}`), note: "`hue` is all it takes — Seaborn handles the offsets." },
    { library: "Plotly", code: script(PX, XYG, `agg = df.groupby([X_COL, GROUP_COL], as_index=False)[Y_COL].sum()
px.bar(agg, x=X_COL, y=Y_COL, color=GROUP_COL, barmode="group", template="plotly_white").show()`), note: "`barmode='group'` is the key parameter." },
  ],

  stackedBar: () => [
    { library: "Matplotlib", code: script(MPL_NP, XYG, `pivot = df.pivot_table(index=X_COL, columns=GROUP_COL, values=Y_COL, aggfunc="sum").fillna(0)

fig, ax = plt.subplots(figsize=(9, 5))
bottom = np.zeros(len(pivot))
for col in pivot.columns:
    ax.bar(pivot.index, pivot[col], bottom=bottom, label=str(col))
    bottom += pivot[col].values
ax.legend(title=GROUP_COL, frameon=False)
plt.xticks(rotation=45, ha="right")
${show()}`), note: "Track a running `bottom` so each segment sits on the last." },
    { library: "Seaborn", code: script(SNS, XYG, `pivot = df.pivot_table(index=X_COL, columns=GROUP_COL, values=Y_COL, aggfunc="sum").fillna(0)
pivot.plot(kind="bar", stacked=True, colormap="viridis", figsize=(9, 5))
plt.xticks(rotation=45, ha="right")
${show()}`), note: "Seaborn has no native stack — pandas' plot does it cleanly." },
    { library: "Plotly", code: script(PX, XYG, `agg = df.groupby([X_COL, GROUP_COL], as_index=False)[Y_COL].sum()
px.bar(agg, x=X_COL, y=Y_COL, color=GROUP_COL, barmode="stack", template="plotly_white").show()`), note: "Swap to `barnorm='percent'` for a 100% stacked bar." },
  ],

  line: () => [
    { library: "Matplotlib", code: script(MPL, TS, `series = df.groupby(DATE_COL, as_index=False)[Y_COL].sum().sort_values(DATE_COL)

fig, ax = plt.subplots(figsize=(9, 5))
ax.plot(series[DATE_COL], series[Y_COL], color="#4f46e5", linewidth=2)
ax.set_xlabel(DATE_COL); ax.set_ylabel(Y_COL)
ax.grid(alpha=0.25)
fig.autofmt_xdate()
${show()}`, "DATE_COL"), note: "`parse_dates` gives you a real time axis for free." },
    { library: "Seaborn", code: script(SNS, TS, `sns.lineplot(data=df, x=DATE_COL, y=Y_COL, estimator="sum", errorbar=None, linewidth=2)
plt.xticks(rotation=45, ha="right")
${show()}`, "DATE_COL"), note: "Add `hue=` to draw one line per group." },
    { library: "Plotly", code: script(PX, TS, `series = df.groupby(DATE_COL, as_index=False)[Y_COL].sum().sort_values(DATE_COL)
px.line(series, x=DATE_COL, y=Y_COL, markers=True, template="plotly_white").show()`, "DATE_COL"), note: "Plotly adds range-zoom and hover automatically." },
  ],

  step: () => [
    { library: "Matplotlib", code: script(MPL, TS, `series = df.groupby(DATE_COL, as_index=False)[Y_COL].last().sort_values(DATE_COL)

fig, ax = plt.subplots(figsize=(9, 5))
ax.step(series[DATE_COL], series[Y_COL], where="post", color="#4f46e5", linewidth=2)
fig.autofmt_xdate()
${show()}`, "DATE_COL"), note: "`where='post'` holds each value until the next change." },
    { library: "Seaborn", code: script(SNS, TS, `sns.lineplot(data=df, x=DATE_COL, y=Y_COL, drawstyle="steps-post", linewidth=2)
${show()}`, "DATE_COL"), note: "`drawstyle` converts any line plot into steps." },
    { library: "Plotly", code: script(PX, TS, `series = df.groupby(DATE_COL, as_index=False)[Y_COL].last().sort_values(DATE_COL)
px.line(series, x=DATE_COL, y=Y_COL, line_shape="hv", template="plotly_white").show()`, "DATE_COL"), note: "`line_shape='hv'` gives the stepped path." },
  ],

  area: () => [
    { library: "Matplotlib", code: script(MPL, TS, `series = df.groupby(DATE_COL, as_index=False)[Y_COL].sum().sort_values(DATE_COL)

fig, ax = plt.subplots(figsize=(9, 5))
ax.fill_between(series[DATE_COL], series[Y_COL], color="#4f46e5", alpha=0.3)
ax.plot(series[DATE_COL], series[Y_COL], color="#4f46e5", linewidth=2)
fig.autofmt_xdate()
${show()}`, "DATE_COL"), note: "Fill plus line keeps the edge crisp." },
    { library: "Seaborn", code: script(SNS, TS, `series = df.groupby(DATE_COL, as_index=False)[Y_COL].sum().sort_values(DATE_COL)
sns.lineplot(data=series, x=DATE_COL, y=Y_COL, linewidth=2)
plt.fill_between(series[DATE_COL], series[Y_COL], alpha=0.25)
${show()}`, "DATE_COL"), note: "Seaborn draws the line, matplotlib fills beneath it." },
    { library: "Plotly", code: script(PX, TS, `series = df.groupby(DATE_COL, as_index=False)[Y_COL].sum().sort_values(DATE_COL)
px.area(series, x=DATE_COL, y=Y_COL, template="plotly_white").show()`, "DATE_COL"), note: "`px.area` handles the fill and the line together." },
  ],

  stackedArea: () => [
    { library: "Matplotlib", code: script(MPL, { DATE_COL: "date", Y_COL: "value", GROUP_COL: "group" }, `pivot = df.pivot_table(index=DATE_COL, columns=GROUP_COL, values=Y_COL, aggfunc="sum").fillna(0).sort_index()

fig, ax = plt.subplots(figsize=(9, 5))
ax.stackplot(pivot.index, pivot.T.values, labels=[str(c) for c in pivot.columns], alpha=0.85)
ax.legend(loc="upper left", frameon=False)
fig.autofmt_xdate()
${show()}`, "DATE_COL"), note: "`stackplot` takes one row per series." },
    { library: "Seaborn", code: script(SNS, { DATE_COL: "date", Y_COL: "value", GROUP_COL: "group" }, `pivot = df.pivot_table(index=DATE_COL, columns=GROUP_COL, values=Y_COL, aggfunc="sum").fillna(0).sort_index()
pivot.plot(kind="area", stacked=True, alpha=0.85, figsize=(9, 5), colormap="viridis")
${show()}`, "DATE_COL"), note: "Pivot to wide format, then let pandas stack." },
    { library: "Plotly", code: script(PX, { DATE_COL: "date", Y_COL: "value", GROUP_COL: "group" }, `agg = df.groupby([DATE_COL, GROUP_COL], as_index=False)[Y_COL].sum()
px.area(agg, x=DATE_COL, y=Y_COL, color=GROUP_COL, template="plotly_white").show()`, "DATE_COL"), note: "`color=` stacks the series in long format." },
  ],

  scatter: () => [
    { library: "Matplotlib", code: script(MPL, NUM2, `fig, ax = plt.subplots(figsize=(7, 6))
ax.scatter(df[X_COL], df[Y_COL], s=36, alpha=0.7, color="#4f46e5", edgecolors="white", linewidths=0.5)
ax.set_xlabel(X_COL); ax.set_ylabel(Y_COL)
${show()}`), note: "Transparency stops dense clouds from turning into a blob." },
    { library: "Seaborn", code: script(SNS, { X_COL: "x_value", Y_COL: "y_value", GROUP_COL: "group" }, `sns.scatterplot(data=df, x=X_COL, y=Y_COL, hue=GROUP_COL, alpha=0.75)
${show()}`), note: "Delete `hue=` if you don't have a grouping column." },
    { library: "Plotly", code: script(PX, { X_COL: "x_value", Y_COL: "y_value", GROUP_COL: "group" }, `px.scatter(df, x=X_COL, y=Y_COL, color=GROUP_COL, opacity=0.75,
           trendline="ols", template="plotly_white").show()`), note: "`trendline='ols'` needs statsmodels — drop it if unavailable." },
  ],

  bubble: () => [
    { library: "Matplotlib", code: script(MPL, { X_COL: "x_value", Y_COL: "y_value", SIZE_COL: "size_value" }, `sizes = df[SIZE_COL] / df[SIZE_COL].max() * 400

fig, ax = plt.subplots(figsize=(7, 6))
ax.scatter(df[X_COL], df[Y_COL], s=sizes, alpha=0.6, color="#4f46e5", edgecolors="white")
ax.set_xlabel(X_COL); ax.set_ylabel(Y_COL)
${show()}`), note: "Always scale by area, never by radius." },
    { library: "Seaborn", code: script(SNS, { X_COL: "x_value", Y_COL: "y_value", SIZE_COL: "size_value", GROUP_COL: "group" }, `sns.scatterplot(data=df, x=X_COL, y=Y_COL, size=SIZE_COL, hue=GROUP_COL, sizes=(20, 400), alpha=0.7)
plt.legend(bbox_to_anchor=(1.02, 1), loc="upper left")
${show()}`), note: "`sizes=` sets the min/max marker area in points²." },
    { library: "Plotly", code: script(PX, { X_COL: "x_value", Y_COL: "y_value", SIZE_COL: "size_value", GROUP_COL: "group" }, `px.scatter(df, x=X_COL, y=Y_COL, size=SIZE_COL, color=GROUP_COL,
           size_max=45, template="plotly_white").show()`), note: "`size_max` caps the largest bubble." },
  ],

  hexbin: () => [
    { library: "Matplotlib", code: script(MPL, NUM2, `fig, ax = plt.subplots(figsize=(7, 6))
hb = ax.hexbin(df[X_COL], df[Y_COL], gridsize=30, cmap="viridis", mincnt=1)
fig.colorbar(hb, ax=ax, label="count")
ax.set_xlabel(X_COL); ax.set_ylabel(Y_COL)
${show()}`), note: "Hexbin beats scatter once you pass ~5,000 points." },
    { library: "Seaborn", code: script(SNS, NUM2, `sns.jointplot(data=df, x=X_COL, y=Y_COL, kind="hex", height=7)
plt.show()`), note: "`jointplot` adds the marginal distributions too." },
    { library: "Plotly", code: script(PX, NUM2, `px.density_heatmap(df, x=X_COL, y=Y_COL, nbinsx=30, nbinsy=30,
                   color_continuous_scale="Viridis", template="plotly_white").show()`), note: "Plotly bins into rectangles rather than hexes." },
  ],

  corr: () => [
    { library: "Matplotlib", code: script(MPL, {}, `corr = df.select_dtypes("number").corr()

fig, ax = plt.subplots(figsize=(7, 6))
im = ax.imshow(corr, cmap="RdBu_r", vmin=-1, vmax=1)
ax.set_xticks(range(len(corr))); ax.set_xticklabels(corr.columns, rotation=45, ha="right")
ax.set_yticks(range(len(corr))); ax.set_yticklabels(corr.columns)
fig.colorbar(im, ax=ax)
${show()}`), note: "No column names to edit — it uses every numeric column." },
    { library: "Seaborn", code: script(SNS, {}, `corr = df.select_dtypes("number").corr()
sns.heatmap(corr, annot=True, fmt=".2f", cmap="RdBu_r", vmin=-1, vmax=1, square=True)
${show()}`), note: "Always centre a correlation colour scale on zero." },
    { library: "Plotly", code: script(PX, {}, `corr = df.select_dtypes("number").corr()
px.imshow(corr, text_auto=".2f", color_continuous_scale="RdBu_r", zmin=-1, zmax=1).show()`), note: "`text_auto` prints the coefficient in each cell." },
  ],

  heatmap: () => [
    { library: "Matplotlib", code: script(MPL, { X_COL: "column_key", GROUP_COL: "row_key", Y_COL: "value" }, `pivot = df.pivot_table(index=GROUP_COL, columns=X_COL, values=Y_COL, aggfunc="mean")

fig, ax = plt.subplots(figsize=(9, 6))
im = ax.imshow(pivot, cmap="viridis", aspect="auto")
ax.set_xticks(range(len(pivot.columns))); ax.set_xticklabels(pivot.columns, rotation=45, ha="right")
ax.set_yticks(range(len(pivot.index))); ax.set_yticklabels(pivot.index)
fig.colorbar(im, ax=ax, label=Y_COL)
${show()}`), note: "A heatmap is just a pivot table with colour." },
    { library: "Seaborn", code: script(SNS, { X_COL: "column_key", GROUP_COL: "row_key", Y_COL: "value" }, `pivot = df.pivot_table(index=GROUP_COL, columns=X_COL, values=Y_COL, aggfunc="mean")
sns.heatmap(pivot, annot=True, fmt=".0f", cmap="mako", linewidths=0.5)
${show()}`), note: "`linewidths` separates the cells for readability." },
    { library: "Plotly", code: script(PX, { X_COL: "column_key", GROUP_COL: "row_key", Y_COL: "value" }, `pivot = df.pivot_table(index=GROUP_COL, columns=X_COL, values=Y_COL, aggfunc="mean")
px.imshow(pivot, text_auto=True, color_continuous_scale="Teal", aspect="auto").show()`), note: "Hover shows the exact value for every cell." },
  ],

  histogram: () => [
    { library: "Matplotlib", code: script(MPL, { X_COL: "value" }, `fig, ax = plt.subplots(figsize=(8, 5))
ax.hist(df[X_COL].dropna(), bins=20, color="#4f46e5", alpha=0.85, edgecolor="white")
ax.set_xlabel(X_COL); ax.set_ylabel("Frequency")
${show()}`), note: "Try a few bin counts — the shape can change a lot." },
    { library: "Seaborn", code: script(SNS, { X_COL: "value" }, `sns.histplot(data=df, x=X_COL, bins=20, kde=True)
${show()}`), note: "`kde=True` overlays a smoothed density curve." },
    { library: "Plotly", code: script(PX, { X_COL: "value" }, `px.histogram(df, x=X_COL, nbins=20, template="plotly_white").show()`), note: "Drag on the axis to re-bin interactively." },
  ],

  density: () => [
    { library: "Matplotlib", code: script(MPL, { X_COL: "value" }, `from scipy.stats import gaussian_kde
import numpy as np

vals = df[X_COL].dropna()
kde = gaussian_kde(vals)
grid = np.linspace(vals.min(), vals.max(), 200)

fig, ax = plt.subplots(figsize=(8, 5))
ax.fill_between(grid, kde(grid), color="#4f46e5", alpha=0.35)
ax.plot(grid, kde(grid), color="#4f46e5", linewidth=2)
ax.set_xlabel(X_COL)
${show()}`), note: "SciPy's `gaussian_kde` does the smoothing." },
    { library: "Seaborn", code: script(SNS, { X_COL: "value", GROUP_COL: "group" }, `sns.kdeplot(data=df, x=X_COL, hue=GROUP_COL, fill=True, common_norm=False, alpha=0.35)
${show()}`), note: "`common_norm=False` lets each group peak at its own height." },
    { library: "Plotly", code: script(PX, { X_COL: "value" }, `px.histogram(df, x=X_COL, nbins=40, histnorm="probability density",
             marginal="rug", template="plotly_white").show()`), note: "Density-normalised histogram with a rug of raw values." },
  ],

  box: () => [
    { library: "Matplotlib", code: script(MPL, XY, `groups = [g[Y_COL].dropna().values for _, g in df.groupby(X_COL)]
labels = [k for k, _ in df.groupby(X_COL)]

fig, ax = plt.subplots(figsize=(9, 5))
ax.boxplot(groups, labels=labels, patch_artist=True, boxprops=dict(facecolor="#c7d2fe"))
plt.xticks(rotation=45, ha="right")
${show()}`), note: "One list of values per group is all `boxplot` needs." },
    { library: "Seaborn", code: script(SNS, XY, `sns.boxplot(data=df, x=X_COL, y=Y_COL)
sns.stripplot(data=df, x=X_COL, y=Y_COL, color="black", size=3, alpha=0.35)
plt.xticks(rotation=45, ha="right")
${show()}`), note: "Overlaying the raw points shows what the box hides." },
    { library: "Plotly", code: script(PX, XY, `px.box(df, x=X_COL, y=Y_COL, points="outliers", template="plotly_white").show()`), note: "Hover reports the quartiles exactly." },
  ],

  violin: () => [
    { library: "Matplotlib", code: script(MPL, XY, `groups = [g[Y_COL].dropna().values for _, g in df.groupby(X_COL)]
labels = [k for k, _ in df.groupby(X_COL)]

fig, ax = plt.subplots(figsize=(9, 5))
ax.violinplot(groups, showmedians=True)
ax.set_xticks(range(1, len(labels) + 1)); ax.set_xticklabels(labels, rotation=45, ha="right")
${show()}`), note: "`showmedians` restores the one summary stat you miss." },
    { library: "Seaborn", code: script(SNS, XY, `sns.violinplot(data=df, x=X_COL, y=Y_COL, inner="quartile", cut=0)
plt.xticks(rotation=45, ha="right")
${show()}`), note: "`cut=0` stops the shape extending past your real data." },
    { library: "Plotly", code: script(PX, XY, `px.violin(df, x=X_COL, y=Y_COL, box=True, points="all", template="plotly_white").show()`), note: "Box plus points inside the violin — the full picture." },
  ],

  pie: () => [
    { library: "Matplotlib", code: script(MPL, LV, `agg = df.groupby(LABEL_COL, as_index=False)[VALUE_COL].sum().sort_values(VALUE_COL, ascending=False)

fig, ax = plt.subplots(figsize=(6, 6))
ax.pie(agg[VALUE_COL], labels=agg[LABEL_COL], autopct="%1.1f%%", startangle=90)
ax.set_title(f"Share of {VALUE_COL}")
plt.show()`), note: "Keep it to five or six slices or use a bar chart instead." },
    { library: "Seaborn", code: script(SNS, LV, `agg = df.groupby(LABEL_COL)[VALUE_COL].sum().sort_values(ascending=False)
plt.figure(figsize=(6, 6))
plt.pie(agg.values, labels=agg.index, autopct="%1.1f%%",
        colors=sns.color_palette("pastel", len(agg)))
plt.show()`), note: "Seaborn has no pie — borrow its palette for matplotlib." },
    { library: "Plotly", code: script(PX, LV, `agg = df.groupby(LABEL_COL, as_index=False)[VALUE_COL].sum()
px.pie(agg, names=LABEL_COL, values=VALUE_COL).show()`), note: "Click a slice in the legend to pull it out." },
  ],

  donut: () => [
    { library: "Matplotlib", code: script(MPL, LV, `agg = df.groupby(LABEL_COL, as_index=False)[VALUE_COL].sum()

fig, ax = plt.subplots(figsize=(6, 6))
ax.pie(agg[VALUE_COL], labels=agg[LABEL_COL], autopct="%1.1f%%",
       startangle=90, wedgeprops=dict(width=0.45))
ax.text(0, 0, f"{agg[VALUE_COL].sum():,.0f}", ha="center", va="center", fontsize=18)
plt.show()`), note: "`wedgeprops=dict(width=…)` cuts the hole; fill it with the total." },
    { library: "Seaborn", code: script(SNS, LV, `agg = df.groupby(LABEL_COL)[VALUE_COL].sum()
plt.figure(figsize=(6, 6))
plt.pie(agg.values, labels=agg.index, wedgeprops=dict(width=0.45),
        colors=sns.color_palette("crest", len(agg)))
plt.show()`), note: "Same pie call, plus a Seaborn palette." },
    { library: "Plotly", code: script(PX, LV, `agg = df.groupby(LABEL_COL, as_index=False)[VALUE_COL].sum()
px.pie(agg, names=LABEL_COL, values=VALUE_COL, hole=0.55).show()`), note: "`hole=0.55` is the whole difference from a pie." },
  ],

  treemap: () => [
    { library: "Matplotlib", code: script(["import pandas as pd", "import matplotlib.pyplot as plt", "import squarify  # pip install squarify"], LV, `agg = df.groupby(LABEL_COL, as_index=False)[VALUE_COL].sum().sort_values(VALUE_COL, ascending=False)

plt.figure(figsize=(9, 6))
squarify.plot(sizes=agg[VALUE_COL], label=agg[LABEL_COL], alpha=0.85, pad=2)
plt.axis("off")
plt.show()`), note: "`squarify` is the standard treemap helper for matplotlib." },
    { library: "Seaborn", code: script(["import pandas as pd", "import seaborn as sns", "import matplotlib.pyplot as plt", "import squarify"], LV, `agg = df.groupby(LABEL_COL, as_index=False)[VALUE_COL].sum().sort_values(VALUE_COL, ascending=False)
squarify.plot(sizes=agg[VALUE_COL], label=agg[LABEL_COL],
              color=sns.color_palette("crest", len(agg)), alpha=0.9)
plt.axis("off"); plt.show()`), note: "Seaborn supplies the palette, squarify the layout." },
    { library: "Plotly", code: script(PX, { LABEL_COL: "label", VALUE_COL: "value", GROUP_COL: "parent_group" }, `px.treemap(df, path=[GROUP_COL, LABEL_COL], values=VALUE_COL).show()`), note: "`path=` accepts as many nesting levels as you like." },
  ],

  sunburst: () => [
    { library: "Matplotlib", code: script(MPL_NP, { GROUP_COL: "level_1", LABEL_COL: "level_2", VALUE_COL: "value" }, `outer = df.groupby(GROUP_COL)[VALUE_COL].sum()
inner = df.groupby([GROUP_COL, LABEL_COL])[VALUE_COL].sum()

fig, ax = plt.subplots(figsize=(7, 7))
ax.pie(outer, radius=1.0, labels=outer.index, wedgeprops=dict(width=0.35, edgecolor="w"))
ax.pie(inner, radius=0.65, wedgeprops=dict(width=0.35, edgecolor="w"))
plt.show()`), note: "Nested pies are the matplotlib way to fake a sunburst." },
    { library: "Seaborn", code: script(SNS, { GROUP_COL: "level_1", LABEL_COL: "level_2", VALUE_COL: "value" }, `# Seaborn has no sunburst — a nested bar shows the same hierarchy honestly
agg = df.groupby([GROUP_COL, LABEL_COL], as_index=False)[VALUE_COL].sum()
sns.barplot(data=agg, y=LABEL_COL, x=VALUE_COL, hue=GROUP_COL, dodge=False)
${show()}`), note: "When the tool lacks the chart, pick the honest alternative." },
    { library: "Plotly", code: script(PX, { GROUP_COL: "level_1", LABEL_COL: "level_2", VALUE_COL: "value" }, `px.sunburst(df, path=[GROUP_COL, LABEL_COL], values=VALUE_COL).show()`), note: "Plotly is the only one of the three with a true sunburst." },
  ],

  tree: () => [
    { library: "Matplotlib", code: script(["import pandas as pd", "import matplotlib.pyplot as plt", "import networkx as nx  # pip install networkx"], { SOURCE_COL: "parent", TARGET_COL: "child" }, `G = nx.from_pandas_edgelist(df, SOURCE_COL, TARGET_COL, create_using=nx.DiGraph)
pos = nx.nx_agraph.graphviz_layout(G, prog="dot") if hasattr(nx, "nx_agraph") else nx.spring_layout(G)

plt.figure(figsize=(10, 6))
nx.draw(G, pos, with_labels=True, node_color="#c7d2fe", node_size=1400, arrows=False)
plt.show()`), note: "An edge list of parent → child is all a tree needs." },
    { library: "Seaborn", code: script(SNS, { LABEL_COL: "label", VALUE_COL: "value" }, `# Hierarchical clustering tree over your numeric columns
sns.clustermap(df.set_index(LABEL_COL).select_dtypes("number"), cmap="mako", standard_scale=1)
plt.show()`), note: "`clustermap` draws real dendrograms on both axes." },
    { library: "Plotly", code: script(PX, { GROUP_COL: "parent", LABEL_COL: "child", VALUE_COL: "value" }, `px.treemap(df, path=[GROUP_COL, LABEL_COL], values=VALUE_COL).show()`), note: "A treemap encodes the same hierarchy with area." },
  ],

  sankey: () => [
    { library: "Matplotlib", code: script(["import pandas as pd", "import matplotlib.pyplot as plt", "from matplotlib.sankey import Sankey"], { SOURCE_COL: "source", TARGET_COL: "target", VALUE_COL: "value" }, `flows = df[VALUE_COL].tolist()
labels = (df[SOURCE_COL] + " → " + df[TARGET_COL]).tolist()

fig = plt.figure(figsize=(9, 6))
Sankey(flows=flows, labels=labels, orientations=[0] * len(flows)).finish()
plt.show()`), note: "Matplotlib's Sankey suits simple, single-stage flows." },
    { library: "Seaborn", code: script(SNS, { SOURCE_COL: "source", TARGET_COL: "target", VALUE_COL: "value" }, `# No Sankey in Seaborn — a flow matrix reads almost as well
pivot = df.pivot_table(index=SOURCE_COL, columns=TARGET_COL, values=VALUE_COL, aggfunc="sum").fillna(0)
sns.heatmap(pivot, annot=True, fmt=".0f", cmap="rocket_r")
${show()}`), note: "Source × target as a matrix keeps every number readable." },
    { library: "Plotly", code: script(["import pandas as pd", "import plotly.graph_objects as go"], { SOURCE_COL: "source", TARGET_COL: "target", VALUE_COL: "value" }, `nodes = pd.unique(df[[SOURCE_COL, TARGET_COL]].values.ravel()).tolist()
idx = {n: i for i, n in enumerate(nodes)}

fig = go.Figure(go.Sankey(
    node=dict(label=nodes, pad=18, thickness=16),
    link=dict(source=df[SOURCE_COL].map(idx), target=df[TARGET_COL].map(idx), value=df[VALUE_COL]),
))
fig.show()`), note: "Plotly wants integer node indices — the map builds them." },
  ],

  funnel: () => [
    { library: "Matplotlib", code: script(MPL, { LABEL_COL: "stage", VALUE_COL: "count" }, `agg = df.groupby(LABEL_COL, as_index=False)[VALUE_COL].sum().sort_values(VALUE_COL, ascending=True)

fig, ax = plt.subplots(figsize=(8, 5))
ax.barh(agg[LABEL_COL], agg[VALUE_COL], color="#4f46e5")
for i, v in enumerate(agg[VALUE_COL]):
    ax.text(v, i, f" {v:,.0f}", va="center")
ax.set_xlabel(VALUE_COL)
${show()}`), note: "Ordered horizontal bars are a funnel in everything but name." },
    { library: "Seaborn", code: script(SNS, { LABEL_COL: "stage", VALUE_COL: "count" }, `order = df.groupby(LABEL_COL)[VALUE_COL].sum().sort_values(ascending=False).index
sns.barplot(data=df, y=LABEL_COL, x=VALUE_COL, order=order, estimator="sum", errorbar=None)
${show()}`), note: "Set `order` explicitly so the stages stay in sequence." },
    { library: "Plotly", code: script(PX, { LABEL_COL: "stage", VALUE_COL: "count" }, `agg = df.groupby(LABEL_COL, as_index=False)[VALUE_COL].sum().sort_values(VALUE_COL, ascending=False)
px.funnel(agg, x=VALUE_COL, y=LABEL_COL).show()`), note: "Plotly labels the conversion rate between stages for you." },
  ],

  waterfall: () => [
    { library: "Matplotlib", code: script(MPL_NP, { LABEL_COL: "step", VALUE_COL: "delta" }, `steps = df[[LABEL_COL, VALUE_COL]].copy()
base = steps[VALUE_COL].cumsum().shift(fill_value=0)

fig, ax = plt.subplots(figsize=(9, 5))
colors = np.where(steps[VALUE_COL] >= 0, "#16a34a", "#dc2626")
ax.bar(steps[LABEL_COL], steps[VALUE_COL], bottom=base, color=colors)
ax.axhline(0, color="#71717a", linewidth=1)
plt.xticks(rotation=45, ha="right")
${show()}`), note: "A shifted cumulative sum gives each bar its floating base." },
    { library: "Seaborn", code: script(SNS, { LABEL_COL: "step", VALUE_COL: "delta" }, `steps = df[[LABEL_COL, VALUE_COL]].copy()
steps["base"] = steps[VALUE_COL].cumsum().shift(fill_value=0)
plt.figure(figsize=(9, 5))
plt.bar(steps[LABEL_COL], steps[VALUE_COL], bottom=steps["base"],
        color=sns.color_palette("vlag", len(steps)))
plt.xticks(rotation=45, ha="right")
${show()}`), note: "Same maths, Seaborn's diverging palette for the colours." },
    { library: "Plotly", code: script(["import pandas as pd", "import plotly.graph_objects as go"], { LABEL_COL: "step", VALUE_COL: "delta" }, `fig = go.Figure(go.Waterfall(
    x=df[LABEL_COL], y=df[VALUE_COL],
    measure=["relative"] * (len(df) - 1) + ["total"],
))
fig.update_layout(template="plotly_white")
fig.show()`), note: "`measure` marks which bars are steps and which are totals." },
  ],

  radar: () => [
    { library: "Matplotlib", code: script(MPL_NP, { LABEL_COL: "metric", VALUE_COL: "score" }, `agg = df.groupby(LABEL_COL, as_index=False)[VALUE_COL].mean()
angles = np.linspace(0, 2 * np.pi, len(agg), endpoint=False).tolist()
values = agg[VALUE_COL].tolist()
angles += angles[:1]; values += values[:1]

fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
ax.plot(angles, values, color="#4f46e5", linewidth=2)
ax.fill(angles, values, color="#4f46e5", alpha=0.25)
ax.set_xticks(angles[:-1]); ax.set_xticklabels(agg[LABEL_COL])
plt.show()`), note: "Repeat the first point at the end to close the shape." },
    { library: "Seaborn", code: script(SNS, { LABEL_COL: "metric", VALUE_COL: "score" }, `# Seaborn has no radar — a sorted bar compares metrics more accurately
agg = df.groupby(LABEL_COL, as_index=False)[VALUE_COL].mean().sort_values(VALUE_COL)
sns.barplot(data=agg, y=LABEL_COL, x=VALUE_COL)
${show()}`), note: "Radar exaggerates area; bars stay honest." },
    { library: "Plotly", code: script(PX, { LABEL_COL: "metric", VALUE_COL: "score", GROUP_COL: "profile" }, `px.line_polar(df, r=VALUE_COL, theta=LABEL_COL, color=GROUP_COL,
              line_close=True, template="plotly_white").show()`), note: "`line_close=True` joins the last point back to the first." },
  ],

  parallel: () => [
    { library: "Matplotlib", code: script(MPL, { GROUP_COL: "group" }, `from pandas.plotting import parallel_coordinates

num = df.select_dtypes("number").columns.tolist()
scaled = df.copy()
scaled[num] = (df[num] - df[num].min()) / (df[num].max() - df[num].min())

plt.figure(figsize=(10, 5))
parallel_coordinates(scaled[[GROUP_COL] + num], GROUP_COL, colormap="viridis")
plt.xticks(rotation=30, ha="right")
${show()}`), note: "Normalise every axis first or one column will dominate." },
    { library: "Seaborn", code: script(SNS, { GROUP_COL: "group" }, `num = df.select_dtypes("number").columns.tolist()
long = df.melt(id_vars=GROUP_COL, value_vars=num)
sns.lineplot(data=long, x="variable", y="value", hue=GROUP_COL, units=df.index, estimator=None, alpha=0.4)
plt.xticks(rotation=30, ha="right")
${show()}`), note: "Melt to long format, then one line per row." },
    { library: "Plotly", code: script(PX, { GROUP_COL: "group" }, `num = df.select_dtypes("number").columns.tolist()
px.parallel_coordinates(df, dimensions=num, color=df[GROUP_COL].astype("category").cat.codes).show()`), note: "Drag the axes to reorder and brush to filter." },
  ],

  candlestick: () => [
    { library: "Matplotlib", code: script(MPL, { DATE_COL: "date" }, `# open / high / low / close columns
O, H, L, C = "open", "high", "low", "close"

fig, ax = plt.subplots(figsize=(10, 5))
for _, r in df.iterrows():
    up = r[C] >= r[O]
    ax.plot([r[DATE_COL]] * 2, [r[L], r[H]], color="#71717a", linewidth=1)
    ax.plot([r[DATE_COL]] * 2, [r[O], r[C]], color="#16a34a" if up else "#dc2626", linewidth=6)
fig.autofmt_xdate()
${show()}`, "DATE_COL"), note: "A thin wick line plus a thick body line per row." },
    { library: "Seaborn", code: script(SNS, { DATE_COL: "date" }, `# Seaborn is not built for OHLC — plot the close with a moving average
df = df.sort_values(DATE_COL)
df["ma20"] = df["close"].rolling(20).mean()
sns.lineplot(data=df, x=DATE_COL, y="close", linewidth=1.2)
sns.lineplot(data=df, x=DATE_COL, y="ma20", linewidth=2)
${show()}`, "DATE_COL"), note: "Close plus a moving average tells most of the story." },
    { library: "Plotly", code: script(["import pandas as pd", "import plotly.graph_objects as go"], { DATE_COL: "date" }, `fig = go.Figure(go.Candlestick(
    x=df[DATE_COL], open=df["open"], high=df["high"], low=df["low"], close=df["close"],
))
fig.update_layout(template="plotly_white", xaxis_rangeslider_visible=False)
fig.show()`, "DATE_COL"), note: "Plotly has a first-class candlestick trace." },
  ],

  gantt: () => [
    { library: "Matplotlib", code: script(MPL, { TASK_COL: "task", START_COL: "start", END_COL: "end" }, `df["duration"] = (df[END_COL] - df[START_COL]).dt.days

fig, ax = plt.subplots(figsize=(10, 5))
ax.barh(df[TASK_COL], df["duration"], left=df[START_COL], color="#4f46e5")
ax.invert_yaxis()
fig.autofmt_xdate()
${show()}`, "START_COL, END_COL"), note: "`left=` on a horizontal bar gives you the start date." },
    { library: "Seaborn", code: script(SNS, { TASK_COL: "task", START_COL: "start", END_COL: "end" }, `df["duration"] = (df[END_COL] - df[START_COL]).dt.days
plt.figure(figsize=(10, 5))
plt.barh(df[TASK_COL], df["duration"], left=df[START_COL],
         color=sns.color_palette("crest", len(df)))
plt.gca().invert_yaxis()
${show()}`, "START_COL, END_COL"), note: "Seaborn colours, matplotlib geometry." },
    { library: "Plotly", code: script(PX, { TASK_COL: "task", START_COL: "start", END_COL: "end", GROUP_COL: "owner" }, `px.timeline(df, x_start=START_COL, x_end=END_COL, y=TASK_COL, color=GROUP_COL).update_yaxes(autorange="reversed").show()`, "START_COL, END_COL"), note: "`px.timeline` is a purpose-built Gantt chart." },
  ],

  timeline: () => [
    { library: "Matplotlib", code: script(MPL, { DATE_COL: "date", LABEL_COL: "event" }, `df = df.sort_values(DATE_COL)

fig, ax = plt.subplots(figsize=(10, 4))
ax.hlines(0, df[DATE_COL].min(), df[DATE_COL].max(), color="#d4d4d8")
ax.plot(df[DATE_COL], [0] * len(df), "o", color="#4f46e5")
for i, r in enumerate(df.itertuples()):
    ax.annotate(getattr(r, LABEL_COL), (getattr(r, DATE_COL), 0),
                xytext=(0, 18 if i % 2 == 0 else -24), textcoords="offset points", ha="center")
ax.get_yaxis().set_visible(False)
fig.autofmt_xdate()
${show()}`, "DATE_COL"), note: "Alternating label offsets stop the text colliding." },
    { library: "Seaborn", code: script(SNS, { DATE_COL: "date", LABEL_COL: "event" }, `df = df.sort_values(DATE_COL)
sns.scatterplot(data=df, x=DATE_COL, y=[0] * len(df), s=120)
plt.yticks([])
${show()}`, "DATE_COL"), note: "A one-row strip plot is the simplest timeline." },
    { library: "Plotly", code: script(PX, { DATE_COL: "date", LABEL_COL: "event" }, `px.scatter(df, x=DATE_COL, y=[0] * len(df), text=LABEL_COL, template="plotly_white") \\
  .update_yaxes(visible=False).show()`, "DATE_COL"), note: "Hover keeps the labels out of the way until needed." },
  ],

  calendar: () => [
    { library: "Matplotlib", code: script(MPL_NP, { DATE_COL: "date", VALUE_COL: "value" }, `s = df.set_index(DATE_COL)[VALUE_COL].resample("D").sum()
weeks = s.index.isocalendar().week.values
days = s.index.dayofweek.values
grid = np.full((7, weeks.max() + 1), np.nan)
grid[days, weeks] = s.values

fig, ax = plt.subplots(figsize=(12, 3))
im = ax.imshow(grid, cmap="Greens", aspect="auto")
ax.set_yticks(range(7)); ax.set_yticklabels(["Mon","Tue","Wed","Thu","Fri","Sat","Sun"])
fig.colorbar(im, ax=ax)
${show()}`, "DATE_COL"), note: "Week number across, weekday down — the GitHub layout." },
    { library: "Seaborn", code: script(SNS, { DATE_COL: "date", VALUE_COL: "value" }, `s = df.set_index(DATE_COL)[VALUE_COL].resample("D").sum().reset_index()
s["week"] = s[DATE_COL].dt.isocalendar().week
s["day"] = s[DATE_COL].dt.day_name().str[:3]
sns.heatmap(s.pivot_table(index="day", columns="week", values=VALUE_COL), cmap="Greens", linewidths=1)
${show()}`, "DATE_COL"), note: "Pivot to weekday × week, then heatmap it." },
    { library: "Plotly", code: script(PX, { DATE_COL: "date", VALUE_COL: "value" }, `s = df.set_index(DATE_COL)[VALUE_COL].resample("D").sum().reset_index()
s["week"] = s[DATE_COL].dt.isocalendar().week
s["day"] = s[DATE_COL].dt.dayofweek
px.density_heatmap(s, x="week", y="day", z=VALUE_COL, color_continuous_scale="Greens").show()`, "DATE_COL"), note: "Hover shows the exact date and value per cell." },
  ],

  choropleth: () => [
    { library: "Matplotlib", code: script(["import pandas as pd", "import geopandas as gpd  # pip install geopandas", "import matplotlib.pyplot as plt"], { REGION_COL: "iso_code", VALUE_COL: "value" }, `world = gpd.read_file(gpd.datasets.get_path("naturalearth_lowres"))
merged = world.merge(df, left_on="iso_a3", right_on=REGION_COL, how="left")

fig, ax = plt.subplots(figsize=(11, 6))
merged.plot(column=VALUE_COL, cmap="Blues", legend=True, edgecolor="white", linewidth=0.3, ax=ax)
ax.set_axis_off()
plt.show()`), note: "GeoPandas joins your table to real geometry." },
    { library: "Seaborn", code: script(SNS, { REGION_COL: "region", VALUE_COL: "value" }, `# Seaborn cannot draw maps — rank the regions instead
agg = df.groupby(REGION_COL, as_index=False)[VALUE_COL].sum().sort_values(VALUE_COL, ascending=False).head(20)
sns.barplot(data=agg, y=REGION_COL, x=VALUE_COL)
${show()}`), note: "A ranked bar answers \"which is biggest?\" better than a map." },
    { library: "Plotly", code: script(PX, { REGION_COL: "iso_code", VALUE_COL: "value" }, `px.choropleth(df, locations=REGION_COL, locationmode="ISO-3", color=VALUE_COL,
              color_continuous_scale="Blues").show()`), note: "No shapefile needed — Plotly ships world geometry." },
  ],

  bubbleMap: () => [
    { library: "Matplotlib", code: script(["import pandas as pd", "import geopandas as gpd", "import matplotlib.pyplot as plt"], { LAT_COL: "lat", LON_COL: "lon", VALUE_COL: "value" }, `world = gpd.read_file(gpd.datasets.get_path("naturalearth_lowres"))

fig, ax = plt.subplots(figsize=(11, 6))
world.plot(ax=ax, color="#f4f4f5", edgecolor="white")
ax.scatter(df[LON_COL], df[LAT_COL], s=df[VALUE_COL] / df[VALUE_COL].max() * 400,
           color="#4f46e5", alpha=0.6)
ax.set_axis_off()
plt.show()`), note: "Basemap first, then scatter the points on top." },
    { library: "Seaborn", code: script(SNS, { LAT_COL: "lat", LON_COL: "lon", VALUE_COL: "value" }, `sns.scatterplot(data=df, x=LON_COL, y=LAT_COL, size=VALUE_COL, sizes=(20, 400), alpha=0.6)
plt.gca().set_aspect("equal")
${show()}`), note: "Lat/lon on plain axes is a usable rough map." },
    { library: "Plotly", code: script(PX, { LAT_COL: "lat", LON_COL: "lon", VALUE_COL: "value" }, `px.scatter_geo(df, lat=LAT_COL, lon=LON_COL, size=VALUE_COL, projection="natural earth").show()`), note: "Pan and zoom the globe straight in the browser." },
  ],

  flowMap: () => [
    { library: "Matplotlib", code: script(["import pandas as pd", "import geopandas as gpd", "import matplotlib.pyplot as plt"], { SOURCE_COL: "from_name", TARGET_COL: "to_name", VALUE_COL: "value" }, `# expects from_lat / from_lon / to_lat / to_lon columns
world = gpd.read_file(gpd.datasets.get_path("naturalearth_lowres"))

fig, ax = plt.subplots(figsize=(11, 6))
world.plot(ax=ax, color="#f4f4f5", edgecolor="white")
for _, r in df.iterrows():
    ax.plot([r["from_lon"], r["to_lon"]], [r["from_lat"], r["to_lat"]],
            color="#4f46e5", alpha=0.5, linewidth=r[VALUE_COL] / df[VALUE_COL].max() * 4)
ax.set_axis_off()
plt.show()`), note: "Line width carries the volume of each flow." },
    { library: "Seaborn", code: script(SNS, { SOURCE_COL: "from_name", TARGET_COL: "to_name", VALUE_COL: "value" }, `pivot = df.pivot_table(index=SOURCE_COL, columns=TARGET_COL, values=VALUE_COL, aggfunc="sum").fillna(0)
sns.heatmap(pivot, cmap="rocket_r", annot=True, fmt=".0f")
${show()}`), note: "An origin–destination matrix, no geography required." },
    { library: "Plotly", code: script(["import pandas as pd", "import plotly.graph_objects as go"], { VALUE_COL: "value" }, `fig = go.Figure()
for _, r in df.iterrows():
    fig.add_trace(go.Scattergeo(
        lat=[r["from_lat"], r["to_lat"]], lon=[r["from_lon"], r["to_lon"]],
        mode="lines", line=dict(width=max(1, r[VALUE_COL] / df[VALUE_COL].max() * 6), color="#4f46e5"),
        opacity=0.6, showlegend=False))
fig.update_geos(projection_type="natural earth")
fig.show()`), note: "One `Scattergeo` line trace per flow." },
  ],

  network: () => [
    { library: "Matplotlib", code: script(["import pandas as pd", "import networkx as nx", "import matplotlib.pyplot as plt"], { SOURCE_COL: "source", TARGET_COL: "target", VALUE_COL: "weight" }, `G = nx.from_pandas_edgelist(df, SOURCE_COL, TARGET_COL, edge_attr=VALUE_COL)
pos = nx.spring_layout(G, seed=42)

plt.figure(figsize=(9, 7))
nx.draw_networkx(G, pos, node_color="#c7d2fe", edge_color="#d4d4d8", node_size=700, font_size=8)
plt.axis("off"); plt.show()`), note: "`spring_layout` with a fixed seed keeps the layout stable." },
    { library: "Seaborn", code: script(SNS, { SOURCE_COL: "source", TARGET_COL: "target", VALUE_COL: "weight" }, `pivot = df.pivot_table(index=SOURCE_COL, columns=TARGET_COL, values=VALUE_COL, aggfunc="sum").fillna(0)
sns.heatmap(pivot, cmap="mako", square=True)
${show()}`), note: "An adjacency matrix scales far past a hairball graph." },
    { library: "Plotly", code: script(["import pandas as pd", "import networkx as nx", "import plotly.graph_objects as go"], { SOURCE_COL: "source", TARGET_COL: "target" }, `G = nx.from_pandas_edgelist(df, SOURCE_COL, TARGET_COL)
pos = nx.spring_layout(G, seed=42)
ex, ey = [], []
for a, b in G.edges():
    ex += [pos[a][0], pos[b][0], None]; ey += [pos[a][1], pos[b][1], None]

fig = go.Figure([
    go.Scatter(x=ex, y=ey, mode="lines", line=dict(color="#d4d4d8"), hoverinfo="none"),
    go.Scatter(x=[p[0] for p in pos.values()], y=[p[1] for p in pos.values()],
               mode="markers+text", text=list(pos), marker=dict(size=14, color="#4f46e5")),
])
fig.update_layout(showlegend=False, template="plotly_white")
fig.show()`), note: "`None` breaks the line between separate edges." },
  ],

  roc: () => [
    { library: "Matplotlib", code: script(["import pandas as pd", "import matplotlib.pyplot as plt", "from sklearn.metrics import roc_curve, auc"], {}, `y_true = df["label"]      # 0/1 ground truth
y_score = df["score"]     # predicted probability

fpr, tpr, _ = roc_curve(y_true, y_score)

fig, ax = plt.subplots(figsize=(6, 6))
ax.plot(fpr, tpr, linewidth=2, label=f"AUC = {auc(fpr, tpr):.3f}")
ax.plot([0, 1], [0, 1], "--", color="#a1a1aa")
ax.set_xlabel("False positive rate"); ax.set_ylabel("True positive rate")
ax.legend()
${show()}`), note: "Always plot the diagonal — it is the random baseline." },
    { library: "Seaborn", code: script(["import pandas as pd", "import seaborn as sns", "import matplotlib.pyplot as plt", "from sklearn.metrics import roc_curve, auc"], {}, `fpr, tpr, _ = roc_curve(df["label"], df["score"])
sns.lineplot(x=fpr, y=tpr, linewidth=2)
plt.plot([0, 1], [0, 1], "--", color="#a1a1aa")
plt.title(f"ROC — AUC {auc(fpr, tpr):.3f}")
${show()}`), note: "Same curve, Seaborn's theme." },
    { library: "Plotly", code: script(["import pandas as pd", "import plotly.express as px", "from sklearn.metrics import roc_curve, auc"], {}, `fpr, tpr, _ = roc_curve(df["label"], df["score"])
fig = px.area(x=fpr, y=tpr, title=f"ROC — AUC {auc(fpr, tpr):.3f}",
              labels=dict(x="FPR", y="TPR"), template="plotly_white")
fig.add_shape(type="line", x0=0, y0=0, x1=1, y1=1, line=dict(dash="dash"))
fig.show()`), note: "Filling under the curve makes AUC visible." },
  ],

  confusion: () => [
    { library: "Matplotlib", code: script(["import pandas as pd", "import matplotlib.pyplot as plt", "from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay"], {}, `cm = confusion_matrix(df["y_true"], df["y_pred"])
ConfusionMatrixDisplay(cm).plot(cmap="Blues", values_format="d")
plt.show()`), note: "scikit-learn ships the display helper — use it." },
    { library: "Seaborn", code: script(["import pandas as pd", "import seaborn as sns", "import matplotlib.pyplot as plt", "from sklearn.metrics import confusion_matrix"], {}, `cm = confusion_matrix(df["y_true"], df["y_pred"], normalize="true")
sns.heatmap(cm, annot=True, fmt=".2f", cmap="Blues", square=True,
            xticklabels=sorted(df["y_true"].unique()), yticklabels=sorted(df["y_true"].unique()))
plt.xlabel("Predicted"); plt.ylabel("Actual")
${show()}`), note: "`normalize='true'` shows per-class recall, not raw counts." },
    { library: "Plotly", code: script(["import pandas as pd", "import plotly.express as px", "from sklearn.metrics import confusion_matrix"], {}, `cm = confusion_matrix(df["y_true"], df["y_pred"])
px.imshow(cm, text_auto=True, color_continuous_scale="Blues",
          labels=dict(x="Predicted", y="Actual")).show()`), note: "`text_auto` writes the count into every cell." },
  ],

  featureImp: () => [
    { library: "Matplotlib", code: script(MPL, { LABEL_COL: "feature", VALUE_COL: "importance" }, `imp = df.sort_values(VALUE_COL).tail(15)

fig, ax = plt.subplots(figsize=(8, 6))
ax.barh(imp[LABEL_COL], imp[VALUE_COL], color="#4f46e5")
ax.set_xlabel(VALUE_COL)
${show()}`), note: "Show the top 15 — nobody reads a bar chart of 200 features." },
    { library: "Seaborn", code: script(SNS, { LABEL_COL: "feature", VALUE_COL: "importance" }, `imp = df.sort_values(VALUE_COL, ascending=False).head(15)
sns.barplot(data=imp, y=LABEL_COL, x=VALUE_COL, palette="crest")
${show()}`), note: "Sort descending and take the head." },
    { library: "Plotly", code: script(PX, { LABEL_COL: "feature", VALUE_COL: "importance" }, `imp = df.sort_values(VALUE_COL).tail(15)
px.bar(imp, x=VALUE_COL, y=LABEL_COL, orientation="h", template="plotly_white").show()`), note: "Hover reveals the exact importance score." },
  ],

  learning: () => [
    { library: "Matplotlib", code: script(MPL, {}, `# expects columns: train_size, train_score, val_score
fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(df["train_size"], df["train_score"], marker="o", label="Train")
ax.plot(df["train_size"], df["val_score"], marker="o", label="Validation")
ax.set_xlabel("Training examples"); ax.set_ylabel("Score")
ax.legend()
${show()}`), note: "A wide, persistent gap means overfitting." },
    { library: "Seaborn", code: script(SNS, {}, `long = df.melt("train_size", ["train_score", "val_score"], var_name="split", value_name="score")
sns.lineplot(data=long, x="train_size", y="score", hue="split", marker="o")
${show()}`), note: "Melt to long format so `hue` can split the curves." },
    { library: "Plotly", code: script(PX, {}, `long = df.melt("train_size", ["train_score", "val_score"], var_name="split", value_name="score")
px.line(long, x="train_size", y="score", color="split", markers=True, template="plotly_white").show()`), note: "Toggle a curve by clicking its legend entry." },
  ],

  pca: () => [
    { library: "Matplotlib", code: script(["import pandas as pd", "import matplotlib.pyplot as plt", "from sklearn.decomposition import PCA", "from sklearn.preprocessing import StandardScaler"], { GROUP_COL: "label" }, `X = StandardScaler().fit_transform(df.select_dtypes("number"))
pcs = PCA(n_components=2).fit_transform(X)

fig, ax = plt.subplots(figsize=(7, 6))
for g in df[GROUP_COL].unique():
    m = (df[GROUP_COL] == g).values
    ax.scatter(pcs[m, 0], pcs[m, 1], label=str(g), alpha=0.75)
ax.set_xlabel("PC1"); ax.set_ylabel("PC2"); ax.legend()
${show()}`), note: "Standardise before PCA or the largest-scale column wins." },
    { library: "Seaborn", code: script(["import pandas as pd", "import seaborn as sns", "import matplotlib.pyplot as plt", "from sklearn.decomposition import PCA", "from sklearn.preprocessing import StandardScaler"], { GROUP_COL: "label" }, `X = StandardScaler().fit_transform(df.select_dtypes("number"))
pcs = PCA(2).fit_transform(X)
sns.scatterplot(x=pcs[:, 0], y=pcs[:, 1], hue=df[GROUP_COL], alpha=0.8)
plt.xlabel("PC1"); plt.ylabel("PC2")
${show()}`), note: "Two components, coloured by whatever label you have." },
    { library: "Plotly", code: script(["import pandas as pd", "import plotly.express as px", "from sklearn.decomposition import PCA", "from sklearn.preprocessing import StandardScaler"], { GROUP_COL: "label" }, `X = StandardScaler().fit_transform(df.select_dtypes("number"))
pcs = PCA(2).fit_transform(X)
px.scatter(x=pcs[:, 0], y=pcs[:, 1], color=df[GROUP_COL].astype(str),
           labels=dict(x="PC1", y="PC2"), template="plotly_white").show()`), note: "Hover to identify individual points." },
  ],

  cluster: () => [
    { library: "Matplotlib", code: script(["import pandas as pd", "import matplotlib.pyplot as plt", "from sklearn.cluster import KMeans", "from sklearn.preprocessing import StandardScaler"], NUM2, `X = StandardScaler().fit_transform(df[[X_COL, Y_COL]])
labels = KMeans(n_clusters=4, n_init=10, random_state=42).fit_predict(X)

fig, ax = plt.subplots(figsize=(7, 6))
sc = ax.scatter(df[X_COL], df[Y_COL], c=labels, cmap="viridis", alpha=0.8)
ax.set_xlabel(X_COL); ax.set_ylabel(Y_COL)
fig.colorbar(sc, ax=ax, label="cluster")
${show()}`), note: "Change `n_clusters` and re-run to test stability." },
    { library: "Seaborn", code: script(["import pandas as pd", "import seaborn as sns", "import matplotlib.pyplot as plt", "from sklearn.cluster import KMeans", "from sklearn.preprocessing import StandardScaler"], NUM2, `X = StandardScaler().fit_transform(df[[X_COL, Y_COL]])
df["cluster"] = KMeans(4, n_init=10, random_state=42).fit_predict(X).astype(str)
sns.scatterplot(data=df, x=X_COL, y=Y_COL, hue="cluster", palette="deep", alpha=0.8)
${show()}`), note: "Cast the labels to string so colours stay categorical." },
    { library: "Plotly", code: script(["import pandas as pd", "import plotly.express as px", "from sklearn.cluster import KMeans", "from sklearn.preprocessing import StandardScaler"], NUM2, `X = StandardScaler().fit_transform(df[[X_COL, Y_COL]])
df["cluster"] = KMeans(4, n_init=10, random_state=42).fit_predict(X).astype(str)
px.scatter(df, x=X_COL, y=Y_COL, color="cluster", template="plotly_white").show()`), note: "Legend clicks isolate a single cluster." },
  ],
};

/** Charts whose bespoke template is the generic categorical one. */
export function readySnippets(previewKind: string, chartName: string): ReadySnippet[] {
  const builder = BUILDERS[previewKind];
  return builder ? builder() : genericCategorical(chartName.toLowerCase());
}
