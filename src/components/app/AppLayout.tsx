import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Database, Star, Clock, Archive, FolderTree, Settings as SettingsIcon,
  Search, Upload, LogOut, Moon, Sun, Plus,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useUI } from "@/lib/store";
import { Logo } from "@/components/site/SiteLayout";
import { UploadDialog } from "@/components/app/UploadDialog";
import { listCollections } from "@/lib/datasets";
import { useState } from "react";
import { CommandPalette } from "@/components/app/CommandPalette";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { to: "/app", label: "Library", icon: Database, end: true },
  { to: "/app/favorites", label: "Favorites", icon: Star },
  { to: "/app/recent", label: "Recent", icon: Clock },
  { to: "/app/archive", label: "Archive", icon: Archive },
];

export function AppLayout() {
  const { user, signOut } = useAuth();
  const nav2 = useNavigate();
  const { theme, toggleTheme, setPaletteOpen } = useUI();
  const [uploadOpen, setUploadOpen] = useState(false);

  const { data: collections = [] } = useQuery({ queryKey: ["collections"], queryFn: listCollections });

  return (
    <div className="grid min-h-dvh grid-cols-[240px_1fr] bg-background text-foreground">
      {/* Sidebar */}
      <aside className="flex h-dvh flex-col border-r border-border bg-sidebar">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <Logo />
          <span className="font-display text-lg font-semibold">RaadRaac</span>
        </div>

        <div className="p-3">
          <button
            onClick={() => setUploadOpen(true)}
            className="flex w-full items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.01] focus-ring"
          >
            <Upload size={14} /> Upload dataset
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          <ul className="space-y-0.5">
            {nav.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                    )
                  }
                >
                  <n.icon size={15} />
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between px-3 pb-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Collections</p>
            <button className="text-muted-foreground hover:text-foreground" title="New collection" aria-label="New collection">
              <Plus size={13} />
            </button>
          </div>
          <ul className="space-y-0.5">
            {collections.map((c) => (
              <li key={c.id}>
                <NavLink
                  to={`/app/collections/${c.id}`}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                    )
                  }
                >
                  <FolderTree size={14} />
                  <span className="truncate">{c.name}</span>
                </NavLink>
              </li>
            ))}
            {collections.length === 0 && (
              <li className="px-3 py-2 text-xs text-muted-foreground">No collections yet</li>
            )}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-sidebar-accent focus-ring">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {(user?.email?.[0] ?? "?").toUpperCase()}
              </div>
              <div className="min-w-0 flex-1 truncate">{user?.email}</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56">
              <DropdownMenuItem onClick={() => nav2("/app/settings")}>
                <SettingsIcon size={14} className="mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>
                {theme === "dark" ? <Sun size={14} className="mr-2" /> : <Moon size={14} className="mr-2" />}
                Toggle theme
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => { await signOut(); nav2("/"); }}>
                <LogOut size={14} className="mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-dvh min-w-0 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-6">
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex h-9 w-full max-w-md items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-muted-foreground hover:border-border-strong focus-ring"
          >
            <Search size={14} />
            <span className="flex-1 text-left">Search datasets, tags, columns…</span>
            <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
          </button>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} collections={collections} />
      <CommandPalette />
    </div>
  );
}
