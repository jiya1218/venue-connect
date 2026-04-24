"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { gujaratCities } from "@/lib/cities";

const GetQuoteCTA = () => {
  return (
    <section className="py-4 md:py-6 bg-gradient-to-br from-primary/10 via-primary/5 to-white">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2">
              {/* Left Side - Form */}
              <div className="p-5 md:p-10">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <Gift className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  <span className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wider">
                    Get Upto 10% Discount
                  </span>
                </div>
                <h3 className="font-display text-xl md:text-3xl font-semibold text-foreground mb-2 md:mb-3">
                  Get Best <em className="italic text-primary">Suited Venues</em>
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
                  Share your details & get personalized venue recommendations
                </p>
                <div className="space-y-3 md:space-y-4">
                  <Input placeholder="Your Name" className="h-10 md:h-12 text-sm" />
                  <Input type="tel" placeholder="Phone Number" className="h-10 md:h-12 text-sm" />
                  <Input type="email" placeholder="Email Address" className="h-10 md:h-12 text-sm" />
                  <Select>
                    <SelectTrigger className="h-10 md:h-12 text-sm">
                      <SelectValue placeholder="Select Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="h-10 md:h-12 text-sm">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {gujaratCities.map(c => (
                        <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button className="w-full h-10 md:h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-sm">
                    Get Free Quotes
                  </Button>
                </div>
              </div>

              {/* Right Side - Visual (smaller on mobile) */}
              <div className="relative bg-slate-900 p-5 md:p-10 flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-primary/20 rounded-full -mr-24 md:-mr-32 -mt-24 md:-mt-32 blur-3xl opacity-50" />
                <div className="text-center text-white relative z-10 w-full">
                  <Sparkles className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 md:mb-8 text-primary animate-pulse" />
                  <h4 className="font-display text-lg md:text-2xl font-black mb-4 md:mb-8 uppercase tracking-widest text-[#EF3E36]">
                    VenueConnect Trust
                  </h4>
                  <div className="grid grid-cols-1 gap-3 md:gap-6 text-left">
                    {[
                      { stat: "35,000+ Venues", sub: "Largest venue network" },
                      { stat: "Best Price Guarantee", sub: "Exclusive discounts" },
                      { stat: "Free Expert Advice", sub: "Dedicated support team" },
                    ].map((item) => (
                      <div key={item.stat} className="flex items-center gap-3 md:gap-4 group">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all">
                          <CheckCircle2 size={15} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-black text-xs md:text-sm uppercase tracking-tight">{item.stat}</p>
                          <p className="text-[10px] md:text-[11px] text-white/50 font-bold">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GetQuoteCTA;
