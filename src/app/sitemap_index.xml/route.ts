import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const host = request.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  
  // Force localhost if we are testing locally, otherwise use env or fallback
  const currentSiteUrl = host?.includes('localhost') 
    ? `${protocol}://${host}` 
    : (process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`);
    
  const lastMod = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${currentSiteUrl}/sitemap/main.xml</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${currentSiteUrl}/sitemap/seo.xml</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${currentSiteUrl}/sitemap/venues.xml</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${currentSiteUrl}/sitemap/vendors.xml</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
