import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GitCompareArrows, Minus, Plus } from "lucide-react";
import { PanelHeader } from "@/components/ext/Panel";
import { EmptyState } from "@/components/ext/EmptyState";
import { service } from "@/lib/mock/service";
import { UserAvatar } from "@/components/ext/UserAvatar";
import { cn } from "@/lib/utils";

export function VersionsPage() {
  const { data: all = [] } = useQuery({ queryKey: ["catalog", "all"], queryFn: () => service.listAll() });
  const versioned = useMemo(() => all.filter((n) => (n.versions?.length ?? 0) > 0), [all]);
  const [datasetId, setDatasetId] = useState<string | null>(versioned[0]?.id ?? null);
  const active = versioned.find((v) => v.id === datasetId) ?? versioned[0];
  const versions = active?.versions ?? [];
  const [selVer, setSelVer] = useState<string | null>(null);
  const selectedVer = versions.find((v) => v.id === selVer) ?? versions[0];

  return (
    <div className="flex h-full min-w-0 bg-background">
      <div className="flex w-[320px] shrink-0 flex-col border-r border-border bg-surface">
        <PanelHeader
          title={
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
              <GitCompareArrows size={14} className="text-muted-foreground" /> Version History
            </span>
          }
        />
        <div className="min-h-0 flex-1 overflow-auto">
          {versioned.map((d) => (
            <button
              key={d.id}
              onClick={() => { setDatasetId(d.id); setSelVer(null); }}
              className={cn(
                "flex w-full items-center gap-2 border-b border-border/60 px-3 py-2 text-left hover:bg-surface-2 focus-ring",
                (active?.id === d.id) && "bg-primary/10"
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-[12.5px]">{d.name}</div>
                <div className="truncate text-[10.5px] text-muted-foreground">{d.versions?.length ?? 0} versions</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {active ? (
          <>
            <PanelHeader title={<span className="font-mono text-[13px]">{active.fullyQualifiedName}</span>} />
            <div className="grid grid-cols-[280px_1fr] min-h-0 flex-1 overflow-hidden">
              <ol className="overflow-auto border-r border-border p-3">
                {versions.map((v, i) => (
                  <li key={v.id}>
                    <button
                      onClick={() => setSelVer(v.id)}
                      className={cn(
                        "flex w-full flex-col gap-1 rounded-md border border-transparent px-2.5 py-2 text-left text-[12.5px] hover:bg-surface-2 focus-ring",
                        (selectedVer?.id === v.id) && "border-border bg-surface-2"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10.5px] text-muted-foreground">v{versions.length - i}</span>
                        <span className="truncate">{v.summary}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
                        <UserAvatar userId={v.author} size={14} />
                        <span>{service.userById(v.author)?.handle}</span>
                        <span>·</span>
                        <span>{new Date(v.createdAt).toLocaleString()}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ol>
              <div className="overflow-auto p-4 text-[12.5px]">
                {selectedVer ? (
                  <>
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Schema diff</div>
                    <div className="grid grid-cols-1 gap-1 font-mono text-[12px] md:grid-cols-2">
                      <div className="rounded border border-border bg-surface p-3">
                        <div className="mb-1 text-[10px] uppercase text-muted-foreground">Added</div>
                        {selectedVer.added.length === 0 ? (
                          <div className="text-muted-foreground">—</div>
                        ) : selectedVer.added.map((c) => (
                          <div key={c} className="flex items-center gap-1.5 text-success"><Plus size={11} /> {c}</div>
                        ))}
                      </div>
                      <div className="rounded border border-border bg-surface p-3">
                        <div className="mb-1 text-[10px] uppercase text-muted-foreground">Removed</div>
                        {selectedVer.removed.length === 0 ? (
                          <div className="text-muted-foreground">—</div>
                        ) : selectedVer.removed.map((c) => (
                          <div key={c} className="flex items-center gap-1.5 text-danger"><Minus size={11} /> {c}</div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground">Pick a version to see the diff.</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <EmptyState icon={GitCompareArrows} title="No version history" />
        )}
      </div>
    </div>
  );
}
