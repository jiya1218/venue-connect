/**
 * Image Pools for different Venue and Vendor types.
 * These IDs are curated to be high-quality and "Indian-friendly" (Indian weddings, food, architecture).
 */

const IMAGE_POOLS: Record<string, string[]> = {
  'wedding': [
    '1583939003579-730e3918a45a', // Indian Bride
    '1511285560929-80b456fea0bc', // Indian Wedding
    '1610313816146-2180f68d3744', // Mandap
    '1604548519967-a06869680076', // Ethnic wear
    '1515934751635-c81c6bc9a2d8', // Ceremony
    '1522673607200-12ce830ee052', // Decor
    '1532712938310-34cb3982ef74', // Mehendi
    '1610041285942-0199042b308e', // Traditional Decor
    '1587271407850-8d438ca9fdf2', // Palace Venue
    '1524473994769-c1bbbf30e944'  // Indian Couple
  ],
  'banquet': [
    '1519167758481-83f550bb49b3', // Banquet
    '1517457373958-b7bdd4587205', // Hall
    '1470225620780-dba8ba36b745', // Luxury Hall
    '1492684223066-81342ee5ff30', // Event Hall
    '1516997121675-4c2d04f0cb3d', // Grand Hall
    '1533174072545-7a4b6ad7a6c3', // Lighting
    '1501281668698-3d144ba4477d', // Celebration
    '1542314831-068cd1dbfeeb', // Luxury Interior
    '1505373877841-825f7d46678', // Party Hall
    '1445019980597-93fa8acb246c'  // Hotel Hall
  ],
  'hotel': [
    '1566073771259-6a8506099945', // Indian Hotel
    '1542314831-068cd1dbfeeb', // Hotel Lobby
    '1571896349842-33c89424de2d', // Resort
    '1618773928121-c32242e63f39', // Hotel Room
    '1590490360182-c33d57733427', // Suite
    '1564501049412-61c253918c92', // Modern Hotel
    '1582719478250-c89cae4dc85b', // Grand Entrance
    '1520250497591-112f2f40a3f4'  // Hotel Facade
  ],
  'resort': [
    '1540541338287-41700207dee6', // Luxury Resort
    '1582719508461-905c673771fd', // Pool
    '1571003123894-1f0594d2b5d9', // Resort Entrance
    '1615880484746-a134be9a6ecf', // Resort View
    '1512918766752-1e967a54460d', // Modern Resort
    '1499793983690-e29da59ef1c2', // Resort Grounds
    '1506953823976-52e1bdc0149a', // Resort Deck
    '1544124499-536132dd3fdc'  // Resort Architecture
  ],
  'lawn': [
    '1523585322415-3843e914364c', // Lawn
    '1529316275402-0462fcc4abd6', // Party Plot
    '1561593367-66c79c2294e6', // Garden
    '1511795409834-ef04bbd61622', // Farmhouse
    '1530103043-91ca570b14d2', // Green Lawn
    '1475087384336-ae5a88c7f96e', // Open Air
    '1505235687559-2a369caa223d', // Outdoor Space
    '1500382017468-9049fe74a44b'  // Garden Path
  ],
  'restaurant': [
    '1517248135467-4c7ed9d42177', // Restaurant
    '1552566629-99ed1f857f06', // Dining Room
    '1514326640560-7d063ef2aed5', // Indian Dining
    '1555396273-547e1568203d', // Fine Dining
    '1414235077428-338989a2e8c0', // Gourmet Restaurant
    '1550966844-491ca2ad7d2b', // Restaurant Interior
    '1504674900247-0877df9cc836'  // Food Platter
  ],
  'catering': [
    '1589302168068-964664d93dc0', // Indian Thali
    '1546833999-b9f5f973eeb4', // Indian Buffet
    '1585238342024-78d387f4a707', // Food Spread
    '1473093258162-d470445f6ba0', // Catering
    '1504703391921-114b309d8451', // Presentation
    '1565299585323-aa86a827612c', // Gourmet
    '1490817314783-e3046a69b922'  // Buffet Table
  ],
  'photography': [
    '1520854221256-17451cc3bb3c', // Indian Photographer
    '1615037114501-3f3d7f005628', // Camera
    '1516035069177-098d337fcc6c', // Studio
    '1470229722913-7c0e2dbbafd3'  // Landscape
  ],
  'makeup': [
    '1489274591473-2b6d8aa32a33', // Indian Makeup
    '1522337360788-8b13df1130f1', // Beauty
    '1512496015851-a90fb38ba794', // Prep
    '1572633423708-20246ce91c49'  // Salon
  ],
  'decoration': [
    '1511285560929-80b456fea0bc', // Flowers
    '1522673607200-12ce830ee052', // Traditional Decor
    '1533174072545-7a4b6ad7a6c3', // Stage
    '1519225421980-715bd0215aed'  // Modern Decor
  ],
  'dj': [
    '1516280440614-37939bbacd81', // DJ Setup
    '1470225620780-dba8ba36b745', // Sound/Lights
    '1514525253361-bee243870d24', // Party Sound
    '1493225255756-d9584f8606e9'  // Music
  ],
  'mehendi': [
    '1603217192634-61068e4d4bf9', // Mehendi Hands
    '1532712938310-34cb3982ef74', // Henna Artist
    '1610173827002-62c0f1f05d04', // Traditional Mehendi
    '1542452255191-c85a99f0c5ee'  // Henna Art
  ],
  'pandit': [
    '1617196034183-421b4040ed20', // Indian Priest
    '1609137882410-689e4726615b', // Puja Ceremony
    '1544923246-77307dd654ca', // Spiritual
    '1528697203043-733dafdaa316'  // Indian Rituals
  ],
  'cake': [
    '1535254973040-607b474cb8c2', // Wedding Cake
    '1513104890138-7c749659a591', // Bakery
    '1621303837174-89787a7d4729', // Sweet Treat
    '1588195538326-c5b1e9f80a1b'  // Cake
  ],
  'invitation': [
    '1607344645866-009c320b63e0', // Wedding Card
    '1591880911055-66774a3f789f', // Invitation
    '1510076857177-7470076d4098', // Stationery
    '1618005182384-a83a8bd57fbe'  // Card Design
  ],
  'transport': [
    '1532329683184-6ffd13057d1c', // Wedding Car
    '1583121274602-3e2820c69888', // Luxury Car
    '1549399542-7e3f8b79c341', // Classic Car
    '1519741497674-611481863552'  // Decorated Car
  ],
  'generic': [
    '1519167758481-83f550bb49b3', // Party
    '1505373877841-825f7d46678', // Event
    '1566073771259-6a8506099945', // Venue
    '1511285560929-80b456fea0bc'  // Celebration
  ]
};

