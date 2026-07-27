import { useMemo, useState } from "react";
import { CHARTS } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import { CodeBlock } from "@/components/chart/CodeBlock";
import { Slider } from "@/components/ui/slider";

const PLAYABLE = CHARTS.filter((c) => ["bar", "line", "area", "scatter", "radar", "stackedBar", "histogram"].includes(c.preview));

export default function Playground() {
  const [slug, setSlug] = useState(PLAYABLE[0].slug);
  const chart = CHARTS.find((c) => c.slug === slug)!;

  const [title, setTitle] = useState("My chart");
  const [color, setColor] = useState("#7c3aed");
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [opacity, setOpacity] = useState([80]);
  const [seed, setSeed] = useState(3);

  const code = useMemo(() => `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 5))
data = [23, 45, 17, 34, 28]
labels = ["A", "B", "C", "D", "E"]

ax.bar(labels, data, color="${color}", alpha=${(opacity[0] / 100).toFixed(2)})
ax.set_title("${title}")
${showGrid ? 'ax.grid(True, alpha=0.3)' : '# grid off'}
${showLegend ? 'ax.legend(["Values"])' : '# legend off'}
plt.tight_layout(); plt.show()`, [title, color, opacity, showGrid, showLegend]);

  return (
    <div className="container py-10">
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Playground</p>
        <h1 className="font-display text-5xl md:text-6xl">Tinker. Watch. Learn.</h1>
        <p className="mt-4 text-muted-foreground">Change a knob — the chart and the Python code update in real time.</p>
      </header>

      <div className="mt-12 grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-6 rounded-3xl border border-border bg-card p-6">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-muted-foreground">Chart</label>
            <select value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              {PLAYABLE.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-muted-foreground">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-muted-foreground">Colour</label>
            <div className="flex items-center gap-2">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-14 rounded-lg border border-border bg-background" />
              <input value={color} onChange={(e) => setColor(e.target.value)} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">Opacity — {opacity[0]}%</label>
            <Slider value={opacity} onValueChange={setOpacity} min={10} max={100} step={5} />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">Randomize data</label>
            <button onClick={() => setSeed((s) => s + 1)} className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm hover:bg-surface-3">
              New sample
            </button>
          </div>
          <div className="space-y-2">
            <ToggleRow label="Grid" value={showGrid} onChange={setShowGrid} />
            <ToggleRow label="Legend" value={showLegend} onChange={setShowLegend} />
          </div>
        </aside>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-md">
            <div className="mb-4 font-display text-2xl">{title}</div>
            <div style={{ filter: `opacity(${opacity[0]}%)` }}>
              <ChartPreview kind={chart.preview} height={340} seed={seed} />
            </div>
          </div>
          <CodeBlock code={code} library="Matplotlib" />
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm">
      {label}
      <button
        onClick={() => onChange(!value)}
        className={`relative h-5 w-9 rounded-full transition-colors ${value ? "bg-primary" : "bg-border-strong"}`}
        aria-pressed={value}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${value ? "left-4" : "left-0.5"}`} />
      </button>
    </label>
  );
}
