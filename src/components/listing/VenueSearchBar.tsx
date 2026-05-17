"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function VenueSearchBar() {
    const router = useRouter();
    const supabase = createClient();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim().length > 1) {
                fetchSuggestions(query);
            } else {
                setSuggestions([]);
                setIsOpen(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchSuggestions = async (search: string) => {
        const { data, error } = await supabase
            .from("venues")
            .select("id, name, city, slug, location")
            .eq("is_active", true)
            .ilike("name", `%${search}%`)
            .limit(5);

        if (!error && data) {
            setSuggestions(data);
            setIsOpen(true);
        }
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;
        setIsOpen(false);
        router.push(`/venues?q=${encodeURIComponent(query.trim())}`);
    };

    const handleSelectSuggestion = (venue: any) => {
        setQuery(venue.name);
        setIsOpen(false);
        const rawCity = (venue.city || "ahmedabad").split(/[-,]/)[0].trim();
        const citySlug = rawCity.toLowerCase().replace(/\s+/g, "-");
        router.push(`/${citySlug}/${venue.slug}`);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-4xl">
            <form 
                onSubmit={handleSearch} 
                className="bg-white md:bg-white/10 backdrop-blur-xl rounded-full shadow-2xl flex flex-row items-center overflow-hidden w-full border-2 md:border-4 border-white/10 group/searchbox transition-all duration-500 hover:border-white/20 h-11 md:h-16 px-1 relative z-50"
            >
                <div className="flex-[8] flex items-center px-4 md:px-6 h-full border-r border-slate-100 md:border-white/10">
                    <Search className="text-slate-400 md:text-white/60 w-4 h-4 md:w-5 md:h-5 mr-3 md:mr-4 shrink-0" />
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => { if(suggestions.length > 0) setIsOpen(true) }}
                        placeholder="Search venues by name..."
                        className="w-full bg-transparent border-none focus:ring-0 text-slate-900 md:text-white font-bold text-[11px] md:text-sm placeholder:text-slate-500 md:placeholder:text-white/60 outline-none"
                        autoComplete="off"
                    />
                </div>
                <button 
                    type="submit" 
                    className="flex-[2] bg-[#EF3E36] hover:bg-[#D9362F] text-white font-black uppercase tracking-widest text-[10px] md:text-xs h-9 md:h-full px-4 md:px-8 transition-all rounded-full md:rounded-none flex items-center justify-center"
                >
                    Search
                </button>
            </form>

            {/* Dropdown Suggestions */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 z-[60]">
                    <ul className="py-2">
                        {suggestions.map((s) => (
                            <li 
                                key={s.id} 
                                onClick={() => handleSelectSuggestion(s)}
                                className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex flex-col transition-colors border-b border-slate-50 last:border-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                        <Search size={14} className="text-slate-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 text-sm line-clamp-1">{s.name}</span>
                                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                            <MapPin size={9} /> {s.location || s.city}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
