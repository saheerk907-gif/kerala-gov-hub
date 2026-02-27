'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const navItems = [
  { href: '/admin', label: 'ഡാഷ്‌ബോർഡ്', icon: '🏠', en: 'Dashboard' },
  { href: '/admin/orders', label: 'ഉത്തരവുകൾ', icon: '📄', en: 'Orders' },
  { href: '/admin/schemes', label: 'പദ്ധതികൾ', icon: '📋', en: 'Schemes' },
  { href: '/admin/links', label: 'ലിങ്കുകൾ', icon: '🔗', en: 'Links' },
];

async function refreshToken() {
  const refresh = sessionStorage.getItem('admin_refresh_token');
  if (!refresh) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    const data = await res.json();
    if (data.access_token) {
      sessionStorage.setItem('admin_token', data.access_token);
      sessionStorage.setItem('admin_refresh_token', data.refresh_token);
      return data.access_token;
    }
  } catch {}
  return null;
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    async function check() {
      const token = sessionStorage.getItem('admin_token');
      if (token) {
        // Try to refresh proactively
        const newToken = await refreshToken();
        setAuthed(true);
      }
      setChecking(false);
    }
    check();

    // Auto-refresh every 50 minutes
    const interval = setInterval(refreshToken, 50 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoggingIn(true);
    setError('');
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.access_token) {
        sessionStorage.setItem('admin_token', data.access_token);
        sessionStorage.setItem('admin_refresh_token', data.refresh_token);
        setAuthed(true);
      } else {
        setError('ഇമെയിൽ അല്ലെങ്കിൽ പാസ്‌വേഡ് തെറ്റാണ്');
      }
    } catch {
      setError('Login failed. Check your credentials.');
    }
    setLoggingIn(false);
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_refresh_token');
    setAuthed(false);
  }

  if (checking) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-[#6e6e73] text-sm">Loading...</div>
    </div>
  );

  if (!authed) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Login</h1>
          <p className="text-sm text-[#6e6e73]">Kerala Gov Employee Hub</p>
        </div>
        <form onSubmit={handleLogin} className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors"
              placeholder="admin@example.com" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#6e6e73] mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-3 bg-[#1c1c1e] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#2997ff] transition-colors"
              placeholder="••••••••" />
          </div>
          {error && <div className="text-xs text-[#ff453a] bg-[#ff453a]/10 px-3 py-2 rounded-lg">{error}</div>}
          <button type="submit" disabled={loggingIn}
            className="w-full py-3 bg-[#2997ff] text-white rounded-xl text-sm font-bold hover:bg-[#0077ed] transition-all disabled:opacity-50">
            {loggingIn ? 'Logging in...' : 'Login →'}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-56 min-h-screen bg-[#0a0a0a] border-r border-white/[0.06] flex flex-col fixed top-0 left-0 bottom-0">
        <div className="p-5 border-b border-white/[0.06]">
          <div className="text-xs font-bold text-[#2997ff] uppercase tracking-widest mb-0.5">Admin Panel</div>
          <div className="text-[10px] text-[#6e6e73]">Kerala Gov Hub</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <a key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all no-underline ${
                pathname === item.href
                  ? 'bg-[#2997ff]/10 text-[#2997ff] font-semibold'
                  : 'text-[#86868b] hover:text-white hover:bg-white/5'
              }`}>
              <span>{item.icon}</span>
              <div>
                <div className="leading-tight">{item.label}</div>
                <div className="text-[9px] opacity-60">{item.en}</div>
              </div>
            </a>
          ))}
        </nav>
        <div className="p-3 border-t border-white/[0.06]">
          <a href="/" target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#6e6e73] hover:text-white hover:bg-white/5 transition-all no-underline mb-1">
            🌐 <span>Public Site</span>
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#ff453a] hover:bg-[#ff453a]/10 transition-all border-none bg-transparent cursor-pointer">
            🚪 <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-56 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
