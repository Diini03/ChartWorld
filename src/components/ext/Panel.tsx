import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  className?: string;
  children: ReactNode;
}

export function Panel({ className, children }: PanelProps) {
  return (
    <div className={cn("flex h-full w-full flex-col bg-surface", className)}>
      {children}
    </div>
  );
}

interface PanelHeaderProps {
  title?: ReactNode;
  actions?: ReactNode;
  subtle?: boolean;
  className?: string;
}

export function PanelHeader({ title, actions, subtle, className }: PanelHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border px-3",
        subtle && "bg-surface-2",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-foreground">
        {title}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
    </div>
  );
}

export function PanelBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("min-h-0 flex-1 overflow-auto", className)}>{children}</div>;
}
