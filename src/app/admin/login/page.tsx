'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    if (!supabase) { setError('DB not configured'); setLoading(false); return; }
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    router.push('/admin/pending');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-gray-800 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Lock size={22} className="text-indigo-400" />
          <h1 className="text-xl font-bold text-white">Admin Login</h1>
        </div>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="admin@venueconnect.in" required className="w-full mb-3 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required className="w-full mb-4 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
          {loading ? <><Loader2 size={16} className="animate-spin" />Signing in...</> : 'Sign In'}
        </button>
      </form>
    </main>
  );
}
