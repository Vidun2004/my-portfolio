-- Project gallery: screenshot URLs (one per line in the editor).
alter table projects
  add column if not exists gallery_urls text[] not null default '{}';
