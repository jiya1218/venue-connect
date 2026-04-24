const XLSX = require('xlsx');

try {
    const workbook = XLSX.readFile('./VenueConnect_SEO_Pages.xlsx');
    console.log(JSON.stringify(workbook.SheetNames, null, 2));
} catch (error) {
    console.error("Error reading xlsx:", error);
}
