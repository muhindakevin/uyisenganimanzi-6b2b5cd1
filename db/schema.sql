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
  category text not null default 'Event',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table gallery_items add column if not exists category text not null default 'Event';

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
