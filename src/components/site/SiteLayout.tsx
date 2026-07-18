import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useUI } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/features", label: "Features" },
  { to: "/solutions", label: "Solutions" },
  { to: "/docs", label: "Docs" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
];

export function SiteLayout() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useUI();
  const { session } = useAuth();

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-display text-xl font-semibold tracking-tight">RaadRaac</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground focus-ring"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {session ? (
              <Button asChild size="sm"><Link to="/app">Open workspace</Link></Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign in</Link></Button>
                <Button asChild size="sm"><Link to="/auth?mode=signup">Get started</Link></Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/60 bg-surface-2/40">
        <div className="container grid gap-10 py-14 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-display text-lg font-semibold">RaadRaac</span>
            </div>
            <p className="text-sm text-muted-foreground">Manage every dataset in one place.</p>
          </div>
          <FooterCol title="Product" links={[
            ["/features", "Features"], ["/solutions", "Solutions"], ["/pricing", "Pricing"], ["/docs", "Docs"],
          ]} />
          <FooterCol title="Ecosystem" links={[
            ["/", "RaadRaac — Manage"], ["/", "NadiifiData — Clean"], ["/", "XogArag — Report"],
          ]} />
          <FooterCol title="Company" links={[
            ["/about", "About"], ["/contact", "Contact"], ["/auth", "Sign in"],
          ]} />
        </div>
        <div className="border-t border-border/60">
          <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground md:flex-row">
            <p>© {new Date().getFullYear()} RaadRaac. All rights reserved.</p>
            <p className="font-mono">Part of the modern data workflow.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{title}</p>
      <ul className="space-y-2">
        {links.map(([to, label]) => (
          <li key={label}>
            <Link to={to} className="text-sm text-foreground/80 hover:text-foreground">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft ${className}`}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="3" rx="1" fill="currentColor" opacity="0.9"/>
        <rect x="2" y="7" width="8" height="3" rx="1" fill="currentColor" opacity="0.7"/>
        <rect x="2" y="11" width="10" height="2" rx="1" fill="currentColor" opacity="0.5"/>
      </svg>
    </span>
  );
}
