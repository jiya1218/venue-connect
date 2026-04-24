-- Create table for Venue Reviews
create table
  public.venue_reviews (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    venue_id character varying not null, -- using string IDs for venues based on our mock data
    user_id uuid not null references auth.users (id) on delete cascade,
    user_name character varying not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text not null,
    constraint venue_reviews_pkey primary key (id)
  );

-- Enable RLS
alter table public.venue_reviews enable row level security;

-- Policies
-- Anyone can read reviews
create policy "Allow public read access to reviews" on public.venue_reviews for select using (true);

-- Only authenticated users can insert their own reviews
create policy "Users can insert their own reviews" on public.venue_reviews for insert with check (auth.uid() = user_id);

-- Only users can update their own reviews
create policy "Users can update their own reviews" on public.venue_reviews for update using (auth.uid() = user_id);

-- Only users can delete their own reviews
create policy "Users can delete their own reviews" on public.venue_reviews for delete using (auth.uid() = user_id);
