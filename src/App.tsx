import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "@/app/shell/AppShell";
import { LineageWorkspace } from "@/features/lineage/LineageWorkspace";
import { DatasetsIndex } from "@/features/datasets/DatasetsIndex";
import { ActivityPage } from "@/features/activity/ActivityPage";
import { EmptyModule } from "@/pages/EmptyModule";
import { NotFound } from "@/pages/NotFound";
import {
  BarChart3,
  BellRing,
  Boxes,
  Columns3,
  FileClock,
  GitCompareArrows,
  Settings2,
  Waypoints,
} from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        <Toaster />
        <Sonner position="bottom-right" closeButton />
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<LineageWorkspace />} />
              <Route path="datasets" element={<DatasetsIndex />} />
              <Route path="datasets/:id" element={<DatasetsIndex />} />
              <Route path="activity" element={<ActivityPage />} />
              <Route
                path="schema"
                element={
                  <EmptyModule
                    icon={Columns3}
                    title="Schema Explorer"
                    description="Browse every table's schema, primary keys, and constraints in a searchable tree. Coming in the next iteration."
                  />
                }
              />
              <Route
                path="column-lineage"
                element={
                  <EmptyModule
                    icon={Waypoints}
                    title="Column Lineage"
                    description="Trace how a single column flows through transformations, from source to report. Coming in the next iteration."
                  />
                }
              />
              <Route
                path="pipelines"
                element={
                  <EmptyModule
                    icon={Boxes}
                    title="Pipeline Viewer"
                    description="Inspect DAG runs, task timings, and retries per pipeline. Coming in the next iteration."
                  />
                }
              />
              <Route
                path="quality"
                element={
                  <EmptyModule
                    icon={BarChart3}
                    title="Data Quality"
                    description="Configure freshness, completeness, and duplicate checks. Coming in the next iteration."
                  />
                }
              />
              <Route
                path="alerts"
                element={
                  <EmptyModule
                    icon={BellRing}
                    title="Alerts"
                    description="Wire quality failures into Slack, PagerDuty, or email. Coming in the next iteration."
                  />
                }
              />
              <Route
                path="versions"
                element={
                  <EmptyModule
                    icon={GitCompareArrows}
                    title="Version History"
                    description="Compare any two versions of a dataset and see added, removed, or retyped columns. Coming in the next iteration."
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <EmptyModule
                    icon={Settings2}
                    title="Settings"
                    description="Workspace preferences, integrations, and access controls. Coming in the next iteration."
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
