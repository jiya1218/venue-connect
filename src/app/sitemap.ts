import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://venueconnect.in';

interface SEOPageRow {
  slug: string;
  last_generated: string | null;
  page_type: string;
}

interface VenueRow {
  slug: string | null;
  city: string | null;
  created_at: string;
}

interface VendorRow {
  slug: string | null;
  city: string | null;
  created_at: string;
}

function slugifyCity(city?: string | null): string {
  return (city || '').trim().toLowerCase().replace(/\s+/g, '-');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // ── Static priority pages ───────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/list-venue`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/list-vendor`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  if (!supabase) return staticRoutes;

  // ── SEO landing pages ────────────────────────────────────────────────────
  const { data: seoPages } = await supabase
    .from('seo_pages')
    .select('slug, last_generated, page_type')
    .order('last_generated', { ascending: false });

  const seoRoutes: MetadataRoute.Sitemap = (seoPages as SEOPageRow[] ?? []).map((p) => ({
    url: `${SITE_URL}/${p.slug}`,
    lastModified: p.last_generated ? new Date(p.last_generated) : new Date(),
    changeFrequency: 'weekly' as const,
    // City pages rank higher than area pages
    priority: p.page_type === 'city' ? 0.8 : p.page_type === 'category' ? 0.7 : 0.6,
  }));

  // ── Individual venue pages ────────────────────────────────────────────────
  const { data: venues } = await supabase
    .from('venues')
    .select('slug, city, created_at')
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  const venueRoutes: MetadataRoute.Sitemap = (venues as VenueRow[] ?? [])
    .filter((v) => !!v.slug)
    .map((v) => ({
    url: `${SITE_URL}/venues/${slugifyCity(v.city) || 'gujarat'}/${v.slug}`,
    lastModified: new Date(v.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ── Individual vendor pages ───────────────────────────────────────────────
  const { data: vendors } = await supabase
    .from('vendors')
    .select('slug, city, created_at')
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  const vendorRoutes: MetadataRoute.Sitemap = (vendors as VendorRow[] ?? [])
    .filter((v) => !!v.slug)
    .map((v) => ({
    url: `${SITE_URL}/vendors/${slugifyCity(v.city) || 'gujarat'}/${v.slug}`,
    lastModified: new Date(v.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...seoRoutes, ...venueRoutes, ...vendorRoutes];
}
