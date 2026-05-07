import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import programsImg from "@/assets/programs.jpg";

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

const photos = [
  { src: heroImg, caption: "Community gathering, Kigali" },
  { src: aboutImg, caption: "Peer support session" },
  { src: programsImg, caption: "Youth workshop" },
  { src: heroImg, caption: "Field visit" },
  { src: aboutImg, caption: "Mental health day" },
  { src: programsImg, caption: "Skills training" },
];

function Gallery() {
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
          {photos.map((p, i) => (
            <figure key={i} className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
              <img src={p.src} alt={p.caption} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform hover:scale-105" />
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
