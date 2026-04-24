import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a public Supabase client that DOES NOT read cookies.
 * This is safe to use within Next.js ISR (revalidate) paths 
 * where reading cookies() would throw a DynamicServerError or 500 error.
 */
export async function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createSupabaseClient(url, key);
}
