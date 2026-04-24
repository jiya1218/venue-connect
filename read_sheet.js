import * as XLSX from 'xlsx';
import * as fs from 'fs';

try {
    const workbook = XLSX.readFile('./VenueConnect_SEO_Pages.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    console.log(JSON.stringify(json, null, 2));
} catch (error) {
    console.error("Error reading xlsx:", error);
}
