"use client";

import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const testimonials = [
  {
    name: "Priya Patel",
    role: "Bride, Ahmedabad",
    text: "VenueConnect helped us find the perfect wedding venue in just 2 days! The search filters made it so easy to compare options.",
    rating: 5,
  },
  {
    name: "Rajesh Shah",
    role: "Event Planner, Surat",
    text: "As an event planner, I use VenueConnect for all my clients. The venue details and instant enquiry feature saves hours of work.",
    rating: 5,
  },
  {
    name: "Meera Desai",
    role: "Venue Owner, Vadodara",
    text: "Since listing on VenueConnect, our bookings have increased by 40%. The lead quality is excellent and the platform is very easy to use.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="py-6 md:py-8 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-5 md:mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-1 md:mb-3">
            What Our Users Say
          </h2>
          <p className="text-xs md:text-base text-muted-foreground">Trusted by thousands across Gujarat</p>
        </motion.div>

        {/* MOBILE: single card with navigation arrows */}
        <div className="md:hidden relative">
          <div className="bg-card rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <Quote className="w-7 h-7 text-primary/20 absolute top-3 right-3" />
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: testimonials[current].rating }).map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-foreground/80 text-sm mb-4 leading-relaxed">{testimonials[current].text}</p>
            <div>
              <div className="font-semibold text-foreground text-sm">{testimonials[current].name}</div>
              <div className="text-xs text-muted-foreground">{testimonials[current].role}</div>
            </div>
          </div>
          {/* Arrows */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button onClick={prev} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-primary/5 transition-colors">
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-primary w-3' : 'bg-border'}`} />
              ))}
            </div>
            <button onClick={next} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-primary/5 transition-colors">
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* DESKTOP: grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-card relative"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-foreground/80 mb-4 leading-relaxed">{t.text}</p>
              <div>
                <div className="font-semibold text-foreground">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
