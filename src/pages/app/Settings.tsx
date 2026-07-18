import { useAuth } from "@/lib/auth";
import { useUI } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useUI();

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="font-display text-4xl">Settings</h1>

      <section className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="font-medium">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="font-medium">Appearance</h2>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Theme: {theme}</span>
          <Button variant="outline" size="sm" onClick={toggleTheme}>Toggle</Button>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="font-medium">Keyboard</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li className="flex justify-between"><span>Search</span><kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-xs">⌘K</kbd></li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-destructive/40 bg-surface p-6">
        <h2 className="font-medium">Sign out</h2>
        <p className="mt-1 text-sm text-muted-foreground">End your session on this device.</p>
        <Button variant="destructive" size="sm" className="mt-3" onClick={async () => { await signOut(); toast.success("Signed out"); }}>
          Sign out
        </Button>
      </section>
    </div>
  );
}
