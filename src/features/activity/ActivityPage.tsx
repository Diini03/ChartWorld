import { Activity } from "lucide-react";
import { PanelHeader } from "@/components/ext/Panel";
import { ActivityFeed } from "./ActivityFeed";

export function ActivityPage() {
  return (
    <div className="flex h-full min-w-0 flex-col bg-background">
      <PanelHeader
        title={
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
            <Activity size={14} className="text-muted-foreground" /> Activity
          </span>
        }
      />
      <div className="min-h-0 flex-1">
        <ActivityFeed />
      </div>
    </div>
  );
}
