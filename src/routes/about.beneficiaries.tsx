import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Baby, GraduationCap, HeartHandshake, Users } from "lucide-react";

export const Route = createFileRoute("/about/beneficiaries")({
  component: OurBeneficiaries,
});

type Beneficiary = { title: string; description: string };

type Content = { beneficiaries: Beneficiary[] };

const DEFAULT_CONTENT: Content = {
  beneficiaries: [
    { title: "Orphans & vulnerable children", description: "Children orphaned by the 1994 Genocide against the Tutsi and by HIV/AIDS." },
    { title: "Youth (12–24)", description: "Adolescents and young adults navigating education, identity and economic life." },
    { title: "Survivors of trauma & torture", description: "People living with the lasting effects of violence, loss and gender-based harm." },
    { title: "Families & caregivers", description: "Households raising vulnerable children, including child- and grandparent-headed homes." },
  ],
};

function OurBeneficiaries() {
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const about = data?.about || {};
        setContent({
          beneficiaries: Array.isArray(about?.beneficiaries)
            ? about.beneficiaries.map((item: any) => ({
                title: String(item?.title ?? ""),
                description: String(item?.description ?? ""),
              }))
            : DEFAULT_CONTENT.beneficiaries,
        });
      })
      .catch(() => {});
  }, []);

  const groups = content.beneficiaries;
  const icons = [Baby, Users, HeartHandshake, GraduationCap];

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">Our beneficiaries</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Across Kigali City and the Southern and Eastern Provinces, UNM walks alongside:
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {groups.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div key={item.title || index} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <Icon className="h-7 w-7 text-primary" />
              <h3 className="mt-3 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
