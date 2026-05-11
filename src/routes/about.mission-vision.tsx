import { createFileRoute } from "@tanstack/react-router";
import { Target, Eye, Heart } from "lucide-react";

export const Route = createFileRoute("/about/mission-vision")({
  component: MissionVision,
});

const values = [
  { t: "Dignity", d: "Every person we serve is met with respect and confidentiality." },
  { t: "Listening", d: "Programs are co-designed with the youth and families who use them." },
  { t: "Long-term impact", d: "We measure success by lives changed, not activities delivered." },
];

function MissionVision() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <Target className="h-8 w-8 text-primary" />
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Our mission</h2>
          <p className="mt-3 text-muted-foreground">
            To accompany young Rwandans on their journey to healing and opportunity—through
            psychosocial care, education and economic empowerment.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <Eye className="h-8 w-8 text-primary" />
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Our vision</h2>
          <p className="mt-3 text-muted-foreground">
            A Rwanda where every young person has the support, skills and hope to shape their own
            future—and uplift those around them.
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
