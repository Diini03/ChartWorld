import { useSeo } from "@/hooks/use-seo";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { CHARTS, CATEGORIES } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import { FavoriteButton } from "@/components/chart/FavoriteButton";
import { Search, LayoutGrid, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"] as const;

export default function Explore() {
  useSeo({ title: "Explore Charts", description: "Browse and search 40+ chart types by category, difficulty and data shape. Find the right visualization for your data in seconds.", path: "/explore" });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [diff, setDiff] = useState<string>("All");

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    CHARTS.forEach((c) => m.set(c.category, (m.get(c.category) ?? 0) + 1));
    return m;
  }, []);

  const filtered = useMemo(() => {
    return CHARTS.filter((c) =>
      (cat === "All" || c.category === cat) &&
      (diff === "All" || c.difficulty === diff) &&
      (q === "" || (c.name + c.tagline + c.category + c.keywords.join(" ")).toLowerCase().includes(q.toLowerCase()))
    );
  }, [q, cat, diff]);

  const hasFilters = q !== "" || cat !== "All" || diff !== "All";
  const reset = () => { setQ(""); setCat("All"); setDiff("All"); };

  return (
    <div className="container py-10">
      <header data-reveal className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Explore</p>
        <h1 className="font-display text-5xl md:text-6xl">Every chart, in one place.</h1>
        <p className="mt-4 text-muted-foreground">Browse the whole gallery — click any to open its story.</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[230px_1fr]">
        {/* Sidebar filters */}
        <aside data-reveal className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 rounded-xl bg-surface-2 px-3">
              <Search size={15} className="shrink-0 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search charts…"
                className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              {q && (
                <button onClick={() => setQ("")} aria-label="Clear search" className="text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              )}
            </div>

            <p className="mb-2 mt-5 px-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Category</p>
            <ul className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {["All", ...CATEGORIES].map((c) => (
                <li key={c} className="shrink-0">
                  <button
                    onClick={() => setCat(c)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      cat === c ? "bg-foreground text-background" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                    )}
                  >
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      {c === "All" && <LayoutGrid size={13} />}
                      {c}
                    </span>
                    <span className={cn("font-mono text-[10px]", cat === c ? "text-background/70" : "text-muted-foreground/60")}>
                      {c === "All" ? CHARTS.length : counts.get(c) ?? 0}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="mb-2 mt-5 px-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Difficulty</p>
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1 lg:grid-cols-1 xl:grid-cols-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDiff(d)}
                  className={cn(
                    "rounded-lg px-2 py-1.5 text-xs transition-colors",
                    diff === d ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>

            {hasFilters && (
              <button onClick={reset} className="mt-4 w-full rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                Reset filters
              </button>
            )}
          </div>
        </aside>

        {/* Results */}
        <div>
          <p className="mb-4 font-mono text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "chart" : "charts"}
            {hasFilters ? " matching" : ""}
          </p>
          <div data-reveal className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => (
              <Link
                key={c.slug}
                to={`/chart/${c.slug}`}
                className="card-lift group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{c.category}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">{c.difficulty}</span>
                    <FavoriteButton slug={c.slug} />
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl bg-surface-2/50 p-2">
                  <ChartPreview kind={c.preview} height={140} seed={c.slug.length + 3} />
                </div>
                <h3 className="mt-4 font-display text-xl">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
                No charts match "{q}"
                <button onClick={reset} className="mt-3 block w-full text-xs text-primary hover:underline">Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
