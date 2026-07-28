import { Link } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { CHARTS } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import { ArrowRight, Sparkles, Search, GitCompareArrows, Code2 } from "lucide-react";
import { useUI } from "@/lib/store";

interface Floater { slug: string; kind: any; name: string; x: number; y: number; scale: number; delay: number; duration: number; }

function useFloaters(n = 4): Floater[] {
  return useMemo(() => {
    let s = 42;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const picks = [...CHARTS].sort(() => rand() - 0.5).slice(0, n);
    return picks.map((c, i) => {
      const isLeft = i % 2 === 0;
      // Place 2 soft floaters on each side, well clear of centered text
      const xBase = isLeft ? 6 + (i / 2) * 5 : 78 + ((i - 1) / 2) * 5;
      const y = 18 + (i % 2) * 44 + (rand() - 0.5) * 6;
      return {
        slug: c.slug, kind: c.preview, name: c.name,
        x: xBase + (rand() - 0.5) * 2,
        y,
        scale: 0.55 + rand() * 0.15,
        delay: rand() * 4,
        duration: 10 + rand() * 8,
      };
    });
  }, [n]);
}

export default function Home() {
  const floaters = useFloaters(4);
  const { setSearchOpen } = useUI();
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative -mt-24">
      {/* Chart Universe */}
      <section className="relative min-h-[100dvh] overflow-hidden pt-24">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="pointer-events-none absolute inset-0" ref={ref}>
          {floaters.map((f) => (
            <Link
              key={f.slug}
              to={`/chart/${f.slug}`}
              onMouseEnter={() => setHovered(f.slug)}
              onMouseLeave={() => setHovered(null)}
              className="pointer-events-auto absolute block rounded-2xl border border-border/40 bg-card/40 p-3 shadow-sm backdrop-blur-sm transition-all duration-500 hover:z-20 hover:scale-[1.15] hover:border-border/60 hover:bg-card/60 hover:shadow-md"
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                width: 140,
                transform: `scale(${f.scale})`,
                animation: `drift ${f.duration}s ease-in-out ${f.delay}s infinite`,
                opacity: hovered ? (hovered === f.slug ? 0.7 : 0.15) : 0.22,
              }}
            >
              <div className="pointer-events-none h-16 w-full overflow-hidden opacity-60">
                <ChartPreview kind={f.kind} height={64} seed={f.slug.length * 3} />
              </div>
              <div className="mt-1 truncate text-center text-[10px] font-medium text-muted-foreground/60">{f.name}</div>
            </Link>
          ))}
        </div>

        <div className="pointer-events-none relative z-10 mx-auto flex min-h-[80dvh] max-w-3xl flex-col items-center justify-center px-4 text-center">
          <div className="pointer-events-auto glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Sparkles size={12} className="text-primary" />
            Explore every chart. Learn when to use it.
          </div>
          <h1 className="pointer-events-auto font-display text-6xl leading-[1.02] md:text-8xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="text-gradient">Chart</span>World
          </h1>
          <p className="pointer-events-auto mx-auto mt-6 max-w-xl text-lg text-muted-foreground animate-in fade-in duration-1000 delay-200 fill-mode-backwards">
            An interactive world for discovering data visualisations — hover a chart, click to enter its story.
          </p>
          <div className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3 animate-in fade-in duration-1000 delay-300 fill-mode-backwards">
            <Link
              to="/explore"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
            >
              Enter ChartWorld <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              onClick={() => setSearchOpen(true)}
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <Search size={14} /> Search any chart
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Trio */}
      <section className="container py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">A world, not a website</p>
          <h2 className="font-display text-5xl">Three ways to explore.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Sparkles size={20} />}
            title="Discover"
            desc="Wander through dozens of chart pages. Each has its own story, code, and cautions."
            to="/explore"
            preview={<ChartPreview kind="bubble" height={140} seed={11} />}
          />
          <FeatureCard
            icon={<GitCompareArrows size={20} />}
            title="Compare"
            desc="Put two charts side by side. See where each shines and where each fails."
            to="/compare"
            preview={
              <div className="grid grid-cols-2 gap-2">
                <ChartPreview kind="bar" height={140} seed={5} />
                <ChartPreview kind="line" height={140} seed={7} />
              </div>
            }
          />
          <FeatureCard
            icon={<Code2 size={20} />}
            title="Build"
            desc="Copy Python code — Matplotlib, Seaborn, Plotly — that runs the moment you paste it."
            to="/python"
            preview={<ChartPreview kind="radar" height={140} seed={9} />}
          />
        </div>
      </section>

      {/* Category strip */}
      <section className="container pb-24">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Twelve categories</p>
          <h2 className="font-display text-4xl">Every kind of question deserves the right chart.</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {["Comparison", "Ranking", "Time Series", "Distribution", "Relationship", "Composition", "Flow", "Hierarchy", "Maps", "Machine Learning", "Business", "Statistical"].map((c, i) => (
            <Link
              key={c}
              to={`/categories#${c.toLowerCase().replace(/\s+/g, "-")}`}
              className="glass rounded-full px-4 py-2 text-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Chooser CTA */}
      <section className="container pb-24">
        <div className="glass relative overflow-hidden rounded-3xl p-10 text-center shadow-lg md:p-16">
          <div className="absolute inset-0 mesh-bg opacity-70" />
          <div className="relative">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Not sure which chart to pick?</p>
            <h2 className="mx-auto max-w-2xl font-display text-4xl md:text-5xl">Answer three questions. Get the perfect chart.</h2>
            <Link
              to="/chooser"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
            >
              Try the chart chooser <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, to, preview }: any) {
  return (
    <Link to={to} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <h3 className="font-display text-2xl">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface-2 p-2">{preview}</div>
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
        Open <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
