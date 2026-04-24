export interface City {
  name: string;
  venues: number;
  vendors: number;
  slug: string;
  image: string;
  localities?: string[];
}
export const citiesData: City[] = [
  { 
    name: "Ahmedabad", 
    venues: 450, 
    vendors: 1200, 
    slug: "ahmedabad", 
    image: "https://images.unsplash.com/photo-1651408451633-ff492f347ec1?w=800&q=80",
    localities: ["satellite", "vastrapur", "bopal", "sg-highway", "prahlad-nagar", "paldi", "navrangpura", "chandkheda", "thaltej", "bodakdev", "maninagar", "gota", "science-city", "nikol", "bapunagar"]
  },
  { 
    name: "Surat", 
    venues: 380, 
    vendors: 950, 
    slug: "surat", 
    image: "https://images.unsplash.com/photo-1630060041646-3ba002aa7d37?w=800&q=80",
    localities: ["vesu", "adajan", "varachha", "piplod", "dumas-road", "city-light", "bhatar", "katargam", "rander", "udhna", "palsana"]
  },
  { 
    name: "Vadodara", 
    venues: 290, 
    vendors: 800, 
    slug: "vadodara", 
    image: "https://images.unsplash.com/photo-1677648626156-acad341ce207?w=800&q=80",
    localities: ["alkapuri", "gotri", "makarpura", "vasna", "manjalpur", "fatehgunj", "karelibaug", "sama", "waghodia", "ajwa-road"]
  },
  { 
    name: "Rajkot", 
    venues: 210, 
    vendors: 550, 
    slug: "rajkot", 
    image: "https://images.unsplash.com/photo-1692458236947-33d25789b2aa?w=800&q=80",
    localities: ["kalawad-road", "university-road", "raiya-road", "mavdi", "150-feet-ring-road", "nana-mava", "amin-marg", "kuvadava-road", "gondal-road"]
  },
  { 
    name: "Gandhinagar", 
    venues: 150, 
    vendors: 400, 
    slug: "gandhinagar", 
    image: "https://images.unsplash.com/photo-1641994751533-d9a98dcba149?w=800&q=80",
    localities: ["sector-21", "sector-11", "kd-circle", "infocity", "gift-city", "raysan", "koba"]
  },
  { name: "Amreli", venues: 18, vendors: 42, slug: "amreli", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80" },
  { name: "Anand", venues: 75, vendors: 190, slug: "anand", image: "https://images.unsplash.com/photo-1529316275402-0462fcc4abd6?w=800&q=80" },
  { name: "Aravalli", venues: 12, vendors: 30, slug: "aravalli", image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80" },
  { name: "Banaskantha", venues: 22, vendors: 55, slug: "banaskantha", image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800&q=80" },
  { name: "Bharuch", venues: 35, vendors: 85, slug: "bharuch", image: "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=800&q=80" },
  { name: "Bhavnagar", venues: 90, vendors: 250, slug: "bhavnagar", image: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&q=80" },
  { name: "Botad", venues: 15, vendors: 35, slug: "botad", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" },
  { name: "Chhota Udaipur", venues: 10, vendors: 25, slug: "chhota-udaipur", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80" },
  { name: "Dahod", venues: 14, vendors: 32, slug: "dahod", image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80" },
  { name: "Dang", venues: 8, vendors: 15, slug: "dang", image: "https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800&q=80" },
  { name: "Devbhoomi Dwarka", venues: 20, vendors: 45, slug: "devbhoomi-dwarka", image: "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?w=800&q=80" },
  { name: "Gir Somnath", venues: 18, vendors: 40, slug: "gir-somnath", image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800&q=80" },
  { name: "Jamnagar", venues: 85, vendors: 220, slug: "jamnagar", image: "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=800&q=80" },
  { name: "Junagadh", venues: 60, vendors: 150, slug: "junagadh", image: "https://images.unsplash.com/photo-1623718649591-311775a30c43?w=800&q=80" },
  { name: "Kheda", venues: 25, vendors: 60, slug: "kheda", image: "https://images.unsplash.com/photo-1693933714044-131908e39427?w=800&q=80" },
  { name: "Mahisagar", venues: 12, vendors: 28, slug: "mahisagar", image: "https://images.unsplash.com/photo-1484156818044-c040038b0719?w=800&q=80" },
  { name: "Mehsana", venues: 40, vendors: 90, slug: "mehsana", image: "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=800&q=80" },
  { name: "Morbi", venues: 40, vendors: 95, slug: "morbi", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80" },
  { name: "Narmada", venues: 15, vendors: 35, slug: "narmada", image: "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800&q=80" },
  { name: "Navsari", venues: 45, vendors: 110, slug: "navsari", image: "https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?w=800&q=80" },
  { name: "Panchmahal", venues: 18, vendors: 40, slug: "panchmahal", image: "https://images.unsplash.com/photo-1526568929-7cdd510e77fd?w=800&q=80" },
  { name: "Patan", venues: 20, vendors: 45, slug: "patan", image: "https://images.unsplash.com/photo-1541508159146-2ab9c877e804?w=800&q=80" },
  { name: "Porbandar", venues: 15, vendors: 35, slug: "porbandar", image: "https://images.unsplash.com/photo-1561593367-66c79c2294e6?w=800&q=80" },
  { name: "Sabarkantha", venues: 15, vendors: 35, slug: "sabarkantha", image: "https://images.unsplash.com/photo-1572319663329-ac47c4efdef0?w=800&q=80" },
  { name: "Surendranagar", venues: 22, vendors: 50, slug: "surendranagar", image: "https://images.unsplash.com/photo-1624763149686-1893acf73092?w=800&q=80" },
  { name: "Tapi", venues: 10, vendors: 22, slug: "tapi", image: "https://images.unsplash.com/photo-1670529776258-aed0041eb4f9?w=800&q=80" },
  { name: "Valsad", venues: 25, vendors: 65, slug: "valsad", image: "https://images.unsplash.com/photo-1676734628558-624737d3e094?w=800&q=80" },
  { name: "Palitana", venues: 20, vendors: 45, slug: "palitana", image: "https://images.unsplash.com/photo-1683435844312-ac5324de7572?w=800&q=80" },
  { name: "Bhuj", venues: 25, vendors: 60, slug: "bhuj", image: "https://images.unsplash.com/photo-1690332538891-8ee943e8b5c5?w=800&q=80" },
  { name: "Gandhidham", venues: 55, vendors: 140, slug: "gandhidham", image: "https://images.unsplash.com/photo-1713967529315-57412b088b32?w=800&q=80" },
];
