import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Handshake, Newspaper, FileText, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Press Room — Uyisenga Ni Imanzi (UNM)" },
      { name: "description", content: "Latest news, stories, publications, reports and job opportunities from UNM's work in Rwanda." },
      { property: "og:title", content: "UNM Press Room" },
      { property: "og:description", content: "News, publications, and career opportunities from our work with children, youth and families." },
    ],
  }),
  component: PressRoom,
});

type PressRoomItem = {
  id: number;
  title: string;
  summary: string;
  category: "News" | "Publications" | "Jobs";
  image?: string;
};

const ways = [
  { Icon: Heart, t: "Donate", d: "Your gift funds counseling sessions, school fees and starter kits for families.", cta: "Make a gift", to: "/donate" as const },
  { Icon: Users, t: "Volunteer", d: "Share your skills—mentoring, training, communications—remotely or in Kigali.", cta: "Join the team", to: "/contact" as const },
  { Icon: Handshake, t: "Partner", d: "Schools, companies and foundations: let's design impact together.", cta: "Start a conversation", to: "/contact" as const },
];

const categories = [
  { Icon: Newspaper, title: "News Stories", description: "Latest updates and stories from our work", link: "/press-room/news" as const },
  { Icon: FileText, title: "Publications & Reports", description: "Research, reports, and documentation", link: "/press-room/publications" as const },
  { Icon: Briefcase, title: "Jobs and Tenders", description: "Career opportunities and tenders", link: "/press-room/jobs" as const },
];

function PressRoom() {
  const [pressRoom, setPressRoom] = useState<PressRoomItem[]>([]);

  useEffect(() => {
    fetch('/api/press-room')
      .then((res) => res.json())
      .then((data) => setPressRoom(data))
      .catch(() => setPressRoom([]));
  }, []);

  const newsItems = pressRoom.filter(item => item.category === 'News').slice(0, 3);
  const pubItems = pressRoom.filter(item => item.category === 'Publications').slice(0, 3);
  const jobItems = pressRoom.filter(item => item.category === 'Jobs').slice(0, 3);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Press Room</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          News, Stories & Publications
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Stay updated with our latest news, success stories, publications, reports, and career opportunities from our work across Rwanda.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {ways.map(({ Icon, t, d, cta, to }) => (
            <div key={t} className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-foreground">{t}</h2>
              <p className="mt-2 flex-1 text-muted-foreground">{d}</p>
              <Button asChild className="mt-5 self-start">
                <Link to={to}>{cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map(({ Icon, title, description, link }) => (
            <Card key={title} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <p className="text-muted-foreground">{description}</p>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild variant="outline">
                  <Link to={link}>Explore {title}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">Latest Updates</h2>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-blue-600" />
              Recent News
            </h3>
            {newsItems.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent news.</p>
            ) : (
              newsItems.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-2">{item.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
                  </CardContent>
                </Card>
              ))
            )}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/press-room/news">View All News</Link>
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Publications
            </h3>
            {pubItems.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent publications.</p>
            ) : (
              pubItems.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-2">{item.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
                  </CardContent>
                </Card>
              ))
            )}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/press-room/publications">View All Publications</Link>
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-600" />
              Jobs & Tenders
            </h3>
            {jobItems.length === 0 ? (
              <p className="text-muted-foreground text-sm">No current opportunities.</p>
            ) : (
              jobItems.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-2">{item.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
                  </CardContent>
                </Card>
              ))
            )}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/press-room/jobs">View All Opportunities</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="donate" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-10">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Donate to UNM</h2>
          </div>
          {donation.intro ? (
            <p className="mt-3 max-w-3xl text-muted-foreground">{donation.intro}</p>
          ) : (
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Your gift directly funds counseling, school fees, and starter kits for the families we serve. Use Mobile Money or a bank transfer below.
            </p>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-6">
              <h3 className="text-lg font-semibold text-foreground">Mobile Money (MoMo)</h3>
              {donation.momo.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">MoMo details will appear here soon.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {donation.momo.map((m, i) => (
                    <li key={i} className="flex flex-col rounded-lg bg-secondary px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-medium text-foreground">{m.name}</span>
                      <span className="font-mono text-sm text-primary">{m.number}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-background p-6">
              <h3 className="text-lg font-semibold text-foreground">Bank Accounts</h3>
              {donation.banks.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">Bank account details will appear here soon.</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {donation.banks.map((b, i) => (
                    <li key={i} className="rounded-lg bg-secondary px-4 py-3 text-sm">
                      <p className="font-semibold text-foreground">{b.bank}</p>
                      <p className="mt-1 text-muted-foreground">Account name: <span className="text-foreground">{b.accountName}</span></p>
                      <p className="text-muted-foreground">Account #: <span className="font-mono text-foreground">{b.accountNumber}</span></p>
                      {b.swift ? <p className="text-muted-foreground">SWIFT: <span className="font-mono text-foreground">{b.swift}</span></p> : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
