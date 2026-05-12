'use client';

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const DashboardTab = dynamic(() => import("@/components/admin/Tabs/DashboardTab"), { 
    loading: () => <div className="animate-pulse bg-slate-100 h-96 rounded-[2.5rem]" /> 
});
const ListingsTab = dynamic(() => import("@/components/admin/Tabs/ListingsTab"), { 
    loading: () => <div className="animate-pulse bg-slate-100 h-96 rounded-[2.5rem]" /> 
});
const ApplicationsTab = dynamic(() => import("@/components/admin/Tabs/ApplicationsTab"), { 
    loading: () => <div className="animate-pulse bg-slate-100 h-96 rounded-[2.5rem]" /> 
});
const UsersTab = dynamic(() => import("@/components/admin/Tabs/UsersTab"), { 
    loading: () => <div className="animate-pulse bg-slate-100 h-96 rounded-[2.5rem]" /> 
});
const CitiesTab = dynamic(() => import("@/components/admin/Tabs/CitiesTab"), { 
    loading: () => <div className="animate-pulse bg-slate-100 h-96 rounded-[2.5rem]" /> 
});
const LeadsTab = dynamic(() => import("@/components/admin/Tabs/LeadsTab"), { 
    loading: () => <div className="animate-pulse bg-slate-100 h-96 rounded-[2.5rem]" /> 
});

const EditRequestsTab = dynamic(() => import("@/components/admin/Tabs/EditRequestsTab"), { 
    loading: () => <div className="animate-pulse bg-slate-100 h-96 rounded-[2.5rem]" /> 
});

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  return (
    <div className="animate-in fade-in duration-700">
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'listings' && <ListingsTab />}
      {activeTab === 'edit-requests' && <EditRequestsTab />}
      {activeTab === 'leads' && <LeadsTab />}
      {activeTab === 'applications' && <ApplicationsTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'cities' && <CitiesTab />}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-[4px] text-xs">Authenticating Session...</p>
        </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
