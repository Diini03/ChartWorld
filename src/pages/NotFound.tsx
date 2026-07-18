import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md space-y-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">404</p>
        <h1 className="font-display text-4xl">This page slipped through the cracks.</h1>
        <p className="text-muted-foreground">The link may be broken, or the page may have moved.</p>
        <Button asChild><Link to="/">Back home</Link></Button>
      </div>
    </div>
  );
}

export default NotFound;
