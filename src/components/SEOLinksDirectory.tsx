"use client";

import Link from "next/link";
import { formatTitle } from "@/lib/seoContentEngine";
import { citiesData } from "@/lib/citiesData";
import { VENUE_CATEGORIES } from "@/lib/seoConstants";
import { MapPin } from "lucide-react";

interface SEOLinksDirectoryProps {
  city?: string | null;
}

const defaultLocalities = ["city-center", "north-zone", "south-zone", "east-zone", "west-zone"];

function pickDeterministicCategories(seed: string, count: number): string[] {
  if (VENUE_CATEGORIES.length === 0 || count <= 0) return [];

  const hash = seed
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  const firstIndex = hash % VENUE_CATEGORIES.length;
  const step = Math.max(1, (hash % (VENUE_CATEGORIES.length - 1 || 1)) + 1);
  const picked: string[] = [];

  for (let i = 0; i < Math.min(count, VENUE_CATEGORIES.length); i++) {
    const idx = (firstIndex + i * step) % VENUE_CATEGORIES.length;
    const category = VENUE_CATEGORIES[idx];
    if (!picked.includes(category)) {
      picked.push(category);
    }
  }

  return picked;
}

export default function SEOLinksDirectory({ city }: SEOLinksDirectoryProps) {
  const currentCitySlug = city ? city.toLowerCase().replace(/\s+/g, '-') : "ahmedabad";
  const cityData = citiesData.find(c => c.slug === currentCitySlug);
  const displayCity = cityData?.name || formatTitle(currentCitySlug);
  
  const localities = cityData?.localities || defaultLocalities;
  
  // Generate high-value SEO interlinks (Venuelook Style)
  const categoryLinks: { text: string; url: string }[] = [];
  const localityLinks: { text: string; url: string }[] = [];

  // 1. Top Category Links for the City
  VENUE_CATEGORIES.slice(0, 8).forEach(cat => {
    categoryLinks.push({
      text: `${formatTitle(cat)} in ${displayCity}`,
      url: `/${currentCitySlug}/${cat}`
    });
  });

  // 2. Locality + Category Links (The "long-tail" gold)
  localities.forEach(loc => {
    const categoriesForLocality = pickDeterministicCategories(`${currentCitySlug}-${loc}`, 2);
    categoriesForLocality.forEach(cat => {
      localityLinks.push({
        text: `${formatTitle(cat)} in ${formatTitle(loc)}, ${displayCity}`,
        url: `/${currentCitySlug}/${loc}/${cat}`
      });
    });
  });

  return (
    <section className="bg-slate-50 border-t border-slate-200 pt-16 pb-20 mt-12 w-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <h3 className="text-2xl font-black text-slate-900 mb-10 border-b-4 border-pink-600 inline-block pb-1">
          Explore Popular Areas in {displayCity}
        </h3>
        
        {/* Top Categorical Discovery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categoryLinks.map((link, idx) => (
            <Link 
              key={idx} 
              href={link.url} 
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-pink-500 hover:shadow-md transition-all group"
            >
              <span className="text-sm font-bold text-slate-700 group-hover:text-pink-600">{link.text}</span>
            </Link>
          ))}
        </div>

        {/* Hyper-Local Discovery Links */}
        <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Trending Localities</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-8 text-[13px]">
          {localityLinks.map((link, idx) => (
            <Link 
              key={idx} 
              href={link.url} 
              className="text-slate-500 hover:text-pink-600 hover:underline truncate transition-colors"
            >
              • {link.text}
            </Link>
          ))}
        </div>

        {/* Global Destination Navigation */}
        <div className="mt-16 pt-10 border-t border-slate-200">
           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Major Destinations in Gujarat</h4>
           <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {citiesData.filter(c => c.localities).map(c => (
                <Link key={c.slug} href={`/${c.slug}/banquet-halls`} className="text-slate-600 font-medium hover:text-pink-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {c.name}
                </Link>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
}
