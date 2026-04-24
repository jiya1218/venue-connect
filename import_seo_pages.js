/**
 * SEO Pages Bulk Import Script
 * Imports all 8,089 pages from Excel extract into Supabase
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Load extracted data
const extractedData = JSON.parse(
  fs.readFileSync('c:/Users/jiyap/Downloads/(1)/1/extracted_seo_data_complete.json', 'utf8')
);

// Supabase config (from your .env.local)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function importSEOPages() {
  console.log('🚀 Starting SEO Pages import...');
  console.log(`📊 Total pages to import: ${extractedData.totalPages}`);

  try {
    // Step 1: Get all city IDs
    console.log('\n1️⃣ Fetching city mappings...');
    const { data: cities, error: citiesError } = await supabase
      .from('locations')
      .select('id, city, city_slug');

    if (citiesError) throw new Error(`Cities fetch failed: ${citiesError.message}`);

    const cityMap = {};
    cities.forEach(city => {
      cityMap[city.city] = city.id;
    });

    console.log(`✅ Found ${cities.length} cities`);

    // Step 2: Prepare pages for bulk insert
    console.log('\n2️⃣ Preparing pages for import...');
    const pagesToInsert = extractedData.pages.map(page => {
      const slug = page.urlSlug.replace(/^\/|\/$/g, ''); // Remove leading/trailing slashes

      return {
        slug,
        page_type: page.pageType,
        city_id: cityMap[page.city] || null,
        custom_content: {
          pageTitle: page.pageTitle,
          metaTitle: page.metaTitle,
          metaDesc: page.metaDesc,
          h1Tag: page.h1Tag,
          keyword: page.keyword,
          secondaryKeywords: page.secondaryKeywords,
          searchIntent: page.searchIntent,
          priority: page.priority
        }
      };
    });

    console.log(`✅ Prepared ${pagesToInsert.length} pages`);

    // Step 3: Bulk insert in chunks (Supabase has batch limits)
    console.log('\n3️⃣ Inserting pages into database...');
    const BATCH_SIZE = 500;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < pagesToInsert.length; i += BATCH_SIZE) {
      const batch = pagesToInsert.slice(i, i + BATCH_SIZE);
      const progress = Math.min(i + BATCH_SIZE, pagesToInsert.length);

      const { error: insertError } = await supabase
        .from('seo_pages')
        .insert(batch, { onConflict: 'slug' });

      if (insertError) {
        console.error(`❌ Batch ${i / BATCH_SIZE + 1} failed:`, insertError.message);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
        console.log(`✅ Progress: ${progress}/${pagesToInsert.length}`);
      }

      // Rate limiting
      await new Promise(r => setTimeout(r, 500));
    }

    // Step 4: Verify
    console.log('\n4️⃣ Verifying import...');
    const { count: totalPages, error: countError } = await supabase
      .from('seo_pages')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    console.log('\n✅ IMPORT COMPLETE!');
    console.log(`📊 Total pages in database: ${totalPages}`);
    console.log(`✨ Successfully imported: ${successCount}`);
    if (errorCount > 0) console.log(`⚠️  Errors: ${errorCount}`);

    // Show sample data
    const { data: samples } = await supabase
      .from('seo_pages')
      .select('*')
      .limit(3);

    console.log('\n📝 Sample pages:');
    samples.forEach((page, i) => {
      console.log(`  ${i + 1}. ${page.slug}`);
      console.log(`     Type: ${page.page_type}`);
      console.log(`     Priority: ${page.custom_content.priority}`);
    });

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Run import
importSEOPages();
