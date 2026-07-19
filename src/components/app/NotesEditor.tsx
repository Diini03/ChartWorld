import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Trash2, Send, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listNotes, createNote, deleteNote, listProfiles, getProfilesByIds, type ProfileLite } from "@/lib/notes";
import { supabase } from "@/integrations/supabase/client";

type Props = { datasetId: string };

export function NotesEditor({ datasetId }: Props) {
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const { data: notes = [] } = useQuery({ queryKey: ["notes", datasetId], queryFn: () => listNotes(datasetId) });
  const { data: candidates = [] } = useQuery({
    queryKey: ["mention-profiles", mentionQuery ?? ""],
    queryFn: () => listProfiles(mentionQuery ?? undefined),
    enabled: mentionQuery !== null,
  });

  // Load author profiles for display
  const authorIds = useMemo(() => Array.from(new Set(notes.map((n) => n.author_id))), [notes]);
  const { data: authors = {} } = useQuery({
    queryKey: ["authors", authorIds.join(",")],
    queryFn: () => getProfilesByIds(authorIds),
    enabled: authorIds.length > 0,
  });

  // Detect mention trigger
  function onChange(v: string) {
    setBody(v);
    const el = taRef.current;
    if (!el) return;
    const caret = el.selectionStart ?? v.length;
    const upto = v.slice(0, caret);
    const m = upto.match(/(?:^|\s)@([\w-]{0,30})$/);
    if (m) {
      setMentionQuery(m[1]);
      setMentionIndex(0);
    } else {
      setMentionQuery(null);
    }
  }

  function insertMention(p: ProfileLite) {
    const el = taRef.current;
    if (!el) return;
    const caret = el.selectionStart ?? body.length;
    const before = body.slice(0, caret).replace(/@([\w-]{0,30})$/, "");
    const after = body.slice(caret);
    const name = (p.display_name || "user").replace(/\s+/g, "-");
    const token = `@[${name}](${p.id}) `;
    const next = before + token + after;
    setBody(next);
    setMentionQuery(null);
    requestAnimationFrame(() => {
      el.focus();
      const pos = (before + token).length;
      el.setSelectionRange(pos, pos);
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (mentionQuery !== null && candidates.length > 0) {
      if (e.key === "ArrowDown") { e.preventDefault(); setMentionIndex((i) => (i + 1) % candidates.length); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setMentionIndex((i) => (i - 1 + candidates.length) % candidates.length); return; }
      if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); insertMention(candidates[mentionIndex]); return; }
      if (e.key === "Escape") { setMentionQuery(null); return; }
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); void onSubmit(); }
  }

  async function onSubmit() {
    if (!body.trim()) return;
    setSaving(true);
    try {
      await createNote(datasetId, body.trim());
      setBody("");
      qc.invalidateQueries({ queryKey: ["notes", datasetId] });
      toast.success("Note added");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save note");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this note?")) return;
    await deleteNote(id);
    qc.invalidateQueries({ queryKey: ["notes", datasetId] });
  }

  return (
    <div className="space-y-6">
      {/* Composer */}
      <div className="rounded-xl border border-border bg-surface p-3 shadow-soft">
        <Tabs defaultValue="write">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <div className="hidden text-[11px] text-muted-foreground sm:block">
              Markdown supported · type <span className="rounded bg-surface-2 px-1 font-mono">@</span> to mention · ⌘+↵ to save
            </div>
          </div>

          <TabsContent value="write" className="mt-3">
            <div className="relative">
              <textarea
                ref={taRef}
                value={body}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                rows={5}
                placeholder="Add a note… use **markdown** and @mentions"
                className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
              />
              {mentionQuery !== null && candidates.length > 0 && (
                <div className="absolute left-3 top-full z-20 mt-1 w-64 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
                  {candidates.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); insertMention(p); }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${i === mentionIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}`}
                    >
                      <AtSign size={12} className="text-muted-foreground" />
                      <span className="flex-1 truncate">{p.display_name || "Unnamed"}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-3">
            <div className="min-h-[7rem] rounded-lg border border-border bg-background px-4 py-3">
              {body.trim() ? <MarkdownWithMentions text={body} /> : <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-3 flex justify-end">
          <Button size="sm" onClick={onSubmit} disabled={saving || !body.trim()}>
            <Send size={14} /> {saving ? "Saving…" : "Post note"}
          </Button>
        </div>
      </div>

      {/* Notes list */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No notes yet. Document decisions, caveats, and open questions here.
          </div>
        ) : (
          notes.map((n) => {
            const author = (authors as Record<string, ProfileLite>)[n.author_id];
            const initials = (author?.display_name || "?").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
            return (
              <div key={n.id} className="rounded-xl border border-border bg-surface p-4 shadow-soft">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-medium text-primary">{initials}</div>
                    <div>
                      <div className="text-sm font-medium">{author?.display_name ?? "Unknown"}</div>
                      <div className="text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(n.id)} className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive">
                    <Trash2 size={13} />
                  </Button>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <MarkdownWithMentions text={n.body} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/** Render markdown, converting `@[name](id)` tokens into pill mentions. */
function MarkdownWithMentions({ text }: { text: string }) {
  // Convert @[name](id) -> `@name` styled via a placeholder token that we then style.
  // We use a zero-width sentinel so ReactMarkdown treats it as inline text.
  const rendered = text.replace(/@\[([^\]]+)\]\(([^)]+)\)/g, "`@$1`");
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }: any) {
          const value = String(children);
          if (inline && value.startsWith("@")) {
            return <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">{value}</span>;
          }
          return <code className={className} {...props}>{children}</code>;
        },
        a({ children, href }) { return <a href={href} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2">{children}</a>; },
      }}
    >
      {rendered}
    </ReactMarkdown>
  );
}
