import { createFileRoute } from "@tanstack/react-router";
import { Baby, GraduationCap, HeartHandshake, Users } from "lucide-react";

export const Route = createFileRoute("/about/beneficiaries")({
  component: OurBeneficiaries,
});

const groups = [
  { Icon: Baby, t: "Orphans & vulnerable children", d: "Children orphaned by the 1994 Genocide against the Tutsi and by HIV/AIDS." },
  { Icon: GraduationCap, t: "Youth (12–24)", d: "Adolescents and young adults navigating education, identity and economic life." },
  { Icon: HeartHandshake, t: "Survivors of trauma & torture", d: "People living with the lasting effects of violence, loss and gender-based harm." },
  { Icon: Users, t: "Families & caregivers", d: "Households raising vulnerable children, including child- and grandparent-headed homes." },
];

function OurBeneficiaries() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">Our beneficiaries</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Across Kigali City and the Southern and Eastern Provinces, UNM walks alongside:
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {groups.map(({ Icon, t, d }) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <Icon className="h-7 w-7 text-primary" />
            <h3 className="mt-3 text-lg font-semibold text-foreground">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
