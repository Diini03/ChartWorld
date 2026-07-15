import { useEffect } from "react";

type Handler = (e: KeyboardEvent) => void;

/**
 * Global keyboard shortcut registrar.
 * Accepts a map like { "mod+k": open, "escape": close, "[": toggleNav }.
 * `mod` maps to ⌘ on macOS and Ctrl elsewhere.
 * Skips when focus is inside an editable element unless the combo uses `mod`.
 */
export function useHotkeys(map: Record<string, Handler>, deps: unknown[] = []) {
  useEffect(() => {
    const isMac = navigator.platform.toLowerCase().includes("mac");

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      for (const combo of Object.keys(map)) {
        const parts = combo.toLowerCase().split("+");
        const key = parts[parts.length - 1];
        const wantMod = parts.includes("mod");
        const wantShift = parts.includes("shift");
        const wantAlt = parts.includes("alt");

        const modOk = wantMod ? (isMac ? e.metaKey : e.ctrlKey) : !e.metaKey && !e.ctrlKey;
        const shiftOk = wantShift ? e.shiftKey : !e.shiftKey;
        const altOk = wantAlt ? e.altKey : !e.altKey;
        const keyOk = e.key.toLowerCase() === key;

        if (modOk && shiftOk && altOk && keyOk) {
          if (inEditable && !wantMod && key !== "escape") continue;
          e.preventDefault();
          map[combo](e);
          return;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
