import { useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ZAxis, Cell,
  ComposedChart, PieChart, Pie,
} from "recharts";
import type { Chart } from "@/data/charts";

const C1 = "hsl(var(--chart-1))";
const C2 = "hsl(var(--chart-2))";
const C3 = "hsl(var(--chart-3))";
const C4 = "hsl(var(--chart-4))";
const C5 = "hsl(var(--chart-5))";
const C6 = "hsl(var(--chart-6))";
const PAL = [C1, C2, C3, C4, C5, C6];

function seedRand(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

const cats5 = ["A", "B", "C", "D", "E"];

export interface PreviewProps {
  kind: Chart["preview"];
  animate?: boolean;
  height?: number;
  seed?: number;
}

export function ChartPreview({ kind, height = 260, seed = 7 }: PreviewProps) {
  const data = useMemo(() => genData(kind, seed), [kind, seed]);
  const tooltipStyle = {
    contentStyle: {
      background: "hsl(var(--popover))",
      border: "1px solid hsl(var(--border))",
      borderRadius: 10,
      fontSize: 12,
      color: "hsl(var(--popover-foreground))",
    },
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        {renderChart(kind, data, tooltipStyle) as any}
      </ResponsiveContainer>
    </div>
  );
}

function renderChart(kind: Chart["preview"], data: any, tt: any) {
  switch (kind) {
    case "bar":
      return (
        <BarChart data={data}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <Tooltip {...tt} />
          <Bar dataKey="value" fill={C1} radius={[6, 6, 0, 0]} />
        </BarChart>
      );
    case "groupedBar":
      return (
        <BarChart data={data}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <Tooltip {...tt} />
          <Bar dataKey="a" fill={C1} radius={[4, 4, 0, 0]} />
          <Bar dataKey="b" fill={C2} radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    case "stackedBar":
      return (
        <BarChart data={data}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <Tooltip {...tt} />
          <Bar dataKey="a" stackId="s" fill={C1} />
          <Bar dataKey="b" stackId="s" fill={C2} />
          <Bar dataKey="c" stackId="s" fill={C3} radius={[6, 6, 0, 0]} />
        </BarChart>
      );
    case "hbar":
    case "lollipop":
    case "dot":
    case "featureImp":
      return (
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={60} />
          <Tooltip {...tt} />
          <Bar dataKey="value" fill={kind === "lollipop" ? C3 : C1} radius={[0, 6, 6, 0]} barSize={kind === "lollipop" || kind === "dot" ? 3 : 16} />
        </BarChart>
      );
    case "line":
    case "step":
    case "candlestick":
    case "timeline":
      return (
        <LineChart data={data}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <Tooltip {...tt} />
          <Line type={kind === "step" ? "stepAfter" : "monotone"} dataKey="value" stroke={C1} strokeWidth={2.5} dot={{ r: 3, fill: C1 }} activeDot={{ r: 5 }} />
        </LineChart>
      );
    case "area":
    case "density":
    case "learning":
    case "roc":
      return (
        <AreaChart data={data}>
          <defs>
            <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C1} stopOpacity={0.6} />
              <stop offset="100%" stopColor={C1} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <Tooltip {...tt} />
          <Area type="monotone" dataKey="value" stroke={C1} strokeWidth={2} fill="url(#a1)" />
        </AreaChart>
      );
    case "stackedArea":
      return (
        <AreaChart data={data}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <Tooltip {...tt} />
          <Area type="monotone" dataKey="a" stackId="1" stroke={C1} fill={C1} fillOpacity={0.6} />
          <Area type="monotone" dataKey="b" stackId="1" stroke={C2} fill={C2} fillOpacity={0.6} />
          <Area type="monotone" dataKey="c" stackId="1" stroke={C3} fill={C3} fillOpacity={0.6} />
        </AreaChart>
      );
    case "histogram":
      return (
        <BarChart data={data}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <Tooltip {...tt} />
          <Bar dataKey="value" fill={C1} />
        </BarChart>
      );
    case "violin":
    case "box":
      return (
        <ComposedChart data={data}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <Tooltip {...tt} />
          <Bar dataKey="range" fill={C2} fillOpacity={0.3} />
          <Bar dataKey="iqr" fill={C1} />
          <Line dataKey="median" stroke={C3} strokeWidth={2} dot={{ r: 4 }} />
        </ComposedChart>
      );
    case "scatter":
    case "bubble":
    case "hexbin":
    case "pca":
    case "cluster":
      return (
        <ScatterChart>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <XAxis type="number" dataKey="x" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis type="number" dataKey="y" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <ZAxis type="number" dataKey="z" range={[40, 400]} />
          <Tooltip {...tt} cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} fill={C1}>
            {(data as any[]).map((d, i) => (
              <Cell key={i} fill={PAL[d.g ?? i % PAL.length]} fillOpacity={0.7} />
            ))}
          </Scatter>
        </ScatterChart>
      );
    case "heatmap":
    case "corr":
    case "confusion":
    case "calendar":
      return <Heatmap data={data} kind={kind} />;
    case "treemap":
    case "sunburst":
      return <PieRingChart data={data} rings={kind === "sunburst" ? 2 : 1} />;
    case "sankey":
    case "flowMap":
    case "network":
    case "tree":
      return <SankeyLike data={data} />;
    case "waterfall":
      return (
        <BarChart data={data}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <Tooltip {...tt} />
          <Bar dataKey="base" stackId="w" fill="transparent" />
          <Bar dataKey="value" stackId="w" radius={[4, 4, 0, 0]}>
            {(data as any[]).map((d, i) => (
              <Cell key={i} fill={d.value >= 0 ? C5 : C3} />
            ))}
          </Bar>
        </BarChart>
      );
    case "funnel":
      return <FunnelView data={data} />;
    case "radar":
      return (
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <PolarRadiusAxis stroke="hsl(var(--border))" tick={false} />
          <Radar dataKey="a" stroke={C1} fill={C1} fillOpacity={0.35} />
          <Radar dataKey="b" stroke={C2} fill={C2} fillOpacity={0.25} />
          <Tooltip {...tt} />
        </RadarChart>
      );
    case "parallel":
      return <ParallelCoords data={data} />;
    case "gantt":
      return <GanttView data={data} />;
    case "choropleth":
    case "bubbleMap":
      return <MapMock kind={kind} data={data} />;
    default:
      return (
        <BarChart data={data as any}>
          <Bar dataKey="value" fill={C1} />
        </BarChart>
      );
  }
}

