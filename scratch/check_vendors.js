const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkData() {
    const { data, error } = await supabase
        .from('vendors')
        .select('name, image, images, rating, is_approved, slug')
        .order('rating', { ascending: false })
        .limit(10);
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    console.log(JSON.stringify(data, null, 2));
}

checkData();
