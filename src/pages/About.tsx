export default function About() {
  return (
    <div className="container py-10">
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">About</p>
        <h1 className="font-display text-5xl md:text-6xl">Built to be enjoyed.</h1>
      </header>

      <div className="mx-auto mt-12 max-w-3xl space-y-6 text-lg leading-relaxed text-foreground/90">
        <p>
          <strong>ChartWorld</strong> is an interactive world for discovering charts. It was designed around a single belief: <em>learning data visualisation should feel like exploration, not homework.</em>
        </p>
        <p>
          Every chart on this site has its own page — a large interactive preview, a plain-English summary, honest advice on when to use it (and when not to), a business-flavoured example, and copy-paste Python code in three libraries.
        </p>
        <p>
          There are no dashboards to configure, no accounts to create, no cookies to consent to. Just charts.
        </p>
        <h2 className="mt-12 font-display text-3xl">Principles</h2>
        <ul className="list-none space-y-3 pl-0">
          <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />Every interaction should teach something.</li>
          <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />Colour, motion, and typography are tools — not decoration.</li>
          <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />Explain the trade-offs, not just the shape.</li>
          <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />Make it fast. Make it accessible. Make it enjoyable.</li>
        </ul>
        <h2 className="mt-12 font-display text-3xl">Built with</h2>
        <p>React, TypeScript, Vite, Tailwind, Recharts, Fuse.js, and a lot of care.</p>
      </div>
    </div>
  );
}
