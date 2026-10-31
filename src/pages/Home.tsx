import { useSeo } from "@/hooks/use-seo";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { CHARTS, type Chart } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import {
  ArrowRight, Sparkles, Search, Trophy, Shuffle, PartyPopper, Wand2, Compass,
  Github, Globe, Linkedin, Check, X, Gamepad2, Code2,
} from "lucide-react";
import { useUI } from "@/lib/store";
import { ChartStudio } from "@/components/viz/ChartStudio";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function newRound() {
  const answer = CHARTS[Math.floor(Math.random() * CHARTS.length)];
  const options = shuffle([answer, ...shuffle(CHARTS.filter((c) => c.slug !== answer.slug)).slice(0, 3)]);
  return { answer, options };
}

export default function Home() {
  useSeo({ title: "ChartWorld — Play, Explore & Learn Every Chart", description: "A playful world for discovering charts: take the personality quiz, guess charts, spin for a surprise, and copy runnable Python code.", path: "/" });
  const { setSearchOpen } = useUI();

  return (
    <div className="container max-w-5xl pb-12">
      {/* Greeting bar — not a hero, a welcome mat */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6" data-reveal>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Welcome to ChartWorld 👋</p>
          <h1 className="mt-1 font-display text-3xl md:text-5xl">What do you feel like <span className="text-gradient">playing</span> today?</h1>
        </div>
        <button
          onClick={() => setSearchOpen(true)}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Search size={14} /> Find a chart
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
        </button>
      </div>

      {/* Game board — bento of activities, newest first */}
      <section className="grid auto-rows-[minmax(150px,auto)] gap-4 md:grid-cols-4" data-reveal>
        <Link to="/personality" className="card-lift group relative overflow-hidden rounded-3xl border border-primary/40 bg-card p-6 shadow-card md:col-span-2 md:row-span-2">
          <div className="absolute inset-0 mesh-bg opacity-40" />
          <div className="relative flex h-full flex-col">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              <Sparkles size={11} /> New
            </span>
            <PartyPopper className="mt-6 text-primary" size={36} />
            <h2 className="mt-3 font-display text-3xl md:text-4xl">Which chart are you?</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">5 silly questions. One surprisingly accurate chart personality. Share it with friends.</p>
            <div className="mt-auto pt-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform group-hover:scale-[1.03]">
                Find my chart <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </Link>

        <Tile to="/quiz" icon={<Trophy size={22} />} title="Chart Quiz" desc="10 questions. Beat your best." className="md:col-span-2" />
        <Tile to="/surprise" icon={<Shuffle size={22} />} title="Surprise me" desc="Spin for a random chart." />
        <Tile to="/recommend" icon={<Wand2 size={22} />} title="Ask the AI" desc="Describe data, get charts." />
      </section>

      {/* Inline mini-game */}
      <GuessGame />

      {/* Swipeable shelf */}
      <section className="mt-14" data-reveal>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl md:text-3xl">🎠 Swipe through the chart shelf</h2>
          <Link to="/explore" className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-primary hover:underline">
            All {CHARTS.length} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4">
          {CHARTS.slice(0, 14).map((c, i) => (
            <Link
              key={c.slug}
              to={`/chart/${c.slug}`}
              className="card-lift w-48 shrink-0 snap-start rounded-2xl border border-border bg-card p-3 shadow-sm"
              style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}
            >
              <div className="overflow-hidden rounded-xl bg-surface-2 p-1">
                <ChartPreview kind={c.preview} height={90} seed={c.slug.length * 5} />
              </div>
              <p className="mt-2 truncate font-display text-lg">{c.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{c.category}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick wanders */}
      <section className="mt-10 flex flex-wrap gap-2" data-reveal>
        <span className="mr-2 self-center text-sm text-muted-foreground">Wander by mood:</span>
        {["Comparison", "Time Series", "Distribution", "Relationship", "Composition", "Flow", "Maps", "Machine Learning"].map((c) => (
          <Link key={c} to={`/explore?cat=${encodeURIComponent(c)}`} className="glass rounded-full px-4 py-2 text-sm transition-transform hover:-translate-y-0.5">
            {c}
          </Link>
        ))}
        <Link to="/chooser" className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm text-background">
          <Compass size={14} /> Help me choose
        </Link>
      </section>

      {/* Studio */}
      <section className="mt-16" data-reveal>
        <div className="mb-4 flex items-center gap-2">
          <Code2 size={18} className="text-primary" />
          <h2 className="font-display text-2xl md:text-3xl">Build your own — then copy the Python</h2>
        </div>
        <ChartStudio compact />
      </section>

      {/* Creator note — small, personal */}
      <section className="mt-16 flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-6 md:flex-row md:items-center" data-reveal>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">DK</span>
        <p className="flex-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Made by Diini Kahiye</span> — a data analyst who got curious about charts and built this to save everyone some time.
        </p>
        <div className="flex gap-2">
          <Social href="https://www.diinikahiye.online/" label="Portfolio"><Globe size={16} /></Social>
          <Social href="https://github.com/Diini03" label="GitHub"><Github size={16} /></Social>
          <Social href="https://www.linkedin.com/in/diinikahiye/" label="LinkedIn"><Linkedin size={16} /></Social>
        </div>
      </section>
    </div>
  );
}

function Tile({ to, icon, title, desc, className = "" }: { to: string; icon: React.ReactNode; title: string; desc: string; className?: string }) {
  return (
    <Link to={to} className={`card-lift group flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-sm ${className}`}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:rotate-12">{icon}</div>
      <div className="mt-4">
        <h3 className="font-display text-xl">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </Link>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="glass flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground">
      {children}
    </a>
  );
}

function GuessGame() {
  const [round, setRound] = useState(newRound);
  const [picked, setPicked] = useState<Chart | null>(null);
  const [streak, setStreak] = useState(0);
  const seed = useMemo(() => round.answer.slug.length * 7, [round]);

  const choose = (c: Chart) => {
    if (picked) return;
    setPicked(c);
    setStreak((s) => (c.slug === round.answer.slug ? s + 1 : 0));
  };
  const next = () => { setRound(newRound()); setPicked(null); };

  return (
    <section className="mt-14 rounded-3xl border border-border bg-card p-6 shadow-card md:p-8" data-reveal>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Gamepad2 size={20} className="text-primary" />
          <h2 className="font-display text-2xl md:text-3xl">Quick game: name this chart</h2>
        </div>
        <span className="rounded-full bg-surface-2 px-3 py-1 font-mono text-xs">🔥 Streak {streak}</span>
      </div>
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface-2 p-3">
          <ChartPreview kind={round.answer.preview} height={200} seed={seed} />
        </div>
        <div className="flex flex-col gap-2">
          {round.options.map((o) => {
            const right = picked && o.slug === round.answer.slug;
            const wrong = picked && picked.slug === o.slug && !right;
            return (
              <button
                key={o.slug}
                onClick={() => choose(o)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all focus-ring ${
                  right ? "border-primary bg-primary/10" : wrong ? "border-destructive bg-destructive/10" : "border-border bg-surface/60 hover:border-primary/40 hover:bg-surface-2"
                }`}
              >
                {o.name}
                {right && <Check size={16} className="text-primary" />}
                {wrong && <X size={16} className="text-destructive" />}
              </button>
            );
          })}
          {picked && (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button onClick={next} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">
                Next one <ArrowRight size={14} />
              </button>
              <Link to={`/chart/${round.answer.slug}`} className="text-sm text-primary hover:underline">Learn {round.answer.name} →</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
