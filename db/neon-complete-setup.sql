create table if not exists admin_users (
  id bigint generated always as identity primary key,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists team_members (
  id bigint generated always as identity primary key,
  name text not null,
  title text not null,
  email text,
  phone text,
  photo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists programs (
  id bigint generated always as identity primary key,
  title text not null,
  description text not null,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gallery_items (
  id bigint generated always as identity primary key,
  title text not null,
  image text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists press_room_items (
  id bigint generated always as identity primary key,
  title text not null,
  summary text not null,
  category text not null check (category in ('News', 'Publications', 'Jobs')),
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id bigint generated always as identity primary key,
  name text,
  email text,
  phone text,
  subject text,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists press_room_items_category_idx on press_room_items (category);
create index if not exists press_room_items_created_at_idx on press_room_items (created_at desc);
create unique index if not exists team_members_seed_unique_idx on team_members (name, title, coalesce(email, ''), coalesce(phone, ''), coalesce(photo, ''));
create unique index if not exists programs_seed_unique_idx on programs (title, description, coalesce(image, ''));
create unique index if not exists gallery_items_seed_unique_idx on gallery_items (title, image, coalesce(description, ''));
create unique index if not exists press_room_items_seed_unique_idx on press_room_items (title, summary, category, coalesce(image, ''));

insert into admin_users (email, password_hash)
values ('admin@uyisenganimanzi.org.rw', '75837f3cfd209cdf09f9ff4801fb70e0bd8ef99c9b275df5093fe5b0bfbf32e5')
on conflict (email) do update set password_hash = excluded.password_hash;

insert into team_members (name, title, email, phone, photo)
values
  ('Executive Director', 'Executive Director', 'info@uyisenganimanzi.org.rw', '+250 788 729 994', ''),
  ('Programs Manager', 'Programs Manager', 'info@uyisenganimanzi.org.rw', '', ''),
  ('Mental Health Lead', 'Psychosocial & Mental Health Lead', 'info@uyisenganimanzi.org.rw', '', ''),
  ('Child Protection Lead', 'Child Protection Lead', 'info@uyisenganimanzi.org.rw', '', ''),
  ('Economic Empowerment Lead', 'Economic Empowerment Lead', 'info@uyisenganimanzi.org.rw', '', ''),
  ('Finance & Admin', 'Finance & Administration', 'info@uyisenganimanzi.org.rw', '', '')
on conflict do nothing;

insert into programs (title, description, image)
values
  ('Child Protection Program', 'Ensuring the safety and well-being of children through various initiatives.', ''),
  ('Mental Health Support', 'Providing psychosocial support to youth and families.', ''),
  ('Economic Empowerment', 'Empowering communities through economic opportunities.', '')
on conflict do nothing;

insert into gallery_items (title, image, description)
values
  ('Community Event', '/assets/gallery/1.jpg', 'A community gathering.')
on conflict do nothing;

insert into press_room_items (title, summary, category, image)
values
  ('New psychosocial support group launches in Kigali', 'Uyisenga Ni Imanzi has opened a new support circle for youth focused on mental health, trauma recovery and peer connection.', 'News', '/assets/hero.jpg'),
  ('Youth entrepreneurship training begins', 'A new cohort of young entrepreneurs started hands-on business training and seed support in Rugando.', 'News', '/assets/programs.jpg'),
  ('Community healing event brings families together', 'Families from three districts gathered to celebrate resilience and rebuild hope through shared storytelling.', 'News', '/assets/hero.jpg')
on conflict do nothing;

insert into site_content (key, value)
values
  ('mission', '"Our mission is to support Rwandan children, youth, and families."'::jsonb),
  ('vision', '"A future where every child thrives."'::jsonb),
  ('impact', '"We have impacted thousands of lives."'::jsonb),
  ('contact', '{"email":"info@uyisenganimanzi.org.rw","phone":"+250 788 729 994","address":"Kacyiru, Kigali-Rwanda"}'::jsonb),
  ('programsPage', '{"label":"Our Programs","heading":"Uyisenga Ni Imanzi''s Programs","description1":"Since its establishment, Uyisenga Ni Imanzi has implemented various programs to support Rwandan children, youth, and families. Our work focuses on psychosocial support, education, livelihoods and community resilience.","description2":"Through our strategic initiatives, we empower vulnerable populations and foster sustainable development across Rwanda. We prioritize holistic support, community engagement, and evidence-based practices."}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();
