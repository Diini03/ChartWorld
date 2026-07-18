import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Star, Database, LayoutGrid, List as ListIcon, Search, Archive, Clock } from "lucide-react";
import { listDatasets, toggleFavorite, formatBytes, type Dataset } from "@/lib/datasets";
import { useUI } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Library() {
  const { pathname } = useLocation();
  const qc = useQueryClient();
  const { viewMode, setViewMode } = useUI();
  const [q, setQ] = useState("");

  const opts = pathname.endsWith("/favorites") ? { favorites: true } :
               pathname.endsWith("/archive") ? { archived: true } :
               {};
  const heading = pathname.endsWith("/favorites") ? "Favorites" :
                  pathname.endsWith("/archive") ? "Archive" :
                  pathname.endsWith("/recent") ? "Recent" : "Library";
  const Icon = pathname.endsWith("/favorites") ? Star :
               pathname.endsWith("/archive") ? Archive :
               pathname.endsWith("/recent") ? Clock : Database;

  const { data: all = [], isLoading } = useQuery({
    queryKey: ["datasets", opts],
    queryFn: () => listDatasets(opts),
  });

  const datasets = useMemo(() => {
    let r = all;
    if (q.trim()) {
      const s = q.toLowerCase();
      r = r.filter((d) =>
        d.name.toLowerCase().includes(s) ||
        d.description?.toLowerCase().includes(s) ||
        d.tags?.some((t) => t.toLowerCase().includes(s))
      );
    }
    if (pathname.endsWith("/recent")) r = r.slice(0, 20);
    return r;
  }, [all, q, pathname]);

  async function onFav(id: string, v: boolean) {
    await toggleFavorite(id, v);
    qc.invalidateQueries({ queryKey: ["datasets"] });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <Icon size={12} /> Workspace
          </div>
          <h1 className="mt-1 font-display text-4xl">{heading}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…" className="w-64 pl-9" />
          </div>
          <div className="flex overflow-hidden rounded-md border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={cn("flex h-9 w-9 items-center justify-center", viewMode === "grid" ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:bg-surface-2/50")}
              aria-label="Grid view"
            ><LayoutGrid size={14} /></button>
            <button
              onClick={() => setViewMode("table")}
              className={cn("flex h-9 w-9 items-center justify-center border-l border-border", viewMode === "table" ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:bg-surface-2/50")}
              aria-label="Table view"
            ><ListIcon size={14} /></button>
          </div>
        </div>
      </header>

      {isLoading ? (
        <SkeletonGrid />
      ) : datasets.length === 0 ? (
        <EmptyState />
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {datasets.map((d) => <DatasetCard key={d.id} d={d} onFav={onFav} />)}
        </div>
      ) : (
        <DatasetTable datasets={datasets} onFav={onFav} />
      )}
    </div>
  );
}

function DatasetCard({ d, onFav }: { d: Dataset; onFav: (id: string, v: boolean) => void }) {
  return (
    <Link
      to={`/app/datasets/${d.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-soft transition-all hover:shadow-card"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-mono text-[10px] font-medium text-primary">
          CSV
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">v{d.current_version}</span>
          <button
            onClick={(e) => { e.preventDefault(); onFav(d.id, !d.is_favorite); }}
            aria-label="Toggle favorite"
            className={cn("rounded-md p-1 transition-colors", d.is_favorite ? "text-primary" : "text-muted-foreground hover:text-foreground")}
          >
            <Star size={14} fill={d.is_favorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
      <h3 className="truncate font-medium">{d.name}</h3>
      {d.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{d.description}</p>}
      <div className="mt-4 flex flex-wrap gap-1">
        {d.tags?.slice(0, 3).map((t) => (
          <span key={t} className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between pt-4 text-[11px] text-muted-foreground">
        <span className="font-mono">{d.row_count.toLocaleString()} rows · {d.column_count} cols</span>
        <span>{formatDistanceToNow(new Date(d.updated_at), { addSuffix: true })}</span>
      </div>
    </Link>
  );
}

function DatasetTable({ datasets, onFav }: { datasets: Dataset[]; onFav: (id: string, v: boolean) => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      <table className="w-full text-sm">
        <thead className="bg-surface-2/50 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Tags</th>
            <th className="px-4 py-3 text-right font-medium">Rows</th>
            <th className="px-4 py-3 text-right font-medium">Cols</th>
            <th className="px-4 py-3 text-right font-medium">Size</th>
            <th className="px-4 py-3 text-right font-medium">Version</th>
            <th className="px-4 py-3 text-right font-medium">Updated</th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {datasets.map((d) => (
            <tr key={d.id} className="border-t border-border hover:bg-surface-2/40">
              <td className="px-4 py-3">
                <Link to={`/app/datasets/${d.id}`} className="font-medium hover:text-primary">{d.name}</Link>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {d.tags?.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs">{d.row_count.toLocaleString()}</td>
              <td className="px-4 py-3 text-right font-mono text-xs">{d.column_count}</td>
              <td className="px-4 py-3 text-right font-mono text-xs">{formatBytes(d.file_size)}</td>
              <td className="px-4 py-3 text-right font-mono text-xs">v{d.current_version}</td>
              <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(d.updated_at), { addSuffix: true })}
              </td>
              <td className="px-2 py-3 text-right">
                <button
                  onClick={() => onFav(d.id, !d.is_favorite)}
                  className={cn("rounded p-1", d.is_favorite ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                  aria-label="Toggle favorite"
                >
                  <Star size={14} fill={d.is_favorite ? "currentColor" : "none"} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-40 animate-pulse rounded-2xl border border-border bg-surface" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Database size={22} />
      </div>
      <h3 className="font-display text-2xl">Your workspace is empty.</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Upload your first dataset to start organizing. Any CSV file will do.
      </p>
    </div>
  );
}
