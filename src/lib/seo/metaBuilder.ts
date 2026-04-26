import type { Metadata } from 'next';
import type { SEOPageRow } from './pageGenerator';
import { unslugify } from './slugify';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://venueconnect.in';
const SITE_NAME = 'VenueConnect';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

// ─── Page-type detection (mirrors seoContentEngine.ts & pageGenerator.ts) ────

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
  'venues', 'wedding-venues',
  'birthday-party-venue', 'engagement-venue', 'corporate-event-venue', 'pre-wedding-shoot-venue', 'pool-party-venue',
]);

/**
 * Builds a Next.js Metadata object from a seo_pages database row.
 * Falls back to sensible defaults if custom content is missing.
 */
export function buildMetadata(page: SEOPageRow): Metadata {
  const custom = page.custom_content as Record<string, string> | null;

  const pageTitle = custom?.pageTitle ?? custom?.metaTitle ?? custom?.meta_title ?? buildDefaultTitle(page.slug);
  const metaTitle = custom?.metaTitle ?? custom?.meta_title ?? pageTitle;
  const description = custom?.metaDesc ?? custom?.meta_description ?? buildDefaultDescription(page.slug);
  
  let keywordsStr = undefined;
  if (custom?.keyword || custom?.secondaryKeywords) {
    keywordsStr = [custom.keyword, custom.secondaryKeywords].filter(Boolean).join(', ');
  }

  const canonicalUrl = `${SITE_URL}/${page.slug}`;

  return {
    title: metaTitle,
    description,
    keywords: keywordsStr,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  };
}

/**
 * Generates a metadata object directly from slug parts —
 * used when no seo_pages row exists yet.
 * Applies the correct title/description pattern per page type:
 *   - Vendor + City       → Top {Vendors} in {City} | Compare & Hire - VenueConnect
 *   - Vendor + City Area  → Top {Vendors} in {Area}, {City} | Hire Near You - VenueConnect
 *   - Venue Type + City   → Best {VenueType} in {City} | Compare Prices & Book - VenueConnect
 *   - Venue Type + Area   → Best {VenueType} in {Area}, {City} | Compare Near You - VenueConnect
 *   - Event + City        → Best {Event} in {City} | Book & Compare Prices - VenueConnect
 *   - Event + Area        → Best {Event} in {Area}, {City} | Book Near You - VenueConnect
 */
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

export function buildMetadataFromSlugs(
  categorySlug: string,
  citySlug: string,
  areaSlug?: string
): Metadata {
  const catLowerSlug = categorySlug.toLowerCase().replace('-near-me', '');
  const category = STRICT_MAPPINGS[catLowerSlug] || unslugify(categorySlug);
  const city = unslugify(citySlug);
  const location = areaSlug ? `${unslugify(areaSlug)}, ${city}` : city;
  const hasArea = !!areaSlug;
  const isNearMe = categorySlug.endsWith('-near-me');

  const catLower = categorySlug.toLowerCase().replace('-near-me', '');
  const isVendor = VENDOR_SLUGS_SET.has(catLower);
  const isVenueType = VENUE_TYPE_SLUGS_SET.has(catLower);

  let pageTitle: string;
  let metaTitle: string;
  let description: string;

  if (isVendor) {
    if (hasArea) {
      pageTitle = `${category} in ${location} | ${SITE_NAME}`;
      metaTitle = `Top ${category} in ${location} | Hire Near You - ${SITE_NAME}`;
      description = `Hire top ${category.toLowerCase()} in ${location} for weddings, birthdays & all events. Compare portfolios, pricing & reviews. Get direct leads via WhatsApp. Book on ${SITE_NAME}.`;
    } else {
      pageTitle = `${category} in ${city} | ${SITE_NAME}`;
      metaTitle = `Top ${category} in ${city} | Compare & Hire - ${SITE_NAME}`;
      description = `Hire top ${category.toLowerCase()} in ${city} for weddings, birthdays & all events. Compare portfolios, pricing & reviews. Get direct leads via WhatsApp. Book on ${SITE_NAME}.`;
    }
  } else if (isVenueType) {
    if (hasArea) {
      pageTitle = `${category} in ${location} | ${SITE_NAME}`;
      metaTitle = `Best ${category} in ${location} | Compare Near You - ${SITE_NAME}`;
      description = `Find top ${category.toLowerCase()} in ${location} for any occasion. Compare capacity, pricing & amenities. 100+ verified listings. Get free quotes on ${SITE_NAME} Gujarat.`;
    } else {
      pageTitle = `${category} in ${city} | ${SITE_NAME}`;
      metaTitle = `Best ${category} in ${city} | Compare Prices & Book - ${SITE_NAME}`;
      description = `Find top ${category.toLowerCase()} in ${city} for any occasion. Compare capacity, pricing & amenities. 100+ verified listings. Get free quotes on ${SITE_NAME} Gujarat.`;
    }
  } else {
    // Event or generic
    if (hasArea) {
      pageTitle = `${category} in ${location} | ${SITE_NAME}`;
      metaTitle = `Best ${category} in ${location} | Book Near You - ${SITE_NAME}`;
      description = `Find the best ${category.toLowerCase()} in ${location}. Compare wedding halls, banquet spaces & party plots. Get free quotes & instant leads. Browse 100+ options on ${SITE_NAME}.`;
    } else {
      pageTitle = `${category} in ${city} | ${SITE_NAME}`;
      metaTitle = `Best ${category} in ${city} | Book & Compare Prices - ${SITE_NAME}`;
      description = `Find the best ${category.toLowerCase()} in ${city}. Compare wedding halls, banquet spaces & party plots. Get free quotes & instant leads. Browse 100+ options on ${SITE_NAME}.`;
    }
  }

  const slug = areaSlug
    ? `${citySlug}/${areaSlug}/${categorySlug}/`
    : (isVendor ? `${citySlug}/vendors/${categorySlug}/` : `${citySlug}/${categorySlug}/`);
  const canonicalUrl = `${SITE_URL}/${slug.replace(/\/\/+/g, '/')}`;

  return {
    title: metaTitle,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: metaTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: pageTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: { index: true, follow: true },
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildDefaultTitle(slug: string): string {
  const label = unslugify(slug);
  return `${label} | ${SITE_NAME}`;
}

function buildDefaultDescription(slug: string): string {
  const label = unslugify(slug);
  return `Discover and book ${label} instantly on ${SITE_NAME}. Compare prices and read verified reviews.`;
}
