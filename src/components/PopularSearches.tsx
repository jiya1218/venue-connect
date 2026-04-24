"use client";

import { Search, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const searches: { label: string; url: string }[] = [
  { label: "Wedding venues in Ahmedabad",           url: "/ahmedabad/wedding-venue" },
  { label: "Banquet halls in Surat",                url: "/surat/banquet-hall" },
  { label: "Farmhouses in Vadodara",                url: "/vadodara/farmhouse" },
  { label: "Birthday party venues in Rajkot",       url: "/rajkot/birthday-party-venue" },
  { label: "Corporate venues in Gandhinagar",        url: "/gandhinagar/corporate-event-venue" },
  { label: "Engagement venues in Ahmedabad",        url: "/ahmedabad/engagement-venue" },
  { label: "Pool party venues in Surat",            url: "/surat/pool-party-venue" },
  { label: "Garba venues in Vadodara",              url: "/vadodara/garba-venue" },
  { label: "Kitty party venues in Ahmedabad",       url: "/ahmedabad/kitty-party-venue" },
  { label: "Reception halls in Surat",              url: "/surat/reception-hall" },
  { label: "Party plots in Vadodara",               url: "/vadodara/party-plot" },
  { label: "Hotels for events in Rajkot",           url: "/rajkot/hotel" },
  { label: "Resorts in Gandhinagar",                url: "/gandhinagar/resort" },
  { label: "Restaurant venues in Ahmedabad",        url: "/ahmedabad/restaurant" },
  { label: "Convention centers in Surat",           url: "/surat/convention-centre" },
  { label: "Luxury venues in Vadodara",             url: "/vadodara?q=luxury" },
  { label: "Garden venues in Ahmedabad",            url: "/ahmedabad?q=garden" },
  { label: "Rooftop venues in Surat",               url: "/surat?q=rooftop" },
  { label: "Heritage venues in Vadodara",           url: "/vadodara?q=heritage" },
  { label: "Budget venues in Rajkot",               url: "/rajkot?q=budget" },
];

const PopularSearches = () => {
  return (
    <section className="py-4 md:py-6 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-3 md:mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-2 md:mb-4">
            <div className="h-px w-8 md:w-12 bg-primary/30" />
            <span className="text-[9px] md:text-[10.5px] font-semibold tracking-[2px] md:tracking-[3px] uppercase text-primary">
              Quick Discovery
            </span>
            <div className="h-px w-8 md:w-12 bg-primary/30" />
          </div>
          <h2 className="font-display text-2xl md:text-5xl font-semibold text-foreground mb-1 md:mb-4">
            Popular <em className="italic text-primary">Searches</em>
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto hidden md:block">
            Quick access to the most searched venue categories
          </p>
        </motion.div>

        {/* MOBILE: compact pill wrap — scrollable feel with tight 2-3 per line */}
        <div className="md:hidden flex flex-wrap gap-1.5 justify-center max-w-full">
          {searches.map((item, i) => (
            <Link
              key={i}
              href={item.url}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/20 hover:bg-primary hover:text-white transition-all duration-200"
              title={item.label}
            >
              <Search className="w-2.5 h-2.5 text-primary shrink-0" />
              <span className="text-[9px] font-medium text-foreground leading-tight">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* DESKTOP: existing layout */}
        <div className="hidden md:flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
          {searches.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
            >
              <Link
                href={item.url}
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary/5 hover:bg-primary hover:text-white border border-primary/20 hover:border-primary transition-all duration-200"
                title={item.label}
              >
                <Search className="w-3.5 h-3.5 text-primary group-hover:text-white shrink-0" />
                <span className="text-sm font-medium text-foreground group-hover:text-white">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 md:mt-12 text-center">
          <Link
            href="/venues"
            className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-primary text-white text-xs md:text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Explore All Venues
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularSearches;
