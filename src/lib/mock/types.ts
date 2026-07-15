export type NodeType =
  | "dataset"
  | "pipeline"
  | "transformation"
  | "dashboard"
  | "report"
  | "api"
  | "database"
  | "storage";

export type Status = "ok" | "warn" | "fail";

export interface User {
  id: string;
  name: string;
  handle: string;
  color: string;
}

export interface Column {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary?: boolean;
  isForeign?: boolean;
  description?: string;
}

export interface QualityCheck {
  key: "freshness" | "missing" | "schema_drift" | "duplicates" | "row_delta";
  label: string;
  status: Status;
  detail: string;
}

export interface QualityPoint {
  date: string; // ISO
  score: number; // 0..100
}

export interface Version {
  id: string;
  createdAt: string;
  author: string;
  summary: string;
  added: string[];
  removed: string[];
  typeChanged: { column: string; from: string; to: string }[];
}

export interface CatalogNode {
  id: string;
  type: NodeType;
  name: string;
  fullyQualifiedName: string; // e.g. warehouse.analytics.mart_revenue_daily
  owner: string; // user id
  system: string;
  description: string;
  tags: string[];
  status: Status;
  rowCount?: number;
  sizeBytes?: number;
  freshnessMinutes?: number;
  qualityScore: number;
  updatedAt: string;
  columns?: Column[];
  checks?: QualityCheck[];
  history?: QualityPoint[];
  versions?: Version[];
}

export interface CatalogEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export type ActivityKind =
  | "dataset_created"
  | "schema_updated"
  | "pipeline_run"
  | "quality_failed"
  | "quality_recovered"
  | "report_generated"
  | "alert_triggered"
  | "comment_added"
  | "version_pinned";

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  actor: string; // user id
  targetId?: string; // node id
  targetName?: string;
  message: string;
  at: string; // ISO
}

export interface Graph {
  nodes: CatalogNode[];
  edges: CatalogEdge[];
}
