import { useState } from "react";
import { CHARTS } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import { ArrowLeftRight, Check, X } from "lucide-react";

export default function Compare() {
  const [a, setA] = useState("bar-chart");
  const [b, setB] = useState("line-chart");
  const A = CHARTS.find((c) => c.slug === a)!;
  const B = CHARTS.find((c) => c.slug === b)!;

  return (
    <div className="container py-10">
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Compare</p>
        <h1 className="font-display text-5xl md:text-6xl">Two charts, side by side.</h1>
        <p className="mt-4 text-muted-foreground">See where each one shines — and where it doesn't.</p>
      </header>

      <div className="mx-auto mt-10 flex max-w-2xl flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <ChartSelect value={a} onChange={setA} />
        <ArrowLeftRight size={18} className="mx-auto shrink-0 text-muted-foreground" />
        <ChartSelect value={b} onChange={setB} />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {[A, B].map((c, i) => (
          <div key={i} className="glass overflow-hidden rounded-3xl p-6">
            <div className="mb-4">
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{c.category}</div>
              <h2 className="font-display text-3xl">{c.name}</h2>
              <p className="text-muted-foreground">{c.tagline}</p>
            </div>
            <div className="overflow-hidden rounded-xl bg-surface-2/50 p-2">
              <ChartPreview kind={c.preview} height={220} seed={c.slug.length + i} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
        <ComparisonRow label="Purpose" a={A.summary} b={B.summary} />
        <ComparisonRow label="Best when" a={A.whenToUse.join(" · ")} b={B.whenToUse.join(" · ")} />
        <ComparisonRow label="Avoid when" a={A.whenNotToUse.join(" · ")} b={B.whenNotToUse.join(" · ")} />
        <ComparisonRow label="Advantages" a={A.advantages.join(" · ")} b={B.advantages.join(" · ")} pos />
        <ComparisonRow label="Limitations" a={A.limitations.join(" · ")} b={B.limitations.join(" · ")} neg />
        <ComparisonRow label="Business example" a={A.businessExample} b={B.businessExample} />
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Decision guide</p>
        <p className="text-lg leading-relaxed">
          If your data is <strong>{A.category === B.category ? "similar in kind" : `${A.category.toLowerCase()} vs ${B.category.toLowerCase()}`}</strong>,
          reach for <strong>{A.name}</strong> when you need <em>{A.whenToUse[0].toLowerCase()}</em>,
          and <strong>{B.name}</strong> when you need <em>{B.whenToUse[0].toLowerCase()}</em>.
        </p>
      </div>
    </div>
  );
}

function ChartSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 py-3 font-display text-base focus-ring sm:text-lg"
    >
      {CHARTS.map((c) => (
        <option key={c.slug} value={c.slug}>{c.name}</option>
      ))}
    </select>
  );
}

function ComparisonRow({ label, a, b, pos, neg }: any) {
  return (
    <div className="grid grid-cols-1 gap-2 border-b border-border p-5 last:border-0 sm:grid-cols-[120px_1fr_1fr] sm:gap-4 md:grid-cols-[180px_1fr_1fr]">
      <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`min-w-0 break-words text-sm ${pos ? "text-[hsl(var(--chart-5))]" : neg ? "text-[hsl(var(--chart-3))]" : ""}`}>
        {pos && <Check size={14} className="mr-1.5 inline" />}{neg && <X size={14} className="mr-1.5 inline" />}{a}
      </div>
      <div className={`min-w-0 break-words text-sm ${pos ? "text-[hsl(var(--chart-5))]" : neg ? "text-[hsl(var(--chart-3))]" : ""}`}>
        {pos && <Check size={14} className="mr-1.5 inline" />}{neg && <X size={14} className="mr-1.5 inline" />}{b}
      </div>
    </div>
  );
}
