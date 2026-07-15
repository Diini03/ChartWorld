import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { service } from "@/lib/mock/service";
import { useAppStore } from "@/lib/store";
import { TypeBadge } from "@/components/ext/TypeBadge";
import { StatusDot } from "@/components/ext/StatusDot";
import { QualityBar } from "@/components/ext/QualityBar";
import { TagChip } from "@/components/ext/TagChip";
import { UserAvatar } from "@/components/ext/UserAvatar";
import { formatBytes, formatMinutes, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PanelHeader } from "@/components/ext/Panel";
import { Search, Table2 } from "lucide-react";

const COL = "grid-cols-[1.6fr_0.7fr_0.6fr_0.7fr_0.7fr_0.9fr_1fr_0.7fr]";

export function DatasetsIndex() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectNode, selectedNodeId } = useAppStore();
  const { data = [] } = useQuery({ queryKey: ["catalog", "all"], queryFn: () => service.listAll() });
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const list = data.filter((n) => n.type === "dataset" || n.type === "transformation");
    if (!q) return list;
    const needle = q.toLowerCase();
    return list.filter(
      (n) =>
        n.name.toLowerCase().includes(needle) ||
        n.fullyQualifiedName.toLowerCase().includes(needle) ||
        n.tags.some((t) => t.toLowerCase().includes(needle))
    );
  }, [data, q]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 40,
    overscan: 12,
  });

  // if route has an id, select it
  useEffect(() => {
    if (id) selectNode(id);
  }, [id, selectNode]);

  // keyboard nav
  const [cursor, setCursor] = useState(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(rows.length - 1, c + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(0, c - 1));
      } else if (e.key === "Enter") {
        const row = rows[cursor];
        if (row) {
          selectNode(row.id);
          navigate(`/datasets/${row.id}`);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cursor, rows, navigate, selectNode]);

  useEffect(() => {
    rowVirtualizer.scrollToIndex(cursor, { align: "auto" });
  }, [cursor, rowVirtualizer]);

  return (
    <div className="flex h-full min-w-0 flex-col bg-background">
      <PanelHeader
        title={
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
            <Table2 size={14} className="text-muted-foreground" /> Datasets
            <span className="ml-1 font-mono text-[11px] text-muted-foreground">{rows.length}</span>
          </span>
        }
        actions={
          <div className="relative">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-subtle-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter by name, path, tag…"
              className="h-7 w-[260px] rounded-md border border-border bg-surface pl-7 pr-2 text-[12.5px] outline-none placeholder:text-subtle-foreground focus-ring"
            />
          </div>
        }
      />

      {/* header row */}
      <div
        className={cn(
          "grid shrink-0 items-center gap-3 border-b border-border bg-surface-2 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground",
          COL
        )}
      >
        <div>Name</div>
        <div>Type</div>
        <div className="text-right">Rows</div>
        <div className="text-right">Size</div>
        <div>Freshness</div>
        <div>Quality</div>
        <div>Tags</div>
        <div>Owner</div>
      </div>

      {/* rows */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto">
        {rows.length === 0 ? (
          <div className="flex h-full items-center justify-center text-[13px] text-muted-foreground">
            No datasets match “{q}”.
          </div>
        ) : (
          <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
            {rowVirtualizer.getVirtualItems().map((vRow) => {
              const row = rows[vRow.index];
              const active = row.id === selectedNodeId;
              const isCursor = vRow.index === cursor;
              return (
                <button
                  key={row.id}
                  onClick={() => {
                    setCursor(vRow.index);
                    selectNode(row.id);
                    navigate(`/datasets/${row.id}`);
                  }}
                  className={cn(
                    "grid w-full items-center gap-3 border-b border-border/60 px-4 text-left text-[12.5px] transition-colors hover:bg-surface-2 focus-ring",
                    COL,
                    active && "bg-primary/10",
                    isCursor && !active && "bg-surface-2"
                  )}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${vRow.size}px`,
                    transform: `translateY(${vRow.start}px)`,
                  }}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <StatusDot status={row.status} />
                    <div className="min-w-0">
                      <div className="truncate font-mono text-[12.5px] font-medium text-foreground">
                        {row.name}
                      </div>
                      <div className="truncate text-[10.5px] text-muted-foreground">
                        {row.fullyQualifiedName}
                      </div>
                    </div>
                  </div>
                  <TypeBadge type={row.type} />
                  <div className="text-right font-mono text-[11.5px] text-muted-foreground">
                    {formatNumber(row.rowCount)}
                  </div>
                  <div className="text-right font-mono text-[11.5px] text-muted-foreground">
                    {formatBytes(row.sizeBytes)}
                  </div>
                  <div className="font-mono text-[11.5px] text-muted-foreground">
                    {formatMinutes(row.freshnessMinutes)}
                  </div>
                  <div>
                    <QualityBar value={row.qualityScore} />
                  </div>
                  <div className="flex min-w-0 flex-wrap gap-1 overflow-hidden">
                    {row.tags.slice(0, 3).map((t) => (
                      <TagChip key={t} label={t} />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UserAvatar userId={row.owner} size={18} />
                    <span className="truncate text-[11.5px] text-muted-foreground">
                      {service.userById(row.owner)?.handle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
