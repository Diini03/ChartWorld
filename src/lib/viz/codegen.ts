import { PALETTE_HEX } from "./palettes";
import type { Dataset, VizConfig, VizStyle } from "./types";

export type Library = "Matplotlib" | "Seaborn" | "Plotly";

const q = (s?: string) => JSON.stringify(s ?? "");

function loader(ds: Dataset) {
  return ds.source === "upload"
    ? `df = pd.read_csv("${ds.name.replace(/"/g, "")}")`
    : `# Sample dataset: ${ds.name} — ${ds.description}\ndf = pd.read_csv("${ds.id}.csv")`;
}

const AGG_PY: Record<VizConfig["agg"], string> = {
  sum: "sum", mean: "mean", median: "median", count: "count", min: "min", max: "max",
};

function prep(cfg: VizConfig) {
  if (!cfg.x || !cfg.y) return "";
  const by = cfg.series ? `[${q(cfg.x)}, ${q(cfg.series)}]` : q(cfg.x);
  const sort = cfg.sort === "none" ? "" : `\nagg = agg.sort_values(${q(cfg.y)}, ascending=${cfg.sort === "asc" ? "True" : "False"})`;
  return `agg = df.groupby(${by}, as_index=False)[${q(cfg.y)}].${AGG_PY[cfg.agg]}()${sort}\nagg = agg.head(${cfg.limit})\n`;
}

