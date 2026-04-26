"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OCCASIONS, VENDOR_TYPES, VENUE_TYPES } from "@/lib/constants";
import { gujaratCities } from "@/lib/cities";

const EVENT_SUGGESTIONS = Object.values(OCCASIONS).flat();

const HeroSearch = () => {
  const router = useRouter();
  const [serviceType, setServiceType] = useState("venues");
  const [city, setCity] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filtered = EVENT_SUGGESTIONS.filter(e =>
    e.toLowerCase().includes(searchText.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = () => {
    const citySlug = city.trim().toLowerCase().replace(/\s+/g, '-');
    const typeSlug = serviceType.trim().toLowerCase().replace(/[\s/]+/g, '-');

    // Construct the base SEO path
    let targetPath = "/";

    // Determine if it's a venue or vendor search based on the selected value
    const isVenueType = VENUE_TYPES.includes(serviceType) || serviceType === 'venues';
    const isVendorType = VENDOR_TYPES.includes(serviceType) || serviceType === 'vendors';

    if (citySlug && (isVenueType || isVendorType)) {
      if (isVenueType) {
        // Special case for "all venues"
        if (serviceType === 'venues') {
          targetPath = `/${citySlug}/`;
        } else {
          targetPath = `/${citySlug}/${typeSlug}/`;
        }
      } else {
        // Special case for "all vendors"
        if (serviceType === 'vendors') {
          targetPath = `/${citySlug}/vendors/`;
        } else {
          targetPath = `/${citySlug}/vendors/${typeSlug}/`;
        }
      }
    } else if (citySlug) {
      targetPath = `/${citySlug}/`;
    } else if (isVenueType || isVendorType) {
      if (isVenueType) {
        targetPath = serviceType === 'venues' ? '/venues/' : `/ahmedabad/${typeSlug}/`;
      } else {
        targetPath = serviceType === 'vendors' ? '/vendors/' : `/ahmedabad/vendors/${typeSlug}/`;
      }
    } else {
      targetPath = serviceType === 'vendors' ? '/vendors/' : '/venues/';
    }

    // Include free-text search as a query parameter if present
    if (searchText) {
      const q = encodeURIComponent(searchText.trim());
      targetPath = `${targetPath}?q=${q}`;
    }

    router.push(targetPath);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="relative min-h-[55vh] md:min-h-[80vh] flex flex-col justify-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80"
          alt="Luxury Event Venue"
          className="w-full h-full object-cover animate-[zoomOut_12s_ease_forwards]"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[rgba(10,5,10,0.97)] via-[rgba(18,8,14,0.75)] to-[rgba(18,8,14,0.45)]" />

      {/* Content */}
      <div className="relative z-[2] container pb-8 md:pb-12 pt-20 md:pt-40 px-5">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-6">
            <div className="h-px w-3 md:w-6 bg-white/30" />
            <span className="text-[8px] md:text-[10.5px] font-semibold tracking-[1.5px] md:tracking-[3px] uppercase text-white/55 text-center">
              Gujarat&apos;s Premier Venue Platform
            </span>
            <div className="h-px w-3 md:w-6 bg-white/30" />
          </div>

          {/* Headline */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.15] md:leading-[1.05] text-white mb-5 md:mb-7 tracking-tight">
            Where Every<br />
            <em className="italic text-primary drop-shadow-[0_2px_10px_rgba(255,255,255,0.7)] bg-white/10 px-2 md:px-4 rounded-full">Celebration</em><br />
            Begins
          </h1>

          {/* Search Box */}
          <div className="bg-black/40 backdrop-blur-md border border-white/15 rounded-xl md:rounded-[2rem] p-3 md:p-6 lg:p-8 max-w-3xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <h3 className="font-display text-base md:text-2xl text-white font-medium mb-3 md:mb-6 text-center tracking-wide">
              Find Your Perfect Match
            </h3>

            {/* Unified search bar */}
            <div className="flex flex-col gap-2 md:gap-0 md:flex-row bg-white/10 border border-white/20 rounded-lg md:rounded-full p-1.5 md:p-1.5 overflow-hidden">
              {/* Text search with autocomplete */}
              <div ref={searchRef} className="relative flex-1 min-w-0">
                <input
                  type="text"
                  value={searchText}
                  onChange={e => { setSearchText(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Wedding, birthday, event..."
                  className="w-full bg-transparent text-white placeholder-white/40 px-3 h-10 md:h-11 text-xs focus:outline-none"
                />
                {showSuggestions && searchText && filtered.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 md:mt-4 bg-white rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto border border-border">
                    {filtered.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { setSearchText(s); setShowSuggestions(false); }}
                        className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors border-b border-slate-50 last:border-0"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-white/20 my-2 mx-1" />

              {/* Looking For */}
              <div className="md:w-40">
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger className="bg-transparent border-0 text-white h-10 md:h-11 w-full focus:ring-0 hover:bg-white/5 rounded-md px-3 text-xs">
                    <SelectValue placeholder="Looking for..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-[300px] overflow-y-auto">
                    <SelectItem value="venues" className="font-bold border-b border-slate-100">All Venues</SelectItem>
                    {VENUE_TYPES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    <SelectItem value="vendors" className="font-bold border-t border-b border-slate-100 mt-2">All Vendors</SelectItem>
                    {VENDOR_TYPES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-white/20 my-2 mx-1" />

              {/* City */}
              <div className="md:w-36">
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="bg-transparent border-0 text-white h-10 md:h-11 w-full focus:ring-0 hover:bg-white/5 rounded-md px-3 text-xs">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Cities</SelectItem>
                    {gujaratCities.map(c => (
                      <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 text-white h-10 md:h-11 md:px-8 text-[11px] font-bold tracking-widest uppercase shadow-lg rounded-md md:rounded-full flex-shrink-0"
              >
                <Search className="w-3.5 h-3.5 mr-2" />
                Search
              </Button>
            </div>

            {/* Popular Searches */}
            <div className="mt-4 hidden md:flex flex-wrap gap-2 justify-center">
              {["Wedding", "Birthday", "Corporate", "Engagement"].map(label => (
                <button
                  key={label}
                  onClick={() => {
                    setSearchText(label);
                    router.push(`/venues?q=${encodeURIComponent(label)}`);
                  }}
                  className="text-[10px] uppercase font-bold tracking-wider text-white/40 hover:text-white/90 transition-colors bg-white/5 border border-white/10 rounded-full px-4 py-1.5 hover:bg-white/10"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes zoomOut {
          from { transform: scale(1.08); }
          to { transform: scale(1.00); }
        }
      `}</style>
    </section>
  );
};

export default HeroSearch;
