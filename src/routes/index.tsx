import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, GraduationCap, Sprout } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { PartnersMarquee } from "@/components/PartnersMarquee";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.jpg";
import programsImg from "@/assets/programs.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Uyisenga Ni Imanzi (UNM) — Hope, Healing, Opportunity in Rwanda" },
      { name: "description", content: "UNM is a Rwandan NGO empowering young people and communities through psychosocial support, education, and economic opportunity." },
      { property: "og:title", content: "Uyisenga Ni Imanzi (UNM)" },
      { property: "og:description", content: "Empowering Rwandan youth and communities through care, learning, and livelihoods." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[image:var(--gradient-soft)]" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 md:items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              Non-Governmental Organization · Kigali, Rwanda
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Hope, healing and opportunity for every young Rwandan.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Uyisenga Ni Imanzi walks alongside children, youth and families—
              providing psychosocial care, education and the tools to build resilient livelihoods.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/get-involved">Support our work <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/programs">Our programs</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-[image:var(--gradient-hero)] opacity-20 blur-2xl" />
            <img
              src={heroImg}
              alt="Young people smiling together at a UNM community gathering in Kigali"
              width={1920}
              height={1280}
              className="rounded-2xl object-cover shadow-[var(--shadow-elegant)] aspect-[4/3] w-full"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {[
            { v: "20+", l: "Years of service" },
            { v: "10k+", l: "Lives reached" },
            { v: "30+", l: "Community partners" },
            { v: "5", l: "Districts active" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-3xl font-semibold text-foreground">{s.v}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Three pillars, one promise.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything we do is grounded in dignity, listening, and long-term impact.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { Icon: HeartHandshake, t: "Psychosocial Care", d: "Trauma-informed counseling, peer support and home visits for children and youth." },
            { Icon: GraduationCap, t: "Education & Mentorship", d: "Scholarships, tutoring and mentoring that keep young people in school and thriving." },
            { Icon: Sprout, t: "Livelihoods", d: "Vocational training and seed grants helping families build sustainable income." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elegant)]">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story strip */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid items-center gap-10 rounded-3xl border border-border bg-card p-6 sm:p-10 md:grid-cols-2">
          <img
            src={programsImg}
            alt="UNM youth in a community workshop"
            width={1600}
            height={1066}
            loading="lazy"
            className="rounded-2xl object-cover aspect-[4/3] w-full"
          />
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              A community-led approach since day one.
            </h2>
            <p className="mt-3 text-muted-foreground">
              From our home in Kigali, our teams co-design programs with the young people
              and families they serve—creating safe spaces where healing meets opportunity.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild>
                <Link to="/about">Read our story</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/contact">Visit us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] p-10 text-primary-foreground sm:p-14">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Stand with Rwanda's next generation.
          </h2>
          <p className="mt-3 max-w-xl text-primary-foreground/90">
            A small monthly gift funds counseling, school fees and starter kits for families.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/get-involved">Donate</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/get-involved">Volunteer</Link>
            </Button>
          </div>
        </div>
      </section>

      <PartnersMarquee />
    </SiteLayout>
  );
}