/**
 * Deterministic hash function for consistent image selection
 */
function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Normalizes name by removing timestamps and numeric suffixes
 * Example: "Ahmedabad Grand Party Plot 3 1777034499486" -> "Ahmedabad Grand Party Plot"
 */
export function cleanName(name: string): string {
  if (!name) return '';
  
  // 1. Remove 10-15 digit timestamps (e.g. 1777034499486)
  let clean = name.replace(/\s\d{10,15}(\s|$)/g, ' ').trim();
  
  // 2. Remove numeric suffixes at the end of the name (e.g. "Party Plot 3")
  // but keep it if it's part of a brand name like "The 4 Seasons"
  clean = clean.replace(/\s\d+$/g, '');
  
  return clean.trim();
}

/**
 * Normalizes category/type to match our pools
 */
function getPoolKey(category: string, type: string, name: string): string {
  const c = (category || '').toLowerCase();
  const t = (type || '').toLowerCase();
  const n = (name || '').toLowerCase();

  // Granular matching
  if (n.includes('restaurant') || t.includes('restaurant') || c.includes('restaurant')) return 'restaurant';
  if (c.includes('photo') || t.includes('photo') || n.includes('photo') || n.includes('studio')) return 'photography';
  if (c.includes('cater') || t.includes('cater') || n.includes('cater') || n.includes('dining')) return 'catering';
  if (c.includes('makeup') || t.includes('makeup') || n.includes('makeup') || n.includes('salon') || n.includes('beauty')) return 'makeup';
  if (c.includes('decor') || t.includes('decor') || n.includes('decor') || n.includes('event')) return 'decoration';
  
  if (n.includes('dj') || n.includes('sound') || n.includes('music') || n.includes('orchestra') || t.includes('dj')) return 'dj';
  if (n.includes('mehndi') || n.includes('mehendi') || t.includes('mehndi')) return 'mehendi';
  if (n.includes('pandit') || n.includes('pujari') || n.includes('priest') || t.includes('pandit')) return 'pandit';
  if (n.includes('cake') || n.includes('bakery') || t.includes('cake')) return 'cake';
  if (n.includes('invitation') || n.includes('card') || t.includes('invitation')) return 'invitation';
  if (n.includes('car') || n.includes('transport') || n.includes('travel') || t.includes('transport')) return 'transport';
  
  if (c.includes('wedding') || t.includes('wedding') || n.includes('wedding')) return 'wedding';
  if (t.includes('banquet') || t.includes('hall') || n.includes('hall')) return 'banquet';
  if (t.includes('hotel') || n.includes('hotel')) return 'hotel';
  if (t.includes('resort') || n.includes('resort')) return 'resort';
  if (t.includes('lawn') || t.includes('plot') || t.includes('farm') || n.includes('plot') || n.includes('lawn')) return 'lawn';
  
  return 'generic';
}

