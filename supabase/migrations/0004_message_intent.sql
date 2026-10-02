-- Contact intent for the mad-libs form.
alter table public.contact_messages
  add column if not exists intent text not null default 'build';
