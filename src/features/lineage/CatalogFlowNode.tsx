import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { CatalogNode as CatalogNodeData } from "@/lib/mock/types";
import { typeMeta } from "@/components/ext/TypeBadge";
import { StatusDot } from "@/components/ext/StatusDot";
import { cn } from "@/lib/utils";

interface Data {
  node: CatalogNodeData;
  isSelected: boolean;
  isDimmed: boolean;
  isUpstream: boolean;
  isDownstream: boolean;
}

function CatalogFlowNodeBase({ data }: NodeProps<Data>) {
  const { node, isSelected, isDimmed, isUpstream, isDownstream } = data;
  const meta = typeMeta[node.type];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "group w-[220px] rounded-lg border bg-surface shadow-card-sm transition-all",
        isDimmed && "opacity-15",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        isUpstream && !isSelected && "ring-1 ring-primary/60",
        isDownstream && !isSelected && "ring-1 ring-warning/60"
      )}
      style={{
        borderColor: isSelected
          ? `hsl(var(--primary))`
          : `hsl(var(--${meta.token}) / 0.35)`,
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div
        className="flex items-center gap-2 rounded-t-lg px-2.5 py-1.5"
        style={{
          backgroundColor: `hsl(var(--${meta.token}) / 0.08)`,
          borderBottom: `1px solid hsl(var(--${meta.token}) / 0.2)`,
        }}
      >
        <Icon size={12} style={{ color: `hsl(var(--${meta.token}))` }} />
        <span
          className="flex-1 font-mono text-[10px] uppercase tracking-wider"
          style={{ color: `hsl(var(--${meta.token}))` }}
        >
          {meta.label}
        </span>
        <StatusDot status={node.status} />
      </div>
      <div className="px-2.5 py-2">
        <div className="truncate font-mono text-[12.5px] font-medium text-foreground">
          {node.name}
        </div>
        <div className="mt-0.5 truncate text-[10.5px] text-muted-foreground">
          {node.system} · {node.fullyQualifiedName.split(".").slice(0, -1).join(".") || node.system}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export const CatalogFlowNode = memo(CatalogFlowNodeBase);
