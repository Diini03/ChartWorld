import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { service } from "@/lib/mock/service";
import { useAppStore } from "@/lib/store";
import { CatalogFlowNode } from "./CatalogFlowNode";
import { useLineageGraph } from "./useLineageGraph";
import type { NodeType } from "@/lib/mock/types";
import { typeMeta } from "@/components/ext/TypeBadge";
import { AlertTriangle, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const nodeTypes = { catalog: CatalogFlowNode };

function LineageInner() {
  const { data } = useQuery({ queryKey: ["graph"], queryFn: () => service.graph() });
  const { selectedNodeId, selectNode } = useAppStore();
  const [typeFilters, setTypeFilters] = useState<Set<NodeType>>(new Set());
  const [failingOnly, setFailingOnly] = useState(false);

  const filters = useMemo(
    () => ({ types: typeFilters, showFailingOnly: failingOnly }),
    [typeFilters, failingOnly]
  );

  const { nodes, edges } = useLineageGraph(data, selectedNodeId, filters);
  const rf = useReactFlow();

  // fit view on first load
  useEffect(() => {
    if (nodes.length > 0) {
      // slight delay so nodes measure
      const t = setTimeout(() => rf.fitView({ padding: 0.25, duration: 250 }), 30);
      return () => clearTimeout(t);
    }
  }, [nodes.length, rf]);

  const toggleType = (t: NodeType) => {
    setTypeFilters((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const allTypes: NodeType[] = [
    "dataset",
    "transformation",
    "pipeline",
    "dashboard",
    "report",
    "api",
    "database",
    "storage",
  ];

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node: Node) => selectNode(node.id)}
        onPaneClick={() => selectNode(null)}
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{ type: "smoothstep" }}
        nodesDraggable
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="hsl(var(--border-strong))"
        />
        <Controls showInteractive={false} position="bottom-left" />
        <MiniMap
          pannable
          zoomable
          maskColor="hsl(var(--background) / 0.85)"
          nodeColor={(n) => {
            const type = (n.data as any)?.node?.type as NodeType | undefined;
            return type ? `hsl(var(--${typeMeta[type].token}))` : "hsl(var(--muted-foreground))";
          }}
        />
      </ReactFlow>

      {/* filter bar overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-1 rounded-md border border-border bg-surface/95 p-1 shadow-card-sm backdrop-blur">
          <div className="flex h-7 items-center gap-1 px-2 text-[11px] text-muted-foreground">
            <Filter size={12} /> Filter
          </div>
          <div className="h-4 w-px bg-border" />
          {allTypes.map((t) => {
            const active = typeFilters.has(t);
            const meta = typeMeta[t];
            const Icon = meta.icon;
            return (
              <button
                key={t}
                onClick={() => toggleType(t)}
                aria-pressed={active}
                title={meta.label}
                className={cn(
                  "flex h-7 items-center gap-1 rounded px-2 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground focus-ring",
                  active && "text-foreground"
                )}
                style={active ? { backgroundColor: `hsl(var(--${meta.token}) / 0.15)`, color: `hsl(var(--${meta.token}))` } : undefined}
              >
                <Icon size={11} />
                <span className="hidden md:inline">{meta.label}</span>
              </button>
            );
          })}
          <div className="h-4 w-px bg-border" />
          <button
            onClick={() => setFailingOnly((v) => !v)}
            aria-pressed={failingOnly}
            className={cn(
              "flex h-7 items-center gap-1 rounded px-2 text-[11px] text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground focus-ring",
              failingOnly && "bg-danger/15 text-danger"
            )}
          >
            <AlertTriangle size={12} />
            Only issues
          </button>
        </div>
      </div>
    </div>
  );
}

export function LineageWorkspace() {
  return (
    <ReactFlowProvider>
      <LineageInner />
    </ReactFlowProvider>
  );
}
