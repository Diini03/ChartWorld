import { memo, useMemo } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, ErrorBar,
  Legend, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  Radar, RadarChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, Treemap,
  XAxis, YAxis, ZAxis, LabelList,
} from "recharts";
import type { VizFrame } from "@/lib/viz/transform";
import { colorAt } from "@/lib/viz/palettes";
import type { BuildableType, VizStyle } from "@/lib/viz/types";
import { cn } from "@/lib/utils";

interface Props {
  frame: VizFrame;
  type: BuildableType;
  style: VizStyle;
  className?: string;
}

const axisProps = (style: VizStyle) => ({
  stroke: "hsl(var(--muted-foreground))",
  fontSize: style.fontSize,
  tickLine: false,
  axisLine: { stroke: "hsl(var(--border))" },
});

function useTooltip(style: VizStyle) {
  return useMemo(() => ({
    contentStyle: {
      background: "hsl(var(--popover))",
      border: "1px solid hsl(var(--border))",
      borderRadius: 12,
      fontSize: style.fontSize,
      color: "hsl(var(--popover-foreground))",
      boxShadow: "var(--shadow-md)",
    },
    cursor: { fill: "hsl(var(--foreground) / 0.05)" },
  }), [style.fontSize]);
}

function Grid({ style, vertical = false }: { style: VizStyle; vertical?: boolean }) {
  if (!style.grid) return null;
  return <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={vertical} />;
}