function genData(kind: Chart["preview"], seed: number): any {
  const r = seedRand(seed);
  switch (kind) {
    case "bar":
      return cats5.map((n) => ({ name: n, value: Math.round(r() * 90 + 20) }));
    case "groupedBar":
    case "stackedBar":
      return cats5.map((n) => ({ name: n, a: Math.round(r() * 60 + 20), b: Math.round(r() * 50 + 15), c: Math.round(r() * 40 + 10) }));
    case "hbar":
    case "lollipop":
    case "dot":
    case "featureImp":
      return ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta"]
        .map((n) => ({ name: n, value: Math.round(r() * 90 + 10) }))
        .sort((a, b) => b.value - a.value);
    case "line":
    case "step":
    case "candlestick":
    case "timeline": {
      let v = 40;
      return Array.from({ length: 12 }).map((_, i) => {
        v += (r() - 0.5) * 20;
        return { name: `M${i + 1}`, value: Math.max(5, Math.round(v)) };
      });
    }
    case "area":
    case "density":
    case "learning":
    case "roc": {
      return Array.from({ length: 20 }).map((_, i) => {
        const t = i / 19;
        const val = kind === "roc" ? 1 - Math.exp(-3 * t) : kind === "density" ? Math.exp(-((t - 0.5) ** 2) * 12) : 30 + t * 60 + Math.sin(i / 2) * 8;
        return { name: `${i}`, value: Math.round(val * 100) / 100 };
      });
    }
    case "stackedArea":
      return Array.from({ length: 10 }).map((_, i) => ({
        name: `T${i + 1}`,
        a: Math.round(r() * 30 + 10),
        b: Math.round(r() * 25 + 10),
        c: Math.round(r() * 20 + 10),
      }));
    case "histogram":
      return Array.from({ length: 12 }).map((_, i) => {
        const x = (i - 6) / 2;
        return { name: `${i}`, value: Math.round(Math.exp(-x * x) * 60 + r() * 6) };
      });
    case "violin":
    case "box":
      return cats5.map((n) => {
        const m = Math.round(r() * 50 + 25);
        return { name: n, median: m, iqr: 20, range: 40 };
      });
    case "scatter":
      return Array.from({ length: 40 }).map(() => ({ x: r() * 100, y: r() * 100, z: 100, g: 0 }));
    case "bubble":
      return Array.from({ length: 25 }).map(() => ({ x: r() * 100, y: r() * 100, z: r() * 800 + 40, g: Math.floor(r() * 3) }));
    case "hexbin":
      return Array.from({ length: 120 }).map(() => ({ x: 50 + (r() - 0.5) * 60, y: 50 + (r() - 0.5) * 60, z: 100, g: 0 }));
    case "pca":
    case "cluster":
      return Array.from({ length: 60 }).map(() => {
        const g = Math.floor(r() * 3);
        const cx = g === 0 ? 30 : g === 1 ? 70 : 50;
        const cy = g === 0 ? 30 : g === 1 ? 40 : 75;
        return { x: cx + (r() - 0.5) * 20, y: cy + (r() - 0.5) * 20, z: 100, g };
      });
    case "heatmap":
    case "corr":
    case "confusion":
    case "calendar":
      return Array.from({ length: kind === "calendar" ? 7 * 12 : 36 }).map(() => Math.round(r() * 100));
    case "treemap":
    case "sunburst":
      return cats5.map((n) => ({ name: n, value: Math.round(r() * 100 + 20) }));
    case "sankey":
    case "network":
    case "tree":
    case "flowMap":
      return [
        { from: "A", to: "X", value: 40 },
        { from: "A", to: "Y", value: 30 },
        { from: "B", to: "X", value: 20 },
        { from: "B", to: "Z", value: 35 },
        { from: "C", to: "Y", value: 15 },
        { from: "C", to: "Z", value: 25 },
      ];
    case "waterfall": {
      const raw = [50, 20, -15, 30, -10, 25];
      let acc = 0;
      return raw.map((v, i) => {
        const base = v >= 0 ? acc : acc + v;
        acc += v;
        return { name: `Step ${i + 1}`, value: v, base };
      });
    }
    case "funnel":
      return [
        { name: "Visitors", value: 100 },
        { name: "Signups", value: 62 },
        { name: "Trials", value: 34 },
        { name: "Paid", value: 12 },
      ];
    case "radar":
      return ["Speed", "Price", "Design", "Support", "Docs", "Reliability"].map((axis) => ({
        axis, a: Math.round(r() * 60 + 30), b: Math.round(r() * 60 + 30),
      }));
    case "parallel":
      return Array.from({ length: 30 }).map(() => ({
        a: r() * 100, b: r() * 100, c: r() * 100, d: r() * 100, g: Math.floor(r() * 3),
      }));
    case "gantt":
      return ["Design", "Build", "Test", "Ship", "Iterate"].map((task, i) => ({
        task, start: i * 1.5, duration: 2 + r() * 2,
      }));
    case "choropleth":
    case "bubbleMap":
      return Array.from({ length: 20 }).map(() => ({ x: r() * 100, y: r() * 100, v: r() }));
  }
  return [];
}

