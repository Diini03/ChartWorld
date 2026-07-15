import type { Status } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

const map: Record<Status, string> = {
  ok: "bg-success",
  warn: "bg-warning",
  fail: "bg-danger",
};

export function StatusDot({ status, className, ring }: { status: Status; className?: string; ring?: boolean }) {
  return (
    <span
      aria-label={status}
      className={cn(
        "inline-block h-2 w-2 shrink-0 rounded-full",
        map[status],
        ring && "ring-2 ring-background",
        className
      )}
    />
  );
}
