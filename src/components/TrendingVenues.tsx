"use client";

import { TrendingUp, Star, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BADGES = ["Most Viewed", "Recently Searched", "Trending"];
// Uniform card: 130px wide, same height across sections
const CARD_W = "w-[130px] flex-shrink-0";

const TrendingVenues = () => {
  const [venues, setVenues] = useState<any[]>([]);

  useEffect(() => {
    const fetchVenues = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("venues")
        .select("id, name, city, location, slug, rating, min_capacity, max_capacity, image, images, type, is_active")
        .eq("is_active", true)
        .order("rating", { ascending: false })
        .range(4, 6);
      if (data) setVenues(data);
    };
    fetchVenues();
  }, []);

  return (
    <section className="py-4 md:py-6 bg-gradient-to-b from-primary/5 to-white">
      <div className="md:container">
        <div className="flex items-center justify-between mb-3 md:mb-6 px-4 md:px-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-[9px] font-semibold tracking-[2px] uppercase text-primary">Hot Right Now</span>
            </div>
            <h2 className="font-display text-2xl md:text-5xl font-semibold text-foreground">
              Trending <em className="italic text-primary">Venues</em>
            </h2>
          </div>
          <Link href="/venues" className="hidden md:block">
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">View All</Button>
          </Link>
        </div>

        {/* MOBILE: flush-left single-row scroll, uniform 130px wide cards */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pl-4 pr-4" style={{ width: "max-content" }}>
            {venues.map((venue, i) => {
              const citySlug = (venue.city || "ahmedabad").toLowerCase().replace(/\s+/g, "-");
              const imgSrc = venue.image || (venue.images && venue.images[0]);
              return (
                <Link key={venue.id} href={`/${citySlug}/${venue.slug}`}
                  className={`${CARD_W} bg-white rounded-xl overflow-hidden border border-border shadow-sm`}>
                  {/* image same height as card width → square top then details below */}
                  <div className="relative h-[130px] overflow-hidden">
                    <img src={imgSrc || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80"}
                      alt={venue.name} className="w-full h-full object-cover" />
                    <div className="absolute top-1.5 left-1.5">
                      <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[7px] font-bold flex items-center gap-0.5 uppercase">
                        <TrendingUp className="w-2 h-2" />{BADGES[i] || "Trending"}
                      </span>
                    </div>
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white/95 text-[8px] font-bold shadow-sm">
                      <Star className="w-2 h-2 fill-amber-400 text-amber-400" />{venue.rating || "4.8"}
                    </div>
                    {/* name overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                      <p className="text-white text-[9px] font-black line-clamp-1">{venue.name}</p>
                      <p className="text-white/70 text-[7px] font-bold line-clamp-1">{venue.location || venue.city}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {venues.map((venue, i) => {
            const citySlug = (venue.city || "ahmedabad").toLowerCase().replace(/\s+/g, "-");
            const imgSrc = venue.image || (venue.images && venue.images[0]);
            return (
              <Link key={venue.id} href={`/${citySlug}/${venue.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 block shadow-sm">
                <div className="relative h-56 overflow-hidden">
                  <img src={imgSrc || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"} alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold flex items-center gap-1 uppercase">
                      <TrendingUp className="w-2.5 h-2.5" />{BADGES[i] || "Trending"}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/95 text-xs font-bold shadow-sm">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />{venue.rating || "4.8"}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-display font-black text-foreground text-lg leading-tight group-hover:text-primary line-clamp-1">{venue.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground font-bold">
                    <MapPin className="w-3 h-3 text-primary shrink-0" /><span className="line-clamp-1">{venue.location || venue.city}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground font-bold">
                    <Users className="w-3 h-3 text-primary shrink-0" /><span>{venue.max_capacity || 500} Guests</span>
                  </div>
                  <button className="w-full py-2 bg-slate-900 hover:bg-primary text-white text-xs font-black uppercase tracking-widest rounded-lg transition-colors">View Details</button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendingVenues;
