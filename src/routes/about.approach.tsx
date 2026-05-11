import { createFileRoute } from "@tanstack/react-router";
import { Brain, GraduationCap, HandHeart, Users } from "lucide-react";

export const Route = createFileRoute("/about/approach")({
  component: OurApproach,
});

const steps = [
  { Icon: HandHeart, t: "Listen first", d: "We start by listening to children, youth and families—their needs, their words, their pace." },
  { Icon: Brain, t: "Heal the trauma", d: "Psychosocial and mental health care unlock the ability to learn, work and relate." },
  { Icon: GraduationCap, t: "Build the skills", d: "Education, vocational training and life skills give young people real choices." },
  { Icon: Users, t: "Strengthen the community", d: "Families, peer groups and partners sustain change long after a program ends." },
];

function OurApproach() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">Our approach</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        A holistic, four-step model that addresses the whole young person—not just one need at a time.
      </p>

      <ol className="mt-10 grid gap-6 md:grid-cols-2">
        {steps.map(({ Icon, t, d }, i) => (
          <li key={t} className="relative rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              Step {i + 1}
            </span>
            <Icon className="mt-2 h-7 w-7 text-primary" />
            <h3 className="mt-3 text-lg font-semibold text-foreground">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
