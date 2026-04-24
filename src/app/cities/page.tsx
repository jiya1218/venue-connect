"use client";

import { useEffect, useState } from "react";
import { citiesData } from "@/lib/citiesData";
import { Search, MapPin, ArrowRight, Building2, Store, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";

export default function CitiesPage() {
    const [search, setSearch] = useState("");
    const [filteredCities, setFilteredCities] = useState(citiesData);
    const [cityStats, setCityStats] = useState<{ [key: string]: { venues: number, vendors: number } }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/cities/counts');
                if (res.ok) {
                    const data = await res.json();
                    setCityStats(data);
                }
            } catch (err) {
                console.error("Failed to fetch city stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        const filtered = citiesData.filter(city => 
            city.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCities(filtered);
    }, [search]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <PageHeader 
                title="Browse Cities"
                subtitle="Find top-rated wedding venues and vendors across Gujarat"
                image="/images/gujarat_cities_hero.png"
            />

            <main className="flex-grow py-16">
                <div className="container px-4 mx-auto max-w-7xl">
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-16 relative">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search city in Gujarat..."
                                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-light"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {search && (
                            <p className="mt-4 text-center text-slate-500 font-light">
                                Showing {filteredCities.length} results for "{search}"
                            </p>
                        )}
                    </div>

                    {/* Cities Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                // Skeleton Loader
                                Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 h-full animate-pulse">
                                        <div className="h-64 bg-slate-200" />
                                        <div className="p-6 space-y-4">
                                            <div className="h-4 bg-slate-200 rounded w-1/2" />
                                            <div className="flex gap-2">
                                                <div className="h-6 bg-slate-200 rounded-full w-24" />
                                                <div className="h-6 bg-slate-200 rounded-full w-24" />
                                            </div>
                                            <div className="h-10 bg-slate-100 rounded-xl w-full mt-4" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                filteredCities.map((city, index) => {
                                    const stats = cityStats[city.name] || cityStats[city.name.toLowerCase()] || { venues: 0, vendors: 0 };
                                    return (
                                    <motion.div
                                        key={city.slug}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                                            {/* Link for Image and Title */}
                                            <Link 
                                                href={`/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                className="relative h-64 overflow-hidden block"
                                            >
                                                <img 
                                                    src={city.image} 
                                                    alt={city.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80" />
                                                
                                                <div className="absolute bottom-6 left-6 right-6">
                                                    <div className="flex items-center gap-2 text-white mb-2">
                                                        <MapPin className="w-5 h-5 text-primary" />
                                                        <h3 className="text-3xl font-display font-bold">{city.name}</h3>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                                                            <Building2 className="w-3 h-3" /> {stats.venues} Venues
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                                                            <Store className="w-3 h-3" /> {stats.vendors} Vendors
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>

                                            <div className="p-6 flex flex-col gap-3">
                                                <Link 
                                                    href={`/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-primary/10 text-slate-700 hover:text-primary transition-all group/btn font-bold text-xs uppercase tracking-widest"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4" /> Browse Venues
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </Link>
                                                
                                                <Link 
                                                    href={`/vendors/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-primary/30 text-slate-500 hover:text-primary transition-all group/btn font-bold text-[10px] uppercase tracking-widest"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <Store className="w-3.5 h-3.5" /> Explore Vendors
                                                    </span>
                                                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )})
                            )}
                        </AnimatePresence>
                    </div>

                    {!loading && filteredCities.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">No Cities Found</h3>
                            <p className="text-slate-500 font-light">We couldn't find any city matching "{search}".<br/>Please try a different search term.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

