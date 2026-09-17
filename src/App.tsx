import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Create from "@/pages/Create";
import Categories from "@/pages/Categories";
import ChartDetail from "@/pages/ChartDetail";
import Compare from "@/pages/Compare";
import Chooser from "@/pages/Chooser";
import Playground from "@/pages/Playground";
import Python from "@/pages/Python";
import Resources from "@/pages/Resources";
import Connect from "@/pages/Connect";
import About from "@/pages/About";
import Quiz from "@/pages/Quiz";
import Surprise from "@/pages/Surprise";
import CheatSheet from "@/pages/CheatSheet";
import Saved from "@/pages/Saved";
import { NotFound } from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        <Toaster />
        <Sonner position="bottom-right" closeButton />
        <BrowserRouter>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="create" element={<Create />} />
              <Route path="categories" element={<Categories />} />
              <Route path="chart/:slug" element={<ChartDetail />} />
              <Route path="compare" element={<Compare />} />
              <Route path="chooser" element={<Chooser />} />
              <Route path="playground" element={<Playground />} />
              <Route path="python" element={<Python />} />
              <Route path="resources" element={<Resources />} />
              <Route path="connect" element={<Connect />} />
              <Route path="muuji" element={<Navigate to="/connect" replace />} />
              <Route path="about" element={<About />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="surprise" element={<Surprise />} />
              <Route path="cheatsheet" element={<CheatSheet />} />
              <Route path="saved" element={<Saved />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
