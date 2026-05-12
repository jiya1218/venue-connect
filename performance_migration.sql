-- Performance Optimization Indexes for VenueConnect
-- Run this in your Supabase SQL Editor

-- 1. Optimize Venues Table
CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_slug ON venues(slug);
CREATE INDEX IF NOT EXISTS idx_venues_is_active ON venues(is_active);
CREATE INDEX IF NOT EXISTS idx_venues_is_approved ON venues(is_approved);
CREATE INDEX IF NOT EXISTS idx_venues_rating ON venues(rating DESC);
CREATE INDEX IF NOT EXISTS idx_venues_created_at ON venues(created_at DESC);

-- 2. Optimize Vendors Table
CREATE INDEX IF NOT EXISTS idx_vendors_city ON vendors(city);
CREATE INDEX IF NOT EXISTS idx_vendors_slug ON vendors(slug);
CREATE INDEX IF NOT EXISTS idx_vendors_is_active ON vendors(is_active);
CREATE INDEX IF NOT EXISTS idx_vendors_is_approved ON vendors(is_approved);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);
CREATE INDEX IF NOT EXISTS idx_vendors_created_at ON vendors(created_at DESC);

-- 3. Optimize Profiles Table
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 4. Optimize Leads Table
CREATE INDEX IF NOT EXISTS idx_leads_owner_id ON leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- 5. Optimize SEO Pages Table
CREATE INDEX IF NOT EXISTS idx_seo_pages_slug ON seo_pages(slug);

-- 6. Optimize Venue Applications Table
CREATE INDEX IF NOT EXISTS idx_venue_apps_status ON venue_applications(status);
CREATE INDEX IF NOT EXISTS idx_venue_apps_user_id ON venue_applications(user_id);
