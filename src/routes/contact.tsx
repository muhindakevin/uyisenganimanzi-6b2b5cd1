import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Uyisenga Ni Imanzi (UNM)" },
      { name: "description", content: "Visit, call or email Uyisenga Ni Imanzi in Kigali, Rwanda." },
      { property: "og:title", content: "Contact UNM" },
      { property: "og:description", content: "Get in touch with our team in Kigali." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Contact</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Let's talk.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Whether you want to support our work, partner with us, or simply learn more—we'd love to hear from you.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-12 sm:px-6 md:grid-cols-2">
        {[
          { Icon: MapPin, t: "Visit", d: "333V+8XW, Kigali, Rwanda" },
          { Icon: Phone, t: "Call", d: "0788 729 994", href: "tel:+250788729994" },
          { Icon: Mail, t: "Email", d: "info@unm.org.rw", href: "mailto:info@unm.org.rw" },
          { Icon: Clock, t: "Hours", d: "Mon–Fri · 9 am – 5 pm" },
        ].map(({ Icon, t, d, href }) => (
          <div key={t} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t}</p>
              {href ? (
                <a href={href} className="mt-1 block text-lg text-foreground hover:text-primary">{d}</a>
              ) : (
                <p className="mt-1 text-lg text-foreground">{d}</p>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-card)]">
          <iframe
            title="UNM location on map"
            src="https://www.google.com/maps?q=Uyisenga+Ni+Imanzi+Kigali&output=embed"
            width="100%"
            height="420"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full border-0"
          />
        </div>
      </section>
    </SiteLayout>
  );
}
