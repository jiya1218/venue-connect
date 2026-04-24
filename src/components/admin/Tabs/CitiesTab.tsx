'use client';

import { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  ArrowRight, 
  Store, 
  ClipboardList, 
  Search,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CitiesTab() {
  const [citiesData, setCitiesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await fetch('/api/cities/counts');
      const data = await res.json();
      const formatted = Object.entries(data).map(([name, stats]: [string, any]) => ({
          name,
          ...stats
      }));
      setCitiesData(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
      let direction: 'asc' | 'desc' = 'desc';
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
          direction = 'asc';
      }
      setSortConfig({ key, direction });
  };

  const sortedData = [...citiesData]
      .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
          if (!sortConfig) return 0;
          const { key, direction } = sortConfig;
          if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
          if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
          return 0;
      });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display mb-1">Cities Overview</h1>
              <p className="text-slate-400 font-medium text-sm">Analyze marketplace density and pending demand across Gujarat.</p>
          </div>
          <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Find city..." 
                className="pl-12 h-12 rounded-xl bg-white border-slate-200 font-medium w-64" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
          </div>
      </div>

      {/* Cities Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th 
                            className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors"
                            onClick={() => handleSort('name')}
                          >
                              City {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <ArrowUpNarrowWide className="inline w-3 h-3 ml-1" /> : <ArrowDownNarrowWide className="inline w-3 h-3 ml-1" />)}
                          </th>
                          <th 
                            className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors"
                            onClick={() => handleSort('venues')}
                          >
                            Venues {sortConfig?.key === 'venues' && (sortConfig.direction === 'asc' ? <ArrowUpNarrowWide className="inline w-3 h-3 ml-1" /> : <ArrowDownNarrowWide className="inline w-3 h-3 ml-1" />)}
                          </th>
                          <th 
                            className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors"
                            onClick={() => handleSort('vendors')}
                          >
                            Vendors {sortConfig?.key === 'vendors' && (sortConfig.direction === 'asc' ? <ArrowUpNarrowWide className="inline w-3 h-3 ml-1" /> : <ArrowDownNarrowWide className="inline w-3 h-3 ml-1" />)}
                          </th>
                          <th 
                            className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors"
                            onClick={() => handleSort('total')}
                          >
                            Total Listings {sortConfig?.key === 'total' && (sortConfig.direction === 'asc' ? <ArrowUpNarrowWide className="inline w-3 h-3 ml-1" /> : <ArrowDownNarrowWide className="inline w-3 h-3 ml-1" />)}
                          </th>
                          <th 
                            className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors"
                            onClick={() => handleSort('pending')}
                          >
                            Pending Apps {sortConfig?.key === 'pending' && (sortConfig.direction === 'asc' ? <ArrowUpNarrowWide className="inline w-3 h-3 ml-1" /> : <ArrowDownNarrowWide className="inline w-3 h-3 ml-1" />)}
                          </th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                      {loading ? (
                          <tr>
                             <td colSpan={6} className="px-8 py-20 text-center">
                                <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-slate-400 font-medium">Aggregating geolocation data...</p>
                             </td>
                          </tr>
                      ) : sortedData.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-8 py-32 text-center">
                                <MapPin size={48} className="text-slate-100 mx-auto mb-4" />
                                <p className="text-slate-400 font-medium italic">No city data available currently.</p>
                            </td>
                        </tr>
                      ) : (
                          sortedData.map((city) => (
                              <tr key={city.name} className="group hover:bg-slate-50/50 transition-all duration-300">
                                  <td className="px-8 py-6">
                                      <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                              <MapPin size={20} />
                                          </div>
                                          <span className="font-bold text-slate-900 text-lg">{city.name}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-6">
                                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                                          <Building2 size={16} className="text-blue-500" /> {city.venues}
                                      </div>
                                  </td>
                                  <td className="px-6 py-6">
                                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                                          <Store size={16} className="text-purple-500" /> {city.vendors}
                                      </div>
                                  </td>
                                  <td className="px-6 py-6">
                                      <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10">
                                          {city.total} Listings
                                      </span>
                                  </td>
                                  <td className="px-6 py-6">
                                      {city.pending > 0 ? (
                                          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                                               <ClipboardList size={12} /> {city.pending} Pending
                                          </span>
                                      ) : (
                                          <span className="text-slate-300 text-xs font-bold">—</span>
                                      )}
                                  </td>
                                  <td className="px-8 py-6 text-right">
                                      <Button 
                                        variant="ghost" 
                                        className="h-10 px-4 rounded-xl text-xs font-bold text-primary hover:bg-primary/10 group"
                                        onClick={() => window.location.href = `?tab=listings&city=${city.name}`}
                                      >
                                          View Listings <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                      </Button>
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>
      </div>

    </div>
  );
}
