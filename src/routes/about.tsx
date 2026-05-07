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
          Our story since 2002.
        </h1>
        <div className="mt-6 space-y-5 text-base text-muted-foreground sm:text-lg">
          <p>
            Uyisenga Ni Imanzi (UNM) was founded in 2002, with a mission to provide orphans from
            the genocide and HIV/AIDS with social services, education and income-generating
            opportunities. UNM was established to implement child- and youth-focused programs
            that address their special needs.
          </p>
          <p>
            After two years of concerted efforts, it became clear that these children were too
            traumatized to fully participate in or benefit from the programs offered. With the
            addition of psychosocial and health services in 2004, UNM expanded and strengthened
            its activities greatly—especially in Kigali City and the Southern and Eastern
            Provinces.
          </p>
          <p>
            In recognition of the needs of orphans in Rwanda, the Ministerial Decree granting
            legal entity to the Association Uyisenga Ni Imanzi is N° 70/11 of 10th August 2005,
            published in October 2005. Several awards have crowned UNM's activities, mainly in
            the fight against HIV/AIDS among youth, the care of children, and the promotion of
            children's rights.
          </p>
          <p>
            UNM is an active member of local and international umbrellas: Ibuka, Rwanda NGO Forum
            on AIDS and Health Promotion, the International Rehabilitation Council for Torture
            Victims, and Family for Every Child.
          </p>
        </div>
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
