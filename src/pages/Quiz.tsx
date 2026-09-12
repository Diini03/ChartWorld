import { useSeo } from "@/hooks/use-seo";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CHARTS, type Chart } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import {
  ArrowRight,
  Check,
  X,
  RotateCcw,
  Trophy,
  Eye,
  ClipboardList,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------- types */

type QuizMode = "guess" | "scenario" | "mixed";
type Phase = "start" | "playing" | "end";

interface Question {
  mode: "guess" | "scenario";
  chart: Chart;
  options: Chart[];
  prompt: string;
}

const TOTAL = 10;
const BEST_KEY = "chartworld-quiz-best";

/* -------------------------------------------------------------- helpers */

function getBest(): number {
  try {
    return parseInt(localStorage.getItem(BEST_KEY) || "0", 10) || 0;
  } catch {
    return 0;
  }
}
function saveBest(s: number) {
  const cur = getBest();
  if (s > cur) {
    try {
      localStorage.setItem(BEST_KEY, String(s));
    } catch {
      /* ignore */
    }
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scenarioPrompt(chart: Chart): string {
  const variants = [
    `${chart.businessExample} Which chart should you use?`,
    `You need to visualise data where ${chart.whenToUse[0].toLowerCase()}. Which chart fits best?`,
    `A colleague describes their goal: "${chart.tagline}" Which chart is this?`,
    `${chart.summary} Which chart type matches?`,
  ];
  return variants[Math.floor(Math.random() * variants.length)];
}

function buildQuestions(mode: QuizMode): Question[] {
  const pool = shuffle([...CHARTS]).slice(0, TOTAL);
  return pool.map((chart, idx) => {
    const qMode: "guess" | "scenario" =
      mode === "mixed" ? (idx % 2 === 0 ? "guess" : "scenario") : mode;

    const sameCat = CHARTS.filter(
      (c) => c.slug !== chart.slug && c.category === chart.category,
    );
    const other = CHARTS.filter(
      (c) => c.slug !== chart.slug && c.category !== chart.category,
    );
    // In guess mode, ensure distractors look visually different
    const p1 = qMode === "guess" ? sameCat.filter((c) => c.preview !== chart.preview) : sameCat;
    const p2 = qMode === "guess" ? other.filter((c) => c.preview !== chart.preview) : other;
    const distractors = [...shuffle(p1), ...shuffle(p2)].slice(0, 3);
    const options = shuffle([chart, ...distractors]);

    return {
      mode: qMode,
      chart,
      options,
      prompt:
        qMode === "guess"
          ? "Which chart type is shown above?"
          : scenarioPrompt(chart),
    };
  });
}

/* -------------------------------------------------------------- component */

export default function Quiz() {
  useSeo({
    title: "Chart Quiz — Test Your Data Visualization Knowledge",
    description:
      "Ten questions, two modes. Identify charts from their visual preview or pick the right chart for a real scenario. Track your best score.",
    path: "/quiz",
  });

  const [phase, setPhase] = useState<Phase>("start");
  const [mode, setMode] = useState<QuizMode>("mixed");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [best, setBest] = useState(getBest());

  const q = questions[current];
  const answered = selected !== null;

  function start(m: QuizMode) {
    setMode(m);
    setQuestions(buildQuestions(m));
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setPhase("playing");
  }

  function restart() {
    start(mode);
  }

  function backToStart() {
    setPhase("start");
    setSelected(null);
  }

  function pick(slug: string) {
    if (answered || !q) return;
    setSelected(slug);
    if (slug === q.chart.slug) setScore((s) => s + 1);
  }

  function next() {
    if (!q) return;
    if (current + 1 >= TOTAL) {
      saveBest(score);
      setBest(getBest());
      setPhase("end");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  return (
    <div className="container py-10">
      {phase === "start" && <StartScreen onStart={start} best={best} />}

      {phase === "playing" && q && (
        <QuestionScreen
          q={q}
          current={current}
          score={score}
          selected={selected}
          onPick={pick}
          onNext={next}
        />
      )}

      {phase === "end" && (
        <EndScreen
          score={score}
          best={best}
          onRestart={restart}
          onHome={backToStart}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------- start */

function StartScreen({
  onStart,
  best,
}: {
  onStart: (m: QuizMode) => void;
  best: number;
}) {
  const modes: {
    m: QuizMode;
    icon: React.ReactNode;
    title: string;
    desc: string;
    highlight?: boolean;
  }[] = [
    {
      m: "guess",
      icon: <Eye size={20} />,
      title: "Guess the Chart",
      desc: "See a chart preview. Identify which type it is from four options.",
    },
    {
      m: "scenario",
      icon: <ClipboardList size={20} />,
      title: "Pick the Right Chart",
      desc: "Read a real-world data scenario. Choose the chart that fits.",
    },
    {
      m: "mixed",
      icon: <Sparkles size={20} />,
      title: "Mixed Mode",
      desc: "A blend of both — the ultimate test of your chart fluency.",
      highlight: true,
    },
  ];

  return (
    <>
      <header data-reveal className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">
          Chart Quiz
        </p>
        <h1 className="font-display text-5xl md:text-6xl">
          How well do you know your charts?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Ten questions per round. Identify charts from their visual, or pick the
          right chart for a real scenario. Your best score is saved in your
          browser.
        </p>
      </header>

      {best > 0 && (
        <div
          data-reveal
          className="mx-auto mt-8 flex max-w-fit items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm"
        >
          <Trophy size={16} style={{ color: "hsl(var(--chart-4))" }} />
          Your best: <strong>&nbsp;{best}/{TOTAL}</strong>
        </div>
      )}

      <div
        data-reveal
        className="mt-12 grid gap-5 sm:grid-cols-3"
        style={{ ["--reveal-delay" as string]: "60ms" }}
      >
        {modes.map((opt) => (
          <button
            key={opt.m}
            onClick={() => onStart(opt.m)}
            className={cn(
              "card-lift group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-left shadow-sm",
              opt.highlight && "ring-1 ring-primary/30",
            )}
          >
            {opt.highlight && (
              <span
                className="absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-background"
                style={{ backgroundColor: "hsl(var(--primary))" }}
              >
                Recommended
              </span>
            )}
            <div
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-primary"
              style={{ backgroundColor: "hsl(var(--primary) / 0.1)" }}
            >
              {opt.icon}
            </div>
            <h3 className="font-display text-xl">{opt.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{opt.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
              Start{" "}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </button>
        ))}
      </div>

      <div
        data-reveal
        className="mx-auto mt-12 flex max-w-xl items-start gap-3 rounded-2xl border border-border bg-surface-2/50 p-5 text-sm text-muted-foreground"
        style={{ ["--reveal-delay" as string]: "120ms" }}
      >
        <Lightbulb size={18} className="mt-0.5 shrink-0 text-primary" />
        <p>
          Questions pull from all {CHARTS.length} chart types in ChartWorld. In
          Mixed mode you'll get a mix of visual recognition and scenario-based
          questions. Get one wrong and you'll see an explanation — then a link to
          learn more.
        </p>
      </div>
    </>
  );
}

/* -------------------------------------------------------------- question */

function QuestionScreen({
  q,
  current,
  score,
  selected,
  onPick,
  onNext,
}: {
  q: Question;
  current: number;
  score: number;
  selected: string | null;
  onPick: (slug: string) => void;
  onNext: () => void;
}) {
  const answered = selected !== null;

  return (
    <>
      {/* Progress bar */}
      <div className="mx-auto max-w-3xl">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Question {current + 1} of {TOTAL}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            Score: {score}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(current / TOTAL) * 100}%`,
              backgroundColor: "hsl(var(--primary))",
            }}
          />
        </div>
      </div>

      {/* Question card */}
      <div
        key={current}
        className="mx-auto mt-8 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        {q.mode === "guess" ? (
          <GuessQuestion
            q={q}
            selected={selected}
            onPick={onPick}
            answered={answered}
          />
        ) : (
          <ScenarioQuestion
            q={q}
            selected={selected}
            onPick={onPick}
            answered={answered}
          />
        )}
      </div>

      {/* Feedback */}
      {answered && (
        <div className="mx-auto mt-8 max-w-3xl animate-in fade-in slide-in-from-bottom-3 duration-300">
          <FeedbackPanel
            correct={selected === q.chart.slug}
            chart={q.chart}
            isLast={current + 1 >= TOTAL}
            onNext={onNext}
          />
        </div>
      )}
    </>
  );
}

/* ----- guess mode ----- */

function GuessQuestion({
  q,
  selected,
  onPick,
  answered,
}: {
  q: Question;
  selected: string | null;
  onPick: (slug: string) => void;
  answered: boolean;
}) {
  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="mx-auto max-w-xl">
          <ChartPreview kind={q.chart.preview} height={300} seed={q.chart.slug.length * 9} />
        </div>
      </div>
      <p className="mt-6 text-center font-display text-2xl">{q.prompt}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {q.options.map((o) => (
          <OptionButton
            key={o.slug}
            label={o.name}
            category={o.category}
            slug={o.slug}
            correctSlug={q.chart.slug}
            selected={selected}
            onPick={onPick}
            answered={answered}
          />
        ))}
      </div>
    </>
  );
}

/* ----- scenario mode ----- */

function ScenarioQuestion({
  q,
  selected,
  onPick,
  answered,
}: {
  q: Question;
  selected: string | null;
  onPick: (slug: string) => void;
  answered: boolean;
}) {
  return (
    <>
      <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
        <p className="font-display text-xl leading-relaxed md:text-2xl">
          {q.prompt}
        </p>
      </div>
      <p className="mt-6 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Choose the best chart
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {q.options.map((o) => (
          <VisualOption
            key={o.slug}
            chart={o}
            correctSlug={q.chart.slug}
            selected={selected}
            onPick={onPick}
            answered={answered}
          />
        ))}
      </div>
    </>
  );
}

/* ----- option components ----- */

function OptionButton({
  label,
  category,
  slug,
  correctSlug,
  selected,
  onPick,
  answered,
}: {
  label: string;
  category: string;
  slug: string;
  correctSlug: string;
  selected: string | null;
  onPick: (slug: string) => void;
  answered: boolean;
}) {
  const isCorrect = slug === correctSlug;
  const isPicked = slug === selected;

  const style: React.CSSProperties = {};
  if (answered && isCorrect) {
    style.borderColor = "hsl(var(--chart-5))";
    style.backgroundColor = "hsl(var(--chart-5) / 0.06)";
  } else if (answered && isPicked && !isCorrect) {
    style.borderColor = "hsl(var(--destructive))";
    style.backgroundColor = "hsl(var(--destructive) / 0.06)";
  }

  return (
    <button
      onClick={() => onPick(slug)}
      disabled={answered}
      style={style}
      className={cn(
        "flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all",
        !answered &&
          "border-border bg-card hover:-translate-y-0.5 hover:shadow-md",
        answered && isCorrect && "",
        answered && isPicked && !isCorrect && "",
        answered && !isCorrect && !isPicked && "border-border opacity-50",
      )}
    >
      <span>
        <span className="block text-base font-medium">{label}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {category}
        </span>
      </span>
      {answered && isCorrect && (
        <Check size={18} style={{ color: "hsl(var(--chart-5))" }} />
      )}
      {answered && isPicked && !isCorrect && (
        <X size={18} className="text-destructive" />
      )}
    </button>
  );
}

function VisualOption({
  chart,
  correctSlug,
  selected,
  onPick,
  answered,
}: {
  chart: Chart;
  correctSlug: string;
  selected: string | null;
  onPick: (slug: string) => void;
  answered: boolean;
}) {
  const isCorrect = chart.slug === correctSlug;
  const isPicked = chart.slug === selected;

  const style: React.CSSProperties = {};
  if (answered && isCorrect) {
    style.borderColor = "hsl(var(--chart-5))";
    style.boxShadow = "0 0 0 1px hsl(var(--chart-5) / 0.4)";
  } else if (answered && isPicked && !isCorrect) {
    style.borderColor = "hsl(var(--destructive))";
  }

  return (
    <button
      onClick={() => onPick(chart.slug)}
      disabled={answered}
      style={style}
      className={cn(
        "overflow-hidden rounded-2xl border p-3 text-left transition-all",
        !answered && "border-border bg-card hover:-translate-y-0.5 hover:shadow-md",
        answered && isCorrect && "",
        answered && isPicked && !isCorrect && "",
        answered && !isCorrect && !isPicked && "opacity-50",
      )}
    >
      <div className="overflow-hidden rounded-xl bg-surface-2/50 p-2">
        <ChartPreview kind={chart.preview} height={100} seed={chart.slug.length * 7} />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-medium">{chart.name}</span>
        {answered && isCorrect && (
          <Check size={16} style={{ color: "hsl(var(--chart-5))" }} />
        )}
        {answered && isPicked && !isCorrect && (
          <X size={16} className="text-destructive" />
        )}
      </div>
    </button>
  );
}

/* ----- feedback ----- */

function FeedbackPanel({
  correct,
  chart,
  isLast,
  onNext,
}: {
  correct: boolean;
  chart: Chart;
  isLast: boolean;
  onNext: () => void;
}) {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        borderColor: correct
          ? "hsl(var(--chart-5) / 0.3)"
          : "hsl(var(--destructive) / 0.3)",
        backgroundColor: correct
          ? "hsl(var(--chart-5) / 0.04)"
          : "hsl(var(--destructive) / 0.04)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: correct
              ? "hsl(var(--chart-5) / 0.12)"
              : "hsl(var(--destructive) / 0.1)",
            color: correct ? "hsl(var(--chart-5))" : "hsl(var(--destructive))",
          }}
        >
          {correct ? <Check size={22} /> : <X size={22} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl">
            {correct ? "Correct!" : `The answer was ${chart.name}.`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{chart.summary}</p>
          <Link
            to={`/chart/${chart.slug}`}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Learn more about {chart.name}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <button
        onClick={onNext}
        className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
        style={{ backgroundColor: "hsl(var(--foreground))" }}
      >
        {isLast ? "See your score" : "Next question"}
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------- end */

function EndScreen({
  score,
  best,
  onRestart,
  onHome,
}: {
  score: number;
  best: number;
  onRestart: () => void;
  onHome: () => void;
}) {
  const pct = score / TOTAL;
  const message =
    pct === 1
      ? "Perfect score — you're a chart master!"
      : pct >= 0.7
        ? "Great work. You know your charts well."
        : pct >= 0.4
          ? "Not bad! Keep exploring to level up."
          : "Every chart expert started here. Try again!";

  const newBest = score >= best && score > 0;

  return (
    <div className="mx-auto max-w-2xl animate-in fade-in zoom-in-95 duration-500 text-center">
      <div className="mb-6 flex justify-center">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-3xl text-primary"
          style={{ backgroundColor: "hsl(var(--primary) / 0.1)" }}
        >
          <Trophy size={36} />
        </div>
      </div>
      <h1 className="font-display text-5xl md:text-6xl">
        {score}/{TOTAL}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{message}</p>

      {newBest && (
        <p
          className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-background"
          style={{ backgroundColor: "hsl(var(--chart-5))" }}
        >
          <Sparkles size={14} /> New personal best!
        </p>
      )}

      <div className="mt-8 flex items-center justify-center gap-4 text-sm">
        <div className="rounded-xl border border-border bg-card px-5 py-3">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            This round
          </div>
          <div className="mt-1 font-display text-2xl">
            {score}/{TOTAL}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card px-5 py-3">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Best ever
          </div>
          <div className="mt-1 font-display text-2xl">
            {Math.max(best, score)}/{TOTAL}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: "hsl(var(--foreground))" }}
        >
          <RotateCcw size={14} /> Play again
        </button>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Explore charts <ArrowRight size={14} />
        </Link>
        <button
          onClick={onHome}
          className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Change mode
        </button>
      </div>
    </div>
  );
}
