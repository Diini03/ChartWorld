import { service } from "@/lib/mock/service";
import { cn } from "@/lib/utils";

export function UserAvatar({
  userId,
  size = 20,
  className,
}: {
  userId: string;
  size?: number;
  className?: string;
}) {
  const user = service.userById(userId);
  const initials = (user?.name ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span
      title={user?.name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-mono font-medium text-white",
        className
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: user?.color ?? "hsl(var(--muted-foreground))",
        fontSize: Math.round(size * 0.42),
      }}
    >
      {initials}
    </span>
  );
}
