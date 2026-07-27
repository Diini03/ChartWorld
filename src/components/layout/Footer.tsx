import { Link } from "react-router-dom";
import { Logo } from "./FloatingNav";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border/60">
      <div className="container grid gap-10 py-16 md:grid-cols-4">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-display text-xl">ChartWorld</span>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            An interactive world for discovering charts. Learn what to use, when, and why — with Python code you can copy.
          </p>
        </div>
        <FooterCol title="Explore" links={[
          ["/explore", "All charts"],
          ["/categories", "Categories"],
          ["/compare", "Compare"],
          ["/chooser", "Choose a chart"],
        ]} />
        <FooterCol title="More" links={[
          ["/playground", "Playground"],
          ["/python", "Python guide"],
          ["/resources", "Resources"],
          ["/muuji", "Muuji"],
        ]} />
      </div>
      <div className="border-t border-border/60">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} ChartWorld. Built to be enjoyed.</p>
          <p className="font-mono">chartworld.diinikahiye.online</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{title}</p>
      <ul className="space-y-2">
        {links.map(([to, label]) => (
          <li key={label}>
            <Link to={to} className="text-sm text-foreground/80 hover:text-foreground">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
