'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  User, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  UserCheck,
  Building2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 25;

export default function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let q = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      if (search) {
        q = q.or(`full_name.ilike.%${search}%,phone_number.ilike.%${search}%`);
      }

      const { data, count: c, error } = await q
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
      setCount(c || 0);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
        const res = await fetch(`/api/admin/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
        });
        if (res.ok) {
            toast.success(`User role updated to ${newRole}`);
            fetchUsers();
        } else {
            throw new Error("Update failed");
        }
    } catch (e) {
        toast.error("Role update failed");
    }
  };

  const getRoleColor = (role: string) => {
      switch (role) {
          case 'admin': return 'bg-rose-50 text-rose-600 border-rose-100';
          case 'owner': return 'bg-amber-50 text-amber-600 border-amber-100';
          default: return 'bg-slate-50 text-slate-500 border-slate-100';
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display mb-1">User Management</h1>
              <p className="text-slate-400 font-medium text-sm">Oversee platform membership, modify roles, and audit business ownership.</p>
          </div>
          <div className="flex items-center gap-4">
              <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input 
                    placeholder="Search name or phone..." 
                    className="pl-12 h-12 rounded-xl bg-white border-slate-200 font-medium w-64" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
              </div>
          </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                      {loading ? (
                          <tr>
                             <td colSpan={5} className="px-8 py-20 text-center">
                                <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-slate-400 font-medium">Auditing community...</p>
                             </td>
                          </tr>
                      ) : users.length === 0 ? (
                          <tr>
                             <td colSpan={5} className="px-8 py-32 text-center">
                                <Users size={48} className="text-slate-100 mx-auto mb-4" />
                                <p className="text-slate-400 font-medium italic">No users found matching your search.</p>
                             </td>
                          </tr>
                      ) : (
                          users.map((user) => (
                              <tr key={user.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                  <td className="px-8 py-6">
                                      <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400 shrink-0">
                                              {user.avatar_url ? (
                                                  <img src={user.avatar_url} className="w-full h-full object-cover rounded-2xl" />
                                              ) : (
                                                  <User size={20} />
                                              )}
                                          </div>
                                          <div>
                                              <p className="font-bold text-slate-900 leading-tight">{user.full_name || 'Incognito User'}</p>
                                              <p className="text-[10px] text-slate-400 font-medium mt-1">UUID: {user.id.slice(0, 8)}...</p>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-6">
                                      <select 
                                        className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest focus:outline-none transition-colors ${getRoleColor(user.role)}`}
                                        value={user.role}
                                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                      >
                                          <option value="user">User</option>
                                          <option value="owner">Owner</option>
                                          <option value="admin">Admin</option>
                                      </select>
                                  </td>
                                  <td className="px-6 py-6">
                                      <div className="space-y-1">
                                          <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                              <Phone size={12} className="text-slate-300" /> {user.phone_number || 'No Phone'}
                                          </p>
                                          <p className="text-xs text-slate-400 font-medium italic">Gujarat, IN</p>
                                      </div>
                                  </td>
                                  <td className="px-6 py-6">
                                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                          <Calendar size={14} className="text-slate-300" /> {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                      </div>
                                  </td>
                                  <td className="px-8 py-6 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                          {user.role === 'owner' && (
                                              <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-10 rounded-xl px-4 border-slate-200 font-bold text-xs"
                                                onClick={() => window.location.href = `?tab=listings&owner=${user.id}`}
                                              >
                                                  <Building2 size={14} className="mr-2" /> View Listings
                                              </Button>
                                          )}
                                          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-900">
                                              <ExternalLink size={16} />
                                          </Button>
                                      </div>
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>

          {/* Pagination */}
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">
                Showing {Math.min(page * ITEMS_PER_PAGE + 1, count)}-{Math.min((page + 1) * ITEMS_PER_PAGE, count)} of {count} users
              </p>
              <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    disabled={page === 0} 
                    onClick={() => setPage(p => p - 1)}
                    className="text-xs font-bold text-slate-500 hover:text-primary transition-colors"
                  >
                      <ChevronLeft size={16} className="mr-2" /> Previous
                  </Button>
                  <Button 
                    variant="ghost" 
                    disabled={(page + 1) * ITEMS_PER_PAGE >= count} 
                    onClick={() => setPage(p => p + 1)}
                    className="text-xs font-bold text-slate-500 hover:text-primary transition-colors"
                  >
                      Next <ChevronRight size={16} className="ml-2" />
                  </Button>
              </div>
          </div>
      </div>

    </div>
  );
}
