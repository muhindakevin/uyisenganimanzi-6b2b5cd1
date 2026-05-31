import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

type Content = {
  mission: string;
  vision: string;
  impact: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
};

function Contact() {
  const [content, setContent] = useState<Content | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((response) => response.json())
      .then((data) => setContent(data as Content))
      .catch(() => {});
  }, []);

  const contactInfo = content?.contact || {
    email: "info@uyisenganimanzi.org.rw",
    phone: "+250 788 729 994",
    address: "Kacyiru, KIGALI-RWANDA"
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Message failed");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setStatus("Thank you. Your message has been sent.");
    } catch {
      setStatus("Unable to send your message. Please email us directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border bg-[var(--gradient-hero)]">
        <div className="absolute inset-0 -z-10 opacity-60" style={{ background: "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent)" }} />
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Contact Us</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Let's build hope, together.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Reach out to partner, volunteer, or simply learn more about Uyisenga Ni Imanzi's work in Rwanda.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Info column */}
          <aside className="lg:col-span-2">
            <div className="rounded-3xl bg-foreground p-8 text-background shadow-[var(--shadow-card)]">
              <h2 className="text-2xl font-semibold">Get in touch</h2>
              <p className="mt-2 text-sm text-background/70">
                We're happy to hear from supporters, partners, journalists and friends.
              </p>

              <ul className="mt-8 space-y-6">
                <li className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-background/60">Visit</p>
                    <p className="mt-1 text-base">{contactInfo.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-background/60">Call</p>
                    <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="mt-1 block text-base hover:text-primary">
                      {contactInfo.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-background/60">Email</p>
                    <a href={`mailto:${contactInfo.email}`} className="mt-1 block break-all text-base hover:text-primary">
                      {contactInfo.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-background/60">Hours</p>
                    <p className="mt-1 text-base">Mon – Fri · 9 am – 5 pm</p>
                  </div>
                </li>
              </ul>

              <div className="mt-10 h-px w-full bg-background/10" />
              <p className="mt-6 text-xs uppercase tracking-wider text-background/60">Follow us</p>
              <div className="mt-3 flex gap-2 text-sm">
                <a href="https://www.facebook.com/uyisenganimanzi" target="_blank" rel="noreferrer" className="rounded-full border border-background/20 px-4 py-1.5 hover:bg-background/10">Facebook</a>
                <a href="https://www.instagram.com/uyisenganimanzi_/" target="_blank" rel="noreferrer" className="rounded-full border border-background/20 px-4 py-1.5 hover:bg-background/10">Instagram</a>
                <a href="https://x.com/UyisenganImanzi" target="_blank" rel="noreferrer" className="rounded-full border border-background/20 px-4 py-1.5 hover:bg-background/10">X</a>
              </div>
            </div>
          </aside>

          {/* Form column */}
          <div className="lg:col-span-3">
            <form
              className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)] sm:p-10"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-semibold text-foreground">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">We typically reply within 1–2 business days.</p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" placeholder="Jane Doe" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+250 7…" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="h-11" />
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Tell us a bit more…" required rows={6} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
              </div>
              {status ? (
                <p className="mt-5 rounded-lg bg-secondary px-4 py-3 text-sm text-foreground">{status}</p>
              ) : null}
              <Button type="submit" className="mt-6 h-11 w-full sm:w-auto sm:px-8" disabled={sending}>
                {sending ? "Sending..." : "Send message"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-card)]">
          <iframe
            title="UNM location on map"
            src="https://www.google.com/maps?q=Kacyiru+Kigali+Rwanda&output=embed"
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
