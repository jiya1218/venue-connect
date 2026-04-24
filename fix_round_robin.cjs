const fs = require('fs');
const filepath = './src/lib/citiesData.ts';
let content = fs.readFileSync(filepath, 'utf8');

// The 5 safe IDs approved by the user
const safeIds = [
  "1651408451633-ff492f347ec1",
  "1630060041646-3ba002aa7d37",
  "1677648626156-acad341ce207",
  "1692458236947-33d25789b2aa",
  "1641994751533-d9a98dcba149"
];

const regex = /{ name: "(.*?)", venues: (\d+), vendors: (\d+), slug: "(.*?)", image: "https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+\?w=800&q=80" },?/g;

let idIndex = 0;

content = content.replace(regex, (match, name, venues, vendors, slug) => {
    // If Kutch somehow survived (it shouldn't have), skip it
    if (name === "Kutch") return "";

    // If it's one of the top 5, let it use its respective image
    let newId = "";
    if (name === "Ahmedabad") newId = safeIds[0];
    else if (name === "Surat") newId = safeIds[1];
    else if (name === "Vadodara") newId = safeIds[2];
    else if (name === "Rajkot") newId = safeIds[3];
    else if (name === "Gandhinagar") newId = safeIds[4];
    else {
        newId = safeIds[idIndex % safeIds.length];
        idIndex++;
    }
    
    return `{ name: "${name}", venues: ${venues}, vendors: ${vendors}, slug: "${slug}", image: "https://images.unsplash.com/photo-${newId}?w=800&q=80" },`;
});

// Clean up any trailing stuff
content = content.replace(/,\n\s*\]/, '\n]');

fs.writeFileSync(filepath, content);
console.log("Updated with round robin!");
