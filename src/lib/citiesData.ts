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
  { name: "Amreli", venues: 18, vendors: 42, slug: "amreli", image: "https://i.pinimg.com/1200x/9b/ae/50/9bae507a39211fc0507b8c7ad6d89a55.jpg" },
  { name: "Anand", venues: 75, vendors: 190, slug: "anand", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Sardar_Patel_Memorial_Karamsad.JPG/1280px-Sardar_Patel_Memorial_Karamsad.JPG" },
  { name: "Aravalli", venues: 12, vendors: 30, slug: "aravalli", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/34/5f/32/zanzari-falls.jpg?w=1200&h=-1&s=1" },
  { name: "Banaskantha", venues: 22, vendors: 55, slug: "banaskantha", image: "https://i.pinimg.com/736x/a3/9d/31/a39d31c4e36872af4d45dfc79526555a.jpg" },
  { name: "Bharuch", venues: 35, vendors: 85, slug: "bharuch", image: "https://i.pinimg.com/1200x/ba/88/db/ba88db7992ef92d79212c99139a95b28.jpg" },
  { name: "Bhavnagar", venues: 90, vendors: 250, slug: "bhavnagar", image: "https://i.pinimg.com/736x/92/4c/f0/924cf0fdb87d406daf250526427faeca.jpg" },
  { name: "Botad", venues: 15, vendors: 35, slug: "botad", image: "https://i.pinimg.com/736x/70/ff/af/70ffaf7abee641576a6252c6d39505f3.jpg" },
  { name: "Chhota Udaipur", venues: 10, vendors: 25, slug: "chhota-udaipur", image: "https://i.pinimg.com/736x/f6/50/ae/f650aeccb6bcd58bcbe729b2b51fd023.jpg" },
  { name: "Dahod", venues: 14, vendors: 32, slug: "dahod", image: "https://www.espitravels.in/wp-content/webp-express/webp-images/uploads/2024/11/gwalior-fort.png.webp" },
  { name: "Dang", venues: 8, vendors: 15, slug: "dang", image: "https://condorellifoundation.org/wp-content/uploads/2014/04/Ahwa.jpg" },
  { name: "Devbhoomi Dwarka", venues: 20, vendors: 45, slug: "devbhoomi-dwarka", image: "https://i.pinimg.com/1200x/63/11/04/6311040651effcddc85ee904bf2de5eb.jpg" },
  { name: "Gir Somnath", venues: 18, vendors: 40, slug: "gir-somnath", image: "https://i.pinimg.com/736x/a0/58/a3/a058a3d5f51e626cb1f5d9406049a295.jpg" },
  { name: "Jamnagar", venues: 85, vendors: 220, slug: "jamnagar", image: "https://i.pinimg.com/1200x/e6/2d/f6/e62df6b9d97b1f02cf8e62c7f611fc0a.jpg" },
  { name: "Junagadh", venues: 60, vendors: 150, slug: "junagadh", image: "https://i.pinimg.com/736x/e6/56/9b/e6569bb3100d1a2a003583427e6e7519.jpg" },
  { name: "Kheda", venues: 25, vendors: 60, slug: "kheda", image: "https://www.santram.org/wp-content/uploads/2020/06/000-scaled.jpg" },
  { name: "Mahisagar", venues: 12, vendors: 28, slug: "mahisagar", image: "https://content.jdmagicbox.com/comp/jamnagar/q2/0288px288.x288.141211164527.e3q2/catalogue/shantinath-mandir-jain-temple-bedi-gate-jamnagar-temples-3fdperz.jpg" },
  { name: "Mehsana", venues: 40, vendors: 90, slug: "mehsana", image: "https://i.pinimg.com/1200x/08/69/3d/08693d4b604692956d4af85997ac58b7.jpg" },
  { name: "Morbi", venues: 40, vendors: 95, slug: "morbi", image: "https://i.pinimg.com/1200x/20/98/b5/2098b5a9e9a7ce9c7997f3d152fb3a53.jpg" },
  { name: "Narmada", venues: 15, vendors: 35, slug: "narmada", image: "https://i.pinimg.com/1200x/c9/85/72/c985721d1a731b1a667212894c2b5f08.jpg" },
  { name: "Navsari", venues: 45, vendors: 110, slug: "navsari", image: "https://www.baps.org//Data/Sites/1/Media/LocationImages/143BAPS%20Navsari%20Mandir%20Murti-Pratishtha%20Mandir%20Moods%2005.jpg" },
  { name: "Panchmahal", venues: 18, vendors: 40, slug: "panchmahal", image: "https://i.pinimg.com/1200x/b4/23/a4/b423a4702e64554aa0bcaf91b0f89bef.jpg" },
  { name: "Patan", venues: 20, vendors: 45, slug: "patan", image: "https://i.pinimg.com/1200x/92/c7/11/92c711a2090402caa10c0eb7af5cd730.jpg" },
  { name: "Porbandar", venues: 15, vendors: 35, slug: "porbandar", image: "https://i.pinimg.com/1200x/c2/8b/f7/c28bf79c77ff4d63f84128cdb2f016e3.jpg" },
  { name: "Sabarkantha", venues: 15, vendors: 35, slug: "sabarkantha", image: "https://i.pinimg.com/1200x/45/50/d5/4550d5e01a2c8c6b3ac84bc8e5e31f67.jpg" },
  { name: "Surendranagar", venues: 22, vendors: 50, slug: "surendranagar", image: "https://i.pinimg.com/736x/07/bb/d7/07bbd75206553cdb667deca30c08cc78.jpg" },
  { name: "Tapi", venues: 10, vendors: 22, slug: "tapi", image: "https://mindtrip.ai/cdn-cgi/image/format=webp,w=720/https://images.mindtrip.ai/attractions/3d61/82b7/9816/4714/4701/ec66/84d1/f44b" },
  { name: "Valsad", venues: 25, vendors: 65, slug: "valsad", image: "https://i.pinimg.com/1200x/87/e2/dc/87e2dc7ee225d80ee10fdb648531fc49.jpg" },
  { name: "Palitana", venues: 20, vendors: 45, slug: "palitana", image: "https://i.pinimg.com/1200x/e7/54/8f/e7548f1180095056803b325726eac684.jpg" },
  { name: "Bhuj", venues: 25, vendors: 60, slug: "bhuj", image: "https://i.pinimg.com/736x/dd/3b/61/dd3b610a18e88e18e198c247f6c4d7c3.jpg" },
  { name: "Gandhidham", venues: 55, vendors: 140, slug: "gandhidham", image: "https://i.pinimg.com/1200x/fb/28/72/fb2872254b7dcd25cc13db4891580aa0.jpg" },
];
