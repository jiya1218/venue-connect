export const VENUE_CATEGORIES = [
  "banquet-halls",
  "party-plots",
  "hotels",
  "resorts",
  "restaurants",
  "farmhouses",
  "clubs",
  "cafes",
  "lawns",
  "marriage-halls",
  "conference-rooms",
  "party-halls",
  "rooftop-spaces",
  "poolside-spaces",
  "heritage-venues",
  "luxury-venues",
  "garden-venues"
];

export const VENDOR_CATEGORIES = [
  "accessories",
  "anchor",
  "astrologers",
  "bridal-outfits",
  "caterers",
  "choreography",
  "cooking-classes",
  "fireworks",
  "decorators",
  "detective-services",
  "djs",
  "grooms-outfits",
  "gym",
  "hathi-ghoda-car",
  "honeymoon-planning",
  "invitations",
  "jaan-stay",
  "jewellery",
  "makeup-artists",
  "mehndi-artists",
  "bands-musicians",
  "pandit",
  "photographers",
  "return-gift",
  "sounds-led-lights",
  "transport-services",
  "venues",
  "videographers",
  "wedding-cakes",
  "wedding-artists"
];

export const EVENT_TYPES = [
  "wedding",
  "birthday-party",
  "engagement",
  "corporate-event",
  "reception",
  "sangeet-ceremony",
  "garba-night",
  "pool-party",
  "kitty-party",
  "cocktail-party",
  "baby-shower",
  "anniversary-party",
  "farewell-party",
  "reunion-party",
  "product-launch",
  "conference",
  "seminar",
  "award-ceremony",
  "walkin-interview",
  "training",
  "team-outing",
  "stage-event",
  "ring-ceremony",
  "residential-conference",
  "pre-wedding-mehendi-party",
  "photo-shoots",
  "naming-ceremony",
  "musical-concert",
  "mice",
  "meeting",
  "kids-birthday-party",
  "holi-party",
  "group-dining",
  "get-together",
  "game-watch",
  "freshers-party",
  "first-birthday-party",
  "fashion-show",
  "family-function",
  "exhibition",
  "corporate-training",
  "corporate-party",
  "corporate-offsite",
  "cocktail-dinner",
  "class-reunion",
  "christian-communion",
  "childrens-party",
  "business-dinner",
  "bridal-shower",
  "brand-promotion",
  "bachelor-party",
  "aqueeqa-ceremony",
  "annual-fest",
  "adventure-party",
  "haldi-ceremony"
];

// Unified Core Categories for Hyper-Local Targeting (8 categories from user)
export const SEO_PRIORITY_CATEGORIES = [
  { slug: "banquet-halls", name: "Banquet Halls" },
  { slug: "party-plots", name: "Party Plots & Lawns" },
  { slug: "hotels", name: "Wedding Hotels" },
  { slug: "farmhouses", name: "Farmhouses & Villas" },
  { slug: "marriage-halls", name: "Marriage Gardens" },
  { slug: "conference-rooms", name: "Conference & Meeting Halls" },
  { slug: "birthday-party-venues", name: "Birthday Party Venues" },
  { slug: "photographers", name: "Photographers & Videographers" }
];

export const NEAR_ME_PATTERN = "-near-me-in-";

export const formatSlug = (slug: string) => {
  if (!slug) return "";
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
