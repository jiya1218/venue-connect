const fs = require('fs');
const crypto = require('crypto');

const cities = [
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", 
  "Bhavnagar", "Jamnagar", "Junagadh", "Anand", "Navsari", 
  "Surendranagar", "Morbi", "Gandhidham", "Bharuch", "Nadiad", "Mehsana"
];

const types = [
  "Banquet Hall", "Farmhouse", "Party Plot", "Hotel", "Resort", 
  "Restaurant", "Convention Center", "Club", "Rooftop Venue", 
  "Garden Venue", "Heritage Venue", "Luxury Venue"
];

const prefixes = ["The Grand", "Royal", "Imperial", "Crystal", "Emerald", "Sapphire", "Golden", "Silver", "Majestic", "Palm", "Oasis", "Lotus", "Harmony", "Prestige", "Crown", "Paramount", "Elegance", "Serene", "Regal", "Elite"];

const imagePools = {
  indoor: [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
    "https://images.unsplash.com/photo-1505373877841-825f7d46678",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb"
  ],
  outdoor: [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    "https://images.unsplash.com/photo-1561593367-66c79c2294e6",
    "https://images.unsplash.com/photo-1475087384336-ae5a88c7f96e",
    "https://images.unsplash.com/photo-1529316275402-0462fcc4abd6",
    "https://images.unsplash.com/photo-1505235687559-2a369caa223d",
    "https://images.unsplash.com/photo-1529316275402-0462fcc4abd6",
    "https://images.unsplash.com/photo-1530103043-91ca570b14d2"
  ],
  hotel: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    "https://images.unsplash.com/photo-1540541338287-41700207dee6",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
    "https://images.unsplash.com/photo-1512918766752-1e967a54460d",
    "https://images.unsplash.com/photo-1564501049412-61c253918c92",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
  ],
  restaurant: [
    "https://images.unsplash.com/photo-1552566629-99ed1f857f06",
    "https://images.unsplash.com/photo-1517248135467-4c7ed9d42177",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    "https://images.unsplash.com/photo-1550966844-491ca2ad7d2b",
    "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5",
    "https://images.unsplash.com/photo-1555396273-547e1568203d",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
  ]
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(type, city) {
  const prefix = getRandomItem(prefixes);
  let suffix = "";
  if (type === "Banquet Hall") suffix = getRandomItem(["Banquet", "Banquets", "Hall"]);
  else if (type === "Farmhouse") suffix = getRandomItem(["Farmhouse", "Farms", "Retreat"]);
  else if (type === "Party Plot") suffix = getRandomItem(["Party Plot", "Lawns", "Grounds"]);
  else if (type === "Hotel") suffix = getRandomItem(["Hotel", "Inn", "Suites"]);
  else if (type === "Resort") suffix = getRandomItem(["Resort", "Spa", "Village"]);
  else if (type === "Restaurant") suffix = getRandomItem(["Restaurant", "Dining", "Bistro"]);
  else if (type === "Convention Center") suffix = getRandomItem(["Convention Center", "Expo"]);
  else if (type === "Club") suffix = getRandomItem(["Club", "Gymkhana", "Country Club"]);
  else if (type === "Rooftop Venue") suffix = getRandomItem(["Terrace", "Sky Lounge", "Rooftop"]);
  else if (type === "Garden Venue") suffix = getRandomItem(["Gardens", "Park", "Green"]);
  else if (type === "Heritage Venue") suffix = getRandomItem(["Palace", "Haveli", "Heritage"]);
  else if (type === "Luxury Venue") suffix = getRandomItem(["Luxury", "Grand", "Prestige"]);
  
  return prefix + " " + suffix;
}

function getImagePool(type) {
  if (["Banquet Hall", "Convention Center", "Club", "Heritage Venue", "Luxury Venue"].includes(type)) return imagePools.indoor;
  if (["Farmhouse", "Party Plot", "Garden Venue", "Rooftop Venue"].includes(type)) return imagePools.outdoor;
  if (["Hotel", "Resort"].includes(type)) return imagePools.hotel;
  if (["Restaurant"].includes(type)) return imagePools.restaurant;
  return imagePools.indoor;
}

const descriptions = [
  "A perfect blend of elegance and modern amenities, ensuring your special day is unforgettable.",
  "Spacious and luxuriously designed venue ideal for grand weddings, receptions, and corporate events.",
  "Experience world-class hospitality in a stunning setting that caters to all your celebration needs.",
  "Beautifully landscaped outdoor spaces combined with opulent indoor halls for a magical event.",
  "A premier destination for sophisticated gatherings, offering top-notch catering and decor services.",
  "Intimate yet lavish, this venue provides the perfect backdrop for your most cherished memories.",
  "State-of-the-art facilities with a grand ambiance to host events that leave a lasting impression.",
  "Serene environment away from the city bustle, making it an ideal choice for peaceful retreats and celebrations."
];

