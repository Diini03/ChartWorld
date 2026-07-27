import { Link } from "react-router-dom";
import { CATEGORIES, CATEGORY_META, chartsByCategory } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";

export default function Categories() {
  return (
    <div className="container py-10">
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Categories</p>
        <h1 className="font-display text-5xl md:text-6xl">Twelve families of charts.</h1>
        <p className="mt-4 text-muted-foreground">Each family answers a different kind of question.</p>
      </header>

      <div className="mt-16 space-y-24">
        {CATEGORIES.map((cat) => {
          const items = chartsByCategory(cat);
          const meta = CATEGORY_META[cat];
          return (
            <section key={cat} id={cat.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-24">
              <div className="mb-8 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
                <div>
                  <div className="mb-2 h-1 w-16 rounded-full" style={{ background: `hsl(${meta.hue} 80% 60%)` }} />
                  <h2 className="font-display text-4xl md:text-5xl">{cat}</h2>
                  <p className="mt-2 text-muted-foreground">{meta.blurb}</p>
                </div>
                <span className="rounded-full bg-surface-2 px-3 py-1 font-mono text-xs text-muted-foreground">{items.length} chart{items.length !== 1 && "s"}</span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((c) => (
                  <Link key={c.slug} to={`/chart/${c.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="overflow-hidden rounded-xl bg-surface-2/50 p-2">
                      <ChartPreview kind={c.preview} height={130} seed={c.slug.length} />
                    </div>
                    <h3 className="mt-3 font-display text-lg">{c.name}</h3>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{c.tagline}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
