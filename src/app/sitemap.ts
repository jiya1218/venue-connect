import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { GUJARAT_CITIES, VENUE_TYPES, VENDOR_TYPES, EVENT_SUGGESTIONS } from '@/lib/constants';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://venueconnect.in';

/**
 * Sitemap Index Configuration
 * This splits the sitemap into 4 smaller, manageable XML files:
 * 1. main: Static pages and "Near Me" canonicals
 * 2. seo: All City + Category combinations
 * 3. venues: Individual venue detail pages
 * 4. vendors: Individual vendor detail pages
 */

export async function generateSitemaps() {
  return [
    { id: 'main' },
    { id: 'seo' },
    { id: 'venues' },
    { id: 'vendors' },
  ];
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // --- 1. MAIN SITEMAP (Static + Near-Me) ---
  if (id === 'main') {
    const staticRoutes: MetadataRoute.Sitemap = [
      { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${SITE_URL}/list-venue`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${SITE_URL}/list-vendor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    ];

    // Near Me Canonical Pages
    const nearMeRoutes: MetadataRoute.Sitemap = [
      ...VENUE_TYPES.map(t => ({
        url: `${SITE_URL}/${t.toLowerCase().replace(/\s+/g, '-')}-near-me/`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9
      })),
      ...VENDOR_TYPES.map(t => ({
        url: `${SITE_URL}/${t.toLowerCase().replace(/\s+/g, '-')}-near-me/`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9
      })),
      ...EVENT_SUGGESTIONS.slice(0, 40).map(e => ({ // Limit to most popular for main sitemap
        url: `${SITE_URL}/${e.toLowerCase().replace(/[\s/]+/g, '-')}-venue-near-me/`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9
      }))
    ];

    return [...staticRoutes, ...nearMeRoutes];
  }

  // --- 2. SEO SITEMAP (City + Category Combinations) ---
  if (id === 'seo') {
    const seoRoutes: MetadataRoute.Sitemap = [];
    
    GUJARAT_CITIES.forEach(city => {
      const citySlug = city.toLowerCase().replace(/\s+/g, '-');
      
      // City + Venue Types
      VENUE_TYPES.forEach(type => {
        seoRoutes.push({
          url: `${SITE_URL}/${citySlug}/${type.toLowerCase().replace(/\s+/g, '-')}/`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7
        });
      });

      // City + Vendor Types
      VENDOR_TYPES.forEach(type => {
        seoRoutes.push({
          url: `${SITE_URL}/${citySlug}/vendors/${type.toLowerCase().replace(/\s+/g, '-')}/`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7
        });
      });
    });

    return seoRoutes;
  }

  // --- 3. VENUES SITEMAP (Individual Detail Pages) ---
  if (id === 'venues') {
    const { data: venues } = await supabase
      .from('venues')
      .select('slug, city, created_at')
      .eq('is_active', true)
      .eq('is_approved', true);

    return (venues || []).map(v => ({
      url: `${SITE_URL}/${v.city?.toLowerCase().replace(/\s+/g, '-') || 'gujarat'}/${v.slug}/`,
      lastModified: new Date(v.created_at || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }));
  }

  // --- 4. VENDORS SITEMAP (Individual Detail Pages) ---
  if (id === 'vendors') {
    const { data: vendors } = await supabase
      .from('vendors')
      .select('slug, city, created_at')
      .eq('is_active', true)
      .eq('is_approved', true);

    return (vendors || []).map(v => ({
      url: `${SITE_URL}/${v.city?.toLowerCase().replace(/\s+/g, '-') || 'gujarat'}/vendors/${v.slug}/`,
      lastModified: new Date(v.created_at || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }));
  }

  return [];
}
