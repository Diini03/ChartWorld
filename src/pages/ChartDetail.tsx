import { useSeo } from "@/hooks/use-seo";
import { Link, useParams } from "react-router-dom";
import { chartBySlug, chartsByCategory } from "@/data/charts";
import { ChartPreview } from "@/components/chart/ChartPreview";
import { CodeBlock } from "@/components/chart/CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotFound } from "./NotFound";
import { readySnippets } from "@/lib/viz/snippets";
import { ArrowLeft, Check, X, AlertTriangle, Sparkles, GitCompareArrows } from "lucide-react";

export default function ChartDetail() {
  const { slug = "" } = useParams();
  const chart = chartBySlug(slug);
  useSeo({
    title: chart ? `${chart.name} — When and How to Use It` : "Chart not found",
    description: chart
      ? `${chart.summary} Learn when to use a ${chart.name.toLowerCase()}, what to avoid, and copy ready-made Python code.`
      : "This chart type does not exist in ChartWorld.",
    path: `/chart/${slug}`,
    noIndex: !chart,
    jsonLd: chart
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${chart.name} — When and How to Use It`,
          description: chart.summary,
          about: chart.category,
          isPartOf: { "@type": "WebSite", name: "ChartWorld" },
        }
      : undefined,
  });
  if (!chart) return <NotFound />;
  const related = chart.related.map((s) => chartBySlug(s)).filter(Boolean);
  const alsoInCategory = chartsByCategory(chart.category).filter((c) => c.slug !== chart.slug).slice(0, 4);

  return (
    <div className="container pb-24 pt-4">
      <Link to="/explore" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={14} /> Back to Explore
      </Link>

      {/* Hero */}
      <section className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-12">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary">{chart.category}</span>
            <span className="rounded-full bg-surface-2 px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">{chart.difficulty}</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl">{chart.name}</h1>
          <p className="mt-4 text-xl text-muted-foreground">{chart.tagline}</p>
          <p className="mt-4 text-base leading-relaxed">{chart.summary}</p>
          <div className="mt-6 flex items-center gap-3">
            <Link to="/compare" className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
              <GitCompareArrows size={14} /> Compare
            </Link>
            <Link to="/playground" className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:bg-surface-2">
              <Sparkles size={14} /> Try in Playground
            </Link>
          </div>
        </div>
        <div className="glass overflow-hidden rounded-3xl p-4 shadow-lg">
          <ChartPreview kind={chart.preview} height={360} seed={chart.slug.length + 1} />
        </div>
      </section>

      {/* When to / not to */}
      <section data-reveal className="mt-16 grid gap-6 md:grid-cols-2">
        <Panel icon={<Check size={16} />} title="When to use it" tone="pos">
          <ul className="space-y-2">
            {chart.whenToUse.map((w) => <li key={w} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--chart-5))]" />{w}</li>)}
          </ul>
        </Panel>
        <Panel icon={<X size={16} />} title="When NOT to use it" tone="neg">
          <ul className="space-y-2">
            {chart.whenNotToUse.map((w) => <li key={w} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--chart-3))]" />{w}</li>)}
          </ul>
        </Panel>
      </section>

      {/* Business example */}
      <section data-reveal className="mt-8">
        <div className="glass rounded-3xl p-8">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Business example</p>
          <p className="font-display text-2xl leading-snug md:text-3xl">"{chart.businessExample}"</p>
        </div>
      </section>

      {/* Advantages / Limitations / Mistakes */}
      <section data-reveal className="mt-8 grid gap-6 md:grid-cols-3">
        <SmallList title="Advantages" items={chart.advantages} tone="pos" />
        <SmallList title="Limitations" items={chart.limitations} tone="neu" />
        <SmallList title="Common mistakes" items={chart.mistakes} tone="warn" icon={<AlertTriangle size={14} />} />
      </section>

      {/* Code */}
      <section data-reveal className="mt-16">
        <div className="mb-6">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Python</p>
          <h2 className="font-display text-3xl md:text-4xl">Copy the code you need.</h2>
        </div>
        <Tabs defaultValue={chart.code[0].library}>
          <TabsList className="w-fit">
            {chart.code.map((c) => <TabsTrigger key={c.library} value={c.library}>{c.library}</TabsTrigger>)}
          </TabsList>
          {chart.code.map((c) => (
            <TabsContent key={c.library} value={c.library} className="mt-4">
              <CodeBlock code={c.code} library={c.library} note={c.explanation} />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Ready-to-run templates */}
      <section data-reveal className="mt-16">
        <div className="mb-6">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Start from your own data</p>
          <h2 className="font-display text-3xl md:text-4xl">Ready-to-run templates.</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Complete scripts — imports, CSV load, and plotting included. Change only the column names at the top; everything else runs as-is.
          </p>
        </div>
        <Tabs defaultValue="Matplotlib">
          <TabsList className="w-fit">
            {readySnippets(chart.preview, chart.name).map((s) => <TabsTrigger key={s.library} value={s.library}>{s.library}</TabsTrigger>)}
          </TabsList>
          {readySnippets(chart.preview, chart.name).map((s) => (
            <TabsContent key={s.library} value={s.library} className="mt-4">
              <CodeBlock code={s.code} library={s.library} note={s.note} />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Related */}
      <section data-reveal className="mt-16">
        <h2 className="mb-6 font-display text-3xl">Related charts</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[...related, ...alsoInCategory].slice(0, 4).map((c) => c && (
            <Link key={c.slug} to={`/chart/${c.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-card p-3 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="overflow-hidden rounded-lg bg-surface-2/50 p-1"><ChartPreview kind={c.preview} height={110} seed={c.slug.length} /></div>
              <div className="mt-3 font-display text-lg">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.category}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Panel({ icon, title, tone, children }: any) {
  const toneCls = tone === "pos" ? "text-[hsl(var(--chart-5))]" : tone === "neg" ? "text-[hsl(var(--chart-3))]" : "text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className={`mb-3 flex items-center gap-2 font-medium ${toneCls}`}>{icon}<span>{title}</span></div>
      <div className="text-sm text-foreground/90">{children}</div>
    </div>
  );
}

function SmallList({ title, items, tone, icon }: any) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {icon} {title}
      </div>
      <ul className="space-y-2 text-sm">
        {items.map((i: string) => (
          <li key={i} className="flex gap-2">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone === "pos" ? "bg-[hsl(var(--chart-5))]" : tone === "warn" ? "bg-[hsl(var(--chart-4))]" : "bg-border-strong"}`} />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
