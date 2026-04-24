const fs = require('fs');
const filepath = './src/lib/citiesData.ts';
let content = fs.readFileSync(filepath, 'utf8');

const regex = /{ name: "(.*?)", venues: (\d+), vendors: (\d+), slug: "(.*?)", image: "https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+\?w=800&q=80" },?/g;

const newLandscapeIds = [
"1562583067-e8cbb116620e", "1590944663541-0963b749dd65", "1652503591857-0dbb07631692", 
"1694843531892-25ad03c30078", "1694843532546-b939a425e89d", "1694843532972-ad3dc10ba965", 
"1694843533071-47e7315f3691", "1694843533128-5656d907ecee", "1694843533247-e6dcf60e6691", 
"1694843533324-ecffe297fe89", "1526572690437-c3f99d109cfd", "1533254012848-644c18f39289", 
"1559406041-c7d2b2e98690", "1589820745206-c6b6d3602361", "1606837731961-c5211df9aa10",
"1610195486727-b3b3493835b2", "1651578083543-07ebdcebf4c1", "1684954918977-79589296012f",
"1693845609327-8f64e686e338", "1477586957327-847a0f3f4fe3", "1491497895121-1334fc14d8c9",
"1505218694109-229efd91b679", "1542708993627-b6e5bbae43c4", "1579531403068-8d6fd2b3f45d",
"1595433306946-233f47e4af3a", "1638103242969-d04a019710fc", "1648115124749-b5d0c3ced1fa",
"1648541446190-4047360a1f0f", "1648831180276-2dc08f3db3ef"
];

let idIndex = 0;

content = content.replace(regex, (match, name, venues, vendors, slug) => {
    // If it's Kutch, skip replacing it completely to remove it
    if (name === "Kutch") return "";

    // Keep top 5 cities as they are (since they are separate objects in the array, they won't match this regex exactly unless they format matches. Actually, the top 5 cities have 'localities' so they don't end with image:...}, strictly)
    
    // For Amreli onwards, replace with new landscape IDs
    const newId = newLandscapeIds[idIndex % newLandscapeIds.length];
    idIndex++;
    
    return `{ name: "${name}", venues: ${venues}, vendors: ${vendors}, slug: "${slug}", image: "https://images.unsplash.com/photo-${newId}?w=800&q=80" },`;
});

// Fix potential trailing commas or empty lines
content = content.replace(/,\n\s*\]/, '\n]');
content = content.replace(/\n\s*\n/g, '\n');

fs.writeFileSync(filepath, content);
console.log("Updated cities!");
