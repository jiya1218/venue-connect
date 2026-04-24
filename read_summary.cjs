const XLSX = require('xlsx');

try {
    const workbook = XLSX.readFile('./VenueConnect_SEO_Pages.xlsx');
    const sheet = workbook.Sheets['Summary & Legend'];
    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(JSON.stringify(data, null, 2));
} catch (error) {
    console.error(error);
}
