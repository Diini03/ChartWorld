import { cn } from "@/lib/utils";

export function TagChip({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10.5px] text-muted-foreground",
        className
      )}
    >
      #{label}
    </span>
  );
}
