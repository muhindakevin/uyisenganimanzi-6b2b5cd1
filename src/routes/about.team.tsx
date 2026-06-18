import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, Phone, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";

export const Route = createFileRoute("/about/team")({
  component: OurTeam,
});

type Member = {
  id: number;
  name: string;
  title: string;
  email?: string | null;
  phone?: string | null;
  photo?: string | null;
};

function MemberCard({ m }: { m: Member }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
        {m.photo ? (
          <img src={m.photo} alt={m.name} className="h-full w-full object-cover object-top" loading="lazy" />
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
  );
}

function Grid({ items, empty }: { items: Member[]; empty: string }) {
  if (items.length === 0) {
    return <p className="mt-8 text-muted-foreground">{empty}</p>;
  }
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((m) => <MemberCard key={m.id} m={m} />)}
    </div>
  );
}

function OurTeam() {
  const [staff, setStaff] = useState<Member[]>([]);
  const [board, setBoard] = useState<Member[]>([]);

  useEffect(() => {
    fetch("/api/team", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setStaff(data); })
      .catch(() => {});
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.board)) setBoard(data.board as Member[]);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">Our team</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        The people working every day to support Rwandan children, youth and families.
      </p>

      <Tabs defaultValue="staff" className="mt-8">
        <TabsList>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
        </TabsList>
        <TabsContent value="staff">
          <Grid items={staff} empty="No staff members yet." />
        </TabsContent>
        <TabsContent value="board">
          <Grid items={board} empty="No board members yet." />
        </TabsContent>
      </Tabs>
    </section>
  );
}
