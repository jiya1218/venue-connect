-- ============================================================
-- VENUECONNECT - COMPLETE DATABASE SETUP SCRIPT
-- Run this ENTIRE file in Supabase SQL Editor at once.
-- Go to: Supabase Dashboard > SQL Editor > New Query
-- Paste this entire file and click "Run"
-- ============================================================

-- ============================================================
-- STEP 1: EXTENSIONS & TYPES
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'owner', 'admin');
    END IF;
END $$;

-- ============================================================
-- STEP 2: PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    avatar_url text,
    role user_role default 'user',
    phone_number text,
    planned_event_date date,
    created_at timestamp with time zone default now()
);

-- ============================================================
-- STEP 3: VENUES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.venues (
    id uuid not null default gen_random_uuid() primary key,
    created_at timestamp with time zone not null default now(),
    name text not null,
    city text,
    location text,
    address text,
    type text,
    rating numeric default 0,
    reviews integer default 0,
    image text,
    images text[],
    owner_id uuid references public.profiles(id) on delete set null,
    min_capacity integer default 0,
    max_capacity integer default 0,
    rooms_count integer default 0,
    veg_price_per_plate integer default 0,
    nonveg_price_per_plate integer default 0,
    has_ac boolean default false,
    has_wifi boolean default false,
    alcohol_served boolean default false,
    cuisines text[],
    indoor_spaces integer default 0,
    outdoor_spaces integer default 0,
    payment_methods text[],
    catering_policy text,
    advance_payment_percentage integer,
    operating_hours text,
    amenities text[],
    starting_price integer default 0,
    description text
);

-- ============================================================
-- STEP 4: VENDORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vendors (
    id uuid not null default gen_random_uuid() primary key,
    created_at timestamp with time zone not null default now(),
    name text not null,
    city text,
    location text,
    address text,
    category text,
    rating numeric default 0,
    reviews integer default 0,
    image text,
    images text[],
    logo_url text,
    owner_id uuid references public.profiles(id) on delete set null,
    starting_price integer default 0,
    description text
);

-- ============================================================
-- STEP 5: VENUE APPLICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.venue_applications (
    id uuid not null default gen_random_uuid() primary key,
    created_at timestamp with time zone not null default now(),
    business_name text not null,
    contact_person text not null,
    business_email text not null,
    business_phone text not null,
    address text not null,
    city text not null,
    venue_type text not null,
    capacity integer,
    price_per_plate integer,
    amenities text[],
    description text,
    image_url text,
    status text default 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    user_id uuid references public.profiles(id) on delete set null,
    min_capacity integer,
    max_capacity integer,
    rooms_count integer,
    veg_price_per_plate integer,
    nonveg_price_per_plate integer,
    has_ac boolean default false,
    has_wifi boolean default false,
    cuisines text[],
    indoor_spaces integer default 0,
    outdoor_spaces integer default 0,
    payment_methods text[],
    catering_policy text,
    advance_payment_percentage integer,
    operating_hours text,
    alcohol_served boolean default false,
    images text[],
    vendor_category text
);

-- ============================================================
-- STEP 6: LEADS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id uuid not null default gen_random_uuid() primary key,
    created_at timestamp with time zone not null default now(),
    listing_id uuid not null,
    listing_type text not null CHECK (listing_type IN ('venue', 'vendor')),
    owner_id uuid references public.profiles(id) on delete cascade,
    customer_name text not null,
    customer_email text not null,
    customer_phone text,
    event_date date,
    message text,
    status text default 'new' CHECK (status IN ('new', 'contacted', 'closed'))
);

-- ============================================================
-- STEP 7: VENUE LEADS TABLE (for contact forms)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.venue_leads (
    id uuid not null default gen_random_uuid() primary key,
    created_at timestamp with time zone not null default now(),
    venue_name text not null,
    event_date text not null,
    guest_count integer not null,
    name text not null,
    phone text not null,
    email text not null,
    requirements text,
    status text default 'new'
);

-- ============================================================
-- STEP 8: USER FAVORITES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id uuid not null default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade,
    listing_id uuid not null,
    listing_type text not null,
    created_at timestamp with time zone default now(),
    UNIQUE(user_id, listing_id)
);

-- ============================================================
-- STEP 9: ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Profiles: Users manage their own
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Venues: Public read, owners/admins write
DROP POLICY IF EXISTS "Public venues are viewable by everyone" ON public.venues;
CREATE POLICY "Public venues are viewable by everyone" ON public.venues FOR SELECT USING (true);
DROP POLICY IF EXISTS "Owners can insert venues" ON public.venues;
CREATE POLICY "Owners can insert venues" ON public.venues FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Owners can update own venues" ON public.venues;
CREATE POLICY "Owners can update own venues" ON public.venues FOR UPDATE USING (auth.uid() = owner_id);

-- Vendors: Public read, owners/admins write
DROP POLICY IF EXISTS "Public vendors are viewable by everyone" ON public.vendors;
CREATE POLICY "Public vendors are viewable by everyone" ON public.vendors FOR SELECT USING (true);
DROP POLICY IF EXISTS "Owners can insert vendors" ON public.vendors;
CREATE POLICY "Owners can insert vendors" ON public.vendors FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Owners can update own vendors" ON public.vendors;
CREATE POLICY "Owners can update own vendors" ON public.vendors FOR UPDATE USING (auth.uid() = owner_id);

