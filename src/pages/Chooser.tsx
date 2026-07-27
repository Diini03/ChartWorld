import { useState } from "react";
import { Link } from "react-router-dom";
import { CHARTS } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import { ArrowRight, RotateCcw } from "lucide-react";

interface Step { key: string; question: string; options: { label: string; value: string }[]; }

const STEPS: Step[] = [
  {
    key: "goal", question: "What are you trying to show?",
    options: [
      { label: "Comparison", value: "Comparison" },
      { label: "Trend over time", value: "Time Series" },
      { label: "Distribution", value: "Distribution" },
      { label: "Relationship", value: "Relationship" },
      { label: "Composition", value: "Composition" },
      { label: "Geography", value: "Maps" },
      { label: "Flow", value: "Flow" },
      { label: "Ranking", value: "Ranking" },
    ],
  },
  {
    key: "vars", question: "How many variables?",
    options: [
      { label: "One", value: "1" }, { label: "Two", value: "2" }, { label: "Three or more", value: "3+" },
    ],
  },
  {
    key: "type", question: "Categorical or numerical?",
    options: [
      { label: "Categorical", value: "cat" }, { label: "Numerical", value: "num" }, { label: "Mixed", value: "mixed" },
    ],
  },
  {
    key: "exact", question: "Do you need exact values?",
    options: [{ label: "Yes, precision matters", value: "yes" }, { label: "No, patterns matter more", value: "no" }],
  },
];

export default function Chooser() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const done = step >= STEPS.length;

  const recommendations = done ? recommend(answers) : [];

  return (
    <div className="container py-10">
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Choose the right chart</p>
        <h1 className="font-display text-5xl md:text-6xl">Three questions. One perfect chart.</h1>
      </header>

      <div className="mx-auto mt-12 max-w-3xl">
        {!done && (
          <div className="rounded-3xl border border-border bg-card p-8 shadow-md">
            <div className="mb-4 flex items-center gap-2">
              {STEPS.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-surface-2"}`} />
              ))}
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Step {step + 1} of {STEPS.length}</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">{STEPS[step].question}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {STEPS[step].options.map((o) => (
                <button
                  key={o.value}
                  onClick={() => {
                    setAnswers({ ...answers, [STEPS[step].key]: o.value });
                    setStep(step + 1);
                  }}
                  className="group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                >
                  <span className="font-medium">{o.label}</span>
                  <ArrowRight size={16} className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </button>
              ))}
            </div>
          </div>
        )}

        {done && (
          <div className="rounded-3xl border border-border bg-card p-8 shadow-md">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Our recommendation</p>
            <h2 className="font-display text-3xl md:text-4xl">Based on your answers, try these.</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {recommendations.slice(0, 6).map((c) => (
                <Link key={c.slug} to={`/chart/${c.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-surface p-3 transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="overflow-hidden rounded-lg bg-surface-2/50 p-1"><ChartPreview kind={c.preview} height={100} seed={c.slug.length} /></div>
                  <div className="mt-3 font-display text-lg">{c.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{c.tagline}</div>
                </Link>
              ))}
            </div>
            <button onClick={() => { setAnswers({}); setStep(0); }} className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-surface-2">
              <RotateCcw size={14} /> Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function recommend(a: Record<string, string>) {
  const goal = a.goal;
  const list = CHARTS.filter((c) => c.category === goal);
  const rest = CHARTS.filter((c) => c.category !== goal).sort(() => 0.5 - Math.random()).slice(0, 3);
  return [...list, ...rest];
}
