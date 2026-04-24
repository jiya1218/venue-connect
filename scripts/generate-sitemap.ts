import fs from "fs";
import { citiesData } from "../src/lib/citiesData";
import { VENUE_CATEGORIES as categories, EVENT_TYPES as events } from "../src/lib/seoConstants";

const vendorCategories = [
    "photographers",
    "makeup-artists",
    "decorators",
    "caterers",
    "mehndi-artists",
    "wedding-planners",
    "djs"
];

const baseUrl = "https://venueconnect.in";

const staticRoutes = [
    "",
    "/venues",
    "/vendors",
    "/cities",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/faqs"
];

async function generate() {
    console.log("🚀 Starting Massive Sitemap Generation (Excel Align Mode)...");
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Static Routes
    staticRoutes.forEach(route => {
        xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === "" ? "1.0" : "0.8"}</priority>\n  </url>\n`;
    });

    // 2. City + Category (Standard)
    citiesData.forEach(city => {
        categories.forEach(cat => {
            const url = `${baseUrl}/${city.slug}/${cat}`;
            xml += `  <url>\n    <loc>${url}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
        });
        
        // 3. City + Locality + Category (Deep-Link)
        if (city.localities) {
            city.localities.forEach(loc => {
                // To keep sitemap size reasonable, we pick top categories for localities
                categories.slice(0, 5).forEach(cat => {
                    const url = `${baseUrl}/${city.slug}/${loc}/${cat}`;
                    xml += `  <url>\n    <loc>${url}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
                });
            });
        }
    });

    // 4. Event + City (Standard)
    events.forEach(event => {
        citiesData.forEach(city => {
            const url = `${baseUrl}/venues-for/${event}/${city.slug}`;
            xml += `  <url>\n    <loc>${url}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
            
            // 5. Event + City + Locality
            if (city.localities) {
                city.localities.forEach(loc => {
                    const urlLoc = `${baseUrl}/venues-for/${event}/${city.slug}/${loc}`;
                    xml += `  <url>\n    <loc>${urlLoc}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
                });
            }
        });
    });

    // 6. Vendor by City
    citiesData.forEach(city => {
        vendorCategories.forEach(cat => {
            const url = `${baseUrl}/vendors/${cat}/${city.slug}`;
            xml += `  <url>\n    <loc>${url}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
        });
    });

    xml += `</urlset>`;

    fs.writeFileSync("./public/sitemap.xml", xml);
    console.log(`✅ Sitemap build complete! Check ./public/sitemap.xml`);
}

generate().catch(err => {
    console.error("❌ Sitemap build failed:", err);
    process.exit(1);
});
