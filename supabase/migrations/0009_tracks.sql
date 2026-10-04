-- Featured playlist tracks (self-hosted MP3s in the audio/ folder).
create table if not exists tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null default '',
  audio_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table tracks enable row level security;

create policy "public read tracks"
  on public.tracks for select to anon, authenticated using (true);
