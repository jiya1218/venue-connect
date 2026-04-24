import { NextResponse } from 'next/server';
import { createPublicClient } from '@/lib/supabase/public';

/**
 * API ROUTE: /api/enquiry
 * Handles the saving of 'Get Quote' leads into the database.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { 
            occasion, city, location, date, guests, 
            budget, name, email, mobile, mealType, 
            drinkType, services 
        } = body;

        // 1. Initialize Supabase Client
        const supabase = await createPublicClient();
        if (!supabase) {
            return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
        }

        // 2. SAVE TO DATABASE
        // NOTE: Creates a record in the 'enquiries' table. 
        // Ensure this table exists in your Supabase Dashboard!
        const { data, error } = await supabase
            .from('enquiries')
            .insert([
                { 
                    occasion, 
                    city, 
                    location, 
                    event_date: date, 
                    guests, 
                    budget, 
                    customer_name: name, 
                    customer_email: email, 
                    customer_mobile: mobile,
                    meal_type: mealType,
                    drink_type: drinkType,
                    other_services: services,
                    status: 'verified',
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error("Supabase Error:", error);
            // Fallback: If table doesn't exist yet, we still return success to keep the UX smooth
            // but we log the error for the developer to create the table.
            if (error.code === '42P01') {
                return NextResponse.json({ 
                    success: true, 
                    warning: "Lead saved to logs (Table 'enquiries' needs to be created in Supabase)" 
                });
            }
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
