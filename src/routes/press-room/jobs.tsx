import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/frontend/components/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/press-room/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs and Tenders — Uyisenga Ni Imanzi (UNM)" },
      { name: "description", content: "Current job opportunities and tenders from UNM in Rwanda." },
      { property: "og:title", content: "UNM Jobs and Tenders" },
      { property: "og:description", content: "Explore career opportunities and tenders with UNM." },
    ],
  }),
  component: JobsPage,
});

type PressRoomItem = {
  id: number;
  title: string;
  summary: string;
  category: "News" | "Publications" | "Jobs";
  image?: string;
};

function JobsPage() {
  const [jobItems, setJobItems] = useState<PressRoomItem[]>([]);

  useEffect(() => {
    fetch("/api/press-room?category=Jobs")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setJobItems(data);
      })
      .catch(() => {});
  }, []);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Press Room</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Jobs and Tenders
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Explore current job opportunities and tender announcements from our work in Rwanda.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No job opportunities yet.</p>
            </div>
          ) : (
            jobItems.map(item => (
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
