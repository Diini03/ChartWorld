import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Filter } from "lucide-react";
import { PanelHeader } from "@/components/ext/Panel";
import { StatusDot } from "@/components/ext/StatusDot";
import { qualityRules } from "@/lib/mock/extras";
import type { Status } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

const statuses: Status[] = ["fail", "warn", "ok"];

export function QualityPage() {
  const { data: rules = [] } = useQuery({ queryKey: ["quality-rules"], queryFn: async () => qualityRules() });
  const [filter, setFilter] = useState<Status | "all">("all");

  const counts = useMemo(() => ({
    fail: rules.filter((r) => r.status === "fail").length,
    warn: rules.filter((r) => r.status === "warn").length,
    ok: rules.filter((r) => r.status === "ok").length,
  }), [rules]);

  const filtered = filter === "all" ? rules : rules.filter((r) => r.status === filter);

  return (
    <div className="flex h-full min-w-0 flex-col bg-background">
      <PanelHeader
        title={
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
            <BarChart3 size={14} className="text-muted-foreground" /> Data Quality
            <span className="ml-1 font-mono text-[11px] text-muted-foreground">{rules.length} checks</span>
          </span>
        }
        actions={
          <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-0.5">
            <Filter size={11} className="mx-1.5 text-muted-foreground" />
            {(["all", ...statuses] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "h-6 rounded px-2 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground hover:text-foreground focus-ring",
                  filter === s && "bg-surface-2 text-foreground"
                )}
              >
                {s === "all" ? "All" : s} {s !== "all" && <span className="ml-1 opacity-70">{counts[s]}</span>}
              </button>
            ))}
          </div>
        }
      />
      <div className="grid grid-cols-[1.4fr_0.7fr_1fr_0.7fr_2fr_1fr] gap-3 border-b border-border bg-surface-2 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <div>Dataset · target</div>
        <div>Check</div>
        <div>Threshold</div>
        <div>Status</div>
        <div>30-day history</div>
        <div>Last run</div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {filtered.map((r) => (
          <div key={r.id} className="grid grid-cols-[1.4fr_0.7fr_1fr_0.7fr_2fr_1fr] items-center gap-3 border-b border-border/60 px-4 py-2 text-[12.5px] hover:bg-surface-2">
            <div className="min-w-0">
              <div className="truncate font-mono">{r.datasetName}</div>
              <div className="truncate font-mono text-[10.5px] text-muted-foreground">.{r.target}</div>
            </div>
            <div className="font-mono text-[11.5px] capitalize text-muted-foreground">{r.kind.replace("_", " ")}</div>
            <div className="font-mono text-[11.5px] text-muted-foreground">{r.threshold}</div>
            <div className="flex items-center gap-1.5">
              <StatusDot status={r.status} />
              <span className="capitalize text-[11.5px]">{r.status === "ok" ? "passing" : r.status === "warn" ? "degraded" : "failing"}</span>
            </div>
            <div className="flex items-center gap-[2px]">
              {r.history.map((h, i) => (
                <div
                  key={i}
                  title={`${h.d}: ${h.pass ? "pass" : "fail"}`}
                  className={cn("h-4 w-[6px] rounded-sm", h.pass ? "bg-success/60" : "bg-danger/70")}
                />
              ))}
            </div>
            <div className="truncate text-[11px] text-muted-foreground">{new Date(r.lastRunAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
