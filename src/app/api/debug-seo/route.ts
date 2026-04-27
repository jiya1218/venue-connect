import { NextResponse } from 'next/server';
import { getSEOPageBySlug } from '@/lib/seo/pageGenerator';

export async function GET() {
  const testSlug = 'surat/wedding-venues';
  const page = await getSEOPageBySlug(testSlug);
  
  return NextResponse.json({
    current_supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    using_service_role: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    test_lookup_slug: testSlug,
    found_in_db: !!page,
    page_data: page ? {
      title: page.custom_content?.pageTitle || page.custom_content?.metaTitle,
      keywords: page.custom_content?.keyword
    } : null
  });
}
