import { Settings2 } from "lucide-react";
import { PanelHeader } from "@/components/ext/Panel";
import { Kbd } from "@/components/ext/Kbd";
import { useAppStore } from "@/lib/store";
import { service } from "@/lib/mock/service";
import { UserAvatar } from "@/components/ext/UserAvatar";

const shortcuts = [
  { keys: ["⌘", "K"], label: "Open command palette" },
  { keys: ["⌘", "B"], label: "Toggle sidebar" },
  { keys: ["⌘", "I"], label: "Toggle inspector" },
  { keys: ["⌘", "J"], label: "Toggle activity drawer" },
  { keys: ["↑", "↓"], label: "Navigate lists" },
  { keys: ["↵"], label: "Open selected item" },
  { keys: ["Esc"], label: "Close overlays" },
];

const integrations = [
  { name: "Slack", status: "Connected", by: "asha" },
  { name: "PagerDuty", status: "Connected", by: "tom" },
  { name: "GitHub", status: "Connected", by: "dan" },
  { name: "Snowflake", status: "Connected", by: "dan" },
  { name: "Looker", status: "Read-only", by: "asha" },
  { name: "dbt Cloud", status: "Connected", by: "mira" },
];

export function SettingsPage() {
  const { theme, setTheme } = useAppStore();
  const user = service.currentUser();

  return (
    <div className="flex h-full min-w-0 flex-col bg-background">
      <PanelHeader
        title={
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
            <Settings2 size={14} className="text-muted-foreground" /> Settings
          </span>
        }
      />
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl space-y-8 p-6">
          <Section title="Appearance" description="How RaadRaac looks on this device.">
            <Row label="Theme">
              <div className="inline-flex rounded-md border border-border p-0.5">
                {(["dark", "light"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`h-7 rounded px-3 text-[12px] capitalize ${theme === t ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Row>
          </Section>

          <Section title="Workspace" description="Shared by everyone in analytics-workspace.">
            <Row label="Workspace name"><Input defaultValue="analytics-workspace" /></Row>
            <Row label="Time zone"><Input defaultValue="UTC" /></Row>
            <Row label="Default owner"><Input defaultValue="@asha" /></Row>
          </Section>

          <Section title="Keyboard shortcuts" description="Every list, panel, and dialog is keyboard-navigable.">
            <ul className="divide-y divide-border rounded-md border border-border bg-surface">
              {shortcuts.map((s) => (
                <li key={s.label} className="flex items-center justify-between px-3 py-2 text-[12.5px]">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="flex items-center gap-1">
                    {s.keys.map((k) => <Kbd key={k}>{k}</Kbd>)}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Integrations" description="Third-party systems reading from or writing to your catalog.">
            <ul className="divide-y divide-border rounded-md border border-border bg-surface">
              {integrations.map((i) => (
                <li key={i.name} className="flex items-center justify-between px-3 py-2.5 text-[12.5px]">
                  <div>
                    <div className="font-medium">{i.name}</div>
                    <div className="text-[10.5px] text-muted-foreground">Connected by @{i.by}</div>
                  </div>
                  <span className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[10.5px] text-muted-foreground">{i.status}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Account" description="Signed in as">
            <div className="flex items-center gap-3 rounded-md border border-border bg-surface p-3">
              <UserAvatar userId={user.id} size={36} />
              <div>
                <div className="text-[13px] font-medium">{user.name}</div>
                <div className="text-[11.5px] text-muted-foreground">@{user.handle}</div>
              </div>
            </div>
          </Section>

          <div className="pt-4 text-[10.5px] text-muted-foreground">
            RaadRaac v1.1 · Build 2026.07.15 · <a className="hover:text-foreground" href="#">Changelog</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-[13.5px] font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2">
      <span className="text-[12.5px] text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-7 w-[220px] rounded-md border border-border bg-background px-2 text-[12.5px] outline-none focus-ring"
    />
  );
}
