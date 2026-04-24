'use client';

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { citiesData } from "@/lib/citiesData";

interface SearchableCitySelectProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function SearchableCitySelect({ value, onChange, className }: SearchableCitySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    const cities = citiesData.map(c => c.name).sort((a,b) => a.localeCompare(b));
    const filteredCities = cities.filter(c => c.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative w-full">
            <div 
                className={`flex items-center justify-between cursor-pointer bg-white px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors ${className}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={value ? "text-slate-900" : "text-slate-500"}>
                    {value || "Search & select city..."}
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="p-2 border-b border-slate-100 flex items-center gap-2">
                        <Search className="w-4 h-4 text-slate-400 ml-2" />
                        <input
                            type="text"
                            placeholder="Type to search city..."
                            className="w-full bg-transparent border-none focus:outline-none text-sm py-2"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                        {filteredCities.length === 0 ? (
                            <div className="p-4 text-center text-sm text-slate-500">No city found</div>
                        ) : (
                            filteredCities.map((city) => (
                                <div
                                    key={city}
                                    className={`px-4 py-2.5 text-sm rounded-lg cursor-pointer flex items-center justify-between ${value === city ? 'bg-pink-50 text-pink-700 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}
                                    onClick={() => {
                                        onChange(city);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                >
                                    {city}
                                    {value === city && <Check className="w-4 h-4 text-pink-600" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
