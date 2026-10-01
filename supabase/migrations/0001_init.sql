-- Portfolio V1 core schema.
-- Run in Supabase SQL editor (or supabase db push).
-- Mutations go through the service-role client after an admin auth check,
-- so public policies below are read/insert-only by design.

-- ---------- technologies ----------
create table if not exists public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null check (category in ('languages','frontend','backend','mobile','database','tools')),
  description text not null default '',
  level int not null default 50 check (level between 0 and 100),
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- projects ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  tagline text not null default '',
  description text not null default '',
  overview text not null default '',
  problem text not null default '',
  solution text not null default '',
  architecture text not null default '',
  challenges text not null default '',
  lessons text not null default '',
  hero_image_url text,
  github_url text,
  live_url text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_technologies (
  project_id uuid not null references public.projects(id) on delete cascade,
  technology_id uuid not null references public.technologies(id) on delete cascade,
  primary key (project_id, technology_id)
);

-- ---------- experiences ----------
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null default '',
  position text not null,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text not null default '',
  technologies text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- contact messages ----------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);

-- ---------- activity log ----------
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  actor text not null default 'admin',
  action text not null,
  entity text not null default '',
  entity_id text not null default '',
  created_at timestamptz not null default now()
);

-- ---------- RLS ----------
alter table public.technologies enable row level security;
alter table public.projects enable row level security;
alter table public.project_technologies enable row level security;
alter table public.experiences enable row level security;
alter table public.contact_messages enable row level security;
alter table public.activity_log enable row level security;

-- public read: published content only
create policy "public read technologies"
  on public.technologies for select to anon, authenticated using (true);

create policy "public read published projects"
  on public.projects for select to anon, authenticated using (status = 'published');

create policy "public read project technologies"
  on public.project_technologies for select to anon, authenticated using (true);

create policy "public read experiences"
  on public.experiences for select to anon, authenticated using (true);

-- contact form: anyone can insert, nobody can read via API
create policy "public insert messages"
  on public.contact_messages for insert to anon, authenticated with check (true);

-- activity log: no public access (service role only)
