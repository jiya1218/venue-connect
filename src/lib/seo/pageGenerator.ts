import { createClient } from '@supabase/supabase-js';
import { buildSEOSlug, unslugify } from './slugify';

export interface SEOPageRow {
  id: string;
  slug: string;
  page_type: 'city' | 'area' | 'category';
  city_id: string | null;
  area_id: string | null;
  category_id: string | null;
  custom_content: Record<string, unknown> | null;
  last_generated: string;
  created_at: string;
  meta_title?: string;
  meta_description?: string;
}

// ─── Vendor slug detection (mirrors seoContentEngine.ts) ─────────────────────
const VENDOR_SLUGS_SET = new Set([
  'photography', 'photographers', 'photographer', 'wedding-photographers',
  'catering', 'caterers', 'caterer', 'food-services',
  'decorators', 'decorator', 'decoration',
  'makeup-and-hair', 'makeup', 'makeup-artists', 'makeup-artist',
  'mehendi', 'mehndi', 'mehendi-artists', 'mehndi-artists', 'mehendi-artist', 'mehndi-artist',
  'dj', 'djs', 'disc-jockeys',
  'videography', 'videographers', 'videographer',
  'pandit', 'pandits', 'astrologers', 'astrologer',
  'jewellery', 'jewelry', 'jewellers', 'jeweller',
  'bands', 'band', 'music-band', 'anchor', 'anchors',
  'choreography', 'choreographers', 'choreographer',
  'sounds-led-and-lights', 'transportation',
  'wedding-cake', 'cakes', 'cake', 'return-gift', 'gifts', 'gift',
  'invitation-wedding-card', 'invitations', 'invitation', 'hathi-ghoda-and-car',
  'event-planners', 'event-planner', 'planners', 'planner', 'wedding-planners', 'wedding-planner',
  'florists', 'florist', 'tent-houses', 'tent-house', 'magicians', 'magician',
  'entertainers', 'entertainer', 'all-vendors', 'vendors',
]);

const VENUE_TYPE_SLUGS_SET = new Set([
  'banquet-halls', 'banquet-hall', 'farmhouse', 'farmhouses',
  'hotels', 'hotel', 'resorts', 'resort',
  'party-plots', 'party-plot',
  'lawn', 'lawns', 'convention-centre', 'convention-centers',
  'restaurants', 'restaurant',
  'birthday-party-venue', 'engagement-venue', 'corporate-event-venue', 'pre-wedding-shoot-venue', 'pool-party-venue',
]);

const STRICT_MAPPINGS: Record<string, string> = {
  'photographers': 'Photographers',
  'caterers': 'Caterers',
  'decorators': 'Decorators',
  'mehndi-artists': 'Mehndi Artists',
  'djs': 'DJs',
  'bands': 'Bands',
  'event-planners': 'Event Planners',
  'bridal-wear': 'Bridal Wear',
  'makeup-artists': 'Makeup Artists',
  'florists': 'Florists',
  'videographers': 'Videographers',
  'wedding-planners': 'Wedding Planners',
  'tent-houses': 'Tent Houses',
  'choreographers': 'Choreographers',
  'invitation-cards': 'Invitation Cards',
  'cake-shops': 'Cake Shops',
  'jewellers': 'Jewellers',
  'astrologers': 'Astrologers',
  'magicians': 'Magicians',
  'entertainers': 'Entertainers',
  'groom-wear': 'Groom Wear',
  'wedding-photographers': 'Wedding Photographers'
};

