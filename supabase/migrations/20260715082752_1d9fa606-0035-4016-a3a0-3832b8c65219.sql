
-- 1. sub_programs
CREATE TABLE public.sub_programs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  program_id BIGINT NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  image TEXT,
  cover_image TEXT,
  attachment_url TEXT,
  attachment_name TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sub_programs TO anon, authenticated;
GRANT ALL ON public.sub_programs TO service_role;
ALTER TABLE public.sub_programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read sub_programs" ON public.sub_programs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "deny public writes sub_programs" ON public.sub_programs FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "deny public updates sub_programs" ON public.sub_programs FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "deny public deletes sub_programs" ON public.sub_programs FOR DELETE TO anon, authenticated USING (false);
CREATE INDEX sub_programs_program_id_idx ON public.sub_programs(program_id);

-- 2. beneficiaries
CREATE TABLE public.beneficiaries (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  filled BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.beneficiaries TO anon, authenticated;
GRANT ALL ON public.beneficiaries TO service_role;
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read beneficiaries" ON public.beneficiaries FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "deny public writes beneficiaries" ON public.beneficiaries FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "deny public updates beneficiaries" ON public.beneficiaries FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "deny public deletes beneficiaries" ON public.beneficiaries FOR DELETE TO anon, authenticated USING (false);

-- 3. core_values
CREATE TABLE public.core_values (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.core_values TO anon, authenticated;
GRANT ALL ON public.core_values TO service_role;
ALTER TABLE public.core_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read core_values" ON public.core_values FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "deny public writes core_values" ON public.core_values FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "deny public updates core_values" ON public.core_values FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "deny public deletes core_values" ON public.core_values FOR DELETE TO anon, authenticated USING (false);

-- 4. Add cover_image / attachment fields to existing tables
ALTER TABLE public.programs
  ADD COLUMN IF NOT EXISTS cover_image TEXT,
  ADD COLUMN IF NOT EXISTS attachment_url TEXT,
  ADD COLUMN IF NOT EXISTS attachment_name TEXT;

ALTER TABLE public.press_room_items
  ADD COLUMN IF NOT EXISTS cover_image TEXT;

ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS cover_image TEXT,
  ADD COLUMN IF NOT EXISTS attachment_url TEXT,
  ADD COLUMN IF NOT EXISTS attachment_name TEXT;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_sub_programs_updated BEFORE UPDATE ON public.sub_programs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_beneficiaries_updated BEFORE UPDATE ON public.beneficiaries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_core_values_updated BEFORE UPDATE ON public.core_values FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
