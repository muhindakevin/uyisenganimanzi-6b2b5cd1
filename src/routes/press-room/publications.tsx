import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/press-room/publications")({
  head: () => ({
    meta: [
      { title: "Publications & Reports — Uyisenga Ni Imanzi (UNM)" },
      { name: "description", content: "Access our publications, reports, and research from UNM's work in Rwanda." },
      { property: "og:title", content: "UNM Publications & Reports" },
      { property: "og:description", content: "Download our latest publications and reports." },
    ],
  }),
  component: PublicationsPage,
});

type PressRoomItem = {
  id: number;
  title: string;
  summary: string;
  category: "News" | "Publications" | "Jobs";
  image?: string;
};

function PublicationsPage() {
  const [pubItems, setPubItems] = useState<PressRoomItem[]>([]);

  useEffect(() => {
    fetch("/api/press-room?category=Publications")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setPubItems(data);
      })
      .catch(() => {});
  }, []);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Press Room</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Publications & Reports
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Access our latest publications, research reports, and documentation from our work across Rwanda.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pubItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No publications yet.</p>
            </div>
          ) : (
            pubItems.map(item => (
              <Card key={item.id} className="overflow-hidden">
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.summary}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
