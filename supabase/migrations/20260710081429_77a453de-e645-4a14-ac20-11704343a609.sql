
create table if not exists public.admin_users (
  id bigint generated always as identity primary key,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);
grant select on public.admin_users to service_role;
grant all on public.admin_users to service_role;
alter table public.admin_users enable row level security;

create table if not exists public.team_members (
  id bigint generated always as identity primary key,
  name text not null,
  title text not null,
  email text,
  phone text,
  photo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.team_members to anon, authenticated;
grant all on public.team_members to service_role;
alter table public.team_members enable row level security;
create policy "team public read" on public.team_members for select to anon, authenticated using (true);

create table if not exists public.programs (
  id bigint generated always as identity primary key,
  title text not null,
  description text not null,
  long_description text,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.programs to anon, authenticated;
grant all on public.programs to service_role;
alter table public.programs enable row level security;
create policy "programs public read" on public.programs for select to anon, authenticated using (true);

create table if not exists public.gallery_items (
  id bigint generated always as identity primary key,
  title text not null,
  image text not null,
  description text,
  category text,
  link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.gallery_items to anon, authenticated;
grant all on public.gallery_items to service_role;
alter table public.gallery_items enable row level security;
create policy "gallery public read" on public.gallery_items for select to anon, authenticated using (true);

create table if not exists public.press_room_items (
  id bigint generated always as identity primary key,
  title text not null,
  summary text not null,
  description text,
  category text not null check (category in ('News','Publications','Jobs')),
  image text,
  document text,
  document_name text,
  link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.press_room_items to anon, authenticated;
grant all on public.press_room_items to service_role;
alter table public.press_room_items enable row level security;
create policy "press public read" on public.press_room_items for select to anon, authenticated using (true);

create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
grant select on public.site_content to anon, authenticated;
grant all on public.site_content to service_role;
alter table public.site_content enable row level security;
create policy "site content public read" on public.site_content for select to anon, authenticated using (true);

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text,
  email text,
  phone text,
  subject text,
  message text,
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "anyone can send contact" on public.contact_messages for insert to anon, authenticated with check (true);
