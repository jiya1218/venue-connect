const XLSX = require('xlsx');
const fs = require('fs');

async function extractSEO() {
  const workbook = XLSX.readFile('VenueConnect_SEO_Pages.xlsx');
  const allData = {};
  
  workbook.SheetNames.forEach(name => {
    // Only process city sheets and summary
    if (name === 'Summary & Legend' || !['Venue Types', 'Vendor Categories', 'Event Types', 'Cities (All Gujarat)'].includes(name)) {
      const sheet = workbook.Sheets[name];
      allData[name] = XLSX.utils.sheet_to_json(sheet);
    }
  });

  fs.writeFileSync('full_seo_data.json', JSON.stringify(allData, null, 2));
  console.log('Extracted to full_seo_data.json');
}

extractSEO().catch(console.error);
