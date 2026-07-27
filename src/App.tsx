import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Categories from "@/pages/Categories";
import ChartDetail from "@/pages/ChartDetail";
import Compare from "@/pages/Compare";
import Chooser from "@/pages/Chooser";
import Playground from "@/pages/Playground";
import Python from "@/pages/Python";
import Resources from "@/pages/Resources";
import Muuji from "@/pages/Muuji";
import About from "@/pages/About";
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
              <Route path="categories" element={<Categories />} />
              <Route path="chart/:slug" element={<ChartDetail />} />
              <Route path="compare" element={<Compare />} />
              <Route path="chooser" element={<Chooser />} />
              <Route path="playground" element={<Playground />} />
              <Route path="python" element={<Python />} />
              <Route path="resources" element={<Resources />} />
              <Route path="muuji" element={<Muuji />} />
              <Route path="about" element={<About />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
