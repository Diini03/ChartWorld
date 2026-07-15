import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { service } from "@/lib/mock/service";
import { useAppStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypeBadge, TypeIcon } from "@/components/ext/TypeBadge";
import { StatusDot } from "@/components/ext/StatusDot";
import { QualityBar } from "@/components/ext/QualityBar";
import { TagChip } from "@/components/ext/TagChip";
import { UserAvatar } from "@/components/ext/UserAvatar";
import { Sparkline } from "@/components/ext/Sparkline";
import { formatBytes, formatMinutes, formatNumber, formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Copy,
  ExternalLink,
  KeyRound,
  Link2,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

export function DatasetInspector({ nodeId }: { nodeId: string }) {
  const navigate = useNavigate();
  const { selectNode } = useAppStore();
  const { data: node } = useQuery({
    queryKey: ["node", nodeId],
    queryFn: () => service.getNode(nodeId),
  });

  const upstream = useMemo(() => (node ? service.upstream(node.id) : []), [node]);
  const downstream = useMemo(() => (node ? service.downstream(node.id) : []), [node]);
  const historyData = useMemo(
    () => (node?.history ?? []).map((p) => ({ value: p.score })),
    [node]
  );

  if (!node) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-[13px] text-muted-foreground">
        Loading…
      </div>
    );
  }

  const owner = service.userById(node.owner);
  const copyId = async () => {
    await navigator.clipboard.writeText(node.fullyQualifiedName);
    toast.success("Copied fully-qualified name");
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      {/* header */}
      <div className="shrink-0 border-b border-border p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <StatusDot status={node.status} />
            <TypeIcon type={node.type} size={14} className="text-muted-foreground" />
            <div className="min-w-0">
              <div className="truncate font-mono text-[14px] font-semibold">{node.name}</div>
              <button
                onClick={copyId}
                className="group flex items-center gap-1 truncate font-mono text-[10.5px] text-muted-foreground hover:text-foreground"
              >
                <span className="truncate">{node.fullyQualifiedName}</span>
                <Copy size={10} className="opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </div>
          </div>
          <TypeBadge type={node.type} />
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
          {node.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {node.tags.map((t) => (
            <TagChip key={t} label={t} />
          ))}
        </div>
      </div>

      {/* tabs */}
      <Tabs defaultValue="overview" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="h-9 shrink-0 justify-start gap-0 rounded-none border-b border-border bg-transparent px-3">
          {["overview", "schema", "dependencies", "quality", "history", "activity"].map((k) => (
            <TabsTrigger
              key={k}
              value={k}
              className="h-9 rounded-none border-b-2 border-transparent bg-transparent px-3 text-[12.5px] font-medium capitalize text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {k}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="min-h-0 flex-1 overflow-auto p-4 pt-3 focus:outline-none">
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Owner">
              <div className="flex items-center gap-1.5">
                <UserAvatar userId={node.owner} size={16} />
                <span className="text-[12.5px]">{owner?.name ?? "—"}</span>
              </div>
            </Metric>
            <Metric label="Source system" value={node.system} />
            <Metric label="Row count" value={formatNumber(node.rowCount)} mono />
            <Metric label="Size" value={formatBytes(node.sizeBytes)} mono />
            <Metric label="Freshness" value={formatMinutes(node.freshnessMinutes)} />
            <Metric label="Updated" value={formatRelative(node.updatedAt)} />
            <div className="col-span-2 rounded-md border border-border p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Quality
                </span>
                <QualityBar value={node.qualityScore} />
              </div>
              <Sparkline data={historyData} />
            </div>
          </div>
        </TabsContent>

        {/* Schema */}
        <TabsContent value="schema" className="min-h-0 flex-1 overflow-auto focus:outline-none">
          {!node.columns || node.columns.length === 0 ? (
            <EmptyLine text="No schema is registered for this asset type." />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-2 text-left font-medium">Column</th>
                  <th className="px-2 py-2 text-left font-medium">Type</th>
                  <th className="px-2 py-2 text-left font-medium">Null</th>
                </tr>
              </thead>
              <tbody>
                {node.columns.map((c) => (
                  <tr key={c.name} className="border-b border-border/60 text-[12.5px] hover:bg-surface-2">
                    <td className="flex items-center gap-1.5 px-4 py-2 font-mono">
                      {c.isPrimary && <KeyRound size={10} className="text-warning" />}
                      {c.isForeign && !c.isPrimary && <Link2 size={10} className="text-info" />}
                      {c.name}
                    </td>
                    <td className="px-2 py-2 font-mono text-muted-foreground">{c.type}</td>
                    <td className="px-2 py-2 text-muted-foreground">{c.nullable ? "yes" : "no"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TabsContent>

        {/* Dependencies */}
        <TabsContent value="dependencies" className="min-h-0 flex-1 overflow-auto focus:outline-none">
          <DepList
            title="Upstream"
            hint={`${upstream.length} nodes flow into this asset`}
            nodes={upstream}
            onSelect={(id) => {
              selectNode(id);
              navigate("/");
            }}
          />
          <DepList
            title="Downstream"
            hint={`${downstream.length} nodes depend on this asset`}
            nodes={downstream}
            onSelect={(id) => {
              selectNode(id);
              navigate("/");
            }}
            downstream
          />
        </TabsContent>

        {/* Quality */}
        <TabsContent value="quality" className="min-h-0 flex-1 overflow-auto p-4 pt-3 focus:outline-none">
          <div className="mb-3 rounded-md border border-border p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Quality score, 90d
              </span>
              <QualityBar value={node.qualityScore} />
            </div>
            <Sparkline data={historyData} height={72} />
          </div>
          <div className="space-y-1.5">
            {(node.checks ?? []).map((c) => (
              <div
                key={c.key}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-[12.5px]"
              >
                <div className="flex items-center gap-2">
                  <StatusDot status={c.status} />
                  <span className="font-medium">{c.label}</span>
                </div>
                <span className="text-muted-foreground">{c.detail}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="min-h-0 flex-1 overflow-auto focus:outline-none">
          {(node.versions ?? []).length === 0 ? (
            <EmptyLine text="No versioned history for this asset." />
          ) : (
            <ol className="p-3">
              {(node.versions ?? []).map((v, i) => (
                <li key={v.id} className="relative pl-6 pb-4 last:pb-0">
                  <span className="absolute left-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                  {i !== (node.versions?.length ?? 1) - 1 && (
                    <span className="absolute left-[9px] top-3 h-full w-px bg-border" />
                  )}
                  <div className="flex items-center gap-2 text-[12.5px]">
                    <span className="font-mono">{v.id.split("_").pop()}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{formatRelative(v.createdAt)}</span>
                    <span className="text-muted-foreground">·</span>
                    <UserAvatar userId={v.author} size={14} />
                  </div>
                  <p className="mt-1 text-[12.5px] text-foreground">{v.summary}</p>
                  {(v.added.length > 0 || v.removed.length > 0) && (
                    <div className="mt-1.5 flex flex-wrap gap-1 text-[10.5px]">
                      {v.added.map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center gap-0.5 rounded border border-success/40 bg-success/10 px-1.5 py-0.5 font-mono text-success"
                        >
                          <Plus size={9} /> {c}
                        </span>
                      ))}
                      {v.removed.map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center gap-0.5 rounded border border-danger/40 bg-danger/10 px-1.5 py-0.5 font-mono text-danger"
                        >
                          <Minus size={9} /> {c}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </TabsContent>

        {/* Activity */}
        <TabsContent value="activity" className="min-h-0 flex-1 overflow-auto focus:outline-none">
          <FilteredActivity targetId={node.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Metric({
  label,
  value,
  children,
  mono,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="rounded-md border border-border p-3">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {children ?? (
        <div className={cn("text-[13px]", mono && "font-mono")}>{value ?? "—"}</div>
      )}
    </div>
  );
}

function DepList({
  title,
  hint,
  nodes,
  onSelect,
  downstream,
}: {
  title: string;
  hint: string;
  nodes: ReturnType<typeof service.upstream>;
  onSelect: (id: string) => void;
  downstream?: boolean;
}) {
  return (
    <div className="p-3">
      <div className="mb-2 flex items-baseline justify-between">
        <h4 className="text-[12.5px] font-medium">{title}</h4>
        <span className="text-[10.5px] text-muted-foreground">{hint}</span>
      </div>
      {nodes.length === 0 ? (
        <EmptyLine text={downstream ? "No downstream consumers." : "No upstream sources."} />
      ) : (
        <ul className="space-y-0.5">
          {nodes.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => onSelect(n.id)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12.5px] hover:bg-surface-2 focus-ring"
              >
                <TypeIcon type={n.type} size={12} className="text-muted-foreground" />
                <StatusDot status={n.status} />
                <span className="flex-1 truncate font-mono">{n.name}</span>
                <ChevronRight size={12} className="text-subtle-foreground" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed border-border p-6 text-center text-[12.5px] text-muted-foreground">
      {text}
    </div>
  );
}

function FilteredActivity({ targetId }: { targetId: string }) {
  const { data = [] } = useQuery({
    queryKey: ["activity", "all"],
    queryFn: () => service.listActivity(),
  });
  const filtered = data.filter((e) => e.targetId === targetId).slice(0, 30);
  if (filtered.length === 0) {
    return (
      <div className="p-3">
        <EmptyLine text="No recorded activity for this asset yet." />
      </div>
    );
  }
  return (
    <ul className="p-2">
      {filtered.map((e) => (
        <li key={e.id} className="flex items-start gap-2 rounded-md px-2 py-1.5 text-[12.5px] hover:bg-surface-2">
          <UserAvatar userId={e.actor} size={16} />
          <div className="min-w-0 flex-1">
            <div className="truncate">
              <span className="font-medium">{service.userById(e.actor)?.name}</span>{" "}
              <span className="text-muted-foreground">{e.message}</span>
            </div>
            <div className="text-[10.5px] text-muted-foreground">{formatRelative(e.at)}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
