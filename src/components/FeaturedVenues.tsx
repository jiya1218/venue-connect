"use client";

import { Star, Users, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const FeaturedVenues = () => {
  const [venues, setVenues] = useState<any[]>([]);

  useEffect(() => {
    const fetchVenues = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("venues")
        .select("id, name, city, slug, rating, min_capacity, max_capacity, image, images, type, is_active")
        .eq("is_active", true)
        .order("rating", { ascending: false })
        .limit(4);
      if (data) setVenues(data);
    };
    fetchVenues();
  }, []);

  return (
    <section className="py-4 md:py-6 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 md:w-12 bg-primary/30" />
            <span className="text-[10px] md:text-[10.5px] font-semibold tracking-[3px] uppercase text-primary">
              Handpicked for You
            </span>
            <div className="h-px w-8 md:w-12 bg-primary/30" />
          </div>
          
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mb-4">
            Featured <em className="italic text-primary">Venues</em>
          </h2>
          
          <p className="text-sm md:text-[15px] text-muted-foreground max-w-xl mx-auto px-4">
            Discover verified venues trusted by thousands of event organizers
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {venues.map((venue, i) => {
            const citySlug = (venue.city || "ahmedabad").toLowerCase().replace(/\s+/g, "-");
            const imgSrc = venue.image || (venue.images && venue.images[0]);
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
                  className="group bg-white rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer block h-full shadow-sm"
                >
                  <div className="relative h-32 md:h-52 overflow-hidden">
                    <img
                      src={imgSrc || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80"}
                      alt={venue.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    <div className="absolute top-2 right-2 md:top-3 md:right-3 flex items-center gap-1 px-1.5 py-0.5 md:px-2.5 md:py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> 
                      <span className="text-[9px] md:text-xs font-bold">{venue.rating || "4.8"}</span>
                    </div>
                  </div>

                  <div className="p-3 md:p-5 space-y-1.5 md:space-y-3">
                    <h3 className="font-display font-black text-foreground text-xs md:text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                      {venue.name}
                    </h3>

                    <div className="flex items-center gap-1 text-[9px] md:text-sm text-muted-foreground font-bold">
                      <MapPin className="w-3 h-3 text-primary shrink-0" /> 
                      <span className="line-clamp-1">{venue.city}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[9px] md:text-sm text-muted-foreground font-bold">
                      <Users className="w-3 h-3 text-primary shrink-0" /> 
                      <span className="line-clamp-1">{venue.max_capacity || 500} Guests</span>
                    </div>

                    <button className="w-full py-1.5 md:py-2 bg-primary hover:bg-primary/95 text-white text-[9px] md:text-xs font-black uppercase tracking-widest rounded-lg transition-colors mt-1 md:mt-2">
                        Check Price
                    </button>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/venues">
            <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/5">
              View All Venues →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVenues;
