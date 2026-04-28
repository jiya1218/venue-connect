import { createClient } from '@/lib/supabase/server';
import { Globe, Eye, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SEOPagesAdmin() {
  const supabase = await createClient();
  if (!supabase) return <p>Database not configured</p>;

  const { data: pages } = await supabase
    .from('seo_pages')
    .select('id, slug, page_type, view_count, last_generated, category_id, city_id, categories(name), locations!city_id(city)')
    .order('view_count', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">SEO Pages</h1>
        <span className="bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full">{pages?.length ?? 0} pages</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Slug</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">City</th>
              <th className="text-right px-4 py-3">Views</th>
              <th className="text-right px-4 py-3">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(pages ?? []).map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-indigo-600 flex items-center gap-1.5">
                  <Globe size={12} className="text-gray-400" />/{p.slug}
                </td>
                <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.page_type === 'city' ? 'bg-sky-100 text-sky-700' : 'bg-violet-100 text-violet-700'}`}>{p.page_type}</span></td>
                <td className="px-4 py-3 text-gray-600">{p.categories?.name ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{p.locations?.city ?? '—'}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-800 flex items-center justify-end gap-1"><Eye size={12} className="text-gray-400" />{(p.view_count ?? 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-400 text-xs flex items-center justify-end gap-1"><Calendar size={10} />{p.last_generated ? new Date(p.last_generated).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
