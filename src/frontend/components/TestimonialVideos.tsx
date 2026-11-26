import { useEffect, useState } from "react";

export type TestimonialItem = { id: number; name: string; role: string | null; quote: string | null; video_url: string };

function youtubeId(url: string) {
  const m = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/.exec(url);
  return m?.[1];
}

function Player({ url, title }: { url: string; title: string }) {
  const yt = youtubeId(url);
  if (yt) return <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${yt}`} title={title} allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />;
  return <video className="h-full w-full bg-foreground object-contain" src={url} controls preload="metadata" playsInline />;
}

export function TestimonialVideos({ limit, heading = true }: { limit?: number; heading?: boolean }) {
  const [items, setItems] = useState<TestimonialItem[] | null>(null);
  useEffect(() => {
    fetch("/api/testimonials", { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).then((d) => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([]));
  }, []);
  const list = (items ?? []).slice(0, limit ?? 999);
  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      {heading && (
        <div className="mb-10 text-center">
          <h2 className="site-menu text-3xl font-bold tracking-tight text-primary sm:text-4xl">Testimonials</h2>
        </div>
      )}
      {items && list.length === 0 && <p className="text-center text-muted-foreground">Testimonial videos will appear here soon.</p>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <article key={t.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="aspect-video w-full bg-muted"><Player url={t.video_url} title={t.name} /></div>
            <div className="p-5">
              {t.quote && <p className="text-sm italic text-muted-foreground">“{t.quote}”</p>}
              <p className="mt-3 font-bold text-primary">{t.name}</p>
              {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
