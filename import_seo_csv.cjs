const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function importAll() {
  const csvDir = path.join(__dirname, 'seo page csv');
  const files = fs.readdirSync(csvDir).filter(f => f.endsWith('.csv'));

  console.log('Deleting all existing rows in seo_pages...');
  // We can't delete all without a filter, so we use not.eq
  const { error: deleteError } = await supabase.from('seo_pages').delete().not('id', 'eq', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Error deleting rows:', deleteError);
    return;
  }
  console.log('Successfully cleared seo_pages.');

  let totalUpserted = 0;

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(csvDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse CSV
    const records = parse(fileContent, {
      skip_empty_lines: true,
      relax_column_count: true
    });

    let headerRowIndex = -1;
    for (let i = 0; i < records.length; i++) {
      if (records[i][0] === 'Page Type' && records[i][1] === 'Page Title') {
        headerRowIndex = i;
        break;
      }
    }

    if (headerRowIndex === -1) {
      console.warn(`Could not find header row in ${file}, skipping.`);
      continue;
    }

    const dataRows = records.slice(headerRowIndex + 1);
    
    // Some sheets might have sub-headers (like "VENDOR + CITY PAGES,,,,") which we should skip.
    // A valid row will have a URL Slug in index 2 that starts with '/' or contains '/'.
    const validRows = dataRows.filter(row => row[2] && row[2].trim().includes('/'));

    const batch = validRows.map(row => {
      const pageTypeRaw = row[0] ? row[0].trim() : '';
      const pageTitle = row[1] ? row[1].trim() : '';
      let urlSlug = row[2] ? row[2].trim() : '';
      const metaTitle = row[3] ? row[3].trim() : '';
      const metaDesc = row[4] ? row[4].trim() : '';
      const h1Tag = row[5] ? row[5].trim() : '';
      const keyword = row[6] ? row[6].trim() : '';
      const secondaryKeywords = row[7] ? row[7].trim() : '';
      const searchIntent = row[8] ? row[8].trim() : '';
      const priority = row[9] ? row[9].trim() : '';

      // Clean slug: remove leading and trailing slashes
      urlSlug = urlSlug.replace(/^\/+|\/+$/g, '');

      // Determine simple page_type for DB
      let dbPageType = 'city';
      if (pageTypeRaw.toLowerCase().includes('area')) dbPageType = 'area';
      if (pageTypeRaw.toLowerCase().includes('near me')) dbPageType = 'category';

      return {
        slug: urlSlug,
        page_type: dbPageType,
        custom_content: {
          pageTypeRaw,
          pageTitle,
          metaTitle,
          metaDesc: metaDesc,
          h1Tag,
          keyword,
          secondaryKeywords,
          searchIntent,
          priority
        },
        last_generated: new Date().toISOString()
      };
    });

    // Upsert in batches of 500
    for (let i = 0; i < batch.length; i += 500) {
      const chunk = batch.slice(i, i + 500);
      const { error } = await supabase.from('seo_pages').upsert(chunk, { onConflict: 'slug' });
      if (error) {
        console.error(`Error inserting chunk from ${file}:`, error);
      } else {
        totalUpserted += chunk.length;
      }
    }
    console.log(`Finished ${file}. Upserted ${batch.length} rows.`);
  }

  console.log(`Done! Successfully inserted ${totalUpserted} total rows.`);
}

importAll();
