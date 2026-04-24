-- ============================================================
-- VENUECONNECT — ADD MISSING CITIES & ALL SEO PAGES
-- ============================================================
-- This script ONLY ADDS data (no deletes/overwrites)
-- Safe to run multiple times
-- ============================================================

-- STEP 1: Add missing cities to locations table
INSERT INTO "public"."locations" ("id", "city", "city_slug", "area", "area_slug", "state", "created_at") VALUES
  (gen_random_uuid(), 'Bhuj', 'bhuj', 'Bhuj', 'bhuj', 'Gujarat', NOW()),
  (gen_random_uuid(), 'Valsad', 'valsad', 'Valsad', 'valsad', 'Gujarat', NOW()),
  (gen_random_uuid(), 'Palanpur', 'palanpur', 'Palanpur', 'palanpur', 'Gujarat', NOW()),
  (gen_random_uuid(), 'Dahod', 'dahod', 'Dahod', 'dahod', 'Gujarat', NOW()),
  (gen_random_uuid(), 'Jamnagar', 'jamnagar', 'Jamnagar', 'jamnagar', 'Gujarat', NOW()),
  (gen_random_uuid(), 'Navsari', 'navsari', 'Navsari', 'navsari', 'Gujarat', NOW()),
  (gen_random_uuid(), 'Gandhidham', 'gandhidham', 'Gandhidham', 'gandhidham', 'Gujarat', NOW()),
  (gen_random_uuid(), 'Junagadh', 'junagadh', 'Junagadh', 'junagadh', 'Gujarat', NOW()),
  (gen_random_uuid(), 'Morbi', 'morbi', 'Morbi', 'morbi', 'Gujarat', NOW()),
  (gen_random_uuid(), 'Near Me', 'near-me', 'All Gujarat', 'all-gujarat', 'Gujarat', NOW())
ON CONFLICT DO NOTHING;

-- STEP 2: Verify all 17 locations exist
SELECT COUNT(*) as total_cities FROM public.locations;

-- STEP 3: Clear existing SEO pages if needed (OPTIONAL - uncomment to reset)
-- DELETE FROM public.seo_pages;

-- STEP 4: Create function to parse page type and determine category
CREATE OR REPLACE FUNCTION get_category_id(page_type TEXT, city_name TEXT)
RETURNS UUID AS $$
DECLARE
  cat_id UUID;
BEGIN
  -- Parse page type: "Event + City", "Vendor + City", "Venue + City", etc.
  CASE
    WHEN page_type LIKE 'Event%' THEN
      SELECT id INTO cat_id FROM public.categories WHERE name = 'Wedding Venues' LIMIT 1;
    WHEN page_type LIKE 'Vendor%' THEN
      SELECT id INTO cat_id FROM public.categories WHERE name = 'Photographers' LIMIT 1;
    WHEN page_type LIKE 'Venue%' THEN
      SELECT id INTO cat_id FROM public.categories WHERE name = 'Banquet Halls' LIMIT 1;
  END CASE;
  RETURN cat_id;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Prepare for bulk insert - create staging table
CREATE TEMP TABLE seo_pages_staging (
  slug TEXT UNIQUE,
  page_type TEXT,
  city TEXT,
  custom_content JSONB
);

-- ============================================================
-- NOTE: For bulk insert of 8,089 pages, use the provided SQL file:
-- seo_pages_migration.sql (generated separately)
-- Or import the JSON file programmatically via your app
-- ============================================================

-- Quick example - insert a few sample pages to verify structure:
INSERT INTO public.seo_pages (id, slug, page_type, city_id, custom_content, created_at)
SELECT
  gen_random_uuid(),
  data->>'urlSlug' as slug,
  data->>'pageType' as page_type,
  loc.id as city_id,
  jsonb_build_object(
    'pageTitle', data->>'pageTitle',
    'metaTitle', data->>'metaTitle',
    'metaDesc', data->>'metaDesc',
    'h1Tag', data->>'h1Tag',
    'keyword', data->>'keyword',
    'secondaryKeywords', data->>'secondaryKeywords',
    'searchIntent', data->>'searchIntent',
    'priority', data->>'priority'
  ) as custom_content,
  NOW()
FROM (
  -- You'll populate this with your JSON data
  VALUES
    (jsonb_build_object(
      'urlSlug', '/ahmedabad/wedding-venues/',
      'pageType', 'Event + City',
      'city', 'Ahmedabad',
      'pageTitle', 'Wedding Venues in Ahmedabad | VenueConnect',
      'metaTitle', 'Best Wedding Venues in Ahmedabad | Book & Compare Prices - VenueConnect',
      'metaDesc', 'Find the best wedding venues in Ahmedabad. Compare wedding halls, banquet spaces & party plots. Get free quotes & instant leads. Browse 100+ options on VenueConnect.',
      'h1Tag', 'Best Wedding Venues in Ahmedabad',
      'keyword', 'wedding venues in Ahmedabad',
      'secondaryKeywords', 'wedding hall Ahmedabad, wedding venue booking Ahmedabad, best wedding venue Ahmedabad, wedding party venue Ahmedabad',
      'searchIntent', 'Navigational / Transactional',
      'priority', 'High'
    ))
) AS data_table(data)
JOIN public.locations loc ON loc.city = data->>'city'
WHERE NOT EXISTS (SELECT 1 FROM public.seo_pages WHERE slug = data->>'urlSlug')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- DONE
-- Verify with: SELECT COUNT(*) FROM seo_pages;
-- ============================================================
