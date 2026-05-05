import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GUJARAT_CITIES, VENUE_TYPES, VENDOR_TYPES, EVENT_SUGGESTIONS } from '@/lib/constants';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const host = request.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  
  // Force localhost if we are testing locally, otherwise use env or fallback
  const currentSiteUrl = host?.includes('localhost') 
    ? `${protocol}://${host}` 
    : (process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`);
  
  const { slug } = await params;
  const sitemapId = slug.replace('.xml', '');
  const supabase = await createClient();

  let urls: { url: string; lastmod: string; priority: string; changefreq: string }[] = [];

  // --- 1. MAIN SITEMAP ---
  if (sitemapId === 'main') {
    const lastMod = new Date().toISOString();
    urls = [
      { url: currentSiteUrl, lastmod: lastMod, priority: '1.0', changefreq: 'daily' },
      { url: `${currentSiteUrl}/about`, lastmod: lastMod, priority: '0.5', changefreq: 'monthly' },
      { url: `${currentSiteUrl}/contact`, lastmod: lastMod, priority: '0.5', changefreq: 'monthly' },
      { url: `${currentSiteUrl}/list-venue`, lastmod: lastMod, priority: '0.8', changefreq: 'monthly' },
      { url: `${currentSiteUrl}/list-vendor`, lastmod: lastMod, priority: '0.8', changefreq: 'monthly' },
      { url: `${currentSiteUrl}/blog`, lastmod: lastMod, priority: '0.7', changefreq: 'daily' },
      ...VENUE_TYPES.map(t => ({
        url: `${currentSiteUrl}/${t.toLowerCase().replace(/\s+/g, '-')}-near-me/`,
        lastmod: lastMod,
        priority: '0.9',
        changefreq: 'weekly'
      })),
      ...VENDOR_TYPES.map(t => ({
        url: `${currentSiteUrl}/${t.toLowerCase().replace(/\s+/g, '-')}-near-me/`,
        lastmod: lastMod,
        priority: '0.9',
        changefreq: 'weekly'
      })),
      ...EVENT_SUGGESTIONS.slice(0, 40).map(e => ({
        url: `${currentSiteUrl}/${e.toLowerCase().replace(/[\s/]+/g, '-')}-venue-near-me/`,
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
          url: `${currentSiteUrl}/${citySlug}/${type.toLowerCase().replace(/\s+/g, '-')}/`,
          lastmod: lastMod,
          priority: '0.7',
          changefreq: 'weekly'
        });
      });
      VENDOR_TYPES.forEach(type => {
        urls.push({
          url: `${currentSiteUrl}/${citySlug}/vendors/${type.toLowerCase().replace(/\s+/g, '-')}/`,
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
      url: `${currentSiteUrl}/${v.city?.toLowerCase().replace(/\s+/g, '-') || 'gujarat'}/${v.slug}/`,
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
      url: `${currentSiteUrl}/${v.city?.toLowerCase().replace(/\s+/g, '-') || 'gujarat'}/vendors/${v.slug}/`,
      lastmod: new Date(v.created_at || new Date()).toISOString(),
      priority: '0.6',
      changefreq: 'monthly'
    }));
  }

  if (urls.length === 0) return new NextResponse('Sitemap not found', { status: 404 });

  // CRITICAL: NO WHITESPACE BEFORE THE XML TAG
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
</urlset>`.trim();

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
