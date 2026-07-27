import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { CHARTS, CATEGORIES } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import { Search } from "lucide-react";

export default function Explore() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const filtered = useMemo(() => {
    return CHARTS.filter((c) => (cat === "All" || c.category === cat) &&
      (q === "" || (c.name + c.tagline + c.category + c.keywords.join(" ")).toLowerCase().includes(q.toLowerCase())));
  }, [q, cat]);

  return (
    <div className="container py-10">
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Explore</p>
        <h1 className="font-display text-5xl md:text-6xl">Every chart, in one place.</h1>
        <p className="mt-4 text-muted-foreground">Browse the whole gallery — click any to open its story.</p>
      </header>

      <div className="sticky top-20 z-30 mt-10 flex flex-col gap-3 rounded-2xl border border-border bg-background/80 p-3 backdrop-blur md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-surface-2 px-3">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search bar, scatter, sankey…"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${cat === c ? "bg-foreground text-background" : "bg-surface-2 text-muted-foreground hover:text-foreground"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((c) => (
          <Link
            key={c.slug}
            to={`/chart/${c.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{c.category}</span>
              <span className="text-[10px] text-muted-foreground">{c.difficulty}</span>
            </div>
            <div className="overflow-hidden rounded-xl bg-surface-2/50 p-2">
              <ChartPreview kind={c.preview} height={140} seed={c.slug.length + 3} />
            </div>
            <h3 className="mt-4 font-display text-xl">{c.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground">No charts match "{q}"</div>
        )}
      </div>
    </div>
  );
}