// ---- Custom SVG-based visuals ----

function Heatmap({ data, kind }: { data: number[]; kind: string }) {
  const isCal = kind === "calendar";
  const cols = isCal ? 12 : 6;
  const rows = isCal ? 7 : 6;
  const max = Math.max(...data);
  return (
    <div className="grid h-full w-full items-center p-2">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {data.slice(0, rows * cols).map((v, i) => {
          const alpha = 0.15 + (v / max) * 0.85;
          return (
            <div key={i}
              className="aspect-square rounded-sm transition-transform hover:scale-110"
              style={{ background: `hsl(var(--chart-1) / ${alpha})` }}
              title={`${v}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function PieRingChart({ data, rings }: { data: any[]; rings: number }) {
  return (
    <PieChart>
      <Pie data={data} dataKey="value" outerRadius={rings > 1 ? 60 : 90} innerRadius={0}>
        {data.map((_, i) => <Cell key={i} fill={PAL[i % PAL.length]} />)}
      </Pie>
      {rings > 1 && (
        <Pie data={data} dataKey="value" outerRadius={100} innerRadius={70}>
          {data.map((_, i) => <Cell key={i} fill={PAL[(i + 2) % PAL.length]} fillOpacity={0.7} />)}
        </Pie>
      )}
      <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }} />
    </PieChart>
  );
}

function SankeyLike({ data }: { data: any[] }) {
  const froms = Array.from(new Set(data.map((d) => d.from)));
  const tos = Array.from(new Set(data.map((d) => d.to)));
  return (
    <svg viewBox="0 0 300 200" className="h-full w-full">
      {froms.map((f, i) => (
        <rect key={f} x={20} y={30 + i * 55} width={14} height={40} fill={PAL[i % PAL.length]} rx={3} />
      ))}
      {tos.map((t, i) => (
        <rect key={t} x={266} y={20 + i * 55} width={14} height={40} fill={PAL[(i + 2) % PAL.length]} rx={3} />
      ))}
      {data.map((d, i) => {
        const fy = 50 + froms.indexOf(d.from) * 55;
        const ty = 40 + tos.indexOf(d.to) * 55;
        const w = Math.max(2, d.value / 5);
        return (
          <path key={i}
            d={`M 34 ${fy} C 150 ${fy}, 150 ${ty}, 266 ${ty}`}
            stroke={PAL[i % PAL.length]}
            strokeOpacity={0.35}
            strokeWidth={w}
            fill="none"
          />
        );
      })}
    </svg>
  );
}

function FunnelView({ data }: { data: any[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-4">
      {data.map((d, i) => {
        const pct = d.value / max;
        return (
          <div key={d.name} className="flex items-center gap-3">
            <div className="w-20 text-right text-xs text-muted-foreground">{d.name}</div>
            <div
              className="h-9 rounded-md transition-all"
              style={{
                width: `${pct * 100}%`,
                background: `linear-gradient(90deg, ${PAL[i % PAL.length]}, ${PAL[(i + 1) % PAL.length]})`,
              }}
            />
            <div className="text-xs font-mono">{d.value}</div>
          </div>
        );
      })}
    </div>
  );
}

function ParallelCoords({ data }: { data: any[] }) {
  const axes = ["a", "b", "c", "d"];
  return (
    <svg viewBox="0 0 300 200" className="h-full w-full">
      {axes.map((_, i) => (
        <line key={i} x1={30 + i * 80} y1={20} x2={30 + i * 80} y2={180} stroke="hsl(var(--border))" />
      ))}
      {data.map((d, i) => {
        const pts = axes.map((a, ai) => `${30 + ai * 80},${180 - (d[a] / 100) * 160}`).join(" ");
        return <polyline key={i} points={pts} fill="none" stroke={PAL[d.g % PAL.length]} strokeOpacity={0.4} strokeWidth={1} />;
      })}
    </svg>
  );
}

function GanttView({ data }: { data: any[] }) {
  const max = Math.max(...data.map((d) => d.start + d.duration));
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-4">
      {data.map((d, i) => (
        <div key={d.task} className="flex items-center gap-3">
          <div className="w-16 text-right text-xs text-muted-foreground">{d.task}</div>
          <div className="relative h-6 flex-1 rounded bg-surface-2">
            <div
              className="absolute top-0 h-6 rounded"
              style={{
                left: `${(d.start / max) * 100}%`,
                width: `${(d.duration / max) * 100}%`,
                background: PAL[i % PAL.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MapMock({ kind, data }: { kind: string; data: any[] }) {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full">
      <path d="M 30 60 Q 80 20 130 60 T 240 70 L 260 120 Q 200 160 130 140 T 30 130 Z" fill="hsl(var(--surface-2))" stroke="hsl(var(--border))" />
      {data.map((d, i) => (
        kind === "bubbleMap"
          ? <circle key={i} cx={40 + d.x * 2.2} cy={40 + d.y * 1} r={4 + d.v * 10} fill={PAL[i % PAL.length]} fillOpacity={0.6} />
          : <circle key={i} cx={40 + d.x * 2.2} cy={40 + d.y * 1} r={6} fill={`hsl(var(--chart-1) / ${0.2 + d.v * 0.8})`} />
      ))}
    </svg>
  );
}
