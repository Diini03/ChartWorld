import type { LucideIcon } from "lucide-react";
import { PanelHeader } from "@/components/ext/Panel";
import { EmptyState } from "@/components/ext/EmptyState";
import { Kbd } from "@/components/ext/Kbd";
import { useAppStore } from "@/lib/store";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyModule({ icon: Icon, title, description }: Props) {
  const { setPaletteOpen } = useAppStore();
  return (
    <div className="flex h-full min-w-0 flex-col bg-background">
      <PanelHeader
        title={
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
            <Icon size={14} className="text-muted-foreground" /> {title}
          </span>
        }
      />
      <div className="min-h-0 flex-1">
        <EmptyState
          icon={Icon}
          title={title}
          description={description}
          action={
            <button
              onClick={() => setPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-[12.5px] text-foreground hover:bg-surface-2 focus-ring"
            >
              Jump somewhere else <Kbd>⌘</Kbd><Kbd>K</Kbd>
            </button>
          }
        />
      </div>
    </div>
  );
}
