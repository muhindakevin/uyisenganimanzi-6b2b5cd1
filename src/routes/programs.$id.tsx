import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { SiteLayout } from "@/frontend/components/SiteLayout";
import { Button } from "@/frontend/components/ui/button";

export const Route = createFileRoute("/programs/$id")({
  head: () => ({
    meta: [
      { title: "Program Details — Uyisenga Ni Imanzi" },
      { name: "description", content: "Read full program information and related sub-programs managed by the admin team." },
      { property: "og:title", content: "Program Details — Uyisenga Ni Imanzi" },
      { property: "og:description", content: "Full program descriptions and sub-program information from Uyisenga Ni Imanzi." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgramDetail,
});

type Program = {
  id: number;
  title: string;
  description: string;
  long_description?: string | null;
  image?: string | null;
  cover_image?: string | null;
  attachment_url?: string | null;
  attachment_name?: string | null;
};

type SubProgram = {
  id: number;
  program_id: number;
  title: string;
  description: string;
  long_description?: string | null;
  image?: string | null;
  cover_image?: string | null;
  attachment_url?: string | null;
  attachment_name?: string | null;
};

function ProgramDetail() {
  const { id } = Route.useParams();
  const [program, setProgram] = useState<Program | null>(null);
  const [subs, setSubs] = useState<SubProgram[]>([]);
  const [openSub, setOpenSub] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/programs", { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/sub-programs?program_id=${id}`, { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([progRows, subRows]) => {
        const found = Array.isArray(progRows) ? progRows.find((p: Program) => String(p.id) === String(id)) : null;
        setProgram(found || null);
        setSubs(Array.isArray(subRows) ? subRows : []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <SiteLayout><div className="mx-auto max-w-4xl px-4 py-24 text-center text-muted-foreground">Loading…</div></SiteLayout>;
  if (!program) return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-muted-foreground">Program not found.</p>
        <Button asChild className="mt-6"><Link to="/programs">Back to programs</Link></Button>
      </div>
    </SiteLayout>
  );

  const cover = program.cover_image || program.image;

  return (
    <SiteLayout>
      {cover ? (
        <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden">
          <img src={cover} alt={program.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
          <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col justify-end px-4 pb-10 text-white sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground/80">Program</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{program.title}</h1>
          </div>
        </div>
      ) : (
        <section className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em]">Program</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{program.title}</h1>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/programs"><ArrowLeft className="mr-2 h-4 w-4" />Back to all programs</Link>
        </Button>
        <h2 className="text-2xl font-semibold text-foreground">Full description</h2>
        <div className="mt-5 space-y-5 text-lg leading-8 text-foreground">
          {program.description ? <p>{program.description}</p> : null}
          <div className="whitespace-pre-wrap text-muted-foreground">
            {program.long_description || program.description || "No program description has been added yet."}
          </div>
        </div>
        {program.attachment_url ? (
          <a href={program.attachment_url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10">
            <Download className="h-4 w-4" />
            {program.attachment_name || "Download attached file"}
          </a>
        ) : null}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="text-2xl font-semibold text-foreground">Sub-programs &amp; Projects</h2>
        <p className="mt-2 text-sm text-muted-foreground">Cards below belong to this program only.</p>
        {subs.length === 0 ? (
          <p className="mt-8 rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
            No sub-programs have been added for this program yet.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {subs.map((sub) => {
            const isOpen = openSub === sub.id;
            const subCover = sub.cover_image || sub.image;
            return (
              <article key={sub.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
                {subCover ? <img src={subCover} alt={sub.title} className="h-56 w-full object-cover" loading="lazy" /> : null}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground">{sub.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{sub.description}</p>
                  {isOpen && (
                    <div className="mt-4 space-y-3 border-t border-border pt-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-foreground/80">
                        {sub.long_description || sub.description || "No additional details yet."}
                      </p>
                      {sub.attachment_url ? (
                        <a href={sub.attachment_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                          <Download className="h-4 w-4" />
                          {sub.attachment_name || "Download file"}
                        </a>
                      ) : null}
                    </div>
                  )}
                  <Button
                    type="button"
                    variant={isOpen ? "secondary" : "default"}
                    size="sm"
                    onClick={() => setOpenSub(isOpen ? null : sub.id)}
                    className="mt-4"
                  >
                    {isOpen ? "Show less" : "Learn More"}
                  </Button>
                </div>
              </article>
            );
          })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
