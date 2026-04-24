import { unslugify } from '@/lib/seo/slugify';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://venueconnect.in';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  slug?: string; // relative slug, e.g. "wedding-venues-in-ahmedabad"
}

export interface ListingItem {
  name: string;
  slug: string;
  type: 'venue' | 'vendor';
  avg_rating?: number;
  review_count?: number;
  images?: string[];
  description?: string;
}

export interface LocalBusinessData {
  name: string;
  slug: string;
  type: 'venue' | 'vendor';
  description?: string;
  images?: string[];
  city?: string;
  area?: string;
  price_range?: string;
  contact_json?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  avg_rating?: number;
  review_count?: number;
}

// ─── BreadcrumbList Schema ────────────────────────────────────────────────────

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      ...items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: item.name,
        ...(item.slug ? { item: `${SITE_URL}/${item.slug}` } : {}),
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── ItemList Schema (top listings on page) ───────────────────────────────────

export function ItemListSchema({
  items,
  pageSlug,
}: {
  items: ListingItem[];
  pageSlug: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: `${SITE_URL}/${pageSlug}`,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 5).map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${SITE_URL}/${item.type}s/${item.slug}`,
      name: item.name,
      image: item.images?.[0],
      description: item.description,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── LocalBusiness Schema (individual venue/vendor detail pages) ──────────────

export function LocalBusinessSchema({ data }: { data: LocalBusinessData }) {
  const url = `${SITE_URL}/${data.type}s/${data.slug}`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    url,
    description: data.description,
    image: data.images ?? [],
    address: {
      '@type': 'PostalAddress',
      addressLocality: data.area ?? data.city,
      addressRegion: data.city ?? 'Gujarat',
      addressCountry: 'IN',
    },
    ...(data.contact_json?.phone && { telephone: data.contact_json.phone }),
    ...(data.contact_json?.email && { email: data.contact_json.email }),
    ...(data.contact_json?.website && { sameAs: [data.contact_json.website] }),
  };

  // Inject AggregateRating only when reviews exist
  if (data.avg_rating && data.review_count && data.review_count > 0) {
    schema['aggregateRating'] = {
      '@type': 'AggregateRating',
      ratingValue: data.avg_rating.toFixed(1),
      reviewCount: data.review_count,
      bestRating: '5',
      worstRating: '1',
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── WebPage Schema (SEO landing pages) ──────────────────────────────────────

export function WebPageSchema({
  title,
  description,
  slug,
}: {
  title: string;
  description: string;
  slug: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}/${slug}`,
    inLanguage: 'en-IN',
    publisher: {
      '@type': 'Organization',
      name: 'VenueConnect',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Convenience: Full SEO Page Bundle ───────────────────────────────────────

interface SEOPageSchemaProps {
  breadcrumbs: BreadcrumbItem[];
  listings: ListingItem[];
  pageSlug: string;
  pageTitle: string;
  pageDescription: string;
}

export function SEOPageSchema({
  breadcrumbs,
  listings,
  pageSlug,
  pageTitle,
  pageDescription,
}: SEOPageSchemaProps) {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      {listings.length > 0 && (
        <ItemListSchema items={listings} pageSlug={pageSlug} />
      )}
      <WebPageSchema title={pageTitle} description={pageDescription} slug={pageSlug} />
    </>
  );
}
