import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/programs/$id")({
  component: ProgramDetail,
});

type Program = {
  id: number;
  title: string;
  description: string;
  long_description?: string | null;
  image?: string | null;
};

function ProgramDetail() {
  const { id } = Route.useParams();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/programs")
      .then((r) => r.json())
      .then((data: Program[]) => {
        const found = Array.isArray(data) ? data.find((p) => String(p.id) === String(id)) : null;
        setProgram(found || null);
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

  return (
    <SiteLayout>
      {program.image ? (
        <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden">
          <img src={program.image} alt={program.title} className="absolute inset-0 h-full w-full object-cover" />
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

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/programs"><ArrowLeft className="mr-2 h-4 w-4" />Back to all programs</Link>
        </Button>
        <p className="text-lg leading-8 text-foreground">{program.description}</p>
        {program.long_description ? (
          <div className="prose prose-lg mt-6 max-w-none whitespace-pre-wrap text-muted-foreground">
            {program.long_description}
          </div>
        ) : null}
      </section>
    </SiteLayout>
  );
}
