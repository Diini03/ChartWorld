import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Command, Moon, PanelBottom, PanelRight, Search, Sun } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Kbd } from "@/components/ext/Kbd";
import { cn } from "@/lib/utils";

const crumbLabel: Record<string, string> = {
  "": "Lineage",
  datasets: "Datasets",
  activity: "Activity",
  schema: "Schema Explorer",
  "column-lineage": "Column Lineage",
  pipelines: "Pipelines",
  quality: "Data Quality",
  alerts: "Alerts",
  versions: "Version History",
  settings: "Settings",
};

export function TopBar() {
  const { pathname } = useLocation();
  const { setPaletteOpen, theme, setTheme, toggleInspector, toggleActivity, inspectorOpen, activityOpen } =
    useAppStore();

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.length === 0 ? [""] : segments;

  return (
    <header className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-3">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5">
        <Link
          to="/"
          className="rounded px-1.5 py-0.5 text-[13px] text-muted-foreground hover:bg-surface-2 hover:text-foreground focus-ring"
        >
          analytics-workspace
        </Link>
        {crumbs.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-subtle-foreground" />
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[13px]",
                i === crumbs.length - 1 ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {crumbLabel[c] ?? c}
            </span>
          </div>
        ))}
      </nav>

      {/* command bar */}
      <button
        onClick={() => setPaletteOpen(true)}
        className="group flex h-7 w-[min(420px,50vw)] items-center gap-2 rounded-md border border-border bg-background/50 px-2.5 text-[12.5px] text-muted-foreground transition-colors hover:border-border-strong hover:bg-background focus-ring"
      >
        <Search size={13} strokeWidth={1.75} />
        <span className="flex-1 truncate text-left">
          Search datasets, pipelines, columns…
        </span>
        <span className="flex items-center gap-0.5">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      {/* right cluster */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={toggleActivity}
          aria-label="Toggle activity"
          aria-pressed={activityOpen}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground focus-ring",
            activityOpen && "bg-surface-2 text-foreground"
          )}
        >
          <PanelBottom size={14} strokeWidth={1.75} />
        </button>
        <button
          onClick={toggleInspector}
          aria-label="Toggle inspector"
          aria-pressed={inspectorOpen}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground focus-ring",
            inspectorOpen && "bg-surface-2 text-foreground"
          )}
        >
          <PanelRight size={14} strokeWidth={1.75} />
        </button>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground focus-ring"
        >
          {theme === "dark" ? <Sun size={14} strokeWidth={1.75} /> : <Moon size={14} strokeWidth={1.75} />}
        </button>
        <div className="ml-1 hidden items-center gap-1 rounded-md border border-border px-2 py-0.5 text-[10.5px] text-muted-foreground sm:flex">
          <Command size={10} /> palette
        </div>
      </div>
    </header>
  );
}
