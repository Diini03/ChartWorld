export default function About() {
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">About</p>
        <h1 className="font-display text-5xl md:text-6xl">A calmer way to work with data.</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          RaadRaac was built by people who spent too many nights hunting for the right CSV.
          We think analysts and researchers deserve the same craftsmanship engineers get from tools like GitHub.
        </p>
        <p className="mt-4 text-lg text-muted-foreground">
          It is the first product in a small ecosystem — RaadRaac to organize, NadiifiData to clean,
          and XogArag to report. Three focused tools, one coherent workflow.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["Care", "Every screen is considered. No busywork."],
            ["Clarity", "One clear place for each thing you do."],
            ["Trust", "Your data stays yours. Always."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <h3 className="font-display text-xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
