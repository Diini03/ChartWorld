import { ActivityFeed } from "@/features/activity/ActivityFeed";
import { PanelHeader } from "@/components/ext/Panel";
import { Activity } from "lucide-react";

export function ActivityDrawer() {
  return (
    <div className="flex h-full min-w-0 flex-col border-t border-border bg-surface">
      <PanelHeader
        title={
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
            <Activity size={12} /> Activity
          </span>
        }
      />
      <div className="min-h-0 flex-1 overflow-hidden">
        <ActivityFeed dense />
      </div>
    </div>
  );
}
