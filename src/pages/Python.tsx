import { CodeBlock } from "@/components/chart/CodeBlock";

export default function Python() {
  return (
    <div className="container py-10">
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Python</p>
        <h1 className="font-display text-5xl md:text-6xl">Three libraries. One goal.</h1>
        <p className="mt-4 text-muted-foreground">Every chart on ChartWorld comes with Matplotlib, Seaborn, and Plotly code.</p>
      </header>

      <section className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        <LibraryCard name="Matplotlib" tag="The foundation" desc="Verbose, but you control every pixel. Ships with Python's scientific stack." install="pip install matplotlib" />
        <LibraryCard name="Seaborn" tag="Statistical & pretty" desc="Built on matplotlib with beautiful defaults and dataframe-first APIs." install="pip install seaborn" />
        <LibraryCard name="Plotly" tag="Interactive" desc="Interactive by default. Great for dashboards, notebooks and the web." install="pip install plotly" />
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <h2 className="mb-6 font-display text-3xl">The universal setup</h2>
        <CodeBlock library="Matplotlib" code={`import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import pandas as pd
import numpy as np

# One place to change your look
plt.rcParams.update({
    "figure.figsize": (8, 5),
    "figure.dpi": 120,
    "axes.spines.top": False,
    "axes.spines.right": False,
    "font.family": "Inter",
})

sns.set_palette("deep")`} note="Set this once at the top of your notebook and every chart inherits it." />
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <h2 className="mb-6 font-display text-3xl">Colour that actually communicates</h2>
        <p className="mb-4 text-muted-foreground">Prefer perceptually-uniform palettes. Reserve bright colours for what matters.</p>
        <div className="grid gap-4 md:grid-cols-3">
          <PaletteCard title="Sequential" desc="Use for ordered data (heatmaps, choropleths)." colors={["#f7fbff", "#c6dbef", "#6baed6", "#2171b5", "#08306b"]} />
          <PaletteCard title="Diverging" desc="Use when values diverge from a meaningful centre." colors={["#b2182b", "#ef8a62", "#f7f7f7", "#67a9cf", "#2166ac"]} />
          <PaletteCard title="Categorical" desc="Use for unordered categories. Keep it under 8 hues." colors={["#7c3aed", "#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"]} />
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <h2 className="mb-6 font-display text-3xl">Ship-ready patterns</h2>
        <div className="space-y-8">
          <div>
            <h3 className="mb-3 font-display text-xl">Highlight one, mute the rest</h3>
            <CodeBlock library="Matplotlib" code={`colors = ["#e5e7eb"] * len(values)
colors[np.argmax(values)] = "#7c3aed"  # highlight the winner
plt.bar(labels, values, color=colors)`} />
          </div>
          <div>
            <h3 className="mb-3 font-display text-xl">Small multiples</h3>
            <CodeBlock library="Seaborn" code={`g = sns.FacetGrid(df, col="category", col_wrap=3, height=3)
g.map(sns.lineplot, "date", "value")
g.set_titles("{col_name}")`} />
          </div>
          <div>
            <h3 className="mb-3 font-display text-xl">Interactive, in one line</h3>
            <CodeBlock library="Plotly" code={`px.scatter(df, x="ad_spend", y="revenue", color="channel",
           hover_data=["campaign"], trendline="ols")`} />
          </div>
        </div>
      </section>
    </div>
  );
}

function LibraryCard({ name, tag, desc, install }: any) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-primary">{tag}</p>
      <h3 className="font-display text-2xl">{name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4 rounded-lg bg-[hsl(240_15%_9%)] px-3 py-2 font-mono text-xs text-[hsl(40_30%_96%)]">{install}</div>
    </div>
  );
}

function PaletteCard({ title, desc, colors }: { title: string; desc: string; colors: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex overflow-hidden rounded-lg">
        {colors.map((c) => <div key={c} className="h-14 flex-1" style={{ background: c }} />)}
      </div>
      <div className="font-medium">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}
