-- Add edition year to timetable entries
alter table public.timetable_entries
  add column edition_year int default 2026 not null;

-- Add attended flag for post-festival history
alter table public.timetable_entries
  add column attended boolean default false not null;

-- Drop old unique constraint and add new one with edition_year
alter table public.timetable_entries
  drop constraint timetable_entries_user_id_set_id_key;

alter table public.timetable_entries
  add constraint timetable_entries_user_id_set_id_edition_key
  unique (user_id, set_id, edition_year);

-- User festival history / memories
create table public.user_editions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  edition_year int not null,
  attended_festival boolean default false not null,
  notes text,
  rating int check (rating >= 1 and rating <= 5),
  created_at timestamptz default now() not null,
  unique (user_id, edition_year)
);

alter table public.user_editions enable row level security;

create policy "Users can view own edition history"
  on public.user_editions for select
  using (auth.uid() = user_id);

create policy "Users can manage own edition history"
  on public.user_editions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own edition history"
  on public.user_editions for update
  using (auth.uid() = user_id);

-- Friends can see each other's edition attendance
create policy "Friends can view edition history"
  on public.user_editions for select
  using (
    exists (
      select 1 from public.friendships
      where status = 'accepted'
      and (
        (requester_id = auth.uid() and addressee_id = user_editions.user_id)
        or (addressee_id = auth.uid() and requester_id = user_editions.user_id)
      )
    )
  );

alter publication supabase_realtime add table public.user_editions;
