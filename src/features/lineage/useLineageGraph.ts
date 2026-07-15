import { useMemo } from "react";
import type { Edge, Node } from "reactflow";
import type { CatalogEdge, CatalogNode, Graph, NodeType } from "@/lib/mock/types";

/** Column index a node lives in, driven by its type + id-prefix heuristics. */
function layerOf(node: CatalogNode): number {
  const t: NodeType = node.type;
  if (t === "database" || t === "storage") return 0;
  if (t === "api" && node.id.startsWith("src_")) return 0;
  if (t === "pipeline" && node.id.startsWith("pl_ingest")) return 1;
  if (t === "dataset" && node.name.startsWith("raw.")) return 2;
  if (t === "transformation") return 3;
  if (t === "pipeline") return 3; // dbt / reconciliation pipelines
  if (t === "dataset") return 4;
  // consumers: dashboards, reports, downstream apis
  return 5;
}

const X_STEP = 300;
const Y_STEP = 130;

export function useLineageGraph(
  data: Graph | undefined,
  selectedId: string | null,
  filters: { types: Set<NodeType>; showFailingOnly: boolean }
) {
  return useMemo(() => {
    if (!data) return { nodes: [] as Node[], edges: [] as Edge[] };

    // 1. bucket by layer with a stable sort so layout is deterministic
    const bucketed = new Map<number, CatalogNode[]>();
    for (const n of data.nodes) {
      const l = layerOf(n);
      if (!bucketed.has(l)) bucketed.set(l, []);
      bucketed.get(l)!.push(n);
    }
    bucketed.forEach((arr) => arr.sort((a, b) => a.name.localeCompare(b.name)));

    // 2. compute (x, y) for each node
    const positions = new Map<string, { x: number; y: number }>();
    bucketed.forEach((arr, layer) => {
      const totalHeight = (arr.length - 1) * Y_STEP;
      arr.forEach((n, i) => {
        positions.set(n.id, {
          x: layer * X_STEP,
          y: i * Y_STEP - totalHeight / 2,
        });
      });
    });

    // 3. determine highlight sets from selection
    const upstream = new Set<string>();
    const downstream = new Set<string>();
    if (selectedId) {
      const walkUp = (id: string) => {
        for (const e of data.edges) {
          if (e.target === id && !upstream.has(e.source)) {
            upstream.add(e.source);
            walkUp(e.source);
          }
        }
      };
      const walkDown = (id: string) => {
        for (const e of data.edges) {
          if (e.source === id && !downstream.has(e.target)) {
            downstream.add(e.target);
            walkDown(e.target);
          }
        }
      };
      walkUp(selectedId);
      walkDown(selectedId);
    }

    // 4. filter visibility
    const isVisible = (n: CatalogNode) => {
      if (filters.types.size > 0 && !filters.types.has(n.type)) return false;
      if (filters.showFailingOnly && n.status === "ok") return false;
      return true;
    };

    // 5. produce react-flow nodes
    const rfNodes: Node[] = data.nodes.filter(isVisible).map((n) => {
      const pos = positions.get(n.id)!;
      const isSelected = n.id === selectedId;
      const isUp = upstream.has(n.id);
      const isDown = downstream.has(n.id);
      const isDimmed = Boolean(selectedId) && !isSelected && !isUp && !isDown;

      return {
        id: n.id,
        position: pos,
        type: "catalog",
        data: {
          node: n,
          isSelected,
          isDimmed,
          isUpstream: isUp,
          isDownstream: isDown,
        },
        draggable: true,
      };
    });

    // 6. produce edges w/ highlight classes
    const visibleIds = new Set(rfNodes.map((n) => n.id));
    const rfEdges: Edge[] = data.edges
      .filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target))
      .map((e: CatalogEdge) => {
        const bothUpstream = upstream.has(e.target) || e.target === selectedId;
        const sourceIsInChain = upstream.has(e.source) || e.source === selectedId;
        const isUpstreamEdge = sourceIsInChain && bothUpstream && selectedId !== null;
        const isDownstreamEdge =
          selectedId !== null &&
          (e.source === selectedId || downstream.has(e.source)) &&
          downstream.has(e.target);
        const isDimmed =
          selectedId !== null && !isUpstreamEdge && !isDownstreamEdge;

        return {
          id: e.id,
          source: e.source,
          target: e.target,
          type: "smoothstep",
          className: isUpstreamEdge
            ? "upstream"
            : isDownstreamEdge
              ? "downstream"
              : isDimmed
                ? "dimmed"
                : "",
        };
      });

    return { nodes: rfNodes, edges: rfEdges };
  }, [data, selectedId, filters]);
}
