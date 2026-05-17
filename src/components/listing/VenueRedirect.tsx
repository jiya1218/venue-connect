"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { gujaratCities } from "@/lib/cities";

export default function VenueRedirect() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      const canonicalCities = [
        'ahmedabad', 'surat', 'vadodara', 'rajkot', 'gandhinagar', 
        'bhavnagar', 'jamnagar', 'anand', 'junagadh', 'gandhidham', 
        'navsari', 'morbi', 'bhuj', 'valsad', 'palanpur', 'dahod'
      ];

      // 1. Try to read from localStorage
      const cached = typeof window !== 'undefined' ? localStorage.getItem('vc_user_city') : null;
      if (cached && canonicalCities.includes(cached.toLowerCase())) {
        router.replace(`/${cached.toLowerCase().replace(/\s+/g, '-')}/`);
        return;
      }

      // 2. Try to geolocate
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
        clearTimeout(timeoutId);
        
        const data = await res.json();
        if (data.city && gujaratCities.some(c => c.toLowerCase() === data.city.toLowerCase())) {
          const detectedCity = data.city.toLowerCase();
          localStorage.setItem('vc_user_city', detectedCity);
          router.replace(`/${detectedCity}/`);
          return;
        }
      } catch (err) {
        // Fallback
      }

      // 3. Default fallback to ahmedabad
      router.replace("/ahmedabad/");
    };

    handleRedirect();
  }, [router]);

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm font-bold text-slate-700 uppercase tracking-widest animate-pulse">Detecting your location...</p>
    </div>
  );
}
