import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle, Check, Copy, Download, FileUp, Image, Link2, Sparkles, Table2,
} from "lucide-react";
import { toast } from "sonner";
import { VizChart } from "./VizChart";
import { ControlGroup, Disclosure, SegButtons, Select, Slider, TextInput, Toggle } from "./ui";
import { buildFrame } from "@/lib/viz/transform";
import { BUILDABLE, BUILDABLE_LIST, suggestTypes } from "@/lib/viz/registry";
import { generateCode, type Library } from "@/lib/viz/codegen";
import { PALETTES } from "@/lib/viz/palettes";
import { exportPng, exportSvg, download } from "@/lib/viz/exporters";
import { toCsv, parseFile, DataError } from "@/lib/viz/io";
import { SAMPLE_DATASETS, shareParams, useViz } from "@/lib/viz/store";
import type { Agg, BuildableType, SortOrder } from "@/lib/viz/types";
import { CHARTS } from "@/data/charts";
import { cn } from "@/lib/utils";

type Mode = "build" | "understand" | "code";

export function ChartStudio({ compact = false }: { compact?: boolean }) {
  const { dataset, config, style, patchConfig, patchStyle, setType, addUpload, loadSample, resetStyle } = useViz();
  const [mode, setMode] = useState<Mode>("build");
  const [lib, setLib] = useState<Library>("Matplotlib");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const frame = useMemo(() => buildFrame(dataset, config), [dataset, config]);
  const meta = BUILDABLE[config.type];
  const fieldType = (n?: string) => dataset.fields.find((f) => f.name === n)?.type;
  const suggestions = useMemo(
    () => suggestTypes(fieldType(config.x), fieldType(config.y), !!config.series).filter((t) => t !== config.type).slice(0, 3),
    [dataset, config.x, config.y, config.series, config.type],
  );
  const learn = CHARTS.find((c) => c.slug === meta.learn);
  const code = useMemo(() => generateCode(lib, dataset, config, style), [lib, dataset, config, style]);

  const opts = (types: ("number" | "category" | "date")[]) =>
    dataset.fields.filter((f) => types.includes(f.type)).map((f) => ({ value: f.name, label: f.name }));
  const allOpts = dataset.fields.map((f) => ({ value: f.name, label: `${f.name}` }));

  async function onUpload(file?: File) {
    if (!file) return;
    try {
      const ds = await parseFile(file);
      addUpload(ds);
      toast.success(`Loaded ${ds.name}`, { description: ds.description });
    } catch (e) {
      const err = e as DataError;
      toast.error(err.message ?? "ChartWorld could not read this file.", { description: err.hint });
    }
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
    toast.success("Python copied to clipboard");
  };

  const share = async () => {
    const url = `${window.location.origin}/create?${shareParams(dataset, config, style).toString()}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied", { description: "It rebuilds this exact chart from a sample dataset." });
  };

  return (
    <div className={cn("grid gap-4", compact ? "lg:grid-cols-[260px_1fr]" : "lg:grid-cols-[280px_1fr]")}>
      {/* ---------------- controls ---------------- */}
      <aside className="order-2 space-y-3 lg:order-1">
        <ControlGroup label="Dataset" hint={`${dataset.rows.length.toLocaleString()} rows`}>
          <Select
            ariaLabel="Sample dataset"
            value={dataset.source === "sample" ? dataset.id : ""}
            onChange={(v) => v && loadSample(v)}
            allowEmpty={dataset.source === "upload"}
            emptyLabel={dataset.name}
            options={SAMPLE_DATASETS.map((d) => ({ value: d.id, label: `${d.name} · ${d.domain}` }))}
          />
          <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">{dataset.description}</p>
          <input ref={fileRef} type="file" accept=".csv,.json,.tsv,.txt" className="sr-only"
            onChange={(e) => onUpload(e.target.files?.[0])} />
          <button type="button" onClick={() => fileRef.current?.click()}
            className="focus-ring mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground hover:border-primary hover:text-foreground">
            <FileUp size={13} /> Upload CSV or JSON
          </button>
        </ControlGroup>

        <ControlGroup label="Chart type">
          <div className="grid grid-cols-3 gap-1.5">
            {BUILDABLE_LIST.map((b) => (
              <button key={b.id} type="button" onClick={() => setType(b.id)} title={b.blurb}
                aria-pressed={config.type === b.id}
                className={cn("focus-ring truncate rounded-lg border px-2 py-1.5 text-[11px] transition-colors",
                  config.type === b.id
                    ? "border-primary bg-primary/10 font-medium text-foreground"
                    : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground")}>
                {b.label}
              </button>
            ))}
          </div>
        </ControlGroup>

        <div className="space-y-3 rounded-xl border border-border bg-surface/60 p-3">
          <ControlGroup label="X axis">
            <Select ariaLabel="X axis field" value={config.x} onChange={(x) => patchConfig({ x })} options={allOpts} />
          </ControlGroup>
          {!meta.enc.yOptional && (
            <ControlGroup label="Y axis" hint="numeric">
              <Select ariaLabel="Y axis field" value={config.y} onChange={(y) => patchConfig({ y })} options={opts(["number"])} />
            </ControlGroup>
          )}
          {meta.enc.series && (
            <ControlGroup label={config.type === "heatmap" ? "Y axis (split)" : "Split by"}>
              <Select ariaLabel="Series field" value={config.series} onChange={(series) => patchConfig({ series })}
                allowEmpty emptyLabel="None" options={opts(["category", "date"])} />
            </ControlGroup>
          )}
          {meta.enc.size && (
            <ControlGroup label="Size">
              <Select ariaLabel="Size field" value={config.size} onChange={(size) => patchConfig({ size })}
                allowEmpty emptyLabel="Uniform" options={opts(["number"])} />
            </ControlGroup>
          )}
          {(config.type === "histogram" || config.type === "density") && (
            <Slider label="Bins" value={config.bins} min={4} max={40} onChange={(bins) => patchConfig({ bins })} />
          )}
          <ControlGroup label="Aggregation">
            <Select ariaLabel="Aggregation" value={config.agg} onChange={(v) => patchConfig({ agg: v as Agg })}
              options={[["sum", "Sum"], ["mean", "Average"], ["median", "Median"], ["count", "Count of rows"], ["min", "Min"], ["max", "Max"]].map(([value, label]) => ({ value, label }))} />
          </ControlGroup>
          <ControlGroup label="Sort">
            <SegButtons ariaLabel="Sort order" value={config.sort}
              onChange={(v) => patchConfig({ sort: v as SortOrder })}
              options={[{ value: "none" as SortOrder, label: "Natural" }, { value: "desc" as SortOrder, label: "High→Low" }, { value: "asc" as SortOrder, label: "Low→High" }]} />
          </ControlGroup>
          <Slider label="Max groups" value={config.limit} min={3} max={40} onChange={(limit) => patchConfig({ limit })} />
        </div>

        <Disclosure title="Appearance">
          <TextInput label="Title" value={style.title} onChange={(title) => patchStyle({ title })} placeholder="Auto from fields" />
          <TextInput label="Subtitle" value={style.subtitle} onChange={(subtitle) => patchStyle({ subtitle })} placeholder="Optional" />
          <ControlGroup label="Palette">
            <div className="flex gap-1.5">
              {PALETTES.map((p) => (
                <button key={p.id} type="button" onClick={() => patchStyle({ palette: p.id })} title={p.label}
                  aria-label={`${p.label} palette`} aria-pressed={style.palette === p.id}
                  className={cn("focus-ring flex h-7 flex-1 overflow-hidden rounded-md border",
                    style.palette === p.id ? "border-primary ring-1 ring-primary" : "border-border")}>
                  {p.colors.slice(0, 4).map((c, i) => <span key={i} className="flex-1" style={{ background: c }} />)}
                </button>
              ))}
            </div>
          </ControlGroup>
          <Toggle label="Legend" checked={style.legend} onChange={(legend) => patchStyle({ legend })} />
          <Toggle label="Grid lines" checked={style.grid} onChange={(grid) => patchStyle({ grid })} />
          <Toggle label="Data labels" checked={style.dataLabels} onChange={(dataLabels) => patchStyle({ dataLabels })} />
        </Disclosure>

        <Disclosure title="Advanced">
          <TextInput label="X label" value={style.xLabel} onChange={(xLabel) => patchStyle({ xLabel })} placeholder={config.x} />
          <TextInput label="Y label" value={style.yLabel} onChange={(yLabel) => patchStyle({ yLabel })} placeholder={config.y} />
          <Toggle label="Markers" checked={style.markers} onChange={(markers) => patchStyle({ markers })} />
          <Toggle label="Rounded shapes" checked={style.rounded} onChange={(rounded) => patchStyle({ rounded })} />
          <Slider label="Font size" value={style.fontSize} min={9} max={18} onChange={(fontSize) => patchStyle({ fontSize })} suffix="px" />
          <Slider label="Line width" value={style.lineWidth} min={1} max={6} onChange={(lineWidth) => patchStyle({ lineWidth })} />
          <Slider label="Opacity" value={style.opacity} min={0.2} max={1} step={0.05} onChange={(opacity) => patchStyle({ opacity })} />
          <Slider label="Height" value={style.height} min={260} max={680} step={20} onChange={(height) => patchStyle({ height })} suffix="px" />
          <button type="button" onClick={resetStyle} className="focus-ring w-full rounded-lg border border-border py-1.5 text-xs text-muted-foreground hover:text-foreground">
            Reset appearance
          </button>
        </Disclosure>
      </aside>

      {/* ---------------- canvas ---------------- */}
      <section className="order-1 min-w-0 lg:order-2">
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="min-w-0">
              <h2 className="truncate font-display text-lg leading-tight">
                {style.title || `${config.agg === "count" ? "Count" : config.y} by ${config.x}`}
              </h2>
              <p className="truncate text-xs text-muted-foreground">
                {style.subtitle || `${meta.label} · ${dataset.name}`}
              </p>
            </div>
            <div role="tablist" aria-label="Studio mode" className="flex rounded-lg bg-surface-2 p-1">
              {(["build", "understand", "code"] as Mode[]).map((m) => (
                <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
                  className={cn("focus-ring rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                    mode === m ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground")}>
                  {m}
                </button>
              ))}
            </div>
          </header>

          <div className="p-4">
            {mode === "build" && (
              !frame.ok ? (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-16 text-center">
                  <AlertCircle size={22} className="text-destructive" />
                  <p className="font-medium">{frame.error}</p>
                  <p className="max-w-sm text-sm text-muted-foreground">{frame.hint}</p>
                </div>
              ) : (
                <div ref={canvasRef}>
                  <VizChart frame={frame} type={config.type} style={style} />
                </div>
              )
            )}

            {mode === "understand" && (
              <div className="space-y-4 text-sm">
                <p className="text-muted-foreground">{learn?.summary ?? meta.blurb}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Panel title="Use it when" items={learn?.whenToUse ?? [meta.blurb]} tone="good" />
                  <Panel title="Avoid it when" items={learn?.whenNotToUse ?? ["Your data has a different shape."]} tone="bad" />
                </div>
                {learn && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Panel title="Common mistakes" items={learn.mistakes} />
                    <Panel title="Limitations" items={learn.limitations} />
                  </div>
                )}
                {meta.learn && (
                  <Link to={`/chart/${meta.learn}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                    Open the full {meta.label} page →
                  </Link>
                )}
              </div>
            )}

            {mode === "code" && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <SegButtons<Library> ariaLabel="Library" value={lib} onChange={setLib}
                    options={(["Matplotlib", "Seaborn", "Plotly"] as Library[]).map((l) => ({ value: l, label: l }))} />
                  <div className="flex gap-2">
                    <button onClick={copyCode} className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-surface-2">
                      {copied ? <Check size={13} /> : <Copy size={13} />} Copy
                    </button>
                    <button onClick={() => download(`chartworld-${config.type}.py`, code, "text/x-python")}
                      className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-surface-2">
                      <Download size={13} /> .py
                    </button>
                  </div>
                </div>
                <pre className="max-h-[420px] overflow-auto rounded-xl bg-surface-2 p-4 font-mono text-[12px] leading-relaxed">
                  <code>{code}</code>
                </pre>
              </div>
            )}
          </div>

          <footer className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3">
            <button onClick={() => exportPng(canvasRef.current, `chartworld-${config.type}`).catch((e) => toast.error(e.message))}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-surface-2">
              <Image size={13} aria-hidden /> PNG
            </button>
            <button onClick={() => { try { exportSvg(canvasRef.current, `chartworld-${config.type}`); } catch (e) { toast.error((e as Error).message); } }}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-surface-2">
              <Table2 size={13} aria-hidden /> SVG
            </button>
            <button onClick={() => download(`${dataset.id}-shaped.csv`, toCsv(frame.data), "text/csv")}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-surface-2">
              <Download size={13} aria-hidden /> CSV
            </button>
            <button onClick={share} className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-surface-2">
              <Link2 size={13} aria-hidden /> Share link
            </button>
            {suggestions.length > 0 && (
              <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles size={13} className="text-primary" aria-hidden /> Try:
                {suggestions.map((s) => (
                  <button key={s} onClick={() => setType(s as BuildableType)} className="focus-ring rounded-md bg-surface-2 px-2 py-1 hover:text-foreground">
                    {BUILDABLE[s].label}
                  </button>
                ))}
              </div>
            )}
          </footer>
        </div>

        {frame.warnings.length > 0 && (
          <ul className="mt-2 space-y-1">
            {frame.warnings.map((w) => (
              <li key={w} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <AlertCircle size={12} className="mt-0.5 shrink-0" aria-hidden /> {w}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Panel({ title, items, tone }: { title: string; items: string[]; tone?: "good" | "bad" }) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 p-3">
      <h4 className={cn("mb-2 text-xs font-medium uppercase tracking-wider",
        tone === "good" ? "text-primary" : tone === "bad" ? "text-destructive" : "text-muted-foreground")}>{title}</h4>
      <ul className="space-y-1.5">
        {items.map((i) => <li key={i} className="text-xs leading-relaxed text-muted-foreground">• {i}</li>)}
      </ul>
    </div>
  );
}
