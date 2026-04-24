"use client";

import { MapPin, ChevronRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const areas: Record<string, string[]> = {
  Ahmedabad: ["SG Highway", "Bopal", "Vastrapur", "Satellite", "Prahlad Nagar", "Thaltej", "Bodakdev", "Maninagar", "Naranpura", "Chandkheda"],
  Surat:     ["Adajan", "Vesu", "Pal", "Althan", "Piplod", "Citylight", "Ghod Dod Road", "Udhna", "Katargam", "Rander"],
  Vadodara:  ["Alkapuri", "Waghodia", "Manjalpur", "Gotri", "Vasna", "Akota", "Fatehgunj", "Sayajigunj", "Karelibaug", "Sama"],
  Rajkot:    ["Kalawad Road", "University Road", "Raiya Road", "150 Feet Ring Road", "Mavdi", "Kotecha Chowk", "Yagnik Road", "Jamnagar Road", "Gondal Road", "Bhaktinagar"],
};

const cityKeys = Object.keys(areas);

const LocalAreaDiscovery = () => {
  // Mobile: track which city is expanded (null = none)
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

  return (
    <section className="py-4 md:py-6 bg-gradient-to-b from-primary/5 to-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4 md:mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-2 md:mb-4">
            <div className="h-px w-8 md:w-12 bg-primary/30" />
            <span className="text-[9px] md:text-[10.5px] font-semibold tracking-[2px] md:tracking-[3px] uppercase text-primary">
              Local Discovery
            </span>
            <div className="h-px w-8 md:w-12 bg-primary/30" />
          </div>
          <h2 className="font-display text-2xl md:text-5xl font-semibold text-foreground mb-1 md:mb-4">
            Explore Venues by <em className="italic text-primary">Area</em>
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto hidden md:block">
            Find the perfect venue in your preferred locality
          </p>
        </motion.div>

        {/* ──── MOBILE: 4 city tabs, click to reveal areas ──── */}
        <div className="md:hidden space-y-2">
          {cityKeys.map((city) => {
            const isOpen = expandedCity === city;
            const localities = areas[city];
            return (
              <div key={city} className="bg-white rounded-xl border border-border overflow-hidden">
                {/* City header / toggle */}
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                  onClick={() => setExpandedCity(isOpen ? null : city)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-display text-sm font-semibold text-foreground">{city}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Expandable area list */}
                {isOpen && (
                  <div className="border-t border-border px-3 py-3">
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      {localities.map((area) => (
                        <Link
                          key={area}
                          href={`/${city.toLowerCase()}/${area.toLowerCase().replace(/\s+/g, '-')}`}
                          className="group flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5 hover:bg-primary hover:text-white transition-all duration-200"
                        >
                          <span className="text-[10px] font-medium text-foreground group-hover:text-white line-clamp-1">{area}</span>
                          <ChevronRight className="w-3 h-3 text-primary group-hover:text-white flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/${city.toLowerCase()}`}
                      className="block text-center text-[10px] text-primary font-bold hover:underline mt-1"
                    >
                      All venues in {city} →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ──── DESKTOP: existing 2-column grid ──── */}
        <div className="hidden md:grid grid-cols-2 gap-8">
          {Object.entries(areas).map(([city, localities], cityIndex) => (
            <motion.div
              key={city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: cityIndex * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-display text-2xl font-semibold text-foreground">{city}</h3>
                <Link href={`/${city.toLowerCase()}`} className="ml-auto text-xs text-primary hover:underline font-medium">
                  All in {city} →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {localities.map((area) => (
                  <Link
                    key={area}
                    href={`/${city.toLowerCase()}/${area.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group flex items-center justify-between px-4 py-3 rounded-lg bg-primary/5 hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-white line-clamp-1">{area}</span>
                    <ChevronRight className="w-4 h-4 text-primary group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocalAreaDiscovery;
