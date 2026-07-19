import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useUI } from "@/lib/store";
import { listDatasets, listVersions, type Dataset, type DatasetVersion } from "@/lib/datasets";
import { getProfilesByIds, type ProfileLite } from "@/lib/notes";
import { supabase } from "@/integrations/supabase/client";
import { Database, Tag, User, Columns } from "lucide-react";

type SchemaCol = { name: string; type: string; dataset: Dataset };
type SearchIndex = {
  datasets: Dataset[];
  tags: { tag: string; datasets: Dataset[] }[];
  owners: { profile: ProfileLite; datasets: Dataset[] }[];
  columns: SchemaCol[];
};

async function buildIndex(): Promise<SearchIndex> {
  const datasets = await listDatasets({ archived: false });
  // Owners
  const ownerIds = Array.from(new Set(datasets.map((d) => d.owner_id)));
  const profiles = await getProfilesByIds(ownerIds);
  const ownersMap = new Map<string, { profile: ProfileLite; datasets: Dataset[] }>();
  for (const d of datasets) {
    const p = profiles[d.owner_id] ?? { id: d.owner_id, display_name: "Unknown", avatar_url: null };
    if (!ownersMap.has(d.owner_id)) ownersMap.set(d.owner_id, { profile: p, datasets: [] });
    ownersMap.get(d.owner_id)!.datasets.push(d);
  }
  // Tags
  const tagMap = new Map<string, Dataset[]>();
  for (const d of datasets) for (const t of d.tags ?? []) {
    if (!tagMap.has(t)) tagMap.set(t, []);
    tagMap.get(t)!.push(d);
  }
  // Schema (fetch current version for each dataset in parallel — batched)
  const { data: versionRows } = await supabase
    .from("dataset_versions")
    .select("dataset_id, version_number, schema")
    .in("dataset_id", datasets.map((d) => d.id));
  const columns: SchemaCol[] = [];
  const currentVersionByDs: Record<string, DatasetVersion | any> = {};
  for (const row of versionRows ?? []) {
    const ds = datasets.find((d) => d.id === (row as any).dataset_id);
    if (!ds) continue;
    if ((row as any).version_number !== ds.current_version) continue;
    currentVersionByDs[ds.id] = row;
    const cols = ((row as any).schema ?? []) as { name: string; type: string }[];
    if (Array.isArray(cols)) for (const c of cols) columns.push({ name: c.name, type: c.type, dataset: ds });
  }
  return {
    datasets,
    tags: Array.from(tagMap.entries()).map(([tag, ds]) => ({ tag, datasets: ds })),
    owners: Array.from(ownersMap.values()),
    columns,
  };
}

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen } = useUI();
  const nav = useNavigate();
  const [query, setQuery] = useState("");

  const { data: idx } = useQuery({ queryKey: ["search-index"], queryFn: buildIndex, staleTime: 60_000 });

  const fuse = useMemo(() => {
    if (!idx) return null;
    const docs = [
      ...idx.datasets.map((d) => ({ kind: "dataset" as const, id: d.id, text: `${d.name} ${d.description ?? ""} ${(d.tags ?? []).join(" ")}`, ref: d })),
      ...idx.tags.map((t) => ({ kind: "tag" as const, id: t.tag, text: t.tag, ref: t })),
      ...idx.owners.map((o) => ({ kind: "owner" as const, id: o.profile.id, text: o.profile.display_name ?? "", ref: o })),
      ...idx.columns.map((c) => ({ kind: "column" as const, id: `${c.dataset.id}:${c.name}`, text: `${c.name} ${c.type} ${c.dataset.name}`, ref: c })),
    ];
    return new Fuse(docs, { keys: ["text"], threshold: 0.35, ignoreLocation: true, includeScore: true });
  }, [idx]);

  const results = useMemo(() => {
    if (!fuse || !idx) return null;
    if (!query.trim()) {
      return {
        datasets: idx.datasets.slice(0, 8),
        tags: [] as typeof idx.tags,
        owners: [] as typeof idx.owners,
        columns: [] as SchemaCol[],
      };
    }
    const hits = fuse.search(query).slice(0, 40);
    const datasets: Dataset[] = [];
    const tags: { tag: string; datasets: Dataset[] }[] = [];
    const owners: { profile: ProfileLite; datasets: Dataset[] }[] = [];
    const columns: SchemaCol[] = [];
    for (const h of hits) {
      const it: any = h.item;
      if (it.kind === "dataset") datasets.push(it.ref);
      else if (it.kind === "tag") tags.push(it.ref);
      else if (it.kind === "owner") owners.push(it.ref);
      else if (it.kind === "column") columns.push(it.ref);
    }
    return { datasets, tags, owners, columns };
  }, [fuse, idx, query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  useEffect(() => { if (!paletteOpen) setQuery(""); }, [paletteOpen]);

  function go(path: string) { setPaletteOpen(false); nav(path); }

  return (
    <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
      <CommandInput placeholder="Search datasets, tags, owners, columns…" value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>

        {results && results.datasets.length > 0 && (
          <CommandGroup heading="Datasets">
            {results.datasets.slice(0, 8).map((d) => (
              <CommandItem key={`d-${d.id}`} value={`d-${d.id}-${d.name}`} onSelect={() => go(`/app/datasets/${d.id}`)}>
                <Database size={14} className="mr-2 text-muted-foreground" />
                <span className="flex-1 truncate">{d.name}</span>
                <span className="ml-2 truncate text-[11px] text-muted-foreground">{(d.tags ?? []).slice(0, 3).join(" · ")}</span>
                <span className="ml-2 font-mono text-[11px] text-muted-foreground">v{d.current_version}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results && results.columns.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Schema fields">
              {results.columns.slice(0, 8).map((c) => (
                <CommandItem key={`c-${c.dataset.id}-${c.name}`} value={`c-${c.dataset.id}-${c.name}`} onSelect={() => go(`/app/datasets/${c.dataset.id}`)}>
                  <Columns size={14} className="mr-2 text-muted-foreground" />
                  <span className="flex-1 truncate font-mono text-xs">{c.name}</span>
                  <span className="ml-2 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{c.type}</span>
                  <span className="ml-2 truncate text-[11px] text-muted-foreground">in {c.dataset.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {results && results.tags.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Tags">
              {results.tags.slice(0, 6).map((t) => (
                <CommandItem key={`t-${t.tag}`} value={`t-${t.tag}`} onSelect={() => { setPaletteOpen(false); nav("/app"); }}>
                  <Tag size={14} className="mr-2 text-muted-foreground" />
                  <span className="flex-1">#{t.tag}</span>
                  <span className="text-[11px] text-muted-foreground">{t.datasets.length} dataset{t.datasets.length === 1 ? "" : "s"}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {results && results.owners.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Owners">
              {results.owners.slice(0, 6).map((o) => (
                <CommandItem key={`o-${o.profile.id}`} value={`o-${o.profile.id}`} onSelect={() => { setPaletteOpen(false); nav("/app"); }}>
                  <User size={14} className="mr-2 text-muted-foreground" />
                  <span className="flex-1">{o.profile.display_name ?? "Unknown"}</span>
                  <span className="text-[11px] text-muted-foreground">{o.datasets.length} dataset{o.datasets.length === 1 ? "" : "s"}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
