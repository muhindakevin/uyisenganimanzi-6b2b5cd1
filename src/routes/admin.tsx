import { createFileRoute, Link } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Edit, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/frontend/components/ui/dialog";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";
import { Textarea } from "@/frontend/components/ui/textarea";

export const Route = createFileRoute("/admin")({
  component: AdminGate,
});

function AdminGate() {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) {
      window.location.replace("/login");
      return;
    }
    setAllowed(true);
    setReady(true);
  }, []);
  if (!ready || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking admin access…
      </div>
    );
  }
  return <AdminDashboard />;
}

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
  long_description?: string | null;
  image?: string | null;
  cover_image?: string | null;
  attachment_url?: string | null;
  attachment_name?: string | null;
};

type SubProgram = {
  id: number;
  program_id: number;
  title: string;
  description: string;
  long_description?: string | null;
  image?: string | null;
  cover_image?: string | null;
  attachment_url?: string | null;
  attachment_name?: string | null;
  sort_order?: number;
};

type Beneficiary = { id: number; title: string; description: string; filled: boolean; sort_order?: number };
type CoreValue = { id: number; title: string; description: string; sort_order?: number };

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
  description?: string | null;
  category: "News" | "Publications" | "Jobs";
  image?: string | null;
  document?: string | null;
  document_name?: string | null;
  link?: string | null;
};

type ContactMessage = {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  created_at?: string;
};

type ProgramsPageContent = {
  label: string;
  heading: string;
  description1: string;
  description2: string;
};

type HeroStat = { value: string; label: string };

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

type AboutContent = {
  storyTitle: string;
  storyText: string;
  storyImage: string;
  impactStats: Array<{ value: string; label: string }>;
  impactRecognition: string[];
  beneficiaries: Array<{ title: string; description: string }>;
  approachSteps: Array<{ title: string; description: string }>;
};

const DEFAULT_ABOUT_CONTENT: AboutContent = {
  storyTitle: "Our story since 2002",
  storyText:
    "Uyisenga Ni Imanzi (UNM) was founded in 2002, with a mission to provide orphans from the genocide and HIV/AIDS with social services, education and income-generating opportunities. UNM was established to implement child- and youth-focused programs that address their special needs.\n\nAfter two years of concerted efforts, it became clear that these children were too traumatized to fully participate in or benefit from the programs offered. With the addition of psychosocial and health services in 2004, UNM expanded and strengthened its activities greatly—especially in Kigali City and the Southern and Eastern Provinces.\n\nIn recognition of the needs of orphans in Rwanda, the Ministerial Decree granting legal entity to the Association Uyisenga Ni Imanzi is N° 70/11 of 10th August 2005, published in October 2005. Several awards have crowned UNM's activities, mainly in the fight against HIV/AIDS among youth, the care of children, and the promotion of children's rights.\n\nUNM is an active member of local and international umbrellas: Ibuka, Rwanda NGO Forum on AIDS and Health Promotion, the International Rehabilitation Council for Torture Victims, and Family for Every Child.",
  storyImage: "",
  impactStats: [
    { value: "20,000+", label: "Children & youth supported" },
    { value: "20+", label: "Years of service" },
    { value: "3", label: "Provinces served" },
    { value: "Multiple", label: "Awards & recognition" },
  ],
  impactRecognition: [
    "Ministerial Decree N° 70/11 of 10th August 2005 granting legal entity to UNM.",
    "Awards in HIV/AIDS prevention among youth, child care, and children's rights.",
    "Active member of Ibuka, Rwanda NGO Forum on AIDS and Health Promotion.",
    "Member of the International Rehabilitation Council for Torture Victims (IRCT).",
    "Member of Family for Every Child.",
  ],
  beneficiaries: [
    { title: "Orphans & vulnerable children", description: "Children orphaned by the 1994 Genocide against the Tutsi and by HIV/AIDS." },
    { title: "Youth (12–24)", description: "Adolescents and young adults navigating education, identity and economic life." },
    { title: "Survivors of trauma & torture", description: "People living with the lasting effects of violence, loss and gender-based harm." },
    { title: "Families & caregivers", description: "Households raising vulnerable children, including child- and grandparent-headed homes." },
  ],
  approachSteps: [
    { title: "Listen first", description: "We start by listening to children, youth and families—their needs, their words and their pace." },
    { title: "Heal the trauma", description: "Psychosocial and mental health care unlock the ability to learn, work and relate." },
    { title: "Build the skills", description: "Education, vocational training and life skills give young people real choices." },
    { title: "Strengthen the community", description: "Families, peer groups and partners sustain change long after a program ends." },
  ],
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
  if (response.status === 401) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_email");
    window.location.href = "/login";
    throw new Error("Your session expired. Redirecting you to the login page...");
  }
  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong while saving. Please try again.");
  }
  return data as T;
}

