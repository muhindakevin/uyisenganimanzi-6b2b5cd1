import { createFileRoute } from "@tanstack/react-router";
import { Award, Users, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/about/impact")({
  component: OurImpact,
});

const stats = [
  { Icon: Users, value: "20,000+", label: "Children & youth supported" },
  { Icon: Sparkles, value: "20+", label: "Years of service since 2002" },
  { Icon: TrendingUp, value: "3", label: "Provinces actively served" },
  { Icon: Award, value: "Multiple", label: "National & international awards" },
];

function OurImpact() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">Our impact</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Two decades of accompanying orphans, survivors and vulnerable youth across Rwanda.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ Icon, value, label }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <Icon className="h-7 w-7 text-primary" />
            <p className="mt-4 text-3xl font-bold text-foreground">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <h3 className="text-xl font-semibold text-foreground">Recognition & memberships</h3>
        <ul className="mt-4 space-y-2 text-muted-foreground">
          <li>• Ministerial Decree N° 70/11 of 10th August 2005 granting legal entity to UNM.</li>
          <li>• Awards in HIV/AIDS prevention among youth, child care, and children's rights.</li>
          <li>• Active member of Ibuka, Rwanda NGO Forum on AIDS and Health Promotion.</li>
          <li>• Member of the International Rehabilitation Council for Torture Victims (IRCT).</li>
          <li>• Member of Family for Every Child.</li>
        </ul>
      </div>
    </section>
  );
}