export const VizChart = memo(function VizChart({ frame, type, style, className }: Props) {
  const tt = useTooltip(style);
  const keys = frame.seriesKeys;
  const radius: [number, number, number, number] = style.rounded ? [6, 6, 0, 0] : [0, 0, 0, 0];
  const legend = style.legend && keys.length > 1
    ? <Legend wrapperStyle={{ fontSize: style.fontSize }} iconType="circle" iconSize={8} />
    : null;

  /* Heatmap is a CSS grid — recharts has no native cell chart. */
  if (type === "heatmap" && frame.matrix) {
    const { xs, ys, cells, min, max } = frame.matrix;
    const span = max - min || 1;
    return (
      <div className={cn("w-full overflow-x-auto", className)} style={{ minHeight: style.height }}>
        <div className="min-w-[520px] p-2">
          <div className="grid gap-1" style={{ gridTemplateColumns: `minmax(80px,120px) repeat(${xs.length}, minmax(28px,1fr))` }}>
            <div />
            {xs.map((x) => (
              <div key={x} className="truncate pb-1 text-center text-[10px] text-muted-foreground" title={x}>{x}</div>
            ))}
            {ys.map((y) => (
              <FragmentRow key={y} y={y} xs={xs} cells={cells} min={min} span={span} style={style} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const chart = () => {
    switch (type) {
      case "bar":
      case "groupedBar":
      case "stackedBar":
        return (
          <BarChart data={frame.data} barGap={2}>
            <Grid style={style} />
            <XAxis dataKey={frame.xKey} {...axisProps(style)} interval="preserveStartEnd" angle={frame.data.length > 8 ? -30 : 0} textAnchor={frame.data.length > 8 ? "end" : "middle"} height={frame.data.length > 8 ? 62 : 30} />
            <YAxis {...axisProps(style)} width={56} />
            <Tooltip {...tt} />
            {legend}
            {keys.map((k, i) => (
              <Bar key={k} dataKey={k} stackId={type === "stackedBar" ? "s" : undefined}
                fill={colorAt(style.palette, i)} fillOpacity={style.opacity} radius={type === "stackedBar" && i < keys.length - 1 ? undefined : radius} isAnimationActive>
                {style.dataLabels && <LabelList dataKey={k} position="top" fontSize={style.fontSize - 2} fill="hsl(var(--muted-foreground))" />}
              </Bar>
            ))}
          </BarChart>
        );
      case "hbar":
      case "funnel":
        return (
          <BarChart data={frame.data} layout="vertical" barCategoryGap={type === "funnel" ? 4 : 8}>
            <Grid style={style} vertical />
            <XAxis type="number" {...axisProps(style)} />
            <YAxis type="category" dataKey={frame.xKey} {...axisProps(style)} width={110} />
            <Tooltip {...tt} />
            {legend}
            {keys.map((k, i) => (
              <Bar key={k} dataKey={k} fill={colorAt(style.palette, i)} fillOpacity={style.opacity} radius={style.rounded ? [0, 6, 6, 0] : undefined}>
                {type === "funnel" && frame.data.map((_, idx) => <Cell key={idx} fill={colorAt(style.palette, idx)} />)}
                {style.dataLabels && <LabelList dataKey={k} position="right" fontSize={style.fontSize - 2} fill="hsl(var(--muted-foreground))" />}
              </Bar>
            ))}
          </BarChart>
        );
      case "lollipop":
        return (
          <ComposedChart data={frame.data} layout="vertical">
            <Grid style={style} vertical />
            <XAxis type="number" {...axisProps(style)} />
            <YAxis type="category" dataKey={frame.xKey} {...axisProps(style)} width={110} />
            <Tooltip {...tt} />
            <Bar dataKey={keys[0]} barSize={2} fill={colorAt(style.palette, 0)} />
            <Scatter dataKey={keys[0]} fill={colorAt(style.palette, 0)} shape="circle" />
          </ComposedChart>
        );
      case "waterfall":
        return (
          <BarChart data={frame.data}>
            <Grid style={style} />
            <XAxis dataKey={frame.xKey} {...axisProps(style)} />
            <YAxis {...axisProps(style)} width={56} />
            <Tooltip {...tt} />
            <Bar dataKey="__base" stackId="w" fill="transparent" />
            <Bar dataKey="__delta" stackId="w" radius={radius}>
              {frame.data.map((d, i) => (
                <Cell key={i} fill={Number(d.__delta) >= 0 ? colorAt(style.palette, 0) : colorAt(style.palette, 3)} fillOpacity={style.opacity} />
              ))}
            </Bar>
          </BarChart>
        );
      case "line":
      case "step":
        return (
          <LineChart data={frame.data}>
            <Grid style={style} />
            <XAxis dataKey={frame.xKey} {...axisProps(style)} minTickGap={24} />
            <YAxis {...axisProps(style)} width={56} />
            <Tooltip {...tt} />
            {legend}
            {keys.map((k, i) => (
              <Line key={k} type={type === "step" ? "stepAfter" : "monotone"} dataKey={k}
                stroke={colorAt(style.palette, i)} strokeWidth={style.lineWidth}
                dot={style.markers ? { r: 3 } : false} activeDot={{ r: 5 }} isAnimationActive />
            ))}
          </LineChart>
        );
      case "area":
      case "stackedArea":
        return (
          <AreaChart data={frame.data}>
            <defs>
              {keys.map((k, i) => (
                <linearGradient key={k} id={`g-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colorAt(style.palette, i)} stopOpacity={style.opacity * 0.7} />
                  <stop offset="100%" stopColor={colorAt(style.palette, i)} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <Grid style={style} />
            <XAxis dataKey={frame.xKey} {...axisProps(style)} minTickGap={24} />
            <YAxis {...axisProps(style)} width={56} />
            <Tooltip {...tt} />
            {legend}
            {keys.map((k, i) => (
              <Area key={k} type="monotone" dataKey={k} stackId={type === "stackedArea" ? "a" : undefined}
                stroke={colorAt(style.palette, i)} strokeWidth={style.lineWidth} fill={`url(#g-${i})`} isAnimationActive />
            ))}
          </AreaChart>
        );
      case "histogram":
      case "density":
        return (
          <ComposedChart data={frame.data}>
            <Grid style={style} />
            <XAxis dataKey={frame.xKey} {...axisProps(style)} minTickGap={12} />
            <YAxis {...axisProps(style)} width={56} />
            <Tooltip {...tt} />
            {type === "histogram"
              ? <Bar dataKey="Count" fill={colorAt(style.palette, 0)} fillOpacity={style.opacity} radius={radius} />
              : <Area type="monotone" dataKey="Density" stroke={colorAt(style.palette, 0)} strokeWidth={style.lineWidth} fill={colorAt(style.palette, 0)} fillOpacity={style.opacity * 0.35} />}
          </ComposedChart>
        );
      case "box":
        return (
          <ComposedChart data={frame.data}>
            <Grid style={style} />
            <XAxis dataKey="name" {...axisProps(style)} angle={-25} textAnchor="end" height={60} />
            <YAxis {...axisProps(style)} width={56} />
            <Tooltip {...tt} />
            <Bar dataKey="base" stackId="b" fill="transparent" />
            <Bar dataKey="iqr" stackId="b" fill={colorAt(style.palette, 0)} fillOpacity={style.opacity * 0.55} radius={style.rounded ? 4 : 0}>
              <ErrorBar dataKey="median" width={0} strokeWidth={0} />
            </Bar>
            <Scatter dataKey="median" fill={colorAt(style.palette, 0)} shape="cross" />
            <Scatter dataKey="min" fill="hsl(var(--muted-foreground))" shape="square" />
            <Scatter dataKey="max" fill="hsl(var(--muted-foreground))" shape="square" />

          </ComposedChart>
        );
      case "scatter":
      case "bubble": {
        const groups = keys;
        return (
          <ScatterChart>
            <Grid style={style} vertical />
            <XAxis type="number" dataKey="x" {...axisProps(style)} />
            <YAxis type="number" dataKey="y" {...axisProps(style)} width={56} />
            {type === "bubble" && <ZAxis type="number" dataKey="z" range={[30, 420]} />}
            <Tooltip {...tt} cursor={{ strokeDasharray: "3 3" }} />
            {legend}
            {groups.map((g, i) => (
              <Scatter key={g} name={g} data={frame.data.filter((d) => d.group === g)}
                fill={colorAt(style.palette, i)} fillOpacity={style.opacity} isAnimationActive />
            ))}
          </ScatterChart>
        );
      }
      case "pie":
      case "donut":
        return (
          <PieChart>
            <Tooltip {...tt} />
            {style.legend && <Legend wrapperStyle={{ fontSize: style.fontSize }} iconType="circle" iconSize={8} />}
            <Pie data={frame.data} dataKey={keys[0]} nameKey={frame.xKey} innerRadius={type === "donut" ? "55%" : 0}
              outerRadius="80%" paddingAngle={2} label={style.dataLabels} isAnimationActive>
              {frame.data.map((_, i) => <Cell key={i} fill={colorAt(style.palette, i)} fillOpacity={style.opacity} />)}
            </Pie>
          </PieChart>
        );
      case "treemap":
        return (
          <Treemap data={frame.data.map((d, i) => ({ name: String(d[frame.xKey]), size: Number(d[keys[0]]), fill: colorAt(style.palette, i) }))}
            dataKey="size" stroke="hsl(var(--background))" isAnimationActive>
            <Tooltip {...tt} />
          </Treemap>
        );
      case "radar":
        return (
          <RadarChart data={frame.data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey={frame.xKey} tick={{ fontSize: style.fontSize, fill: "hsl(var(--muted-foreground))" }} />
            <PolarRadiusAxis tick={{ fontSize: style.fontSize - 2, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip {...tt} />
            {legend}
            {keys.map((k, i) => (
              <Radar key={k} dataKey={k} stroke={colorAt(style.palette, i)} fill={colorAt(style.palette, i)} fillOpacity={style.opacity * 0.35} strokeWidth={style.lineWidth} />
            ))}
          </RadarChart>
        );
      default:
        return <BarChart data={frame.data}><Bar dataKey={keys[0]} fill={colorAt(style.palette, 0)} /></BarChart>;
    }
  };

  return (
    <div className={cn("w-full", className)} style={{ height: style.height }} role="img"
      aria-label={style.title || `${type} chart of ${keys.join(", ")}`}>
      <ResponsiveContainer width="100%" height="100%">
        {chart() as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
});

function FragmentRow({ y, xs, cells, min, span, style }: { y: string; xs: string[]; cells: { x: string; y: string; v: number }[]; min: number; span: number; style: VizStyle }) {
  return (
    <>
      <div className="truncate pr-2 text-right text-[11px] text-muted-foreground" title={y}>{y}</div>
      {xs.map((x) => {
        const cell = cells.find((c) => c.x === x && c.y === y);
        const t = ((cell?.v ?? 0) - min) / span;
        return (
          <div key={x} title={`${x} · ${y}: ${cell?.v ?? 0}`}
            className="flex aspect-square min-h-7 items-center justify-center rounded-md text-[9px] font-medium transition-transform hover:scale-105"
            style={{ background: colorAt(style.palette, 0), opacity: 0.12 + t * 0.88, color: t > 0.6 ? "white" : "inherit" }}>
            {style.dataLabels ? cell?.v : ""}
          </div>
        );
      })}
    </>
  );
}
