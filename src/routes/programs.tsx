import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { HeartHandshake, Sprout, Users } from "lucide-react";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Uyisenga Ni Imanzi (UNM)" },
      { name: "description", content: "Explore UNM's programs in psychosocial support, education, livelihoods and community resilience across Rwanda." },
      { property: "og:title", content: "UNM Programs" },
      { property: "og:description", content: "Care, education and livelihoods for Rwandan youth and families." },
    ],
  }),
  component: Programs,
});

const programs = [
  { Icon: Users, t: "Child Protection", d: "Safeguarding children and adolescents through case management, family strengthening, and partnerships with local leaders to uphold children's rights." },
  { Icon: HeartHandshake, t: "Mental Health", d: "Trauma-informed counseling, peer support clubs, and home visits delivered by trained psychosocial workers across Kigali, Southern and Eastern Provinces." },
  { Icon: Sprout, t: "Economic Empowerment", d: "Vocational training, business mentorship and seed grants helping young people and caregivers build sustainable livelihoods." },
];

function Programs() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">What we do</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Programs designed with the people they serve.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Our work is organized around four interlinked pillars—care, learning, livelihoods and community.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {programs.map(({ Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elegant)]">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-foreground">{t}</h2>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
