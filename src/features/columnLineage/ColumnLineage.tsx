import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactFlow, { Background, BackgroundVariant, ReactFlowProvider, useReactFlow, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import { Waypoints } from "lucide-react";
import { PanelHeader } from "@/components/ext/Panel";
import { EmptyState } from "@/components/ext/EmptyState";
import { service } from "@/lib/mock/service";
import { CatalogFlowNode } from "@/features/lineage/CatalogFlowNode";
import { useEffect } from "react";

const nodeTypes = { catalog: CatalogFlowNode };

function Inner() {
  const { data } = useQuery({ queryKey: ["graph"], queryFn: () => service.graph() });
  const datasetsWithCols = useMemo(
    () => (data?.nodes ?? []).filter((n) => n.columns && n.columns.length > 0),
    [data]
  );
  const [datasetId, setDatasetId] = useState<string>("");
  const [column, setColumn] = useState<string>("");

  const dataset = datasetsWithCols.find((d) => d.id === datasetId);
  const columns = dataset?.columns ?? [];

  useEffect(() => {
    if (!datasetId && datasetsWithCols.length > 0) setDatasetId(datasetsWithCols[0].id);
  }, [datasetsWithCols, datasetId]);
  useEffect(() => {
    if (columns.length > 0 && !columns.find((c) => c.name === column)) setColumn(columns[0].name);
  }, [columns, column]);

  const { nodes, edges } = useMemo(() => {
    if (!data || !dataset) return { nodes: [] as Node[], edges: [] as Edge[] };
    // Walk upstream through pipelines/transformations that touch this dataset
    const keep = new Set<string>([dataset.id]);
    const queue = [dataset.id];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const e of data.edges) {
        if (e.target === cur && !keep.has(e.source)) {
          keep.add(e.source);
          queue.push(e.source);
        }
      }
    }
    // Also 1 hop downstream
    for (const e of data.edges) if (e.source === dataset.id) keep.add(e.target);

    const layers = new Map<string, number>();
    const visit = (id: string, depth: number) => {
      layers.set(id, Math.max(layers.get(id) ?? 0, depth));
      for (const e of data.edges) if (e.target === id && keep.has(e.source)) visit(e.source, depth + 1);
    };
    visit(dataset.id, 0);

    const perLayer = new Map<number, string[]>();
    keep.forEach((id) => {
      const l = layers.get(id) ?? 0;
      if (!perLayer.has(l)) perLayer.set(l, []);
      perLayer.get(l)!.push(id);
    });

    const positions = new Map<string, { x: number; y: number }>();
    perLayer.forEach((ids, layer) => {
      ids.forEach((id, i) => positions.set(id, { x: -layer * 300, y: i * 120 - ((ids.length - 1) * 120) / 2 }));
    });

    const rfNodes: Node[] = Array.from(keep).map((id) => {
      const n = data.nodes.find((x) => x.id === id)!;
      return {
        id,
        position: positions.get(id) ?? { x: 0, y: 0 },
        type: "catalog",
        data: { node: n, isSelected: id === dataset.id, isDimmed: false, isUpstream: id !== dataset.id, isDownstream: false },
      };
    });
    const rfEdges: Edge[] = data.edges
      .filter((e) => keep.has(e.source) && keep.has(e.target))
      .map((e) => ({ id: e.id, source: e.source, target: e.target, type: "smoothstep", className: "upstream", label: column, labelStyle: { fill: "hsl(var(--muted-foreground))", fontSize: 10, fontFamily: "JetBrains Mono" } }));
    return { nodes: rfNodes, edges: rfEdges };
  }, [data, dataset, column]);

  const rf = useReactFlow();
  useEffect(() => {
    if (nodes.length) setTimeout(() => rf.fitView({ padding: 0.25, duration: 250 }), 30);
  }, [nodes.length, rf]);

  return (
    <div className="flex h-full min-w-0 flex-col bg-background">
      <PanelHeader
        title={
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
            <Waypoints size={14} className="text-muted-foreground" /> Column Lineage
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <select
              value={datasetId}
              onChange={(e) => setDatasetId(e.target.value)}
              className="h-7 rounded-md border border-border bg-surface px-2 text-[12px] focus-ring"
            >
              {datasetsWithCols.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <select
              value={column}
              onChange={(e) => setColumn(e.target.value)}
              className="h-7 rounded-md border border-border bg-surface px-2 font-mono text-[12px] focus-ring"
            >
              {columns.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        }
      />
      <div className="min-h-0 flex-1">
        {nodes.length === 0 ? (
          <EmptyState icon={Waypoints} title="Pick a dataset and column" description="Column lineage traces how a single field flows upstream through transformations." />
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            proOptions={{ hideAttribution: true }}
            minZoom={0.2}
            maxZoom={2}
            nodesDraggable
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--border-strong))" />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}

export function ColumnLineage() {
  return (
    <ReactFlowProvider>
      <Inner />
    </ReactFlowProvider>
  );
}
