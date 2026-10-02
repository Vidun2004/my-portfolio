-- About + site settings (single-row about, key/value settings).
create table if not exists public.about (
  id uuid primary key default gen_random_uuid(),
  headline text not null default '',
  bio text not null default '',
  interests text[] not null default '{}',
  currently_building text not null default '',
  currently_learning text not null default '',
  likes text[] not null default '{}',
  profile_image_url text,
  location text not null default '',
  availability boolean not null default true,
  email text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null default ''
);

alter table public.about enable row level security;
alter table public.site_settings enable row level security;

create policy "public read about"
  on public.about for select to anon, authenticated using (true);

create policy "public read settings"
  on public.site_settings for select to anon, authenticated using (true);

-- seed once
insert into public.about (headline, bio, currently_building, currently_learning, likes, location, availability, email)
select
  'Who''s behind the code?',
  'vidun — software engineering student. human. ships software.',
  'production applications',
  'AI · systems · game dev',
  array['clean architecture', 'good ux', 'automation'],
  'Sri Lanka',
  true,
  'hello@vidun.dev'
where not exists (select 1 from public.about);

insert into public.site_settings (key, value) values
  ('site_name', 'VIDUN.DEV'),
  ('tagline', 'Software Engineering student building web applications, mobile apps, systems and experimental products.'),
  ('email', 'hello@vidun.dev'),
  ('github_url', 'https://github.com'),
  ('linkedin_url', 'https://linkedin.com')
on conflict (key) do nothing;
