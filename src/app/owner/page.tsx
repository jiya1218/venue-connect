"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Building, LayoutDashboard, Settings, LogOut, X, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import LeadsManager from "@/components/owner/LeadsManager";
import MyListings from "@/components/owner/MyListings";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function OwnerDashboardPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'listings'>('leads');
    const [showWelcome, setShowWelcome] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('owner_onboarding_seen');
        if (!hasSeenWelcome) {
            setShowWelcome(true);
        }
    }, []);

    const closeWelcome = () => {
        localStorage.setItem('owner_onboarding_seen', 'true');
        setShowWelcome(false);
    };

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            toast.success("Signed out successfully");
            router.push('/');
        } catch (error) {
            toast.error("Error signing out");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            
            {/* Welcome Onboarding Modal */}
            {showWelcome && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-amber-500 p-6 text-white text-center relative">
                            <button onClick={closeWelcome} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-display font-bold mb-2">Welcome to your Lister Dashboard!</h2>
                            <p className="text-amber-100 text-sm">You are now a Verified Lister on VenueConnect</p>
                        </div>
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="space-y-4 text-slate-600">
                                <div className="flex gap-4">
                                    <div className="bg-blue-50 text-blue-600 p-2 rounded-lg shrink-0 h-min"><Users className="w-5 h-5" /></div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Manage Your Leads</h3>
                                        <p className="text-sm">View incoming inquiries from potential customers and contact them directly.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-purple-50 text-purple-600 p-2 rounded-lg shrink-0 h-min"><Building className="w-5 h-5" /></div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Update Your Listings</h3>
                                        <p className="text-sm">Keep your pricing, photos, and availability up to date to attract more bookings.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <Button onClick={closeWelcome} className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 text-base font-semibold">
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 gap-6">
                
                {/* Sidebar */}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24">
                        <div className="mb-6 px-2">
                            <h2 className="text-lg font-bold text-slate-800">Owner Portal</h2>
                            <p className="text-xs text-slate-500">Manage your listings</p>
                        </div>
                        
                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary text-primary-foreground' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                            >
                                <LayoutDashboard className="w-4 h-4" /> Overview
                            </button>
                            
                            <button
                                onClick={() => setActiveTab('leads')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'leads' ? 'bg-primary text-primary-foreground' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                            >
                                <Users className="w-4 h-4" /> My Leads
                            </button>

                            <button
                                onClick={() => setActiveTab('listings')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'listings' ? 'bg-primary text-primary-foreground' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                            >
                                <Building className="w-4 h-4" /> My Listings
                            </button>
                            
                            <div className="pt-4 mt-4 border-t border-slate-200">
                                <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors w-full">
                                    <Settings className="w-4 h-4" /> Account Settings
                                </Link>
                                <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left mt-1">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    {activeTab === 'overview' && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h2>
                            <p className="text-slate-600 mb-4">Welcome to your Owner Portal. From here you can track your incoming leads and manage your active venues and vendors.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border border-slate-200 rounded-lg p-5 flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveTab('leads')}>
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-6 h-6"/></div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Manage Leads</h3>
                                        <p className="text-xs text-slate-500">View and contact prospective customers</p>
                                    </div>
                                </div>
                                <div className="border border-slate-200 rounded-lg p-5 flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveTab('listings')}>
                                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Building className="w-6 h-6"/></div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Manage Listings</h3>
                                        <p className="text-xs text-slate-500">Update your venue and vendor profiles</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'leads' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <LeadsManager />
                        </div>
                    )}

                    {activeTab === 'listings' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <MyListings />
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
}
