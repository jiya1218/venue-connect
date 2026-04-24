"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const occasions = [
  { name: "Wedding",      icon: "💒", slug: "wedding-venues" },
  { name: "Birthday",     icon: "🎂", slug: "banquet-halls" },
  { name: "Corporate",    icon: "💼", slug: "banquet-halls" },
  { name: "Engagement",   icon: "💍", slug: "wedding-venues" },
  { name: "Reception",    icon: "🌸", slug: "wedding-venues" },
  { name: "Sangeet",      icon: "🎵", slug: "banquet-halls" },
  { name: "Banquet Hall", icon: "🏛️", slug: "banquet-halls" },
  { name: "Pool Party",   icon: "🏊", slug: "farmhouse" },
  { name: "Kitty Party",  icon: "👛", slug: "party-plots" },
  { name: "Garba",        icon: "🪔", slug: "party-plots" },
];


const CARD = "w-[130px] h-[130px] flex-shrink-0";

const OccasionSlider = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section className="py-4 md:py-6 bg-background">
      <div className="md:container">
        <div className="text-center mb-3 md:mb-8 px-4 md:px-0">
          <div className="flex items-center justify-center gap-3 mb-2 md:mb-4">
            <div className="h-px w-8 md:w-12 bg-primary/30" />
            <span className="text-[9px] md:text-[10.5px] font-semibold tracking-[2px] md:tracking-[3px] uppercase text-primary">
              Find By Occasion
            </span>
            <div className="h-px w-8 md:w-12 bg-primary/30" />
          </div>
          <h2 className="font-display text-2xl md:text-5xl font-semibold text-foreground leading-tight">
            What&apos;s the <em className="italic text-primary">Occasion?</em>
          </h2>
        </div>

        {/* MOBILE: 2-row horizontal scroll, flush left */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex flex-col gap-2 pl-4 pr-4" style={{ width: "max-content" }}>
            {/* Row 1 – odd indices */}
            <div className="flex gap-2">
              {occasions.filter((_, i) => i % 2 === 0).map((occasion) => (
                  <Link key={occasion.name} href={`/${occasion.slug}`}
                    className={`${CARD} bg-white rounded-xl border-2 border-border hover:border-primary transition-all flex flex-col items-center justify-center gap-1.5`}>
                    <span className="text-3xl">{occasion.icon}</span>
                    <span className="text-[9px] font-bold text-center text-foreground leading-tight px-1">{occasion.name}</span>
                  </Link>
              ))}
            </div>
            {/* Row 2 – even indices */}
            <div className="flex gap-2">
              {occasions.filter((_, i) => i % 2 === 1).map((occasion) => (
                  <Link key={occasion.name} href={`/${occasion.slug}`}
                    className={`${CARD} bg-white rounded-xl border-2 border-border hover:border-primary transition-all flex flex-col items-center justify-center gap-1.5`}>
                    <span className="text-3xl">{occasion.icon}</span>
                    <span className="text-[9px] font-bold text-center text-foreground leading-tight px-1">{occasion.name}</span>
                  </Link>
              ))}
            </div>
          </div>
        </div>

        {/* DESKTOP: Single Line Horizontal Scroll with Arrows */}
        <div className="hidden md:block relative group">
          <button 
            onClick={() => {
              const el = document.getElementById('occasion-scroll');
              if (el) el.scrollBy({ left: -400, behavior: 'smooth' });
            }}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-all border border-slate-100 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div id="occasion-scroll" className="flex gap-6 overflow-x-auto no-scrollbar py-6 snap-x">
            {occasions.map((occasion, index) => (
                <Link key={index} href={`/${occasion.slug}`}
                  className="min-w-[240px] snap-start group bg-white rounded-2xl p-6 border-2 border-border hover:border-primary hover:shadow-2xl transition-all duration-500 h-[200px] flex flex-col items-center justify-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{occasion.icon}</div>
                  <div className="text-lg font-black text-foreground group-hover:text-primary transition-colors text-center uppercase tracking-tight">{occasion.name}</div>
                </Link>
            ))}
          </div>

          <button 
            onClick={() => {
              const el = document.getElementById('occasion-scroll');
              if (el) el.scrollBy({ left: 400, behavior: 'smooth' });
            }}
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-all border border-slate-100 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OccasionSlider;
