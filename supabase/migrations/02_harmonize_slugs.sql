-- 1. Create a superior slugify function in Postgres
CREATE OR REPLACE FUNCTION public.slugify(text) RETURNS text AS $$
BEGIN
  RETURN lower(regexp_replace(trim(regexp_replace(regsub(decode(regsub($1, '[^\w\s-]', '', 'g')), '-+'), '\s+', '-', 'g')), '^-+|-+$', '', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Update the auto_generate_slug trigger to include area
CREATE OR REPLACE FUNCTION public.auto_generate_slug()
RETURNS TRIGGER AS $$
DECLARE
    area_name TEXT;
    area_slug TEXT;
BEGIN
    -- Only generate if slug is missing
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        -- Fetch area name if area_id is present
        IF NEW.area_id IS NOT NULL THEN
            SELECT area INTO area_name FROM public.locations WHERE id = NEW.area_id;
            
            IF area_name IS NOT NULL AND area_name != '' THEN
                NEW.slug := public.slugify(NEW.name || ' in ' || area_name);
            ELSE
                NEW.slug := public.slugify(NEW.name);
            END IF;
        ELSE
            NEW.slug := public.slugify(NEW.name);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Bulk Update existing Venues to follow the new pattern
-- Note: We assume locations table is already populated for these IDs
UPDATE public.venues v
SET slug = lower(regexp_replace(regexp_replace(v.name || ' in ' || l.area, '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'))
FROM public.locations l
WHERE v.area_id = l.id
AND (v.slug NOT LIKE '%-in-%' OR v.slug IS NULL);

-- 4. Bulk Update existing Vendors
UPDATE public.vendors v
SET slug = lower(regexp_replace(regexp_replace(v.name || ' in ' || l.area, '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'))
FROM public.locations l
WHERE v.area_id = l.id
AND (v.slug NOT LIKE '%-in-%' OR v.slug IS NULL);
