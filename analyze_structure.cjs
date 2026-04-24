const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'c:\\one drive folder\\Desktop\\scalezix\\VenueConnect_SEO_Pages (1).xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  const structure = {
    sheets: [],
    totalRows: 0
  };

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    structure.sheets.push({
      name: sheetName,
      rowCount: data.length,
      columns: data.length > 0 ? Object.keys(data[0]) : [],
      sampleRow: data.length > 2 ? data[2] : null
    });

    structure.totalRows += data.length;
  });

  console.log(JSON.stringify(structure, null, 2));
} catch (error) {
  console.error('Error:', error.message);
}
