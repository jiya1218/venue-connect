"use client";

import { MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";

const galleryEvents = [
  { title: "Grand Wedding Celebration",    venue: "The Grand Rajwada, Ahmedabad",       image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",  type: "Wedding" },
  { title: "Corporate Annual Summit",      venue: "Sapphire Convention, Rajkot",        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",  type: "Corporate" },
  { title: "Birthday Party Celebration",   venue: "Royal Greens Farmhouse, Surat",      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",  type: "Birthday" },
  { title: "Elegant Engagement Ceremony",  venue: "Lakshmi Vilas Banquet, Vadodara",    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",  type: "Engagement" },
  { title: "Pool Party Extravaganza",      venue: "Sunset Resort, Gandhinagar",         image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",  type: "Pool Party" },
  { title: "Traditional Reception",        venue: "Heritage Palace, Bhavnagar",         image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",  type: "Reception" },
  { title: "Garba Night Festival",         venue: "City Convention Center, Ahmedabad",  image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",  type: "Garba" },
  { title: "Intimate Kitty Party",         venue: "Garden Restaurant, Surat",           image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",  type: "Kitty Party" },
];

const EventGallery = () => {
  return (
    <section className="py-4 md:py-6 bg-white">
      <div className="md:container">
        <div className="text-center mb-3 md:mb-6 px-4 md:px-0">
          <div className="flex items-center justify-center gap-3 mb-2 md:mb-4">
            <div className="h-px w-8 md:w-12 bg-primary/30" />
            <span className="text-[9px] md:text-[10.5px] font-semibold tracking-[2px] md:tracking-[3px] uppercase text-primary">Get Inspired</span>
            <div className="h-px w-8 md:w-12 bg-primary/30" />
          </div>
          <h2 className="font-display text-2xl md:text-5xl font-semibold text-foreground">
            Event <em className="italic text-primary">Gallery</em>
          </h2>
        </div>

        {/* MOBILE: flush-left scroll — uniform 130×130 square tiles */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pl-4 pr-4" style={{ width: "max-content" }}>
            {galleryEvents.map((event, i) => (
              <div key={i} className="w-[130px] h-[130px] flex-shrink-0 rounded-xl overflow-hidden relative cursor-pointer">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-1.5 left-1.5">
                  <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[7px] font-bold">{event.type}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-1.5">
                  <h3 className="text-white text-[9px] font-semibold line-clamp-1 leading-tight">{event.title}</h3>
                  <div className="flex items-center gap-0.5 text-white/70 text-[7px] mt-0.5">
                    <MapPin className="w-2 h-2 flex-shrink-0" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryEvents.map((event, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group cursor-pointer">
              <div className="relative h-80 rounded-xl overflow-hidden mb-4">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-semibold">{event.type}</span>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-xl font-semibold text-white mb-2">{event.title}</h3>
                  <div className="flex items-center gap-2 text-white/80 text-xs">
                    <MapPin className="w-3.5 h-3.5" /><span>{event.venue}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-5 md:mt-10">
          <a href="/list-venue" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
            List Your Venue
          </a>
        </div>
      </div>
    </section>
  );
};

export default EventGallery;
