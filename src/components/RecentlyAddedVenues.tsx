"use client";

import { Clock, MapPin, Users, Send, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

const RecentlyAddedVenues = () => {
  const [venues, setVenues] = useState<any[]>([]);

  useEffect(() => {
    const fetchVenues = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("venues")
        .select("id, name, city, location, slug, rating, min_capacity, max_capacity, image, images, type, is_active, created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);
      if (data) setVenues(data);
    };
    fetchVenues();
  }, []);

  return (
    <section className="py-4 md:py-6 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-[10.5px] font-semibold tracking-[3px] uppercase text-primary">
                Fresh Listings
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Recently <em className="italic text-primary">Added Venues</em>
            </h2>
          </div>
          
          <Link href="/venues">
            <Button variant="outline" className="hidden md:flex border-primary/30 text-primary hover:bg-primary/5">
              View All New
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {venues.map((venue, i) => {
            const citySlug = (venue.city || "ahmedabad").toLowerCase().replace(/\s+/g, "-");
            const imgSrc = venue.image || (venue.images && venue.images[0]);
            const added = venue.created_at ? timeAgo(venue.created_at) : "Recently";

            return (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/${citySlug}/${venue.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 block h-full shadow-sm"
                >
                  <div className="relative h-32 md:h-52 overflow-hidden">
                    <img
                      src={imgSrc || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80"}
                      alt={venue.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    <div className="absolute top-2 left-2">
                      <span className="px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-full bg-green-500 text-white text-[8px] md:text-xs font-semibold flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        New
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 md:px-2.5 md:py-1.5 rounded-full bg-white/95 backdrop-blur-sm">
                      <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
                      <span className="text-[8px] md:text-xs font-medium text-foreground">Verified</span>
                    </div>
                  </div>

                  <div className="p-3 md:p-5 space-y-1.5 md:space-y-3">
                    <h3 className="font-display font-semibold text-foreground text-xs md:text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                      {venue.name}
                    </h3>

                    <div className="flex items-center gap-1 text-[9px] md:text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 text-primary" /> 
                      <span className="line-clamp-1">{venue.location ? `${venue.location}, ` : ""}{venue.city}</span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] md:text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-3 h-3 text-primary" /> 
                        <span className="line-clamp-1">{venue.max_capacity || 500}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-foreground font-semibold">
                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                        {venue.rating || "4.8"}
                      </div>
                    </div>

                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white mt-1 h-7 md:h-9 text-[9px] md:text-xs">
                      <Send className="w-3 h-3 mr-1" /> Send Enquiry
                    </Button>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecentlyAddedVenues;
