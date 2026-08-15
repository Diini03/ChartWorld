import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChartStudio } from "@/components/viz/ChartStudio";
import { useViz } from "@/lib/viz/store";

export default function Create() {
  const [params] = useSearchParams();
  const hydrate = useViz((s) => s.hydrate);

  useEffect(() => {
    if (Array.from(params.keys()).length) hydrate(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container py-8">
      <header className="mb-6">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Create</p>
        <h1 className="font-display text-4xl md:text-5xl">Build a chart from real data.</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pick a sample dataset or drop in your own CSV — everything runs in your browser. Switch to
          Understand to learn why the chart works, or Code to take the Python with you.
        </p>
      </header>
      <ChartStudio />
    </div>
  );
}
