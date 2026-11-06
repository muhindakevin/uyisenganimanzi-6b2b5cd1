import { Link } from "@tanstack/react-router";
import { ArrowRight, Activity, GraduationCap, ChartNoAxesCombined, ShieldCheck } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

type ProgramCardProps = {
  program: { id: number; title: string; description: string; image?: string | null; cover_image?: string | null };
};

export function ProgramCard({ program }: ProgramCardProps) {
  const Icon = /health/i.test(program.title) ? Activity : /education/i.test(program.title) ? GraduationCap : /economic|empower/i.test(program.title) ? ChartNoAxesCombined : ShieldCheck;
  const image = program.cover_image || program.image;
  return (
    <article className="group flex min-w-0 flex-col border border-border bg-card p-2.5 text-center transition-shadow duration-300 hover:shadow-[var(--shadow-card)]">
      <Link to="/programs/$id" params={{ id: String(program.id) }} aria-label={`Read about ${program.title}`} className="block aspect-[3/2] overflow-hidden bg-muted">
        {image ? <img src={image} alt={program.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" /> : null}
      </Link>
      <div aria-hidden="true" className="relative mx-auto -mt-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Icon className="h-9 w-9" strokeWidth={1.6} />
      </div>
      <div className="flex flex-1 flex-col px-3 pb-2 pt-6 sm:px-5">
        <h3 className="flex min-h-16 items-center justify-center text-2xl font-bold leading-8 text-card-foreground">
          <Link to="/programs/$id" params={{ id: String(program.id) }} className="hover:text-primary">{program.title}</Link>
        </h3>
        <p className="mb-6 mt-4 line-clamp-3 text-base leading-6 text-card-foreground">{program.description}</p>
        <Button asChild variant="ghost" className="mt-auto h-14 w-full rounded-none border-t border-border bg-muted/30 text-base font-bold text-primary hover:bg-primary/10 hover:text-primary">
          <Link to="/programs/$id" params={{ id: String(program.id) }} aria-label={`Read more about ${program.title}`}>Read More <ArrowRight className="h-5 w-5" /></Link>
        </Button>
      </div>
    </article>
  );
}
