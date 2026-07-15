import { useAppStore } from "@/lib/store";
import { PanelHeader } from "@/components/ext/Panel";
import { EmptyState } from "@/components/ext/EmptyState";
import { MousePointerClick, X } from "lucide-react";
import { DatasetInspector } from "@/features/datasets/DatasetInspector";

export function Inspector() {
  const { selectedNodeId, selectNode } = useAppStore();

  return (
    <div className="flex h-full min-w-0 flex-col border-l border-border bg-surface">
      <PanelHeader
        title={<span className="uppercase tracking-wider text-[11px] text-muted-foreground">Inspector</span>}
        actions={
          selectedNodeId && (
            <button
              onClick={() => selectNode(null)}
              aria-label="Close inspector selection"
              className="rounded p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground focus-ring"
            >
              <X size={13} />
            </button>
          )
        }
      />
      <div className="min-h-0 flex-1 overflow-hidden">
        {selectedNodeId ? (
          <DatasetInspector nodeId={selectedNodeId} />
        ) : (
          <EmptyState
            icon={MousePointerClick}
            title="Nothing selected"
            description="Select any node in the lineage graph or any row in the datasets table to see its details, schema, dependencies and quality history here."
          />
        )}
      </div>
    </div>
  );
}
