import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import aboutImg from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Uyisenga Ni Imanzi (UNM)" },
      { name: "description", content: "Learn about UNM's mission, history, and team supporting Rwandan youth and communities." },
      { property: "og:title", content: "About UNM" },
      { property: "og:description", content: "Our mission, history, and the people behind Uyisenga Ni Imanzi." },
    ],
  }),
  component: About,
});

const values = [
  { t: "Dignity", d: "Every person we serve is met with respect and confidentiality." },
  { t: "Listening", d: "Programs are co-designed with the youth and families who use them." },
  { t: "Long-term impact", d: "We measure success by lives changed, not activities delivered." },
];

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">About us</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          We exist so no young person walks alone.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Uyisenga Ni Imanzi (UNM) is a Rwandan NGO founded to support children, adolescents and
          families affected by loss, vulnerability and exclusion. From our base in Kigali we deliver
          care that is rooted in community and shaped by lived experience.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <img
          src={aboutImg}
          alt="Two women laughing together during a UNM peer support session"
          width={1600}
          height={1066}
          loading="lazy"
          className="w-full rounded-3xl object-cover aspect-[16/9] shadow-[var(--shadow-card)]"
        />
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Our mission</h2>
          <p className="mt-3 text-muted-foreground">
            To accompany young Rwandans on their journey to healing and opportunity—through
            psychosocial care, education and economic empowerment.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Our vision</h2>
          <p className="mt-3 text-muted-foreground">
            A Rwanda where every young person has the support, skills and hope to shape their
            own future—and uplift those around them.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">What guides us</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.t} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-lg font-semibold text-foreground">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
