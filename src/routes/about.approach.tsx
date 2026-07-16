import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Brain, GraduationCap, HandHeart, Users } from "lucide-react";

export const Route = createFileRoute("/about/approach")({
  component: OurApproach,
});

type ApproachStep = { title: string; description: string };

type Content = { approachSteps: ApproachStep[] };

const DEFAULT_CONTENT: Content = {
  approachSteps: [
    { title: "Listen first", description: "We start by listening to children, youth and families—their needs, their words and their pace." },
    { title: "Heal the trauma", description: "Psychosocial and mental health care unlock the ability to learn, work and relate." },
    { title: "Build the skills", description: "Education, vocational training and life skills give young people real choices." },
    { title: "Strengthen the community", description: "Families, peer groups and partners sustain change long after a program ends." },
  ],
};

function OurApproach() {
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const about = data?.about || {};
        setContent({
          approachSteps: Array.isArray(about?.approachSteps)
            ? about.approachSteps.map((item: any) => ({
                title: String(item?.title ?? ""),
                description: String(item?.description ?? ""),
              }))
            : DEFAULT_CONTENT.approachSteps,
        });
      })
      .catch(() => {});
  }, []);

  const steps = content.approachSteps;
  const icons = [Brain, HandHeart, GraduationCap, Users];

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">Our approach</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        A holistic, four-step model that addresses the whole young person—not just one need at a time.
      </p>

      <ol className="mt-10 grid gap-6 md:grid-cols-2">
        {steps.map((step, i) => {
          const Icon = icons[i % icons.length];
          return (
            <li key={step.title || i} className="relative rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Step {i + 1}
              </span>
              <Icon className="mt-2 h-7 w-7 text-primary" />
              <h3 className="mt-3 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
