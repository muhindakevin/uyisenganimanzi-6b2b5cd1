
-- Ensure RLS is enabled everywhere
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_room_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- admin_users: revoke all Data API access; only service_role can touch it
REVOKE ALL ON public.admin_users FROM anon, authenticated;
GRANT ALL ON public.admin_users TO service_role;
DROP POLICY IF EXISTS "deny all admin_users access" ON public.admin_users;
CREATE POLICY "deny all admin_users access" ON public.admin_users
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

-- contact_messages: allow public INSERT, deny SELECT/UPDATE/DELETE to non-service roles
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
DROP POLICY IF EXISTS "public can submit contact messages" ON public.contact_messages;
CREATE POLICY "public can submit contact messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "deny read contact messages" ON public.contact_messages;
CREATE POLICY "deny read contact messages" ON public.contact_messages
  FOR SELECT TO anon, authenticated USING (false);

-- team_members: keep email/phone private; expose non-sensitive fields via view
REVOKE ALL ON public.team_members FROM anon, authenticated;
GRANT ALL ON public.team_members TO service_role;
DROP POLICY IF EXISTS "deny direct team_members access" ON public.team_members;
CREATE POLICY "deny direct team_members access" ON public.team_members
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

CREATE OR REPLACE VIEW public.team_members_public
  WITH (security_invoker = true) AS
  SELECT id, name, title, photo FROM public.team_members;
GRANT SELECT ON public.team_members_public TO anon, authenticated;

-- Content tables: public read already covered by existing SELECT policy; add explicit write denial
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['gallery_items','press_room_items','programs','site_content'] LOOP
    EXECUTE format('REVOKE INSERT, UPDATE, DELETE ON public.%I FROM anon, authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('DROP POLICY IF EXISTS "deny public writes %1$s" ON public.%1$I', t);
    EXECUTE format('CREATE POLICY "deny public writes %1$s" ON public.%1$I FOR INSERT TO anon, authenticated WITH CHECK (false)', t);
    EXECUTE format('DROP POLICY IF EXISTS "deny public updates %1$s" ON public.%1$I', t);
    EXECUTE format('CREATE POLICY "deny public updates %1$s" ON public.%1$I FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false)', t);
    EXECUTE format('DROP POLICY IF EXISTS "deny public deletes %1$s" ON public.%1$I', t);
    EXECUTE format('CREATE POLICY "deny public deletes %1$s" ON public.%1$I FOR DELETE TO anon, authenticated USING (false)', t);
  END LOOP;
END $$;
