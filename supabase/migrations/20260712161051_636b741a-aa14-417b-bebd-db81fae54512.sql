
DROP POLICY IF EXISTS "public can submit contact messages" ON public.contact_messages;
CREATE POLICY "public can submit contact messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    message IS NOT NULL
    AND length(btrim(message)) BETWEEN 1 AND 5000
    AND (
      (name IS NOT NULL AND length(btrim(name)) > 0)
      OR (email IS NOT NULL AND length(btrim(email)) > 0)
    )
  );
