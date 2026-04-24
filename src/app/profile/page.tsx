"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Mail, LogOut, User, Shield } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            toast.success("Signed out successfully");
            router.push('/');
        } catch (error) {
            toast.error("Error signing out");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-16">
            <div className="container px-4 max-w-2xl mx-auto">
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-8">Account Settings</h1>
                
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
                    <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Your Profile</h2>
                            <p className="text-sm text-slate-500">Manage your account settings and preferences</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="font-medium text-slate-900">Security</p>
                                    <p className="text-xs text-slate-500">Update your password</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Update</Button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <Button 
                            onClick={handleSignOut} 
                            disabled={loading}
                            variant="outline" 
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            {loading ? "Signing out..." : "Sign Out"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
