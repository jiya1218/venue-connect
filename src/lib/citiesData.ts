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
    localities: ["Ambawadi", "Amraiwadi", "Asarwa", "Ashram Road", "Bapunagar", "Bodakdev", "Bopal", "CG Road", "Chandkheda", "Dariapur", "Ellisbridge", "Gheekanta", "Gomtipur", "Gota", "Gurukul", "Iscon", "Jamalpur", "Jodhpur", "Juhapura", "Kalupur", "Kankaria", "Kathwada", "Khadia", "Khanpur", "Khokhara", "Lal Darwaja", "Maninagar", "Meghaninagar", "Memnagar", "Naranpura", "Naroda", "Narol", "Navrangpura", "Nikol", "Odhav", "Paldi", "Prahlad Nagar", "Rakhial", "Ranip", "Sabarmati", "Sarkhej", "Satellite", "SG Highway", "Shahibaug", "Shahpur", "Shilaj", "Sola", "South Bopal", "Thaltej", "Usmanpura", "Vastrapur", "Vatva", "Vejalpur"]
  },
  { 
    name: "Surat", 
    venues: 380, 
    vendors: 950, 
    slug: "surat", 
    image: "https://images.unsplash.com/photo-1630060041646-3ba002aa7d37?w=800&q=80",
    localities: ["Adajan", "Althan", "Amroli", "Athwa", "Bamroli", "Bhestan", "Chalthan", "City Light", "Dindoli", "Dumas", "Ghod Dod Road", "Hazira", "Ichchhapor", "Kamrej", "Katargam", "Khatodara", "Laskana", "Limbayat", "Majura Gate", "Nanpura", "Olpad Road", "Pal", "Palanpur", "Pandesara", "Parle Point", "Piplod", "Puna", "Rander", "Ring Road", "Sachin", "Sarthana", "Singanpor", "Udhna", "Utran", "Varachha", "Vesu"]
  },
  { 
    name: "Vadodara", 
    venues: 290, 
    vendors: 800, 
    slug: "vadodara", 
    image: "https://images.unsplash.com/photo-1677648626156-acad341ce207?w=800&q=80",
    localities: ["Akota", "Alkapuri", "Atladra", "Baranpura", "Dandia Bazar", "Fatehgunj", "Gorwa", "Gotri", "Harni", "Karelibaug", "Makarpura", "Manjalpur", "New Sama Road", "Nizampura", "Old Padra Road", "Panigate", "Raopura", "Refinery Road", "Sama", "Sayajigunj", "Subhanpura", "Tandalja", "Tarsali", "Vasna", "Wadi", "Waghodia"]
  },
  { 
    name: "Rajkot", 
    venues: 210, 
    vendors: 550, 
    slug: "rajkot", 
    image: "https://images.unsplash.com/photo-1692458236947-33d25789b2aa?w=800&q=80",
    localities: ["150 Feet Ring Road", "Airport Road", "Aji Dam Road", "Astron Chowk", "Bahumali Bhavan", "Bhaktinagar", "Digvijay Plot", "Doctor House", "Ghanteshwar", "Gondal Road", "Hariom Nagar", "Ishwar Nagar", "Jalaram", "Jamnagar Road", "Kalavad Road", "Kalawad Road", "Kanak Road", "Kasturba Road", "Kotecha Chowk", "Lalpari Lake", "Madhapar", "Mavdi", "Mavdi Chowk", "Metoda GIDC", "Morbi Road", "Nana Mava", "Nirmala Convent Road", "Paddhari", "Pedak Road", "Punjabi Para", "Raiya Road", "Raiyadhar", "Sadhuvasvani Road", "Shashtri Maidan", "Shrimali Society", "Tagore Road", "University Road", "Vavdi", "Virani Circle", "Yagnik Road", "Zankar Chowk"]
  },
  { 
    name: "Gandhinagar", 
    venues: 150, 
    vendors: 400, 
    slug: "gandhinagar", 
    image: "https://images.unsplash.com/photo-1641994751533-d9a98dcba149?w=800&q=80",
    localities: ["Adalaj", "Bhat", "Chandkheda", "Ghuma", "Infocity", "Koba", "Kudasan", "Motera", "Pethapur", "Randesan", "Sargasan", "Sector 1", "Sector 10", "Sector 11", "Sector 12", "Sector 13", "Sector 14", "Sector 15", "Sector 16", "Sector 17", "Sector 18", "Sector 19", "Sector 2", "Sector 20", "Sector 21", "Sector 22", "Sector 23", "Sector 24", "Sector 25", "Sector 26", "Sector 27", "Sector 28", "Sector 29", "Sector 3", "Sector 30", "Sector 4", "Sector 5", "Sector 6", "Sector 7", "Sector 8", "Sector 9", "Tragad", "Uvarsad", "Vavol", "Zundal"]
  },
  { 
    name: "Bhavnagar", 
    venues: 90, 
    vendors: 250, 
    slug: "bhavnagar", 
    image: "https://i.pinimg.com/736x/92/4c/f0/924cf0fdb87d406daf250526427faeca.jpg",
    localities: ["Amba Chowk", "Barton Library", "Bhavnagar Airport Road", "Bhavnagar Port", "College Road", "Crescent Circle", "Darbargadh", "Ghogha Circle", "Ghogha Road", "Jail Road", "Kalanala", "Khodiyar Nagar", "Krishna Nagar", "Lodhi Nagar", "Madhav Nagar", "Mahuva Road", "Nari Road", "Nilambag", "Old National Highway", "Palitana Road", "Parimal Society", "Patel Colony", "Rambaug", "Rupani Nagar", "Sardarnagar", "Shastri Nagar", "Sidsar Road", "Sihor Road", "Station Road", "Subhash Nagar", "Takhteshwar", "Talaja Road", "Ushmanpura", "Vijay Nagar", "Waghawadi Road"]
  },
  { 
    name: "Jamnagar", 
    venues: 85, 
    vendors: 220, 
    slug: "jamnagar", 
    image: "https://i.pinimg.com/1200x/e6/2d/f6/e62df6b9d97b1f02cf8e62c7f611fc0a.jpg",
    localities: ["Aerodrome Road", "Aji Industrial Estate", "Ashok Nagar", "Balambha", "Bedi", "Bedi Port Road", "Bhid Gate", "Chandrabhaga", "Dhrol Road", "Digvijay Plot", "Gandhi Nagar", "Guru Nanak Road", "Hapa", "Indira Marg", "Jamnagar Airport Road", "Kalavad Road", "Khodiyar Colony", "Lal Bangla", "Madhav Nagar", "Mota Mva", "Naghedi", "New Super Market", "Pancheshwar Colony", "Paris Circle", "Rajput Colony", "Ranmal Lake Road", "Sardar Nagar", "Shastri Nagar", "Sikka", "Swaminarayan Temple Road", "Teen Batti", "Versara", "Vidhyanagar Road"]
  },
  { 
    name: "Anand", 
    venues: 75, 
    vendors: 190, 
    slug: "anand", 
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Sardar_Patel_Memorial_Karamsad.JPG/1280px-Sardar_Patel_Memorial_Karamsad.JPG",
    localities: ["Anand Agriculture University", "Anand Station Road", "Ankhi", "Bakrol", "Bhalej", "Boriyavi", "Borsad Road", "Changa", "Dakor Road", "Dharmaj", "GIDC Anand", "Gujarat Vidyapith Road", "Karamsad", "Khambhat Road", "Lambhvel", "Mogar", "Nadiad Road", "New Anand", "Petlad Road", "Sojitra", "Tarapur", "Umreth", "VV Nagar", "Vallabh Vidyanagar", "Vidyanagar"]
  },
  { 
    name: "Junagadh", 
    venues: 60, 
    vendors: 150, 
    slug: "junagadh", 
    image: "https://i.pinimg.com/736x/e6/56/9b/e6569bb3100d1a2a003583427e6e7519.jpg",
    localities: ["Amrapur", "Bhavnath", "College Road", "Dhal Road", "Gir Road", "Junagadh Station Road", "Kalwa Chowk", "Keshod Road", "MG Road", "Majewadi Gate", "Manavadar Road", "Mendarda Road", "Nana Bazar", "Narsinh Mehta", "New Junagadh", "Patan Gate", "Rajkot Road", "Ranavav Road", "Sakkarbaug", "Sardar Bagh", "Shapur", "Sonagir", "Talala Road", "Uparkot", "Vanthali Road", "Visavadar Road", "Zanzarda Road"]
  },
  { 
    name: "Gandhidham", 
    venues: 55, 
    vendors: 140, 
    slug: "gandhidham", 
    image: "https://i.pinimg.com/1200x/fb/28/72/fb2872254b7dcd25cc13db4891580aa0.jpg",
    localities: ["Adipur", "Anjar Road", "Bhuj Road", "Kandla Port", "Kandla Road", "Kutch Industrial Area", "Mirzapar", "Mundra Port Road", "Mundra Road", "Ratnal", "Samakhiyali", "Sector 1", "Sector 10", "Sector 11", "Sector 12", "Sector 13", "Sector 14", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6", "Sector 7", "Sector 8", "Sector 9", "Tuna Road"]
  },
  { 
    name: "Navsari", 
    venues: 45, 
    vendors: 110, 
    slug: "navsari", 
    image: "https://www.baps.org//Data/Sites/1/Media/LocationImages/143BAPS%20Navsari%20Mandir%20Murti-Pratishtha%20Mandir%20Moods%2005.jpg",
    localities: ["Abrama", "Bahir Chowk", "Bai Veerbai Road", "Bilimora Road", "Chikhli Road", "Chovisi", "Dabhel", "Devsar", "Dudhia", "Dungri", "Eru", "Falia", "Gamdi", "Gandevi Road", "Jalalpore", "Juna Navsari", "Khergam Road", "Lunsikui", "Marod", "Navsari Agriculture University", "Navsari Court Area", "Punagam", "Sayaji Road", "Sion", "Station Road", "Vansda Road", "Vejalpore", "Vijalpore", "Waghwadi"]
  },
  { 
    name: "Morbi", 
    venues: 40, 
    vendors: 95, 
    slug: "morbi", 
    image: "https://i.pinimg.com/1200x/20/98/b5/2098b5a9e9a7ce9c7997f3d152fb3a53.jpg",
    localities: ["Clock Tower", "Court Road", "Darbargadh", "GIDC", "Gundala Road", "Halar Road", "Halvad Road", "Juna Bus Stand", "Kandorna Road", "Khunti Road", "Limbdi Road", "Machhu River Road", "Maliya Road", "New Bus Stand", "Rajkot Road", "Ravapar Road", "Sanala Road", "Shapar Road", "Station Road", "Tankara Road", "Thangadh Road", "Vaghpur Road", "Virani Road", "Wankaner Road"]
  },
  { 
    name: "Bhuj", 
    venues: 25, 
    vendors: 60, 
    slug: "bhuj", 
    image: "https://i.pinimg.com/736x/dd/3b/61/dd3b610a18e88e18e198c247f6c4d7c3.jpg",
    localities: ["Adhoi Road", "Anjar Road", "Ashapura Temple Road", "Bhachau Road", "Bhuj Airport Road", "Bus Station Road", "Court Road", "Dholavira Road", "Fort Road", "Gandhi Chowk", "Hamirsar Lake Road", "Hospital Road", "Jain Temple Road", "Jubilee Circle", "Kera Road", "Kundraudi", "Madhapar", "Mandvi Road", "Mirzapar Road", "Nakhatrana Road", "New Bhuj", "Old Bhuj", "Pragmahal Road", "Rapar Road", "Rudramata", "Shyamji Krishna Varma Road", "Station Road", "Swaminarayan Temple Road"]
  },
  { 
    name: "Valsad", 
    venues: 25, 
    vendors: 65, 
    slug: "valsad", 
    image: "https://i.pinimg.com/1200x/87/e2/dc/87e2dc7ee225d80ee10fdb648531fc49.jpg",
    localities: ["Abrama", "Amalsad", "Atul", "Bilimora", "Bilvani", "Chala", "Chikhli", "Daman Road", "Dharampur Road", "Dungri", "Gandevi", "Hathila", "Kabilpore", "Khanvel Road", "Khergam", "Navsari Road", "Pardi", "Sanjan", "Sarigam", "Solsumba", "Station Road", "Sumarpur", "Tithal Beach Road", "Tithal Road", "Umargam", "Valsad Court", "Vapi Road"]
  },
  { 
    name: "Palanpur", 
    venues: 20, 
    vendors: 45, 
    slug: "palanpur", 
    image: "https://i.pinimg.com/1200x/92/c7/11/92c711a2090402caa10c0eb7af5cd730.jpg",
    localities: ["Abu Road", "Agam Talav", "Ambaji Road", "Balaram Road", "Chanasma Road", "College Road", "Court Road", "Danta Road", "Deesa Road", "Dharoi Road", "GIDC", "Hadad Road", "Highway", "Jain Temple Road", "Kankrej Road", "Mahesana Road", "Malan Road", "Manpura", "Modasa Road", "New Bus Stand", "Patan Road", "Radhanpur Road", "Siddhapur Road", "Station Road", "Tharad Road", "Vadgam Road"]
  },
  { 
    name: "Dahod", 
    venues: 14, 
    vendors: 32, 
    slug: "dahod", 
    image: "https://www.espitravels.in/wp-content/webp-express/webp-images/uploads/2024/11/gwalior-fort.png.webp",
    localities: ["Chhota Udaipur Road", "City Center", "Court Road", "Devgadh Baria Road", "Dohad GIDC", "Fatepura", "Garbada Road", "Godhra Road", "Jhalod Road", "Kadana Road", "Khanpur", "Limkheda Road", "Lunawada Road", "Nandod Road", "Piplod", "Rampura", "Sanjeli Road", "Santrampur Road", "Shehera Road", "Singvad", "Station Road", "Zalod Road"]
  },
];
