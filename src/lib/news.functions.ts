import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export const getNewsStory = createServerFn({ method: "GET" })
  .inputValidator((id: number) => {
    if (!Number.isSafeInteger(id) || id < 1) throw new Error("Invalid story ID");
    return id;
  })
  .handler(async ({ data: id }) => {
    // Published server requests must use runtime configuration, not the
    // browser's preview database proxy or build-time VITE variables.
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["SUPABASE_ANON_KEY"];
    if (!url || !key) throw new Error("News service is temporarily unavailable.");
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_publishable_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      } },
    });
    const { data, error } = await client.from("press_room_items")
      .select("id,title,summary,description,category,document_name,link,created_at,has_image,has_document")
      .eq("category", "News").eq("id", id).maybeSingle();
    if (error) throw new Error("Unable to load this news story. Please try again.");
    if (!data) return null;
    return { id: Number(data.id), title: String(data.title), summary: String(data.summary),
      description: data.description as string | null, category: "News",
      image: data.has_image ? `/api/media/press/${id}` : null,
      document: data.has_document ? `/api/media/press-doc/${id}` : null,
      document_name: data.document_name as string | null, link: data.link as string | null,
      created_at: data.created_at as string };
  });