import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { Command } from "cmdk";
import { CHARTS, CATEGORIES } from "@/data/charts";
import { useUI } from "@/lib/store";
import { Search, ChevronRight } from "lucide-react";

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useUI();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  const fuse = useMemo(() => new Fuse(CHARTS, {
    keys: ["name", "category", "tagline", "summary", "keywords", "businessExample", "difficulty"],
    threshold: 0.35,
  }), []);

  const results = useMemo(() => {
    if (!q.trim()) return CHARTS.slice(0, 8);
    return fuse.search(q).slice(0, 12).map((r) => r.item);
  }, [q, fuse]);

  const byCat = useMemo(() => {
    const m = new Map<string, typeof CHARTS>();
    results.forEach((c) => {
      if (!m.has(c.category)) m.set(c.category, [] as any);
      m.get(c.category)!.push(c);
    });
    return Array.from(m.entries());
  }, [results]);

  const pages = useMemo(() => {
    const all = [
      { to: "/create", label: "Create a chart", hint: "Upload data and build" },
      { to: "/explore", label: "Explore charts", hint: "Browse all chart types" },
      { to: "/categories", label: "Categories", hint: "Charts grouped by purpose" },
      { to: "/chooser", label: "Chart chooser", hint: "Find the right chart" },
      { to: "/compare", label: "Compare charts", hint: "Side-by-side comparison" },
      { to: "/playground", label: "Playground", hint: "Style experiments" },
      { to: "/python", label: "Python guide", hint: "Matplotlib, Seaborn, Plotly" },
      { to: "/resources", label: "Resources", hint: "Books, tools, references" },
      { to: "/connect", label: "Connect", hint: "GitHub, portfolio, LinkedIn" },
      { to: "/quiz", label: "Chart Quiz", hint: "Test your chart knowledge" },
      { to: "/surprise", label: "Surprise Me", hint: "Spin a random chart" },
      { to: "/cheatsheet", label: "Cheat Sheet", hint: "Printable one-page chart reference" },
      { to: "/saved", label: "Saved charts", hint: "Favorites and recently viewed" },
      { to: "/about", label: "About", hint: "Why ChartWorld exists" },
    ];
    const term = q.trim().toLowerCase();
    if (!term) return all.slice(0, 4);
    return all.filter((p) => (p.label + " " + p.hint).toLowerCase().includes(term)).slice(0, 5);
  }, [q]);

  useEffect(() => { if (!searchOpen) setQ(""); }, [searchOpen]);

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/50 p-4 pt-[10vh] backdrop-blur-sm"
      onClick={() => setSearchOpen(false)}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-popover shadow-lg animate-in fade-in zoom-in-95">
        <Command shouldFilter={false}>
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search size={16} className="text-muted-foreground" />
            <Command.Input
              autoFocus
              value={q}
              onValueChange={setQ}
              placeholder="Search charts, purpose, library, keyword…"
              className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px]">esc</kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            {results.length === 0 && pages.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">No results for "{q}"</div>
            )}
            {pages.length > 0 && (
              <Command.Group heading="Go to" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground">
                {pages.map((p) => (
                  <Command.Item
                    key={p.to}
                    value={`page-${p.to}`}
                    onSelect={() => { setSearchOpen(false); nav(p.to); }}
                    className="group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 aria-selected:bg-surface-2"
                  >
                    <div>
                      <div className="text-sm font-medium">{p.label}</div>
                      <div className="text-xs text-muted-foreground">{p.hint}</div>
                    </div>
                    <ChevronRight size={14} className="opacity-0 transition-opacity group-aria-selected:opacity-100" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            {byCat.map(([cat, items]) => (
              <Command.Group key={cat} heading={cat} className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground">
                {items.map((c) => (
                  <Command.Item
                    key={c.slug}
                    value={c.slug}
                    onSelect={() => { setSearchOpen(false); nav(`/chart/${c.slug}`); }}
                    className="group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 aria-selected:bg-surface-2"
                  >
                    <div>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{c.tagline}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{c.difficulty}</span>
                      <ChevronRight size={14} className="opacity-0 transition-opacity group-aria-selected:opacity-100" />
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
            {!q && (
              <div className="mt-4 border-t border-border p-3">
                <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Categories</p>
                <div className="flex flex-wrap gap-1">
                  {CATEGORIES.map((c) => (
                    <button key={c} onClick={() => { setSearchOpen(false); nav(`/categories#${c.toLowerCase().replace(/\s+/g, "-")}`); }} className="rounded-full border border-border bg-surface px-3 py-1 text-xs hover:border-border-strong">
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
