import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const audiences = [
  ["Analysts", "Stop losing your working files. Track versions, document assumptions, share cleanly."],
  ["Researchers", "Keep years of survey and instrument data organized and citable."],
  ["Students", "Manage every dataset for every class in one place."],
  ["NGOs", "Preserve institutional knowledge as your team changes over time."],
  ["Data teams", "One canonical library for everyone. No more `final_v3.csv`."],
];

export default function Solutions() {
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Solutions</p>
        <h1 className="font-display text-5xl md:text-6xl">Built for the people who work with data.</h1>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
        {audiences.map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-border bg-surface p-8 shadow-soft">
            <h2 className="font-display text-2xl">{t}</h2>
            <p className="mt-3 text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-2xl text-center">
        <Button asChild size="lg"><Link to="/auth?mode=signup">Start free</Link></Button>
      </div>
    </section>
  );
}
