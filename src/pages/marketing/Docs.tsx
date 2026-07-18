import { useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  {
    id: "intro",
    title: "Introduction",
    body: (
      <>
        <p>RaadRaac is a modern workspace for managing datasets before analysis.</p>
        <p>It replaces scattered CSV folders with a single, organized, versioned library.</p>
      </>
    ),
  },
  {
    id: "upload",
    title: "Uploading datasets",
    body: (
      <>
        <p>From your workspace, click <em>Upload</em> and select a CSV.</p>
        <p>RaadRaac reads the file, detects columns, counts rows and creates version 1.</p>
      </>
    ),
  },
  {
    id: "versions",
    title: "Versions",
    body: (
      <>
        <p>Every re-upload creates a new numbered version.</p>
        <p>Write a change note so your team knows what happened.</p>
      </>
    ),
  },
  {
    id: "collections",
    title: "Collections & folders",
    body: (
      <>
        <p>Group related datasets into <em>Collections</em>.</p>
        <p>Use folders inside collections to organize further.</p>
      </>
    ),
  },
  {
    id: "search",
    title: "Search",
    body: <p>Press <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-xs">⌘K</kbd> anywhere to search across everything.</p>,
  },
];

export default function Docs() {
  const [active, setActive] = useState(sections[0].id);
  const current = sections.find((s) => s.id === active)!;
  return (
    <section className="container py-16">
      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <p className="mb-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">Docs</p>
          <ul className="space-y-1">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                    active === s.id ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:bg-surface-2/60"
                  )}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="font-display text-4xl">{current.title}</h1>
          <div className="mt-6 space-y-4 text-muted-foreground">{current.body}</div>
        </article>
      </div>
    </section>
  );
}
