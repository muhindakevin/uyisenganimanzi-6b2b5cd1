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

const EMPTY_CONTENT: Content = {
  mission: "",
  vision: "",
  impact: "",
  contact: { email: "", phone: "", address: "" },
};

function MissionVision() {
  const [content, setContent] = useState<Content>(EMPTY_CONTENT);
  const [values, setValues] = useState<CoreValue[]>([]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setContent({ ...EMPTY_CONTENT, ...data, contact: { ...EMPTY_CONTENT.contact, ...(data.contact || {}) } }))
      .catch(() => {});
    fetch("/api/core-values")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setValues(data); })
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
