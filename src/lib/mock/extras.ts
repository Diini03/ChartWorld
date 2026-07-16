import { nodes, users } from "./catalog";
import type { CatalogNode, Status } from "./types";

/** Deterministic pseudo-random from a string seed. */
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const now = new Date("2026-07-15T09:00:00Z").getTime();

// ---- Pipeline runs ---------------------------------------------------------
export interface PipelineRun {
  id: string;
  pipelineId: string;
  startedAt: string;
  durationSec: number;
  status: Status;
  triggeredBy: string;
  tasks: { name: string; status: Status; durationSec: number }[];
}

export const pipelines = () => nodes.filter((n) => n.type === "pipeline");

export const pipelineRuns = (pipelineId: string): PipelineRun[] => {
  const p = nodes.find((n) => n.id === pipelineId);
  if (!p) return [];
  const rnd = seeded(pipelineId);
  const cadenceMin = p.tags.includes("streaming") ? 5 : p.tags.includes("nightly") ? 60 * 24 : p.id.includes("stripe") ? 15 : 10;
  const taskNames = ["extract", "validate_schema", "load_raw", "dedupe", "publish"];
  return Array.from({ length: 24 }, (_, i) => {
    const startedAt = new Date(now - i * cadenceMin * 60_000 - Math.floor(rnd() * 60_000)).toISOString();
    const isLastAndFailing = i === 0 && p.status !== "ok";
    const status: Status = isLastAndFailing ? p.status : rnd() < 0.08 ? "warn" : "ok";
    const durationSec = Math.round(30 + rnd() * 240);
    return {
      id: `${pipelineId}_run_${i}`,
      pipelineId,
      startedAt,
      durationSec,
      status,
      triggeredBy: rnd() < 0.7 ? "schedule" : users[Math.floor(rnd() * users.length)].handle,
      tasks: taskNames.map((name, idx) => ({
        name,
        status: status === "fail" && idx === taskNames.length - 1 ? "fail" : status === "warn" && idx === 1 ? "warn" : "ok",
        durationSec: Math.max(2, Math.round((durationSec / taskNames.length) * (0.6 + rnd() * 0.8))),
      })),
    };
  });
};

// ---- Quality rules ---------------------------------------------------------
export type CheckKind = "freshness" | "not_null" | "unique" | "row_count" | "referential";
export interface QualityRule {
  id: string;
  datasetId: string;
  datasetName: string;
  kind: CheckKind;
  target: string;
  threshold: string;
  status: Status;
  lastRunAt: string;
  history: { d: string; pass: boolean }[];
  message: string;
}

const kindLabels: Record<CheckKind, string> = {
  freshness: "Freshness",
  not_null: "Not null",
  unique: "Unique",
  row_count: "Row count",
  referential: "Referential",
};

export function qualityRules(): QualityRule[] {
  const out: QualityRule[] = [];
  const datasets = nodes.filter((n) => n.type === "dataset" || n.type === "transformation");
  datasets.forEach((d) => {
    const rnd = seeded("qr_" + d.id);
    const kinds: CheckKind[] = ["freshness", "not_null", "unique", "row_count"];
    if (rnd() > 0.5) kinds.push("referential");
    kinds.forEach((k) => {
      const failRate = d.status === "fail" ? 0.35 : d.status === "warn" ? 0.15 : 0.03;
      const history = Array.from({ length: 30 }, (_, i) => ({
        d: new Date(now - (29 - i) * 24 * 60 * 60_000).toISOString().slice(0, 10),
        pass: rnd() > failRate,
      }));
      const recentFail = history.slice(-3).filter((h) => !h.pass).length;
      const status: Status = recentFail >= 2 ? "fail" : recentFail === 1 ? "warn" : "ok";
      const col = d.columns?.[Math.floor(rnd() * (d.columns.length || 1))]?.name ?? "id";
      out.push({
        id: `${d.id}_${k}`,
        datasetId: d.id,
        datasetName: d.name,
        kind: k,
        target: k === "freshness" ? "table" : col,
        threshold: k === "freshness" ? "< 30 min" : k === "unique" ? "distinct = count" : k === "row_count" ? "±10% of 24h avg" : "0 nulls",
        status,
        lastRunAt: new Date(now - Math.round(rnd() * 40) * 60_000).toISOString(),
        history,
        message: status === "fail" ? `${kindLabels[k]} failed on ${d.name}.${col}` : status === "warn" ? `Recovered after 1 failure` : "Passing",
      });
    });
  });
  return out;
}

// ---- Alert rules -----------------------------------------------------------
export type Severity = "info" | "warn" | "critical";
export type Channel = "slack" | "pagerduty" | "email";

export interface AlertRule {
  id: string;
  name: string;
  target: string;
  severity: Severity;
  channels: Channel[];
  muted: boolean;
  lastFiredAt?: string;
  fireHistory: { at: string; note: string }[];
}

export function alertRules(): AlertRule[] {
  const seed = seeded("alerts");
  const failing = nodes.filter((n) => n.status !== "ok");
  return failing.slice(0, 8).map((n, i) => {
    const sev: Severity = n.status === "fail" ? "critical" : "warn";
    const ch: Channel[] = i % 2 === 0 ? ["slack", "email"] : sev === "critical" ? ["pagerduty", "slack"] : ["email"];
    const fires = Array.from({ length: sev === "critical" ? 5 : 2 }, (_, k) => ({
      at: new Date(now - (k * 60 * (5 + Math.floor(seed() * 40))) * 60_000).toISOString(),
      note: k === 0 ? `${n.name} threshold breached` : `Recovered and re-fired`,
    }));
    return {
      id: `al_${n.id}`,
      name: `${n.name} — ${sev === "critical" ? "hard failure" : "degraded"}`,
      target: n.fullyQualifiedName,
      severity: sev,
      channels: ch,
      muted: i === 3,
      lastFiredAt: fires[0]?.at,
      fireHistory: fires,
    };
  });
}

// ---- Schema explorer tree --------------------------------------------------
export interface SchemaTable {
  id: string;
  schema: string;
  name: string;
  node: CatalogNode;
}
export interface SchemaGroup {
  system: string;
  schemas: { name: string; tables: SchemaTable[] }[];
}

export function schemaTree(): SchemaGroup[] {
  const withCols = nodes.filter((n) => n.columns && n.columns.length > 0);
  const bySystem = new Map<string, SchemaTable[]>();
  withCols.forEach((n) => {
    const parts = n.fullyQualifiedName.split(".");
    const system = parts[0];
    const schema = parts.length >= 3 ? parts[parts.length - 2] : "default";
    const name = parts[parts.length - 1];
    if (!bySystem.has(system)) bySystem.set(system, []);
    bySystem.get(system)!.push({ id: n.id, schema, name, node: n });
  });
  return Array.from(bySystem.entries()).map(([system, tables]) => {
    const schemas = new Map<string, SchemaTable[]>();
    tables.forEach((t) => {
      if (!schemas.has(t.schema)) schemas.set(t.schema, []);
      schemas.get(t.schema)!.push(t);
    });
    return {
      system,
      schemas: Array.from(schemas.entries())
        .map(([name, ts]) => ({ name, tables: ts.sort((a, b) => a.name.localeCompare(b.name)) }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  }).sort((a, b) => a.system.localeCompare(b.system));
}
