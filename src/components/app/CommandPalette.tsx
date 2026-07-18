import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useUI } from "@/lib/store";
import { listDatasets } from "@/lib/datasets";
import { Database } from "lucide-react";

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen } = useUI();
  const nav = useNavigate();
  const { data: datasets = [] } = useQuery({ queryKey: ["datasets", "all"], queryFn: () => listDatasets() });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  return (
    <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
      <CommandInput placeholder="Search datasets…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Datasets">
          {datasets.map((d) => (
            <CommandItem
              key={d.id}
              value={`${d.name} ${d.tags?.join(" ") ?? ""}`}
              onSelect={() => { setPaletteOpen(false); nav(`/app/datasets/${d.id}`); }}
            >
              <Database size={14} className="mr-2 text-muted-foreground" />
              <span className="flex-1">{d.name}</span>
              <span className="font-mono text-[11px] text-muted-foreground">v{d.current_version}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
