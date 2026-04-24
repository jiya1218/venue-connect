-- Phase 3: Advanced Venue Listing Schema Updates

-- 1. Updates to venue_applications table
ALTER TABLE public.venue_applications
ADD COLUMN IF NOT EXISTS min_capacity integer,
ADD COLUMN IF NOT EXISTS max_capacity integer,
ADD COLUMN IF NOT EXISTS rooms_count integer,
ADD COLUMN IF NOT EXISTS veg_price_per_plate integer,
ADD COLUMN IF NOT EXISTS nonveg_price_per_plate integer,
ADD COLUMN IF NOT EXISTS has_ac boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_wifi boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS cuisines text[],
ADD COLUMN IF NOT EXISTS indoor_spaces integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS outdoor_spaces integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_methods text[],
ADD COLUMN IF NOT EXISTS catering_policy text,
ADD COLUMN IF NOT EXISTS advance_payment_percentage integer,
ADD COLUMN IF NOT EXISTS operating_hours text,
ADD COLUMN IF NOT EXISTS alcohol_served boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS images text[],
ADD COLUMN IF NOT EXISTS amenities text[];

-- 2. Updates to venues table
ALTER TABLE public.venues
ADD COLUMN IF NOT EXISTS min_capacity integer,
ADD COLUMN IF NOT EXISTS max_capacity integer,
ADD COLUMN IF NOT EXISTS rooms_count integer,
ADD COLUMN IF NOT EXISTS veg_price_per_plate integer,
ADD COLUMN IF NOT EXISTS nonveg_price_per_plate integer,
ADD COLUMN IF NOT EXISTS has_ac boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_wifi boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS cuisines text[],
ADD COLUMN IF NOT EXISTS indoor_spaces integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS outdoor_spaces integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_methods text[],
ADD COLUMN IF NOT EXISTS catering_policy text,
ADD COLUMN IF NOT EXISTS advance_payment_percentage integer,
ADD COLUMN IF NOT EXISTS operating_hours text,
ADD COLUMN IF NOT EXISTS alcohol_served boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS images text[],
ADD COLUMN IF NOT EXISTS amenities text[];

-- 3. Updates to vendors table
ALTER TABLE public.vendors
ADD COLUMN IF NOT EXISTS min_capacity integer,
ADD COLUMN IF NOT EXISTS max_capacity integer,
ADD COLUMN IF NOT EXISTS rooms_count integer,
ADD COLUMN IF NOT EXISTS veg_price_per_plate integer,
ADD COLUMN IF NOT EXISTS nonveg_price_per_plate integer,
ADD COLUMN IF NOT EXISTS has_ac boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_wifi boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS cuisines text[],
ADD COLUMN IF NOT EXISTS indoor_spaces integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS outdoor_spaces integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_methods text[],
ADD COLUMN IF NOT EXISTS catering_policy text,
ADD COLUMN IF NOT EXISTS advance_payment_percentage integer,
ADD COLUMN IF NOT EXISTS operating_hours text,
ADD COLUMN IF NOT EXISTS alcohol_served boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS images text[],
ADD COLUMN IF NOT EXISTS amenities text[];
