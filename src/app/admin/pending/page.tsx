import { createClient } from '@/lib/supabase/server';
import { CheckCircle2, XCircle, Clock, Building2, Camera } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PendingApprovalsPage() {
  const supabase = await createClient();
  if (!supabase) return <p>Database not configured</p>;

  const [{ data: venues }, { data: vendors }] = await Promise.all([
    supabase.from('venues').select('id, slug,name, starting_price, max_capacity, created_at, type, city, location').eq('is_approved', false).order('created_at', { ascending: false }),
    supabase.from('vendors').select('id,slug, name, starting_price, created_at, category, city, location').eq('is_approved', false).order('created_at', { ascending: false }),
  ]);

  const allPending = [
    ...(venues ?? []).map((v: any) => ({ ...v, _type: 'venue' as const, slug: v.slug, price_range: v.starting_price, categories: { name: v.type }, locations: { city: v.city, area: v.location } })),
    ...(vendors ?? []).map((v: any) => ({ ...v, _type: 'vendor' as const, slug: v.slug, price_range: v.starting_price, categories: { name: v.category }, locations: { city: v.city, area: v.location } })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <span className="bg-amber-100 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full">{allPending.length} pending</span>
      </div>

      {allPending.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <CheckCircle2 size={48} className="mx-auto mb-3 text-emerald-300" />
          <p className="font-medium">All caught up! No pending approvals.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Submitted</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allPending.map((item: any) => (
                <tr key={`${item._type}-${item.id}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                    {item._type === 'venue' ? <Building2 size={14} className="text-indigo-400" /> : <Camera size={14} className="text-rose-400" />}
                    {item.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item._type === 'venue' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'}`}>
                      {item._type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.categories?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{item.locations?.area ?? ''}, {item.locations?.city ?? ''}</td>
                  <td className="px-4 py-3 text-gray-400 flex items-center gap-1"><Clock size={12} />{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <form action={`/api/admin/approve`} method="POST" className="inline">
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="type" value={item._type} />
                      <button type="submit" className="inline-flex items-center gap-1 bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-600 transition-colors">
                        <CheckCircle2 size={12} /> Approve
                      </button>
                    </form>
                    <form action={`/api/admin/reject`} method="POST" className="inline">
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="type" value={item._type} />
                      <button type="submit" className="inline-flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors">
                        <XCircle size={12} /> Reject
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
