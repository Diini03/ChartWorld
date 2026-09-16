import { Link } from "react-router-dom";
import { Star, Clock, Trash2, Compass } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { chartBySlug } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import { FavoriteButton } from "@/components/chart/FavoriteButton";
import { useSaved } from "@/lib/saved";

export default function Saved() {
  useSeo({
    title: "Saved Charts & Recently Viewed",
    description:
      "Your personal shortlist of chart types — favorites you starred and the charts you looked at recently, kept in your browser.",
    path: "/saved",
    noIndex: true,
  });

  const { favorites, recent, clearFavorites, clearRecent } = useSaved();
  const favCharts = favorites.map(chartBySlug).filter(Boolean);
  const recentCharts = recent.map(chartBySlug).filter(Boolean);

  return (
    <div className="container py-10">
      <header data-reveal className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Your shelf</p>
        <h1 className="font-display text-5xl md:text-6xl">Saved & recently viewed.</h1>
        <p className="mt-4 text-muted-foreground">
          Star any chart to keep it here. Everything stays in this browser — nothing is uploaded.
        </p>
      </header>

      <Section
        icon={<Star size={15} />}
        title="Favorites"
        count={favCharts.length}
        onClear={favCharts.length ? clearFavorites : undefined}
        empty="No favorites yet — tap the star on any chart card."
        charts={favCharts as NonNullable<ReturnType<typeof chartBySlug>>[]}
      />

      <Section
        icon={<Clock size={15} />}
        title="Recently viewed"
        count={recentCharts.length}
        onClear={recentCharts.length ? clearRecent : undefined}
        empty="Nothing here yet — open a chart and it will show up."
        charts={recentCharts as NonNullable<ReturnType<typeof chartBySlug>>[]}
      />
    </div>
  );
}

function Section({
  icon,
  title,
  count,
  onClear,
  empty,
  charts,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  onClear?: () => void;
  empty: string;
  charts: NonNullable<ReturnType<typeof chartBySlug>>[];
}) {
  return (
    <section data-reveal className="mt-14">
      <div className="mb-5 flex items-end justify-between gap-3 border-b border-border pb-2">
        <h2 className="flex items-center gap-2 font-display text-2xl">
          <span className="text-primary">{icon}</span>
          {title}
          <span className="font-mono text-[11px] text-muted-foreground">{count}</span>
        </h2>
        {onClear && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Trash2 size={12} /> Clear
          </button>
        )}
      </div>

      {charts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">{empty}</p>
          <Link
            to="/explore"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            <Compass size={14} /> Explore charts
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {charts.map((c) => (
            <Link
              key={c.slug}
              to={`/chart/${c.slug}`}
              className="card-lift group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {c.category}
                </span>
                <FavoriteButton slug={c.slug} />
              </div>
              <div className="overflow-hidden rounded-xl bg-surface-2/50 p-2">
                <ChartPreview kind={c.preview} height={130} seed={c.slug.length + 3} />
              </div>
              <h3 className="mt-4 font-display text-xl">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
