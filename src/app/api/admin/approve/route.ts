import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Fetch the application details
    const { data: app, error: appError } = await supabase
      .from('venue_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appError || !app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // 2. Determine target table and map data
    const isVendor = app.venue_type === 'vendor';
    const targetTable = isVendor ? 'vendors' : 'venues';

    const commonData = {
      name: app.business_name,
      slug: app.business_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      city: app.city,
      location: app.address,
      address: app.address,
      images: app.images || (app.image_url ? [app.image_url] : []),
      image: app.images?.[0] || app.image_url,
      description: app.description,
      owner_id: app.user_id,
      starting_price: app.starting_price || app.veg_price_per_plate || app.price_per_plate || 0,
      rating: 0,
      reviews: 0,
      is_approved: true,
      is_active: true,
      is_verified: true
    };

    const getLeadsQuota = (plan: string) => {
      switch(plan?.toLowerCase()) {
        case 'starter': return 50;
        case 'growth': return 150;
        case 'premium': return 999999;
        default: return 50;
      }
    };

    let specificData = {};
    if (isVendor) {
      specificData = {
        category: app.vendor_category || 'Other',
        selected_plan: app.selected_plan || 'Starter',
        leads_quota: getLeadsQuota(app.selected_plan),
        leads_used: 0
      };
    } else {
      specificData = {
        type: app.venue_type,
        area: app.area || '',
        min_capacity: app.min_capacity || 0,
        max_capacity: app.max_capacity || app.capacity || 0,
        food_type: app.food_type || 'veg',
        veg_price_per_plate: app.veg_price_per_plate || 0,
        nonveg_price_per_plate: app.nonveg_price_per_plate || 0,
        rooms_count: app.rooms_count || 0,
        space_info: app.space_info || {},
        occasions: app.occasions || [],
        decoration_info: app.decoration_info || {},
        liquor_info: app.liquor_info || {},
        dj_info: app.dj_info || {},
        catering_policy: app.catering_policy || '',
        booking_policy: app.booking_policy || '',
        terms_conditions: app.terms_conditions || '',
        cancellation_policy: app.cancellation_policy || '',
        parking_details: app.parking_details || {},
        amenities: app.amenities || [],
        cuisines: app.cuisines || [],
        selected_plan: app.selected_plan || 'Starter',
        leads_quota: getLeadsQuota(app.selected_plan),
        leads_used: 0
      };
    }

    // 3. Insert into the live table
    const { data: inserted, error: insertError } = await supabase
      .from(targetTable)
      .insert([{ ...commonData, ...specificData }])
      .select()
      .single();

    if (insertError) {
      console.error('Migration error:', insertError);
      return NextResponse.json({ 
        error: 'Failed to migrate data', 
        details: insertError.message,
        code: insertError.code
      }, { status: 500 });
    }

    // 4. Mark application as approved
    await supabase.from('venue_applications').update({ status: 'approved' }).eq('id', applicationId);

    // 5. [IMPORTANT] Update user role to 'owner'
    if (app.user_id) {
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'owner' })
        .eq('id', app.user_id);
      
      if (roleError) console.error('Role update error:', roleError);
    }

    return NextResponse.json({ 
      success: true, 
      message: `${app.business_name} launched successfully!`,
      listingId: inserted.id 
    });

  } catch (error: any) {
    console.error('Approval API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
