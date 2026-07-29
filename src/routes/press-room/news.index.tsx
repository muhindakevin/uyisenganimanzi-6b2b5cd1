import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/frontend/components/SiteLayout";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/press-room/news/")({
  head: () => ({
    meta: [
      { title: "News Stories — Uyisenga Ni Imanzi (UNM)" },
      { name: "description", content: "Latest news stories and updates from UNM's work in Rwanda." },
      { property: "og:title", content: "UNM News Stories" },
      { property: "og:description", content: "Stay updated with our latest news and stories." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewsPage,
});

type PressRoomItem = {
  id: number;
  title: string;
  summary: string;
  description?: string | null;
  category: "News" | "Publications" | "Jobs";
  image?: string | null;
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

function NewsPage() {
  const [newsItems, setNewsItems] = useState<PressRoomItem[]>([]);

  useEffect(() => {
    fetch("/api/press-room?category=News", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setNewsItems(data))
      .catch(() => setNewsItems([]));
  }, []);

  return (
    <SiteLayout>
      <section className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/80">Press Room</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">News Stories</h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/90">
            Stay updated with our latest news stories and updates from our work across Rwanda.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {newsItems.length === 0 ? (
          <p className="text-center text-muted-foreground">No news stories yet.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item) => (
              <Link
                key={item.id}
                to="/press-room/news/$id"
                params={{ id: String(item.id) }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
              >
                {item.image ? (
                  <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">News and Stories</p>
                  {item.created_at ? (
                    <p className="mt-1 text-xs text-muted-foreground">Published: {formatDate(item.created_at)}</p>
                  ) : null}
                  <h2 className="mt-2 text-xl font-bold leading-snug text-foreground group-hover:text-primary">
                    {item.title}
                  </h2>
                  {item.summary ? (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                  ) : null}
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                    Read full story →
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