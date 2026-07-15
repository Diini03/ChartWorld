import { NavLink } from "react-router-dom";
import {
  Activity,
  BarChart3,
  BellRing,
  Boxes,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  GitCompareArrows,
  Settings2,
  Share2,
  Table2,
  Waypoints,
  Circle,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { service } from "@/lib/mock/service";
import { UserAvatar } from "@/components/ext/UserAvatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const nav = [
  { to: "/", label: "Lineage", icon: Share2, end: true },
  { to: "/datasets", label: "Datasets", icon: Table2 },
  { to: "/schema", label: "Schema Explorer", icon: Columns3 },
  { to: "/column-lineage", label: "Column Lineage", icon: Waypoints },
  { to: "/pipelines", label: "Pipelines", icon: Boxes },
  { to: "/quality", label: "Data Quality", icon: BarChart3 },
  { to: "/alerts", label: "Alerts", icon: BellRing },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/versions", label: "Version History", icon: GitCompareArrows },
  { to: "/settings", label: "Settings", icon: Settings2 },
];

export function SideNav() {
  const { sideNavCollapsed, toggleSideNav } = useAppStore();
  const user = service.currentUser();

  return (
    <div className="flex h-full min-w-0 flex-col border-r border-border bg-surface">
      {/* workspace header */}
      <div
        className={cn(
          "flex h-11 shrink-0 items-center gap-2 border-b border-border px-2.5",
          sideNavCollapsed && "justify-center px-0"
        )}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Circle size={12} className="fill-current" />
        </div>
        {!sideNavCollapsed && (
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold leading-tight">RaadRaac</div>
            <div className="truncate text-[10.5px] leading-tight text-muted-foreground">
              analytics-workspace
            </div>
          </div>
        )}
        {!sideNavCollapsed && (
          <button
            onClick={toggleSideNav}
            aria-label="Collapse sidebar"
            className="rounded p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground focus-ring"
          >
            <ChevronsLeft size={14} />
          </button>
        )}
      </div>

      {/* nav list */}
      <nav className="flex-1 overflow-y-auto px-1.5 py-2">
        {!sideNavCollapsed && (
          <div className="mb-1.5 px-2 pt-1 font-mono text-[10px] uppercase tracking-wider text-subtle-foreground">
            Workspace
          </div>
        )}
        <ul className="space-y-0.5">
          {nav.map((item) => {
            const Icon = item.icon;
            const link = (
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground focus-ring",
                    isActive && "bg-surface-2 text-foreground",
                    sideNavCollapsed && "justify-center px-0"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={15}
                      strokeWidth={1.75}
                      className={cn("shrink-0", isActive ? "text-primary" : "")}
                    />
                    {!sideNavCollapsed && <span className="truncate">{item.label}</span>}
                  </>
                )}
              </NavLink>
            );

            return (
              <li key={item.to}>
                {sideNavCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  link
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* footer */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 border-t border-border p-2",
          sideNavCollapsed && "flex-col gap-2"
        )}
      >
        {sideNavCollapsed && (
          <button
            onClick={toggleSideNav}
            aria-label="Expand sidebar"
            className="rounded p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground focus-ring"
          >
            <ChevronsRight size={14} />
          </button>
        )}
        <UserAvatar userId={user.id} size={24} />
        {!sideNavCollapsed && (
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-medium leading-tight">{user.name}</div>
            <div className="truncate text-[10.5px] leading-tight text-muted-foreground">
              @{user.handle}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
