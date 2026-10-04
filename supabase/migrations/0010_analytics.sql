-- Privacy-first analytics. Raw IPs are never stored; consented visitors
-- are identified by a random first-party cookie id, everyone else is
-- counted anonymously (visitor_id null).
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text not null default '',
  country text not null default 'unknown',
  device text not null default 'desktop',
  visitor_id text,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  target text not null default '',
  visitor_id text,
  created_at timestamptz not null default now()
);

alter table page_views enable row level security;
alter table events enable row level security;
-- No public policies: writes go through the /api/track route (service
-- role), reads through admin pages (service role). Deny by default.

create index if not exists page_views_created_idx on page_views (created_at desc);
create index if not exists page_views_path_idx on page_views (path);
create index if not exists events_created_idx on events (created_at desc);
create index if not exists events_type_idx on events (type);
