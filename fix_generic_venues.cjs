const fs = require('fs');
const filepath = './src/lib/citiesData.ts';
let content = fs.readFileSync(filepath, 'utf8');

const genericVenueIds = [
"1520250497591-112f2f40a3f4", "1529316275402-0462fcc4abd6", "1540541338287-41700207dee6",
"1551918120-9739cb430c6d", "1562790351-d273a961e0e9", "1563911302283-d2bc129e7570",
"1566073771259-6a8506099945", "1582719508461-905c673771fd", "1584132967334-10e028bd69f7",
"1586611292717-f828b167408c", "1606402179428-a57976d71fa4", "1610641818989-c2051b5e2cfd",
"1615880484746-a134be9a6ecf", "1623718649591-311775a30c43", "1693933714044-131908e39427",
"1484156818044-c040038b0719", "1502635385003-ee1e6a1a742d", "1511795409834-ef04bbd61622",
"1522413452208-996ff3f3e740", "1524824267900-2fa9cbf7a506", "1526568929-7cdd510e77fd",
"1541508159146-2ab9c877e804", "1561593367-66c79c2294e6", "1572319663329-ac47c4efdef0",
"1624763149686-1893acf73092", "1670529776258-aed0041eb4f9", "1676734628558-624737d3e094",
"1683435844312-ac5324de7572", "1690332538891-8ee943e8b5c5", "1713967529315-57412b088b32"
];

const top5 = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"];
const regex = /{ name: "(.*?)", venues: (\d+), vendors: (\d+), slug: "(.*?)", image: "https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+\?w=800&q=80" },?/g;

let idIndex = 0;

content = content.replace(regex, (match, name, venues, vendors, slug) => {
    if (top5.includes(name)) {
        return match; 
    }
    
    // For ALL minor cities, use generic resorts and banquet halls
    const newId = genericVenueIds[idIndex % genericVenueIds.length];
    idIndex++;
    
    return `{ name: "${name}", venues: ${venues}, vendors: ${vendors}, slug: "${slug}", image: "https://images.unsplash.com/photo-${newId}?w=800&q=80" },`;
});

fs.writeFileSync(filepath, content);
console.log("Updated with 30 unique Generic Venue images!");
