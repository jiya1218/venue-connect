-- Phase 7: Comprehensive Venue Details Schema Expansion

-- Add highly detailed columns to the venues table to match the premium template

ALTER TABLE public.venues 
    ADD COLUMN IF NOT EXISTS room_starting_price integer,
    ADD COLUMN IF NOT EXISTS dj_available boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS dj_price integer,
    ADD COLUMN IF NOT EXISTS dj_tax integer,
    ADD COLUMN IF NOT EXISTS parking_capacity integer,
    ADD COLUMN IF NOT EXISTS payment_methods text[] DEFAULT '{"Cash", "Credit Card", "Net Banking"}',
    ADD COLUMN IF NOT EXISTS food_served text[] DEFAULT '{"Veg"}',
    ADD COLUMN IF NOT EXISTS usps text[],
    ADD COLUMN IF NOT EXISTS outside_liquor_permitted boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS license_required_price integer,
    ADD COLUMN IF NOT EXISTS corkage_charges integer,
    ADD COLUMN IF NOT EXISTS booking_policy text,
    ADD COLUMN IF NOT EXISTS cancellation_policy text,
    ADD COLUMN IF NOT EXISTS nearest_landmark text,
    ADD COLUMN IF NOT EXISTS nearest_airport text,
    ADD COLUMN IF NOT EXISTS nearest_bus_stand text,
    ADD COLUMN IF NOT EXISTS policy_terms text,
    ADD COLUMN IF NOT EXISTS disclaimer text;
