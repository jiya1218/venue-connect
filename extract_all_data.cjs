const XLSX = require('xlsx');
const fs = require('fs');

try {
    const workbook = XLSX.readFile('./VenueConnect_SEO_Pages.xlsx');
    const allEvents = new Set();
    const allCategories = new Set();
    
    // Skip Summary and Near Me
    const citySheets = workbook.SheetNames.filter(name => !['Summary & Legend', 'Near Me (All Gujarat)'].includes(name));
    
    citySheets.forEach(name => {
        const sheet = workbook.Sheets[name];
        const rows = XLSX.utils.sheet_to_json(sheet);
        
        rows.forEach(row => {
            const type = row['VenueConnect — SEO Pages: ' + name]; // The first column name varies
            // Actually the first column name is "VenueConnect — SEO Pages: [CityName]"
            // We can just use Object.values(row)[0]
            const typeVal = Object.values(row)[0];
            const title = row['__EMPTY'] || ""; // The "__EMPTY" column usually has the Page Name/Title
            
            if (typeVal === "Event + City") {
                // Extract event from title or row
                // Based on previous JSON: "__EMPTY" is "Pool Party Venues in Ahmedabad | VenueConnect"
                const eventPart = title.split(' Venues')[0] || title.split(' Halls')[0];
                if (eventPart) allEvents.add(eventPart.trim());
            } else if (typeVal === "Category + City") {
                const catPart = title.split(' in ')[0];
                if (catPart) allCategories.add(catPart.trim());
            }
        });
    });

    const results = {
        cities: citySheets,
        events: Array.from(allEvents),
        categories: Array.from(allCategories)
    };

    fs.writeFileSync('extracted_seo_data.json', JSON.stringify(results, null, 2));
    console.log("Extraction complete: extracted_seo_data.json");
} catch (error) {
    console.error("Error extracting data:", error);
}
