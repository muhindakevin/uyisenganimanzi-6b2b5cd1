import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export const getNewsStory = createServerFn({ method: "GET" })
  .inputValidator((id: number) => {
    if (!Number.isSafeInteger(id) || id < 1) throw new Error("Invalid story ID");
    return id;
  })
  .handler(async ({ data: id }) => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
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