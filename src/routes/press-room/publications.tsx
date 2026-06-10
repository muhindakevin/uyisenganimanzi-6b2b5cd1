import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, ExternalLink } from "lucide-react";
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
  description?: string | null;
  category: "News" | "Publications" | "Jobs";
  document?: string | null;
  document_name?: string | null;
  link?: string | null;
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
      <section className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
          <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/80">Press Room</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Publications & Reports</h1>
          <p className="mt-5 text-lg text-primary-foreground/90">
            Download our latest publications, research reports, and documentation from our work across Rwanda.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {pubItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No publications yet.</p>
            </div>
          ) : (
            pubItems.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="text-sm font-medium text-foreground">{item.summary}</p>
                  {item.description ? (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{item.description}</p>
                  ) : null}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.document ? (
                      <>
                        <Button asChild size="sm">
                          <a href={item.document} target="_blank" rel="noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" /> Open document
                          </a>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <a href={item.document} download={item.document_name || `${item.title}.pdf`}>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </a>
                        </Button>
                      </>
                    ) : item.link ? (
                      <Button asChild size="sm">
                        <a href={item.link} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" /> Open
                        </a>
                      </Button>
                    ) : (
                      <p className="text-xs text-muted-foreground">No document attached yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