export function generateCode(lib: Library, ds: Dataset, cfg: VizConfig, style: VizStyle): string {
  const colors = PALETTE_HEX[style.palette];
  const c0 = colors[0];
  const title = style.title || `${cfg.y ?? "Value"} by ${cfg.x ?? "category"}`;
  const xLab = style.xLabel || cfg.x || "x";
  const yLab = style.yLabel || cfg.y || "value";
  const t = cfg.type;

  if (lib === "Matplotlib") {
    const head = `import pandas as pd\nimport matplotlib.pyplot as plt\n\n${loader(ds)}\n`;
    const tail = `ax.set_title(${q(title)}, fontsize=${style.fontSize + 4})
ax.set_xlabel(${q(xLab)}, fontsize=${style.fontSize})
ax.set_ylabel(${q(yLab)}, fontsize=${style.fontSize})
ax.grid(${style.grid ? "True" : "False"}, axis="y", alpha=0.25)
${style.legend && cfg.series ? "ax.legend(frameon=False)\n" : ""}fig.tight_layout()
plt.show()`;
    const fig = `fig, ax = plt.subplots(figsize=(9, ${(style.height / 90).toFixed(1)}))\n`;
    switch (t) {
      case "histogram":
      case "density":
        return `${head}\n${fig}ax.hist(df[${q(cfg.x)}].dropna(), bins=${cfg.bins}, color=${q(c0)}, alpha=${style.opacity}, density=${t === "density" ? "True" : "False"}, edgecolor="white")\n${tail}`;
      case "box":
        return `${head}\ngroups = [g[${q(cfg.y)}].dropna().values for _, g in df.groupby(${q(cfg.x)})]\nlabels = [k for k, _ in df.groupby(${q(cfg.x)})]\n\n${fig}ax.boxplot(groups, labels=labels, patch_artist=True,\n           boxprops=dict(facecolor=${q(c0)}, alpha=${style.opacity}))\nplt.xticks(rotation=45, ha="right")\n${tail}`;
      case "scatter":
      case "bubble":
        return `${head}\n${fig}ax.scatter(df[${q(cfg.x)}], df[${q(cfg.y)}]${cfg.size ? `, s=df[${q(cfg.size)}] / df[${q(cfg.size)}].max() * 300` : ", s=32"}, color=${q(c0)}, alpha=${style.opacity}, edgecolors="white", linewidths=0.5)\n${tail}`;
      case "pie":
      case "donut":
        return `${head}\n${prep(cfg)}\n${fig}ax.pie(agg[${q(cfg.y)}], labels=agg[${q(cfg.x)}], colors=${JSON.stringify(colors)},
       autopct="%1.1f%%"${t === "donut" ? ', wedgeprops=dict(width=0.45)' : ""})
ax.set_title(${q(title)}, fontsize=${style.fontSize + 4})
plt.show()`;
      case "hbar":
      case "lollipop":
        return `${head}\n${prep(cfg)}\n${fig}${t === "lollipop"
          ? `ax.hlines(agg[${q(cfg.x)}], 0, agg[${q(cfg.y)}], color=${q(c0)}, linewidth=${style.lineWidth})\nax.plot(agg[${q(cfg.y)}], agg[${q(cfg.x)}], "o", color=${q(c0)})`
          : `ax.barh(agg[${q(cfg.x)}], agg[${q(cfg.y)}], color=${q(c0)}, alpha=${style.opacity})`}\n${tail}`;
      case "line":
      case "step":
      case "area":
      case "stackedArea":
        return `${head}\n${prep(cfg)}\n${fig}${t === "step"
          ? `ax.step(agg[${q(cfg.x)}], agg[${q(cfg.y)}], where="post", color=${q(c0)}, linewidth=${style.lineWidth})`
          : t === "line"
            ? `ax.plot(agg[${q(cfg.x)}], agg[${q(cfg.y)}], color=${q(c0)}, linewidth=${style.lineWidth}${style.markers ? ', marker="o"' : ""})`
            : `ax.fill_between(agg[${q(cfg.x)}], agg[${q(cfg.y)}], color=${q(c0)}, alpha=${style.opacity})\nax.plot(agg[${q(cfg.x)}], agg[${q(cfg.y)}], color=${q(c0)}, linewidth=${style.lineWidth})`}\nplt.xticks(rotation=45, ha="right")\n${tail}`;
      default:
        return `${head}\n${prep(cfg)}\n${fig}ax.bar(agg[${q(cfg.x)}], agg[${q(cfg.y)}], color=${q(c0)}, alpha=${style.opacity})\nplt.xticks(rotation=45, ha="right")\n${tail}`;
    }
  }

  if (lib === "Seaborn") {
    const head = `import pandas as pd\nimport seaborn as sns\nimport matplotlib.pyplot as plt\n\nsns.set_theme(style="whitegrid", font_scale=${(style.fontSize / 12).toFixed(2)})\nsns.set_palette(${JSON.stringify(colors)})\n\n${loader(ds)}\n`;
    const tail = `plt.title(${q(title)})\nplt.xlabel(${q(xLab)})\nplt.ylabel(${q(yLab)})\nplt.tight_layout()\nplt.show()`;
    const hue = cfg.series ? `, hue=${q(cfg.series)}` : "";
    switch (t) {
      case "histogram":
      case "density":
        return `${head}\nsns.${t === "density" ? "kdeplot" : "histplot"}(data=df, x=${q(cfg.x)}${t === "histogram" ? `, bins=${cfg.bins}` : ", fill=True"}${hue})\n${tail}`;
      case "box":
        return `${head}\nsns.boxplot(data=df, x=${q(cfg.x)}, y=${q(cfg.y)}${hue})\nplt.xticks(rotation=45, ha="right")\n${tail}`;
      case "scatter":
      case "bubble":
        return `${head}\nsns.scatterplot(data=df, x=${q(cfg.x)}, y=${q(cfg.y)}${hue}${cfg.size ? `, size=${q(cfg.size)}, sizes=(20, 320)` : ""}, alpha=${style.opacity})\n${tail}`;
      case "heatmap":
        return `${head}\npivot = df.pivot_table(index=${q(cfg.series)}, columns=${q(cfg.x)}, values=${q(cfg.y)}, aggfunc="${AGG_PY[cfg.agg]}")\nsns.heatmap(pivot, annot=${style.dataLabels ? "True" : "False"}, fmt=".0f", cmap="mako")\n${tail}`;
      case "line":
      case "area":
      case "step":
      case "stackedArea":
        return `${head}\nsns.lineplot(data=df, x=${q(cfg.x)}, y=${q(cfg.y)}${hue}, estimator="${AGG_PY[cfg.agg]}", linewidth=${style.lineWidth}${style.markers ? ", marker='o'" : ""})\nplt.xticks(rotation=45, ha="right")\n${tail}`;
      default:
        return `${head}\nsns.barplot(data=df, x=${q(cfg.x)}, y=${q(cfg.y)}${hue}, estimator="${AGG_PY[cfg.agg]}", errorbar=None${t === "hbar" ? ", orient='h'" : ""})\nplt.xticks(rotation=45, ha="right")\n${tail}`;
    }
  }

  /* Plotly */
  const head = `import pandas as pd\nimport plotly.express as px\n\n${loader(ds)}\n`;
  const common = `, title=${q(title)}, color_discrete_sequence=${JSON.stringify(colors)}`;
  const layout = `fig.update_layout(template="plotly_white", font=dict(size=${style.fontSize}),\n                  xaxis_title=${q(xLab)}, yaxis_title=${q(yLab)}, showlegend=${style.legend ? "True" : "False"})\nfig.show()`;
  const color = cfg.series ? `, color=${q(cfg.series)}` : "";
  switch (t) {
    case "histogram":
    case "density":
      return `${head}\nfig = px.histogram(df, x=${q(cfg.x)}, nbins=${cfg.bins}${color}${common}${t === "density" ? ', histnorm="probability density"' : ""})\n${layout}`;
    case "box":
      return `${head}\nfig = px.box(df, x=${q(cfg.x)}, y=${q(cfg.y)}${color}${common})\n${layout}`;
    case "scatter":
    case "bubble":
      return `${head}\nfig = px.scatter(df, x=${q(cfg.x)}, y=${q(cfg.y)}${color}${cfg.size ? `, size=${q(cfg.size)}` : ""}, opacity=${style.opacity}${common})\n${layout}`;
    case "pie":
    case "donut":
      return `${head}\n${prep(cfg)}\nfig = px.pie(agg, names=${q(cfg.x)}, values=${q(cfg.y)}${t === "donut" ? ", hole=0.55" : ""}${common})\n${layout}`;
    case "treemap":
      return `${head}\n${prep(cfg)}\nfig = px.treemap(agg, path=[${q(cfg.x)}], values=${q(cfg.y)}${common})\n${layout}`;
    case "funnel":
      return `${head}\n${prep(cfg)}\nfig = px.funnel(agg, x=${q(cfg.y)}, y=${q(cfg.x)}${common})\n${layout}`;
    case "heatmap":
      return `${head}\npivot = df.pivot_table(index=${q(cfg.series)}, columns=${q(cfg.x)}, values=${q(cfg.y)}, aggfunc="${AGG_PY[cfg.agg]}")\nfig = px.imshow(pivot, text_auto=${style.dataLabels ? "True" : "False"}, color_continuous_scale="Teal"${common.replace(", color_discrete_sequence=" + JSON.stringify(colors), "")})\n${layout}`;
    case "line":
    case "step":
      return `${head}\n${prep(cfg)}\nfig = px.line(agg, x=${q(cfg.x)}, y=${q(cfg.y)}${color}${style.markers ? ", markers=True" : ""}${t === "step" ? ', line_shape="hv"' : ""}${common})\n${layout}`;
    case "area":
    case "stackedArea":
      return `${head}\n${prep(cfg)}\nfig = px.area(agg, x=${q(cfg.x)}, y=${q(cfg.y)}${color}${common})\n${layout}`;
    default:
      return `${head}\n${prep(cfg)}\nfig = px.bar(agg, x=${q(t === "hbar" ? cfg.y : cfg.x)}, y=${q(t === "hbar" ? cfg.x : cfg.y)}${color}${t === "stackedBar" ? ', barmode="stack"' : t === "groupedBar" ? ', barmode="group"' : ""}${common})\n${layout}`;
  }
}
