-- Auto-slug trigger function
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
        NEW.slug := trim(both '-' from NEW.slug);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    description TEXT,
    type TEXT CHECK (type IN ('venue', 'vendor')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Locations
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city TEXT NOT NULL,
    city_slug TEXT NOT NULL,
    area TEXT NOT NULL,
    area_slug TEXT NOT NULL,
    state TEXT NOT NULL,
    lat NUMERIC,
    lng NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Venues
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    city_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    area_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    images TEXT[],
    price_range TEXT,
    capacity INT,
    contact_json JSONB,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    meta_title TEXT,
    meta_description TEXT,
    rating NUMERIC DEFAULT 4.0,
    reviews INT DEFAULT 0,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    city TEXT,
    address TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vendors
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    city_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    area_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    images TEXT[],
    price_range TEXT,
    experience_years INT,
    contact_json JSONB,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    meta_title TEXT,
    meta_description TEXT,
    rating NUMERIC DEFAULT 4.0,
    reviews INT DEFAULT 0,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    starting_price INT DEFAULT 0,
    city TEXT,
    category TEXT,
    logo_url TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SEO Pages
CREATE TABLE IF NOT EXISTS seo_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    page_type TEXT NOT NULL,
    city_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    area_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    custom_content JSONB,
    last_generated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL,
    entity_type TEXT CHECK (entity_type IN ('venue', 'vendor')) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    body TEXT,
    author_name TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL,
    entity_type TEXT CHECK (entity_type IN ('venue', 'vendor')) NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers for auto_generate_slug
CREATE TRIGGER venues_auto_slug
    BEFORE INSERT ON venues
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_slug();

CREATE TRIGGER vendors_auto_slug
    BEFORE INSERT ON vendors
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_slug();

-- RLS Enablement
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Public Read Policies
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (true);
CREATE POLICY "public_read_locations" ON locations FOR SELECT USING (true);

-- Public read only active+verified listings
CREATE POLICY "public_read_venues" ON venues
FOR SELECT USING (is_active = true AND is_verified = true);

CREATE POLICY "public_read_vendors" ON vendors
FOR SELECT USING (is_active = true AND is_verified = true);

CREATE POLICY "public_read_seo_pages" ON seo_pages FOR SELECT USING (true);

CREATE POLICY "public_insert_seo_pages" ON seo_pages FOR INSERT WITH CHECK (true);

CREATE POLICY "public_update_seo_pages" ON seo_pages FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "public_read_reviews" ON reviews
FOR SELECT USING (is_approved = true);

-- Inquiries are insertable by public
CREATE POLICY "public_insert_inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Authenticated Write for Owners
CREATE POLICY "owner_all_venues" ON venues
FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "owner_all_vendors" ON vendors
FOR ALL USING (auth.uid() = owner_id);

-- Indexes
CREATE INDEX venues_slug_idx ON venues(slug);
CREATE INDEX venues_city_id_idx ON venues(city_id);
CREATE INDEX venues_category_id_idx ON venues(category_id);
CREATE INDEX venues_is_active_idx ON venues(is_active);

CREATE INDEX vendors_slug_idx ON vendors(slug);
CREATE INDEX vendors_city_id_idx ON vendors(city_id);
CREATE INDEX vendors_category_id_idx ON vendors(category_id);
CREATE INDEX vendors_is_active_idx ON vendors(is_active);

CREATE INDEX seo_pages_slug_idx ON seo_pages(slug);
