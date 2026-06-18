import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, Users, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/about/impact")({
  component: OurImpact,
});

type ImpactStat = { value: string; label: string };

type Content = {
  impactStats: ImpactStat[];
  impactRecognition: string[];
};

const DEFAULT_CONTENT: Content = {
  impactStats: [
    { value: "20,000+", label: "Children & youth supported" },
    { value: "20+", label: "Years of service since 2002" },
    { value: "3", label: "Provinces actively served" },
    { value: "Multiple", label: "Awards & recognition" },
  ],
  impactRecognition: [
    "Ministerial Decree N° 70/11 of 10th August 2005 granting legal entity to UNM.",
    "Awards in HIV/AIDS prevention among youth, child care, and children's rights.",
    "Active member of Ibuka, Rwanda NGO Forum on AIDS and Health Promotion.",
    "Member of the International Rehabilitation Council for Torture Victims (IRCT).",
    "Member of Family for Every Child.",
  ],
};

function OurImpact() {
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const about = data?.about || {};
        setContent({
          impactStats: Array.isArray(about?.impactStats)
            ? about.impactStats.map((item: any) => ({ value: String(item?.value ?? ""), label: String(item?.label ?? "") }))
            : DEFAULT_CONTENT.impactStats,
          impactRecognition: Array.isArray(about?.impactRecognition)
            ? about.impactRecognition.map((item: any) => String(item ?? ""))
            : DEFAULT_CONTENT.impactRecognition,
        });
      })
      .catch(() => {});
  }, []);

  const stats = content.impactStats;
  const recognition = content.impactRecognition;
  const icons = [Award, TrendingUp, Users, Sparkles];

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">Our impact</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Two decades of accompanying orphans, survivors and vulnerable youth across Rwanda.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div key={stat.label} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <Icon className="h-7 w-7 text-primary" />
              <p className="mt-4 text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <h3 className="text-xl font-semibold text-foreground">Recognition & memberships</h3>
        <ul className="mt-4 space-y-2 text-muted-foreground">
          {recognition.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
