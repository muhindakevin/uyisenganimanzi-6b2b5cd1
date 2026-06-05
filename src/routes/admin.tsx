import { createFileRoute, Link } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useState } from "react";
import { Edit, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

type Member = {
  id: number;
  name: string;
  title: string;
  email?: string | null;
  phone?: string | null;
  photo?: string | null;
};

type Program = {
  id: number;
  title: string;
  description: string;
  image?: string | null;
};

type GalleryImage = {
  id: number;
  title: string;
  image: string;
  description?: string | null;
  category?: string | null;
  link?: string | null;
};

type PressRoomItem = {
  id: number;
  title: string;
  summary: string;
  category: "News" | "Publications" | "Jobs";
  image?: string | null;
};

type ProgramsPageContent = {
  label: string;
  heading: string;
  description1: string;
  description2: string;
};

type HeroContent = {
  badge: string;
  title: string;
  description: string;
  ctaPrimaryLabel: string;
  ctaPrimaryLink: string;
  ctaSecondaryLabel: string;
  ctaSecondaryLink: string;
  slides: string[];
};

type MomoAccount = { name: string; number: string };
type BankAccount = { bank: string; accountName: string; accountNumber: string; swift?: string };
type DonationContent = { intro: string; momo: MomoAccount[]; banks: BankAccount[] };

type Content = {
  mission: string;
  vision: string;
  impact: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
};

const DEFAULT_PROGRAMS_PAGE: ProgramsPageContent = {
  label: "Our Programs",
  heading: "Uyisenga Ni Imanzi's Programs",
  description1:
    "Since its establishment, Uyisenga Ni Imanzi has implemented various programs to support Rwandan children, youth, and families.",
  description2:
    "Through our strategic initiatives, we empower vulnerable populations and foster sustainable development across Rwanda.",
};

const DEFAULT_HERO: HeroContent = {
  badge: "Non-Governmental Organization · Kigali, Rwanda",
  title: "Hope, healing and opportunity for every young Rwandan.",
  description:
    "Uyisenga Ni Imanzi walks alongside children, youth and families—providing psychosocial care, education and the tools to build resilient livelihoods.",
  ctaPrimaryLabel: "Support our work",
  ctaPrimaryLink: "/get-involved",
  ctaSecondaryLabel: "Our programs",
  ctaSecondaryLink: "/programs",
  slides: ["", "", ""],
};

const DEFAULT_DONATION: DonationContent = { intro: "", momo: [], banks: [] };

const DEFAULT_CONTENT: Content = {
  mission: "Our mission is to support Rwandan children, youth, and families.",
  vision: "A future where every child thrives.",
  impact: "We have impacted thousands of lives.",
  contact: {
    email: "info@uyisenganimanzi.org.rw",
    phone: "+250 788 729 994",
    address: "Kacyiru, Kigali-Rwanda",
  },
};

function getToken() {
  return localStorage.getItem("auth_token") || "";
}

async function apiRequest<T>(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "The backend request failed.");
  }
  return data as T;
}

