const partners = [
  "UNICEF",
  "USAID",
  "Government of Rwanda",
  "European Union",
  "Global Fund",
  "Save the Children",
  "World Vision",
  "Plan International",
  "UNDP",
  "WHO",
];

export function PartnersMarquee() {
  const loop = [...partners, ...partners];
  return (
    <section className="border-y border-border bg-card py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Our Partners
        </p>
        <h2 className="mt-2 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Trusted by global &amp; local partners
        </h2>
      </div>
      <div className="group relative mt-8 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-card to-transparent" />
        <div className="flex w-max animate-[marquee_35s_linear_infinite] gap-12 group-hover:[animation-play-state:paused]">
          {loop.map((p, i) => (
            <div
              key={`${p}-${i}`}
              className="flex h-16 min-w-[200px] items-center justify-center rounded-xl border border-border bg-background px-8 text-base font-semibold text-foreground/80"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
