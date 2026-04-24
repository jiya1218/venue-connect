const XLSX = require('xlsx');

try {
    const workbook = XLSX.readFile('./VenueConnect_SEO_Pages.xlsx');
    const sheet = workbook.Sheets['Ahmedabad'];
    const rows = XLSX.utils.sheet_to_json(sheet);
    
    const events = new Set();
    const vendors = new Set();
    const venues = new Set();
    
    rows.forEach(row => {
        const title = row['__EMPTY'] || ""; // The "__EMPTY" column usually has the text like "Wedding Venues in Ahmedabad"
        
        if (title.includes(' Venues in Ahmedabad')) {
            const eventMatch = title.match(/(.*) Venues in Ahmedabad/);
            if (eventMatch) events.add(eventMatch[1].trim());
        } else if (title.includes(' in Ahmedabad')) {
            const parts = title.split(' in Ahmedabad');
            const category = parts[0].trim();
            // Distinguish between venue types and vendors
            const venueTypes = ["Banquet Halls", "Party Plots", "Hotels", "Resorts", "Restaurants", "Farmhouses", "Clubs", "Cafes", "Lawns", "Marriage Halls", "Conference Rooms"];
            if (venueTypes.includes(category)) {
                venues.add(category);
            } else {
                vendors.add(category);
            }
        }
    });

    console.log(JSON.stringify({
        venues: Array.from(venues),
        vendors: Array.from(vendors),
        events: Array.from(events)
    }, null, 2));
} catch (error) {
    console.error(error);
}
