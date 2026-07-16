
-- team_members: expose only non-sensitive columns publicly via a view; keep base table locked.
CREATE OR REPLACE VIEW public.public_team_members
WITH (security_invoker = true) AS
SELECT id, name, title, photo, created_at, updated_at
FROM public.team_members;

GRANT SELECT ON public.public_team_members TO anon, authenticated;

-- Allow the base table to be read through the security_invoker view (columns limited to safe ones).
DROP POLICY IF EXISTS "public can read safe team_members columns" ON public.team_members;
CREATE POLICY "public can read safe team_members columns"
ON public.team_members
FOR SELECT
TO anon, authenticated
USING (true);

-- Revoke direct table SELECT so anon/authenticated must go through the view (which excludes email/phone).
REVOKE SELECT ON public.team_members FROM anon, authenticated;
GRANT SELECT (id, name, title, photo, created_at, updated_at) ON public.team_members TO anon, authenticated;

-- contact_messages: add an explicit, documented admin read path via the trusted server role.
DROP POLICY IF EXISTS "service role can read contact messages" ON public.contact_messages;
CREATE POLICY "service role can read contact messages"
ON public.contact_messages
FOR SELECT
TO service_role
USING (true);

GRANT SELECT, DELETE ON public.contact_messages TO service_role;
