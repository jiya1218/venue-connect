'use client';

import { Search, MapPin, SlidersHorizontal, X, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { VENUE_TYPES, VENDOR_TYPES } from "@/lib/constants";

interface ListingFilterProps {
    type: 'venues' | 'vendors';
}

// Constants now imported from @/lib/constants

const VENUE_CAPACITIES = ['Under 100', '100 - 500', '500 - 1000', '1000+'];

const VENUE_PRICES = ['Under ₹1000', '₹1000 - ₹2000', '₹2000 - ₹3000', 'Above ₹3000'];
const VENDOR_PRICES = ['Under ₹20k', '₹20k - ₹50k', '₹50k - ₹1L', 'Above ₹1L'];

const AMENITIES = [
    { key: 'ac', label: '❄️ AC' },
    { key: 'wifi', label: '📶 WiFi' },
    { key: 'rooms', label: '🛏️ Rooms' },
    { key: 'alcohol', label: '🍾 Liquor OK' },
];

const GUJARAT_CITIES = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Anand', 'Navsari', 'Morbi', 'Vapi'];
const ListingFilter = ({ type }: ListingFilterProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const pathSegments = pathname.split('/').filter(Boolean);
    const cityFromPath = pathSegments[0];
    const categoryFromPath = pathSegments[1]; 
    
    const isCityPath = cityFromPath && cityFromPath !== 'venues' && cityFromPath !== 'vendors';

    const [location, setLocation] = useState(searchParams.get("city") || (isCityPath ? cityFromPath : ""));
    const [occasion, setOccasion] = useState(searchParams.get("q") || "");
    const [selectedType, setSelectedType] = useState(searchParams.get("type") || "");
    const [selectedRegion, setSelectedRegion] = useState(searchParams.get("area") || "");
    const [foodType, setFoodType] = useState(searchParams.get("food") || "Any");
    
    // New Filters
    const [budget, setBudget] = useState(searchParams.get("budget") || "");
    const [capacity, setCapacity] = useState(searchParams.get("capacity") || "");
    const [rating, setRating] = useState(searchParams.get("rating") || "");
    const [cuisines, setCuisines] = useState<string[]>(searchParams.get("cuisine")?.split(',').filter(Boolean) || []);

    const [showMore, setShowMore] = useState(false);

    // Apply filters whenever state changes
    useEffect(() => {
        const p = new URLSearchParams(searchParams.toString());
        
        const hasChanged = 
            location !== (p.get("city") || (isCityPath ? cityFromPath : "")) ||
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
        
        // Update query params for standard filters
        if (occasion) p.set("q", occasion); else p.delete("q");
        if (selectedRegion) p.set("area", selectedRegion); else p.delete("area");
        if (foodType && foodType !== 'Any') p.set("food", foodType); else p.delete("food");
        
        // Update query params for new filters
        if (budget) p.set("budget", budget); else p.delete("budget");
        if (capacity) p.set("capacity", capacity); else p.delete("capacity");
        if (rating) p.set("rating", rating); else p.delete("rating");
        if (cuisines.length > 0) p.set("cuisine", cuisines.join(',')); else p.delete("cuisine");

        p.delete("city");
        p.delete("type");
        p.delete("page");

        const citySlug = location.trim().toLowerCase().replace(/\s+/g, '-');
        const typeSlug = selectedType.trim().toLowerCase().replace(/[\s/]+/g, '-');
        
        let targetPath = "/";
        
        if (citySlug && typeSlug) {
            targetPath = `/${citySlug}/${typeSlug}`;
        } else if (citySlug) {
            targetPath = `/${citySlug}`;
        } else if (typeSlug) {
            targetPath = `/ahmedabad/${typeSlug}`;
        } else {
            targetPath = type === 'vendors' ? '/vendors' : '/venues';
        }

        const queryString = p.toString();
        const targetUrl = queryString ? `${targetPath}?${queryString}` : targetPath;
        
        router.push(targetUrl, { scroll: false });
    };

    const clearFilters = () => {
        setLocation("");
        setOccasion("");
        setSelectedType("");
        setSelectedRegion("");
        setFoodType("Any");
        setBudget("");
        setCapacity("");
        setRating("");
        setCuisines([]);
        router.push(type === 'vendors' ? '/vendors' : '/venues');
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
        if (cuisines.includes(c)) {
            setCuisines(cuisines.filter(item => item !== c));
        } else {
            setCuisines([...cuisines, c]);
        }
    };

    // Active filters for chips
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

    // Add cuisines to chips
    cuisines.forEach(c => {
        activeFilters.push({ key: 'cuisine', label: c, value: c });
    });

    return (
        <div className="w-full bg-white border-b border-slate-100 sticky top-12 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
                {/* Desktop Grid | Mobile Single Button */}
                <div className="flex flex-col md:grid md:grid-cols-6 items-center gap-4 md:gap-6 mb-4">
                    
                    {/* Mobile: Compact Search & Filter Bar */}
                    <div className="md:hidden w-full flex items-center gap-2">
                        <div className="flex-grow flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3 h-10">
                            <MapPin size={12} className="text-slate-400 mr-2" />
                            <select 
                                value={location} 
                                onChange={e => setLocation(e.target.value)}
                                className="w-full bg-transparent text-[10px] font-black uppercase tracking-wider text-slate-900 appearance-none focus:outline-none"
                            >
                                <option value="">Select City</option>
                                {GUJARAT_CITIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                            </select>
                        </div>
                        <Button 
                            onClick={() => setShowMore(!showMore)}
                            variant="outline"
                            className="w-10 h-10 p-0 border-slate-200 rounded-xl bg-white text-slate-900 shadow-sm"
                        >
                            <SlidersHorizontal size={16} />
                        </Button>
                    </div>

                    {/* Desktop Selects — Hidden on Mobile */}
                    <div className="hidden md:flex flex-col gap-1 border-r border-slate-100 pr-6">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Location</label>
                        <select 
                            value={location} 
                            onChange={e => setLocation(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer hover:text-primary transition-colors"
                        >
                            <option value="">Select City</option>
                            {GUJARAT_CITIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                        </select>
                    </div>

                    <div className="hidden md:flex flex-col gap-1 border-r border-slate-100 pr-6">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Occasion</label>
                        <select 
                            value={occasion} 
                            onChange={e => setOccasion(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer hover:text-primary transition-colors"
                        >
                            <option value="">Select Occasion</option>
                            {['Wedding', 'Birthday', 'Engagement', 'Pool Party', 'Cocktail Party', 'Corporate Party', 'Kitty Party', 'Conference', 'Reception', 'Garba Event', 'Anniversary'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>

                    <div className="hidden md:flex flex-col gap-1 border-r border-slate-100 pr-6">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Space Type</label>
                        <select 
                            value={selectedType} 
                            onChange={e => setSelectedType(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer hover:text-primary transition-colors"
                        >
                            <option value="">Select Type</option>
                            {VENUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="hidden md:flex flex-col gap-1 border-r border-slate-100 pr-6">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Region</label>
                        <select 
                            value={selectedRegion} 
                            onChange={e => setSelectedRegion(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer hover:text-primary transition-colors"
                        >
                            <option value="">All Regions</option>
                            {['SG Highway', 'Satellite', 'Bodakdev', 'Adajan', 'Vesu'].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

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
                </div>

                {/* More Filters Expanded Section */}
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

                {/* Filter Chips & Clear All */}
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
};

export default ListingFilter;
