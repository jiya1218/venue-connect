const { enrichListings } = require('./src/lib/imageEnricher');

const sampleVenues = [
  { id: 1, name: "Test Venue 1", city: "Ahmedabad", type: "Banquet Hall" },
  { id: 2, name: "Test Venue 2", city: "Surat", image: "null" },
  { id: 3, name: "Test Venue 3", city: "Vadodara", image: "https://example.com/broken.jpg" }
];

const enriched = enrichListings(sampleVenues);
console.log(JSON.stringify(enriched, null, 2));
