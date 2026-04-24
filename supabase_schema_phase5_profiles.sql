-- Phase 5: User Profiles and Saved Shortlists (Favorites)

-- 1. Create user_favorites table
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id uuid default gen_random_uuid() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    venue_id text, -- string ID referencing the venue
    vendor_id text, -- string ID referencing the vendor
    item_type text not null check (item_type in ('venue', 'vendor')),
    item_data jsonb not null, -- Stores snapshot of venue/vendor for quick rendering in profile
    created_at timestamp with time zone default now(),
    
    -- Ensure a user can only favorite a specific venue or vendor once
    UNIQUE(user_id, venue_id),
    UNIQUE(user_id, vendor_id)
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites" ON public.user_favorites FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can insert own favorites" ON public.user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites" ON public.user_favorites FOR DELETE USING (auth.uid() = user_id);

-- 2. Update profiles table to capture standard consumer traits if not exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS planned_event_date date;
