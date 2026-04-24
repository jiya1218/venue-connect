'use client';

import { Users, IndianRupee, MapPin, Building2, Store, Wifi, Wind, Car, Users2, Clock, Check, X, ShieldCheck, Utensils, UtensilsCrossed, CalendarCheck, Info, ArrowRight } from "lucide-react";
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
        <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 mb-10 overflow-hidden">
            <h2 className="text-2xl font-display font-bold mb-8 text-slate-900">Location & Directions</h2>
            
            <div className="rounded-[2rem] overflow-hidden h-[400px] w-full border border-slate-200 mb-8 grayscale hover:grayscale-0 transition-all duration-700">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={mapUrl}
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                ></iframe>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-lg font-light max-w-md">{address}</p>
                </div>
                <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-bold flex items-center gap-3 hover:bg-black transition-all shadow-lg shadow-black/20"
                >
                    Get Directions <ArrowRight className="w-5 h-5" />
                </a>
            </div>
        </section>
    );
};
