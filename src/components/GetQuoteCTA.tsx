"use client";

import { CheckCircle2, ShieldCheck, Building2, Headset, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const GetQuoteCTA = () => {
  const [venueCount, setVenueCount] = useState(110);
  const supabase = createClient();

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('venues')
        .select('id', { count: 'exact', head: true });
      if (count) setVenueCount(count);
    };
    fetchCount();
  }, []);

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)] border border-white/10"
        >
          {/* Animated Background Orbs - Scaled Down */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -mr-60 -mt-60 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px] -ml-40 -mb-40" />
          
          <div className="relative z-10 text-center">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-4 mb-10"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[2px] text-white/70">The Gold Standard</span>
              </div>
              <h2 className="font-display text-2xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
                VenueConnect <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-foreground to-primary">Trust</span>
              </h2>
              <p className="text-white/40 text-[11px] md:text-sm font-medium max-w-lg mx-auto leading-relaxed">
                Gujarat's premier venue discovery platform, ensuring excellence in every celebration since 2018.
              </p>
            </motion.div>

            {/* Trust Cards Grid - More Compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { 
                  stat: `${venueCount}+ Venues`, 
                  sub: "Largest Network", 
                  desc: "Verified quality & reliability.",
                  icon: <Building2 className="w-6 h-6" />,
                  color: "from-primary/20 to-transparent"
                },
                { 
                  stat: "Best Price", 
                  sub: "Exclusive Deals", 
                  desc: "Zero hidden commissions.",
                  icon: <ShieldCheck className="w-6 h-6" />,
                  color: "from-blue-500/20 to-transparent"
                },
                { 
                  stat: "Expert Advice", 
                  sub: "24/7 Support", 
                  desc: "Dedicated concierge team.",
                  icon: <Headset className="w-6 h-6" />,
                  color: "from-purple-500/20 to-transparent"
                },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative flex flex-row md:flex-col items-center md:text-center text-left p-4 md:p-6 rounded-xl md:rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all duration-500 gap-4 md:gap-0"
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${item.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-xl md:rounded-[1.5rem] pointer-events-none`} />
                  
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-primary md:mb-4 shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>
                  
                  <div className="space-y-1 md:space-y-2 relative z-10 flex-1">
                    <p className="text-base md:text-lg font-black text-white uppercase tracking-tight">{item.stat}</p>
                    <p className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[2px]">{item.sub}</p>
                    <p className="text-[9px] md:text-[10px] text-white/30 font-medium leading-tight">{item.desc}</p>
                  </div>

                  <div className="hidden md:flex mt-6 items-center gap-1.5 text-white/10 group-hover:text-primary transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Verified</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GetQuoteCTA;
