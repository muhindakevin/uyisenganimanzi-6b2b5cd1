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
    const { data, error } = await sql()
      .from("team_members")
      .select("id, name, title, email, phone, photo")
      .order("id", { ascending: true });
    if (error) throw error;
    return numberIds(data ?? []) as TeamMember[];
  } catch (error) {
    if (!isMissingDatabaseError(error)) throw error;
    return (fallbackData.team ?? []).map((member) => ({ ...member, id: Number(member.id) }));
  }
}

export async function saveTeamMember(member: Partial<TeamMember>) {
  try {
    if (member.id) {
      const { data, error } = await sql()
        .from("team_members")
        .update({
          name: member.name,
          title: member.title,
          email: member.email ?? null,
          phone: member.phone ?? null,
          photo: member.photo ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", member.id)
        .select("id, name, title, email, phone, photo")
        .single();
      if (error) throw error;
      return data ? (numberId(data) as TeamMember) : undefined;
    }

    const { data, error } = await sql()
      .from("team_members")
      .insert({
        name: member.name,
        title: member.title,
        email: member.email ?? null,
        phone: member.phone ?? null,
        photo: member.photo ?? null,
      })
      .select("id, name, title, email, phone, photo")
      .single();
    if (error) throw error;
    return numberId(data) as TeamMember;
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

export async function listPrograms() {
  try {
    const { data, error } = await sql()
      .from("programs")
      .select("id, title, description, long_description, image")
      .order("id", { ascending: true });
    if (error) throw error;
    return numberIds(data ?? []) as Program[];
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
  try {
    if (program.id) {
      const { data, error } = await sql()
        .from("programs")
        .update({
          title: program.title,
          description: program.description,
          long_description: program.long_description ?? null,
          image: program.image ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", program.id)
        .select("id, title, description, long_description, image")
        .single();
      if (error) throw error;
      return data ? (numberId(data) as Program) : undefined;
    }

    const { data, error } = await sql()
      .from("programs")
      .insert({
        title: program.title,
        description: program.description,
        long_description: program.long_description ?? null,
        image: program.image ?? null,
      })
      .select("id, title, description, long_description, image")
      .single();
    if (error) throw error;
    return numberId(data) as Program;
  } catch (error) {
    if (error instanceof Error && error.message.includes("missing")) throw error;
    throw error;
  }
}

export async function getProgram(id: number) {
  try {
    const { data, error } = await sql()
      .from("programs")
      .select("id, title, description, long_description, image")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data ? (numberId(data) as Program) : undefined;
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

export async function listGallery() {
  try {
    const { data, error } = await sql()
      .from("gallery_items")
      .select("id, title, image, description, category, link")
      .order("id", { ascending: true });
    if (error) throw error;
    return numberIds(data ?? []) as GalleryImage[];
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
  try {
    if (image.id) {
      const { data, error } = await sql()
        .from("gallery_items")
        .update({
          title: image.title,
          image: image.image,
          description: image.description ?? null,
          category: image.category ?? "Event",
          link: image.link ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", image.id)
        .select("id, title, image, description, category, link")
        .single();
      if (error) throw error;
      return data ? (numberId(data) as GalleryImage) : undefined;
    }

    const { data, error } = await sql()
      .from("gallery_items")
      .insert({
        title: image.title,
        image: image.image,
        description: image.description ?? null,
        category: image.category ?? "Event",
        link: image.link ?? null,
      })
      .select("id, title, image, description, category, link")
      .single();
    if (error) throw error;
    return numberId(data) as GalleryImage;
  } catch (error) {
    if (error instanceof Error && error.message.includes("missing")) throw error;
    throw error;
  }
}

export async function deleteGalleryImage(id: number) {
  const { error } = await sql()
    .from("gallery_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function listPressRoom(category?: string | null, limit?: number | null) {
  try {
    const limitValue = limit ? Math.max(1, Math.min(limit, 50)) : 200;
    let query = sql()
      .from("press_room_items")
      .select("id, title, summary, description, category, image, document, document_name, link, created_at")
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query.limit(limitValue);
    if (error) throw error;
    return numberIds(data ?? []) as PressRoomItem[];
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
  try {
    if (item.id) {
      const { data, error } = await sql()
        .from("press_room_items")
        .update({
          title: item.title,
          summary: item.summary,
          description: item.description ?? null,
          category: item.category,
          image: item.image ?? null,
          document: item.document ?? null,
          document_name: item.document_name ?? null,
          link: item.link ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id)
        .select("id, title, summary, description, category, image, document, document_name, link, created_at")
        .single();
      if (error) throw error;
      return data ? (numberId(data) as PressRoomItem) : undefined;
    }

    const { data, error } = await sql()
      .from("press_room_items")
      .insert({
        title: item.title,
        summary: item.summary,
        description: item.description ?? null,
        category: item.category,
        image: item.image ?? null,
        document: item.document ?? null,
        document_name: item.document_name ?? null,
        link: item.link ?? null,
      })
      .select("id, title, summary, description, category, image, document, document_name, link, created_at")
      .single();
    if (error) throw error;
    return numberId(data) as PressRoomItem;
  } catch (error) {
    if (error instanceof Error && error.message.includes("missing")) throw error;
    throw error;
  }
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