/**
 * Returns an optimized Unsplash image URL based on listing data.
 * If the provided image is a generic placeholder or missing, it provides a unique variety.
 */
export function getEnrichedImage(listing: any): string {
  if (!listing) return `https://images.unsplash.com/photo-${IMAGE_POOLS.generic[0]}?w=800&q=80`;

  const currentImage = listing.image || (listing.images && listing.images[0]) || '';
  
  // Aggressive detection of generic placeholders and broken patterns
  const placeholderIds = [
    '1519167758481-83f550bb49b3', // Wedding/Banquet generic
    '1555244162-803834f70033', // Catering generic
    '1519225421980-715bd0215aed', // Decor generic
    '1537633552985-df8429e8048b', // Photo generic
    '1511285560929-80b456fea0bc', // Celebration generic
    '1505373877841-825f7d46678', // Party generic
    '1487412720507-e7ab37603c6f', // Makeup generic
    '1610173827002-62c0f1f05d04', // Mehendi generic
    '1516280440614-37939bbacd81', // DJ generic
    '1534180477871-5d6cc81f3920', // DJ generic 2
    '1478146059778-26028b07395a', // Vendor generic
    '1603217192634-61068e4d4bf9', // Mehendi generic 2
    '1536240478700-b869ad10e2af', // Video generic
    '1617196034183-421b4040ed20', // Pandit generic
  ];

  const isGeneric = !currentImage || 
                    currentImage === 'null' || 
                    currentImage === 'undefined' || 
                    placeholderIds.some(id => currentImage.includes(id)) ||
                    currentImage.includes('placeholder') ||
                    currentImage.includes('default') ||
                    currentImage.includes('noimage');
  
  // If it's already a specific image (not a common placeholder), return it
  // unless the user wants us to force variety (which they do)
  if (!isGeneric && currentImage.startsWith('http') && !currentImage.includes('unsplash.com')) return currentImage;

  // Otherwise, pick a deterministic variety from our pools
  const poolKey = getPoolKey(listing.category || '', listing.type || listing.vendor_type || '', listing.name || '');
  const pool = IMAGE_POOLS[poolKey] || IMAGE_POOLS.generic;
  
  // Use cleaned name AND ID for more consistent but unique hashing
  const salt = cleanName(listing.name || 'default');
  const uniqueId = listing.id || listing.slug || salt;
  const index = getHash(salt + uniqueId) % pool.length;
  const imageId = pool[index];

  // Return high-quality optimized Unsplash URL
  return `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=1200&q=80`;
}

/**
 * Enrichment function for a list of listings
 */
export function enrichListings(listings: any[]): any[] {
  if (!listings) return [];
  return listings.map(l => ({
    ...l,
    name: cleanName(l.name),
    image: getEnrichedImage(l)
  }));
}
