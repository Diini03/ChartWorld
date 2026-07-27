import { Github, Globe, Linkedin, ArrowUpRight } from "lucide-react";

const CARDS = [
  {
    icon: Github,
    label: "GitHub",
    handle: "@Diini03",
    desc: "Open-source projects, experiments, and continuous development.",
    url: "https://github.com/Diini03",
    gradient: "from-[#7c3aed] via-[#a855f7] to-[#ec4899]",
  },
  {
    icon: Globe,
    label: "Portfolio",
    handle: "diinikahiye.online",
    desc: "The main place to explore projects and technical work.",
    url: "https://www.diinikahiye.online/",
    gradient: "from-[#0ea5e9] via-[#06b6d4] to-[#10b981]",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    handle: "diinikahiye",
    desc: "Professional updates, articles, and networking.",
    url: "https://www.linkedin.com/in/diinikahiye/",
    gradient: "from-[#f59e0b] via-[#ef4444] to-[#8b5cf6]",
  },
];

export default function Muuji() {
  return (
    <div className="container py-10">
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Muuji</p>
        <h1 className="font-display text-5xl md:text-6xl">Say hello.</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          ChartWorld is part of a personal ecosystem focused on helping people learn data and build practical skills. If any of that resonates, I'd love to hear from you.
        </p>
      </header>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
        {CARDS.map((c, i) => (
          <a
            key={c.label}
            href={c.url}
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-lg"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${c.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-15`} />
            <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} text-white shadow-md transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}>
              <c.icon size={22} />
            </div>
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
            <div className="font-display text-2xl">{c.handle}</div>
            <p className="mt-3 text-sm text-muted-foreground">{c.desc}</p>
            <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>
        ))}
      </div>

      <div className="glass mx-auto mt-16 max-w-3xl rounded-3xl p-8 text-center">
        <p className="font-display text-2xl leading-relaxed md:text-3xl">
          "Charts are how we make the invisible visible. The best ones don't decorate data — they let data speak."
        </p>
      </div>
    </div>
  );
}
