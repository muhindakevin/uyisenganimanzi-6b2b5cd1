import { neon } from "@neondatabase/serverless";
import seedData from "@/data.json";

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

let sqlClient: ReturnType<typeof neon> | undefined;

const fallbackData = seedData as unknown as {
  team?: Array<Omit<TeamMember, "id"> & { id: number }>;
  programs?: Array<Omit<Program, "id"> & { id: number }>;
  gallery?: Array<Omit<GalleryImage, "id" | "category"> & { id: number; category?: string | null }>;
  pressRoom?: Array<Omit<PressRoomItem, "id"> & { id: number }>;
  content?: JsonRecord;
};

function getRuntimeEnv(name: string) {
  const runtimeEnv = (globalThis as typeof globalThis & { __APP_ENV__?: Record<string, string> }).__APP_ENV__;
  return process.env[name] || runtimeEnv?.[name];
}

function getDatabaseUrl() {
  const databaseUrl = getRuntimeEnv("DATABASE_URL");
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing. Add your Neon connection string to .env or your hosting secrets.");
  }
  return databaseUrl;
}

function isMissingDatabaseError(error: unknown) {
  return error instanceof Error && error.message.includes("DATABASE_URL is missing");
}

export function sql() {
  if (!sqlClient) {
    sqlClient = neon(getDatabaseUrl());
  }
  return sqlClient;
}

async function query<T = Record<string, any>>(text: string, params: unknown[] = []): Promise<T[]> {
  const client = sql() as unknown as { query: (text: string, params?: unknown[]) => Promise<T[]> };
  const result = await client.query(text, params);
  return result as unknown as T[];
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
  const payload = base64Url(JSON.stringify({ email, exp: Date.now() + 1000 * 60 * 60 * 8 }));
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
  const rows = await query("select email, password_hash from admin_users where lower(email) = lower($1) limit 1", [
    email,
  ]);
  return rows[0] as { email: string; password_hash: string } | undefined;
}

function numberId<T extends Record<string, any>>(row: T) {
  return { ...row, id: Number(row.id) };
}

function numberIds<T extends Record<string, any>>(rows: T[]) {
  return rows.map(numberId);
}

export async function listTeam() {
  try {
    return numberIds(await query(
      "select id, name, title, email, phone, photo from team_members order by id asc",
    )) as TeamMember[];
  } catch (error) {
    if (!isMissingDatabaseError(error)) throw error;
    return (fallbackData.team ?? []).map((member) => ({ ...member, id: Number(member.id) }));
  }
}

export async function saveTeamMember(member: Partial<TeamMember>) {
  if (member.id) {
    const rows = await query(
      `update team_members
       set name = $2, title = $3, email = $4, phone = $5, photo = $6, updated_at = now()
       where id = $1
       returning id, name, title, email, phone, photo`,
      [member.id, member.name, member.title, member.email ?? null, member.phone ?? null, member.photo ?? null],
    );
    return rows[0] ? (numberId(rows[0]) as TeamMember) : undefined;
  }

  const rows = await query(
    `insert into team_members (name, title, email, phone, photo)
     values ($1, $2, $3, $4, $5)
     returning id, name, title, email, phone, photo`,
    [member.name, member.title, member.email ?? null, member.phone ?? null, member.photo ?? null],
  );
  return numberId(rows[0]) as TeamMember;
}

export async function deleteTeamMember(id: number) {
  await query("delete from team_members where id = $1", [id]);
}

export async function listPrograms() {
  try {
    return numberIds(await query(
      "select id, title, description, long_description, image from programs order by id asc",
    )) as Program[];
  } catch (error) {
    if (!isMissingDatabaseError(error)) throw error;
    return (fallbackData.programs ?? []).map((program) => ({ ...program, long_description: (program as any).long_description ?? null, id: Number(program.id) }));
  }
}

export async function saveProgram(program: Partial<Program>) {
  if (program.id) {
    const rows = await query(
      `update programs
       set title = $2, description = $3, long_description = $4, image = $5, updated_at = now()
       where id = $1
       returning id, title, description, long_description, image`,
      [program.id, program.title, program.description, program.long_description ?? null, program.image ?? null],
    );
    return rows[0] ? (numberId(rows[0]) as Program) : undefined;
  }

  const rows = await query(
    `insert into programs (title, description, long_description, image)
     values ($1, $2, $3, $4)
     returning id, title, description, long_description, image`,
    [program.title, program.description, program.long_description ?? null, program.image ?? null],
  );
  return numberId(rows[0]) as Program;
}

