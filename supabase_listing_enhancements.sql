-- ============================================================
-- VENUECONNECT - LISTING ENHANCEMENTS
-- Adds visibility and moderation controls to venues/vendors
-- ============================================================

-- 1. Add is_approved and is_featured to venues
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- 2. Add is_approved and is_featured to vendors
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Note: We default to true for existing data to keep demo live, 
-- but future programmatic inserts from admin can set to false if needed.

-- ============================================================
-- 3. Update SEO Routes Queries 
-- (Note: This is a comment, the actual logic is in TSX files)
-- Every query in src/app/(seo) should now append .eq('is_approved', true)
-- ============================================================
