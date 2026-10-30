import type { CSSProperties } from "react";
import { ChartPreview } from "@/components/chart/ChartPreview";
import type { CHARTS } from "@/data/charts";

type Chart = (typeof CHARTS)[number];

export interface SheetOptions {
  margin: number; // mm
  font: "sans" | "serif" | "mono";
  size: number; // pt
  layout: "side" | "stacked";
}

export const DEFAULT_SHEET: SheetOptions = { margin: 12, font: "sans", size: 10, layout: "side" };

const FONT: Record<SheetOptions["font"], string> = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "ui-monospace, 'SFMono-Regular', monospace",
};

/** The printable comparison sheet — used for both the on-screen preview and the real print. */
export function CompareSheet({ A, B, opts }: { A: Chart; B: Chart; opts: SheetOptions }) {
  const style: CSSProperties = { fontFamily: FONT[opts.font], fontSize: `${opts.size}pt`, lineHeight: 1.4 };
  const rows: [string, (c: Chart) => string][] = [
    ["Category", (c) => c.category],
    ["Purpose", (c) => c.summary],
    ["Best when", (c) => c.whenToUse.join(" · ")],
    ["Avoid when", (c) => c.whenNotToUse.join(" · ")],
    ["Strengths", (c) => c.advantages.join(" · ")],
    ["Limitations", (c) => c.limitations.join(" · ")],
    ["Common mistakes", (c) => c.mistakes.join(" · ")],
    ["Business example", (c) => c.businessExample],
  ];
  const side = opts.layout === "side";
  return (
    <div className="compare-sheet text-foreground" style={style}>
      <div style={{ fontSize: "0.75em", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.6 }}>ChartWorld · Chart comparison</div>
      <h1 style={{ fontSize: "2.2em", fontWeight: 700, margin: "0.2em 0 0.8em" }}>{A.name} vs {B.name}</h1>
      <div style={{ display: "grid", gridTemplateColumns: side ? "1fr 1fr" : "1fr", gap: "1em" }}>
        {[A, B].map((c, i) => (
          <div key={c.slug} style={{ border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "0.8em", breakInside: "avoid" }}>
            <div style={{ fontSize: "1.4em", fontWeight: 700 }}>{c.name}</div>
            <div style={{ opacity: 0.7, marginBottom: "0.5em" }}>{c.tagline} · {c.difficulty}</div>
            <ChartPreview kind={c.preview} height={side ? 150 : 180} seed={c.slug.length + i} />
          </div>
        ))}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1em" }}>
        <thead>
          <tr>
            <th style={th} />
            <th style={th}>{A.name}</th>
            <th style={th}>{B.name}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, get]) => (
            <tr key={label} style={{ breakInside: "avoid" }}>
              <td style={{ ...td, fontWeight: 600, width: "18%" }}>{label}</td>
              <td style={td}>{get(A)}</td>
              <td style={td}>{get(B)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "1em", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "0.8em", breakInside: "avoid" }}>
        <div style={{ fontWeight: 700, marginBottom: "0.3em" }}>Decision guide</div>
        Reach for <strong>{A.name}</strong> when you need {A.whenToUse[0].toLowerCase()}, and <strong>{B.name}</strong> when you need {B.whenToUse[0].toLowerCase()}.
        Avoid {A.name} when {A.whenNotToUse[0].toLowerCase()}; avoid {B.name} when {B.whenNotToUse[0].toLowerCase()}.
      </div>
    </div>
  );
}

const th: CSSProperties = { textAlign: "left", padding: "0.4em", borderBottom: "2px solid hsl(var(--border))" };
const td: CSSProperties = { verticalAlign: "top", padding: "0.4em", borderBottom: "1px solid hsl(var(--border))" };
