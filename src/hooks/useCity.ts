"use client";

import { useState, useEffect } from "react";
import { gujaratCities } from "@/lib/cities";

export function useCity() {
  const [city, setCity] = useState<string>("ahmedabad"); // Default to ahmedabad

  useEffect(() => {
    const getInitialCity = async () => {
      // 1. Try localStorage
      const cached = localStorage.getItem('vc_user_city');
      if (cached) {
        setCity(cached.toLowerCase());
        return;
      }

      // 2. Try IP detection (same logic as Navbar)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
        clearTimeout(timeoutId);
        
        const data = await res.json();
        if (data.city && gujaratCities.some(c => c.toLowerCase() === data.city.toLowerCase())) {
          const citySlug = data.city.toLowerCase();
          localStorage.setItem('vc_user_city', citySlug);
          setCity(citySlug);
        }
      } catch (err) {
        // Fallback already set to ahmedabad
      }
    };

    getInitialCity();

    // Listen for changes in localStorage (in case city is changed elsewhere)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vc_user_city' && e.newValue) {
        setCity(e.newValue.toLowerCase());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return city;
}
