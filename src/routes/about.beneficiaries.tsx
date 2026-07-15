import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/about/beneficiaries")({
  component: OurBeneficiaries,
});

type Beneficiary = { id: number; title: string; description: string; filled: boolean };

const DEFAULTS: Beneficiary[] = [
  { id: 1, title: "Genocide Widows", description: "Our primary focus, providing comprehensive support for their physical, emotional, and economic well-being.", filled: true },
  { id: 2, title: "Orphans and Vulnerable Children", description: "Offering educational support, psychosocial care, and pathways to a brighter future.", filled: false },
  { id: 3, title: "Youth with Transgenerational Trauma", description: "Addressing the unique needs of the post-genocide generation through specialized mental health and social programs.", filled: true },
  { id: 4, title: "Children Born of Rape", description: "Providing targeted support to address their complex psychosocial needs and promote social integration.", filled: false },
  { id: 5, title: "General Public", description: "Through our health outreach, we extend our services to the broader community.", filled: true },
];

function OurBeneficiaries() {
  const [items, setItems] = useState<Beneficiary[]>(DEFAULTS);

  useEffect(() => {
    fetch("/api/beneficiaries", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setItems(data); })
      .catch(() => {});
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Our Beneficiaries &amp; Members</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Our work touches the lives of diverse groups across Rwanda
      </h2>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={
              item.filled
                ? "rounded-2xl bg-primary p-6 shadow-[var(--shadow-card)] text-primary-foreground"
                : "rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-[var(--shadow-card)]"
            }
          >
            <h3 className={item.filled ? "text-xl font-semibold" : "text-xl font-semibold text-primary"}>{item.title}</h3>
            <p className={item.filled ? "mt-3 text-sm leading-6 text-primary-foreground/90" : "mt-3 text-sm leading-6 text-foreground/80"}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
