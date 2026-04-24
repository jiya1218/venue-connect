"use client";

import { useState } from "react";
import Link from "next/link";

interface PopularPlacesExpandableProps {
  locationLabel: string;
  citySlug: string;
}

export function PopularPlacesExpandable({ locationLabel, citySlug }: PopularPlacesExpandableProps) {
  const [expanded, setExpanded] = useState(false);

  const links = [
    { title: "Top Venues in Ashram Road", area: "ashram-road" },
    { title: "Party Places in Ellis Bridge", area: "ellis-bridge" },
    { title: "Banquet Hall in Sarkhej", area: "sarkhej" },
    { title: "Corporate Party Venue in Thaltej", area: "thaltej" },
    { title: "Best Party Places in Bodakdev", area: "bodakdev" },
    { title: "Party Places in SG Road", area: "sg-road" },
    { title: "Farmhouse in Navarangpura", area: "navarangpura" },
    { title: "Best Place For Party in Bopal", area: "bopal" },
    { title: "Top Venues in Prahlad Nagar", area: "prahlad-nagar" },
    { title: "Party Places in Vastrapur", area: "vastrapur" },
    { title: "Banquet Hall in Airport", area: "airport" },
    { title: "Corporate Party Venue in Khanpur", area: "khanpur" },
    { title: "Best Party Places in Chandkheda", area: "chandkheda" },
    { title: "Best Venues in Naroda", area: "naroda" },
    { title: "Farmhouse in Nikol", area: "nikol" },
    { title: "Best Place For Party in Iscon", area: "iscon" },
    { title: "Top Venues in CG Road", area: "cg-road" },
    { title: "Banquet Hall in Maninagar", area: "maninagar" },
    { title: "Farmhouse in Odhav", area: "odhav" },
    { title: "Best Place For Party in Gota", area: "gota" }
  ];

  const visibleLinks = expanded ? links : links.slice(0, 8);

  return (
    <div>
      <h3 className="font-bold text-gray-900 mb-6 text-lg">More Popular Party Places in {locationLabel}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-6 text-[13px] text-gray-500">
        {visibleLinks.map((link) => {
          // Keep base logic simple: if area starts with "top-venues", etc.
          // But here we use a mix of fixed texts and dynamic URLs
          let basePath = "/venues-in-";
          if (link.title.includes("Banquet")) basePath = "/banquet-halls-in-";
          if (link.title.includes("Farmhouse")) basePath = "/farmhouses-in-";
          if (link.title.includes("Corporate")) basePath = "/corporate-venues-in-";
          if (link.title.includes("Party Place")) basePath = "/party-places-in-";

          return (
            <Link key={link.area} href={`${basePath}${citySlug}/${link.area.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`} className="hover:text-indigo-600 transition-colors">
              {link.title}
            </Link>
          );
        })}
      </div>
      
      {links.length > 8 && (
        <div className="mt-8 text-right">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-red-500 font-bold text-sm tracking-wide hover:text-red-600"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
