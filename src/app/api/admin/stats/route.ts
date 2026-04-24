import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  try {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // 1. Total Venues
    const { count: totalVenues, error: vError } = await supabase
      .from('venues')
      .select('*', { count: 'exact', head: true });

    // 2. Total Vendors
    const { count: totalVendors, error: vrError } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true });

    // 3. Pending Applications
    const { count: pendingApplications, error: aError } = await supabase
      .from('venue_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // 4. New This Week (Venues + Vendors)
    const { count: newVenues, error: nvError } = await supabase
        .from('venues')
        .select('*', { count: 'exact', head: true })
        .gt('created_at', lastWeek);
    
    const { count: newVendors, error: nvrError } = await supabase
        .from('vendors')
        .select('*', { count: 'exact', head: true })
        .gt('created_at', lastWeek);

    if (vError || vrError || aError || nvError || nvrError) throw new Error("Database error");

    // 5. Recent Activity (Last 10 status changes)
    const { data: activity } = await supabase
        .from('venue_applications')
        .select('id, business_name, status, created_at, venue_type')
        .neq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

    return NextResponse.json({
      totalVenues: totalVenues || 0,
      totalVendors: totalVendors || 0,
      pendingApplications: pendingApplications || 0,
      newThisWeek: (newVenues || 0) + (newVendors || 0),
      recentActivity: activity || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
