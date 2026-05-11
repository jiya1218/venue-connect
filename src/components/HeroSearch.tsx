"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OCCASIONS, VENDOR_TYPES, VENUE_TYPES, GUJARAT_CITIES, EVENT_SUGGESTIONS } from "@/lib/constants";
import RequirementWizard from "@/components/home/RequirementWizard";



function SearchBar() {
  const router = useRouter();
  const [serviceType, setServiceType] = useState("venues");
  const [city, setCity] = useState("all");

  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filtered = EVENT_SUGGESTIONS.filter(e =>
    e.toLowerCase().includes(searchText.toLowerCase())
  ).slice(0, 6);

  useEffect(() => {
    // Load initial city from localStorage
    const cached = localStorage.getItem('vc_user_city');
    if (cached) setCity(cached.toLowerCase());

    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    if (newCity !== 'all') {
      localStorage.setItem('vc_user_city', newCity.toLowerCase());
    }
  };

  const handleSearch = () => {
    const citySlug = (city === 'all' || !city) ? '' : city.trim().toLowerCase().replace(/\s+/g, '-');
    let typeSlug = serviceType.trim().toLowerCase().replace(/[\s/]+/g, '-');
    const isVenueType = VENUE_TYPES.includes(serviceType) || serviceType === 'venues';
    const isVendorType = VENDOR_TYPES.includes(serviceType) || serviceType === 'vendors';
    
    let targetPath = "/";

    // 1. If we have a recognized occasion in searchText, it becomes the primary path for venues
    const isRecognizedOccasion = EVENT_SUGGESTIONS.some(s => s.toLowerCase() === searchText.trim().toLowerCase());

    if (searchText && isVenueType && isRecognizedOccasion) {
        let occasionSlug = searchText.trim().toLowerCase().replace(/[\s/]+/g, '-');
        // Match detail.txt "Near Me" pattern for occasions: {name}-venue-near-me
        if (!occasionSlug.endsWith('-venue-near-me')) {
            occasionSlug += '-venue-near-me';
        }
        targetPath = `/${occasionSlug}/`;
    } 
    // 2. Standard city + category routing
    else if (isVenueType || isVendorType) {
      if (isVenueType) {
          if (citySlug) {
              targetPath = serviceType === 'venues' ? `/${citySlug}/` : `/${citySlug}/${typeSlug}/`;
          } else {
              targetPath = serviceType === 'venues' ? `/venues/` : `/${typeSlug}-near-me/`;
          }
      } else {
          if (citySlug) {
              targetPath = serviceType === 'vendors' ? `/${citySlug}/vendors/` : `/${citySlug}/vendors/${typeSlug}/`;
          } else {
              targetPath = serviceType === 'vendors' ? `/vendors/` : `/${typeSlug}-near-me/`;
          }
      }
    } else if (citySlug) {
      targetPath = `/${citySlug}/`;
    } else {
      targetPath = serviceType === 'vendors' ? '/vendors/' : '/venues/';
    }

    // Only add searchText as Q if it wasn't already moved to the path
    if (searchText && !isVenueType) {
        targetPath = `${targetPath}?q=${encodeURIComponent(searchText.trim())}`;
    }
    router.push(targetPath);
  };

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/15 rounded-xl p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col gap-1 md:gap-0 md:flex-row bg-white/8 border border-white/10 rounded-lg p-1 overflow-hidden">
        {/* Text search */}
        <div ref={searchRef} className="relative flex-1 min-w-0">
          <input
            type="text"
            value={searchText}
            onChange={e => { setSearchText(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Wedding, birthday, event..."
            className="w-full bg-transparent text-white placeholder-white/35 px-3 h-9 text-xs focus:outline-none"
          />
          {showSuggestions && searchText && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl z-50 max-h-44 overflow-y-auto border border-border">
              {filtered.map(s => (
                <button key={s} type="button"
                  onClick={() => { setSearchText(s); setShowSuggestions(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors border-b border-slate-50 last:border-0"
                >{s}</button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:block w-px bg-white/15 my-1" />

        {/* Looking For */}
        <div className="md:w-36">
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger className="bg-transparent border-0 text-white h-9 w-full focus:ring-0 hover:bg-white/5 rounded-md px-3 text-xs">
              <SelectValue placeholder="Looking for..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-[280px] overflow-y-auto">
              <SelectItem value="venues" className="font-bold border-b border-slate-100">All Venues</SelectItem>
              {VENUE_TYPES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              <SelectItem value="vendors" className="font-bold border-t border-b border-slate-100 mt-1">All Vendors</SelectItem>
              {VENDOR_TYPES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden md:block w-px bg-white/15 my-1" />

        {/* City */}
        <div className="md:w-32">
          <Select value={city} onValueChange={handleCityChange}>
            <SelectTrigger className="bg-transparent border-0 text-white h-9 w-full focus:ring-0 hover:bg-white/5 rounded-md px-3 text-xs">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Cities</SelectItem>
              {GUJARAT_CITIES.map(c => (
                <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="bg-primary hover:bg-primary/90 text-white h-9 px-5 text-[10px] font-bold tracking-widest uppercase shadow-md rounded-md flex-shrink-0"
        >
          <Search className="w-3 h-3 mr-1.5" /> Search
        </Button>
      </div>
    </div>
  );
}

const HeroSearch = () => {
  return (
    <section className="relative min-h-[60vh] md:min-h-[85vh] flex flex-col justify-center overflow-hidden py-12 md:py-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80"
          alt="Luxury Event Venue"
          className="w-full h-full object-cover animate-[zoomOut_20s_ease_forwards]"
          loading="eager"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-slate-950/95 via-slate-900/70 to-slate-950/90" />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px] z-[1] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-blue-500/10 rounded-full blur-[60px] md:blur-[100px] z-[1]" />

      <div className="relative z-[2] container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-10">

          {/* LEFT CONTENT */}
          <div className="flex-1 text-center lg:text-left space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-1 h-1 rounded-full bg-primary animate-ping" />
              <span className="text-[8px] md:text-xs font-black uppercase tracking-[2px] md:tracking-[3px] text-white/70">
                India's Most Trusted Venue Network
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-[1.2] md:leading-[1.1] text-white tracking-tighter">
              Luxury or <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-primary-foreground drop-shadow-2xl">Small Budget,</span> <br className="hidden md:block" />
              We Match You With the <br className="hidden md:block" />
              Perfect Venue & Vendors.
            </h1>

            <p className="text-[11px] md:text-lg text-white/50 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed px-2 md:px-0">
              Stop hunting, start celebrating. Share your vision and receive hand-picked quotes from Gujarat's finest venues — fast.
            </p>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start gap-4 sm:gap-3 pt-2">
              <div className="flex -space-x-2 sm:scale-100 justify-center sm:justify-start">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800 flex-shrink-0">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-slate-900 bg-primary flex items-center justify-center text-[10px] md:text-xs font-bold text-white flex-shrink-0">+2k</div>
              </div>
              <p className="text-[9px] md:text-xs font-bold text-white/50 uppercase tracking-wide text-center sm:text-left">Trusted by 50,000+ Happy Families</p>
            </div>
          </div>

          {/* RIGHT CONTENT: WIZARD */}
          <div className="flex-1 w-full max-w-lg mt-4 md:mt-0">
            <RequirementWizard />
          </div>

        </div>
      </div>

      <style>{`
        @keyframes zoomOut {
          from { transform: scale(1.15); }
          to { transform: scale(1.00); }
        }
      `}</style>
    </section>
  );
};

export default HeroSearch;
