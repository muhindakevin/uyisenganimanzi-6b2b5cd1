import imbuto from "@/assets/partners/imbuto.jpg";
import wjr from "@/assets/partners/wjr.jpg";
import streetchild from "@/assets/partners/streetchild.png";
import ur from "@/assets/partners/ur.png";
import ucl from "@/assets/partners/ucl.jpg";
import lemonaid from "@/assets/partners/lemonaid.jpg";
import leeds from "@/assets/partners/leeds.jpg";
import irct from "@/assets/partners/irct.jpg";
import cafod from "@/assets/partners/cafod.jpg";

const partners = [
  { name: "Imbuto Foundation", src: imbuto },
  { name: "World Jewish Relief", src: wjr },
  { name: "Street Child", src: streetchild },
  { name: "University of Rwanda", src: ur },
  { name: "UCL", src: ucl },
  { name: "Lemonaid & ChariTea", src: lemonaid },
  { name: "University of Leeds", src: leeds },
  { name: "IRCT", src: irct },
  { name: "CAFOD", src: cafod },
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
        <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-10 group-hover:[animation-play-state:paused]">
          {loop.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="flex h-24 min-w-[200px] items-center justify-center rounded-xl border border-border bg-background px-6"
            >
              <img
                src={p.src}
                alt={p.name}
                loading="lazy"
                className="max-h-16 max-w-[160px] object-contain"
              />
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
