'use client';

import { useState, useEffect } from "react";
import { ChevronDown, MapPin, Building } from "lucide-react";
import { gujaratDistricts } from "@/lib/gujaratDistricts";

interface DistrictCitySelectProps {
    onSelect: (combinedValue: string) => void;
    initialValue?: string;
}

export default function DistrictCitySelect({ onSelect, initialValue }: DistrictCitySelectProps) {
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    // Parse initial value if present (e.g. "Ahmedabad - Sanand")
    useEffect(() => {
        if (initialValue && initialValue.includes(" - ")) {
            const [dist, city] = initialValue.split(" - ");
            setSelectedDistrict(dist);
            setSelectedCity(city);
        }
    }, [initialValue]);

    const districts = gujaratDistricts.map(d => d.district).sort();
    const availableCities = gujaratDistricts.find(d => d.district === selectedDistrict)?.cities || [];

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const district = e.target.value;
        setSelectedDistrict(district);
        setSelectedCity(""); // Reset city when district changes
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const city = e.target.value;
        setSelectedCity(city);
        if (selectedDistrict && city) {
            onSelect(`${selectedDistrict} - ${city}`);
        }
    };

    const selectCls = "w-full appearance-none bg-white border border-slate-200 rounded-xl px-11 py-3.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium cursor-pointer shadow-sm hover:border-slate-300";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* District Selection */}
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors pointer-events-none">
                    <MapPin className="w-5 h-5" />
                </div>
                <select 
                    value={selectedDistrict} 
                    onChange={handleDistrictChange}
                    className={selectCls}
                    required
                >
                    <option value="" disabled>Select District...</option>
                    {districts.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform">
                    <ChevronDown className="w-5 h-5" />
                </div>
            </div>

            {/* City Selection */}
            <div className={`relative group transition-opacity duration-300 ${!selectedDistrict ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors pointer-events-none">
                    <Building className="w-5 h-5" />
                </div>
                <select 
                    value={selectedCity} 
                    onChange={handleCityChange}
                    className={selectCls}
                    required
                    disabled={!selectedDistrict}
                >
                    <option value="" disabled>{selectedDistrict ? "Select City..." : "Select District First"}</option>
                    {availableCities.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform">
                    <ChevronDown className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
