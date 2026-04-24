"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export const OwnerRoute = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        checkOwnerStatus();
    }, []);

    const checkOwnerStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile && (profile.role === 'owner' || profile.role === 'admin')) {
                setIsOwner(true);
            } else {
                toast.error("Unauthorized access. Owner privileges required.");
            }
        } catch (error) {
            console.error("Error checking role:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isOwner) {
        router.push('/');
        return null;
    }

    return <>{children}</>;
};
