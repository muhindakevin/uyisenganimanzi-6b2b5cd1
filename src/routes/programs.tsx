import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteLayout } from "@/frontend/components/SiteLayout";
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

const EMPTY_PAGE_CONTENT: ProgramsPageContent = {
  label: "",
  heading: "",
  description1: "",
  description2: "",
};

function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [pageContent, setPageContent] = useState<ProgramsPageContent>(EMPTY_PAGE_CONTENT);

  useEffect(() => {
    Promise.all([
      fetch("/api/programs", { cache: "no-store" }).then((response) => response.json()),
      fetch("/api/content", { cache: "no-store" }).then((response) => response.json()),
    ])
      .then(([programRows, content]) => {
        if (Array.isArray(programRows)) setPrograms(programRows);
        if (content?.programsPage) setPageContent({ ...EMPTY_PAGE_CONTENT, ...content.programsPage });
      })
      .catch(() => {});
  }, []);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{pageContent.label}</p>
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
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 shadow-[var(--shadow-card)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Program areas</p>
            <div className="mt-6 space-y-4">
              {programs.map((program) => (
                <Link
                  key={program.id}
                  to="/programs/$id"
                  params={{ id: String(program.id) }}
                  className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-primary/10"
                >
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="h-4 w-4" />
                  </span>
                  <p className="text-sm leading-7 text-foreground">{program.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        {programs.length === 0 ? (
          <p className="text-muted-foreground">No programs yet — the admin can add them in the dashboard.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {programs.map((program) => (
              <Link
                key={program.id}
                to="/programs/$id"
                params={{ id: String(program.id) }}
                aria-label={`Read more about ${program.title}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-slate-900 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1"
              >
                {program.image ? (
                  <img
                    src={program.image}
                    alt={program.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-glow to-slate-900" />
                )}

                {/* Default: dark overlay at bottom with title only */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
                <div className="absolute inset-x-0 bottom-0 p-5 transition-opacity duration-300 group-hover:opacity-0">
                  <h2 className="text-xl font-bold leading-tight text-white drop-shadow">{program.title}</h2>
                  <span className="mt-4 inline-flex w-fit items-center rounded-md border border-white bg-transparent px-5 py-2 text-sm font-semibold text-white transition group-hover:bg-white group-hover:text-primary">
                    Learn More
                  </span>
                </div>

                {/* Hover: full dark overlay with title, description, Learn More */}
                <div className="absolute inset-0 flex flex-col justify-center bg-primary/90 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h2 className="text-xl font-bold leading-tight text-white">{program.title}</h2>
                  <p className="mt-3 line-clamp-6 text-sm leading-6 text-white/90">{program.description}</p>
                  <span className="mt-5 inline-flex w-fit items-center rounded-md border border-white bg-transparent px-5 py-2 text-sm font-semibold text-white transition group-hover:bg-white group-hover:text-primary">
                    Learn More
                  </span>
                </div>
              </Link>
            ))}
          </div>

        )}
      </section>
    </SiteLayout>
  );
}
