import { createClient } from "@supabase/supabase-js";
import seedData from "@/backend/seed-data.json";

type JsonRecord = Record<string, unknown>;

export type TeamMember = {
  id: number;
  name: string;
  title: string;
  email: string | null;
  phone: string | null;
  photo: string | null;
};

export type Program = {
  id: number;
  title: string;
  description: string;
  long_description: string | null;
  image: string | null;
  cover_image?: string | null;
  attachment_url?: string | null;
  attachment_name?: string | null;
};

export type SubProgram = {
  id: number;
  program_id: number;
  title: string;
  description: string;
  long_description: string | null;
  image: string | null;
  cover_image: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  sort_order: number;
};

export type Beneficiary = {
  id: number;
  title: string;
  description: string;
  filled: boolean;
  sort_order: number;
};

export type CoreValue = {
  id: number;
  title: string;
  description: string;
  sort_order: number;
};

export type GalleryImage = {
  id: number;
  title: string;
  image: string;
  description: string | null;
  category: string | null;
  link: string | null;
};

export type PressRoomItem = {
  id: number;
  title: string;
  summary: string;
  description: string | null;
  category: "News" | "Publications" | "Jobs";
  image: string | null;
  document: string | null;
  document_name: string | null;
  link: string | null;
  created_at?: string;
};

let supabaseClient: ReturnType<typeof createClient> | undefined;

const fallbackData = seedData as unknown as {
  team?: Array<Omit<TeamMember, "id"> & { id: number }>;
  programs?: Array<Omit<Program, "id"> & { id: number }>;
  gallery?: Array<Omit<GalleryImage, "id" | "category"> & { id: number; category?: string | null }>;
  pressRoom?: Array<Omit<PressRoomItem, "id"> & { id: number }>;
  content?: JsonRecord;
};

function getRuntimeEnv(name: string) {
  const runtimeEnv = (globalThis as typeof globalThis & { __APP_ENV__?: Record<string, string> }).__APP_ENV__;
  const value = typeof process !== "undefined" ? process.env[name] : undefined;
  return typeof value === "string" ? value.trim() : runtimeEnv?.[name];
}

function getSupabaseUrl() {
  const url = getRuntimeEnv("SUPABASE_URL");
  if (!url) {
    throw new Error("SUPABASE_URL is missing. Add your Supabase URL to .env or hosting secrets.");
  }
  return url;
}

function getSupabaseKey() {
  const key = (getRuntimeEnv("SUPABASE_SERVICE_ROLE_KEY") || getRuntimeEnv("SUPABASE_PUBLISHABLE_KEY") || getRuntimeEnv("SUPABASE_ANON_KEY"))?.toString().trim();
  if (!key) {
    throw new Error("SUPABASE_PUBLISHABLE_KEY is missing. Enable Lovable Cloud.");
  }
  return key;
}

function isMissingDatabaseError(error: unknown) {
  return error instanceof Error && (error.message.includes("SUPABASE_URL") || error.message.includes("SUPABASE_SERVICE_ROLE_KEY") || error.message.includes("SUPABASE_ANON_KEY"));
}

export function sql(): any {
  if (!supabaseClient) {
    supabaseClient = createClient(getSupabaseUrl(), getSupabaseKey());
  }
  return supabaseClient as any;
}

export function jsonError(message: string, status = 400) {
  return Response.json({ success: false, message }, { status });
}

export async function hashPassword(password: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function base64Url(bytes: ArrayBuffer | Uint8Array | string) {
  const text =
    typeof bytes === "string"
      ? bytes
      : String.fromCharCode(...new Uint8Array(bytes instanceof Uint8Array ? bytes : bytes));
  return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function getSessionSecret() {
  return getRuntimeEnv("ADMIN_SESSION_SECRET") || getRuntimeEnv("DATABASE_URL") || "development-session-secret";
}

async function hmac(message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return base64Url(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message)));
}

export async function createAdminToken(email: string) {
  const payload = base64Url(JSON.stringify({ email, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 }));
  return `${payload}.${await hmac(payload)}`;
}

