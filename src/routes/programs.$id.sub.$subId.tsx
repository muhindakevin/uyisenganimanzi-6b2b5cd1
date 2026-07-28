import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { SiteLayout } from "@/frontend/components/SiteLayout";
import { Button } from "@/frontend/components/ui/button";

export const Route = createFileRoute("/programs/$id/sub/$subId")({
  head: () => ({
    meta: [
      { title: "Sub-Program — Uyisenga Ni Imanzi" },
      { name: "description", content: "Full sub-program details from Uyisenga Ni Imanzi." },
      { property: "og:title", content: "Sub-Program — Uyisenga Ni Imanzi" },
      { property: "og:description", content: "Full sub-program details from Uyisenga Ni Imanzi." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SubProgramDetail,
});

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

function SubProgramDetail() {
  const { id, subId } = Route.useParams();
  const [sub, setSub] = useState<SubProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/sub-programs?program_id=${id}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((rows: SubProgram[]) => {
        const found = Array.isArray(rows) ? rows.find((r) => String(r.id) === String(subId)) : null;
        setSub(found || null);
      })
      .finally(() => setLoading(false));
  }, [id, subId]);

  if (loading) {
    return <SiteLayout><div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">Loading…</div></SiteLayout>;
  }
  if (!sub) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="text-muted-foreground">Sub-program not found.</p>
          <Button asChild className="mt-6"><Link to="/programs/$id" params={{ id }}>Back to program</Link></Button>
        </div>
      </SiteLayout>
    );
  }

  const cover = sub.cover_image || sub.image;

  return (
    <SiteLayout>
      {cover ? (
        <div className="relative w-full overflow-hidden bg-slate-900">
          <img src={cover} alt={sub.title} className="mx-auto max-h-[60vh] w-full object-contain" />
        </div>
      ) : null}

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link to="/programs/$id" params={{ id }}><ArrowLeft className="mr-2 h-4 w-4" />Back to program</Link>
        </Button>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Sub-program</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">{sub.title}</h1>
        {sub.description ? (
          <p className="mt-6 text-lg italic leading-8 text-foreground/80">{sub.description}</p>
        ) : null}
        <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-foreground sm:text-lg">
          {sub.long_description || sub.description || "No additional details yet."}
        </div>
        {sub.attachment_url ? (
          <a href={sub.attachment_url} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10">
            <Download className="h-4 w-4" />
            {sub.attachment_name || "Download file"}
          </a>
        ) : null}
      </article>
    </SiteLayout>
  );
}
