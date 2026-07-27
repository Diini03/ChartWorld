import { ExternalLink } from "lucide-react";

const RESOURCES = [
  { cat: "Books", items: [
    { title: "The Visual Display of Quantitative Information", by: "Edward Tufte", url: "https://www.edwardtufte.com/tufte/books_vdqi", note: "The canonical text on chart design." },
    { title: "Storytelling with Data", by: "Cole Nussbaumer Knaflic", url: "https://www.storytellingwithdata.com/", note: "Business communication with charts." },
    { title: "Fundamentals of Data Visualization", by: "Claus O. Wilke", url: "https://clauswilke.com/dataviz/", note: "Free online, superb reference." },
  ] },
  { cat: "Galleries", items: [
    { title: "The Python Graph Gallery", by: "Yan Holtz", url: "https://python-graph-gallery.com/", note: "Hundreds of chart recipes." },
    { title: "From Data to Viz", by: "Yan Holtz & Conor Healy", url: "https://www.data-to-viz.com/", note: "A decision tree for choosing charts." },
    { title: "Observable", by: "Mike Bostock & team", url: "https://observablehq.com/", note: "Interactive notebooks by the creator of D3." },
  ] },
  { cat: "Tools", items: [
    { title: "Matplotlib docs", by: "The library", url: "https://matplotlib.org/", note: "The reference." },
    { title: "Seaborn docs", by: "Michael Waskom", url: "https://seaborn.pydata.org/", note: "Concise tutorials." },
    { title: "Plotly Python", by: "Plotly", url: "https://plotly.com/python/", note: "Interactive charts, one line each." },
  ] },
  { cat: "Colour", items: [
    { title: "ColorBrewer", by: "Cynthia Brewer", url: "https://colorbrewer2.org/", note: "The definitive palettes for maps and charts." },
    { title: "Viridis palettes", by: "Nathaniel Smith", url: "https://cran.r-project.org/web/packages/viridis/vignettes/intro-to-viridis.html", note: "Perceptually-uniform colourmaps." },
  ] },
];

export default function Resources() {
  return (
    <div className="container py-10">
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Resources</p>
        <h1 className="font-display text-5xl md:text-6xl">The bookshelf.</h1>
        <p className="mt-4 text-muted-foreground">A curated list of what shaped ChartWorld.</p>
      </header>

      <div className="mt-16 space-y-12">
        {RESOURCES.map((g) => (
          <section key={g.cat}>
            <h2 className="mb-6 font-display text-3xl">{g.cat}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {g.items.map((i) => (
                <a key={i.title} href={i.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="font-display text-lg leading-snug">{i.title}</div>
                    <ExternalLink size={14} className="mt-1 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{i.by}</div>
                  <div className="mt-3 text-sm">{i.note}</div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
