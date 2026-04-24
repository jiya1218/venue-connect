-- Create table for User Favorites
create table
  public.user_favorites (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    user_id uuid not null references auth.users (id) on delete cascade,
    venue_id character varying not null, -- we use string IDs for venues in our mock data currently
    venue_data jsonb not null, -- Store the venue data so we can display it even if the venue changes in our mock frontend
    constraint user_favorites_pkey primary key (id),
    constraint user_favorites_user_id_venue_id_key unique (user_id, venue_id)
  );

-- Enable RLS
alter table public.user_favorites enable row level security;

-- Policies
create policy "Users can insert their own favorites" on public.user_favorites for insert with check (auth.uid() = user_id);
create policy "Users can view their own favorites" on public.user_favorites for select using (auth.uid() = user_id);
create policy "Users can delete their own favorites" on public.user_favorites for delete using (auth.uid() = user_id);
