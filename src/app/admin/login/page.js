'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('ലോഗിൻ പരാജയപ്പെട്ടു. ഇമെയിലും പാസ്‌വേഡും പരിശോധിക്കുക.');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Coat_of_arms_of_Kerala.svg/180px-Coat_of_arms_of_Kerala.svg.png"
            alt="Kerala" className="w-16 h-16 rounded-full bg-white p-1 object-contain mx-auto mb-4"
          />
          <h1 className="text-xl font-bold mb-1">അഡ്മിൻ ലോഗിൻ</h1>
          <p className="text-sm text-[#6e6e73]">Kerala Gov Employee Hub</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4">
          {error && (
            <div className="text-xs text-[#ff453a] bg-[rgba(255,69,58,0.1)] px-3 py-2 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-xs text-[#86868b] mb-1.5 font-semibold">ഇമെയിൽ</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@keralagov.in" required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/[0.08] rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors font-sans"
            />
          </div>

          <div>
            <label className="block text-xs text-[#86868b] mb-1.5 font-semibold">പാസ്‌വേഡ്</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/[0.08] rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors font-sans"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-[#2997ff] text-white rounded-xl text-sm font-semibold cursor-pointer hover:bg-[#0077ed] transition-all disabled:opacity-50 border-none font-malayalam"
          >
            {loading ? 'ലോഗിൻ ചെയ്യുന്നു...' : 'ലോഗിൻ'}
          </button>
        </form>

        <p className="text-[10px] text-[#6e6e73] text-center mt-4 font-sans">
          Create admin user in Supabase → Authentication → Users
        </p>
      </div>
    </div>
  );
}
