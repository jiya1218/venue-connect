const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'c:\\one drive folder\\Desktop\\scalezix\\VenueConnect_SEO_Pages (1).xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  console.log('=== SHEETS IN WORKBOOK ===\n');

  workbook.SheetNames.forEach((sheetName) => {
    console.log(`\n========== SHEET: ${sheetName} ==========\n`);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(JSON.stringify(data, null, 2));
  });
} catch (error) {
  console.error('Error reading Excel file:', error.message);
}
