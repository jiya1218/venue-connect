const XLSX = require('xlsx');
const fs = require('fs');

try {
    const workbook = XLSX.readFile('./VenueConnect_SEO_Pages.xlsx');
    
    // 1. Get Categories (Venues & Vendors)
    const venueSheet = workbook.Sheets['Venue Types'];
    const venueData = venueSheet ? XLSX.utils.sheet_to_json(venueSheet) : [];
    
    const vendorSheet = workbook.Sheets['Vendor Categories'];
    const vendorData = vendorSheet ? XLSX.utils.sheet_to_json(vendorSheet) : [];
    
    // 2. Get Event Types
    const eventSheet = workbook.Sheets['Event Types'];
    const eventData = eventSheet ? XLSX.utils.sheet_to_json(eventSheet) : [];
    
    // 3. Get Cities
    const citySheet = workbook.Sheets['Cities (All Gujarat)'];
    const cityData = citySheet ? XLSX.utils.sheet_to_json(citySheet) : [];

    const extracted = {
        venueTypes: venueData.map(v => Object.values(v)[0]).filter(Boolean),
        vendorCategories: vendorData.map(v => Object.values(v)[0]).filter(Boolean),
        eventTypes: eventData.map(e => Object.values(e)[0]).filter(Boolean),
        cities: cityData.map(c => Object.values(c)[0]).filter(Boolean)
    };

    console.log(JSON.stringify(extracted, null, 2));
} catch (error) {
    console.error("Error reading xlsx:", error);
}
