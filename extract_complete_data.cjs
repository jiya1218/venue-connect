const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'c:\\one drive folder\\Desktop\\scalezix\\VenueConnect_SEO_Pages (1).xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  const output = {
    cities: new Set(),
    pages: [],
    pageTypes: new Set()
  };

  // Skip Summary sheet, process all city sheets
  workbook.SheetNames.slice(1).forEach((sheetName) => {
    if (sheetName === 'Summary & Legend') return;

    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Extract city name
    const city = sheetName;
    output.cities.add(city);

    // Process rows
    rawData.forEach((row, idx) => {
      // Skip header rows (contain words like "EVENT", "VENDOR", "VENUE")
      if (!row["__EMPTY"]) return;

      const pageType = row["VenueConnect — SEO Pages: " + sheetName] || row["VenueConnect — SEO Pages: Near Me (All Gujarat)"] || 'unknown';
      const pageTitle = row["__EMPTY"] || '';
      const urlSlug = row["__EMPTY_1"] || '';
      const metaTitle = row["__EMPTY_2"] || '';
      const metaDesc = row["__EMPTY_3"] || '';
      const h1Tag = row["__EMPTY_4"] || '';
      const keyword = row["__EMPTY_5"] || '';
      const secondaryKeywords = row["__EMPTY_6"] || '';
      const searchIntent = row["__EMPTY_7"] || '';
      const priority = row["__EMPTY_8"] || '';

      if (urlSlug && urlSlug.startsWith('/')) {
        output.pageTypes.add(pageType);
        output.pages.push({
          city,
          pageType,
          pageTitle,
          urlSlug,
          metaTitle,
          metaDesc,
          h1Tag,
          keyword,
          secondaryKeywords,
          searchIntent,
          priority
        });
      }
    });
  });

  const result = {
    totalPages: output.pages.length,
    totalCities: output.cities.size,
    cities: Array.from(output.cities).sort(),
    pageTypes: Array.from(output.pageTypes).sort(),
    pages: output.pages
  };

  fs.writeFileSync(
    'c:/Users/jiyap/Downloads/(1)/1/extracted_seo_data_complete.json',
    JSON.stringify(result, null, 2)
  );

  console.log('✅ Extraction complete!');
  console.log(`Total pages: ${result.totalPages}`);
  console.log(`Total cities: ${result.totalCities}`);
  console.log(`Page types: ${result.pageTypes.join(', ')}`);
  console.log(`\nCities: ${result.cities.join(', ')}`);
} catch (error) {
  console.error('Error:', error.message);
}
