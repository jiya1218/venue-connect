const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://lfkwwyeemrvwyahtzwji.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxma3d3eWVlbXJ2d3lhaHR6d2ppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjkxMzgxMCwiZXhwIjoyMDkyNDg5ODEwfQ.BI_PsDkbd8zZicQD6AkC99f6p_uApQLo6PVwlWhUL1w'
);

async function cleanSlugs(table) {
    console.log(`\n--- Cleaning ${table} ---`);
    const { data, error } = await supabase.from(table).select('id, slug');
    
    if (error) {
        console.error(`Error fetching ${table}:`, error);
        return;
    }

    const updates = [];
    const usedSlugs = new Set();

    for (const item of data) {
        let cleanSlug = item.slug.replace(/-\d{10,15}$/, '');
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

    console.log(`Updating ${updates.length} records...`);

    for (const update of updates) {
        const { error: updateError } = await supabase
            .from(table)
            .update({ slug: update.slug })
            .eq('id', update.id);
            
        if (updateError) {
            console.error(`Error updating ID ${update.id}:`, updateError);
        }
    }
    console.log(`Finished ${table}`);
}

async function run() {
    await cleanSlugs('vendors');
    await cleanSlugs('venues');
    console.log('\n--- ALL URLS CLEANED! ---');
}

run();
