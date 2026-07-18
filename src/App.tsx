import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AppLayout } from "@/components/app/AppLayout";
import Home from "@/pages/marketing/Home";
import Features from "@/pages/marketing/Features";
import Solutions from "@/pages/marketing/Solutions";
import Docs from "@/pages/marketing/Docs";
import Pricing from "@/pages/marketing/Pricing";
import About from "@/pages/marketing/About";
import Contact from "@/pages/marketing/Contact";
import Auth from "@/pages/auth/Auth";
import ResetPassword from "@/pages/auth/ResetPassword";
import Library from "@/pages/app/Library";
import DatasetProfile from "@/pages/app/DatasetProfile";
import CollectionView from "@/pages/app/CollectionView";
import Settings from "@/pages/app/Settings";
import { NotFound } from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

function Protected() {
  const { session, loading } = useAuth();
  if (loading) return <div className="flex h-dvh items-center justify-center text-muted-foreground">Loading…</div>;
  if (!session) return <Navigate to="/auth" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        <Toaster />
        <Sonner position="bottom-right" closeButton />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route index element={<Home />} />
                <Route path="features" element={<Features />} />
                <Route path="solutions" element={<Solutions />} />
                <Route path="docs" element={<Docs />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
              </Route>

              <Route path="auth" element={<Auth />} />
              <Route path="reset-password" element={<ResetPassword />} />

              <Route path="app" element={<Protected />}>
                <Route element={<AppLayout />}>
                  <Route index element={<Library />} />
                  <Route path="collections/:id" element={<CollectionView />} />
                  <Route path="datasets/:id" element={<DatasetProfile />} />
                  <Route path="favorites" element={<Library />} />
                  <Route path="recent" element={<Library />} />
                  <Route path="archive" element={<Library />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
