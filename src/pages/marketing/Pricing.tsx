import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free",
    price: "$0",
    for: "For individuals getting started.",
    features: ["Up to 20 datasets", "1 GB storage", "Unlimited versions", "Basic search"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Team",
    price: "$12",
    unit: "/user / month",
    for: "For growing data teams.",
    features: ["Unlimited datasets", "100 GB storage", "Team collaboration", "Advanced permissions", "Activity export"],
    cta: "Start trial",
    highlight: true,
  },
  {
    name: "Organization",
    price: "Contact",
    for: "For institutions & enterprises.",
    features: ["Everything in Team", "SSO & SAML", "Custom retention", "Priority support", "SLA"],
    cta: "Contact sales",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Pricing</p>
        <h1 className="font-display text-5xl md:text-6xl">Simple, honest pricing.</h1>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`rounded-2xl border p-8 ${t.highlight ? "border-primary bg-surface shadow-card" : "border-border bg-surface shadow-soft"}`}
          >
            {t.highlight && (
              <div className="mb-4 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                Most popular
              </div>
            )}
            <h3 className="font-display text-2xl">{t.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.for}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl">{t.price}</span>
              {t.unit && <span className="text-sm text-muted-foreground">{t.unit}</span>}
            </div>
            <Button asChild className="mt-6 w-full" variant={t.highlight ? "default" : "outline"}>
              <Link to="/auth?mode=signup">{t.cta}</Link>
            </Button>
            <ul className="mt-6 space-y-2 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">Prices shown in USD. Billing UI is not yet enabled.</p>
    </section>
  );
}
