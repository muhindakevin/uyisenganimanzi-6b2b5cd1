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
    <article className="flex flex-col items-center rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1">
      <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-background bg-secondary shadow-md">
        {m.photo ? (
          <img src={m.photo} alt={m.name} className="h-full w-full object-cover object-top" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
            <User className="h-16 w-16 text-primary/60" />
          </div>
        )}
      </div>
      <h3 className="mt-5 text-lg font-bold text-foreground">{m.name}</h3>
      <p className="mt-1 text-sm font-medium text-foreground/80">{m.title}</p>
      {(m.email || m.phone) && (
        <div className="mt-4 flex flex-col items-center gap-2 text-sm">
          {m.email && (
            <a href={`mailto:${m.email}`} className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-background px-4 py-1.5 text-foreground hover:bg-primary hover:text-primary-foreground">
              <Mail className="h-4 w-4" /> {m.email}
            </a>
          )}
          {m.phone && (
            <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary">
              <Phone className="h-4 w-4" /> {m.phone}
            </a>
          )}
        </div>
      )}
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
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setStaff(data); })
      .catch(() => {});
    fetch("/api/content")
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
