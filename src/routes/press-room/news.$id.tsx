import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { SiteLayout } from "@/frontend/components/SiteLayout";
import { Button } from "@/frontend/components/ui/button";

export const Route = createFileRoute("/press-room/news/$id")({
  head: () => ({
    meta: [
      { title: "News Story — Uyisenga Ni Imanzi" },
      { name: "description", content: "Read the full news story from Uyisenga Ni Imanzi." },
      { property: "og:title", content: "News Story — Uyisenga Ni Imanzi" },
      { property: "og:description", content: "Full news story from Uyisenga Ni Imanzi." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsDetail,
});

type Story = {
  id: number;
  title: string;
  summary: string;
  description?: string | null;
  category: string;
  image?: string | null;
  document?: string | null;
  document_name?: string | null;
  link?: string | null;
  created_at?: string | null;
};

function formatDate(iso?: string | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

function renderStoryBody(text: string, title: string) {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const imageMatch = block.match(/^!\[([^\]]*)\]\((data:image\/[^)]+|https?:\/\/[^)]+)\)$/);
      if (imageMatch) {
        return (
          <figure key={`${index}-${imageMatch[2].slice(0, 24)}`} className="overflow-hidden rounded-2xl border border-border bg-muted shadow-[var(--shadow-card)]">
            <img src={imageMatch[2]} alt={imageMatch[1] || title} loading="lazy" className="h-auto w-full object-contain" />
          </figure>
        );
      }

      return (
        <p key={`${index}-${block.slice(0, 24)}`} className="whitespace-pre-line">
          {block}
        </p>
      );
    });
}

function NewsDetail() {
  const { id } = Route.useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/press-room?category=News", { cache: "no-store" })
      .then((r) => r.json())
      .then((rows: Story[]) => {
        const found = Array.isArray(rows) ? rows.find((r) => String(r.id) === String(id)) : null;
        setStory(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  if (!story) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="text-muted-foreground">Story not found.</p>
          <Button asChild className="mt-6"><Link to="/press-room/news">Back to News</Link></Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link to="/press-room/news"><ArrowLeft className="mr-2 h-4 w-4" />Back to News</Link>
        </Button>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">News and Stories</p>
        {story.created_at ? (
          <p className="mt-2 text-sm text-muted-foreground">Published: {formatDate(story.created_at)}</p>
        ) : null}
        <h1 className="mt-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
          {story.title}
        </h1>

        {story.summary ? (
          <p className="mt-6 text-lg italic leading-8 text-foreground/80">{story.summary}</p>
        ) : null}

        {story.image ? (
          <figure className="mt-8 overflow-hidden rounded-2xl border border-border bg-muted shadow-[var(--shadow-card)]">
            <img src={story.image} alt={story.title} className="h-auto w-full object-contain" />
          </figure>
        ) : null}

        {story.description ? (
          <div className="mt-8 space-y-7 text-base leading-8 text-foreground sm:text-lg">
            {renderStoryBody(story.description, story.title)}
          </div>
        ) : null}

        {story.document ? (
          <a
            href={story.document}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
          >
            <Download className="h-4 w-4" />
            {story.document_name || "Download attached file"}
          </a>
        ) : null}

        {story.link ? (
          <p className="mt-6">
            <a href={story.link} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline">
              Read the original source →
            </a>
          </p>
        ) : null}
      </article>
    </SiteLayout>
  );
}
