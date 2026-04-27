const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://lfkwwyeemrvwyahtzwji.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxma3d3eWVlbXJ2d3lhaHR6d2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MTM4MTAsImV4cCI6MjA5MjQ4OTgxMH0.LcGU0p3cYQIHWn2Z654MU7jOWyreKdoWNn62Iid35TY'
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
