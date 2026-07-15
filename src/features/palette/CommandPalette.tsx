import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Command } from "cmdk";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BellRing,
  Boxes,
  Columns3,
  GitCompareArrows,
  LayoutGrid,
  Moon,
  PanelLeft,
  Search,
  Settings2,
  Share2,
  Sun,
  Table2,
  Waypoints,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { service } from "@/lib/mock/service";
import { useCatalogSearch } from "@/features/search/useCatalogSearch";
import { TypeIcon } from "@/components/ext/TypeBadge";
import { StatusDot } from "@/components/ext/StatusDot";
import { Kbd } from "@/components/ext/Kbd";

const navActions = [
  { id: "/", label: "Go to Lineage graph", icon: Share2 },
  { id: "/datasets", label: "Go to Datasets", icon: Table2 },
  { id: "/schema", label: "Go to Schema Explorer", icon: Columns3 },
  { id: "/column-lineage", label: "Go to Column Lineage", icon: Waypoints },
  { id: "/pipelines", label: "Go to Pipelines", icon: Boxes },
  { id: "/quality", label: "Go to Data Quality", icon: BarChart3 },
  { id: "/alerts", label: "Go to Alerts", icon: BellRing },
  { id: "/activity", label: "Go to Activity", icon: Activity },
  { id: "/versions", label: "Go to Version History", icon: GitCompareArrows },
  { id: "/settings", label: "Go to Settings", icon: Settings2 },
];

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, selectNode, theme, setTheme, toggleSideNav } = useAppStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const { data: all = [] } = useQuery({
    queryKey: ["catalog", "all"],
    queryFn: () => service.listAll(),
  });

  const search = useCatalogSearch(all);
  const results = useMemo(() => search(q), [search, q]);
  const recent = useMemo(() => all.slice(0, 5), [all]);

  useEffect(() => {
    if (!paletteOpen) setQ("");
  }, [paletteOpen]);

  const jump = (nodeId: string) => {
    selectNode(nodeId);
    const n = all.find((x) => x.id === nodeId);
    if (n && (n.type === "dataset" || n.type === "transformation")) {
      navigate(`/datasets/${nodeId}`);
    } else {
      navigate("/");
    }
    setPaletteOpen(false);
  };

  if (!paletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh] animate-fade-in"
      onClick={() => setPaletteOpen(false)}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" aria-hidden />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-panel border border-border-strong bg-popover shadow-card-lg animate-slide-up"
      >
        <Command loop>
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search size={14} className="text-muted-foreground" />
            <Command.Input
              value={q}
              onValueChange={setQ}
              autoFocus
              placeholder="Search datasets, jump to a page, run an action…"
              className="h-11 flex-1 bg-transparent text-[13.5px] text-foreground outline-none placeholder:text-subtle-foreground"
            />
            <Kbd>Esc</Kbd>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-1.5">
            <Command.Empty className="p-6 text-center text-[12.5px] text-muted-foreground">
              No results. Try a dataset name, pipeline, or tag.
            </Command.Empty>

            {results.length > 0 && (
              <Command.Group
                heading="Search results"
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-subtle-foreground"
              >
                {results.map((r) => (
                  <Command.Item
                    key={r.id}
                    value={`${r.name} ${r.fullyQualifiedName} ${r.tags.join(" ")}`}
                    onSelect={() => jump(r.id)}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-[13px] aria-selected:bg-surface-2"
                  >
                    <TypeIcon type={r.type} size={13} className="text-muted-foreground" />
                    <StatusDot status={r.status} />
                    <span className="min-w-0 flex-1 truncate font-mono">{r.name}</span>
                    <span className="truncate text-[10.5px] text-muted-foreground">
                      {r.fullyQualifiedName}
                    </span>
                    <ArrowRight size={12} className="text-subtle-foreground" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {q.length === 0 && (
              <>
                <Command.Group
                  heading="Recent"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-subtle-foreground"
                >
                  {recent.map((r) => (
                    <Command.Item
                      key={r.id}
                      value={`recent ${r.name}`}
                      onSelect={() => jump(r.id)}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-[13px] aria-selected:bg-surface-2"
                    >
                      <TypeIcon type={r.type} size={13} className="text-muted-foreground" />
                      <span className="min-w-0 flex-1 truncate font-mono">{r.name}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="Navigation"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-subtle-foreground"
                >
                  {navActions.map((a) => {
                    const Icon = a.icon;
                    return (
                      <Command.Item
                        key={a.id}
                        value={`nav ${a.label}`}
                        onSelect={() => {
                          navigate(a.id);
                          setPaletteOpen(false);
                        }}
                        className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-[13px] aria-selected:bg-surface-2"
                      >
                        <Icon size={13} className="text-muted-foreground" />
                        <span>{a.label}</span>
                      </Command.Item>
                    );
                  })}
                </Command.Group>

                <Command.Group
                  heading="Actions"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-subtle-foreground"
                >
                  <Command.Item
                    onSelect={() => {
                      setTheme(theme === "dark" ? "light" : "dark");
                      setPaletteOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-[13px] aria-selected:bg-surface-2"
                  >
                    {theme === "dark" ? (
                      <Sun size={13} className="text-muted-foreground" />
                    ) : (
                      <Moon size={13} className="text-muted-foreground" />
                    )}
                    Toggle theme
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      toggleSideNav();
                      setPaletteOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-[13px] aria-selected:bg-surface-2"
                  >
                    <PanelLeft size={13} className="text-muted-foreground" />
                    Toggle sidebar
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      navigate("/");
                      setPaletteOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-[13px] aria-selected:bg-surface-2"
                  >
                    <LayoutGrid size={13} className="text-muted-foreground" />
                    Focus lineage canvas
                  </Command.Item>
                </Command.Group>
              </>
            )}
          </Command.List>

          <div className="flex items-center justify-between gap-2 border-t border-border bg-surface-2 px-3 py-2 text-[10.5px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span>navigate</span>
              <Kbd>↵</Kbd>
              <span>select</span>
            </div>
            <div>RaadRaac · v0.1</div>
          </div>
        </Command>
      </div>
    </div>
  );
}
