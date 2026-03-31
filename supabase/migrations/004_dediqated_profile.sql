-- Add Defqon username and Dediqated status to profiles
alter table public.profiles
  add column defqon_username text,
  add column is_dediqated boolean default false not null;
