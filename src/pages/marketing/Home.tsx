import { Link } from "react-router-dom";
import {
  ArrowRight, FolderTree, GitBranch, Tags, Search, FileText, Users, Shield, Activity,
  Star, Layers, Sparkles, Database, Wand2, FileBarChart2, CheckCircle2,
  UserPlus, Upload, Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="absolute inset-0 grain opacity-40 pointer-events-none" />
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              A workspace for data teams
            </div>
            <h1 className="animate-fade-in font-display text-5xl leading-[1.05] md:text-7xl" style={{ animationDelay: "60ms", animationFillMode: "backwards" }}>
              Manage every dataset in one place
            </h1>
            <p className="mx-auto mt-6 max-w-xl animate-fade-in text-lg text-muted-foreground" style={{ animationDelay: "140ms", animationFillMode: "backwards" }}>
              RaadRaac is a modern workspace for analysts, researchers, NGOs and students
              to organize, version and document datasets — before analysis begins.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: "220ms", animationFillMode: "backwards" }}>
              <Button asChild size="lg" className="gap-2 hover-scale">
                <Link to="/auth?mode=signup">Get started free <ArrowRight size={16} /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/features">Explore features</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Free during beta · Browse the site without signing up</p>
          </div>

          {/* App preview mock */}
          <div className="mx-auto mt-16 max-w-6xl animate-fade-in" style={{ animationDelay: "320ms", animationFillMode: "backwards" }}>
            <AppPreview />
          </div>
        </div>
      </section>

      {/* GETTING STARTED */}
      <section className="border-y border-border/60 bg-surface-2/40">
        <div className="container py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Getting started</p>
            <h2 className="font-display text-4xl md:text-5xl">Three steps to a tidy data workspace.</h2>
            <p className="mt-4 text-muted-foreground">
              You'll be organizing your first dataset in under a minute.
            </p>
          </div>
          <ol className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              [UserPlus, "1", "Create an account", "Sign up with email or Google. Your workspace is ready instantly — no setup, no credit card."],
              [Upload, "2", "Upload and organize", "Drag in CSV files, add tags and descriptions, and group them into collections that make sense for your team."],
              [Share2, "3", "Clean or export", "Send a dataset to NadiifiData for cleaning, or export the canonical version anywhere you need it."],
            ].map(([Icon, step, title, desc]) => (
              <li key={step as string} className="relative rounded-2xl border border-border bg-surface p-6 shadow-soft transition-all hover:shadow-card">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {/* @ts-ignore */}
                    <Icon size={18} />
                  </div>
                  <span className="font-display text-3xl text-muted-foreground/40">{step as string}</span>
                </div>
                <h3 className="font-display text-xl">{title as string}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc as string}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/auth?mode=signup">Create your workspace <ArrowRight size={16} /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="border-y border-border/60 bg-surface-2/40">
        <div className="container py-10">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Trusted by teams at research labs, NGOs and universities
          </p>
          <div className="grid grid-cols-2 gap-6 opacity-70 md:grid-cols-6">
            {["Northlake University", "Meridian Labs", "OpenHealth", "Civic Data", "Field Notes", "Atlas Analytics"].map((n) => (
              <div key={n} className="font-display text-center text-sm text-muted-foreground">{n}</div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">The problem</p>
          <h2 className="font-display text-4xl md:text-5xl">Your datasets deserve better than a Downloads folder.</h2>
          <p className="mt-4 text-muted-foreground">
            Every analyst knows the drill. Duplicate CSVs. Cryptic filenames.
            Nobody remembers which version was cleaned. That ends here.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">
          {[
            ["CSV files everywhere", "customers_final_FINAL_v3(1).csv doesn't cut it."],
            ["Version confusion", "Which cleanup ran on which file? Nobody knows."],
            ["Missing documentation", "What does column K actually mean?"],
            ["No ownership", "Who created this? Can I trust it?"],
            ["Duplicate work", "Three analysts, three copies, three cleanups."],
            ["Lost datasets", "It's on someone's laptop. Somewhere."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <div className="mb-2 h-2 w-2 rounded-full bg-primary" />
              <h3 className="font-medium">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTION */}
      <section className="border-y border-border/60 bg-surface-2/40 py-24">
        <div className="container">
          <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">The solution</p>
              <h2 className="font-display text-4xl md:text-5xl">
                One workspace. Every dataset. Every version.
              </h2>
              <p className="mt-4 text-muted-foreground">
                RaadRaac is where your team keeps its data. Upload once, document it well,
                track every change, and never lose track of what's canonical.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Upload CSVs and preview them instantly",
                  "Track versions with clear diffs and notes",
                  "Tag, search and organize into collections",
                  "See who touched what, when and why",
                ].map((l) => (
                  <li key={l} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild><Link to="/auth?mode=signup">Try it free</Link></Button>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
              <div className="mb-4 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" /> customers.csv · v4
              </div>
              <div className="space-y-2 font-mono text-xs">
                {[
                  ["+", "Added `signup_source` column", "text-success"],
                  ["±", "Renamed `dob` → `birth_date`", "text-warning"],
                  ["-", "Dropped 42 duplicate rows", "text-destructive"],
                  ["+", "Filled 128 null values in `country`", "text-success"],
                ].map(([sym, msg, cls]) => (
                  <div key={msg as string} className="flex items-start gap-3 rounded-md bg-surface-2 px-3 py-2">
                    <span className={`w-3 shrink-0 ${cls}`}>{sym}</span>
                    <span>{msg}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span>Anna · 2 hours ago</span>
                <span className="font-mono">12,842 rows · 18 cols</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Features</p>
          <h2 className="font-display text-4xl md:text-5xl">Built for how you actually work with data.</h2>
        </div>
        <div className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[
            [FolderTree, "Collections", "Group related datasets into projects."],
            [GitBranch, "Version history", "Every upload is a new version."],
            [FileText, "Documentation", "Rich notes and column descriptions."],
            [Tags, "Tags & metadata", "Find datasets by domain, source, owner."],
            [Search, "Smart search", "Search names, tags, columns, notes."],
            [Star, "Favorites", "Pin the datasets you use every day."],
            [Layers, "Schema viewer", "Column types, nullability, samples."],
            [Database, "Live preview", "See the first 50 rows instantly."],
            [Users, "Team collaboration", "Share collections with your team."],
            [Shield, "Permissions", "Control who reads and writes."],
            [Activity, "Activity timeline", "A full trail of what changed."],
            [Sparkles, "Dataset health", "Row counts, nulls and drift at a glance."],
          ].map(([Icon, t, d]) => (
            <div key={t as string} className="group rounded-2xl border border-border bg-surface p-5 shadow-soft transition-all hover:shadow-card">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {/* @ts-ignore */}
                <Icon size={18} />
              </div>
              <h3 className="font-medium">{t as string}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d as string}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="border-y border-border/60 bg-surface-2/40 py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">The ecosystem</p>
            <h2 className="font-display text-4xl md:text-5xl">One workflow, three products.</h2>
            <p className="mt-4 text-muted-foreground">
              RaadRaac hands off cleanly to the rest of the modern data stack.
            </p>
          </div>
          <div className="mx-auto mt-14 grid max-w-5xl items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {[
              { Icon: Database, name: "RaadRaac", sub: "Organize & manage", tone: "primary", active: true },
              { Icon: Wand2, name: "NadiifiData", sub: "Clean & analyze", tone: "accent", active: false },
              { Icon: FileBarChart2, name: "XogArag", sub: "Report & present", tone: "foreground", active: false },
            ].flatMap((n, i, arr) => {
              const iconBg = n.tone === "primary" ? "bg-primary/10 text-primary" : n.tone === "accent" ? "bg-accent/10 text-accent" : "bg-foreground/10 text-foreground";
              const ring = n.active ? "ring-2 ring-primary/40" : "";
              const card = (
                <div key={n.name} className={`relative rounded-2xl border border-border bg-surface p-8 text-center shadow-soft transition-all hover:shadow-card ${ring}`}>
                  <div className={`mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
                    {/* @ts-ignore */}
                    <n.Icon size={22} />
                  </div>
                  <h3 className="font-display text-2xl">{n.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{n.sub}</p>
                  {n.active && (
                    <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                      You are here
                    </span>
                  )}
                </div>
              );
              if (i === arr.length - 1) return [card];
              return [
                card,
                <div key={`arrow-${i}`} className="flex items-center justify-center py-4 md:py-0">
                  <ArrowRight size={22} className="rotate-90 text-muted-foreground md:rotate-0" />
                </div>,
              ];
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Loved by data people</p>
          <h2 className="font-display text-4xl md:text-5xl">A calmer way to work.</h2>
        </div>
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
          {[
            ["I stopped losing datasets. That alone is worth it.", "Amina K.", "Data analyst, NGO"],
            ["Finally, a place to keep our team's data organized.", "Marco L.", "Research lead"],
            ["The version history saved me from a very bad Monday.", "Sana P.", "Analytics manager"],
          ].map(([q, n, r]) => (
            <figure key={n} className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <blockquote className="font-display text-lg leading-snug">"{q}"</blockquote>
              <figcaption className="mt-6 text-sm">
                <div className="font-medium">{n}</div>
                <div className="text-muted-foreground">{r}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* PRICING PLACEHOLDER */}
      <section className="border-y border-border/60 bg-surface-2/40 py-24">
        <div className="container text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Pricing</p>
          <h2 className="font-display text-4xl md:text-5xl">Simple, honest pricing.</h2>
          <p className="mt-4 text-muted-foreground">Start free. Scale when you need to.</p>
          <div className="mt-8"><Button asChild variant="outline"><Link to="/pricing">See plans</Link></Button></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-center font-mono text-xs uppercase tracking-widest text-primary">Questions</p>
          <h2 className="mb-10 text-center font-display text-4xl md:text-5xl">Frequently asked.</h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              ["What file types do you support?", "CSV today. Parquet, JSON, and Excel are on the roadmap."],
              ["Where is my data stored?", "In your own private, encrypted workspace. Only you and your team have access."],
              ["Can I collaborate with others?", "Yes — invite teammates to collections with granular permissions."],
              ["Does RaadRaac clean my data?", "No — RaadRaac is for organizing. Use NadiifiData to clean and profile datasets."],
              ["Is there a free tier?", "Yes. RaadRaac is free during beta."],
            ].map(([q, a], i) => (
              <AccordionItem key={i} value={`i-${i}`}>
                <AccordionTrigger className="text-left font-medium">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-12 text-center shadow-card md:p-20">
          <div className="absolute inset-0 hero-glow pointer-events-none" />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-5xl">Ready to organize your data?</h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">Set up your workspace in under a minute.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg"><Link to="/auth?mode=signup">Get started free</Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/contact">Talk to us</Link></Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function AppPreview() {
  return (
    <div className="relative rounded-2xl border border-border bg-surface shadow-float">
      <div className="flex h-9 items-center gap-1.5 border-b border-border px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <div className="mx-auto rounded-md bg-surface-2 px-3 py-0.5 text-[11px] font-mono text-muted-foreground">
          raadraac.app/library
        </div>
      </div>
      <div className="grid grid-cols-[220px_1fr_260px] overflow-hidden">
        {/* sidebar */}
        <aside className="border-r border-border bg-surface-2/40 p-3 text-sm">
          <div className="mb-2 px-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Workspace</div>
          {["Library", "Favorites", "Recent", "Archive"].map((l, i) => (
            <div key={l} className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 0 ? "bg-primary/10 text-foreground" : "text-muted-foreground"}`}>
              <div className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />{l}
            </div>
          ))}
          <div className="mt-4 mb-2 px-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Collections</div>
          {["Customer research", "Sales pipeline", "Field survey 2025"].map((l) => (
            <div key={l} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground">
              <FolderTree size={12} />{l}
            </div>
          ))}
        </aside>

        {/* main */}
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl">Library</h3>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span className="rounded-md bg-surface-2 px-2 py-1">Grid</span>
              <span className="rounded-md px-2 py-1">Table</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["customers.csv", "v4", "12.8k rows"],
              ["orders.csv", "v2", "48.2k rows"],
              ["survey_q1.csv", "v1", "3.4k rows"],
              ["products.csv", "v7", "1.2k rows"],
              ["sessions.csv", "v3", "94.1k rows"],
              ["events.csv", "v5", "230k rows"],
            ].map(([n, v, r]) => (
              <div key={n} className="rounded-lg border border-border bg-surface p-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary text-[10px] font-mono">CSV</div>
                  <span className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{v}</span>
                </div>
                <div className="mt-3 truncate text-sm font-medium">{n}</div>
                <div className="text-[11px] text-muted-foreground">{r}</div>
              </div>
            ))}
          </div>
        </div>

        {/* inspector */}
        <aside className="border-l border-border bg-surface-2/40 p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 font-mono text-xs text-primary">CSV</div>
          <div className="text-sm font-medium">customers.csv</div>
          <div className="mt-1 text-xs text-muted-foreground">Owned by Anna · updated 2h ago</div>
          <div className="mt-4 space-y-2 text-xs">
            {[["Rows", "12,842"], ["Columns", "18"], ["Size", "2.4 MB"], ["Version", "4"]].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span><span className="font-mono">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-1">
            {["customers", "clean", "q4-2025"].map((t) => (
              <span key={t} className="rounded-full bg-surface-3 px-2 py-0.5 text-[10px]">{t}</span>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
