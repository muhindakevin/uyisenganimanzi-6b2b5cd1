import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Smartphone, Landmark } from "lucide-react";
import { SiteLayout } from "@/frontend/components/SiteLayout";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Uyisenga Ni Imanzi (UNM)" },
      { name: "description", content: "Support UNM via Mobile Money or bank transfer to fund counseling, school fees and starter kits." },
      { property: "og:title", content: "Donate to UNM" },
      { property: "og:description", content: "Mobile Money and bank account details for supporting UNM." },
    ],
  }),
  component: DonatePage,
});

type MomoAccount = { name: string; number: string };
type BankAccount = { bank: string; accountName: string; accountNumber: string; swift?: string };
type DonationContent = { intro?: string; momo: MomoAccount[]; banks: BankAccount[] };

function DonatePage() {
  const [donation, setDonation] = useState<DonationContent>({ momo: [], banks: [] });

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const d = data?.donation as Partial<DonationContent> | undefined;
        if (d) setDonation({ intro: d.intro, momo: d.momo || [], banks: d.banks || [] });
      })
      .catch(() => {});
  }, []);

  return (
    <SiteLayout>
      <section className="bg-gradient-to-br from-primary via-primary-glow to-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
          <Heart className="mx-auto h-10 w-10" />
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Support our work</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-primary-foreground/90 sm:text-lg">
            {donation.intro || "Your gift directly funds counseling, school fees, and starter kits for the families we serve. Choose Mobile Money or a bank transfer below."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Smartphone className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Mobile Money (MoMo)</h2>
            </div>
            {donation.momo.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">MoMo details will appear here soon.</p>
            ) : (
              <ul className="mt-5 space-y-3">
                {donation.momo.map((m, i) => (
                  <li key={i} className="flex flex-col rounded-lg bg-secondary px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-medium text-foreground">{m.name}</span>
                    <span className="font-mono text-sm text-primary">{m.number}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Landmark className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Bank Accounts</h2>
            </div>
            {donation.banks.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Bank account details will appear here soon.</p>
            ) : (
              <ul className="mt-5 space-y-4">
                {donation.banks.map((b, i) => (
                  <li key={i} className="rounded-lg bg-secondary px-4 py-3 text-sm">
                    <p className="font-semibold text-foreground">{b.bank}</p>
                    <p className="mt-1 text-muted-foreground">Account name: <span className="text-foreground">{b.accountName}</span></p>
                    <p className="text-muted-foreground">Account #: <span className="font-mono text-foreground">{b.accountNumber}</span></p>
                    {b.swift ? <p className="text-muted-foreground">SWIFT: <span className="font-mono text-foreground">{b.swift}</span></p> : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
