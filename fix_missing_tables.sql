-- Create missing 'enquiries' table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    occasion TEXT,
    city TEXT,
    location TEXT,
    event_date TEXT,
    guests TEXT,
    budget TEXT,
    customer_name TEXT,
    customer_email TEXT,
    customer_mobile TEXT,
    meal_type TEXT,
    drink_type TEXT,
    other_services TEXT,
    status TEXT DEFAULT 'new',
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL
);

-- Create missing 'user_requirements' table (for the Wizard)
CREATE TABLE IF NOT EXISTS public.user_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    occasion TEXT,
    guests TEXT,
    budget TEXT,
    event_date TEXT,
    city TEXT,
    preferences JSONB DEFAULT '{}'
);

-- Create missing 'reviews' table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    entity_id UUID NOT NULL, -- venue_id or vendor_id
    entity_type TEXT NOT NULL, -- 'venue' or 'vendor'
    author_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    body TEXT,
    is_approved BOOLEAN DEFAULT true
);

-- Add missing columns to vendors table if it exists
DO $$ 
BEGIN 
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vendors') THEN
        ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS starting_price INTEGER DEFAULT 0;
        ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS price_per_plate INTEGER DEFAULT 0;
    END IF;
END $$;

-- Enable RLS for new tables
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies for public submissions
CREATE POLICY "Allow public insert" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON public.user_requirements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON public.reviews FOR SELECT USING (true);

-- Policies for authenticated reads
CREATE POLICY "Allow read access to authenticated users for enquiries" ON public.enquiries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users for user_requirements" ON public.user_requirements FOR SELECT TO authenticated USING (true);