function AdminDashboard() {
  const [team, setTeam] = useState<Member[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [pressRoom, setPressRoom] = useState<PressRoomItem[]>([]);
  const [programsPage, setProgramsPage] = useState<ProgramsPageContent>(DEFAULT_PROGRAMS_PAGE);
  const [hero, setHero] = useState<HeroContent>(DEFAULT_HERO);
  const [donation, setDonation] = useState<DonationContent>(DEFAULT_DONATION);
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [teamRows, programRows, galleryRows, pressRows, siteContent] = await Promise.all([
        apiRequest<Member[]>("/api/team"),
        apiRequest<Program[]>("/api/programs"),
        apiRequest<GalleryImage[]>("/api/gallery"),
        apiRequest<PressRoomItem[]>("/api/press-room"),
        apiRequest<Record<string, unknown>>("/api/content"),
      ]);

      setTeam(teamRows);
      setPrograms(programRows);
      setGallery(galleryRows);
      setPressRoom(pressRows);
      setProgramsPage((siteContent.programsPage as ProgramsPageContent) || DEFAULT_PROGRAMS_PAGE);
      const heroIn = (siteContent.hero as Partial<HeroContent>) || {};
      setHero({
        ...DEFAULT_HERO,
        ...heroIn,
        slides: Array.isArray(heroIn.slides) ? [...heroIn.slides, "", "", ""].slice(0, 3) : DEFAULT_HERO.slides,
      });
      const donIn = (siteContent.donation as Partial<DonationContent>) || {};
      setDonation({
        intro: donIn.intro || "",
        momo: Array.isArray(donIn.momo) ? donIn.momo : [],
        banks: Array.isArray(donIn.banks) ? donIn.banks : [],
      });
      setContent({
        ...DEFAULT_CONTENT,
        ...siteContent,
        contact: {
          ...DEFAULT_CONTENT.contact,
          ...((siteContent.contact as Content["contact"]) || {}),
        },
      } as Content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const hasToken = !!getToken();
    setAuthorized(hasToken);
    if (hasToken) {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, []);

  async function saveEntity<T extends { id: number }>(
    url: string,
    item: T,
    setter: (items: T[]) => void,
    current: T[],
    responseKey: string,
  ) {
    setSaving(true);
    setError("");
    try {
      const method = item.id ? "PUT" : "POST";
      const data = await apiRequest<Record<string, T>>(url, {
        method,
        body: JSON.stringify(item),
      });
      const saved = data[responseKey];
      setter(item.id ? current.map((row) => (row.id === saved.id ? saved : row)) : [...current, saved]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save this item.");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function deleteEntity<T extends { id: number }>(
    url: string,
    id: number,
    setter: (items: T[]) => void,
    current: T[],
  ) {
    setSaving(true);
    setError("");
    try {
      await apiRequest(url, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      setter(current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete this item.");
    } finally {
      setSaving(false);
    }
  }

  async function saveContent(updates: Record<string, unknown>) {
    setSaving(true);
    setError("");
    try {
      const data = await apiRequest<{ content: Record<string, unknown> }>("/api/content", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      setProgramsPage((data.content.programsPage as ProgramsPageContent) || programsPage);
      if (data.content.hero) {
        const h = data.content.hero as Partial<HeroContent>;
        setHero({
          ...DEFAULT_HERO,
          ...h,
          slides: Array.isArray(h.slides) ? [...h.slides, "", "", ""].slice(0, 3) : hero.slides,
        });
      }
      if (data.content.donation) {
        const d = data.content.donation as Partial<DonationContent>;
        setDonation({
          intro: d.intro || "",
          momo: Array.isArray(d.momo) ? d.momo : [],
          banks: Array.isArray(d.banks) ? d.banks : [],
        });
      }
      setContent({
        ...content,
        ...data.content,
        contact: {
          ...content.contact,
          ...((data.content.contact as Content["contact"]) || {}),
        },
      } as Content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save content.");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="container mx-auto p-6 text-center">Loading backend data...</div>;

  if (!authorized) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="mx-auto max-w-xl rounded-lg border border-border bg-card p-10 shadow-[var(--shadow-card)]">
          <h1 className="text-3xl font-semibold text-foreground">Admin access required</h1>
          <p className="mt-4 text-muted-foreground">
            Please sign in with the admin email and password to manage the live website database.
          </p>
          <Button asChild className="mt-6" size="lg" variant="secondary">
            <Link to="/login">Go to admin login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Changes save directly to your Neon database.</p>
        </div>
        <Button variant="outline" onClick={loadDashboard} disabled={saving}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error ? <p className="mb-6 rounded-lg border border-destructive p-4 text-destructive">{error}</p> : null}

      <Tabs defaultValue="team" className="w-full">
        <TabsList className="grid w-full grid-cols-6 gap-2">
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="prog-page">Programs Page</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="press">Press Room</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="team">
          <ManagedList
            title="Team Members"
            empty="No team members yet."
            items={team}
            renderItem={(member) => (
              <>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.title}</p>
              </>
            )}
            formTitle={(member) => (member ? "Edit Team Member" : "Add Team Member")}
            renderForm={(member, close) => (
              <TeamForm
                member={member}
                saving={saving}
                onSave={async (saved) => {
                  await saveEntity("/api/team", saved, setTeam, team, "member");
                  close();
                }}
              />
            )}
            onDelete={(id) => deleteEntity<Member>("/api/team", id, setTeam, team)}
          />
        </TabsContent>

        <TabsContent value="programs">
          <ManagedList
            title="Programs"
            empty="No programs yet."
            items={programs}
            renderItem={(program) => (
              <>
                <p className="font-semibold">{program.title}</p>
                <p className="text-sm text-muted-foreground">{program.description}</p>
              </>
            )}
            formTitle={(program) => (program ? "Edit Program" : "Add Program")}
            renderForm={(program, close) => (
              <ProgramForm
                program={program}
                saving={saving}
                onSave={async (saved) => {
                  await saveEntity("/api/programs", saved, setPrograms, programs, "program");
                  close();
                }}
              />
            )}
            onDelete={(id) => deleteEntity<Program>("/api/programs", id, setPrograms, programs)}
          />
        </TabsContent>

        <TabsContent value="prog-page">
          <Card>
            <CardHeader>
              <CardTitle>Programs Page Content</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgramsPageForm content={programsPage} saving={saving} onSave={(value) => saveContent({ programsPage: value })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
          <ManagedList
            title="Gallery"
            empty="No gallery images yet."
            items={gallery}
            renderItem={(image) => (
              <>
                <p className="font-semibold">{image.title} <span className="ml-2 rounded bg-muted px-2 py-0.5 text-xs">{image.category || "Event"}</span></p>
                <p className="text-sm text-muted-foreground truncate">{image.image}</p>
              </>
            )}
            formTitle={(image) => (image ? "Edit Gallery Image" : "Add Gallery Image")}
            renderForm={(image, close) => (
              <GalleryForm
                image={image}
                saving={saving}
                onSave={async (saved) => {
                  await saveEntity("/api/gallery", saved, setGallery, gallery, "image");
                  close();
                }}
              />
            )}
            onDelete={(id) => deleteEntity<GalleryImage>("/api/gallery", id, setGallery, gallery)}
          />
        </TabsContent>

        <TabsContent value="press">
          <PressRoomManager
            pressRoom={pressRoom}
            saving={saving}
            onSave={(item) => saveEntity("/api/press-room", item, setPressRoom, pressRoom, "item")}
            onDelete={(id) => deleteEntity<PressRoomItem>("/api/press-room", id, setPressRoom, pressRoom)}
          />
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentForm content={content} saving={saving} onSave={(value) => saveContent(value as unknown as Record<string, unknown>)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ManagedList<T extends { id: number }>({
  title,
  empty,
  items,
  renderItem,
  formTitle,
  renderForm,
  onDelete,
}: {
  title: string;
  empty: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  formTitle: (item: T | null) => string;
  renderForm: (item: T | null, close: () => void) => React.ReactNode;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);

  function openForm(item: T | null) {
    setEditing(item);
    setOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-4">
        <CardTitle>{title}</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openForm(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{formTitle(editing)}</DialogTitle>
            {renderForm(editing, () => setOpen(false))}
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-muted-foreground">{empty}</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
                <div>{renderItem(item)}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openForm(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function SubmitButton({ saving }: { saving: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={saving}>
      <Save className="mr-2 h-4 w-4" />
      {saving ? "Saving..." : "Save"}
    </Button>
  );
}

function TeamForm({ member, saving, onSave }: { member?: Member | null; saving: boolean; onSave: (m: Member) => void }) {
  const [form, setForm] = useState<Member>(member || { id: 0, name: "", title: "", email: "", phone: "", photo: "" });

  useEffect(() => {
    setForm(member || { id: 0, name: "", title: "", email: "", phone: "", photo: "" });
  }, [member]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm({ ...form, photo: await readFileAsDataUrl(file) });
  }

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
      <Field label="Name" required value={form.name} onChange={(name) => setForm({ ...form, name })} />
      <Field label="Title" required value={form.title} onChange={(title) => setForm({ ...form, title })} />
      <Field label="Email" type="email" value={form.email || ""} onChange={(email) => setForm({ ...form, email })} />
      <Field label="Phone" value={form.phone || ""} onChange={(phone) => setForm({ ...form, phone })} />
      <div>
        <Label htmlFor="photo">Photo</Label>
        <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} />
        {form.photo ? <img src={form.photo} alt="Preview" className="mt-3 h-24 w-24 rounded-md object-cover" /> : null}
      </div>
      <SubmitButton saving={saving} />
    </form>
  );
}

function ProgramForm({ program, saving, onSave }: { program?: Program | null; saving: boolean; onSave: (p: Program) => void }) {
  const [form, setForm] = useState<Program>(program || { id: 0, title: "", description: "", image: "" });

  useEffect(() => {
    setForm(program || { id: 0, title: "", description: "", image: "" });
  }, [program]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: await readFileAsDataUrl(file) });
  }

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
      <Field label="Title" required value={form.title} onChange={(title) => setForm({ ...form, title })} />
      <TextareaField label="Description" required value={form.description} onChange={(description) => setForm({ ...form, description })} />
      <div>
        <Label htmlFor="program-image">Program Image</Label>
        <Input id="program-image" type="file" accept="image/*" onChange={handleFileChange} />
        {form.image ? <img src={form.image} alt="Program preview" className="mt-3 h-24 w-full rounded-md object-cover" /> : null}
      </div>
      <SubmitButton saving={saving} />
    </form>
  );
}

function GalleryForm({
  image,
  saving,
  onSave,
}: {
  image?: GalleryImage | null;
  saving: boolean;
  onSave: (i: GalleryImage) => void;
}) {
  const [form, setForm] = useState<GalleryImage>(
    image || { id: 0, title: "", image: "", description: "", category: "Event", link: "" },
  );

  useEffect(() => {
    setForm(image || { id: 0, title: "", image: "", description: "", category: "Event", link: "" });
  }, [image]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: await readFileAsDataUrl(file) });
  };

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
      <Field
        label="Title (what project or event was this for?)"
        required
        value={form.title}
        onChange={(title) => setForm({ ...form, title })}
      />
      <div>
        <Label htmlFor="gallery-category">Classification</Label>
        <select
          id="gallery-category"
          className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          value={form.category || "Event"}
          onChange={(event) => setForm({ ...form, category: event.target.value })}
        >
          <option value="Event">Event</option>
          <option value="Project">Project</option>
          <option value="Program">Program</option>
          <option value="Community">Community</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <Label htmlFor="gallery-image">Cover image (upload from your device)</Label>
        <Input id="gallery-image" type="file" accept="image/*" onChange={handleFileChange} />
        <p className="mt-1 text-xs text-muted-foreground">
          Pick a photo from your phone or computer. It becomes the cover that visitors click.
        </p>
        {form.image ? (
          <img src={form.image} alt="Gallery preview" className="mt-3 h-28 w-full rounded-md object-cover" />
        ) : null}
      </div>
      <Field
        label="Destination link (where clicking the cover goes)"
        value={form.link || ""}
        onChange={(link) => setForm({ ...form, link })}
      />
      <p className="text-xs text-muted-foreground">
        Paste any URL — a full album, Facebook post, YouTube video, article, etc. Leave empty to disable the click.
      </p>

      <TextareaField
        label="Short description (optional)"
        value={form.description || ""}
        onChange={(description) => setForm({ ...form, description })}
      />
      <SubmitButton saving={saving} />
    </form>
  );
}


function PressRoomManager({
  pressRoom,
  saving,
  onSave,
  onDelete,
}: {
  pressRoom: PressRoomItem[];
  saving: boolean;
  onSave: (item: PressRoomItem) => Promise<void>;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PressRoomItem | null>(null);
  const groups = ["News", "Publications", "Jobs"] as const;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-4">
        <CardTitle>Press Room</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{editing ? "Edit Press Item" : "Add Press Item"}</DialogTitle>
            <PressRoomForm
              item={editing}
              saving={saving}
              onSave={async (item) => {
                await onSave(item);
                setOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-3">
          {groups.map((category) => (
            <div key={category} className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-xl font-semibold">{category}</h3>
              <div className="mt-4 space-y-3">
                {pressRoom.filter((item) => item.category === category).map((item) => (
                  <div key={item.id} className="rounded-lg border border-border bg-secondary p-4">
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditing(item); setOpen(true); }}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PressRoomForm({
  item,
  saving,
  onSave,
}: {
  item?: PressRoomItem | null;
  saving: boolean;
  onSave: (item: PressRoomItem) => void;
}) {
  const [form, setForm] = useState<PressRoomItem>(item || { id: 0, title: "", summary: "", category: "News", image: "" });

  useEffect(() => {
    setForm(item || { id: 0, title: "", summary: "", category: "News", image: "" });
  }, [item]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: await readFileAsDataUrl(file) });
  }

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
      <Field label="Title" required value={form.title} onChange={(title) => setForm({ ...form, title })} />
      <TextareaField label="Summary" required value={form.summary} onChange={(summary) => setForm({ ...form, summary })} />
      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={form.category}
          onChange={(event) => setForm({ ...form, category: event.target.value as PressRoomItem["category"] })}
        >
          <option value="News">News Stories</option>
          <option value="Publications">Publications & Reports</option>
          <option value="Jobs">Jobs and Tenders</option>
        </select>
      </div>
      <div>
        <Label htmlFor="press-image">Upload image</Label>
        <Input id="press-image" type="file" accept="image/*" onChange={handleFileChange} />
        {form.image ? <img src={form.image} alt="Press preview" className="mt-3 h-28 w-full rounded-md object-cover" /> : null}
      </div>
      <SubmitButton saving={saving} />
    </form>
  );
}

function ContentForm({ content, saving, onSave }: { content: Content; saving: boolean; onSave: (content: Content) => void }) {
  const [form, setForm] = useState<Content>(content);

  useEffect(() => {
    setForm(content);
  }, [content]);

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
      <TextareaField label="Mission" value={form.mission} onChange={(mission) => setForm({ ...form, mission })} />
      <TextareaField label="Vision" value={form.vision} onChange={(vision) => setForm({ ...form, vision })} />
      <TextareaField label="Impact" value={form.impact} onChange={(impact) => setForm({ ...form, impact })} />
      <Field label="Contact Email" value={form.contact.email} onChange={(email) => setForm({ ...form, contact: { ...form.contact, email } })} />
      <Field label="Contact Phone" value={form.contact.phone} onChange={(phone) => setForm({ ...form, contact: { ...form.contact, phone } })} />
      <Field label="Contact Address" value={form.contact.address} onChange={(address) => setForm({ ...form, contact: { ...form.contact, address } })} />
      <SubmitButton saving={saving} />
    </form>
  );
}

function ProgramsPageForm({
  content,
  saving,
  onSave,
}: {
  content: ProgramsPageContent;
  saving: boolean;
  onSave: (content: ProgramsPageContent) => void;
}) {
  const [form, setForm] = useState<ProgramsPageContent>(content);

  useEffect(() => {
    setForm(content);
  }, [content]);

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
      <Field label="Section Label" value={form.label} onChange={(label) => setForm({ ...form, label })} />
      <Field label="Main Heading" value={form.heading} onChange={(heading) => setForm({ ...form, heading })} />
      <TextareaField label="Description 1" value={form.description1} onChange={(description1) => setForm({ ...form, description1 })} />
      <TextareaField label="Description 2" value={form.description2} onChange={(description2) => setForm({ ...form, description2 })} />
      <SubmitButton saving={saving} />
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} required={required} rows={4} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
