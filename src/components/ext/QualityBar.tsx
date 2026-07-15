import { cn } from "@/lib/utils";

export function QualityBar({ value, className }: { value: number; className?: string }) {
  const color =
    value >= 90 ? "bg-success" : value >= 75 ? "bg-warning" : "bg-danger";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-3">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${Math.max(4, Math.min(100, value))}%` }}
        />
      </div>
      <span className="w-7 text-right font-mono text-[11px] text-muted-foreground">{value}</span>
    </div>
  );
}
