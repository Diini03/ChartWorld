import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FloatingNav } from "./FloatingNav";
import { Footer } from "./Footer";
import { SearchDialog } from "@/components/chart/SearchDialog";

export function SiteLayout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <FloatingNav />
      <main className="flex-1 pt-24">
        <Outlet />
      </main>
      <Footer />
      <SearchDialog />
    </div>
  );
}
