-- Portfolio media bucket (public read, service-role write).
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "public read portfolio"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio');
