import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GUJARAT_CITIES, VENUE_TYPES, VENDOR_TYPES, EVENT_SUGGESTIONS } from '@/lib/constants';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://venueconnect.in';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const sitemapId = id.replace('.xml', '');
  const supabase = await createClient();

  let urls: { url: string; lastmod: string; priority: string; changefreq: string }[] = [];

  // --- 1. MAIN SITEMAP ---
  if (sitemapId === 'main') {
    const lastMod = new Date().toISOString();
    urls = [
      { url: SITE_URL, lastmod: lastMod, priority: '1.0', changefreq: 'daily' },
      { url: `${SITE_URL}/about`, lastmod: lastMod, priority: '0.5', changefreq: 'monthly' },
      { url: `${SITE_URL}/contact`, lastmod: lastMod, priority: '0.5', changefreq: 'monthly' },
      { url: `${SITE_URL}/list-venue`, lastmod: lastMod, priority: '0.8', changefreq: 'monthly' },
      { url: `${SITE_URL}/list-vendor`, lastmod: lastMod, priority: '0.8', changefreq: 'monthly' },
      { url: `${SITE_URL}/blog`, lastmod: lastMod, priority: '0.7', changefreq: 'daily' },
      ...VENUE_TYPES.map(t => ({
        url: `${SITE_URL}/${t.toLowerCase().replace(/\s+/g, '-')}-near-me/`,
        lastmod: lastMod,
        priority: '0.9',
        changefreq: 'weekly'
      })),
      ...VENDOR_TYPES.map(t => ({
        url: `${SITE_URL}/${t.toLowerCase().replace(/\s+/g, '-')}-near-me/`,
        lastmod: lastMod,
        priority: '0.9',
        changefreq: 'weekly'
      })),
      ...EVENT_SUGGESTIONS.slice(0, 40).map(e => ({
        url: `${SITE_URL}/${e.toLowerCase().replace(/[\s/]+/g, '-')}-venue-near-me/`,
        lastmod: lastMod,
        priority: '0.9',
        changefreq: 'weekly'
      }))
    ];
  }

  // --- 2. SEO SITEMAP ---
  else if (sitemapId === 'seo') {
    const lastMod = new Date().toISOString();
    GUJARAT_CITIES.forEach(city => {
      const citySlug = city.toLowerCase().replace(/\s+/g, '-');
      VENUE_TYPES.forEach(type => {
        urls.push({
          url: `${SITE_URL}/${citySlug}/${type.toLowerCase().replace(/\s+/g, '-')}/`,
          lastmod: lastMod,
          priority: '0.7',
          changefreq: 'weekly'
        });
      });
      VENDOR_TYPES.forEach(type => {
        urls.push({
          url: `${SITE_URL}/${citySlug}/vendors/${type.toLowerCase().replace(/\s+/g, '-')}/`,
          lastmod: lastMod,
          priority: '0.7',
          changefreq: 'weekly'
        });
      });
    });
  }

  // --- 3. VENUES SITEMAP ---
  else if (sitemapId === 'venues') {
    const { data: venues } = await supabase
      .from('venues')
      .select('slug, city, created_at')
      .eq('is_active', true)
      .eq('is_approved', true);

    urls = (venues || []).map(v => ({
      url: `${SITE_URL}/${v.city?.toLowerCase().replace(/\s+/g, '-') || 'gujarat'}/${v.slug}/`,
      lastmod: new Date(v.created_at || new Date()).toISOString(),
      priority: '0.6',
      changefreq: 'monthly'
    }));
  }

  // --- 4. VENDORS SITEMAP ---
  else if (sitemapId === 'vendors') {
    const { data: vendors } = await supabase
      .from('vendors')
      .select('slug, city, created_at')
      .eq('is_active', true)
      .eq('is_approved', true);

    urls = (vendors || []).map(v => ({
      url: `${SITE_URL}/${v.city?.toLowerCase().replace(/\s+/g, '-') || 'gujarat'}/vendors/${v.slug}/`,
      lastmod: new Date(v.created_at || new Date()).toISOString(),
      priority: '0.6',
      changefreq: 'monthly'
    }));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(item => `
  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