const amenitiesList = ['AC', 'WiFi', 'Parking', 'Stage', 'Catering', 'Valet Parking', 'Power Backup', 'DJ Sound', 'Pool', 'Bridal Room'];

let sql = "-- THIS SCRIPT WILL TRUNCATE YOUR EXISTING VENUES TABLE and insert 320 new venues (16 cities * 20 venues)\n";
sql += "TRUNCATE TABLE \"public\".\"venues\" CASCADE;\n\n";
sql += "INSERT INTO \"public\".\"venues\" (\"id\", \"created_at\", \"name\", \"city\", \"location\", \"address\", \"type\", \"rating\", \"reviews\", \"image\", \"images\", \"owner_id\", \"min_capacity\", \"max_capacity\", \"rooms_count\", \"veg_price_per_plate\", \"nonveg_price_per_plate\", \"has_ac\", \"has_wifi\", \"alcohol_served\", \"cuisines\", \"indoor_spaces\", \"outdoor_spaces\", \"payment_methods\", \"catering_policy\", \"advance_payment_percentage\", \"operating_hours\", \"amenities\", \"starting_price\", \"is_approved\", \"is_featured\", \"is_active\", \"description\", \"slug\", \"is_verified\") VALUES\n";

const values = [];

for (const city of cities) {
  for (let i = 0; i < 20; i++) {
    const type = types[i % types.length];
    
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString().replace('T', ' ').replace('Z', '+00');
    
    const baseName = generateName(type, city);
    const uniqueSuffixes = ["Central", "East", "West", "North", "South", "Park", "Avenue", "Square", "Plaza", "Oaks"];
    const name = baseName + " " + getRandomItem(uniqueSuffixes);
    
    const location = city + ", Gujarat";
    const areas = ["SG Highway", "CG Road", "Station Road", "Ring Road", "City Center", "Lake View", "Civil Lines"];
    const address = getRandomItem(areas) + ", " + city;
    
    const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
    const reviews = getRandomInt(10, 800);
    
    const pool = getImagePool(type);
    const mainImage = getRandomItem(pool) + "?auto=format&fit=crop&w=1000&q=80";
    const image1 = getRandomItem(pool) + "?auto=format&fit=crop&w=800&q=80";
    const image2 = getRandomItem(pool) + "?auto=format&fit=crop&w=800&q=80";
    const imagesArray = "ARRAY['" + image1 + "','" + image2 + "']";
    
    const minCap = getRandomInt(50, 200);
    const maxCap = getRandomInt(300, 2000);
    const roomsCount = ["Hotel", "Resort", "Heritage Venue"].includes(type) ? getRandomInt(10, 100) : 0;
    
    const vegPrice = getRandomInt(400, 2000);
    const nonvegPrice = 0;
    
    const hasAc = !["Party Plot", "Farmhouse", "Garden Venue"].includes(type);
    const hasWifi = true;
    const alcoholServed = false;
    
    const shuffledAmenities = amenitiesList.sort(() => 0.5 - Math.random());
    const selectedAmenities = shuffledAmenities.slice(0, getRandomInt(3, 6));
    const amenitiesArray = "ARRAY[" + selectedAmenities.map(a => "'" + a + "'").join(',') + "]";
    
    const startingPrice = getRandomInt(20000, 100000);
    const description = getRandomItem(descriptions);
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + city.toLowerCase() + '-' + getRandomInt(100,999);

    const val = "('" + id + "', '" + createdAt + "', '" + name.replace(/'/g, "''") + "', '" + city + "', '" + location.replace(/'/g, "''") + "', '" + address.replace(/'/g, "''") + "', '" + type + "', '" + rating + "', " + reviews + ", '" + mainImage + "', " + imagesArray + ", null, " + minCap + ", " + maxCap + ", " + roomsCount + ", " + vegPrice + ", " + nonvegPrice + ", " + hasAc + ", " + hasWifi + ", " + alcoholServed + ", null, 0, 0, null, null, null, null, " + amenitiesArray + ", " + startingPrice + ", true, false, true, '" + description.replace(/'/g, "''") + "', '" + slug + "', true)";
    
    values.push(val);
  }
}

sql += values.join(',\n') + ';';

fs.writeFileSync('generated_venues.sql', sql);
console.log('SQL generated at generated_venues.sql');
