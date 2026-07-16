import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Columns3, Copy, KeyRound, Link2, Search } from "lucide-react";
import { PanelHeader } from "@/components/ext/Panel";
import { EmptyState } from "@/components/ext/EmptyState";
import { StatusDot } from "@/components/ext/StatusDot";
import { schemaTree, type SchemaTable } from "@/lib/mock/extras";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function SchemaExplorer() {
  const { data: tree = [] } = useQuery({ queryKey: ["schema-tree"], queryFn: async () => schemaTree() });
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!q) return tree;
    const needle = q.toLowerCase();
    return tree
      .map((g) => ({
        ...g,
        schemas: g.schemas
          .map((s) => ({ ...s, tables: s.tables.filter((t) => `${s.name}.${t.name}`.toLowerCase().includes(needle)) }))
          .filter((s) => s.tables.length > 0),
      }))
      .filter((g) => g.schemas.length > 0);
  }, [tree, q]);

  const selected: SchemaTable | undefined = useMemo(() => {
    for (const g of tree) for (const s of g.schemas) for (const t of s.tables) if (t.id === selectedId) return t;
    return undefined;
  }, [tree, selectedId]);

  const copyDDL = () => {
    if (!selected) return;
    const cols = selected.node.columns ?? [];
    const ddl = `CREATE TABLE ${selected.node.fullyQualifiedName} (\n${cols
      .map((c) => `  ${c.name} ${c.type.toUpperCase()}${c.isPrimary ? " PRIMARY KEY" : ""}${!c.nullable && !c.isPrimary ? " NOT NULL" : ""}`)
      .join(",\n")}\n);`;
    navigator.clipboard.writeText(ddl);
    toast.success("DDL copied to clipboard");
  };

  return (
    <div className="flex h-full min-w-0 bg-background">
      {/* left tree */}
      <div className="flex w-[340px] shrink-0 flex-col border-r border-border bg-surface">
        <PanelHeader
          title={
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
              <Columns3 size={14} className="text-muted-foreground" /> Schema Explorer
            </span>
          }
        />
        <div className="relative border-b border-border p-2">
          <Search size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter tables…"
            className="h-7 w-full rounded-md border border-border bg-background pl-6 pr-2 text-[12.5px] outline-none focus-ring"
          />
        </div>
        <div className="min-h-0 flex-1 overflow-auto py-1">
          {filtered.map((g) => (
            <div key={g.system} className="mb-2">
              <div className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-subtle-foreground">
                {g.system}
              </div>
              {g.schemas.map((s) => (
                <div key={s.name}>
                  <div className="px-3 py-0.5 text-[11.5px] text-muted-foreground">{s.name}</div>
                  <ul>
                    {s.tables.map((t) => (
                      <li key={t.id}>
                        <button
                          onClick={() => setSelectedId(t.id)}
                          className={cn(
                            "flex w-full items-center gap-2 px-5 py-1 text-left font-mono text-[12px] hover:bg-surface-2 focus-ring",
                            selectedId === t.id && "bg-primary/10 text-primary"
                          )}
                        >
                          <StatusDot status={t.node.status} />
                          <span className="truncate">{t.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* right column list */}
      <div className="flex min-w-0 flex-1 flex-col">
        {selected ? (
          <>
            <PanelHeader
              title={
                <div className="flex min-w-0 items-center gap-2">
                  <StatusDot status={selected.node.status} />
                  <span className="font-mono text-[13px]">{selected.node.fullyQualifiedName}</span>
                  <span className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {selected.node.columns?.length ?? 0} cols
                  </span>
                </div>
              }
              actions={
                <button
                  onClick={copyDDL}
                  className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-surface px-2 text-[12px] text-muted-foreground hover:bg-surface-2 hover:text-foreground focus-ring"
                >
                  <Copy size={12} /> Copy DDL
                </button>
              }
            />
            <div className="min-h-0 flex-1 overflow-auto">
              <div className="grid grid-cols-[1.4fr_0.9fr_0.4fr_0.4fr_1.5fr] gap-3 border-b border-border bg-surface-2 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <div>Column</div>
                <div>Type</div>
                <div>PK/FK</div>
                <div>Null</div>
                <div>Description</div>
              </div>
              {selected.node.columns?.map((c) => (
                <div
                  key={c.name}
                  className="grid grid-cols-[1.4fr_0.9fr_0.4fr_0.4fr_1.5fr] items-center gap-3 border-b border-border/60 px-4 py-2 text-[12.5px] hover:bg-surface-2"
                >
                  <div className="flex items-center gap-1.5 font-mono">
                    {c.isPrimary && <KeyRound size={11} className="text-warning" />}
                    {c.isForeign && <Link2 size={11} className="text-info" />}
                    <span>{c.name}</span>
                  </div>
                  <div className="font-mono text-[11.5px] text-muted-foreground">{c.type}</div>
                  <div className="font-mono text-[10.5px] text-muted-foreground">
                    {c.isPrimary ? "PK" : c.isForeign ? "FK" : "—"}
                  </div>
                  <div className="font-mono text-[10.5px] text-muted-foreground">{c.nullable ? "yes" : "no"}</div>
                  <div className="truncate text-[12px] text-muted-foreground">{c.description ?? "—"}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState icon={Columns3} title="Select a table" description="Pick a table on the left to explore its columns, keys, and DDL." />
        )}
      </div>
    </div>
  );
}
