const fs = require('fs');
const filepath = './src/lib/citiesData.ts';
let content = fs.readFileSync(filepath, 'utf8');

const newUniqueIds = [
"1524311614474-8013dc7ac652", "1543715474-82ce05d4910a", "1581836850314-3b668c2aa540",
"1650451484146-5d3a5654b7f2", "1656947167986-c732ec591170", "1668493266463-ff9a61266c03",
"1669110909432-60b1054de115", "1693144142906-559153853d79", "1693144142999-b39dd45371dc",
"1700648421544-0dfdba53059d", "1504194947363-2f14d9e0e445", "1515091943-9d5c0ad475af",
"1519955045385-7cdb8e07c76f", "1519955266818-0231b63402bc", "1524309784716-6a4be8299c7f",
"1524492412937-b28074a5d7da", "1524613032530-449a5d94c285", "1542361641859-c26bb3571dd7",
"1548013146-72479768bada", "1564507592333-c60657eea523", "1594527369969-37ca2eba568e",
"1606141836992-bfcb00c776c2", "1643906264382-615af6f4d6f4", "1652396510783-7eb7c30635cb",
"1656670610903-025312104457", "1685790582503-1b2762d95407", "1700755861933-650620041fda",
"1705524220939-dac17cf94236", "1705524220998-4b4b51bd12f6", "1524229648276-e66561fe45a9"
];

const top5 = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"];

const regex = /{ name: "(.*?)", venues: (\d+), vendors: (\d+), slug: "(.*?)", image: "https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+\?w=800&q=80" },?/g;

let idIndex = 0;

content = content.replace(regex, (match, name, venues, vendors, slug) => {
    // If it's one of the top 5, Keep IT EXACTLY THE SAME by parsing the current URL
    // So we don't mess up their images.
    // Actually, regex extracts just the name, venues, vendors, slug. We need the current image URL or we can manually put them back!
    if (top5.includes(name)) {
        return match; // Keep the original match!
    }
    
    // For ALL OTHER CITIES, use a truly unique photo from the new array
    const newId = newUniqueIds[idIndex % newUniqueIds.length];
    idIndex++;
    
    return `{ name: "${name}", venues: ${venues}, vendors: ${vendors}, slug: "${slug}", image: "https://images.unsplash.com/photo-${newId}?w=800&q=80" },`;
});

fs.writeFileSync(filepath, content);
console.log("Updated with 30 unique Indian images! Total assigned uniquely: " + idIndex);
