import { Star } from "lucide-react";
import { useSaved } from "@/lib/saved";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  slug,
  size = 14,
  className = "",
  withLabel = false,
}: {
  slug: string;
  size?: number;
  className?: string;
  withLabel?: boolean;
}) {
  const favorites = useSaved((s) => s.favorites);
  const toggleFavorite = useSaved((s) => s.toggleFavorite);
  const active = favorites.includes(slug);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from favorites" : "Save to favorites"}
      aria-pressed={active}
      title={active ? "Saved — click to remove" : "Save this chart"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(slug);
      }}
      className={cn(
        "focus-ring inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs transition-colors",
        active
          ? "border-transparent bg-[hsl(var(--chart-4))]/15 text-[hsl(var(--chart-4))]"
          : "border-border text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <Star size={size} className={active ? "fill-current" : undefined} />
      {withLabel && <span>{active ? "Saved" : "Save"}</span>}
    </button>
  );
}
