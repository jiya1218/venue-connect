import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  try {
    // Fetch cities from all 3 relevant tables
    const { data: venues } = await supabase.from('venues').select('city');
    const { data: vendors } = await supabase.from('vendors').select('city');
    const { data: pending } = await supabase.from('venue_applications').select('city').eq('status', 'pending');

    const counts: Record<string, { venues: number; vendors: number; pending: number; total: number }> = {};

    const normalize = (city: string | null) => {
        if (!city) return null;
        const c = city.trim();
        if (!c) return null;
        return c.charAt(0).toUpperCase() + c.slice(1).toLowerCase();
    };

    venues?.forEach(v => {
        const city = normalize(v.city);
        if (!city) return;
        if (!counts[city]) counts[city] = { venues: 0, vendors: 0, pending: 0, total: 0 };
        counts[city].venues++;
        counts[city].total++;
    });

    vendors?.forEach(v => {
        const city = normalize(v.city);
        if (!city) return;
        if (!counts[city]) counts[city] = { venues: 0, vendors: 0, pending: 0, total: 0 };
        counts[city].vendors++;
        counts[city].total++;
    });

    pending?.forEach(v => {
        const city = normalize(v.city);
        if (!city) return;
        if (!counts[city]) counts[city] = { venues: 0, vendors: 0, pending: 0, total: 0 };
        counts[city].pending++;
    });

    return NextResponse.json(counts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
