import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shuffle, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { CHARTS, type Chart } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import { useSeo } from "@/hooks/use-seo";

function pickRandom(exclude?: string): Chart {
  const pool = exclude ? CHARTS.filter((c) => c.slug !== exclude) : CHARTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

const PALETTE_HINTS = [
  "You never know what you'll get.",
  "A chart you might have never thought to use.",
  "Spin again — there are dozens more.",
  "Every chart tells a different story.",
  "Could this be the chart you needed?",
];

export default function Surprise() {
  useSeo({
    title: "Surprise Me — Random Chart Explorer",
    description: "Spin the wheel and discover a random chart type. Each surprise shows a live preview, when to use it, and a link to learn more.",
    path: "/surprise",
  });

  const [chart, setChart] = useState<Chart>(() => pickRandom());
  const [hint, setHint] = useState(() => PALETTE_HINTS[Math.floor(Math.random() * PALETTE_HINTS.length)]);
  const [spinning, setSpinning] = useState(false);

  const spin = useCallback(() => {
    setSpinning(true);
    // brief delay for a tactile feel
    window.setTimeout(() => {
      setChart((prev) => pickRandom(prev?.slug));
      setHint(PALETTE_HINTS[Math.floor(Math.random() * PALETTE_HINTS.length)]);
      setSpinning(false);
    }, 350);
  }, []);

  // Keyboard: press Space or "R" to spin
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space" || e.key.toLowerCase() === "r") {
        e.preventDefault();
        spin();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [spin]);

  return (
    <div className="container max-w-5xl py-12">
      <header className="mb-8 text-center" data-reveal>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles size={12} className="text-primary" />
          Surprise Me
        </div>
        <h1 className="font-display text-4xl md:text-6xl">
          Roll the dice on a <span className="text-gradient">random chart.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
          {hint} Press the button — or hit <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px]">Space</kbd> — to discover another.
        </p>
      </header>

      {/* The surprise card */}
      <div
        className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition-all duration-300 md:p-10"
        data-reveal
      >
        <div className="absolute inset-0 mesh-bg opacity-20" />
        <div className="relative">
          {/* Preview */}
          <div
            className={`mx-auto mb-6 max-w-xl overflow-hidden rounded-2xl border border-border bg-surface-2 p-3 transition-all duration-300 ${
              spinning ? "scale-95 opacity-40 blur-sm" : "scale-100 opacity-100 blur-0"
            }`}
          >
            <ChartPreview kind={chart.preview} height={280} seed={chart.slug.length * 7} />
          </div>

          {/* Meta */}
          <div className="text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {chart.category}
              </span>
              <span className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {chart.difficulty}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl">{chart.name}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{chart.tagline}</p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={spin}
              disabled={spinning}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              <RefreshCw size={16} className={spinning ? "animate-spin" : "transition-transform group-hover:rotate-180"} />
              {spinning ? "Spinning…" : "Surprise me again"}
            </button>
            <Link
              to={`/chart/${chart.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
            >
              Learn about this chart <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick stats / encouragement */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3" data-reveal>
        <StatCard label="Chart types" value={`${CHARTS.length}`} desc="in the rotation" />
        <StatCard label="Categories" value="12" desc="you might land in" />
        <StatCard label="Your spin" value={chart.category} desc="this round's domain" />
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        Every spin is random. Find something interesting? Click through to read its full story.
      </p>
    </div>
  );
}

function StatCard({ label, value, desc }: { label: string; value: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-5 text-center">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}
