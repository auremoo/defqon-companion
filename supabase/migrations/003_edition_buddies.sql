-- Track which friends are attending each edition together
create table public.edition_buddies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  friend_id uuid references public.profiles(id) on delete cascade not null,
  edition_year int not null,
  created_at timestamptz default now() not null,
  unique (user_id, friend_id, edition_year)
);

alter table public.edition_buddies enable row level security;

create policy "Users can view own edition buddies"
  on public.edition_buddies for select
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can manage own edition buddies"
  on public.edition_buddies for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own edition buddies"
  on public.edition_buddies for delete
  using (auth.uid() = user_id);

alter publication supabase_realtime add table public.edition_buddies;
