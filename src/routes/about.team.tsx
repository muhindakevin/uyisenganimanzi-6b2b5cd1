import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, User } from "lucide-react";

export const Route = createFileRoute("/about/team")({
  component: OurTeam,
});

type Member = {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  photo?: string;
};

// Placeholder team — will be admin-managed once Lovable Cloud is enabled.
const team: Member[] = [
  { name: "Executive Director", title: "Executive Director", email: "info@uyisenganimanzi.org.rw", phone: "+250 788 729 994" },
  { name: "Programs Manager", title: "Programs Manager", email: "info@uyisenganimanzi.org.rw" },
  { name: "Mental Health Lead", title: "Psychosocial & Mental Health Lead", email: "info@uyisenganimanzi.org.rw" },
  { name: "Child Protection Lead", title: "Child Protection Lead", email: "info@uyisenganimanzi.org.rw" },
  { name: "Economic Empowerment Lead", title: "Economic Empowerment Lead", email: "info@uyisenganimanzi.org.rw" },
  { name: "Finance & Admin", title: "Finance & Administration", email: "info@uyisenganimanzi.org.rw" },
];

function OurTeam() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">Our team</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        The people working every day to support Rwandan children, youth and families.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((m) => (
          <article
            key={m.name}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
              {m.photo ? (
                <img src={m.photo} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                  <User className="h-16 w-16 text-primary/60" />
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-foreground">{m.name}</h3>
              <p className="mt-0.5 text-sm font-medium text-primary">{m.title}</p>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                {m.email && (
                  <a href={`mailto:${m.email}`} className="flex items-center gap-2 hover:text-foreground">
                    <Mail className="h-4 w-4 text-primary" /> {m.email}
                  </a>
                )}
                {m.phone && (
                  <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-foreground">
                    <Phone className="h-4 w-4 text-primary" /> {m.phone}
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-10 rounded-xl border border-dashed border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
        Tip: enable Lovable Cloud to let an admin add, edit and upload team
        photos, names, titles and contacts directly from a dashboard.
      </p>
    </section>
  );
}
