'use client';

import { Search, MapPin, SlidersHorizontal, X, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { OCCASIONS, VENUE_TYPES, VENDOR_TYPES, GUJARAT_CITIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { citiesData } from "@/lib/citiesData";

interface ListingFilterProps {
    type?: 'venues' | 'vendors';
    initialCity?: string;
    initialOccasion?: string;
    initialType?: string;
    initialRegion?: string;
    initialFood?: string;
    isNearMe?: boolean;
    rawSlug?: string;
}

const unslugify = (slug: string) => {
    if (!slug) return '';
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function ListingFilter({ 
    type = 'venues',
    initialCity,
    initialOccasion: propOccasion,
    initialType: propType,
    initialRegion: propRegion,
    initialFood: propFood,
    isNearMe = false,
    rawSlug = ""
}: ListingFilterProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    const pathSegments = pathname.split('/').filter(Boolean);
    const cityFromPath = pathSegments[0];
    const isNearMePath = cityFromPath && cityFromPath.endsWith('-near-me');
    const isCityPath = cityFromPath && !isNearMePath && GUJARAT_CITIES.some(c => c.toLowerCase() === cityFromPath.toLowerCase());

    // 1. Core State
    const [location, setLocation] = useState(() => {
        const cityParam = searchParams.get("city");
        if (cityParam) return cityParam;
        if (initialCity) return initialCity;
        if (isCityPath) return unslugify(cityFromPath);
        return "";
    });

    const [occasion, setOccasion] = useState(searchParams.get("q") || propOccasion || "");
    const [selectedType, setSelectedType] = useState(searchParams.get("type") || propType || "");
    const [selectedRegion, setSelectedRegion] = useState(searchParams.get("area") || propRegion || "");
    const [foodType, setFoodType] = useState(searchParams.get("food") || propFood || "Any");
    const [budget, setBudget] = useState(searchParams.get("budget") || "");
    const [capacity, setCapacity] = useState(searchParams.get("capacity") || "");
    const [rating, setRating] = useState(searchParams.get("rating") || "");
    const [cuisines, setCuisines] = useState<string[]>(searchParams.get("cuisine")?.split(',').filter(Boolean) || []);

    const [dynamicRegions, setDynamicRegions] = useState<string[]>([]);
    const [loadingRegions, setLoadingRegions] = useState(false);
    const [showMore, setShowMore] = useState(false);

    // 2. Sync with URL/Props (only if changed externally)
    useEffect(() => {
        const urlCity = searchParams.get("city") || (isCityPath ? unslugify(cityFromPath) : "");
        if (urlCity && urlCity.toLowerCase() !== location.toLowerCase()) {
            setLocation(urlCity);
            setSelectedRegion(""); // Reset region when city changes externally
        }
    }, [searchParams, pathname]);

    useEffect(() => {
        if (propRegion && propRegion !== selectedRegion) {
            setSelectedRegion(propRegion);
        }
    }, [propRegion]);

    // 3. Dynamic Region Fetching (STRICTLY CITY-BOUND)
    useEffect(() => {
        let isMounted = true;
        const fetchRegions = async () => {
            if (!location || location.toLowerCase() === 'all cities') {
                setDynamicRegions([]);
                return;
            }

            setLoadingRegions(true);
            try {
                // 1. Get localities from citiesData.ts first (Source of Truth for SEO)
                const cityEntry = citiesData.find(c => 
                    c.name.toLowerCase() === location.toLowerCase() || 
                    c.slug.toLowerCase() === location.toLowerCase()
                );
                
                const areas = new Set<string>(cityEntry?.localities || []);
                
                // 2. Also fetch from DB to catch any new ones not in citiesData
                const cityName = unslugify(location);
                const [venuesRes, vendorsRes] = await Promise.all([
                    supabase.from('venues').select('location').ilike('city', `%${cityName}%`),
                    supabase.from('vendors').select('location').ilike('city', `%${cityName}%`)
                ]);

                const processResult = (data: any[]) => {
                    data?.forEach((v: any) => { 
                        if (v.location && v.location.trim().length > 1) {
                            // Extract area name (everything before comma if present)
                            const cleanArea = v.location.split(',')[0].trim();
                            if (cleanArea.toLowerCase() !== cityName.toLowerCase() && 
                                cleanArea.toLowerCase() !== location.toLowerCase() &&
                                cleanArea.toLowerCase() !== 'vendors' &&
                                cleanArea.length > 2) {
                                areas.add(cleanArea);
                            }
                        }
                    });
                };

                processResult(venuesRes.data || []);
                processResult(vendorsRes.data || []);
                
                const sortedAreas = Array.from(areas).sort((a, b) => a.localeCompare(b));
                if (isMounted) setDynamicRegions(sortedAreas);
            } catch (err) {
                console.error("Region fetch error:", err);
            } finally {
                if (isMounted) setLoadingRegions(false);
            }
        };

        fetchRegions();
        return () => { isMounted = false; };
    }, [location]);

    // 4. Apply Filters (Auto-apply on change)
    useEffect(() => {
        const p = new URLSearchParams(searchParams.toString());
        const currentLocation = p.get("city") || (isCityPath ? unslugify(cityFromPath) : "");
        
        const hasChanged = 
            location.toLowerCase() !== currentLocation.toLowerCase() ||
            occasion !== (p.get("q") || "") ||
            selectedType !== (p.get("type") || "") ||
            selectedRegion !== (p.get("area") || "") ||
            foodType !== (p.get("food") || "Any") ||
            budget !== (p.get("budget") || "") ||
            capacity !== (p.get("capacity") || "") ||
            rating !== (p.get("rating") || "") ||
            cuisines.join(',') !== (p.get("cuisine") || "");

        if (hasChanged) {
            applyFilters();
        }
    }, [location, occasion, selectedType, selectedRegion, foodType, budget, capacity, rating, cuisines]);

    const applyFilters = () => {
        const p = new URLSearchParams(searchParams.toString());
        
        if (occasion) p.set("q", occasion); else p.delete("q");
        if (foodType && foodType !== 'Any') p.set("food", foodType); else p.delete("food");
        if (budget) p.set("budget", budget); else p.delete("budget");
        if (capacity) p.set("capacity", capacity); else p.delete("capacity");
        if (rating) p.set("rating", rating); else p.delete("rating");
        if (cuisines.length > 0) p.set("cuisine", cuisines.join(',')); else p.delete("cuisine");

        p.delete("city");
        p.delete("type");
        p.delete("page");

        // 1. Determine path segments
        const citySlug = (!location || location.toLowerCase() === 'all cities') ? '' : location.trim().toLowerCase().replace(/\s+/g, '-');
        const areaSlug = (!selectedRegion) ? '' : selectedRegion.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        let typeSlug = '';
        if (occasion) {
            typeSlug = occasion.trim().toLowerCase().replace(/[\s/]+/g, '-');
            // Check if it already ends with -venues or -venue
            if (!typeSlug.endsWith('-venues') && !typeSlug.endsWith('-venue')) {
                typeSlug += '-venues';
            }
            p.delete("q"); // Move from query to path
        } else if (selectedType && selectedType !== 'All Types' && selectedType !== 'All Vendors') {
            typeSlug = selectedType.trim().toLowerCase().replace(/[\s/]+/g, '-');
        }

        // Handle area routing correctly
        if (!location || location.toLowerCase() === 'all cities' || (isNearMe && rawSlug)) {
            if (selectedRegion) p.set("area", selectedRegion); else p.delete("area");
            // If it's an occasion, we must keep it in Q if we are in 'near-me' or 'all-cities' 
            // because we don't have a clean path structure for those yet
            if (occasion) p.set("q", occasion);
        } else {
            p.delete("area");
        }

        let targetPath = "/";
        if (isNearMe && rawSlug) {
            targetPath = `/${rawSlug}/`;
        } else if (citySlug) {
            if (type === 'vendors') {
                if (areaSlug) {
                    targetPath = typeSlug ? `/${citySlug}/${areaSlug}/vendors/${typeSlug}/` : `/${citySlug}/${areaSlug}/vendors/`;
                } else {
                    targetPath = typeSlug ? `/${citySlug}/vendors/${typeSlug}/` : `/${citySlug}/vendors/`;
                }
            } else {
                if (areaSlug) {
                    targetPath = typeSlug ? `/${citySlug}/${areaSlug}/${typeSlug}/` : `/${citySlug}/${areaSlug}/`;
                } else {
                    targetPath = typeSlug ? `/${citySlug}/${typeSlug}/` : `/${citySlug}/`;
                }
            }
        } else {
            // GLOBAL CATEGORY PAGES (No City)
            if (type === 'vendors') {
                targetPath = typeSlug ? `/vendors/${typeSlug}/` : '/vendors/';
            } else {
                targetPath = typeSlug ? `/${typeSlug}/` : '/venues/';
            }
        }

        const queryString = p.toString();
        router.push(queryString ? `${targetPath}?${queryString}` : targetPath, { scroll: false });
    };

    const clearFilters = () => {
        setLocation("");
        setOccasion("");
        setSelectedType("");
        setSelectedRegion("");
        setFoodType("Any");
        setBudget("");
        setCapacity("");
        setCuisines([]);
        router.push(type === 'vendors' ? '/vendors/' : '/venues/');
    };

    const removeFilter = (filterKey: string, filterValue?: string) => {
        if (filterKey === 'city') setLocation("");
        if (filterKey === 'q') setOccasion("");
        if (filterKey === 'type') setSelectedType("");
        if (filterKey === 'area') setSelectedRegion("");
        if (filterKey === 'food') setFoodType("Any");
        if (filterKey === 'budget') setBudget("");
        if (filterKey === 'capacity') setCapacity("");
        if (filterKey === 'rating') setRating("");
        if (filterKey === 'cuisine' && filterValue) {
            setCuisines(cuisines.filter(c => c !== filterValue));
        }
    };

    const toggleCuisine = (c: string) => {
        setCuisines(prev => prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]);
    };

    const activeFilters: any[] = [
        location && { key: 'city', label: location },
        occasion && { key: 'q', label: occasion },
        selectedType && { key: 'type', label: selectedType },
        selectedRegion && { key: 'area', label: selectedRegion },
        foodType !== 'Any' && { key: 'food', label: foodType },
        budget && { key: 'budget', label: budget },
        capacity && { key: 'capacity', label: capacity },
        rating && { key: 'rating', label: rating }
    ].filter(Boolean);

    cuisines.forEach((c: any) => activeFilters.push({ key: 'cuisine', label: c, value: c }));

    const currentCityDisplay = location ? (GUJARAT_CITIES.find(c => c.toLowerCase() === location.toLowerCase()) || unslugify(location)) : "";

    return (
        <div className="w-full bg-white border-b border-slate-100 sticky top-12 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
                <div className="flex flex-col md:grid md:grid-cols-6 items-center gap-4 md:gap-6 mb-4">
                    
                    {/* Location Select */}
                    <div className="w-full md:flex flex-col gap-1 border-r border-slate-100 pr-6">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Location</label>
                        <select 
                            value={location.toLowerCase()} 
                            onChange={e => {
                                setLocation(e.target.value);
                                setSelectedRegion(""); // Force reset region on manual city change
                            }}
                            className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer hover:text-primary transition-colors w-full"
                        >
                            <option value="">Select City</option>
                            <option value="all cities">All Cities</option>
                            {GUJARAT_CITIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                        </select>
                    </div>

                    {/* Occasion */}
                    <div className="hidden md:flex flex-col gap-1 border-r border-slate-100 pr-6">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Occasion</label>
                        <select 
                            value={occasion} 
                            onChange={e => setOccasion(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer hover:text-primary transition-colors max-w-[150px]"
                        >
                            <option value="">Select Occasion</option>
                            {Object.entries(OCCASIONS).map(([group, list]) => (
                                <optgroup key={group} label={group}>
                                    {list.map(o => <option key={o} value={o}>{o}</option>)}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* Category/Type */}
                    <div className="hidden md:flex flex-col gap-1 border-r border-slate-100 pr-6">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">{type === 'vendors' ? 'Category' : 'Space Type'}</label>
                        <select 
                            value={selectedType} 
                            onChange={e => setSelectedType(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer hover:text-primary transition-colors max-w-[150px]"
                        >
                            <option value="">Select Type</option>
                            {(type === 'vendors' ? VENDOR_TYPES : VENUE_TYPES).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* Region - CRITICAL FIX */}
                    <div className="w-full md:flex flex-col gap-1 border-r border-slate-100 pr-6">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Region</label>
                        <select 
                            value={selectedRegion} 
                            onChange={e => setSelectedRegion(e.target.value)}
                            disabled={loadingRegions || !location}
                            className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer hover:text-primary transition-colors w-full disabled:opacity-50"
                        >
                            <option value="">{loadingRegions ? 'Loading Areas...' : (location ? 'All Regions' : 'Select City First')}</option>
                            {dynamicRegions.map(r => <option key={r} value={r}>{r}</option>)}
                            {location && !loadingRegions && dynamicRegions.length === 0 && <option value="">{currentCityDisplay}</option>}
                        </select>
                    </div>

                    {/* Food Type */}
                    <div className="hidden md:flex flex-col gap-1 border-r border-slate-100 pr-6">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Food Type</label>
                        <select 
                            value={foodType} 
                            onChange={e => setFoodType(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer hover:text-primary transition-colors"
                        >
                            <option value="Any">Any</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                        </select>
                    </div>

                    <div className="hidden md:flex items-center justify-center">
                        <Button 
                            onClick={() => setShowMore(!showMore)}
                            variant={showMore ? "default" : "outline"}
                            className={`w-full gap-2 border-primary ${showMore ? "bg-primary text-white" : "text-primary hover:bg-primary hover:text-white"} font-bold h-12 rounded-xl transition-all active:scale-95`}
                        >
                            <SlidersHorizontal size={14} />
                            More Filters
                        </Button>
                    </div>

                    {/* Mobile Only: Region Selector if hidden above */}
                    <div className="md:hidden w-full h-px bg-slate-100 my-2" />
                </div>

                {showMore && (
                    <div 
                        onMouseLeave={() => setShowMore(false)}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300"
                    >
                        {/* Cuisine */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[12px] font-black uppercase tracking-widest text-[#EF3E36]">Cuisine</label>
                            <div className="grid grid-cols-1 gap-2">
                                {['North Indian', 'South Indian', 'Chinese', 'Continental', 'Gujarati', 'Punjabi'].map(c => (
                                    <button 
                                        key={c}
                                        onClick={() => toggleCuisine(c)}
                                        className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${cuisines.includes(c) ? "bg-primary/10 text-primary font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                                    >
                                        {cuisines.includes(c) && <CheckCircle2 size={14} className="inline mr-2" />}
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="flex flex-col gap-3 border-l border-slate-100 pl-8">
                            <label className="text-[12px] font-black uppercase tracking-widest text-[#EF3E36]">Budget</label>
                            <div className="grid grid-cols-1 gap-2">
                                {['Under ₹1000', '₹1000 - ₹1500', '₹1500 - ₹2000', 'Above ₹2000'].map(b => (
                                    <button 
                                        key={b}
                                        onClick={() => setBudget(budget === b ? "" : b)}
                                        className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${budget === b ? "bg-primary/10 text-primary font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                                    >
                                        {budget === b && <CheckCircle2 size={14} className="inline mr-2" />}
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Capacity */}
                        <div className="flex flex-col gap-3 border-l border-slate-100 pl-8">
                            <label className="text-[12px] font-black uppercase tracking-widest text-[#EF3E36]">Capacity</label>
                            <div className="grid grid-cols-1 gap-2">
                                {['Under 100', '100 - 500', '500 - 1000', 'Above 1000'].map(c => (
                                    <button 
                                        key={c}
                                        onClick={() => setCapacity(capacity === c ? "" : c)}
                                        className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${capacity === c ? "bg-primary/10 text-primary font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                                    >
                                        {capacity === c && <CheckCircle2 size={14} className="inline mr-2" />}
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex flex-col gap-3 border-l border-slate-100 pl-8">
                            <label className="text-[12px] font-black uppercase tracking-widest text-[#EF3E36]">Rating</label>
                            <div className="grid grid-cols-1 gap-2">
                                {['4.5+', '4.0+', '3.5+', 'Any'].map(r => (
                                    <button 
                                        key={r}
                                        onClick={() => setRating(rating === r ? "" : r)}
                                        className={`text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${rating === r ? "bg-primary/10 text-primary font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                                    >
                                        {rating === r && <CheckCircle2 size={14} className="inline mr-2" />}
                                        {r} {r !== 'Any' && <Star size={12} className="inline ml-1 fill-yellow-400 text-yellow-400" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeFilters.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 pt-2 pb-2 border-t border-slate-50">
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={clearFilters}
                            className="bg-[#EF3E36] hover:bg-[#D9362F] text-white font-black uppercase tracking-widest text-[10px] h-8 rounded-lg px-4"
                        >
                            Clear Filters
                        </Button>
                        {activeFilters.map((filter, idx) => (
                            <div 
                                key={`${filter.key}-${idx}`} 
                                className="flex items-center gap-2 px-3 py-1 bg-white border border-[#EF3E36] rounded-lg text-[#EF3E36] text-[11px] font-bold transition-all hover:bg-slate-50"
                            >
                                <span>{filter.label}</span>
                                <button onClick={() => removeFilter(filter.key, filter.value)} className="hover:text-slate-900">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
