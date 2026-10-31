import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, RotateCcw, Copy, Check, ArrowRight, PartyPopper } from "lucide-react";
import { CHARTS, type Category, type Chart } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import { useSeo } from "@/hooks/use-seo";
import { toast } from "sonner";

interface Answer {
  label: string;
  emoji: string;
  weights: Partial<Record<Category, number>>;
}

interface Question {
  q: string;
  answers: Answer[];
}

const QUESTIONS: Question[] = [
  {
    q: "It's Friday night. What are you up to?",
    answers: [
      { label: "Hosting a dinner party for everyone I know", emoji: "🍽️", weights: { Composition: 2, Hierarchy: 1 } },
      { label: "Deep in a rabbit hole researching something random", emoji: "🔍", weights: { Relationship: 2, Statistical: 1 } },
      { label: "Planning next month's budget spreadsheet", emoji: "📊", weights: { Business: 2, Comparison: 1 } },
      { label: "Out exploring a part of town I've never seen", emoji: "🗺️", weights: { Maps: 2, Flow: 1 } },
    ],
  },
  {
    q: "Your friends would describe you as…",
    answers: [
      { label: "The reliable one — always on time, always prepared", emoji: "⏰", weights: { "Time Series": 2, Comparison: 1 } },
      { label: "The storyteller — every anecdote has a plot twist", emoji: "📖", weights: { Flow: 2, "Time Series": 1 } },
      { label: "The competitive one — everything is a leaderboard", emoji: "🏆", weights: { Ranking: 2, Comparison: 1 } },
      { label: "The curious one — always asking 'but why?'", emoji: "🤔", weights: { "Machine Learning": 2, Statistical: 1 } },
    ],
  },
  {
    q: "Pick a superpower:",
    answers: [
      { label: "See how everything connects to everything else", emoji: "🕸️", weights: { Relationship: 2, Hierarchy: 1 } },
      { label: "Predict the future (roughly, with error bars)", emoji: "🔮", weights: { "Machine Learning": 2, "Time Series": 1 } },
      { label: "Instantly know the biggest slice of anything", emoji: "🍰", weights: { Composition: 2, Ranking: 1 } },
      { label: "Teleport anywhere on Earth", emoji: "🌍", weights: { Maps: 2, Flow: 1 } },
    ],
  },
  {
    q: "Your ideal vacation is…",
    answers: [
      { label: "A perfectly planned itinerary, hour by hour", emoji: "📅", weights: { "Time Series": 2, Business: 1 } },
      { label: "A road trip with no destination", emoji: "🚗", weights: { Flow: 2, Maps: 1 } },
      { label: "A quiet cabin, journaling and reflecting", emoji: "🏕️", weights: { Distribution: 2, Statistical: 1 } },
      { label: "A food tour — a little bit of everything", emoji: "🍜", weights: { Composition: 2, Comparison: 1 } },
    ],
  },
  {
    q: "How do you make a tough decision?",
    answers: [
      { label: "Pros and cons list, obviously", emoji: "📝", weights: { Comparison: 2, Ranking: 1 } },
      { label: "Gut feeling — trust the distribution of outcomes", emoji: "🎲", weights: { Distribution: 2, Statistical: 1 } },
      { label: "Ask everyone I know and weigh the votes", emoji: "🗳️", weights: { Hierarchy: 2, Composition: 1 } },
      { label: "Run a mental simulation of every scenario", emoji: "🧠", weights: { "Machine Learning": 2, Relationship: 1 } },
    ],
  },
];

const PERSONALITIES: Record<Category, { title: string; blurb: string }> = {
  Comparison: { title: "The Straight Shooter", blurb: "You value clarity above all. No fluff, no ambiguity — just honest side-by-side truth. People come to you when they need a decision made." },
  Ranking: { title: "The Podium Chaser", blurb: "You know who's first, who's last, and who's climbing. Life is a leaderboard and you're here to win it — or at least rank it." },
  "Time Series": { title: "The Timekeeper", blurb: "You see life as a journey, not a snapshot. Trends, seasons, and momentum are your language. You probably own a planner." },
  Distribution: { title: "The Free Spirit", blurb: "You embrace uncertainty and know that most things cluster in the middle — but the interesting stuff lives in the tails." },
  Relationship: { title: "The Connector", blurb: "You see invisible threads between everything. Correlation may not be causation, but in your world everything is delightfully tangled." },
  Composition: { title: "The Whole-Picture Person", blurb: "You always know how the pie gets sliced. Big-picture thinking is your gift — you never lose sight of the total." },
  Flow: { title: "The Wanderer", blurb: "You're fascinated by how things move, change, and transform. For you, the journey literally is the destination." },
  Hierarchy: { title: "The Architect", blurb: "You instinctively organize chaos into structure. Everything has its place, its parent, and its branch in your mental tree." },
  Maps: { title: "The Explorer", blurb: "Place matters to you. You think in coordinates and borders, and your camera roll is 90% sunsets from new locations." },
  "Machine Learning": { title: "The Futurist", blurb: "You're already living three steps ahead. Patterns others miss are obvious to you, and you're quietly training your own model of the world." },
  Business: { title: "The Strategist", blurb: "KPIs, targets, waterfalls — you speak fluent boardroom. You turn numbers into narratives that get budgets approved." },
  Statistical: { title: "The Skeptic", blurb: "You ask for the confidence interval before the conclusion. Outliers fascinate you, and 'average' is never the whole story." },
};

