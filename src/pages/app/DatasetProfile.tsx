import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft, Download, Copy, Share2, Trash2, ExternalLink, Star, GitBranch, GitCompare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getDataset, listVersions, toggleFavorite, deleteDataset, downloadDataset, formatBytes,
} from "@/lib/datasets";
import { NotesEditor } from "@/components/app/NotesEditor";
import { VersionCompare } from "@/components/app/VersionCompare";

export default function DatasetProfile() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [compareOpen, setCompareOpen] = useState(false);

  const { data: d, isLoading } = useQuery({ queryKey: ["dataset", id], queryFn: () => getDataset(id) });
  const { data: versions = [] } = useQuery({ queryKey: ["versions", id], queryFn: () => listVersions(id) });

  if (isLoading) return <div className="p-12 text-muted-foreground">Loading…</div>;
  if (!d) return <div className="p-12 text-muted-foreground">Dataset not found.</div>;

  const currentVersion = versions.find((v) => v.version_number === d.current_version) ?? versions[0];
  const schema: { name: string; type: string }[] = (currentVersion?.schema as any) ?? [];
  const preview: any[] = (currentVersion?.preview as any) ?? [];

  async function onDelete() {
    if (!confirm(`Delete "${d!.name}"? This cannot be undone.`)) return;
    await deleteDataset(d!.id);
    toast.success("Dataset deleted");
    qc.invalidateQueries({ queryKey: ["datasets"] });
    nav("/app");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link to="/app" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={14} /> Back to library
      </Link>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 font-mono text-xs text-primary">CSV</div>
            <div>
              <h1 className="font-display text-3xl">{d.name}</h1>
              <p className="text-sm text-muted-foreground">
                Updated {formatDistanceToNow(new Date(d.updated_at), { addSuffix: true })} · created {format(new Date(d.created_at), "PP")}
              </p>
            </div>
          </div>
          {d.description && <p className="mt-4 max-w-2xl text-muted-foreground">{d.description}</p>}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {d.tags?.map((t) => (
              <span key={t} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-muted-foreground">{t}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => toggleFavorite(d.id, !d.is_favorite).then(() => qc.invalidateQueries({ queryKey: ["dataset", id] }))}>
            <Star size={14} className={d.is_favorite ? "fill-primary text-primary" : ""} />
            {d.is_favorite ? "Favorited" : "Favorite"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => d.storage_path && downloadDataset(d.storage_path)}>
            <Download size={14} /> Download
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Duplicate coming soon")}>
            <Copy size={14} /> Duplicate
          </Button>
          <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); }}>
            <Share2 size={14} /> Share
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Handoff to NadiifiData is coming.")}>
            <ExternalLink size={14} /> Open in NadiifiData
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 size={14} />
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="mb-8 grid gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft sm:grid-cols-4">
        <Stat label="Rows" value={d.row_count.toLocaleString()} />
        <Stat label="Columns" value={String(d.column_count)} />
        <Stat label="Size" value={formatBytes(d.file_size)} />
        <Stat label="Version" value={`v${d.current_version}`} />
      </div>

      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-4">
          {preview.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No preview available.</div>
          ) : (
            <div className="overflow-auto rounded-xl border border-border bg-surface shadow-soft">
              <table className="w-full font-mono text-xs">
                <thead className="bg-surface-2/60 text-muted-foreground">
                  <tr>
                    {schema.map((c) => <th key={c.name} className="px-3 py-2 text-left font-medium">{c.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 50).map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      {schema.map((c) => (
                        <td key={c.name} className="px-3 py-1.5 text-foreground/80">{String(row[c.name] ?? "")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="schema" className="mt-4">
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-surface-2/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Column</th>
                  <th className="px-4 py-2 text-left font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {schema.map((c) => (
                  <tr key={c.name} className="border-t border-border">
                    <td className="px-4 py-2 font-mono">{c.name}</td>
                    <td className="px-4 py-2"><span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-xs text-muted-foreground">{c.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="versions" className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{versions.length} version{versions.length === 1 ? "" : "s"}</p>
            <Button variant="outline" size="sm" onClick={() => setCompareOpen(true)} disabled={versions.length < 2}>
              <GitCompare size={14} /> Compare versions
            </Button>
          </div>
          <div className="space-y-3">
            {versions.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <GitBranch size={14} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Version {v.version_number} {v.version_number === d.current_version && <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">current</span>}</div>
                    <div className="text-xs text-muted-foreground">{v.change_note ?? "—"}</div>
                  </div>
                </div>
                <div className="text-right font-mono text-xs text-muted-foreground">
                  {v.row_count?.toLocaleString()} rows · {v.column_count} cols
                  <div>{formatDistanceToNow(new Date(v.created_at), { addSuffix: true })}</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <NotesEditor datasetId={d.id} />
        </TabsContent>
      </Tabs>

      <VersionCompare open={compareOpen} onOpenChange={setCompareOpen} versions={versions} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col rounded-lg bg-surface-2/50 px-4 py-3">
      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="mt-1 font-display text-2xl">{value}</span>
    </div>
  );
}
