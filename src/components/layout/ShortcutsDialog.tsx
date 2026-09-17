import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Keyboard, X } from "lucide-react";
import { useUI } from "@/lib/store";

const GROUPS: { title: string; items: [string[], string][] }[] = [
  {
    title: "General",
    items: [
      [["?"], "Show this shortcuts panel"],
      [["⌘", "K"], "Open search"],
      [["/"], "Open search"],
      [["T"], "Toggle light / dark theme"],
      [["Esc"], "Close any panel"],
    ],
  },
  {
    title: "Go to",
    items: [
      [["G", "H"], "Home"],
      [["G", "E"], "Explore charts"],
      [["G", "C"], "Create a chart"],
      [["G", "Q"], "Chart quiz"],
      [["G", "S"], "Saved charts"],
      [["G", "P"], "Playground"],
    ],
  },
  {
    title: "Fun",
    items: [
      [["R"], "Surprise me — random chart"],
      [["Space"], "Spin again (on Surprise page)"],
    ],
  },
];

const GO_MAP: Record<string, string> = {
  h: "/",
  e: "/explore",
  c: "/create",
  q: "/quiz",
  s: "/saved",
  p: "/playground",
};

export function ShortcutsDialog() {
  const { shortcutsOpen, setShortcutsOpen, setSearchOpen, toggleTheme, searchOpen } = useUI();
  const nav = useNavigate();

  useEffect(() => {
    let goArmed = false;
    let timer: number | undefined;

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable || t.tagName === "SELECT");
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;

      const k = e.key.toLowerCase();

      if (e.key === "Escape") {
        setShortcutsOpen(false);
        return;
      }
      if (e.key === "?") {
        e.preventDefault();
        setShortcutsOpen(!shortcutsOpen);
        return;
      }
      if (shortcutsOpen || searchOpen) return;

      if (goArmed && GO_MAP[k]) {
        e.preventDefault();
        goArmed = false;
        nav(GO_MAP[k]);
        return;
      }

      if (k === "g") {
        goArmed = true;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => { goArmed = false; }, 1200);
        return;
      }
      if (k === "/") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (k === "t") {
        e.preventDefault();
        toggleTheme();
        return;
      }
      if (k === "r") {
        e.preventDefault();
        nav("/surprise");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [shortcutsOpen, searchOpen, setShortcutsOpen, setSearchOpen, toggleTheme, nav]);

  if (!shortcutsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => setShortcutsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-popover shadow-lg animate-in fade-in zoom-in-95"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Keyboard size={16} className="text-primary" />
            <h2 className="font-display text-lg">Keyboard shortcuts</h2>
          </div>
          <button
            onClick={() => setShortcutsOpen(false)}
            aria-label="Close shortcuts"
            className="focus-ring rounded-full p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <X size={15} />
          </button>
        </div>
        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-5 py-5">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{g.title}</p>
              <ul className="space-y-1.5">
                {g.items.map(([keys, label]) => (
                  <li key={label} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-foreground/85">{label}</span>
                    <span className="flex shrink-0 items-center gap-1">
                      {keys.map((k) => (
                        <kbd
                          key={k}
                          className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="border-t border-border pt-4 text-xs text-muted-foreground">
            Press <kbd className="rounded border border-border bg-surface-2 px-1 font-mono text-[10px]">?</kbd> anytime to
            reopen this list.
          </p>
        </div>
      </div>
    </div>
  );
}
