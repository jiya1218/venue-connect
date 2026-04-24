import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { vendorFormSchema } from '@/lib/forms/schemas';
import { slugify } from '@/lib/seo/slugify';
import { generateSEOPage } from '@/lib/seo/pageGenerator';
import { checkRateLimit, pruneRateLimitStore } from '@/lib/rateLimit';
import { sendSubmissionConfirmation } from '@/lib/email';

export async function POST(req: NextRequest) {
  // ── 1. Rate limiting ──────────────────────────────────────────────────────
  pruneRateLimitStore();

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  const { allowed, remaining, resetIn } = checkRateLimit(ip);

  if (!allowed) {
    const minutes = Math.ceil(resetIn / 60000);
    return NextResponse.json(
      {
        error: `Too many submissions. You can submit again in ${minutes} minute(s).`,
        retryAfterMs: resetIn,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(resetIn / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // ── 2. Parse + validate body ──────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = vendorFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // ── 3. Connect to Supabase ────────────────────────────────────────────────
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }

  // ── 4. Resolve slugs for category / city / area ───────────────────────────
  const [catResult, cityResult, areaResult] = await Promise.all([
    supabase.from('categories').select('slug, name').eq('id', data.category_id).maybeSingle(),
    supabase.from('locations').select('city_slug, city').eq('id', data.city_id).maybeSingle(),
    supabase.from('locations').select('area_slug, area').eq('id', data.area_id).maybeSingle(),
  ]);

  const catRow = catResult.data;
  const cityRow = cityResult.data;
  const areaRow = areaResult.data;

  // ── 5. Build vendor slug ──────────────────────────────────────────────────
  const vendorSlug = slugify(data.name);

  const contact_json = {
    name: data.contact_name,
    phone: data.contact_phone,
    email: data.contact_email,
    website: data.website || null,
  };

  const meta_title = `${data.name} — ${catRow?.name ?? 'Service'} in ${cityRow?.city ?? ''} | VenueConnect`;
  const meta_description = data.description.slice(0, 160);

  // ── 6. Insert vendor row ──────────────────────────────────────────────────
  const { data: vendor, error: insertError } = await supabase
    .from('vendors')
    .insert({
      name: data.name,
      slug: vendorSlug,
      description: data.description,
      category_id: data.category_id,
      city_id: data.city_id,
      area_id: data.area_id,
      images: data.images,
      price_range: data.price_range,
      experience_years: data.experience_years ?? null,
      contact_json,
      is_verified: false,
      is_active: false,
      meta_title,
      meta_description,
    })
    .select('id, slug')
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      return NextResponse.json(
        { error: 'A vendor with this name already exists. Please choose a different name.' },
        { status: 409 }
      );
    }
    console.error('[submit-vendor] DB insert error:', insertError.message);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // ── 7. Generate both city-level and area-level SEO pages ─────────────────
  const seoPages: string[] = [];

  if (catRow?.slug && cityRow?.city_slug) {
    // City-level: e.g. "wedding-photographers-in-surat"
    const cityPagePromise = generateSEOPage(
      catRow.slug,
      data.category_id,
      cityRow.city_slug,
      data.city_id
    );

    // Area-level: e.g. "wedding-photographers-in-adajan"
    const areaPagePromise = areaRow?.area_slug
      ? generateSEOPage(
          catRow.slug,
          data.category_id,
          cityRow.city_slug,
          data.city_id,
          areaRow.area_slug,
          data.area_id
        )
      : Promise.resolve(null);

    const [cityPage, areaPage] = await Promise.allSettled([cityPagePromise, areaPagePromise]);

    if (cityPage.status === 'fulfilled' && cityPage.value?.slug) {
      seoPages.push(cityPage.value.slug);
    }
    if (areaPage.status === 'fulfilled' && areaPage.value?.slug) {
      seoPages.push(areaPage.value.slug);
    }
  }

  // ── 8. Send confirmation email ────────────────────────────────────────────
  sendSubmissionConfirmation({
    to: data.contact_email,
    name: data.contact_name,
    listingName: data.name,
    type: 'vendor',
    slug: vendor.slug,
  }).catch((e) => console.error('[Email] Failed to send:', e));

  // ── 9. Return success ─────────────────────────────────────────────────────
  return NextResponse.json(
    {
      success: true,
      slug: vendor.slug,
      vendor_id: vendor.id,
      message: 'Submitted! Our team will review and publish within 24 hours.',
      seoPages,
      rateLimitRemaining: remaining,
    },
    { status: 201 }
  );
}
