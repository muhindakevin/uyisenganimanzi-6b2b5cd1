import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  description?: string;
};

const DEFAULT_GALLERY: GalleryImage[] = [
  { id: 1, title: "Community Event", image: "/assets/gallery/1.jpg", description: "A community gathering." }
];

function Gallery() {
  const [photos, setPhotos] = useState<GalleryImage[]>(DEFAULT_GALLERY);

  useEffect(() => {
    fetch("/api/gallery")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPhotos(data);
      })
      .catch(() => {});
  }, []);

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p: any) => (
            <figure key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
              <img src={p.image} alt={p.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform hover:scale-105" />
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">{p.description || p.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