function buildPageMeta(
  categorySlug: string,
  cityLabel: string,
  locationLabel: string,  // area+city or just city
  hasArea: boolean
): { meta_title: string; meta_description: string; pageTitle: string; h1Tag: string } {
  const catLowerSlug = categorySlug.toLowerCase().replace('-near-me', '');
  const category = STRICT_MAPPINGS[catLowerSlug] || unslugify(categorySlug);
  const isVendor = VENDOR_SLUGS_SET.has(categorySlug.toLowerCase());
  const isVenueType = VENUE_TYPE_SLUGS_SET.has(categorySlug.toLowerCase());
  // Anything else is treated as event/generic

  if (isVendor) {
    if (hasArea) {
      return {
        pageTitle: `${category} in ${locationLabel} | VenueConnect`,
        meta_title: `Top ${category} in ${locationLabel} | Hire Near You - VenueConnect`,
        meta_description: `Hire top ${category.toLowerCase()} in ${locationLabel} for weddings, birthdays & all events. Compare portfolios, pricing & reviews. Get direct leads via WhatsApp. Book on VenueConnect.`,
        h1Tag: `Top ${category} in ${locationLabel}`,
      };
    }
    return {
      pageTitle: `${category} in ${cityLabel} | VenueConnect`,
      meta_title: `Top ${category} in ${cityLabel} | Compare & Hire - VenueConnect`,
      meta_description: `Hire top ${category.toLowerCase()} in ${cityLabel} for weddings, birthdays & all events. Compare portfolios, pricing & reviews. Get direct leads via WhatsApp. Book on VenueConnect.`,
      h1Tag: `Top ${category} in ${cityLabel}`,
    };
  }

  if (isVenueType) {
    if (hasArea) {
      return {
        pageTitle: `${category} in ${locationLabel} | VenueConnect`,
        meta_title: `Best ${category} in ${locationLabel} | Compare Near You - VenueConnect`,
        meta_description: `Find top ${category.toLowerCase()} in ${locationLabel} for any occasion. Compare capacity, pricing & amenities. 100+ verified listings. Get free quotes on VenueConnect Gujarat.`,
        h1Tag: `Best ${category} in ${locationLabel}`,
      };
    }
    return {
      pageTitle: `${category} in ${cityLabel} | VenueConnect`,
      meta_title: `Best ${category} in ${cityLabel} | Compare Prices & Book - VenueConnect`,
      meta_description: `Find top ${category.toLowerCase()} in ${cityLabel} for any occasion. Compare capacity, pricing & amenities. 100+ verified listings. Get free quotes on VenueConnect Gujarat.`,
      h1Tag: `Best ${category} in ${cityLabel}`,
    };
  }

  // Event or generic
  if (hasArea) {
    return {
      pageTitle: `${category} in ${locationLabel} | VenueConnect`,
      meta_title: `Best ${category} in ${locationLabel} | Book Near You - VenueConnect`,
      meta_description: `Find the best ${category.toLowerCase()} in ${locationLabel}. Compare wedding halls, banquet spaces & party plots. Get free quotes & instant leads. Browse 100+ options on VenueConnect.`,
      h1Tag: `Best ${category} in ${locationLabel}`,
    };
  }
  return {
    pageTitle: `${category} in ${cityLabel} | VenueConnect`,
    meta_title: `Best ${category} in ${cityLabel} | Book & Compare Prices - VenueConnect`,
    meta_description: `Find the best ${category.toLowerCase()} in ${cityLabel}. Compare wedding halls, banquet spaces & party plots. Get free quotes & instant leads. Browse 100+ options on VenueConnect.`,
    h1Tag: `Best ${category} in ${cityLabel}`,
  };
}

/**
 * Looks up or creates an SEO page for the given category + city + optional area combo.
 */
export async function generateSEOPage(
  categorySlug: string,
  categoryId: string | null,
  citySlug: string,
  cityId: string,
  areaSlug?: string,
  areaId?: string
): Promise<SEOPageRow | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const catLowerSlug = categorySlug.toLowerCase().replace('-near-me', '');
  const isVendor = VENDOR_SLUGS_SET.has(catLowerSlug);
  const slug = buildSEOSlug(categorySlug, citySlug, areaSlug, isVendor);

  const cityLabel = unslugify(citySlug);
  const locationLabel = areaSlug ? `${unslugify(areaSlug)}, ${cityLabel}` : cityLabel;
  const hasArea = !!areaSlug;

  const { meta_title, meta_description, pageTitle, h1Tag } = buildPageMeta(categorySlug, cityLabel, locationLabel, hasArea);

  const { data: newPage, error } = await supabaseAdmin
    .from('seo_pages')
    .upsert({
      slug,
      page_type: areaSlug ? 'area' : 'city',
      category_id: categoryId,
      city_id: cityId,
      area_id: areaId ?? null,
      custom_content: {
        pageTitle,
        meta_title,
        meta_description,
        h1Tag,
      },
      last_generated: new Date().toISOString(),
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (error) {
    console.error('[generateSEOPage] Upsert failed:', error.message);
    return null;
  }

  return newPage as SEOPageRow;
}

/**
 * Fetches an existing SEO page by its slug only (no write).
 */
export async function getSEOPageBySlug(slug: string): Promise<SEOPageRow | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log(`[getSEOPageBySlug] Fetching slug: "${slug}"`);
  const { data, error } = await supabaseAdmin
    .from('seo_pages')
    .select('*')
    .ilike('slug', slug)
    .maybeSingle();

  if (error) console.error(`[getSEOPageBySlug] DB Error for ${slug}:`, error.message);
  console.log(`[getSEOPageBySlug] Result for ${slug}: ${data ? 'FOUND' : 'NOT FOUND'}`);

  return (data as SEOPageRow) ?? null;
}
