import type { NodeType } from "@/lib/mock/types";
import {
  Table2,
  GitBranch,
  Wand2,
  LayoutDashboard,
  FileText,
  Radio,
  Database,
  HardDrive,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const typeMeta: Record<
  NodeType,
  { label: string; icon: React.ComponentType<{ className?: string; size?: number }>; token: string }
> = {
  dataset: { label: "Dataset", icon: Table2, token: "node-dataset" },
  pipeline: { label: "Pipeline", icon: GitBranch, token: "node-pipeline" },
  transformation: { label: "Transform", icon: Wand2, token: "node-transformation" },
  dashboard: { label: "Dashboard", icon: LayoutDashboard, token: "node-dashboard" },
  report: { label: "Report", icon: FileText, token: "node-report" },
  api: { label: "API", icon: Radio, token: "node-api" },
  database: { label: "Database", icon: Database, token: "node-database" },
  storage: { label: "Storage", icon: HardDrive, token: "node-storage" },
};

export function TypeBadge({
  type,
  compact,
  className,
}: {
  type: NodeType;
  compact?: boolean;
  className?: string;
}) {
  const meta = typeMeta[type];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wider",
        className
      )}
      style={{
        color: `hsl(var(--${meta.token}))`,
        borderColor: `hsl(var(--${meta.token}) / 0.35)`,
        backgroundColor: `hsl(var(--${meta.token}) / 0.08)`,
      }}
    >
      <Icon size={11} />
      {!compact && meta.label}
    </span>
  );
}

export function TypeIcon({ type, size = 14, className }: { type: NodeType; size?: number; className?: string }) {
  const Icon = typeMeta[type].icon;
  return <Icon size={size} className={className} />;
}
