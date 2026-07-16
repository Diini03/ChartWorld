import { Outlet } from "react-router-dom";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useAppStore } from "@/lib/store";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";
import { Inspector } from "./Inspector";
import { ActivityDrawer } from "./ActivityDrawer";
import { CommandPalette } from "@/features/palette/CommandPalette";

export function AppShell() {
  const {
    sideNavSize,
    inspectorSize,
    activitySize,
    inspectorOpen,
    activityOpen,
    sideNavCollapsed,
    setPanelSizes,
    setPaletteOpen,
    toggleSideNav,
    toggleInspector,
    toggleActivity,
  } = useAppStore();

  useHotkeys({
    "mod+k": () => setPaletteOpen(true),
    "mod+b": () => toggleSideNav(),
    "mod+i": () => toggleInspector(),
    "mod+j": () => toggleActivity(),
  });

  const navSize = sideNavCollapsed ? 3.5 : sideNavSize;

  return (
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-background text-foreground">
      <TopBar />

      <div className="min-h-0 flex-1">
        <PanelGroup
          direction="vertical"
          autoSaveId="raadraac-v-layout"
          className="h-full"
        >
          <Panel defaultSize={100 - activitySize} minSize={40}>
            <PanelGroup
              direction="horizontal"
              autoSaveId="raadraac-h-layout"
              className="h-full"
            >
              <Panel
                defaultSize={navSize}
                minSize={3.5}
                maxSize={30}
                onResize={(size) => !sideNavCollapsed && setPanelSizes({ sideNavSize: size })}
              >
                <SideNav />
              </Panel>

              <PanelResizeHandle className="w-px bg-border transition-colors data-[resize-handle-state=hover]:bg-accent data-[resize-handle-state=drag]:bg-accent" />

              <Panel minSize={30}>
                <main className="relative h-full min-w-0 bg-background">
                  <Outlet />
                </main>
              </Panel>

              {inspectorOpen && (
                <>
                  <PanelResizeHandle className="w-px bg-border transition-colors data-[resize-handle-state=hover]:bg-accent data-[resize-handle-state=drag]:bg-accent" />
                  <Panel
                    defaultSize={inspectorSize}
                    minSize={18}
                    maxSize={45}
                    onResize={(size) => setPanelSizes({ inspectorSize: size })}
                  >
                    <Inspector />
                  </Panel>
                </>
              )}
            </PanelGroup>
          </Panel>

          {activityOpen && (
            <>
              <PanelResizeHandle className="h-px bg-border transition-colors data-[resize-handle-state=hover]:bg-accent data-[resize-handle-state=drag]:bg-accent" />
              <Panel
                defaultSize={activitySize}
                minSize={12}
                maxSize={50}
                onResize={(size) => setPanelSizes({ activitySize: size })}
              >
                <ActivityDrawer />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>

      <CommandPalette />
    </div>
  );
}
