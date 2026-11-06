import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/frontend/components/SiteLayout";
import { PartnersMarquee } from "@/frontend/components/PartnersMarquee";
import { Button } from "@/frontend/components/ui/button";
import { newsSlug } from "@/lib/news-links";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Uyisenga Ni Imanzi — Hope & Opportunity in Rwanda" },
      { name: "description", content: "UNM is a Rwandan NGO empowering young people and communities through psychosocial support, education, and economic opportunity." },
      { property: "og:title", content: "Uyisenga Ni Imanzi (UNM) — Empowering Rwandan Youth" },
      { property: "og:description", content: "Empowering Rwandan youth and communities through psychosocial care, learning, and livelihoods." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://test.uyisenganimanzi.org.rw/" },
    ],
    links: [{ rel: "canonical", href: "https://test.uyisenganimanzi.org.rw/" }],
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

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const match = value.match(/^([\d,.\s]+)(.*)$/);
    if (!match) { setDisplay(value); return; }
    const target = parseFloat(match[1].replace(/[,\s]/g, ""));
    const suffix = match[2] ?? "";
    if (!Number.isFinite(target) || target <= 0) { setDisplay(value); return; }
    const decimals = (match[1].split(".")[1] || "").length;
    const format = (n: number) =>
      (decimals > 0 ? n.toFixed(decimals) : String(Math.round(n)))
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;

    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || started.current) return;
      started.current = true;
      observer.disconnect();
      const duration = 1600;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(format(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
type Program = { id: number; title: string; description: string; image?: string | null };

const DEFAULT_HERO: HeroContent = {
  badge: "",
  title: "",
  description: "",
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
  const [about, setAbout] = useState<{ storyTitle?: string; storyText?: string; storyImage?: string }>({});

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
        if (data?.about) setAbout(data.about);
      })
      .catch(() => {});
    fetch("/api/programs", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPrograms(data.slice(0, 3));
      })
      .catch(() => {});
    fetch("/api/press-room?category=News&limit=5", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setStories(data as Story[]);
      })
      .catch(() => {});
  }, []);


  useEffect(() => {
    if (stories.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % stories.length), 6000);
    return () => clearInterval(id);
  }, [stories.length]);

  return (
    <SiteLayout>
      <h1 className="sr-only">Uyisenga Ni Imanzi — Hope, Healing, and Opportunity in Rwanda</h1>

      {stories.length > 0 && (
        <section className="relative h-[calc(100vh-4rem)] min-h-[520px] w-full overflow-hidden bg-primary text-primary-foreground">
          {stories.map((s, i) => s.image ? (
            <img
              key={s.id}
              src={s.image}
              alt={i === active ? s.title : ""}
              aria-hidden={i !== active}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${i === active ? "opacity-100 animate-kenburns" : "opacity-0"}`}
            />
          ) : null)}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-hero-shade/80 via-hero-shade/45 to-hero-shade/10" />
          <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-16 md:px-20 sm:px-6">
            <Link to="/press-room/news/$id" params={{ id: newsSlug(stories[active]) }} className="block max-w-2xl border-l-4 border-accent pl-4 hover:underline">
              <span className="text-xs uppercase tracking-widest text-primary-foreground/70">Latest news</span>
              <h2 className="text-lg font-semibold sm:text-2xl">{stories[active]?.title}</h2>
            </Link>
          </div>
          {stories.length > 1 && (
            <>
              <Button type="button" variant="ghost" className="absolute left-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 rounded-full bg-primary/70 p-0 text-primary-foreground hover:bg-primary hover:text-primary-foreground md:flex" onClick={() => setActive((i) => (i - 1 + stories.length) % stories.length)} aria-label="Previous story"><ChevronLeft className="h-8 w-8" /></Button>
              <Button type="button" variant="ghost" className="absolute right-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 rounded-full bg-primary/70 p-0 text-primary-foreground hover:bg-primary hover:text-primary-foreground md:flex" onClick={() => setActive((i) => (i + 1) % stories.length)} aria-label="Next story"><ChevronRight className="h-8 w-8" /></Button>
              <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center gap-2">
                {stories.map((_, i) => (
                  <Button variant="ghost" key={i} aria-label={`Go to story ${i + 1}`} onClick={() => setActive(i)} className={`h-2 min-w-0 rounded-full p-0 transition-all hover:bg-primary-foreground ${i === active ? "w-8 bg-primary-foreground" : "w-2 bg-primary-foreground/50"}`} />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {stats.length > 0 && (
        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 px-4 py-6 sm:px-6 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-semibold text-primary"><CountUp value={s.value} /></p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {about.storyText ? (
        <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
          <div className="grid overflow-hidden rounded-[2rem] bg-primary text-primary-foreground md:grid-cols-2">
            {about.storyImage ? <img src={about.storyImage} alt={about.storyTitle || "Who we are"} loading="lazy" className="h-72 w-full object-cover md:h-full" /> : null}
            <div className="p-8 sm:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-foreground/70">Who we are</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{about.storyTitle}</h2>
              <p className="mt-5 line-clamp-6 leading-7 text-primary-foreground/90">{about.storyText}</p>
              <Button asChild size="lg" variant="secondary" className="mt-8"><Link to="/about">Read more</Link></Button>
            </div>
          </div>
        </section>
      ) : null}

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
                      <Link to="/programs/$id" params={{ id: String(program.id) }}>{`Learn more about ${program.title}`}</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {stories.length > 0 && (
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-primary">Latest news</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Stories from our communities</h2>
              </div>
              <Button asChild variant="outline"><Link to="/press-room/news">All news</Link></Button>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stories.slice(0, 3).map((s) => (
                <Link key={s.id} to="/press-room/news/$id" params={{ id: newsSlug(s) }} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition hover:-translate-y-1">
                  <div className="aspect-[4/3] overflow-hidden bg-primary/10">
                    {s.image ? <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : null}
                  </div>
                  <div className="p-5">
                    {s.created_at ? <p className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</p> : null}
                    <h3 className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary">{s.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
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
