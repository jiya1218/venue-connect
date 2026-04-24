const XLSX = require('xlsx');

try {
    const workbook = XLSX.readFile('./VenueConnect_SEO_Pages.xlsx');
    const sheet = workbook.Sheets['Ahmedabad'];
    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(JSON.stringify(data.slice(0, 10), null, 2));
} catch (error) {
    console.error("Error reading Ahmedabad sheet:", error);
}
