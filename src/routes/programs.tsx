import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Check } from "lucide-react";

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

type Program = {
  id: number;
  title: string;
  description: string;
  image?: string;
};

type ProgramsPageContent = {
  label: string;
  heading: string;
  description1: string;
  description2: string;
};

const DEFAULT_PROGRAMS: Program[] = [];

const DEFAULT_PAGE_CONTENT: ProgramsPageContent = {
  label: "Our Programs",
  heading: "Uyisenga Ni Imanzi's Programs",
  description1: "Since its establishment, Uyisenga Ni Imanzi has implemented various programs to support Rwandan children, youth, and families. Our work focuses on psychosocial support, education, livelihoods and community resilience.",
  description2: "Through our strategic initiatives, we empower vulnerable populations and foster sustainable development across Rwanda. We prioritize holistic support, community engagement, and evidence-based practices."
};

function Programs() {
  const [programs, setPrograms] = useState<Program[]>(DEFAULT_PROGRAMS);
  const [pageContent, setPageContent] = useState<ProgramsPageContent>(DEFAULT_PAGE_CONTENT);

  useEffect(() => {
    Promise.all([
      fetch("/api/programs").then((response) => response.json()),
      fetch("/api/content").then((response) => response.json()),
    ])
      .then(([programRows, content]) => {
        if (Array.isArray(programRows) && programRows.length > 0) {
          setPrograms(programRows);
        }
        if (content.programsPage) {
          setPageContent(content.programsPage);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">{pageContent.label}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {pageContent.heading}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {pageContent.description1}
            </p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {pageContent.description2}
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-8 shadow-[var(--shadow-card)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">Program areas</p>
            <div className="mt-6 space-y-4">
              {programs.map((program) => (
                <div key={program.id} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900 text-white">
                    <Check className="h-4 w-4" />
                  </span>
                  <p className="text-sm leading-7 text-foreground">{program.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        {programs.length === 0 ? (
          <p className="text-muted-foreground">No programs yet — the admin can add them in the dashboard.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {programs.map((program) => (
              <Link
                key={program.id}
                to="/programs/$id"
                params={{ id: String(program.id) }}
                className="group relative overflow-hidden rounded-[2rem] border border-border bg-slate-950 text-white shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-slate-950/75 transition-opacity duration-300 group-hover:bg-slate-950/40" />
                {program.image ? (
                  <img
                    src={program.image}
                    alt={program.title}
                    className="h-[320px] w-full object-cover brightness-90 transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-[320px] w-full bg-gradient-to-br from-primary via-primary-glow to-slate-950" />
                )}
                <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                  <p className="text-xs uppercase tracking-[0.24em] text-primary-foreground/80">Program</p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">{program.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-white/85 line-clamp-4">{program.description}</p>
                  <div className="mt-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                    Learn More
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
