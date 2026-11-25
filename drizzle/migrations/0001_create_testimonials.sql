CREATE TABLE public.testimonials (
  id bigint generated always as identity primary key,
  name text not null,
  role text,
  quote text,
  video_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny direct testimonials access" ON public.testimonials FOR SELECT TO anon, authenticated USING (false);