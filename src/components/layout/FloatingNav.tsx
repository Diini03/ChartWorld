import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, Moon, Sun, Menu } from "lucide-react";
import { useUI } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

const links = [
  { to: "/explore", label: "Explore" },
  { to: "/categories", label: "Categories" },
  { to: "/playground", label: "Playground" },
  { to: "/muuji", label: "Muuji" },
];

export function FloatingNav() {
  const { theme, toggleTheme, setSearchOpen } = useUI();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 z-50 transition-all duration-500",
          scrolled ? "top-3" : "top-6",
        )}
      >
        <div className="container flex justify-center">
          <nav className="glass flex max-w-full items-center gap-1 overflow-hidden rounded-full px-2 py-1.5 shadow-md">
            <Link to="/" className="flex shrink-0 items-center gap-2 rounded-full px-2 py-1.5 text-sm font-semibold sm:px-3">
              <Logo />
              <span className="hidden font-display text-base sm:inline">ChartWorld</span>
            </Link>
            <div className="mx-1 hidden h-6 w-px bg-border md:block" />
            <ul className="hidden items-center md:flex">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      cn(
                        "rounded-full px-3 py-1.5 text-sm transition-colors",
                        isActive ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                      )
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mx-1 hidden h-6 w-px bg-border md:block" />
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-surface-2 px-3 text-sm text-muted-foreground hover:text-foreground focus-ring"
              aria-label="Search"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] md:inline">⌘K</kbd>
            </button>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground focus-ring"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground focus-ring md:hidden"
            >
              <Menu size={16} />
            </button>
          </nav>
        </div>
      </div>

      <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
        <DrawerContent className="md:hidden">
          <DrawerHeader className="pb-2 text-left">
            <DrawerTitle className="font-display text-xl">ChartWorld</DrawerTitle>
          </DrawerHeader>
          <nav className="px-4 pb-8">
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.to}>
                  <DrawerClose asChild>
                    <NavLink
                      to={l.to}
                      className={({ isActive }) =>
                        cn(
                          "block rounded-xl px-4 py-3 text-base transition-colors",
                          isActive ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                        )
                      }
                    >
                      {l.label}
                    </NavLink>
                  </DrawerClose>
                </li>
              ))}
            </ul>
            <DrawerClose asChild>
              <button
                onClick={() => setTimeout(() => setSearchOpen(true), 250)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background"
              >
                <Search size={14} /> Search charts
              </button>
            </DrawerClose>
          </nav>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--chart-1))] via-[hsl(var(--chart-3))] to-[hsl(var(--chart-2))] text-white shadow-md", className)}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="8" width="2.5" height="6" rx="0.5" fill="currentColor" />
        <rect x="6.75" y="4" width="2.5" height="10" rx="0.5" fill="currentColor" opacity="0.8" />
        <rect x="11.5" y="6" width="2.5" height="8" rx="0.5" fill="currentColor" opacity="0.6" />
      </svg>
    </span>
  );
}
