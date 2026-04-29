'use client';

import { Users, IndianRupee, MapPin, Building2, Store, Wifi, Wind, Car, Users2, Clock, Check, X, ShieldCheck, Utensils, UtensilsCrossed, CalendarCheck, Info, ArrowRight, Sparkles, CheckCircle2, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Section 3: Quick Info Bar
export const QuickInfoBar = ({ venue }: { venue: any }) => {
  const stats = [
    { icon: <Users className="w-5 h-5" />, label: "Capacity", value: `${venue.min_capacity}-${venue.max_capacity} Guests` },
    { icon: <IndianRupee className="w-5 h-5" />, label: "Veg Plate", value: `₹${venue.veg_price_per_plate}/plate` },
    { icon: <Building2 className="w-5 h-5" />, label: "Venue Type", value: venue.type || "Banquet Hall" },
    { icon: <MapPin className="w-5 h-5" />, label: "Spaces", value: `${(venue.indoor_spaces || 0) > 0 ? 'Indoor' : ''} ${(venue.outdoor_spaces || 0) > 0 ? '& Outdoor' : ''}`.trim() || 'Indoor' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm mb-6 md:mb-10">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-3 md:p-6 flex flex-col items-center text-center group hover:bg-slate-50 transition-colors">
          <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform">
            {stat.icon}
          </div>
          <span className="text-[8px] md:text-[10px] uppercase tracking-[1px] md:tracking-[2px] font-bold text-slate-400 mb-1">{stat.label}</span>
          <span className="text-xs md:text-sm font-bold text-slate-700">{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

// Section 5: Pricing Table
export const PricingDetails = ({ venue }: { venue: any }) => {
  return (
    <section className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-10 shadow-sm border border-slate-100 mb-6 md:mb-10">
      <h2 className="text-lg md:text-2xl font-display font-bold mb-6 md:mb-8 text-slate-900 flex items-center gap-3">
        <IndianRupee className="w-5 h-5 md:w-6 md:h-6 text-primary" /> Pricing Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-slate-50">
            <span className="text-xs md:text-base text-slate-500 font-medium">Veg Price per plate</span>
            <span className="text-lg md:text-xl font-bold text-slate-900">₹{venue.veg_price_per_plate || 'N/A'}</span>
          </div>
          
          {venue.nonveg_price_per_plate > 0 && (
            <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-slate-50">
              <span className="text-xs md:text-base text-slate-500 font-medium">Non-Veg Price per plate</span>
              <span className="text-lg md:text-xl font-bold text-slate-900">₹{venue.nonveg_price_per_plate}</span>
            </div>
          )}

          <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-slate-50">
            <span className="text-xs md:text-base text-slate-500 font-medium">Advance Payment</span>
            <span className="text-slate-900 font-bold">{venue.advance_payment_percentage || 25}%</span>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          {venue.rooms_count > 0 && (
            <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-slate-50">
              <span className="text-xs md:text-base text-slate-500 font-medium">Rooms Available</span>
              <span className="text-slate-900 font-bold">{venue.rooms_count} Rooms</span>
            </div>
          )}

          <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-slate-50">
            <span className="text-xs md:text-base text-slate-500 font-medium">Alcohol Policy</span>
            <Badge variant={venue.alcohol_served ? "default" : "secondary"} className={`text-[10px] md:text-xs ${venue.alcohol_served ? "bg-emerald-500" : "bg-slate-100 text-slate-400"}`}>
              {venue.alcohol_served ? "Allowed" : "Not Allowed"}
            </Badge>
          </div>

          <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-slate-50">
            <span className="text-xs md:text-base text-slate-500 font-medium">Starting Package</span>
            <span className="text-primary font-bold text-sm md:text-base">₹{venue.starting_price?.toLocaleString('en-IN') || 'Consult'}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 md:mt-8 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 flex items-start gap-2 md:gap-3 border border-slate-100">
        <Info className="w-4 h-4 md:w-5 md:h-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[10px] md:text-xs text-slate-500 italic">Note: Prices shown are approximate and vary based on date, guest count, and customization. Contact the venue for an exact quote.</p>
      </div>
    </section>
  );
};

// Section 6: Amenities Grid
export const AmenitiesGrid = ({ venue }: { venue: any }) => {
  const standardAmenities = [
    { key: 'has_ac', label: 'AC Hall', icon: <Wind className="w-4 h-4" /> },
    { key: 'has_wifi', label: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
    { key: 'parking', label: 'Parking', icon: <Car className="w-4 h-4" />, customVal: true },
    { key: 'rooms', label: 'Rooms', icon: <Building2 className="w-4 h-4" />, customVal: (venue.rooms_count > 0) },
    { key: 'alcohol', label: 'Alcohol', icon: <ShieldCheck className="w-4 h-4" />, customVal: venue.alcohol_served }
  ];

  return (
    <section className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-10 shadow-sm border border-slate-100 mb-6 md:mb-10">
      <h2 className="text-lg md:text-2xl font-display font-bold mb-5 md:mb-8 text-slate-900">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {standardAmenities.map((amenity) => {
          const isAvailable = amenity.customVal !== undefined ? amenity.customVal : venue[amenity.key];
          return (
            <div key={amenity.label} className="flex items-start gap-2 md:gap-4 group">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-300'}`}>
                {amenity.icon}
              </div>
              <div className="flex flex-col">
                <span className={`text-xs md:text-[13px] font-bold ${isAvailable ? 'text-slate-700' : 'text-slate-300 line-through'}`}>{amenity.label}</span>
                {isAvailable ? <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-500" /> : <X className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-200" />}
              </div>
            </div>
          );
        })}
        {venue.amenities?.map((amenity: string) => (
            <div key={amenity} className="flex items-start gap-2 md:gap-4 group">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              <span className="text-xs md:text-[13px] font-bold text-slate-700">{amenity}</span>
            </div>
        ))}
      </div>
    </section>
  );
};

// Section 7: Spaces & Capacity
export const SpacesCapacity = ({ venue }: { venue: any }) => {
  return (
    <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 mb-10">
      <h2 className="text-2xl font-display font-bold mb-8 text-slate-900">Spaces & Capacity</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
          <Users2 className="w-8 h-8 text-primary mb-4" />
          <h4 className="font-bold text-slate-900 mb-1">Total Capacity</h4>
          <p className="text-2xl font-display font-bold text-primary">{venue.min_capacity}-{venue.max_capacity}</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Guests</p>
        </div>
        
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
          <Building2 className="w-8 h-8 text-primary mb-4" />
          <h4 className="font-bold text-slate-900 mb-1">Indoor Spaces</h4>
          <p className="text-2xl font-display font-bold text-slate-700">{venue.indoor_spaces || 1}</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Halls/Rooms</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
          <Clock className="w-8 h-8 text-primary mb-4" />
          <h4 className="font-bold text-slate-900 mb-1">Operating Hours</h4>
          <p className="text-sm font-bold text-slate-700">{venue.operating_hours || "09:00 AM - 11:00 PM"}</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Standard Timing</p>
        </div>
      </div>
    </section>
  );
};

// Section 8: Catering & Food
export const CateringPolicy = ({ venue }: { venue: any }) => {
  return (
    <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 mb-10">
      <h2 className="text-2xl font-display font-bold mb-8 text-slate-900">Food & Catering</h2>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Catering Policy</h4>
              <p className="text-sm text-slate-500">{venue.catering_policy || "Both In-house & Outside Allowed"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-2 rounded-xl">Veg Only</Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-400 px-4 py-2 rounded-xl italic">Non-Veg Not Available</Badge>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-50">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary" /> Cuisines Offered
          </h4>
          <div className="flex flex-wrap gap-2">
            {(venue.cuisines || ['North Indian', 'Gujarati', 'Continental', 'Chinese', 'South Indian']).map((cuisine: string) => (
              <span key={cuisine} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[13px] font-bold text-slate-600">
                {cuisine}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-50">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-primary" /> Payment Options
          </h4>
          <div className="flex flex-wrap gap-2">
            {(venue.payment_methods || ['Cash', 'UPI', 'Bank Transfer', 'Credit Card']).map((method: string) => (
              <span key={method} className="px-4 py-2 rounded-xl bg-primary/5 text-primary text-[11px] font-black tracking-widest uppercase">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Section 9: Location & Map
export const LocationMap = ({ venue }: { venue: any }) => {
    const address = venue.address || `${venue.location || ''}, ${venue.city}`;
    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

    return (
        <section id="location" className="bg-white rounded-[2.5rem] p-5 md:p-10 shadow-sm border border-slate-100 mb-6 md:mb-10 overflow-hidden scroll-mt-24">
            <h2 className="text-lg md:text-2xl font-display font-bold mb-6 md:mb-8 text-slate-900">Location & Directions</h2>
            
            <div className="rounded-2xl md:rounded-[2rem] overflow-hidden h-[300px] md:h-[400px] w-full border border-slate-200 mb-6 md:mb-8">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={mapUrl}
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                ></iframe>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                        <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <p className="text-sm md:text-lg font-light">{address}</p>
                </div>
                <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg shadow-black/20"
                >
                    Get Directions <ArrowRight className="w-5 h-5" />
                </a>
            </div>
        </section>
    );
};

// --- NEW SECTIONS ---

export const NearestLandmarks = ({ venue }: { venue: any }) => {
    const landmarks = [
        { label: "Nearest Metro Station", value: venue.nearest_metro || "1.2 km away", icon: "🚇" },
        { label: "Nearest Airport", value: venue.nearest_airport || "12 km away", icon: "✈️" },
        { label: "Nearest Railway Station", value: venue.nearest_railway || "4.5 km away", icon: "🚂" },
        { label: "Nearest Mall", value: venue.nearest_mall || "0.8 km away", icon: "🛍️" },
    ];

    return (
        <section className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 mb-10">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-8 text-slate-900">Nearest Landmarks</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {landmarks.map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-slate-700">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export const PolicyTerms = () => {
    return (
        <div className="space-y-6 mb-10">
            <section className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
                <h2 className="text-xl md:text-2xl font-display font-bold mb-4 text-slate-900">Policy Terms</h2>
                <div className="text-slate-600 text-sm leading-relaxed space-y-4">
                    <p>Our facilities provide all the services you need. We offer a wide variety of equipment to assist you through any function. Our policy for catering is open and that too without royalty for all caterers whichever you like. Impress your corporate partners, guests, relatives and family members with delicious catered lunches at meetings, symposiums and workshops. The Ballroom menu features an array of savory dishes from around the world. The decorative desserts always impress our guests.</p>
                </div>
            </section>

            <section className="bg-amber-50 rounded-3xl p-6 md:p-8 shadow-sm border border-amber-100">
                <h2 className="text-lg font-display font-bold mb-2 text-amber-900">Disclaimer</h2>
                <p className="text-amber-800/80 text-xs md:text-sm leading-relaxed italic">
                    The prices and other information described above is indicative and is reflective of the last time this information was updated on venueconnect.com. VenueConnect.com does not guarantee the above prices as packages are generally customized based on the event requirements.
                </p>
            </section>
        </div>
    );
};

export const AboutVenue = ({ venue }: { venue: any }) => {
    return (
        <section id="overview" className="space-y-12 mb-12 scroll-mt-24">
            <div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-950 mb-6 flex items-center gap-4">
                    <span className="w-2 h-10 bg-primary rounded-full" /> Description
                </h2>
                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 text-lg leading-relaxed">
                        {venue.description || `${venue.name} is a premier venue located in the heart of ${venue.city}. It offers a perfect blend of luxury, comfort, and state-of-the-art facilities for all your special occasions.`}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-slate-100">
                <div>
                    <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                        <Sparkles className="text-amber-500" size={20} /> Ambience
                    </h3>
                    <p className="text-slate-600 leading-relaxed italic">
                        {venue.ambience || "The venue boasts a sophisticated and elegant ambience with modern decor, ambient lighting, and spacious interiors that create a magical atmosphere for your events."}
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-500" size={20} /> Services Offered
                    </h3>
                    <ul className="grid grid-cols-1 gap-2">
                        {(venue.services_offered || ["Basic Lighting", "Electricity & Backup", "Valet Parking", "Furniture", "Service Staff", "Sound/Music License"]).map((service: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {service}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export const GoodForOccasions = ({ venue }: { venue: any }) => {
    const occasions = venue.good_for_occasions || ["Wedding", "Engagement", "Reception", "Birthday Party", "Anniversary Party", "Corporate Event", "Product Launch", "Conference"];
    
    return (
        <section className="mb-12">
            <h3 className="text-xl font-black text-slate-950 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" /> Good for Occasions
            </h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
                {occasions.map((occ: string) => (
                    <span key={occ} className="px-4 py-2 rounded-xl bg-white border border-slate-100 shadow-sm text-sm font-bold text-slate-700 hover:border-primary/30 transition-colors">
                        {occ}
                    </span>
                ))}
            </div>
        </section>
    );
};

export const CuisinesServed = ({ venue }: { venue: any }) => {
    return (
        <section className="mb-12">
            <h3 className="text-xl font-black text-slate-950 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" /> Cuisines Served at {venue.name}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {(venue.cuisines || ["North Indian", "South Indian", "Chinese", "Continental", "Gujarati", "Italian", "Mughlai", "Desserts"]).map((cuisine: string) => (
                    <div key={cuisine} className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex flex-col items-center text-center gap-2">
                        <Utensils className="text-orange-500" size={20} />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{cuisine}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export const FacilitiesList = ({ venue }: { venue: any }) => {
    const facilities = [
        { label: "Air Conditioned", icon: <Wind size={18} />, active: venue.has_ac !== false },
        { label: "Parking Space", icon: <Car size={18} />, active: true },
        { label: "Power Backup", icon: <ShieldCheck size={18} />, active: true },
        { label: "Wi-Fi", icon: <Wifi size={18} />, active: venue.has_wifi !== false },
        { label: "Catering", icon: <Utensils size={18} />, active: true },
        { label: "Stage", icon: <Building2 size={18} />, active: true },
    ];

    return (
        <section className="mb-12">
            <h3 className="text-xl font-black text-slate-950 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" /> Facilities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {facilities.map((fac, i) => (
                    <div key={i} className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${fac.active ? 'bg-white border-slate-100 shadow-sm text-slate-700' : 'bg-slate-50 border-transparent text-slate-300'}`}>
                        <div className={`${fac.active ? 'text-primary' : 'text-slate-300'}`}>{fac.icon}</div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-center">{fac.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export const SpaceTypeAvailable = ({ venue }: { venue: any }) => {
    const spaces = [
        { name: "Party Halls", count: venue.indoor_spaces || 2, icon: <Building2 size={24} /> },
        { name: "Banquet Halls", count: venue.banquet_halls_count || 1, icon: <Building size={24} /> },
        { name: "Rooms", count: venue.rooms_count || 5, icon: <Store size={24} /> },
        { name: "Outdoor Lawn", count: venue.outdoor_spaces || 1, icon: <MapPin size={24} /> },
    ];

    return (
        <section className="mb-12">
            <h3 className="text-xl font-black text-slate-950 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" /> Space Type Available
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {spaces.map((space, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm mb-4">
                            {space.icon}
                        </div>
                        <h4 className="font-black text-slate-900 mb-1">{space.name}</h4>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{space.count} Available</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export const CarParking = () => {
    return (
        <section className="mb-12 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-primary border border-white/10">
                    <Car size={40} />
                </div>
                <div>
                    <h3 className="text-2xl font-black mb-2">Ample Car Parking</h3>
                    <p className="text-white/60 font-medium">We provide dedicated parking space for over 200+ vehicles with valet service for your guests' convenience.</p>
                </div>
                <div className="md:ml-auto flex gap-4">
                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-center">
                        <p className="text-xl font-black">200+</p>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Slots</p>
                    </div>
                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-center">
                        <p className="text-xl font-black">Yes</p>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Valet</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const MoreInformation = ({ venue }: { venue: any }) => {
    const policies = [
        { label: "Decoration Description", value: venue.decoration_desc || "Decoration starts from 5000/- onwards" },
        { label: "Decoration Policy", value: venue.decoration_policy || "Decorations should be chosen only from our Panel" },
        { label: "Liquor Served", value: venue.alcohol_served ? "Yes" : "No" },
        { label: "Outside Liquor Permitted", value: venue.outside_alcohol_allowed ? "Yes" : "No" },
        { label: "DJ Available", value: venue.dj_available ? "Yes DJ Available [chargeable]" : "No" },
        { label: "DJ Starting Price", value: `Rs. ${venue.dj_price || '5000'}` },
        { label: "Catering Policy", value: venue.catering_policy || "Inhouse catering only. Outside caterers not allowed" },
        { label: "Booking Policy", value: venue.booking_policy || "25% advance. Balance on day of event before commencement." },
        { label: "Terms & Conditions", value: venue.terms_conditions || "No arms & ammunition allowed. Dress code - smart attire. Any Breakage by customer will be charged." },
        { label: "Cancellation Policy", value: venue.cancellation_policy || "No refund applicable if cancellation done later than 15 days before function date" },
    ];

    return (
        <section className="mb-12">
            <h3 className="text-xl font-black text-slate-950 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" /> More Information
            </h3>
            <div className="rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <tbody>
                        {policies.map((policy, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                <td className="p-2 md:p-2.5 w-1/3 border-b border-slate-50">
                                    <span className="text-[10px] md:text-xs font-black text-slate-900 uppercase tracking-wider">{policy.label}</span>
                                </td>
                                <td className="p-2 md:p-2.5 border-b border-slate-50">
                                    <span className="text-[11px] md:text-sm font-medium text-slate-600">{policy.value}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export const VenueSummary = ({ venue }: { venue: any }) => {
    return (
        <section className="mb-12 pt-12 border-t border-slate-100">
            <h3 className="text-xl font-black text-slate-950 mb-6">Summary</h3>
            <div className="p-6 md:p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10">
                <p className="text-slate-700 leading-relaxed font-medium">
                    {venue.name} is one of the most sought after {venue.type || 'Banquet Halls'} in {venue.city}. 
                    With a capacity of up to {venue.max_capacity} guests and a reputation for excellence, it is 
                    ideal for weddings, corporate events, and social gatherings. The venue offers 
                    {venue.veg_price_per_plate ? ` competitive pricing starting from ₹${venue.veg_price_per_plate} per plate` : ' premium catering options'} 
                    and a host of modern amenities to ensure your event is a grand success.
                </p>
            </div>
        </section>
    );
};

export const FAQs = ({ venue }: { venue: any }) => {
    const faqs = [
        { q: "What is the guest capacity?", a: `The venue can accommodate between ${venue.min_capacity || 50} to ${venue.max_capacity || 500} guests.` },
        { q: "Is outside catering allowed?", a: venue.catering_policy || "We have both in-house and outside catering options available." },
        { q: "Do you have rooms for stay?", a: venue.rooms_count > 0 ? `Yes, we have ${venue.rooms_count} rooms available for stay.` : "We do not have rooms for stay within the venue." },
        { q: "Is parking available?", a: "Yes, we have ample parking space with valet services." },
    ];

    return (
        <section className="mb-12">
            <h3 className="text-xl font-black text-slate-950 mb-6">Frequently Asked Questions</h3>
            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-primary/20 transition-colors">
                        <h4 className="font-bold text-slate-900 mb-2 flex items-start gap-2">
                            <span className="text-primary font-black">Q.</span> {faq.q}
                        </h4>
                        <p className="text-sm text-slate-500 pl-6 leading-relaxed">
                            {faq.a}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};
