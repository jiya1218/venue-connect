import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  try {
    // Optimization: Instead of fetching all rows, we fetch only the city column
    // and use a smaller dataset. In a real production app, this should be an RPC or a View.
    // For now, we'll at least use a more focused selection.
    
    // We can use a single query with a 'count' transform in some Supabase versions, 
    // but the most reliable way to get counts by city without RPC is to fetch just the city column.
    // We also add a cache header to this response.

    const [{ data: venues }, { data: vendors }, { data: pending }] = await Promise.all([
        supabase.from('venues').select('city'),
        supabase.from('vendors').select('city'),
        supabase.from('venue_applications').select('city').eq('status', 'pending')
    ]);

    const counts: Record<string, { venues: number; vendors: number; pending: number; total: number }> = {};

    const normalize = (city: string | null) => {
        if (!city) return null;
        const c = city.trim();
        if (!c) return null;
        return c.charAt(0).toUpperCase() + c.slice(1).toLowerCase();
    };

    venues?.forEach((v: any) => {
        const city = normalize(v.city);
        if (!city) return;
        if (!counts[city]) counts[city] = { venues: 0, vendors: 0, pending: 0, total: 0 };
        counts[city].venues++;
        counts[city].total++;
    });

    vendors?.forEach((v: any) => {
        const city = normalize(v.city);
        if (!city) return;
        if (!counts[city]) counts[city] = { venues: 0, vendors: 0, pending: 0, total: 0 };
        counts[city].vendors++;
        counts[city].total++;
    });

    pending?.forEach((v: any) => {
        const city = normalize(v.city);
        if (!city) return;
        if (!counts[city]) counts[city] = { venues: 0, vendors: 0, pending: 0, total: 0 };
        counts[city].pending++;
    });

    const response = NextResponse.json(counts);
    
    // Cache the response for 1 hour (3600 seconds) to reduce DB load
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59');
    
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
