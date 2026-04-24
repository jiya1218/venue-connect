"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { citiesData } from "@/lib/citiesData";
import { useEffect, useState } from "react";

const CARD = "w-[130px] h-[130px] flex-shrink-0 rounded-xl overflow-hidden relative";

const PopularCities = () => {
    const [cityStats, setCityStats] = useState<{ [key: string]: { venues: number } }>({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/cities/counts');
                if (res.ok) setCityStats(await res.json());
            } catch {}
        };
        fetchStats();
    }, []);

    return (
        <section className="py-4 md:py-6 bg-gradient-to-b from-white to-primary/5">
            <div className="md:container">
                <div className="text-center mb-3 md:mb-12 px-4 md:px-0">
                    <div className="flex items-center justify-center gap-3 mb-2 md:mb-4">
                        <div className="h-px w-8 md:w-12 bg-primary/30" />
                        <span className="text-[9px] md:text-[10.5px] font-semibold tracking-[2px] md:tracking-[3px] uppercase text-primary">Explore Gujarat</span>
                        <div className="h-px w-8 md:w-12 bg-primary/30" />
                    </div>
                    <h2 className="font-display text-2xl md:text-5xl font-semibold text-foreground leading-tight">
                        Popular Cities in <span className="text-primary italic">Gujarat</span>
                    </h2>
                </div>

                {/* MOBILE: 2-row flush-left scroll */}
                <div className="md:hidden overflow-x-auto scrollbar-hide">
                    <div className="flex flex-col gap-2 pl-4 pr-4" style={{ width: "max-content" }}>
                        <div className="flex gap-2">
                            {citiesData.slice(0, 5).map((city) => {
                                const key = city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase();
                                const stats = cityStats[key] || cityStats[city.name] || { venues: 0 };
                                return (
                                    <Link key={city.slug} href={`/${city.name.toLowerCase()}`} className={CARD}>
                                        <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        <div className="absolute inset-0 flex flex-col justify-end p-2">
                                            <p className="text-white text-[10px] font-black leading-tight">{city.name}</p>
                                            <p className="text-white/70 text-[8px] font-bold">{stats.venues}+ Venues</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="flex gap-2">
                            {citiesData.slice(5, 10).map((city) => {
                                const key = city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase();
                                const stats = cityStats[key] || cityStats[city.name] || { venues: 0 };
                                return (
                                    <Link key={city.slug} href={`/${city.name.toLowerCase()}`} className={CARD}>
                                        <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        <div className="absolute inset-0 flex flex-col justify-end p-2">
                                            <p className="text-white text-[10px] font-black leading-tight">{city.name}</p>
                                            <p className="text-white/70 text-[8px] font-bold">{stats.venues}+ Venues</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* DESKTOP: grid */}
                <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-6">
                    {citiesData.slice(0, 10).map((city) => {
                        const key = city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase();
                        const stats = cityStats[key] || cityStats[city.name] || { venues: 0 };
                        return (
                            <Link key={city.slug} href={`/${encodeURIComponent(city.name.toLowerCase())}`}
                                className="group block relative rounded-2xl overflow-hidden aspect-square shadow-lg hover:shadow-2xl transition-all duration-300">
                                <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                <div className="absolute inset-0 flex flex-col justify-end p-6">
                                    <h3 className="text-2xl font-display font-semibold text-white leading-tight">{city.name}</h3>
                                    <p className="text-white/80 text-sm mb-3 font-bold uppercase tracking-widest">{stats.venues}+ Venues</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-4 md:mt-8 text-center">
                    <Link href="/cities" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary/90 transition-colors">
                        View All Cities <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PopularCities;
