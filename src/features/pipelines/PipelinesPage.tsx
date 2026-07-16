import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Boxes, Clock, Play, User2 } from "lucide-react";
import { PanelHeader } from "@/components/ext/Panel";
import { StatusDot } from "@/components/ext/StatusDot";
import { Sparkline } from "@/components/ext/Sparkline";
import { EmptyState } from "@/components/ext/EmptyState";
import { pipelines, pipelineRuns } from "@/lib/mock/extras";
import { service } from "@/lib/mock/service";
import { formatMinutes } from "@/lib/format";
import { cn } from "@/lib/utils";

function fmtDuration(sec: number) {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function fmtRelative(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 60_000;
  if (diff < 60) return `${Math.round(diff)}m ago`;
  if (diff < 60 * 24) return `${Math.round(diff / 60)}h ago`;
  return `${Math.round(diff / (60 * 24))}d ago`;
}

export function PipelinesPage() {
  const { data: pipes = [] } = useQuery({ queryKey: ["pipelines"], queryFn: async () => pipelines() });
  const [selectedId, setSelectedId] = useState<string | null>(pipes[0]?.id ?? null);
  const activeId = selectedId ?? pipes[0]?.id ?? null;
  const runs = useMemo(() => (activeId ? pipelineRuns(activeId) : []), [activeId]);
  const active = pipes.find((p) => p.id === activeId);

  return (
    <div className="flex h-full min-w-0 bg-background">
      {/* list */}
      <div className="flex w-[420px] shrink-0 flex-col border-r border-border">
        <PanelHeader
          title={
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
              <Boxes size={14} className="text-muted-foreground" /> Pipelines
              <span className="ml-1 font-mono text-[11px] text-muted-foreground">{pipes.length}</span>
            </span>
          }
        />
        <div className="min-h-0 flex-1 overflow-auto">
          {pipes.map((p) => {
            const rs = pipelineRuns(p.id);
            const trend = rs.slice(0, 20).reverse().map((r) => r.durationSec);
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={cn(
                  "flex w-full flex-col items-stretch gap-1 border-b border-border/60 px-3 py-2.5 text-left hover:bg-surface-2 focus-ring",
                  activeId === p.id && "bg-primary/10"
                )}
              >
                <div className="flex items-center gap-2">
                  <StatusDot status={p.status} />
                  <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] font-medium">{p.name}</span>
                  <span className="font-mono text-[10.5px] text-muted-foreground">{formatMinutes((Date.now() - new Date(p.updatedAt).getTime()) / 60_000)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-[70px]"><Sparkline data={trend} height={18} /></div>
                  <div className="min-w-0 flex-1 truncate text-[11.5px] text-muted-foreground">{p.system}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* runs timeline */}
      <div className="flex min-w-0 flex-1 flex-col">
        {active ? (
          <>
            <PanelHeader
              title={
                <div className="flex min-w-0 items-center gap-2">
                  <StatusDot status={active.status} />
                  <span className="font-mono text-[13px]">{active.name}</span>
                  <span className="truncate text-[11.5px] text-muted-foreground">{active.description}</span>
                </div>
              }
              actions={
                <button className="inline-flex h-7 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[12px] font-medium text-primary-foreground hover:opacity-90 focus-ring">
                  <Play size={11} /> Trigger run
                </button>
              }
            />
            <div className="grid grid-cols-[1fr_0.6fr_0.6fr_0.6fr_2fr] gap-3 border-b border-border bg-surface-2 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <div>Started</div>
              <div>Duration</div>
              <div>Trigger</div>
              <div>Status</div>
              <div>Tasks</div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              {runs.map((r) => {
                const max = Math.max(...r.tasks.map((t) => t.durationSec));
                return (
                  <div key={r.id} className="grid grid-cols-[1fr_0.6fr_0.6fr_0.6fr_2fr] items-center gap-3 border-b border-border/60 px-4 py-2 text-[12px] hover:bg-surface-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={11} />
                      <span className="font-mono text-[11.5px]">{fmtRelative(r.startedAt)}</span>
                    </div>
                    <div className="font-mono text-[11.5px] text-muted-foreground">{fmtDuration(r.durationSec)}</div>
                    <div className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
                      {r.triggeredBy === "schedule" ? <Clock size={11} /> : <User2 size={11} />}
                      {r.triggeredBy}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StatusDot status={r.status} />
                      <span className="capitalize text-[11.5px]">{r.status}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {r.tasks.map((t) => (
                        <div
                          key={t.name}
                          title={`${t.name} — ${fmtDuration(t.durationSec)}`}
                          className={cn(
                            "h-2 rounded-sm",
                            t.status === "ok" && "bg-success/70",
                            t.status === "warn" && "bg-warning/70",
                            t.status === "fail" && "bg-danger/70"
                          )}
                          style={{ width: `${Math.max(6, (t.durationSec / max) * 100)}px` }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <EmptyState icon={Boxes} title="No pipelines" />
        )}
      </div>
    </div>
  );
}