export async function requireAdmin(request: Request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const [payload, signature] = token.split(".");
  if (!payload || !signature || signature !== (await hmac(payload))) {
    return false;
  }

  try {
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    return typeof decoded.exp === "number" && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

export async function requireAdminOr401(request: Request) {
  if (await requireAdmin(request)) return null;
  return jsonError("Admin login is required.", 401);
}

export async function getAdminByEmail(email: string) {
  try {
    const { data, error } = await sql()
      .from("admin_users")
      .select("email, password_hash")
      .eq("email", email)
      .limit(1)
      .single();
    if (error) throw error;
    return data as { email: string; password_hash: string } | undefined;
  } catch (error) {
    if (error instanceof Error && error.message.includes("no rows")) return undefined;
    throw error;
  }
}

function numberId<T extends Record<string, any>>(row: T) {
  return { ...row, id: Number(row.id) };
}

function numberIds<T extends Record<string, any>>(rows: T[]) {
  return rows.map(numberId);
}

export async function listTeam() {
  try {
    // Do NOT even select `photo` here — base64 blobs (5–10 MB each) overflow
    // the Worker before we can map them away. Return a stable photo endpoint
    // and let the image request load/caches each photo separately.
    const { data, error } = await sql()
      .from("team_members")
      .select("id, name, title, email, phone")
      .order("id", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((r: any) => ({
      id: Number(r.id),
      name: r.name,
      title: r.title,
      email: r.email,
      phone: r.phone,
      photo: `/api/team/photo/${r.id}`,
    })) as TeamMember[];
  } catch (error) {
    if (!isMissingDatabaseError(error)) throw error;
    return (fallbackData.team ?? []).map((member) => ({ ...member, id: Number(member.id) }));
  }
}

export async function getTeamMemberPhoto(id: number): Promise<string | null> {
  const { data, error } = await sql()
    .from("team_members")
    .select("photo")
    .eq("id", id)
    .single();
  if (error) return null;
  return (data as any)?.photo ?? null;
}

export async function saveTeamMember(member: Partial<TeamMember>) {
  // Ignore URL placeholders (e.g. "/api/team/photo/1") — they mean "keep existing photo".
  const incomingPhoto = member.photo;
  const photoIsUrlRef = typeof incomingPhoto === "string" && incomingPhoto.startsWith("/api/");
  const cols = "id, name, title, email, phone";
  try {
    if (member.id) {
      const update: Record<string, unknown> = {
        name: member.name,
        title: member.title,
        email: member.email ?? null,
        phone: member.phone ?? null,
        updated_at: new Date().toISOString(),
      };
      if (!photoIsUrlRef) update.photo = incomingPhoto ?? null;
      const { data, error } = await sql()
        .from("team_members")
        .update(update)
        .eq("id", member.id)
        .select(cols)
        .single();
      if (error) throw error;
      if (!data) return undefined;
      const row: any = data;
      return {
        id: Number(row.id),
        name: row.name,
        title: row.title,
        email: row.email,
        phone: row.phone,
        photo: photoIsUrlRef || incomingPhoto ? `/api/team/photo/${row.id}` : null,
      } as TeamMember;
    }

    const { data, error } = await sql()
      .from("team_members")
      .insert({
        name: member.name,
        title: member.title,
        email: member.email ?? null,
        phone: member.phone ?? null,
        photo: photoIsUrlRef ? null : incomingPhoto ?? null,
      })
      .select(cols)
      .single();
    if (error) throw error;
    const row: any = data;
    return {
      id: Number(row.id),
      name: row.name,
      title: row.title,
      email: row.email,
      phone: row.phone,
      photo: incomingPhoto ? `/api/team/photo/${row.id}` : null,
    } as TeamMember;
  } catch (error) {
    if (error instanceof Error && error.message.includes("missing")) throw error;
    throw error;
  }
}

export async function deleteTeamMember(id: number) {
  const { error } = await sql()
    .from("team_members")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ---------- Media (photos are served separately so lists stay small/fast) ----------
export const MEDIA_SOURCES = {
  program: { table: "programs", column: "image" },
  "program-cover": { table: "programs", column: "cover_image" },
  sub: { table: "sub_programs", column: "image" },
  "sub-cover": { table: "sub_programs", column: "cover_image" },
  press: { table: "press_room_items", column: "image" },
  "press-cover": { table: "press_room_items", column: "cover_image" },
  gallery: { table: "gallery_items", column: "image" },
  "gallery-cover": { table: "gallery_items", column: "cover_image" },
  "press-doc": { table: "press_room_items", column: "document" },
} as const;

export type MediaKind = keyof typeof MEDIA_SOURCES;

export function isMediaKind(kind: string): kind is MediaKind {
  return Object.prototype.hasOwnProperty.call(MEDIA_SOURCES, kind);
}

export async function getMediaValue(kind: MediaKind, id: number) {
  const source = MEDIA_SOURCES[kind];
  const { data, error } = await sql().from(source.table).select(source.column).eq("id", id).single();
  if (error) throw error;
  return ((data as any)?.[source.column] as string | null) ?? null;
}

function mediaUrl(kind: MediaKind, id: number | string, has?: boolean | null) {
  return has ? `/api/media/${kind}/${id}` : null;
}

function withMedia<T>(row: any, kind: MediaKind, coverKind?: MediaKind): T {
  const { has_image, has_cover, ...rest } = row ?? {};
  const mapped: any = { ...numberId(rest), image: mediaUrl(kind, row.id, has_image) };
  if (coverKind) mapped.cover_image = mediaUrl(coverKind, row.id, has_cover);
  return mapped as T;
}

// A "/api/..." value means "keep the existing photo" (the client only ever
// receives the URL reference, never the raw blob).
function mediaPayload(image: unknown, cover?: unknown) {
  const out: Record<string, unknown> = {};
  if (!(typeof image === "string" && image.startsWith("/api/"))) out.image = image ?? null;
  if (cover !== undefined && !(typeof cover === "string" && cover.startsWith("/api/"))) {
    out.cover_image = cover ?? null;
  }
  return out;
}

const PROGRAM_COLS = "id, title, description, long_description, attachment_url, attachment_name, has_image, has_cover";

export async function listPrograms() {
  try {
    const { data, error } = await sql()
      .from("programs")
      .select(PROGRAM_COLS)
      .order("id", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row: any) => withMedia<Program>(row, "program", "program-cover"));
  } catch (error) {
    if (!isMissingDatabaseError(error)) throw error;
    return (fallbackData.programs ?? []).map((program) => ({
      ...program,
      long_description: (program as any).long_description ?? null,
      id: Number(program.id),
    }));
  }
}

export async function saveProgram(program: Partial<Program>) {
  const payload = {
    title: program.title,
    description: program.description,
    long_description: program.long_description ?? null,
    attachment_url: program.attachment_url ?? null,
    attachment_name: program.attachment_name ?? null,
    ...mediaPayload(program.image, program.cover_image),
  };
  if (program.id) {
    const { data, error } = await sql().from("programs")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", program.id).select(PROGRAM_COLS).single();
    if (error) throw error;
    return data ? withMedia<Program>(data, "program", "program-cover") : undefined;
  }
  const { data, error } = await sql().from("programs").insert(payload).select(PROGRAM_COLS).single();
  if (error) throw error;
  return withMedia<Program>(data, "program", "program-cover");
}

export async function getProgram(id: number) {
  try {
    const { data, error } = await sql()
      .from("programs")
      .select(PROGRAM_COLS)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data ? withMedia<Program>(data, "program", "program-cover") : undefined;
  } catch (error) {
    if (error instanceof Error && error.message.includes("no rows")) return undefined;
    throw error;
  }
}

export async function deleteProgram(id: number) {
  const { error } = await sql()
    .from("programs")
    .delete()
    .eq("id", id);
  if (error) throw error;
}


const GALLERY_COLS = "id, title, description, category, link, has_image, has_cover";

export async function listGallery() {
  try {
    const { data, error } = await sql()
      .from("gallery_items")
      .select(GALLERY_COLS)
      .order("id", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row: any) => withMedia<GalleryImage>(row, "gallery", "gallery-cover"));
  } catch (error) {
    if (!isMissingDatabaseError(error)) throw error;
    return (fallbackData.gallery ?? []).map((item) => ({
      ...item,
      id: Number(item.id),
      category: item.category ?? "Event",
      link: (item as any).link ?? null,
    }));
  }
}

export async function saveGalleryImage(image: Partial<GalleryImage>) {
  const payload = {
    title: image.title,
    description: image.description ?? null,
    category: image.category ?? "Event",
    link: image.link ?? null,
    ...mediaPayload(image.image, (image as any).cover_image),
  };
  if (image.id) {
    const { data, error } = await sql()
      .from("gallery_items")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", image.id)
      .select(GALLERY_COLS)
      .single();
    if (error) throw error;
    return data ? withMedia<GalleryImage>(data, "gallery", "gallery-cover") : undefined;
  }

  const { data, error } = await sql()
    .from("gallery_items")
    .insert(payload)
    .select(GALLERY_COLS)
    .single();
  if (error) throw error;
  return withMedia<GalleryImage>(data, "gallery", "gallery-cover");
}

export async function deleteGalleryImage(id: number) {
  const { error } = await sql()
    .from("gallery_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

const PRESS_COLS =
  "id, title, summary, description, category, document_name, link, created_at, has_image, has_cover, has_document";

function mapPress(row: any): PressRoomItem {
  const { has_document, ...rest } = row ?? {};
  const mapped = withMedia<PressRoomItem>(rest, "press", "press-cover") as any;
  mapped.document = has_document ? `/api/media/press-doc/${row.id}` : null;
  return mapped as PressRoomItem;
}

export async function listPressRoom(category?: string | null, limit?: number | null) {
  try {
    const limitValue = limit ? Math.max(1, Math.min(limit, 50)) : 200;
    let query = sql()
      .from("press_room_items")
      .select(PRESS_COLS)
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query.limit(limitValue);
    if (error) throw error;
    return (data ?? []).map((row: any) => mapPress(row));
  } catch (error) {
    if (!isMissingDatabaseError(error)) throw error;
    const items = (fallbackData.pressRoom ?? []).filter((item) => !category || item.category === category);
    const limited = limit ? items.slice(0, Math.max(1, Math.min(limit, 50))) : items;
    return limited.map((item) => ({
      ...item,
      id: Number(item.id),
      description: null,
      document: null,
      document_name: null,
      link: null,
    }));
  }
}

export async function savePressRoomItem(item: Partial<PressRoomItem>) {
  const payload: Record<string, unknown> = {
    title: item.title,
    summary: item.summary,
    description: item.description ?? null,
    category: item.category,
    document_name: item.document_name ?? null,
    link: item.link ?? null,
    ...mediaPayload(item.image, (item as any).cover_image),
  };
  if (!(typeof item.document === "string" && item.document.startsWith("/api/"))) {
    payload.document = item.document ?? null;
  }

  if (item.id) {
    const { data, error } = await sql()
      .from("press_room_items")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", item.id)
      .select(PRESS_COLS)
      .single();
    if (error) throw error;
    return data ? mapPress(data) : undefined;
  }

  const { data, error } = await sql()
    .from("press_room_items")
    .insert(payload)
    .select(PRESS_COLS)
    .single();
  if (error) throw error;
  return mapPress(data);
}


export async function deletePressRoomItem(id: number) {
  const { error } = await sql()
    .from("press_room_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function getSiteContent() {
  try {
    const { data, error } = await sql()
      .from("site_content")
      .select("key, value");
    if (error) throw error;
    return Object.fromEntries((data ?? []).map((row: any) => [row.key, row.value])) as JsonRecord;
  } catch (error) {
    if (!isMissingDatabaseError(error)) throw error;
    return (fallbackData.content ?? {}) as JsonRecord;
  }
}

export async function updateSiteContent(updates: JsonRecord) {
  try {
    for (const [key, value] of Object.entries(updates)) {
      const { error } = await sql()
        .from("site_content")
        .upsert(
          {
            key,
            value: value,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        );
      if (error) throw error;
    }
    return getSiteContent();
  } catch (error) {
    if (error instanceof Error && error.message.includes("missing")) throw error;
    throw error;
  }
}

export async function saveContactMessage(message: JsonRecord) {
  try {
    const { data, error } = await sql()
      .from("contact_messages")
      .insert({
        name: message.name ?? null,
        email: message.email ?? null,
        phone: message.phone ?? null,
        subject: message.subject ?? null,
        message: message.message ?? null,
      })
      .select("id, created_at")
      .single();
    if (error) throw error;
    return numberId(data) as { id: number; created_at: string };
  } catch (error) {
    if (error instanceof Error && error.message.includes("missing")) throw error;
    throw error;
  }
}

export async function listContactMessages() {
  try {
    const { data, error } = await sql()
      .from("contact_messages")
      .select("id, name, email, phone, subject, message, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return numberIds(data ?? []);
  } catch (error) {
    if (!isMissingDatabaseError(error)) throw error;
    return [];
  }
}

export async function deleteContactMessage(id: number) {
  const { error } = await sql()
    .from("contact_messages")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ---------- Sub-programs ----------
const SUB_COLS = "id, program_id, title, description, long_description, attachment_url, attachment_name, sort_order, has_image, has_cover";

export async function listSubPrograms(programId?: number | null) {
  let q = sql().from("sub_programs").select(SUB_COLS).order("sort_order", { ascending: true }).order("id", { ascending: true });
  if (programId) q = q.eq("program_id", programId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((row: any) => withMedia<SubProgram>(row, "sub", "sub-cover"));
}
export async function saveSubProgram(item: Partial<SubProgram>) {
  const payload = {
    program_id: item.program_id,
    title: item.title,
    description: item.description,
    long_description: item.long_description ?? null,
    attachment_url: item.attachment_url ?? null,
    attachment_name: item.attachment_name ?? null,
    sort_order: item.sort_order ?? 0,
    ...mediaPayload(item.image, item.cover_image),
  };
  if (item.id) {
    const { data, error } = await sql().from("sub_programs")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", item.id).select(SUB_COLS).single();
    if (error) throw error;
    return data ? withMedia<SubProgram>(data, "sub", "sub-cover") : undefined;
  }
  const { data, error } = await sql().from("sub_programs").insert(payload).select(SUB_COLS).single();
  if (error) throw error;
  return withMedia<SubProgram>(data, "sub", "sub-cover");
}

export async function deleteSubProgram(id: number) {
  const { error } = await sql().from("sub_programs").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Beneficiaries ----------
const BEN_COLS = "id, title, description, filled, sort_order";
export async function listBeneficiaries() {
  const { data, error } = await sql().from("beneficiaries").select(BEN_COLS).order("sort_order", { ascending: true }).order("id", { ascending: true });
  if (error) throw error;
  return numberIds(data ?? []) as Beneficiary[];
}
export async function saveBeneficiary(item: Partial<Beneficiary>) {
  const payload = { title: item.title, description: item.description, filled: item.filled ?? true, sort_order: item.sort_order ?? 0 };
  if (item.id) {
    const { data, error } = await sql().from("beneficiaries")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", item.id).select(BEN_COLS).single();
    if (error) throw error;
    return data ? (numberId(data) as Beneficiary) : undefined;
  }
  const { data, error } = await sql().from("beneficiaries").insert(payload).select(BEN_COLS).single();
  if (error) throw error;
  return numberId(data) as Beneficiary;
}
export async function deleteBeneficiary(id: number) {
  const { error } = await sql().from("beneficiaries").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Core values ----------
const CV_COLS = "id, title, description, sort_order";
export async function listCoreValues() {
  const { data, error } = await sql().from("core_values").select(CV_COLS).order("sort_order", { ascending: true }).order("id", { ascending: true });
  if (error) throw error;
  return numberIds(data ?? []) as CoreValue[];
}
export async function saveCoreValue(item: Partial<CoreValue>) {
  const payload = { title: item.title, description: item.description, sort_order: item.sort_order ?? 0 };
  if (item.id) {
    const { data, error } = await sql().from("core_values")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", item.id).select(CV_COLS).single();
    if (error) throw error;
    return data ? (numberId(data) as CoreValue) : undefined;
  }
  // Enforce max 10
  const existing = await listCoreValues();
  if (existing.length >= 10) throw new Error("You can have at most 10 core values. Delete one before adding another.");
  const { data, error } = await sql().from("core_values").insert(payload).select(CV_COLS).single();
  if (error) throw error;
  return numberId(data) as CoreValue;
}
export async function deleteCoreValue(id: number) {
  const { error } = await sql().from("core_values").delete().eq("id", id);
  if (error) throw error;
}
