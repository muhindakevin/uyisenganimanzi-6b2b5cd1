import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Target, Eye, Heart } from "lucide-react";

export const Route = createFileRoute("/about/mission-vision")({
  component: MissionVision,
});

type Content = {
  mission: string;
  vision: string;
  impact: string;
  contact: { email: string; phone: string; address: string };
};

type CoreValue = { id: number; title: string; description: string };

const DEFAULT_CONTENT: Content = {
  mission: "To accompany young Rwandans on their journey to healing and opportunity—through psychosocial care, education and economic empowerment.",
  vision: "A Rwanda where every young person has the support, skills and hope to shape their own future—and uplift those around them.",
  impact: "We have impacted thousands of lives.",
  contact: { email: "info@uyisenganimanzi.org.rw", phone: "+250 788 729 994", address: "Kigali, Rwanda" },
};

const DEFAULT_VALUES: CoreValue[] = [
  { id: 1, title: "Dignity", description: "Every person we serve is met with respect and confidentiality." },
  { id: 2, title: "Listening", description: "Programs are co-designed with the youth and families who use them." },
  { id: 3, title: "Long-term impact", description: "We measure success by lives changed, not activities delivered." },
];

function MissionVision() {
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);
  const [values, setValues] = useState<CoreValue[]>(DEFAULT_VALUES);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setContent({ ...DEFAULT_CONTENT, ...data, contact: { ...DEFAULT_CONTENT.contact, ...(data.contact || {}) } }))
      .catch(() => {});
    fetch("/api/core-values", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setValues(data); })
      .catch(() => {});
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-primary p-8 text-primary-foreground shadow-[var(--shadow-card)]">
          <Target className="h-8 w-8" />
          <h2 className="mt-4 text-3xl font-bold">Mission</h2>
          <p className="mt-4 text-primary-foreground/90 leading-relaxed">{content.mission}</p>
        </div>
        <div className="rounded-2xl bg-primary p-8 text-primary-foreground shadow-[var(--shadow-card)]">
          <Eye className="h-8 w-8" />
          <h2 className="mt-4 text-3xl font-bold">Vision</h2>
          <p className="mt-4 text-primary-foreground/90 leading-relaxed">{content.vision}</p>
        </div>
      </div>


      <h2 className="mt-14 flex items-center gap-2 text-2xl font-semibold text-foreground">
        <Heart className="h-6 w-6 text-primary" /> Core values
      </h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
        {values.map((v) => (
          <div key={v.id} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold text-foreground">{v.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
