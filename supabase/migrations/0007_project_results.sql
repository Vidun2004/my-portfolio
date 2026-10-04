-- Case-study outcomes: one result per line in the editor.
alter table projects
  add column if not exists results text[] not null default '{}';
