const XLSX = require('xlsx');
const fs = require('fs');

try {
    const workbook = XLSX.readFile('./VenueConnect_SEO_Pages.xlsx');
    const allEvents = new Set();
    const allCategories = new Set();
    const allVenueTypes = new Set();
    
    // City Sheets
    const citySheets = workbook.SheetNames.filter(name => !['Summary & Legend', 'Near Me (All Gujarat)'].includes(name));
    
    citySheets.forEach(name => {
        const sheet = workbook.Sheets[name];
        const rows = XLSX.utils.sheet_to_json(sheet);
        
        rows.forEach(row => {
            const rowType = Object.values(row)[0]; // First column is type
            const title = row['__EMPTY'] || ""; // Name of page
            
            if (rowType === "Event + City") {
                const event = title.split(' Venues')[0].split(' Halls')[0].split(' Spaces')[0].trim();
                if (event) allEvents.add(event);
            } else if (rowType === "Category + City") {
                const cat = title.split(' in ')[0].trim();
                if (cat) allCategories.add(cat);
            } else if (rowType === "Venue Type + City") {
                const venueType = title.split(' in ')[0].trim();
                if (venueType) allVenueTypes.add(venueType);
            }
        });
    });

    // Cleanup: Remove "Best ", "Top ", etc if they are present
    const cleanList = (list) => Array.from(list).map(s => s.replace(/^Best |^Top |^Listing of |^Verified /, '').trim()).filter(Boolean);

    const results = {
        venueTypes: cleanList(allVenueTypes),
        vendorCategories: cleanList(allCategories).filter(c => !allVenueTypes.has(c)), // Ensure vendors are separate
        eventTypes: cleanList(allEvents)
    };

    console.log(JSON.stringify(results, null, 2));
} catch (error) {
    console.error(error);
}
