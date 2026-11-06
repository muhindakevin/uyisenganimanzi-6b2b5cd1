import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteLayout } from "@/frontend/components/SiteLayout";
import { ProgramCard } from "@/frontend/components/ProgramCard";

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: [
      { title: "Programs — Uyisenga Ni Imanzi (UNM)" },
      { name: "description", content: "Explore UNM's programs in psychosocial support, education, livelihoods and community resilience across Rwanda." },
      { property: "og:title", content: "UNM Programs" },
      { property: "og:description", content: "Care, education and livelihoods for Rwandan youth and families." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase text-primary">{pageContent.label}</p>
          <h1 className="mt-4 text-4xl font-bold text-foreground sm:text-5xl">{pageContent.heading || "What We Do"}</h1>
          {pageContent.description1 ? <p className="mt-6 text-lg leading-8 text-muted-foreground">{pageContent.description1}</p> : null}
          {pageContent.description2 ? <p className="mt-4 text-lg leading-8 text-muted-foreground">{pageContent.description2}</p> : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        {programs.length === 0 ? (
          <p className="text-muted-foreground">No programs yet — the admin can add them in the dashboard.</p>
        ) : (
          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => <ProgramCard key={program.id} program={program} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}