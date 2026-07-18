import { FolderTree, GitBranch, Tags, Search, FileText, Users, Shield, Activity, Star, Layers, Database, Sparkles } from "lucide-react";

const groups = [
  {
    title: "Organize",
    items: [
      [FolderTree, "Collections", "Group related datasets into projects. Nest with folders."],
      [Tags, "Tags & metadata", "Every dataset carries its story: source, owner, domain, freshness."],
      [Star, "Favorites", "One-click pin the datasets you touch every day."],
      [Layers, "Archive", "Get old work out of the way without deleting it."],
    ],
  },
  {
    title: "Version & document",
    items: [
      [GitBranch, "Version history", "Every upload is a version with row/column diffs and change notes."],
      [FileText, "Rich notes", "Document columns, caveats, and how the data was collected."],
      [Activity, "Activity timeline", "A full audit trail of who did what and when."],
      [Sparkles, "Dataset health", "Row counts, null rates and simple checks at a glance."],
    ],
  },
  {
    title: "Find & share",
    items: [
      [Search, "Smart search", "Search across names, tags, columns and notes."],
      [Database, "Live preview", "First 50 rows and schema, no download required."],
      [Users, "Collaboration", "Share collections with teammates."],
      [Shield, "Permissions", "Owner-only by default. Extend when you're ready."],
    ],
  },
];

export default function Features() {
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Features</p>
        <h1 className="font-display text-5xl md:text-6xl">Everything you need to run a data team.</h1>
        <p className="mt-4 text-muted-foreground">Sixteen focused features. Zero clutter.</p>
      </div>

      <div className="mx-auto mt-20 max-w-6xl space-y-20">
        {groups.map((g) => (
          <div key={g.title}>
            <h2 className="font-display text-3xl">{g.title}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {g.items.map(([Icon, t, d]) => (
                <div key={t as string} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {/* @ts-expect-error dyn */}
                    <Icon size={18} />
                  </div>
                  <h3 className="font-medium">{t as string}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{d as string}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
