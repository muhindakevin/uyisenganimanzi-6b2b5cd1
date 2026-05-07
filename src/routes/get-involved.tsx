import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Heart, Users, Handshake } from "lucide-react";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Get Involved — Uyisenga Ni Imanzi (UNM)" },
      { name: "description", content: "Donate, volunteer or partner with UNM to support Rwandan youth and communities." },
      { property: "og:title", content: "Get Involved with UNM" },
      { property: "og:description", content: "Ways to support our work in Rwanda — give, volunteer, partner." },
    ],
  }),
  component: GetInvolved,
});

const ways = [
  { Icon: Heart, t: "Donate", d: "Your gift funds counseling sessions, school fees and starter kits for families.", cta: "Make a gift" },
  { Icon: Users, t: "Volunteer", d: "Share your skills—mentoring, training, communications—remotely or in Kigali.", cta: "Join the team" },
  { Icon: Handshake, t: "Partner", d: "Schools, companies and foundations: let's design impact together.", cta: "Start a conversation" },
];

function GetInvolved() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Get involved</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Be part of the next chapter.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Your time, expertise and generosity help us walk further with the families we serve.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {ways.map(({ Icon, t, d, cta }) => (
            <div key={t} className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-foreground">{t}</h2>
              <p className="mt-2 flex-1 text-muted-foreground">{d}</p>
              <Button asChild className="mt-5 self-start">
                <Link to="/contact">{cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] p-10 text-primary-foreground sm:p-14">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Every contribution becomes care.
          </h2>
          <p className="mt-3 max-w-xl text-primary-foreground/90">
            Reach out for bank details, MoMo, or to discuss a tailored partnership.
          </p>
          <div className="mt-7">
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
