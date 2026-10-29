import { useSeo } from "@/hooks/use-seo";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CHARTS, chartBySlug } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import { ArrowLeftRight, Check, X, Link2, Printer } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_A = "bar-chart";
const DEFAULT_B = "line-chart";

function validSlug(v: string | null, fallback: string): string {
  return v && chartBySlug(v) ? v : fallback;
}

export default function Compare() {
  useSeo({ title: "Compare Charts", description: "Put two chart types side by side and see how their strengths, weaknesses and best use cases differ.", path: "/compare" });
  const [searchParams, setSearchParams] = useSearchParams();
  const [a, setA] = useState(() => validSlug(searchParams.get("a"), DEFAULT_A));
  const [b, setB] = useState(() => validSlug(searchParams.get("b"), DEFAULT_B));

  // Keep the URL in sync so any pairing is shareable.
  useEffect(() => {
    const next = new URLSearchParams();
    if (a !== DEFAULT_A) next.set("a", a);
    if (b !== DEFAULT_B) next.set("b", b);
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [a, b, searchParams, setSearchParams]);

  // Never compare a chart with itself — nudge the other side to a different chart.
  const pickA = (slug: string) => {
    setA(slug);
    if (slug === b) setB(CHARTS.find((c) => c.slug !== slug)!.slug);
  };
  const pickB = (slug: string) => {
    setB(slug);
    if (slug === a) setA(CHARTS.find((c) => c.slug !== slug)!.slug);
  };
  const swap = () => {
    setA(b);
    setB(a);
  };
  const shareLink = async () => {
    const url = `${window.location.origin}/compare?a=${a}&b=${b}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied — send it to anyone");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const A = chartBySlug(a)!;
  const B = chartBySlug(b)!;

  return (
    <div className="container py-10 print-compare">
      <div className="print-only mb-4">
        <p className="font-mono text-xs uppercase tracking-widest">ChartWorld · Chart comparison</p>
        <h1 className="font-display text-3xl">{A.name} vs {B.name}</h1>
      </div>
      <header data-reveal className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Compare</p>
        <h1 className="font-display text-5xl md:text-6xl">Two charts, side by side.</h1>
        <p className="mt-4 text-muted-foreground">See where each one shines — and where it doesn't.</p>
      </header>

      <div data-reveal className="no-print mx-auto mt-10 flex max-w-2xl flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <ChartSelect value={a} onChange={pickA} label="First chart" />
        <button
          onClick={swap}
          aria-label="Swap charts"
          title="Swap charts"
          className="focus-ring mx-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <ArrowLeftRight size={16} />
        </button>
        <ChartSelect value={b} onChange={pickB} label="Second chart" />
      </div>

      <div data-reveal className="mt-10 grid gap-6 md:grid-cols-2">
        {[A, B].map((c, i) => (
          <div key={c.slug} className="glass overflow-hidden rounded-3xl p-6">
            <div className="mb-4">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{c.category}</div>
              <h2 className="font-display text-3xl">{c.name}</h2>
              <p className="text-muted-foreground">{c.tagline}</p>
            </div>
            <div className="overflow-hidden rounded-xl bg-surface-2/50 p-2">
              <ChartPreview kind={c.preview} height={220} seed={c.slug.length + i} />
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="rounded-full bg-surface-2 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {c.difficulty}
              </span>
              <Link to={`/chart/${c.slug}`} className="text-xs font-medium text-primary hover:underline">
                Open full guide →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div data-reveal className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
        <ComparisonRow label="Category" a={A.category} b={B.category} />
        <ComparisonRow label="Purpose" a={A.summary} b={B.summary} />
        <ComparisonRow label="Best when" a={A.whenToUse.join(" · ")} b={B.whenToUse.join(" · ")} />
        <ComparisonRow label="Avoid when" a={A.whenNotToUse.join(" · ")} b={B.whenNotToUse.join(" · ")} />
        <ComparisonRow label="Advantages" a={A.advantages.join(" · ")} b={B.advantages.join(" · ")} pos />
        <ComparisonRow label="Limitations" a={A.limitations.join(" · ")} b={B.limitations.join(" · ")} neg />
        <ComparisonRow label="Common mistakes" a={A.mistakes.join(" · ")} b={B.mistakes.join(" · ")} neg />
        <ComparisonRow label="Business example" a={A.businessExample} b={B.businessExample} />
      </div>

      <div data-reveal className="print-avoid-break mt-8 rounded-3xl border border-border bg-card p-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Decision guide</p>
          <div className="no-print flex flex-wrap gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              <Printer size={12} /> Print / Save PDF
            </button>
            <button
              onClick={shareLink}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/15"
            >
              <Link2 size={12} /> Copy link to this comparison
            </button>
          </div>
        </div>
        <p className="text-lg leading-relaxed">
          If your data is <strong>{A.category === B.category ? "similar in kind" : `${A.category.toLowerCase()} vs ${B.category.toLowerCase()}`}</strong>,
          reach for <strong>{A.name}</strong> when you need <em>{A.whenToUse[0].toLowerCase()}</em>,
          and <strong>{B.name}</strong> when you need <em>{B.whenToUse[0].toLowerCase()}</em>.
        </p>
      </div>
    </div>
  );
}

function ChartSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="focus-ring w-full min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 py-3 font-display text-base sm:text-lg"
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