export async function getProgram(id: number) {
  const rows = await query(
    "select id, title, description, long_description, image from programs where id = $1",
    [id],
  );
  return rows[0] ? (numberId(rows[0]) as Program) : undefined;
}

export async function deleteProgram(id: number) {
  await query("delete from programs where id = $1", [id]);
}

export async function listGallery() {
  try {
    return numberIds(await query(
      "select id, title, image, description, category, link from gallery_items order by id asc",
    )) as GalleryImage[];
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
  if (image.id) {
    const rows = await query(
      `update gallery_items
       set title = $2, image = $3, description = $4, category = $5, link = $6, updated_at = now()
       where id = $1
       returning id, title, image, description, category, link`,
      [image.id, image.title, image.image, image.description ?? null, image.category ?? "Event", image.link ?? null],
    );
    return rows[0] ? (numberId(rows[0]) as GalleryImage) : undefined;
  }

  const rows = await query(
    `insert into gallery_items (title, image, description, category, link)
     values ($1, $2, $3, $4, $5)
     returning id, title, image, description, category, link`,
    [image.title, image.image, image.description ?? null, image.category ?? "Event", image.link ?? null],
  );
  return numberId(rows[0]) as GalleryImage;
}

export async function deleteGalleryImage(id: number) {
  await query("delete from gallery_items where id = $1", [id]);
}

export async function listPressRoom(category?: string | null, limit?: number | null) {
  const params: unknown[] = [];
  const where = category ? "where category = $1" : "";
  if (category) params.push(category);
  const limitSql = limit ? `limit ${Math.max(1, Math.min(limit, 50))}` : "";

  try {
    return numberIds(await query(
      `select id, title, summary, description, category, image, document, document_name, link, created_at
       from press_room_items
       ${where}
       order by created_at desc, id desc
       ${limitSql}`,
      params,
    )) as PressRoomItem[];
  } catch (error) {
    if (!isMissingDatabaseError(error)) throw error;
    const items = (fallbackData.pressRoom ?? []).filter((item) => !category || item.category === category);
    const limited = limit ? items.slice(0, Math.max(1, Math.min(limit, 50))) : items;
    return limited.map((item) => ({ ...item, id: Number(item.id), description: null, document: null, document_name: null, link: null }));
  }
}

export async function savePressRoomItem(item: Partial<PressRoomItem>) {
  if (item.id) {
    const rows = await query(
      `update press_room_items
       set title = $2, summary = $3, description = $4, category = $5, image = $6, document = $7, document_name = $8, link = $9, updated_at = now()
       where id = $1
       returning id, title, summary, description, category, image, document, document_name, link, created_at`,
      [item.id, item.title, item.summary, item.description ?? null, item.category, item.image ?? null, item.document ?? null, item.document_name ?? null, item.link ?? null],
    );
    return rows[0] ? (numberId(rows[0]) as PressRoomItem) : undefined;
  }

  const rows = await query(
    `insert into press_room_items (title, summary, description, category, image, document, document_name, link)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     returning id, title, summary, description, category, image, document, document_name, link, created_at`,
    [item.title, item.summary, item.description ?? null, item.category, item.image ?? null, item.document ?? null, item.document_name ?? null, item.link ?? null],
  );
  return numberId(rows[0]) as PressRoomItem;
}

export async function deletePressRoomItem(id: number) {
  await query("delete from press_room_items where id = $1", [id]);
}

export async function getSiteContent() {
  try {
    const rows = await query("select key, value from site_content");
    return Object.fromEntries(rows.map((row) => [row.key, row.value])) as JsonRecord;
  } catch (error) {
    if (!isMissingDatabaseError(error)) throw error;
    return (fallbackData.content ?? {}) as JsonRecord;
  }
}

export async function updateSiteContent(updates: JsonRecord) {
  for (const [key, value] of Object.entries(updates)) {
    await query(
      `insert into site_content (key, value, updated_at)
       values ($1, $2::jsonb, now())
       on conflict (key) do update set value = excluded.value, updated_at = now()`,
      [key, JSON.stringify(value)],
    );
  }
  return getSiteContent();
}

export async function saveContactMessage(message: JsonRecord) {
  const rows = await query(
    `insert into contact_messages (name, email, phone, subject, message)
     values ($1, $2, $3, $4, $5)
     returning id, created_at`,
    [
      message.name ?? null,
      message.email ?? null,
      message.phone ?? null,
      message.subject ?? null,
      message.message ?? null,
    ],
  );
  return numberId(rows[0]) as { id: number; created_at: string };
}
