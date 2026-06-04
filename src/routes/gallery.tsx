import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Uyisenga Ni Imanzi (UNM)" },
      { name: "description", content: "Photos from UNM programs, events and community work across Rwanda." },
      { property: "og:title", content: "UNM Gallery" },
      { property: "og:description", content: "Moments from our work with children, youth and families." },
    ],
  }),
  component: Gallery,
});

type GalleryImage = {
  id: number;
  title: string;
  image: string;
  description?: string | null;
  category?: string | null;
  link?: string | null;
};

function Gallery() {
  const [photos, setPhotos] = useState<GalleryImage[]>([]);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    fetch("/api/gallery")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setPhotos(data);
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    photos.forEach((p) => set.add(p.category || "Event"));
    return Array.from(set);
  }, [photos]);

  const visible = filter === "All" ? photos : photos.filter((p) => (p.category || "Event") === filter);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Gallery</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Moments from our work.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          A glimpse of the children, youth and families we walk alongside every day.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                filter === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
            No photos yet. The admin can add image links from the dashboard.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => {
              const Wrapper: any = p.link ? "a" : "figure";
              const wrapperProps = p.link
                ? {
                    href: p.link,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    "aria-label": `Open ${p.title}`,
                  }
                : {};
              return (
                <Wrapper
                  key={p.id}
                  {...wrapperProps}
                  className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="relative">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105"
                    />
                    {p.link ? (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 text-sm font-medium text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                        Open ↗
                      </span>
                    ) : null}
                  </div>
                  <div className="space-y-1 px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-foreground">{p.title}</p>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {p.category || "Event"}
                      </span>
                    </div>
                    {p.description ? (
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                    ) : null}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
