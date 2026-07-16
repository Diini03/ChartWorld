import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BellRing, BellOff, Mail, MessageSquare, Siren } from "lucide-react";
import { PanelHeader } from "@/components/ext/Panel";
import { alertRules, type AlertRule } from "@/lib/mock/extras";
import { cn } from "@/lib/utils";

const sevStyles: Record<AlertRule["severity"], string> = {
  info: "bg-info/15 text-info",
  warn: "bg-warning/15 text-warning",
  critical: "bg-danger/15 text-danger",
};

const channelIcon = { slack: MessageSquare, pagerduty: Siren, email: Mail };

export function AlertsPage() {
  const { data: initial = [] } = useQuery({ queryKey: ["alerts"], queryFn: async () => alertRules() });
  const [rules, setRules] = useState<AlertRule[]>([]);
  const list = rules.length ? rules : initial;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = list.find((r) => r.id === selectedId);

  const toggleMute = (id: string) => {
    const next = list.map((r) => (r.id === id ? { ...r, muted: !r.muted } : r));
    setRules(next);
  };

  return (
    <div className="flex h-full min-w-0 bg-background">
      <div className="flex min-w-0 flex-1 flex-col">
        <PanelHeader
          title={
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
              <BellRing size={14} className="text-muted-foreground" /> Alerts
              <span className="ml-1 font-mono text-[11px] text-muted-foreground">{list.length}</span>
            </span>
          }
        />
        <div className="grid grid-cols-[1.6fr_0.7fr_0.9fr_1fr_0.6fr] gap-3 border-b border-border bg-surface-2 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <div>Rule</div>
          <div>Severity</div>
          <div>Channels</div>
          <div>Last fired</div>
          <div>Mute</div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          {list.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              className={cn(
                "grid w-full grid-cols-[1.6fr_0.7fr_0.9fr_1fr_0.6fr] items-center gap-3 border-b border-border/60 px-4 py-2 text-left text-[12.5px] hover:bg-surface-2 focus-ring",
                selectedId === r.id && "bg-primary/10"
              )}
            >
              <div className="min-w-0">
                <div className="truncate">{r.name}</div>
                <div className="truncate font-mono text-[10.5px] text-muted-foreground">{r.target}</div>
              </div>
              <div>
                <span className={cn("rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider", sevStyles[r.severity])}>
                  {r.severity}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {r.channels.map((c) => {
                  const Icon = channelIcon[c];
                  return (
                    <span key={c} title={c} className="inline-flex h-5 w-5 items-center justify-center rounded border border-border bg-surface text-muted-foreground">
                      <Icon size={11} />
                    </span>
                  );
                })}
              </div>
              <div className="text-[11.5px] text-muted-foreground">
                {r.lastFiredAt ? new Date(r.lastFiredAt).toLocaleString() : "—"}
              </div>
              <div>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={r.muted ? "Unmute alert" : "Mute alert"}
                  onClick={(e) => { e.stopPropagation(); toggleMute(r.id); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); toggleMute(r.id); }}}
                  className={cn(
                    "inline-flex h-6 items-center gap-1 rounded border border-border px-2 font-mono text-[10.5px] hover:bg-surface focus-ring",
                    r.muted ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {r.muted ? <BellOff size={11} /> : <BellRing size={11} />}
                  {r.muted ? "muted" : "active"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="flex w-[360px] shrink-0 flex-col border-l border-border bg-surface">
          <PanelHeader title={<span className="text-[12.5px] font-medium">{selected.name}</span>} />
          <div className="p-4 text-[12.5px]">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Fire history</div>
            <ol className="relative space-y-3 border-l border-border pl-4">
              {selected.fireHistory.map((f, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[19px] top-1 h-2 w-2 rounded-full bg-danger" />
                  <div className="text-foreground">{f.note}</div>
                  <div className="font-mono text-[10.5px] text-muted-foreground">{new Date(f.at).toLocaleString()}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
