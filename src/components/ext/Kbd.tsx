import { cn } from "@/lib/utils";

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 items-center rounded border border-border bg-surface-2 px-1.5 font-mono text-[10.5px] font-medium text-muted-foreground",
        className
      )}
    >
      {children}
    </kbd>
  );
}
