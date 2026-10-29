import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { CHARTS, chartBySlug } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import { supabase } from "@/integrations/supabase/client";

type Rec = { slug: string; fit: string; why: string; tip: string };

const EXAMPLES = [
  { d: "Monthly sales for 4 regions over the last 3 years", g: "Spot trends and compare regions" },
  { d: "Survey responses: age, income and satisfaction score for 2,000 people", g: "See how income relates to satisfaction" },
  { d: "Website traffic sources and how many visitors each sends", g: "Show each source's share of the total" },
];

export default function Recommend() {
  useSeo({ title: "AI Chart Recommender", description: "Describe your data and goal — AI suggests the best chart types from the ChartWorld catalog, with reasons.", path: "/recommend" });
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [recs, setRecs] = useState<Rec[]>([]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || loading) return;
    setLoading(true); setError(""); setRecs([]); setSummary("");
    const catalog = CHARTS.map((c) => ({ slug: c.slug, name: c.name, category: c.category, whenToUse: c.whenToUse }));
    const { data, error } = await supabase.functions.invoke("recommend-charts", { body: { description, goal, catalog } });
    setLoading(false);
    if (error || data?.error) {
      let msg = data?.error;
      try { msg ||= (await (error as any)?.context?.json())?.error; } catch { /* ignore */ }
      setError(msg || "Couldn't get recommendations. Please try again.");
      return;
    }
    setSummary(data.summary);
    setRecs(data.recommendations);
  };

  return (
    <div className="container max-w-5xl py-10">
      <header data-reveal className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">AI Recommender</p>
        <h1 className="font-display text-5xl md:text-6xl">Tell us about your data.</h1>
        <p className="mt-4 text-muted-foreground">Describe what you have and what you want to show — AI picks the best charts from our catalog and explains why.</p>
      </header>

      <form onSubmit={submit} className="mx-auto mt-10 max-w-2xl space-y-4 rounded-3xl border border-border bg-card p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Your data</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={2000} required
            placeholder="e.g. Daily temperatures for 5 cities over one year"
            className="focus-ring w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Your goal <span className="text-muted-foreground">(optional)</span></span>
          <input value={goal} onChange={(e) => setGoal(e.target.value)} maxLength={500}
            placeholder="e.g. Compare which city has the biggest swings"
            className="focus-ring w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm" />
        </label>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button type="button" key={ex.d} onClick={() => { setDescription(ex.d); setGoal(ex.g); }}
              className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted-foreground hover:text-foreground">
              {ex.d.split(" ").slice(0, 4).join(" ")}…
            </button>
          ))}
        </div>
        <button type="submit" disabled={loading || !description.trim()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? "Thinking…" : "Recommend charts"}
        </button>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </form>

      {summary && <p className="mx-auto mt-10 max-w-2xl text-center text-lg">{summary}</p>}
      {recs.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {recs.map((r, i) => {
            const c = chartBySlug(r.slug);
            if (!c) return null;
            return (
              <div key={r.slug} className="rounded-3xl border border-border bg-card p-6">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{c.category}</div>
                    <h2 className="font-display text-2xl">{c.name}</h2>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{r.fit}</span>
                </div>
                <div className="overflow-hidden rounded-xl bg-surface-2/50 p-2">
                  <ChartPreview kind={c.preview} height={160} seed={i + 3} />
                </div>
                <p className="mt-4 text-sm">{r.why}</p>
                {r.tip && <p className="mt-2 text-sm text-muted-foreground"><strong>Tip:</strong> {r.tip}</p>}
                <div className="mt-4 flex gap-4 text-xs font-medium">
                  <Link to={`/chart/${c.slug}`} className="text-primary hover:underline">Open guide →</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className="mt-10 text-center text-xs text-muted-foreground">AI-powered suggestions — always sanity-check against your data.</p>
    </div>
  );
}
