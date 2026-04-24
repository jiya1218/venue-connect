-- MARKETPLACE SYNC V5: ADD MISSING COLUMNS FOR ADMIN PANEL & LISTING FILTERS
-- Run this script in your Supabase SQL Editor to sync your database with the latest codebase.

-- 1. UPGRADE VENUES TABLE
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.0,
ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;

-- 2. UPGRADE VENDORS TABLE
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.0,
ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS starting_price INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 3. ENSURE PROFILE ROLES
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'owner', 'admin');
    END IF;
END $$;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';

-- 4. UPDATE RLS FOR ADMIN ACCESS
-- Standard public read for approved listings
DROP POLICY IF EXISTS "public_read_venues" ON venues;
CREATE POLICY "public_read_venues" ON venues
FOR SELECT USING (is_active = true AND is_approved = true);

DROP POLICY IF EXISTS "public_read_vendors" ON vendors;
CREATE POLICY "public_read_vendors" ON vendors
FOR SELECT USING (is_active = true AND is_approved = true);

-- Enable all for owners
DROP POLICY IF EXISTS "owner_manage_venues" ON venues;
CREATE POLICY "owner_manage_venues" ON venues
FOR ALL USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "owner_manage_vendors" ON vendors;
CREATE POLICY "owner_manage_vendors" ON vendors
FOR ALL USING (auth.uid() = owner_id);