-- Venue Applications: Anyone can insert, users see own, admins see all
DROP POLICY IF EXISTS "Anyone can insert venue applications" ON public.venue_applications;
CREATE POLICY "Anyone can insert venue applications" ON public.venue_applications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view own applications" ON public.venue_applications;
CREATE POLICY "Users can view own applications" ON public.venue_applications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view all applications" ON public.venue_applications;
CREATE POLICY "Admins can view all applications" ON public.venue_applications FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can update all applications" ON public.venue_applications;
CREATE POLICY "Admins can update all applications" ON public.venue_applications FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Leads
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Owners can view own leads" ON public.leads;
CREATE POLICY "Owners can view own leads" ON public.leads FOR SELECT USING (auth.uid() = owner_id);
DROP POLICY IF EXISTS "Owners can update own leads" ON public.leads;
CREATE POLICY "Owners can update own leads" ON public.leads FOR UPDATE USING (auth.uid() = owner_id);
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
CREATE POLICY "Admins can view all leads" ON public.leads FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Venue Leads (contact forms)
DROP POLICY IF EXISTS "Allow public inserts to venue_leads" ON public.venue_leads;
CREATE POLICY "Allow public inserts to venue_leads" ON public.venue_leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow read access for authenticated users for leads" ON public.venue_leads;
CREATE POLICY "Allow read access for authenticated users for leads" ON public.venue_leads FOR SELECT TO authenticated USING (true);

-- Favorites
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.user_favorites;
CREATE POLICY "Users can manage own favorites" ON public.user_favorites FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- STEP 10: AUTH TRIGGER (create profile on signup)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- STEP 11: DEMO VENUES DATA
-- ============================================================
INSERT INTO public.venues (name, city, location, address, type, rating, reviews, image, images, min_capacity, max_capacity, veg_price_per_plate, nonveg_price_per_plate, has_ac, has_wifi, description)
VALUES
(
    'The Grand Rajwada',
    'Ahmedabad',
    'Ahmedabad, Gujarat',
    'SG Highway, Prahlad Nagar, Ahmedabad',
    'Banquet Hall',
    4.8,
    124,
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80'],
    200, 1500, 800, 1200, true, true,
    'A stunning 5-star banquet hall with traditional Rajputana architecture, perfect for grand weddings and corporate events.'
),
(
    'Surat Palace Convention Center',
    'Surat',
    'Surat, Gujarat',
    'Ring Road, Vesu, Surat',
    'Convention Center',
    4.5,
    89,
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80'],
    300, 2000, 700, 1100, true, true,
    'Modern convention center with world-class facilities, ideal for large weddings and corporate gatherings.'
),
(
    'Vadodara Heritage Gardens',
    'Vadodara',
    'Vadodara, Gujarat',
    'Alkapuri, Vadodara',
    'Garden',
    4.6,
    67,
    'https://images.unsplash.com/photo-1578774204375-826dc5d996ed?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1578774204375-826dc5d996ed?w=800&q=80'],
    100, 800, 600, 950, false, true,
    'Beautiful open-air garden venue surrounded by lush greenery, perfect for outdoor ceremonies and receptions.'
),
(
    'Rajkot Royal Resort',
    'Rajkot',
    'Rajkot, Gujarat',
    'Kalawad Road, Rajkot',
    'Resort',
    4.3,
    45,
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80'],
    150, 1000, 750, 1100, true, true,
    'Elegant resort venue with beautiful poolside settings and banquet halls for intimate to large celebrations.'
),
(
    'Gandhinagar City Club',
    'Gandhinagar',
    'Gandhinagar, Gujarat',
    'Sector 7, Gandhinagar',
    'Club',
    4.4,
    52,
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80'],
    50, 500, 900, 1300, true, true,
    'Premium city club with an intimate and modern setup, ideal for private celebrations and corporate events.'
),
(
    'Anand Lotus Banquet',
    'Anand',
    'Anand, Gujarat',
    'V. V. Nagar Road, Anand',
    'Banquet Hall',
    4.2,
    38,
    'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80'],
    200, 1200, 650, 950, true, false,
    'Spacious banquet hall in the heart of Anand city with catering services and full event management.'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- STEP 12: DEMO VENDORS DATA
-- ============================================================
INSERT INTO public.vendors (name, city, location, address, category, rating, reviews, image, images, starting_price, description)
VALUES
(
    'Lens & Light Photography',
    'Ahmedabad',
    'Ahmedabad, Gujarat',
    'Navrangpura, Ahmedabad',
    'Photographers',
    4.9,
    210,
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80'],
    25000,
    'Award-winning wedding photography studio with over 10 years of experience capturing beautiful moments.'
),
(
    'Glamour Makeup Studio',
    'Surat',
    'Surat, Gujarat',
    'Athwa Gate, Surat',
    'Makeup Artists',
    4.7,
    145,
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80'],
    8000,
    'Professional bridal makeup studio specializing in traditional and contemporary bridal looks.'
),
(
    'Dream Decorators',
    'Vadodara',
    'Vadodara, Gujarat',
    'Alkapuri, Vadodara',
    'Decorators',
    4.6,
    98,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80'],
    50000,
    'Creative event decoration specialists with expertise in floral arrangements and themed setups.'
),
(
    'Spice Route Caterers',
    'Ahmedabad',
    'Ahmedabad, Gujarat',
    'Maninagar, Ahmedabad',
    'Caterers',
    4.8,
    189,
    'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80'],
    550,
    'Premium catering service offering authentic Gujarati and multi-cuisine menus for all events.'
),
(
    'Rhythm DJ & Events',
    'Rajkot',
    'Rajkot, Gujarat',
    'Kalawad Road, Rajkot',
    'Bands',
    4.5,
    76,
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80'],
    15000,
    'Professional DJ and sound system provider for weddings, receptions, and corporate events.'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- DONE!
-- After running this script:
-- 1. Verify tables are created in Database > Tables
-- 2. Go to your website to see venues and vendors appear
-- 3. Create an admin user in the Auth section and set their role to 'admin' by running:
--    UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_UUID';
-- ============================================================
