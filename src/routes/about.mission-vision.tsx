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
  contact: {
    email: string;
    phone: string;
    address: string;
  };
};

const DEFAULT_CONTENT: Content = {
  mission: "To accompany young Rwandans on their journey to healing and opportunity—through psychosocial care, education and economic empowerment.",
  vision: "A Rwanda where every young person has the support, skills and hope to shape their own future—and uplift those around them.",
  impact: "We have impacted thousands of lives.",
  contact: {
    email: "info@uyisenganimanzi.org.rw",
    phone: "+250 788 729 994",
    address: "Kigali, Rwanda"
  }
};

const values = [
  { t: "Dignity", d: "Every person we serve is met with respect and confidentiality." },
  { t: "Listening", d: "Programs are co-designed with the youth and families who use them." },
  { t: "Long-term impact", d: "We measure success by lives changed, not activities delivered." },
];

function MissionVision() {
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);

  useEffect(() => {
    fetch("/api/content")
      .then((response) => response.json())
      .then((data) => setContent({ ...DEFAULT_CONTENT, ...data, contact: { ...DEFAULT_CONTENT.contact, ...(data.contact || {}) } }))
      .catch(() => {});
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <Target className="h-8 w-8 text-primary" />
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Our mission</h2>
          <p className="mt-3 text-muted-foreground">
            {content.mission}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <Eye className="h-8 w-8 text-primary" />
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Our vision</h2>
          <p className="mt-3 text-muted-foreground">
            {content.vision}
          </p>
        </div>
      </div>

      <h2 className="mt-14 flex items-center gap-2 text-2xl font-semibold text-foreground">
        <Heart className="h-6 w-6 text-primary" /> Core values
      </h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.t} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold text-foreground">{v.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
