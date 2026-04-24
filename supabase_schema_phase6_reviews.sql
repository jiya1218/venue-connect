-- Phase 6: Real Reviews & Ratings System

-- 1. Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid default gen_random_uuid() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    item_id uuid not null, -- The ID of the venue or vendor (Assuming they are UUIDs. If they are text, change this to text)
    item_type text not null check (item_type in ('venue', 'vendor')),
    rating integer not null check (rating >= 1 and rating <= 5),
    review_text text,
    created_at timestamp with time zone default now(),
    
    -- A user can only leave one review per venue/vendor
    UNIQUE(user_id, item_id, item_type)
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Public reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);

-- Authenticated users can insert their own reviews
CREATE POLICY "Users can insert own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own reviews
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Authenticated users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- TRIGGERS TO UPDATE AGGREGATE RATINGS
-- ==========================================

-- Function to update the aggregated ratings on venues/vendors
CREATE OR REPLACE FUNCTION public.update_listing_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating numeric;
    total_reviews integer;
    target_id uuid;
    target_type text;
BEGIN
    -- Determine target info based on operation
    IF TG_OP = 'DELETE' THEN
        target_id := OLD.item_id;
        target_type := OLD.item_type;
    ELSE
        target_id := NEW.item_id;
        target_type := NEW.item_type;
    END IF;

    -- Calculate new average and count
    SELECT 
        COALESCE(ROUND(AVG(rating)::numeric, 1), 0),
        COUNT(*)
    INTO 
        avg_rating, 
        total_reviews
    FROM public.reviews
    WHERE item_id = target_id AND item_type = target_type;

    -- Update the appropriate table
    IF target_type = 'venue' THEN
        -- Safely attempt to update. If columns don't exist exactly it might fail, 
        -- but our schema has rating and reviews on both
        UPDATE public.venues
        SET rating = avg_rating, reviews = total_reviews
        WHERE id = target_id;
    ELSIF target_type = 'vendor' THEN
        UPDATE public.vendors
        SET rating = avg_rating, reviews = total_reviews
        WHERE id = target_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT, UPDATE, DELETE
DROP TRIGGER IF EXISTS trigger_update_listing_rating ON public.reviews;

CREATE TRIGGER trigger_update_listing_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_listing_rating();
