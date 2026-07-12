import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/frontend/components/SiteLayout";
import { PartnersMarquee } from "@/frontend/components/PartnersMarquee";
import { Button } from "@/frontend/components/ui/button";

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

type Story = { id: number; title: string; summary: string; description: string | null; category: string; image?: string | null; link?: string | null; created_at?: string | null };

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
  ctaPrimaryLabel: "Donate",
  ctaPrimaryLink: "/donate",
  ctaSecondaryLabel: "Get Involved",
  ctaSecondaryLink: "/get-involved",
  slides: [],
};

function Index() {
  const [hero, setHero] = useState<HeroContent>(DEFAULT_HERO);
  const [stats, setStats] = useState<Stat[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
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
    fetch("/api/programs", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPrograms(data.slice(0, 3));
      })
      .catch(() => {});
    const refreshStories = () => {
      fetch("/api/press-room?category=News&limit=5", { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setStories(data as Story[]);
        })
        .catch(() => {});
    };

    refreshStories();
    const refreshInterval = setInterval(refreshStories, 10000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (stories.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % stories.length), 5000);
    return () => clearInterval(id);
  }, [stories.length]);

  return (
    <SiteLayout>
      <section className="relative h-[calc(78vh-4rem)] min-h-[430px] max-h-[620px] w-full overflow-hidden text-white">
        <div className="absolute inset-0 bg-slate-950" />
        {stories[active]?.image ? (
          <img src={stories[active].image} alt={stories[active].title} className="absolute inset-0 h-full w-full object-cover opacity-95" />
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

        {stories.length > 1 && (
          <>
            <Button
              type="button"
              variant="ghost"
              className="absolute left-3 top-1/2 z-30 h-14 w-14 -translate-y-1/2 rounded-full p-0 text-white hover:bg-white/10 hover:text-white sm:left-8"
              onClick={() => setActive((i) => (i - 1 + stories.length) % stories.length)}
              aria-label="Previous story"
            >
              <ChevronLeft className="h-12 w-12 stroke-[3]" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="absolute right-3 top-1/2 z-30 h-14 w-14 -translate-y-1/2 rounded-full p-0 text-white hover:bg-white/10 hover:text-white sm:right-8"
              onClick={() => setActive((i) => (i + 1) % stories.length)}
              aria-label="Next story"
            >
              <ChevronRight className="h-12 w-12 stroke-[3]" />
            </Button>
          </>
        )}

        <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-end px-4 pb-10 text-center sm:px-6 sm:pb-14">
          <Link to={stories[active]?.link || "/press-room/news"} className="block max-w-5xl">
            <h1 className="text-2xl font-bold leading-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.55)] sm:text-3xl md:text-4xl">
              {stories[active]?.title ?? hero.title}
            </h1>
          </Link>

          <div className="mt-6 flex w-full flex-row items-center justify-center gap-3 sm:w-auto sm:gap-6">
            <Button asChild size="lg" variant="outline" className="h-12 flex-1 rounded-none border-white/80 bg-transparent px-4 text-sm font-bold text-white hover:bg-white/15 hover:text-white sm:h-14 sm:w-48 sm:flex-none sm:px-8 sm:text-base">
              <Link to={hero.ctaSecondaryLink}>{hero.ctaSecondaryLabel}</Link>
            </Button>
            <Button asChild size="lg" className="h-12 flex-1 rounded-none bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90 sm:h-14 sm:w-48 sm:flex-none sm:px-8 sm:text-base">
              <Link to={hero.ctaPrimaryLink}>{hero.ctaPrimaryLabel}</Link>
            </Button>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 px-4 py-6 sm:px-6 md:grid-cols-4">
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
