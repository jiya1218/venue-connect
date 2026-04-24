"use client";

import { Sparkles, Crown, TreePine, Building2, Castle, Flower2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const moods = [
  {
    icon: Crown,
    name: "Luxury",
    description: "Premium & opulent venues",
    count: "850+",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
    color: "from-amber-500/80 to-yellow-600/80",
    href: "/banquet-hall"
  },
  {
    icon: Castle,
    name: "Traditional",
    description: "Heritage & cultural spaces",
    count: "620+",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
    color: "from-orange-500/80 to-red-600/80",
    href: "/resort"
  },
  {
    icon: TreePine,
    name: "Outdoor",
    description: "Garden & open-air venues",
    count: "1,200+",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    color: "from-green-500/80 to-emerald-600/80",
    href: "/lawn"
  },
  {
    icon: Building2,
    name: "Modern",
    description: "Contemporary & chic spaces",
    count: "940+",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    color: "from-blue-500/80 to-indigo-600/80",
    href: "/convention-centre"
  },
  {
    icon: Castle,
    name: "Heritage",
    description: "Palace & historic venues",
    count: "380+",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80",
    color: "from-purple-500/80 to-pink-600/80",
    href: "/farmhouse"
  },
  {
    icon: Flower2,
    name: "Garden Venues",
    description: "Lush green celebrations",
    count: "1,100+",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
    color: "from-teal-500/80 to-cyan-600/80",
    href: "/party-plot"
  },
];

const VenueMoodExplorer = () => {
  return (
    <section className="py-4 md:py-6 bg-gradient-to-b from-white to-primary/5">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary/30" />
            <span className="text-[10.5px] font-semibold tracking-[3px] uppercase text-primary">
              Discover by Style
            </span>
            <div className="h-px w-12 bg-primary/30" />
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Find Your <em className="italic text-primary">Perfect Mood</em>
          </h2>
          
          <p className="text-[15px] text-muted-foreground max-w-2xl mx-auto">
            Explore venues that match your event's vibe and atmosphere
          </p>
        </motion.div>

        <div className="flex overflow-x-auto gap-4 pb-6 no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 snap-x">
          {moods.map((mood, i) => {
            const Icon = mood.icon;
            return (
              <motion.div
                key={mood.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="min-w-[calc(60%-0.5rem)] md:min-w-0 snap-start"
              >
                <Link
                  href={mood.href}
                  className="group relative h-64 md:h-72 rounded-2xl overflow-hidden cursor-pointer block shadow-lg"
                >
                  <img
                    src={mood.image}
                    alt={mood.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <div className={`absolute inset-0 bg-gradient-to-t ${mood.color} group-hover:opacity-95 transition-opacity duration-300`} />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 md:p-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    
                    <h3 className="font-display font-black text-white text-lg md:text-2xl mb-1 md:mb-2 uppercase tracking-tight">
                      {mood.name}
                    </h3>
                    
                    <p className="text-white/80 text-[10px] md:text-sm mb-2 md:mb-3 font-bold line-clamp-1">
                      {mood.description}
                    </p>
                    
                    <span className="text-white/60 text-[9px] md:text-xs font-black uppercase tracking-widest">
                      {mood.count} venues
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
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

export default VenueMoodExplorer;
