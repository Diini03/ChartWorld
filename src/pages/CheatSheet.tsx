import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Printer, Columns2, Square, Minimize2, Maximize2 } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { CATEGORIES, CATEGORY_META, chartsByCategory, CHARTS, type Difficulty } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import { cn } from "@/lib/utils";

const LEVELS: (Difficulty | "All")[] = ["All", "Beginner", "Intermediate", "Advanced"];

export default function CheatSheet() {
  useSeo({
    title: "Chart Cheat Sheet",
    description: "A printable one-page reference of every chart type in ChartWorld — what each chart is for, when to use it, and what to avoid.",
    path: "/cheatsheet",
  });
  const [level, setLevel] = useState<Difficulty | "All">("All");
  const [thumbs, setThumbs] = useState(true);
  const [topics, setTopics] = useState<string[]>(() => [...CATEGORIES]);
  const [columns, setColumns] = useState<1 | 2>(2);
  const [compact, setCompact] = useState(false);

  const toggleTopic = (cat: string) =>
    setTopics((t) => (t.includes(cat) ? t.filter((c) => c !== cat) : [...t, cat]));
  const allTopics = topics.length === CATEGORIES.length;

  const sections = useMemo(
    () =>
      CATEGORIES.filter((cat) => topics.includes(cat))
        .map((cat) => ({
          cat,
          meta: CATEGORY_META[cat],
          items: chartsByCategory(cat).filter((c) => level === "All" || c.difficulty === level),
        }))
        .filter((s) => s.items.length > 0),
    [level, topics],
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

      {/* Print controls */}
      <div className="no-print mx-auto mt-8 max-w-3xl rounded-2xl border border-border bg-card p-4 shadow-sm" data-reveal>
        <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Topics to include</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setTopics(allTopics ? [] : [...CATEGORIES])}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              allTopics ? "border-transparent bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            All topics
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleTopic(cat)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                topics.includes(cat)
                  ? "border-transparent bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Level</span>
            <div className="flex gap-1">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs transition-colors",
                    level === l ? "border-transparent bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Layout</span>
            <div className="flex gap-1">
              <button
                onClick={() => setColumns(1)}
                title="One column"
                className={cn(
                  "rounded-full border p-1.5 transition-colors",
                  columns === 1 ? "border-transparent bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                <Square size={13} />
              </button>
              <button
                onClick={() => setColumns(2)}
                title="Two columns"
                className={cn(
                  "rounded-full border p-1.5 transition-colors",
                  columns === 2 ? "border-transparent bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                <Columns2 size={13} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Density</span>
            <div className="flex gap-1">
              <button
                onClick={() => setCompact(false)}
                title="Full cards"
                className={cn(
                  "rounded-full border p-1.5 transition-colors",
                  !compact ? "border-transparent bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                <Maximize2 size={13} />
              </button>
              <button
                onClick={() => setCompact(true)}
                title="Compact cards"
                className={cn(
                  "rounded-full border p-1.5 transition-colors",
                  compact ? "border-transparent bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                <Minimize2 size={13} />
              </button>
            </div>
          </div>

          <button
            onClick={() => setThumbs((t) => !t)}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            {thumbs ? "Hide thumbnails" : "Show thumbnails"}
          </button>

          <button
            onClick={() => window.print()}
            className="ml-auto flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
          >
            <Printer size={13} /> Print / Save PDF
          </button>
        </div>

        <p className="mt-3 border-t border-border pt-3 text-center font-mono text-[11px] text-muted-foreground">
          {total} of {CHARTS.length} charts will print
        </p>
      </div>

      <div className="mt-12 space-y-12">
        {sections.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            Nothing selected — pick at least one topic above.
          </p>
        )}
        {sections.map(({ cat, meta, items }) => (
          <section key={cat} className="break-inside-avoid" data-reveal>
            <div className="mb-4 flex items-end gap-3 border-b border-border pb-2">
              <span className="h-3 w-3 rounded-sm" style={{ background: `hsl(${meta.hue} 80% 60%)` }} />
              <h2 className="font-display text-2xl">{cat}</h2>
              <p className="hidden flex-1 truncate text-xs text-muted-foreground sm:block">{meta.blurb}</p>
              <span className="font-mono text-[11px] text-muted-foreground">{items.length}</span>
            </div>
            <div className={cn("grid gap-3", columns === 2 && "sm:grid-cols-2")}>
              {items.map((c) => (
                <Link
                  key={c.slug}
                  to={`/chart/${c.slug}`}
                  className="break-inside-avoid rounded-xl border border-border bg-card p-3 transition-colors hover:border-border-strong"
                >
                  <div className="flex items-start gap-3">
                    {thumbs && !compact && (
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
                      {!compact && <p className="mt-0.5 text-xs text-muted-foreground">{c.tagline}</p>}
                      <p className="mt-1.5 text-xs">
                        <span className="font-medium text-primary">Use when </span>
                        <span className="text-muted-foreground">{c.whenToUse[0]?.toLowerCase()}</span>
                      </p>
                      {!compact && c.whenNotToUse[0] && (
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