function AdminDashboard() {
  const [team, setTeam] = useState<Member[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [pressRoom, setPressRoom] = useState<PressRoomItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<HeroStat[]>([]);
  const [board, setBoard] = useState<Member[]>([]);
  const [subPrograms, setSubPrograms] = useState<SubProgram[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [programsPage, setProgramsPage] = useState<ProgramsPageContent>(DEFAULT_PROGRAMS_PAGE);
  const [hero, setHero] = useState<HeroContent>(DEFAULT_HERO);
  const [donation, setDonation] = useState<DonationContent>(DEFAULT_DONATION);
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);
  const [aboutContent, setAboutContent] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [teamRows, programRows, galleryRows, pressRows, siteContent, messageRows, subRows, benRows, cvRows] = await Promise.all([
        apiRequest<Member[]>("/api/team"),
        apiRequest<Program[]>("/api/programs"),
        apiRequest<GalleryImage[]>("/api/gallery"),
        apiRequest<PressRoomItem[]>("/api/press-room"),
        apiRequest<Record<string, unknown>>("/api/content"),
        apiRequest<ContactMessage[]>("/api/contact-messages").catch(() => []),
        apiRequest<SubProgram[]>("/api/sub-programs").catch(() => []),
        apiRequest<Beneficiary[]>("/api/beneficiaries").catch(() => []),
        apiRequest<CoreValue[]>("/api/core-values").catch(() => []),
      ]);

      setTeam(teamRows);
      setPrograms(programRows);
      setGallery(galleryRows);
      setPressRoom(pressRows);
      setMessages(Array.isArray(messageRows) ? messageRows : []);
      setSubPrograms(Array.isArray(subRows) ? subRows : []);
      setBeneficiaries(Array.isArray(benRows) ? benRows : []);
      setCoreValues(Array.isArray(cvRows) ? cvRows : []);
      setProgramsPage((siteContent.programsPage as ProgramsPageContent) || DEFAULT_PROGRAMS_PAGE);
      const heroIn = (siteContent.hero as Partial<HeroContent>) || {};
      setHero({
        ...DEFAULT_HERO,
        ...heroIn,
        slides: Array.isArray(heroIn.slides) ? [...heroIn.slides, "", "", ""].slice(0, 3) : DEFAULT_HERO.slides,
      });
      const statsIn = Array.isArray(siteContent.stats) ? (siteContent.stats as HeroStat[]) : [];
      setStats(statsIn);
      const boardIn = Array.isArray(siteContent.board) ? (siteContent.board as Member[]) : [];
      setBoard(boardIn);
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
      const aboutIn = (siteContent.about as Partial<AboutContent>) || {};
      setAboutContent({
        ...DEFAULT_ABOUT_CONTENT,
        ...aboutIn,
        impactStats: Array.isArray(aboutIn.impactStats)
          ? aboutIn.impactStats.map((item) => ({
              value: String(item?.value ?? ""),
              label: String(item?.label ?? ""),
            }))
          : DEFAULT_ABOUT_CONTENT.impactStats,
        impactRecognition: Array.isArray(aboutIn.impactRecognition)
          ? aboutIn.impactRecognition.map((item) => String(item ?? ""))
          : DEFAULT_ABOUT_CONTENT.impactRecognition,
        beneficiaries: Array.isArray(aboutIn.beneficiaries)
          ? aboutIn.beneficiaries.map((item) => ({
              title: String(item?.title ?? ""),
              description: String(item?.description ?? ""),
            }))
          : DEFAULT_ABOUT_CONTENT.beneficiaries,
        approachSteps: Array.isArray(aboutIn.approachSteps)
          ? aboutIn.approachSteps.map((item) => ({
              title: String(item?.title ?? ""),
              description: String(item?.description ?? ""),
            }))
          : DEFAULT_ABOUT_CONTENT.approachSteps,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteMessage(id: number) {
    setSaving(true);
    try {
      await apiRequest("/api/contact-messages", { method: "DELETE", body: JSON.stringify({ id }) });
      setMessages(messages.filter((m) => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete message.");
    } finally {
      setSaving(false);
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
      toast.success(item.id ? "Changes saved" : "Added successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to save this item.";
      setError(msg);
      toast.error(msg);
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
      toast.success("Deleted");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to delete this item.";
      setError(msg);
      toast.error(msg);
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
      if (data.content.about) {
        const aboutIn = data.content.about as Partial<AboutContent>;
        setAboutContent({
          ...DEFAULT_ABOUT_CONTENT,
          ...aboutIn,
          impactStats: Array.isArray(aboutIn.impactStats)
            ? aboutIn.impactStats.map((item) => ({
                value: String(item?.value ?? ""),
                label: String(item?.label ?? ""),
              }))
            : aboutContent.impactStats,
          impactRecognition: Array.isArray(aboutIn.impactRecognition)
            ? aboutIn.impactRecognition.map((item) => String(item ?? ""))
            : aboutContent.impactRecognition,
          beneficiaries: Array.isArray(aboutIn.beneficiaries)
            ? aboutIn.beneficiaries.map((item) => ({
                title: String(item?.title ?? ""),
                description: String(item?.description ?? ""),
              }))
            : aboutContent.beneficiaries,
          approachSteps: Array.isArray(aboutIn.approachSteps)
            ? aboutIn.approachSteps.map((item) => ({
                title: String(item?.title ?? ""),
                description: String(item?.description ?? ""),
              }))
            : aboutContent.approachSteps,
        });
      }
      toast.success("Content saved");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to save content.";
      setError(msg);
      toast.error(msg);
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

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="flex w-full flex-wrap gap-2">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="donation">Donate</TabsTrigger>
          <TabsTrigger value="team">Staff</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="sub-programs">Sub-programs</TabsTrigger>
          <TabsTrigger value="prog-page">Programs Page</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="press">Press Room</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          <TabsTrigger value="values">Core Values</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="about">About Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader><CardTitle>Home Hero Section</CardTitle></CardHeader>
            <CardContent>
              <HeroForm hero={hero} saving={saving} onSave={(value) => saveContent({ hero: value })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader><CardTitle>Home Page Stats (Numbers)</CardTitle></CardHeader>
            <CardContent>
              <StatsForm stats={stats} saving={saving} onSave={(value) => { saveContent({ stats: value }); setStats(value); }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donation">
          <Card>
            <CardHeader><CardTitle>Donation Information (Mobile Money & Bank Accounts)</CardTitle></CardHeader>
            <CardContent>
              <DonationForm donation={donation} saving={saving} onSave={(value) => saveContent({ donation: value })} />
            </CardContent>
          </Card>
        </TabsContent>



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

        <TabsContent value="board">
          <ManagedList
            title="Board Members"
            empty="No board members yet."
            items={board}
            renderItem={(member) => (
              <>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.title}</p>
              </>
            )}
            formTitle={(member) => (member ? "Edit Board Member" : "Add Board Member")}
            renderForm={(member, close) => (
              <TeamForm
                member={member}
                saving={saving}
                onSave={async (saved) => {
                  const next = saved.id
                    ? board.map((m) => (m.id === saved.id ? saved : m))
                    : [...board, { ...saved, id: Date.now() }];
                  setBoard(next);
                  await saveContent({ board: next });
                  close();
                }}
              />
            )}
            onDelete={(id) => {
              const next = board.filter((m) => m.id !== id);
              setBoard(next);
              saveContent({ board: next });
            }}
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

        <TabsContent value="sub-programs">
          <ManagedList
            title="Sub-programs & Projects"
            empty="No sub-programs yet. Add one under an existing program."
            items={subPrograms}
            renderItem={(sub) => (
              <>
                <p className="font-semibold">{sub.title}</p>
                <p className="text-sm text-muted-foreground">
                  Program: {programs.find((p) => p.id === sub.program_id)?.title || `#${sub.program_id}`}
                </p>
              </>
            )}
            formTitle={(sub) => (sub ? "Edit Sub-program" : "Add Sub-program")}
            renderForm={(sub, close) => (
              <SubProgramForm
                sub={sub}
                programs={programs}
                saving={saving}
                onSave={async (saved) => {
                  await saveEntity("/api/sub-programs", saved, setSubPrograms, subPrograms, "item");
                  close();
                }}
              />
            )}
            onDelete={(id) => deleteEntity<SubProgram>("/api/sub-programs", id, setSubPrograms, subPrograms)}
          />
        </TabsContent>

        <TabsContent value="beneficiaries">
          <ManagedList
            title="Beneficiaries"
            empty="No beneficiaries yet."
            items={beneficiaries}
            renderItem={(b) => (
              <>
                <p className="font-semibold">{b.title}</p>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </>
            )}
            formTitle={(b) => (b ? "Edit Beneficiary" : "Add Beneficiary")}
            renderForm={(b, close) => (
              <BeneficiaryForm
                item={b}
                saving={saving}
                onSave={async (saved) => {
                  await saveEntity("/api/beneficiaries", saved, setBeneficiaries, beneficiaries, "item");
                  close();
                }}
              />
            )}
            onDelete={(id) => deleteEntity<Beneficiary>("/api/beneficiaries", id, setBeneficiaries, beneficiaries)}
          />
        </TabsContent>

        <TabsContent value="values">
          <ManagedList
            title={`Core Values (${coreValues.length}/10)`}
            empty="No core values yet. Add up to 10."
            items={coreValues}
            renderItem={(v) => (
              <>
                <p className="font-semibold">{v.title}</p>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </>
            )}
            formTitle={(v) => (v ? "Edit Core Value" : "Add Core Value")}
            renderForm={(v, close) => (
              <CoreValueForm
                item={v}
                saving={saving}
                onSave={async (saved) => {
                  await saveEntity("/api/core-values", saved, setCoreValues, coreValues, "item");
                  close();
                }}
              />
            )}
            onDelete={(id) => deleteEntity<CoreValue>("/api/core-values", id, setCoreValues, coreValues)}
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

        <TabsContent value="messages">
          <Card>
            <CardHeader><CardTitle>Contact Messages ({messages.length})</CardTitle></CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <p className="text-muted-foreground">No messages yet.</p>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{m.name || "(no name)"} {m.email ? <span className="font-normal text-muted-foreground">· {m.email}</span> : null}</p>
                          {m.phone ? <p className="text-xs text-muted-foreground">{m.phone}</p> : null}
                          {m.subject ? <p className="mt-1 text-sm font-medium">{m.subject}</p> : null}
                          {m.created_at ? <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p> : null}
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => deleteMessage(m.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{m.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Mission, Vision & Contact Info</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentForm content={content} saving={saving} onSave={(value) => saveContent(value as unknown as Record<string, unknown>)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Page Content</CardTitle>
            </CardHeader>
            <CardContent>
              <AboutPageForm content={aboutContent} saving={saving} onSave={(value) => saveContent({ about: value })} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatsForm({ stats, saving, onSave }: { stats: HeroStat[]; saving: boolean; onSave: (s: HeroStat[]) => void }) {
  const [form, setForm] = useState<HeroStat[]>(stats);
  useEffect(() => { setForm(stats); }, [stats]);

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <p className="text-sm text-muted-foreground">Add the numbers shown on your home page (e.g. "20+" with label "Years of service").</p>
      {form.map((s, i) => (
        <div key={i} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_2fr_auto]">
          <Input placeholder="Value (e.g. 20+)" value={s.value} onChange={(e) => setForm(form.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x))} />
          <Input placeholder="Label (e.g. Years of service)" value={s.label} onChange={(e) => setForm(form.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))} />
          <Button type="button" variant="destructive" size="sm" onClick={() => setForm(form.filter((_, idx) => idx !== i))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setForm([...form, { value: "", label: "" }])}>
        <Plus className="mr-1 h-4 w-4" /> Add stat
      </Button>
      <SubmitButton saving={saving} />
    </form>
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
          <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-lg">
            <DialogTitle className="border-b px-6 py-4">{formTitle(editing)}</DialogTitle>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {renderForm(editing, () => setOpen(false))}
            </div>
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
    <div className="sticky bottom-0 -mx-6 -mb-4 mt-4 border-t bg-background/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Button type="submit" className="w-full" disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
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
  const [form, setForm] = useState<Program>(program || { id: 0, title: "", description: "", long_description: "", image: "" });

  useEffect(() => {
    setForm(program || { id: 0, title: "", description: "", long_description: "", image: "" });
  }, [program]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: await readFileAsDataUrl(file) });
  }

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
      <Field label="Title" required value={form.title} onChange={(title) => setForm({ ...form, title })} />
      <TextareaField label="Short description (appears on card)" required value={form.description} onChange={(description) => setForm({ ...form, description })} />
      <TextareaField label="Full description (shown on Learn More page)" value={form.long_description || ""} onChange={(long_description) => setForm({ ...form, long_description })} />
      <div>
        <Label htmlFor="program-image">Program Image</Label>
        <Input id="program-image" type="file" accept="image/*" onChange={handleFileChange} />
        {form.image ? <img src={form.image} alt="Program preview" className="mt-3 h-24 w-full rounded-md object-cover" /> : null}
      </div>
      <div>
        <Label htmlFor="program-cover">Cover Photo (hero banner)</Label>
        <Input id="program-cover" type="file" accept="image/*" onChange={async (e) => {
          const f = e.target.files?.[0]; if (!f) return;
          setForm({ ...form, cover_image: await readFileAsDataUrl(f) });
        }} />
        {form.cover_image ? <img src={form.cover_image} alt="Cover preview" className="mt-3 h-24 w-full rounded-md object-cover" /> : null}
      </div>
      <div>
        <Label htmlFor="program-attach">Attachment (PDF or file)</Label>
        <Input id="program-attach" type="file" onChange={async (e) => {
          const f = e.target.files?.[0]; if (!f) return;
          setForm({ ...form, attachment_url: await readFileAsDataUrl(f), attachment_name: f.name });
        }} />
        {form.attachment_name ? <p className="mt-2 text-xs text-muted-foreground">Attached: {form.attachment_name}</p> : null}
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
          <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-lg">
            <DialogTitle className="border-b px-6 py-4">{editing ? "Edit Press Item" : "Add Press Item"}</DialogTitle>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <PressRoomForm
                item={editing}
                saving={saving}
                onSave={async (item) => {
                  await onSave(item);
                  setOpen(false);
                }}
              />
            </div>
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
  const empty: PressRoomItem = { id: 0, title: "", summary: "", description: "", category: "News", image: "", document: "", document_name: "", link: "" };
  const [form, setForm] = useState<PressRoomItem>(item || empty);

  useEffect(() => {
    setForm(item || empty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: await readFileAsDataUrl(file) });
  }

  async function handleDocumentChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm({ ...form, document: await readFileAsDataUrl(file), document_name: file.name });
  }

  const isPublication = form.category === "Publications";

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
      <Field label="Title" required value={form.title} onChange={(title) => setForm({ ...form, title })} />
      <TextareaField label="Summary (short)" required value={form.summary} onChange={(summary) => setForm({ ...form, summary })} />
      <TextareaField label="Full description (optional, visitors read this)" value={form.description || ""} onChange={(description) => setForm({ ...form, description })} />
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
        <Label htmlFor="press-image">Story image (optional)</Label>
        <Input id="press-image" type="file" accept="image/*" onChange={handleImageChange} />
        <p className="mt-1 text-xs text-muted-foreground">
          Upload a photo for the story. It will be used inside the story detail and can also appear on the homepage hero.
        </p>
        {form.image ? <img src={form.image} alt="Press preview" className="mt-3 h-28 w-full rounded-md object-cover" /> : null}
      </div>

      {isPublication ? (
        <div>
          <Label htmlFor="press-document">Upload document (PDF, Word, Excel, etc.)</Label>
          <Input id="press-document" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleDocumentChange} />
          {form.document_name ? <p className="mt-2 text-xs text-muted-foreground">Attached: {form.document_name}</p> : null}
          <p className="mt-1 text-xs text-muted-foreground">Visitors will be able to open and download this document.</p>
        </div>
      ) : null}

      <Field label="Story link (optional)" value={form.link || ""} onChange={(link) => setForm({ ...form, link })} />
      <p className="mt-1 text-xs text-muted-foreground">
        When present, the title on the homepage hero points directly to this story link.
      </p>
      <TextareaField
        label="Description / body"
        value={form.description || ""}
        onChange={(description) => setForm({ ...form, description })}
      />
      <p className="mt-1 text-xs text-muted-foreground">
        You can include additional text and links inside the description as needed.
      </p>
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
      <Field label="Contact Email" value={form.contact.email} onChange={(email) => setForm({ ...form, contact: { ...form.contact, email } })} />
      <Field label="Contact Phone" value={form.contact.phone} onChange={(phone) => setForm({ ...form, contact: { ...form.contact, phone } })} />
      <Field label="Contact Address" value={form.contact.address} onChange={(address) => setForm({ ...form, contact: { ...form.contact, address } })} />
      <SubmitButton saving={saving} />
    </form>
  );
}


function AboutPageForm({ content, saving, onSave }: { content: AboutContent; saving: boolean; onSave: (content: AboutContent) => void }) {
  const [form, setForm] = useState<AboutContent>(content);

  useEffect(() => {
    setForm(content);
  }, [content]);

  const updateArrayItem = <T extends Record<string, string>>(array: T[], index: number, key: keyof T, value: string) =>
    array.map((item, i) => (i === index ? { ...item, [key]: value } : item));

  return (
    <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
      <Field label="Story title" value={form.storyTitle} onChange={(value) => setForm({ ...form, storyTitle: value })} />
      <TextareaField label="Story text" value={form.storyText} onChange={(value) => setForm({ ...form, storyText: value })} />
      <Field label="Story image URL" value={form.storyImage} onChange={(value) => setForm({ ...form, storyImage: value })} />
      <p className="text-sm text-muted-foreground">Enter a public image URL to display on the about story section.</p>

      <div className="rounded-2xl border border-border bg-muted p-4">
        <h3 className="text-lg font-semibold">Impact stats</h3>
        <p className="text-sm text-muted-foreground">These values show on the impact page.</p>
        <div className="space-y-3 mt-4">
          {form.impactStats.map((stat, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_2fr]">
              <Field label="Value" value={stat.value} onChange={(value) => setForm({ ...form, impactStats: updateArrayItem(form.impactStats, index, "value", value) })} />
              <Field label="Label" value={stat.label} onChange={(value) => setForm({ ...form, impactStats: updateArrayItem(form.impactStats, index, "label", value) })} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted p-4">
        <h3 className="text-lg font-semibold">Impact recognition</h3>
        <p className="text-sm text-muted-foreground">One sentence per line for the recognition list.</p>
        <TextareaField
          label="Recognition items"
          value={form.impactRecognition.join("\n")}
          onChange={(value) => setForm({ ...form, impactRecognition: value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) })}
        />
      </div>

      <div className="rounded-2xl border border-border bg-muted p-4">
        <h3 className="text-lg font-semibold">Beneficiaries</h3>
        <p className="text-sm text-muted-foreground">Update the beneficiaries shown on the about beneficiaries page.</p>
        <div className="space-y-3 mt-4">
          {form.beneficiaries.map((item, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-border bg-background p-3">
              <Field label="Title" value={item.title} onChange={(value) => setForm({ ...form, beneficiaries: updateArrayItem(form.beneficiaries, index, "title", value) })} />
              <TextareaField label="Description" value={item.description} onChange={(value) => setForm({ ...form, beneficiaries: updateArrayItem(form.beneficiaries, index, "description", value) })} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted p-4">
        <h3 className="text-lg font-semibold">Approach steps</h3>
        <p className="text-sm text-muted-foreground">Update the four approach steps on the about approach page.</p>
        <div className="space-y-3 mt-4">
          {form.approachSteps.map((item, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-border bg-background p-3">
              <Field label="Step title" value={item.title} onChange={(value) => setForm({ ...form, approachSteps: updateArrayItem(form.approachSteps, index, "title", value) })} />
              <TextareaField label="Step description" value={item.description} onChange={(value) => setForm({ ...form, approachSteps: updateArrayItem(form.approachSteps, index, "description", value) })} />
            </div>
          ))}
        </div>
      </div>

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

function HeroForm({ hero, saving, onSave }: { hero: HeroContent; saving: boolean; onSave: (h: HeroContent) => void }) {
  const [form, setForm] = useState<HeroContent>(hero);
  useEffect(() => { setForm(hero); }, [hero]);

  async function setSlide(index: number, file?: File) {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    const slides = [...form.slides];
    slides[index] = dataUrl;
    setForm({ ...form, slides });
  }

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <Field label="Badge text" value={form.badge} onChange={(badge) => setForm({ ...form, badge })} />
      <TextareaField label="Title" value={form.title} onChange={(title) => setForm({ ...form, title })} />
      <TextareaField label="Description" value={form.description} onChange={(description) => setForm({ ...form, description })} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Primary button label" value={form.ctaPrimaryLabel} onChange={(v) => setForm({ ...form, ctaPrimaryLabel: v })} />
        <Field label="Primary button link" value={form.ctaPrimaryLink} onChange={(v) => setForm({ ...form, ctaPrimaryLink: v })} />
        <Field label="Secondary button label" value={form.ctaSecondaryLabel} onChange={(v) => setForm({ ...form, ctaSecondaryLabel: v })} />
        <Field label="Secondary button link" value={form.ctaSecondaryLink} onChange={(v) => setForm({ ...form, ctaSecondaryLink: v })} />
      </div>
      <div className="space-y-3">
        <Label>Hero slideshow images (3 — auto scroll)</Label>
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-md border border-border p-3">
            <p className="text-sm font-medium">Slide {i + 1}</p>
            <Input type="file" accept="image/*" onChange={(e) => setSlide(i, e.target.files?.[0])} className="mt-2" />
            {form.slides[i] ? (
              <img src={form.slides[i]} alt={`Slide ${i + 1}`} className="mt-2 h-28 w-full rounded-md object-cover" />
            ) : null}
          </div>
        ))}
      </div>
      <SubmitButton saving={saving} />
    </form>
  );
}

function DonationForm({ donation, saving, onSave }: { donation: DonationContent; saving: boolean; onSave: (d: DonationContent) => void }) {
  const [form, setForm] = useState<DonationContent>(donation);
  useEffect(() => { setForm(donation); }, [donation]);

  const updateMomo = (i: number, key: keyof MomoAccount, v: string) => {
    const momo = form.momo.map((m, idx) => (idx === i ? { ...m, [key]: v } : m));
    setForm({ ...form, momo });
  };
  const updateBank = (i: number, key: keyof BankAccount, v: string) => {
    const banks = form.banks.map((b, idx) => (idx === i ? { ...b, [key]: v } : b));
    setForm({ ...form, banks });
  };

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <TextareaField label="Intro text (optional)" value={form.intro} onChange={(intro) => setForm({ ...form, intro })} />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Mobile Money (MoMo)</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => setForm({ ...form, momo: [...form.momo, { name: "", number: "" }] })}>
            <Plus className="mr-1 h-4 w-4" /> Add MoMo
          </Button>
        </div>
        {form.momo.map((m, i) => (
          <div key={i} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_1fr_auto]">
            <Input placeholder="Account holder / label" value={m.name} onChange={(e) => updateMomo(i, "name", e.target.value)} />
            <Input placeholder="MoMo number" value={m.number} onChange={(e) => updateMomo(i, "number", e.target.value)} />
            <Button type="button" variant="destructive" size="sm" onClick={() => setForm({ ...form, momo: form.momo.filter((_, idx) => idx !== i) })}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Bank Accounts</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => setForm({ ...form, banks: [...form.banks, { bank: "", accountName: "", accountNumber: "", swift: "" }] })}>
            <Plus className="mr-1 h-4 w-4" /> Add Bank
          </Button>
        </div>
        {form.banks.map((b, i) => (
          <div key={i} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-2">
            <Input placeholder="Bank name" value={b.bank} onChange={(e) => updateBank(i, "bank", e.target.value)} />
            <Input placeholder="Account name" value={b.accountName} onChange={(e) => updateBank(i, "accountName", e.target.value)} />
            <Input placeholder="Account number" value={b.accountNumber} onChange={(e) => updateBank(i, "accountNumber", e.target.value)} />
            <Input placeholder="SWIFT (optional)" value={b.swift || ""} onChange={(e) => updateBank(i, "swift", e.target.value)} />
            <div className="sm:col-span-2 flex justify-end">
              <Button type="button" variant="destructive" size="sm" onClick={() => setForm({ ...form, banks: form.banks.filter((_, idx) => idx !== i) })}>
                <Trash2 className="mr-1 h-4 w-4" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <SubmitButton saving={saving} />
    </form>
  );
}


function SubProgramForm({ sub, programs, saving, onSave }: { sub?: SubProgram | null; programs: Program[]; saving: boolean; onSave: (s: SubProgram) => void }) {
  const [form, setForm] = useState<SubProgram>(sub || { id: 0, program_id: programs[0]?.id || 0, title: "", description: "", long_description: "", image: "", cover_image: "", attachment_url: "", attachment_name: "", sort_order: 0 });
  useEffect(() => {
    setForm(sub || { id: 0, program_id: programs[0]?.id || 0, title: "", description: "", long_description: "", image: "", cover_image: "", attachment_url: "", attachment_name: "", sort_order: 0 });
  }, [sub, programs]);

  async function setFile(key: "image" | "cover_image", file?: File) {
    if (!file) return;
    setForm({ ...form, [key]: await readFileAsDataUrl(file) });
  }
  async function setAttach(file?: File) {
    if (!file) return;
    setForm({ ...form, attachment_url: await readFileAsDataUrl(file), attachment_name: file.name });
  }

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <div>
        <Label>Parent program</Label>
        <select
          className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          value={form.program_id}
          onChange={(e) => setForm({ ...form, program_id: Number(e.target.value) })}
        >
          {programs.length === 0 ? <option value="">— No programs yet —</option> : null}
          {programs.map((p) => (<option key={p.id} value={p.id}>{p.title}</option>))}
        </select>
      </div>
      <Field label="Title" required value={form.title} onChange={(title) => setForm({ ...form, title })} />
      <TextareaField label="Short description" required value={form.description} onChange={(description) => setForm({ ...form, description })} />
      <TextareaField label="Full description (Learn more)" value={form.long_description || ""} onChange={(long_description) => setForm({ ...form, long_description })} />
      <div>
        <Label>Image</Label>
        <Input type="file" accept="image/*" onChange={(e) => setFile("image", e.target.files?.[0])} />
        {form.image ? <img src={form.image} alt="" className="mt-2 h-20 w-full rounded object-cover" /> : null}
      </div>
      <div>
        <Label>Cover photo</Label>
        <Input type="file" accept="image/*" onChange={(e) => setFile("cover_image", e.target.files?.[0])} />
        {form.cover_image ? <img src={form.cover_image} alt="" className="mt-2 h-20 w-full rounded object-cover" /> : null}
      </div>
      <div>
        <Label>Attachment (PDF / file)</Label>
        <Input type="file" onChange={(e) => setAttach(e.target.files?.[0])} />
        {form.attachment_name ? <p className="mt-1 text-xs text-muted-foreground">Attached: {form.attachment_name}</p> : null}
      </div>
      <SubmitButton saving={saving} />
    </form>
  );
}

function BeneficiaryForm({ item, saving, onSave }: { item?: Beneficiary | null; saving: boolean; onSave: (b: Beneficiary) => void }) {
  const [form, setForm] = useState<Beneficiary>(item || { id: 0, title: "", description: "", filled: true, sort_order: 0 });
  useEffect(() => { setForm(item || { id: 0, title: "", description: "", filled: true, sort_order: 0 }); }, [item]);
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <Field label="Title" required value={form.title} onChange={(title) => setForm({ ...form, title })} />
      <TextareaField label="Description" required value={form.description} onChange={(description) => setForm({ ...form, description })} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.filled} onChange={(e) => setForm({ ...form, filled: e.target.checked })} />
        Highlighted card (filled blue background)
      </label>
      <SubmitButton saving={saving} />
    </form>
  );
}

function CoreValueForm({ item, saving, onSave }: { item?: CoreValue | null; saving: boolean; onSave: (v: CoreValue) => void }) {
  const [form, setForm] = useState<CoreValue>(item || { id: 0, title: "", description: "", sort_order: 0 });
  useEffect(() => { setForm(item || { id: 0, title: "", description: "", sort_order: 0 }); }, [item]);
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <Field label="Title" required value={form.title} onChange={(title) => setForm({ ...form, title })} />
      <TextareaField label="Description" required value={form.description} onChange={(description) => setForm({ ...form, description })} />
      <SubmitButton saving={saving} />
    </form>
  );
}
