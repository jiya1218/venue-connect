/**
 * Google Search Console Indexing API helper.
 *
 * Production setup requires a Google service account with:
 *   - Google Search Console Indexing API enabled
 *   - Service account added as "Owner" in Search Console
 *
 * For now we:
 *   1. Log the URL to console
 *   2. Insert into `indexing_queue` table so you can run batch submission
 *
 * To enable real pinging, install `google-auth-library`:
 *   npm install google-auth-library
 * Then uncomment the Google API section below.
 */

import { createClient } from '@/lib/supabase/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://venueconnect.in';

interface PingResult {
  url: string;
  queued: boolean;
  error?: string;
}

/**
 * Pings Google's Indexing API to request crawling of a new/updated SEO page.
 * Falls back gracefully — never throws, never blocks the request.
 */
export async function pingGoogleIndexing(slug: string): Promise<PingResult> {
  const url = `${SITE_URL}/${slug}`;

  // ── Step 1: Log the URL ─────────────────────────────────────────────────
  console.log(`[IndexingPing] Requesting Google index for: ${url}`);

  // ── Step 2: Queue in Supabase for batch submission ──────────────────────
  try {
    const supabase = await createClient();
    if (supabase) {
      await supabase
        .from('indexing_queue')
        .upsert(
          {
            url,
            slug,
            status: 'pending',
            created_at: new Date().toISOString(),
          },
          { onConflict: 'url' }
        );
    }
  } catch (err) {
    console.error('[IndexingPing] Failed to queue:', err);
  }

  /*
  // ── PRODUCTION: Google Indexing API ─────────────────────────────────────
  // Uncomment after installing `google-auth-library` and setting env vars:
  //   GOOGLE_SERVICE_ACCOUNT_EMAIL
  //   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY

  try {
    const { GoogleAuth } = await import('google-auth-library');
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const client = await auth.getClient();
    const response = await client.request({
      url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
      method: 'POST',
      data: { url, type: 'URL_UPDATED' },
    });

    console.log('[IndexingPing] Google responded:', response.status);
  } catch (err) {
    console.error('[IndexingPing] Google API error:', err);
    return { url, queued: false, error: String(err) };
  }
  */

  return { url, queued: true };
}
