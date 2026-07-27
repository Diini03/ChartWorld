import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, Moon, Sun, Menu, X } from "lucide-react";
import { useUI } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { to: "/explore", label: "Explore" },
  { to: "/categories", label: "Categories" },
  { to: "/compare", label: "Compare" },
  { to: "/chooser", label: "Choose" },
  { to: "/playground", label: "Playground" },
  { to: "/python", label: "Python" },
  { to: "/resources", label: "Resources" },
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
          "fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-500",
          scrolled ? "top-3" : "top-6",
        )}
      >
        <nav className="glass flex items-center gap-1 rounded-full px-2 py-1.5 shadow-md">
          <Link to="/" className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold">
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
            className="flex h-9 items-center gap-2 rounded-full bg-surface-2 px-3 text-sm text-muted-foreground hover:text-foreground focus-ring"
            aria-label="Search"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] sm:inline">⌘K</kbd>
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground focus-ring"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground focus-ring md:hidden"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </nav>
      </div>

      {mobileOpen && (
        <div className="fixed inset-x-4 top-20 z-40 rounded-2xl border border-border bg-popover p-2 shadow-lg md:hidden animate-in fade-in slide-in-from-top-2">
          <ul>
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive ? "bg-foreground/10" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                    )
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
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
