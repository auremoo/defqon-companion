-- Defqon Companion — Initial schema

-- User profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Friend requests / relationships
create table public.friendships (
  id uuid default gen_random_uuid() primary key,
  requester_id uuid references public.profiles(id) on delete cascade not null,
  addressee_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'declined')) default 'pending' not null,
  created_at timestamptz default now() not null,
  unique (requester_id, addressee_id)
);

alter table public.friendships enable row level security;

-- Friendship policies
create policy "Users can view their own friendships"
  on public.friendships for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "Users can send friend requests"
  on public.friendships for insert
  with check (auth.uid() = requester_id);

create policy "Users can update friendships addressed to them"
  on public.friendships for update
  using (auth.uid() = addressee_id);

create policy "Users can delete their own friendships"
  on public.friendships for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- User timetable entries (which sets a user wants to attend)
create table public.timetable_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  set_id text not null,
  created_at timestamptz default now() not null,
  unique (user_id, set_id)
);

alter table public.timetable_entries enable row level security;

-- Timetable policies
create policy "Users can view friends timetable entries"
  on public.timetable_entries for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.friendships
      where status = 'accepted'
      and (
        (requester_id = auth.uid() and addressee_id = timetable_entries.user_id)
        or (addressee_id = auth.uid() and requester_id = timetable_entries.user_id)
      )
    )
  );

create policy "Users can manage own timetable"
  on public.timetable_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own timetable entries"
  on public.timetable_entries for delete
  using (auth.uid() = user_id);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for auto-profile creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable realtime for timetable entries
alter publication supabase_realtime add table public.timetable_entries;
alter publication supabase_realtime add table public.friendships;
