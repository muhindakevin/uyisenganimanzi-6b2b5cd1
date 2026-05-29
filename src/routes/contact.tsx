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
    address: "Kacyiru, Kigali-Rwanda"
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
          { Icon: MapPin, t: "Visit", d: contactInfo.address },
          { Icon: Phone, t: "Call", d: contactInfo.phone, href: `tel:${contactInfo.phone.replace(/\s/g, '')}` },
          { Icon: Mail, t: "Email", d: contactInfo.email, href: `mailto:${contactInfo.email}` },
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

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <form className="rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-card)]" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" required rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
          </div>
          {status ? <p className="mt-4 text-sm text-muted-foreground">{status}</p> : null}
          <Button type="submit" className="mt-5" disabled={sending}>
            {sending ? "Sending..." : "Send message"}
          </Button>
        </form>
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
