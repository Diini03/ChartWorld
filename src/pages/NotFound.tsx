import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { PanelHeader } from "@/components/ext/Panel";
import { EmptyState } from "@/components/ext/EmptyState";

export function NotFound() {
  return (
    <div className="flex h-full min-w-0 flex-col bg-background">
      <PanelHeader
        title={
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
            <Compass size={14} className="text-muted-foreground" /> Not found
          </span>
        }
      />
      <div className="min-h-0 flex-1">
        <EmptyState
          icon={Compass}
          title="This route doesn't exist in the workspace"
          description="Try the sidebar, or open the command palette with ⌘K to jump to any module."
          action={
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-[12.5px] text-foreground hover:bg-surface-2 focus-ring"
            >
              Back to lineage
            </Link>
          }
        />
      </div>
    </div>
  );
}

export default NotFound;
