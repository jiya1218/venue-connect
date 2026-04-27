const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://lfkwwyeemrvwyahtzwji.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxma3d3eWVlbXJ2d3lhaHR6d2ppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjkxMzgxMCwiZXhwIjoyMDkyNDg5ODEwfQ.BI_PsDkbd8zZicQD6AkC99f6p_uApQLo6PVwlWhUL1w'
);

async function cleanSlugs(table) {
    console.log(`\n--- Cleaning ${table} ---`);
    const { data, error } = await supabase.from(table).select('id, slug, name');
    
    if (error) {
        console.error(`Error fetching ${table}:`, error);
        return;
    }

    console.log(`Found ${data.length} records in ${table}`);

    const updates = [];
    const usedSlugs = new Set();

    for (const item of data) {
        // Pattern: remove a trailing hyphen followed by 10-15 digits
        let cleanSlug = item.slug.replace(/-\d{10,15}$/, '');
        
        // Ensure uniqueness
        let finalSlug = cleanSlug;
        let counter = 2;
        while (usedSlugs.has(finalSlug)) {
            finalSlug = `${cleanSlug}-${counter}`;
            counter++;
        }
        
        usedSlugs.add(finalSlug);

        if (finalSlug !== item.slug) {
            updates.push({ id: item.id, slug: finalSlug });
        }
    }

    console.log(`Detected ${updates.length} slugs needing cleanup...`);

    // Perform updates in batches of 50 to avoid timeouts
    for (let i = 0; i < updates.length; i += 50) {
        const batch = updates.slice(i, i + 50);
        const { error: updateError } = await supabase.from(table).upsert(batch);
        if (updateError) {
            console.error(`Error updating batch in ${table}:`, updateError);
        } else {
            console.log(`Updated batch ${Math.floor(i/50) + 1}/${Math.ceil(updates.length/50)}`);
        }
    }
}

async function run() {
    await cleanSlugs('vendors');
    await cleanSlugs('venues');
    console.log('\n--- Cleanup Complete! ---');
}

run();
