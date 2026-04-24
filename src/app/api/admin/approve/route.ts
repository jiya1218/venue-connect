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
      city: app.city,
      address: app.address,
      images: app.images || (app.image_url ? [app.image_url] : []),
      image: app.images?.[0] || app.image_url,
      description: app.description,
      owner_id: app.user_id,
      starting_price: app.starting_price || app.veg_price_per_plate || app.price_per_plate || 0,
    };

    let specificData = {};
    if (isVendor) {
      specificData = {
        category: app.vendor_category || 'Other',
      };
    } else {
      specificData = {
        type: app.venue_type,
        min_capacity: app.min_capacity || 0,
        max_capacity: app.max_capacity || app.capacity || 0,
        rooms_count: app.rooms_count || 0,
        veg_price_per_plate: app.veg_price_per_plate || app.price_per_plate || 0,
        nonveg_price_per_plate: app.nonveg_price_per_plate || 0,
        has_ac: app.has_ac || false,
        has_wifi: app.has_wifi || false,
        alcohol_served: app.alcohol_served || false,
        cuisines: app.cuisines || [],
        amenities: app.amenities || [],
        indoor_spaces: app.indoor_spaces || 0,
        outdoor_spaces: app.outdoor_spaces || 0,
        payment_methods: app.payment_methods || [],
        catering_policy: app.catering_policy || '',
        advance_payment_percentage: app.advance_payment_percentage || 0,
        operating_hours: app.operating_hours || '',
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
      return NextResponse.json({ error: 'Failed to migrate data' }, { status: 500 });
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
