import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/about/beneficiaries")({
  component: OurBeneficiaries,
});

type Beneficiary = { id?: number; title: string; description: string; filled?: boolean };

function OurBeneficiaries() {
  const [items, setItems] = useState<Beneficiary[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/beneficiaries").then((r) => r.json()).catch(() => []),
      fetch("/api/content").then((r) => r.json()).catch(() => ({})),
    ]).then(([tableRows, content]) => {
      const list: Beneficiary[] = Array.isArray(tableRows) && tableRows.length > 0
        ? tableRows
        : Array.isArray(content?.about?.beneficiaries)
          ? content.about.beneficiaries.map((b: any, i: number) => ({
              id: i,
              title: String(b?.title ?? ""),
              description: String(b?.description ?? ""),
              filled: i % 2 === 0,
            }))
          : [];
      setItems(list);
    });
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Our Beneficiaries &amp; Members</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Our work touches the lives of diverse groups across Rwanda
      </h2>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <div
            key={item.id ?? idx}
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
