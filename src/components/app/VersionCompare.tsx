import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ArrowRight, Minus, Plus, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DatasetVersion } from "@/lib/datasets";
import { formatBytes } from "@/lib/datasets";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  versions: DatasetVersion[];
  initialFromId?: string;
  initialToId?: string;
};

type Col = { name: string; type: string };

function toCols(v?: DatasetVersion | null): Col[] {
  const raw = (v?.schema as any) ?? [];
  return Array.isArray(raw) ? raw.map((c: any) => ({ name: String(c.name), type: String(c.type ?? "text") })) : [];
}

function diffSchema(a: Col[], b: Col[]) {
  const aMap = new Map(a.map((c) => [c.name, c]));
  const bMap = new Map(b.map((c) => [c.name, c]));
  const added: Col[] = [];
  const removed: Col[] = [];
  const changed: { name: string; from: string; to: string }[] = [];
  const unchanged: Col[] = [];
  for (const c of b) {
    const prev = aMap.get(c.name);
    if (!prev) added.push(c);
    else if (prev.type !== c.type) changed.push({ name: c.name, from: prev.type, to: c.type });
    else unchanged.push(c);
  }
  for (const c of a) if (!bMap.has(c.name)) removed.push(c);
  return { added, removed, changed, unchanged };
}

function metaDiff(a: DatasetVersion, b: DatasetVersion) {
  const rows: { label: string; from: string; to: string; delta?: string }[] = [];
  const num = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString());
  const deltaN = (x?: number | null, y?: number | null) => {
    if (x == null || y == null) return undefined;
    const d = y - x;
    if (d === 0) return undefined;
    return `${d > 0 ? "+" : ""}${d.toLocaleString()}`;
  };
  rows.push({ label: "Rows", from: num(a.row_count), to: num(b.row_count), delta: deltaN(a.row_count, b.row_count) });
  rows.push({ label: "Columns", from: num(a.column_count), to: num(b.column_count), delta: deltaN(a.column_count, b.column_count) });
  rows.push({ label: "File size", from: formatBytes(a.file_size ?? 0), to: formatBytes(b.file_size ?? 0), delta: deltaN(a.file_size, b.file_size) });
  rows.push({ label: "Change note", from: a.change_note ?? "—", to: b.change_note ?? "—" });
  rows.push({ label: "Created", from: format(new Date(a.created_at), "PPp"), to: format(new Date(b.created_at), "PPp") });
  return rows;
}

export function VersionCompare({ open, onOpenChange, versions, initialFromId, initialToId }: Props) {
  const sorted = useMemo(() => [...versions].sort((a, b) => a.version_number - b.version_number), [versions]);
  const defaultTo = initialToId ?? sorted[sorted.length - 1]?.id;
  const defaultFrom = initialFromId ?? sorted[sorted.length - 2]?.id ?? sorted[0]?.id;

  const [fromId, setFromId] = useState<string | undefined>(defaultFrom);
  const [toId, setToId] = useState<string | undefined>(defaultTo);

  const from = sorted.find((v) => v.id === fromId);
  const to = sorted.find((v) => v.id === toId);

  const schemaD = useMemo(() => diffSchema(toCols(from), toCols(to)), [from, to]);
  const metaD = useMemo(() => (from && to ? metaDiff(from, to) : []), [from, to]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Compare versions</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-3">
          <VersionPicker label="Base" value={fromId} onChange={setFromId} options={sorted} />
          <ArrowRight size={16} className="text-muted-foreground" />
          <VersionPicker label="Compare" value={toId} onChange={setToId} options={sorted} />
        </div>

        {!from || !to ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Pick two versions to compare.</p>
        ) : from.id === to.id ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Select two different versions.</p>
        ) : (
          <div className="mt-2 max-h-[65vh] space-y-6 overflow-auto pr-1">
            {/* Summary chips */}
            <div className="flex flex-wrap gap-2 text-xs">
              <Chip icon={<Plus size={11} />} tone="pos" label={`${schemaD.added.length} added`} />
              <Chip icon={<Minus size={11} />} tone="neg" label={`${schemaD.removed.length} removed`} />
              <Chip icon={<Pencil size={11} />} tone="warn" label={`${schemaD.changed.length} type changes`} />
              <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-muted-foreground">{schemaD.unchanged.length} unchanged</span>
            </div>

            {/* Metadata */}
            <section>
              <h3 className="mb-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">Metadata</h3>
              <div className="overflow-hidden rounded-xl border border-border bg-surface">
                <table className="w-full text-sm">
                  <thead className="bg-surface-2/60 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Field</th>
                      <th className="px-3 py-2 text-left font-medium">v{from.version_number}</th>
                      <th className="px-3 py-2 text-left font-medium">v{to.version_number}</th>
                      <th className="px-3 py-2 text-left font-medium">Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metaD.map((r) => {
                      const changed = r.from !== r.to;
                      return (
                        <tr key={r.label} className={`border-t border-border ${changed ? "bg-primary/[0.03]" : ""}`}>
                          <td className="px-3 py-2 text-muted-foreground">{r.label}</td>
                          <td className="px-3 py-2 font-mono text-xs">{r.from}</td>
                          <td className="px-3 py-2 font-mono text-xs">{r.to}</td>
                          <td className="px-3 py-2 font-mono text-xs text-primary">{r.delta ?? (changed ? "changed" : "")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Schema diff */}
            <section>
              <h3 className="mb-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">Schema</h3>
              {schemaD.added.length + schemaD.removed.length + schemaD.changed.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No schema changes between these versions.</p>
              ) : (
                <div className="overflow-hidden rounded-xl border border-border bg-surface">
                  <table className="w-full text-sm">
                    <tbody>
                      {schemaD.added.map((c) => (
                        <DiffRow key={`a-${c.name}`} sign="+" name={c.name} detail={c.type} tone="pos" />
                      ))}
                      {schemaD.removed.map((c) => (
                        <DiffRow key={`r-${c.name}`} sign="−" name={c.name} detail={c.type} tone="neg" />
                      ))}
                      {schemaD.changed.map((c) => (
                        <DiffRow key={`c-${c.name}`} sign="~" name={c.name} detail={`${c.from} → ${c.to}`} tone="warn" />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function VersionPicker({ label, value, onChange, options }: { label: string; value?: string; onChange: (v: string) => void; options: DatasetVersion[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Select…" /></SelectTrigger>
        <SelectContent>
          {options.map((v) => (
            <SelectItem key={v.id} value={v.id}>v{v.version_number} — {format(new Date(v.created_at), "MMM d")}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Chip({ icon, label, tone }: { icon: React.ReactNode; label: string; tone: "pos" | "neg" | "warn" }) {
  const cls =
    tone === "pos" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    : tone === "neg" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
    : "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 ${cls}`}>{icon}{label}</span>;
}

function DiffRow({ sign, name, detail, tone }: { sign: string; name: string; detail: string; tone: "pos" | "neg" | "warn" }) {
  const cls =
    tone === "pos" ? "bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
    : tone === "neg" ? "bg-rose-500/5 text-rose-700 dark:text-rose-300"
    : "bg-amber-500/5 text-amber-700 dark:text-amber-300";
  return (
    <tr className={`border-t border-border ${cls}`}>
      <td className="w-8 px-3 py-2 text-center font-mono">{sign}</td>
      <td className="px-3 py-2 font-mono text-xs">{name}</td>
      <td className="px-3 py-2 text-right font-mono text-xs">{detail}</td>
    </tr>
  );
}
