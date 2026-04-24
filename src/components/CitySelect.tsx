"use client";

import { useRouter } from "next/navigation";

export default function CitySelect() {
    const router = useRouter();
    
    return (
        <select 
            onChange={(e) => {
                const val = e.target.value;
                if (val === 'all') router.push('/venues');
                else router.push(`/${val.toLowerCase()}`);
            }}
            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-black uppercase tracking-widest text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            defaultValue="all"
        >
            <option value="all">ALL CITIES</option>
            {['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Vapi', 'Anand', 'Nadiad'].map(city => (
                <option key={city} value={city.toLowerCase()}>{city}</option>
            ))}
        </select>
    );
}
