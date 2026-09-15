import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Printer } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { CATEGORIES, CATEGORY_META, chartsByCategory, CHARTS, type Difficulty } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";

const LEVELS: (Difficulty | "All")[] = ["All", "Beginner", "Intermediate", "Advanced"];

export default function CheatSheet() {
  useSeo({
    title: "Chart Cheat Sheet",
    description: "A printable one-page reference of every chart type in ChartWorld — what each chart is for, when to use it, and what to avoid.",
    path: "/cheatsheet",
  });
  const [level, setLevel] = useState<Difficulty | "All">("All");
  const [thumbs, setThumbs] = useState(true);

  const sections = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        cat,
        meta: CATEGORY_META[cat],
        items: chartsByCategory(cat).filter((c) => level === "All" || c.difficulty === level),
      })).filter((s) => s.items.length > 0),
    [level],
  );

  const total = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="container py-10">
      <header data-reveal className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Cheat sheet</p>
        <h1 className="font-display text-5xl md:text-6xl">Every chart, one page.</h1>
        <p className="mt-4 text-muted-foreground">
          A compact reference you can print or keep open beside your editor — {CHARTS.length} chart types with
          what they're for and what to avoid.
        </p>
      </header>

      <div className="no-print mt-8 flex flex-wrap items-center justify-center gap-2">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              level === l ? "border-transparent bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {l}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-border" />
        <button
          onClick={() => setThumbs((t) => !t)}
          className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          {thumbs ? "Hide thumbnails" : "Show thumbnails"}
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
        >
          <Printer size={13} /> Print / Save PDF
        </button>
        <span className="w-full text-center font-mono text-[11px] text-muted-foreground sm:w-auto">{total} shown</span>
      </div>

      <div className="mt-12 space-y-12">
        {sections.map(({ cat, meta, items }) => (
          <section key={cat} className="break-inside-avoid" data-reveal>
            <div className="mb-4 flex items-end gap-3 border-b border-border pb-2">
              <span className="h-3 w-3 rounded-sm" style={{ background: `hsl(${meta.hue} 80% 60%)` }} />
              <h2 className="font-display text-2xl">{cat}</h2>
              <p className="hidden flex-1 truncate text-xs text-muted-foreground sm:block">{meta.blurb}</p>
              <span className="font-mono text-[11px] text-muted-foreground">{items.length}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((c) => (
                <Link
                  key={c.slug}
                  to={`/chart/${c.slug}`}
                  className="break-inside-avoid rounded-xl border border-border bg-card p-3 transition-colors hover:border-border-strong"
                >
                  <div className="flex items-start gap-3">
                    {thumbs && (
                      <div className="hidden w-24 shrink-0 overflow-hidden rounded-lg bg-surface-2/50 p-1 sm:block">
                        <ChartPreview kind={c.preview} height={56} seed={c.slug.length} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="truncate font-display text-base">{c.name}</h3>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {c.difficulty}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{c.tagline}</p>
                      <p className="mt-1.5 text-xs">
                        <span className="font-medium text-primary">Use when </span>
                        <span className="text-muted-foreground">{c.whenToUse[0]?.toLowerCase()}</span>
                      </p>
                      {c.whenNotToUse[0] && (
                        <p className="mt-0.5 text-xs">
                          <span className="font-medium text-destructive">Avoid </span>
                          <span className="text-muted-foreground">{c.whenNotToUse[0].toLowerCase()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="no-print mt-14 text-center text-xs text-muted-foreground">
        Want the deep version? Open any chart for examples, mistakes and ready-to-run Python.
      </p>
    </div>
  );
}
