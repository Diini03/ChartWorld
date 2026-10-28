import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Trash2, Compass, FolderPlus, Folder, Pencil, Check, X, Plus } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { chartBySlug, type Chart } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import { FavoriteButton } from "@/components/chart/FavoriteButton";
import { useSaved, type Collection } from "@/lib/saved";
import { cn } from "@/lib/utils";

export default function Saved() {
  useSeo({
    title: "Saved Charts & Collections",
    description:
      "Your personal shortlist of chart types — favorites, custom collections and recently viewed charts, kept in your browser.",
    path: "/saved",
    noIndex: true,
  });

  const { favorites, recent, collections, clearFavorites, clearRecent } = useSaved();
  const favCharts = favorites.map(chartBySlug).filter(Boolean) as Chart[];
  const recentCharts = recent.map(chartBySlug).filter(Boolean) as Chart[];

  return (
    <div className="container py-10">
      <header data-reveal className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Your shelf</p>
        <h1 className="font-display text-5xl md:text-6xl">Saved & organized.</h1>
        <p className="mt-4 text-muted-foreground">
          Star charts, group them into collections, and pick up where you left off. Everything stays in this
          browser — nothing is uploaded.
        </p>
      </header>

      <CollectionsSection collections={collections} />

      <Section
        icon={<Star size={15} />}
        title="Favorites"
        count={favCharts.length}
        onClear={favCharts.length ? clearFavorites : undefined}
        empty="No favorites yet — tap the star on any chart card."
        charts={favCharts}
      />

      <Section
        icon={<Clock size={15} />}
        title="Recently viewed"
        count={recentCharts.length}
        onClear={recentCharts.length ? clearRecent : undefined}
        empty="Nothing here yet — open a chart and it will show up."
        charts={recentCharts}
      />
    </div>
  );
}

function CollectionsSection({ collections }: { collections: Collection[] }) {
  const { createCollection, renameCollection, deleteCollection } = useSaved();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const submitCreate = () => {
    if (newName.trim()) {
      createCollection(newName);
      setNewName("");
      setCreating(false);
    }
  };
  const submitRename = (id: string) => {
    if (editName.trim()) renameCollection(id, editName);
    setEditingId(null);
  };

  return (
    <section data-reveal className="mt-14">
      <div className="mb-5 flex items-end justify-between gap-3 border-b border-border pb-2">
        <h2 className="flex items-center gap-2 font-display text-2xl">
          <span className="text-primary"><Folder size={15} /></span>
          Collections
          <span className="font-mono text-[11px] text-muted-foreground">{collections.length}</span>
        </h2>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90"
          >
            <FolderPlus size={12} /> New collection
          </button>
        )}
      </div>

      {creating && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-border bg-card p-3">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitCreate();
              if (e.key === "Escape") setCreating(false);
            }}
            placeholder="Collection name, e.g. “Dashboard ideas”"
            className="flex-1 rounded-lg bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={submitCreate}
            disabled={!newName.trim()}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-40"
          >
            <Check size={13} /> Create
          </button>
          <button
            onClick={() => setCreating(false)}
            className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      {collections.length === 0 && !creating ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No collections yet — group charts by project, report or topic.
          </p>
          <button
            onClick={() => setCreating(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            <FolderPlus size={14} /> Create your first collection
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {collections.map((col) => {
            const charts = col.slugs.map(chartBySlug).filter(Boolean) as Chart[];
            return (
              <div key={col.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  {editingId === col.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitRename(col.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="flex-1 rounded-lg bg-surface-2 px-3 py-1.5 text-sm outline-none"
                      />
                      <button onClick={() => submitRename(col.id)} aria-label="Save name" className="text-primary hover:opacity-80">
                        <Check size={15} />
                      </button>
                      <button onClick={() => setEditingId(null)} aria-label="Cancel rename" className="text-muted-foreground hover:text-foreground">
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <h3 className="flex items-center gap-2 font-display text-lg">
                      {col.name}
                      <span className="font-mono text-[11px] text-muted-foreground">{charts.length}</span>
                    </h3>
                  )}
                  {editingId !== col.id && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingId(col.id); setEditName(col.name); }}
                        aria-label={`Rename ${col.name}`}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => deleteCollection(col.id)}
                        aria-label={`Delete ${col.name}`}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-destructive"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {charts.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                    Empty — use the <Plus size={11} className="inline" /> button on any chart below to add it here.
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {charts.map((c) => (
                      <ChartCard key={c.slug} chart={c} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
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
  charts: Chart[];
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
            <ChartCard key={c.slug} chart={c} />
          ))}
        </div>
      )}
    </section>
  );
}

function ChartCard({ chart: c }: { chart: Chart }) {
  const collections = useSaved((s) => s.collections);
  const toggleInCollection = useSaved((s) => s.toggleInCollection);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="card-lift group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm">
      <Link to={`/chart/${c.slug}`} className="absolute inset-0" aria-label={`Open ${c.name}`} />
      <div className="pointer-events-none relative">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {c.category}
          </span>
          <div className="pointer-events-auto flex items-center gap-1.5">
            {collections.length > 0 && (
              <button
                type="button"
                aria-label="Add to collection"
                title="Add to collection"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPickerOpen((o) => !o);
                }}
                className={cn(
                  "focus-ring inline-flex items-center rounded-full border px-2 py-1 text-xs transition-colors",
                  pickerOpen
                    ? "border-transparent bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                <Plus size={14} />
              </button>
            )}
            <FavoriteButton slug={c.slug} />
          </div>
        </div>
        <div className="overflow-hidden rounded-xl bg-surface-2/50 p-2">
          <ChartPreview kind={c.preview} height={130} seed={c.slug.length + 3} />
        </div>
        <h3 className="mt-4 font-display text-xl">{c.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
      </div>

      {pickerOpen && (
        <div className="absolute right-3 top-11 z-10 w-48 rounded-xl border border-border bg-popover p-1.5 shadow-lg">
          <p className="px-2 pb-1 pt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Collections
          </p>
          {collections.map((col) => {
            const inCol = col.slugs.includes(c.slug);
            return (
              <button
                key={col.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleInCollection(col.id, c.slug);
                }}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-surface-2"
              >
                <span className="truncate">{col.name}</span>
                {inCol && <Check size={12} className="shrink-0 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
