-- Social proof quotes for the homepage strip.
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  quote text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table testimonials enable row level security;

create policy "public read testimonials"
  on public.testimonials for select to anon, authenticated using (true);