function computeResult(answers: Answer[]): Chart {
  const scores = new Map<Category, number>();
  for (const a of answers) {
    for (const [cat, w] of Object.entries(a.weights)) {
      scores.set(cat as Category, (scores.get(cat as Category) ?? 0) + (w ?? 0));
    }
  }
  let best: Category = "Comparison";
  let bestScore = -1;
  for (const [cat, score] of scores) {
    if (score > bestScore) { best = cat; bestScore = score; }
  }
  const pool = CHARTS.filter((c) => c.category === best);
  // deterministic pick based on answer pattern so retakes with same answers match
  const seed = answers.reduce((acc, a) => acc + a.label.length, 0);
  return pool[seed % pool.length] ?? CHARTS[0];
}

export default function Personality() {
  useSeo({
    title: "Which Chart Are You? — Chart Personality Quiz",
    description: "Answer 5 playful questions and discover which chart type matches your personality. A fun way to meet your data-viz spirit animal.",
    path: "/personality",
  });

  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1, QUESTIONS.length = result
  const [picked, setPicked] = useState<Answer[]>([]);
  const [copied, setCopied] = useState(false);

  const done = step >= QUESTIONS.length;
  const result = useMemo(() => (done ? computeResult(picked) : null), [done, picked]);
  const personality = result ? PERSONALITIES[result.category] : null;

  const answer = (a: Answer) => {
    setPicked((p) => [...p, a]);
    setStep((s) => s + 1);
  };

  const retake = () => { setStep(0); setPicked([]); setCopied(false); };

  const share = async () => {
    if (!result || !personality) return;
    const text = `I'm "${personality.title}" — a ${result.name}! 📊 Take the ChartWorld personality quiz: ${window.location.origin}/personality`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Result copied — paste it anywhere!");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — your browser blocked it.");
    }
  };

  return (
    <div className="container max-w-3xl py-12">
      <header className="mb-10 text-center" data-reveal>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <PartyPopper size={12} className="text-primary" />
          Personality Quiz
        </div>
        <h1 className="font-display text-4xl md:text-6xl">
          Which chart <span className="text-gradient">are you?</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
          Five quick questions. Zero math. One surprisingly accurate chart personality.
        </p>
      </header>

      {!done ? (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-10" data-reveal>
          {/* Progress */}
          <div className="mb-8 flex items-center gap-2">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? "bg-primary" : i === step ? "bg-primary/40" : "bg-surface-2"}`}
              />
            ))}
            <span className="ml-2 font-mono text-xs text-muted-foreground">{step + 1}/{QUESTIONS.length}</span>
          </div>

          <h2 className="mb-6 font-display text-2xl md:text-3xl">{QUESTIONS[step].q}</h2>
          <div className="grid gap-3">
            {QUESTIONS[step].answers.map((a) => (
              <button
                key={a.label}
                onClick={() => answer(a)}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-surface/60 px-5 py-4 text-left transition-all hover:border-primary/40 hover:bg-surface-2 hover:shadow-sm focus-ring"
              >
                <span className="text-2xl" aria-hidden>{a.emoji}</span>
                <span className="text-sm font-medium md:text-base">{a.label}</span>
                <ArrowRight size={16} className="ml-auto shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      ) : result && personality ? (
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card md:p-10" data-reveal>
          <div className="absolute inset-0 mesh-bg opacity-20" />
          <div className="relative">
            <p className="mb-2 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">You are…</p>
            <h2 className="text-center font-display text-3xl md:text-5xl">
              {personality.title}
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Your chart soulmate: <span className="font-semibold text-foreground">{result.name}</span>
            </p>

            <div className="mx-auto my-8 max-w-md overflow-hidden rounded-2xl border border-border bg-surface-2 p-3">
              <ChartPreview kind={result.preview} height={240} seed={result.slug.length * 7} />
            </div>

            <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-muted-foreground">
              {personality.blurb}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={share}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Share my result"}
              </button>
              <Link
                to={`/chart/${result.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-surface-2"
              >
                Meet your chart <ArrowRight size={14} />
              </Link>
              <button
                onClick={retake}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <RotateCcw size={14} /> Retake
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <p className="mt-10 text-center text-xs text-muted-foreground">
        <Sparkles size={11} className="mr-1 inline text-primary" />
        Scientifically unverified. Emotionally accurate.
      </p>
    </div>
  );
}
