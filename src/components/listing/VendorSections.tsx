'use client';

import { IndianRupee, MapPin, Star, Award, Check, X, Camera, Building2, Phone, MessageSquare, Globe, Instagram, Mail, Info, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VenueLightbox from "./VenueLightbox";
import { useState } from "react";

// Section 3: Quick Stats Bar
export const VendorQuickStats = ({ vendor }: { vendor: any }) => {
  const stats = [
    { icon: <IndianRupee className="w-5 h-5" />, label: "Starts At", value: `₹${vendor.starting_price?.toLocaleString('en-IN') || 'Consult'}` },
    { icon: <Award className="w-5 h-5" />, label: "Category", value: vendor.category || "Professional" },
    { icon: <MapPin className="w-5 h-5" />, label: "Base City", value: vendor.city || "Gujarat" },
    { icon: <Star className="w-5 h-5 text-yellow-500" />, label: "Rating", value: `${vendor.rating || '0.0'} (${vendor.reviews || 0} reviews)` }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-3xl overflow-hidden shadow-sm mb-10">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 flex flex-col items-center text-center group hover:bg-slate-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            {stat.icon}
          </div>
          <span className="text-[10px] uppercase tracking-[2px] font-bold text-slate-400 mb-1">{stat.label}</span>
          <span className="text-sm font-bold text-slate-700">{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

// Section 5: Services & Packages
export const VendorServices = ({ vendor }: { vendor: any }) => {
  // Category-based default services if none provided in DB
  const defaultServicesMap: Record<string, string[]> = {
    'Photography': ['Candid Photography', 'Traditional Photography', 'Cinematic Wedding Films', 'Pre-wedding Shoots', 'Albums'],
    'Makeup Artists': ['Bridal Makeup', 'Airbrush Makeup', 'Party Makeup', 'Hairstyling', 'Draping'],
    'Decorators': ['Floral Decor', 'Themed Decor', 'Stage Setup', 'Lighting', 'Entrance Decor'],
    'Caterers': ['Vegetarian Menu', 'Live Counters', 'Continental Buffet', 'Traditional Thali', 'Dessert Bars'],
    'default': ['Professional Consultation', 'Customized Packages', 'On-site Execution', 'Quality Equipment']
  };

  const services = defaultServicesMap[vendor.category] || defaultServicesMap['photography'] || defaultServicesMap['default'];

  return (
    <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 mb-10">
      <h2 className="text-2xl font-display font-bold mb-8 text-slate-900 flex items-center gap-3">
        <Award className="w-6 h-6 text-primary" /> Services & Packages
      </h2>
      
      <div className="mb-8">
        <div className="inline-block px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
             <span className="text-slate-500 text-xs font-bold uppercase tracking-widest block mb-1">Starting Price</span>
             <span className="text-3xl font-display font-black text-primary">₹{vendor.starting_price?.toLocaleString('en-IN') || 'Consult'}</span>
        </div>
        <p className="text-sm text-slate-500 font-medium">Prices may vary based on event date, requirements, and customization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h4 className="font-bold text-slate-900 mb-4">What we offer:</h4>
          <ul className="space-y-3">
            {services.map((service, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {service}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <h4 className="font-bold text-slate-900 mb-2">Package Customization</h4>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">We offer flexible packages (Basic, Standard, Premium) tailored to your vision and budget. Get in touch for a detailed price list.</p>
          <div className="space-y-2">
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-primary w-1/3 rounded-full" /></div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-primary w-2/3 rounded-full" /></div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-primary w-full rounded-full" /></div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-primary/5 flex items-start gap-4 border border-primary/10">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
            <p className="text-sm font-bold text-slate-700 mb-1">Get a custom quote!</p>
            <p className="text-xs text-slate-600">Share your event details to receive a personalized portfolio and price estimate within 24 hours.</p>
        </div>
      </div>
    </section>
  );
};

// Section 6: Portfolio / Work Gallery
export const VendorPortfolio = ({ images, name }: { images: string[], name: string }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openLightbox = (idx: number) => {
    setActiveIndex(idx);
    setLightboxOpen(true);
  };

  const displayImages = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    "https://images.unsplash.com/photo-1487412947147-5cebf100d898?w=800&q=80",
    "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80"
  ];

  return (
    <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 mb-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-bold text-slate-900">Portfolio & Work</h2>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{displayImages.length} Photos</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayImages.map((img, i) => (
          <div 
            key={i} 
            className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group relative shadow-sm hover:shadow-xl transition-all duration-500"
            onClick={() => openLightbox(i)}
          >
            <img 
              src={img} 
              alt={`${name} Work Portfolio ${i + 1}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
               <Camera className="w-8 h-8 text-white scale-75 group-hover:scale-100 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {displayImages.length < 4 && (
        <div className="mt-8 p-10 rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
            <Camera className="w-10 h-10 text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">More work coming soon!</p>
            <p className="text-xs text-slate-300">Stay tuned as {name} updates their latest collection.</p>
        </div>
      )}

      <VenueLightbox 
        images={displayImages} 
        isOpen={lightboxOpen} 
        initialIndex={activeIndex} 
        onClose={() => setLightboxOpen(false)} 
      />
    </section>
  );
};

// Section 7: Service Areas
export const VendorServiceAreas = ({ vendor }: { vendor: any }) => {
  const address = vendor.address || `${vendor.city}, Gujarat`;
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 mb-10">
      <h2 className="text-2xl font-display font-bold mb-8 text-slate-900">Service Areas & Location</h2>
      
      <div className="flex flex-wrap gap-2 mb-8">
        <div className="px-4 py-2 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest">Base: {vendor.city || 'Gujarat'}</div>
        {['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'].map(city => (
          <div key={city} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none flex items-center">
            {city}
          </div>
        ))}
        <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase tracking-widest flex items-center italic">
          <Globe className="w-3 h-3 mr-1.5" /> Available Across Gujarat
        </div>
      </div>

      <div className="rounded-[2rem] overflow-hidden h-[300px] w-full border border-slate-200 mb-6 grayscale hover:grayscale-0 transition-all duration-700">
          <iframe 
              width="100%" 
              height="100%" 
              src={mapUrl}
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
          ></iframe>
      </div>

      <div className="flex items-center gap-4 text-slate-500 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <MapPin className="w-8 h-8 text-primary shrink-0" />
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Office Address</p>
            <p className="text-lg font-light text-slate-700 leading-tight">{address}</p>
          </div>
      </div>
    </section>
  );
};
