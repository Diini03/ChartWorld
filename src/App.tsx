import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "@/app/shell/AppShell";
import { LineageWorkspace } from "@/features/lineage/LineageWorkspace";
import { DatasetsIndex } from "@/features/datasets/DatasetsIndex";
import { ActivityPage } from "@/features/activity/ActivityPage";
import { SchemaExplorer } from "@/features/schema/SchemaExplorer";
import { ColumnLineage } from "@/features/columnLineage/ColumnLineage";
import { PipelinesPage } from "@/features/pipelines/PipelinesPage";
import { QualityPage } from "@/features/quality/QualityPage";
import { AlertsPage } from "@/features/alerts/AlertsPage";
import { VersionsPage } from "@/features/versions/VersionsPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { NotFound } from "@/pages/NotFound";

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
              <Route path="schema" element={<SchemaExplorer />} />
              <Route path="column-lineage" element={<ColumnLineage />} />
              <Route path="pipelines" element={<PipelinesPage />} />
              <Route path="quality" element={<QualityPage />} />
              <Route path="alerts" element={<AlertsPage />} />
              <Route path="activity" element={<ActivityPage />} />
              <Route path="versions" element={<VersionsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
