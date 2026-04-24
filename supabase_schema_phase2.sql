-- Phase 2: Role Management, Admin Approvals, and Lead Generation

-- 1. Add roles to profiles (assuming profiles table exists from standard Supabase Auth)
-- Create custom type for user roles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'owner', 'admin');
    END IF;
END $$;

-- If 'profiles' table exists, add 'role' column. 
-- Since we are altering, we check if it exists or create it.
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';
    ELSE
        -- Fallback: create profiles table
        CREATE TABLE public.profiles (
            id uuid references auth.users on delete cascade primary key,
            full_name text,
            avatar_url text,
            role user_role default 'user',
            created_at timestamp with time zone default now()
        );
    END IF;
END $$;

-- 2. Update venue_applications
-- Add user_id to link to the user who applied, and status to track approval
ALTER TABLE public.venue_applications 
ADD COLUMN IF NOT EXISTS user_id uuid references public.profiles(id) on delete set null,
ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending';

-- 3. Update venues and vendors table linking to owner
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS owner_id uuid references public.profiles(id) on delete set null;

ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS owner_id uuid references public.profiles(id) on delete set null;

-- 4. Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id uuid default gen_random_uuid() primary key,
    listing_id uuid not null, -- The ID of the venue or vendor
    listing_type text not null CHECK (listing_type IN ('venue', 'vendor')),
    owner_id uuid references public.profiles(id) on delete cascade,
    customer_name text not null,
    customer_email text not null,
    customer_phone text,
    event_date date,
    message text,
    status text CHECK (status IN ('new', 'contacted', 'closed')) DEFAULT 'new',
    created_at timestamp with time zone default now()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Leads policies
-- Anyone can insert a lead (public)
CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);
-- Owners can view their own leads
CREATE POLICY "Owners can view own leads" ON public.leads FOR SELECT USING (auth.uid() = owner_id);
-- Owners can update own leads (change status)
CREATE POLICY "Owners can update own leads" ON public.leads FOR UPDATE USING (auth.uid() = owner_id);
-- Admins can view all leads
CREATE POLICY "Admins can view all leads" ON public.leads FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Venue Applications policies
-- Anyone (authenticated or not, for now, or just authenticated) can insert
CREATE POLICY "Anyone can insert venue applications" ON public.venue_applications FOR INSERT WITH CHECK (true);
-- Users can view their own applications
CREATE POLICY "Users can view own applications" ON public.venue_applications FOR SELECT USING (auth.uid() = user_id);
-- Admins can view and update all applications
CREATE POLICY "Admins can view all applications" ON public.venue_applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all applications" ON public.venue_applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Profiles policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Make venues/vendors public to view
-- Assuming public read policies might already exist, but ensuring it:
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'venues' AND policyname = 'Public venues are viewable by everyone'
    ) THEN
        CREATE POLICY "Public venues are viewable by everyone" ON public.venues FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'vendors' AND policyname = 'Public vendors are viewable by everyone'
    ) THEN
        CREATE POLICY "Public vendors are viewable by everyone" ON public.vendors FOR SELECT USING (true);
    END IF;
END $$;
