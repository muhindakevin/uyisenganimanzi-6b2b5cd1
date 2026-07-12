
-- Drop overly permissive policies
DROP POLICY IF EXISTS "anyone can send contact" ON public.contact_messages;
DROP POLICY IF EXISTS "contact delete" ON public.contact_messages;
DROP POLICY IF EXISTS "contact read" ON public.contact_messages;

DROP POLICY IF EXISTS "team public read" ON public.team_members;
DROP POLICY IF EXISTS "team write" ON public.team_members;

DROP POLICY IF EXISTS "programs public read" ON public.programs;
DROP POLICY IF EXISTS "programs write" ON public.programs;

DROP POLICY IF EXISTS "gallery public read" ON public.gallery_items;
DROP POLICY IF EXISTS "gallery write" ON public.gallery_items;

DROP POLICY IF EXISTS "press public read" ON public.press_room_items;
DROP POLICY IF EXISTS "press write" ON public.press_room_items;

DROP POLICY IF EXISTS "site content public read" ON public.site_content;
DROP POLICY IF EXISTS "site content write" ON public.site_content;

-- Ensure RLS is enabled everywhere
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_room_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for genuinely public content (no writes for anon/authenticated)
CREATE POLICY "public read programs" ON public.programs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read gallery" ON public.gallery_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read press" ON public.press_room_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);

-- team_members: public read of non-sensitive columns via a view
CREATE OR REPLACE VIEW public.team_members_public AS
  SELECT id, name, title, photo FROM public.team_members;
GRANT SELECT ON public.team_members_public TO anon, authenticated;

-- No public policies on team_members, contact_messages, admin_users.
-- All writes and sensitive reads happen server-side via the service role, which bypasses RLS.
