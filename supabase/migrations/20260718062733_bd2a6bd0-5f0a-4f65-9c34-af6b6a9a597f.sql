DROP POLICY IF EXISTS "public can read safe team_members columns" ON public.team_members;
REVOKE SELECT ON public.team_members FROM anon, authenticated;
GRANT SELECT ON public.public_team_members TO anon, authenticated;