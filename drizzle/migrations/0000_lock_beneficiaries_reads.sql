DROP POLICY IF EXISTS "public read beneficiaries" ON public.beneficiaries;
REVOKE SELECT ON public.beneficiaries FROM anon, authenticated;
GRANT ALL ON public.beneficiaries TO service_role;
CREATE POLICY "deny direct beneficiaries reads" ON public.beneficiaries FOR SELECT TO anon, authenticated USING (false);