-- V1 polish: per-bullet feature lists for case studies.
alter table public.projects
  add column if not exists features text[] not null default '{}';
