-- Migration for Pricing Plans and Detailed Venue Information

-- 1. Update Venues table with new detailed fields
ALTER TABLE venues ADD COLUMN IF NOT EXISTS food_type TEXT DEFAULT 'both'; -- 'veg', 'non-veg', 'both'
ALTER TABLE venues ADD COLUMN IF NOT EXISTS space_info JSONB DEFAULT '{"party_halls": 0, "banquet_halls": 0, "rooms": 0, "outdoor_lawn": 0}';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS occasions TEXT[]; -- Array of occasions like ['Wedding', 'Birthday']
ALTER TABLE venues ADD COLUMN IF NOT EXISTS decoration_info JSONB DEFAULT '{"description": "", "policy": ""}';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS liquor_info JSONB DEFAULT '{"served": false, "permitted": false}';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS dj_info JSONB DEFAULT '{"available": false, "starting_price": 0}';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS catering_policy TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS booking_policy TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS terms_conditions TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS parking_details JSONB DEFAULT '{"count": 0, "valet": false}';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS area TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS auto_summary TEXT;

-- 1.1 Update venue_applications table to match
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS area TEXT;
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS min_capacity INTEGER DEFAULT 0;
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS max_capacity INTEGER DEFAULT 0;
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS food_type TEXT DEFAULT 'both';
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS veg_price_per_plate INTEGER DEFAULT 0;
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS nonveg_price_per_plate INTEGER DEFAULT 0;
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS rooms_count INTEGER DEFAULT 0;
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS space_info JSONB DEFAULT '{"party_halls": 0, "banquet_halls": 0, "rooms": 0, "outdoor_lawn": 0}';
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS occasions TEXT[];
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS decoration_info JSONB DEFAULT '{"description": "", "policy": ""}';
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS liquor_info JSONB DEFAULT '{"served": "No", "permitted": "No"}';
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS dj_info JSONB DEFAULT '{"available": "No", "starting_price": 0}';
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS catering_policy TEXT;
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS booking_policy TEXT;
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS terms_conditions TEXT;
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS parking_details JSONB DEFAULT '{"count": 0, "valet": false}';
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS amenities TEXT[];
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS cuisines TEXT[];
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS selected_plan TEXT DEFAULT 'Starter';
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE venue_applications ADD COLUMN IF NOT EXISTS vendor_category TEXT;

-- 2. Add Plan Tracking to Venues and Vendors
ALTER TABLE venues ADD COLUMN IF NOT EXISTS selected_plan TEXT DEFAULT 'Starter';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS leads_used INTEGER DEFAULT 0;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS leads_quota INTEGER DEFAULT 50;

ALTER TABLE vendors ADD COLUMN IF NOT EXISTS selected_plan TEXT DEFAULT 'Starter';
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS leads_used INTEGER DEFAULT 0;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS leads_quota INTEGER DEFAULT 50;

-- 3. Create a table for Edit Approvals (Contact/Package changes)
CREATE TABLE IF NOT EXISTS edit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL,
    listing_type TEXT NOT NULL, -- 'venue' or 'vendor'
    field_name TEXT NOT NULL, -- 'contact_email', 'package_details', etc.
    old_value TEXT,
    new_value TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Function to increment leads and check quota (can be used via RPC)
CREATE OR REPLACE FUNCTION increment_leads(l_id UUID, l_type TEXT) 
RETURNS VOID AS $$
BEGIN
    IF l_type = 'venue' THEN
        UPDATE venues SET leads_used = leads_used + 1 WHERE id = l_id;
    ELSE
        UPDATE vendors SET leads_used = leads_used + 1 WHERE id = l_id;
    END IF;
END;
$$ LANGUAGE plpgsql;
