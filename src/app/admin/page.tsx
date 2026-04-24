'use client';

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import DashboardTab from "@/components/admin/Tabs/DashboardTab";
import ListingsTab from "@/components/admin/Tabs/ListingsTab";
import ApplicationsTab from "@/components/admin/Tabs/ApplicationsTab";
import UsersTab from "@/components/admin/Tabs/UsersTab";
import CitiesTab from "@/components/admin/Tabs/CitiesTab";

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  return (
    <div className="animate-in fade-in duration-700">
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'listings' && <ListingsTab />}
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
