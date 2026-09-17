import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FloatingNav } from "./FloatingNav";
import { Footer } from "./Footer";
import { SearchDialog } from "@/components/chart/SearchDialog";
import { ScrollProgress, BackToTop } from "./ScrollUtilities";
import { ShortcutsDialog } from "./ShortcutsDialog";
import { useReveal } from "@/hooks/use-reveal";

export function SiteLayout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useReveal([pathname]);

  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <a
        href="#main"
        className="focus-ring sr-only left-4 top-4 z-[70] rounded-full bg-foreground px-4 py-2 text-sm text-background focus:not-sr-only focus:fixed"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <FloatingNav />
      <main id="main" key={pathname} className="page-enter flex-1 pt-24">
        <Outlet />
      </main>
      <Footer />
      <SearchDialog />
      <ShortcutsDialog />
      <BackToTop />
    </div>
  );
}

