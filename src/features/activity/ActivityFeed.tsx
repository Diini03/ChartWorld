import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  BellRing,
  CheckCircle2,
  FileCheck,
  GitCommit,
  MessageSquare,
  Pin,
  PlayCircle,
  PlusCircle,
  XCircle,
} from "lucide-react";
import { service } from "@/lib/mock/service";
import { useAppStore } from "@/lib/store";
import type { ActivityEvent, ActivityKind } from "@/lib/mock/types";
import { UserAvatar } from "@/components/ext/UserAvatar";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

const kindMeta: Record<
  ActivityKind,
  { icon: typeof PlayCircle; color: string; verb: string }
> = {
  dataset_created: { icon: PlusCircle, color: "text-info", verb: "created" },
  schema_updated: { icon: GitCommit, color: "text-primary", verb: "updated schema of" },
  pipeline_run: { icon: PlayCircle, color: "text-success", verb: "ran" },
  quality_failed: { icon: XCircle, color: "text-danger", verb: "quality failed on" },
  quality_recovered: { icon: CheckCircle2, color: "text-success", verb: "recovered" },
  report_generated: { icon: FileCheck, color: "text-info", verb: "generated" },
  alert_triggered: { icon: BellRing, color: "text-warning", verb: "alerted on" },
  comment_added: { icon: MessageSquare, color: "text-muted-foreground", verb: "commented on" },
  version_pinned: { icon: Pin, color: "text-primary", verb: "pinned a version of" },
};

const filters: Array<{ label: string; kinds: ActivityKind[] | null }> = [
  { label: "All", kinds: null },
  { label: "Quality", kinds: ["quality_failed", "quality_recovered", "alert_triggered"] },
  { label: "Pipelines", kinds: ["pipeline_run"] },
  { label: "Schema", kinds: ["schema_updated", "version_pinned", "dataset_created"] },
  { label: "Comments", kinds: ["comment_added"] },
];

export function ActivityFeed({ dense = false }: { dense?: boolean }) {
  const navigate = useNavigate();
  const { selectNode } = useAppStore();
  const [active, setActive] = useState(0);

  const { data = [] } = useQuery({
    queryKey: ["activity", "all"],
    queryFn: () => service.listActivity(),
  });

  const events = useMemo(() => {
    const kinds = filters[active].kinds;
    if (!kinds) return data;
    return data.filter((e) => kinds.includes(e.kind));
  }, [active, data]);

  const openTarget = (e: ActivityEvent) => {
    if (!e.targetId) return;
    selectNode(e.targetId);
    navigate("/");
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      {/* filter chips */}
      <div className="flex shrink-0 items-center gap-1 border-b border-border px-2 py-1.5">
        {filters.map((f, i) => (
          <button
            key={f.label}
            onClick={() => setActive(i)}
            className={cn(
              "rounded px-2 py-0.5 text-[11.5px] transition-colors focus-ring",
              active === i
                ? "bg-surface-3 text-foreground"
                : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto pr-1 font-mono text-[10.5px] text-subtle-foreground">
          {events.length} events
        </div>
      </div>

      {/* list */}
      <div className="min-h-0 flex-1 overflow-auto">
        <ul className={cn("divide-y divide-border/60", dense ? "" : "px-2")}>
          {events.map((e) => {
            const meta = kindMeta[e.kind];
            const Icon = meta.icon;
            const actor = service.userById(e.actor);
            return (
              <li
                key={e.id}
                onClick={() => openTarget(e)}
                className={cn(
                  "group flex cursor-pointer items-start gap-2.5 py-1.5 transition-colors hover:bg-surface-2",
                  dense ? "px-3" : "px-2"
                )}
              >
                <UserAvatar userId={e.actor} size={18} />
                <Icon size={13} className={cn("mt-0.5 shrink-0", meta.color)} strokeWidth={1.75} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px]">
                    <span className="font-medium text-foreground">{actor?.name}</span>{" "}
                    <span className="text-muted-foreground">{meta.verb}</span>{" "}
                    {e.targetName && (
                      <span className="font-mono text-foreground">{e.targetName}</span>
                    )}
                    <span className="text-muted-foreground"> — {e.message}</span>
                  </div>
                  <div className="text-[10.5px] text-subtle-foreground">
                    {formatRelative(e.at)}
                  </div>
                </div>
              </li>
            );
          })}
          {events.length === 0 && (
            <li className="p-8 text-center text-[12.5px] text-muted-foreground">
              No events for this filter.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
