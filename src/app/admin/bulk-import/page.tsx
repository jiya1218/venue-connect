'use client';
import { useState } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BulkImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; inserted?: number; errors?: string[] } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/bulk-import', { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data);
    } catch { setResult({ success: false, errors: ['Network error'] }); }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bulk Import Locations</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl">
        <p className="text-sm text-gray-500 mb-4">Upload a CSV with columns: <code className="bg-gray-100 px-1 rounded text-xs">city, city_slug, area, area_slug, state, lat, lng</code></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="file" accept=".csv" onChange={e => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          <button type="submit" disabled={!file || loading} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50">
            {loading ? <><Loader2 size={16} className="animate-spin" />Importing...</> : <><Upload size={16} />Import CSV</>}
          </button>
        </form>
        {result && (
          <div className={`mt-4 p-3 rounded-xl text-sm ${result.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {result.success ? <><CheckCircle2 size={14} className="inline mr-1" />{result.inserted} locations imported.</> : <><AlertCircle size={14} className="inline mr-1" />{result.errors?.join(', ')}</>}
          </div>
        )}
      </div>
    </div>
  );
}
