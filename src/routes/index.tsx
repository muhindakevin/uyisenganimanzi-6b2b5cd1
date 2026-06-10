import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { PartnersMarquee } from "@/components/PartnersMarquee";
import { Button } from "@/components/ui/button";

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

type HeroContent = {
  badge: string;
  title: string;
  description: string;
  ctaPrimaryLabel: string;
  ctaPrimaryLink: string;
  ctaSecondaryLabel: string;
  ctaSecondaryLink: string;
  slides: string[];
};

type Stat = { value: string; label: string };
type Program = { id: number; title: string; description: string; image?: string | null };

const DEFAULT_HERO: HeroContent = {
  badge: "Non-Governmental Organization · Kigali, Rwanda",
  title: "Hope, healing and opportunity for every young Rwandan.",
  description:
    "Uyisenga Ni Imanzi walks alongside children, youth and families—providing psychosocial care, education and the tools to build resilient livelihoods.",
  ctaPrimaryLabel: "Support our work",
  ctaPrimaryLink: "/donate",
  ctaSecondaryLabel: "Our programs",
  ctaSecondaryLink: "/programs",
  slides: [],
};

function Index() {
  const [hero, setHero] = useState<HeroContent>(DEFAULT_HERO);
  const [stats, setStats] = useState<Stat[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const h = data?.hero as Partial<HeroContent> | undefined;
        if (h) {
          const slides = Array.isArray(h.slides) ? (h.slides.filter(Boolean) as string[]) : [];
          setHero({ ...DEFAULT_HERO, ...h, slides });
        }
        if (Array.isArray(data?.stats)) setStats(data.stats);
      })
      .catch(() => {});
    fetch("/api/programs")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPrograms(data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (hero.slides.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % hero.slides.length), 5000);
    return () => clearInterval(id);
  }, [hero.slides.length]);

  return (
    <SiteLayout>
      <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-gradient-to-br from-primary via-primary-glow to-accent">
        {hero.slides.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-4 text-center text-white sm:px-6">
          <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            {hero.badge}
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl md:text-6xl drop-shadow">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/90 sm:text-lg">
            {hero.description}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to={hero.ctaPrimaryLink}>
                {hero.ctaPrimaryLabel} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/15 hover:text-white">
              <Link to={hero.ctaSecondaryLink}>{hero.ctaSecondaryLabel}</Link>
            </Button>
          </div>
        </div>
        {hero.slides.length > 1 && (
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {hero.slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-white" : "w-2 bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </section>

      {stats.length > 0 && (
        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-semibold text-primary">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Our Programs</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Care, education and opportunity, delivered with dignity.
          </h2>
        </div>

        {programs.length === 0 ? (
          <p className="mt-10 text-muted-foreground">Programs will appear here once the admin adds them.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {programs.map((program) => (
              <article key={program.id} className="group overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/15 to-primary/40">
                  {program.image ? (
                    <img src={program.image} alt={program.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : null}
                </div>
                <div className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Program</p>
                  <h3 className="mt-4 text-2xl font-semibold text-foreground">{program.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground line-clamp-3">{program.description}</p>
                  <div className="mt-6">
                    <Button asChild size="sm" variant="secondary">
                      <Link to="/programs/$id" params={{ id: String(program.id) }}>Learn more</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-glow to-accent p-10 text-primary-foreground sm:p-14">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Stand with Rwanda's next generation.
          </h2>
          <p className="mt-3 max-w-xl text-primary-foreground/90">
            A small monthly gift funds counseling, school fees and starter kits for families.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/donate">Donate</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/contact">Volunteer</Link>
            </Button>
          </div>
        </div>
      </section>

      <PartnersMarquee />
    </SiteLayout>
  );
}
