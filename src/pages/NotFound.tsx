import { useSeo } from "@/hooks/use-seo";
import { Link } from "react-router-dom";

export function NotFound() {
  useSeo({ title: "Page not found", description: "This page does not exist in ChartWorld.", noIndex: true });
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <div className="font-display text-8xl text-gradient">404</div>
      <p className="text-lg text-muted-foreground">This chart hasn't been drawn yet.</p>
      <Link to="/" className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90">
        Back to ChartWorld
      </Link>
    </div>
  );
}
