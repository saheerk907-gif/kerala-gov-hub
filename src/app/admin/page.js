'use client';
import { useEffect, useState } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function fetchCount(table) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch { return 0; }
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ orders: '...', schemes: '...', links: '...' });
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    async function load() {
      try {
        const [orders, schemes, links] = await Promise.all([
          fetchCount('government_orders'),
          fetchCount('schemes'),
          fetchCount('quick_links'),
        ]);
        setCounts({ orders, schemes, links });
        setStatus('ok');
      } catch {
        setStatus('error');
      }
    }
    load();
  }, []);

  const cards = [
    { label: 'സർക്കാർ ഉത്തരവുകൾ', en: 'Government Orders', count: counts.orders, color: '#ff9f0a', href: '/admin/orders', icon: '📄' },
    { label: 'പദ്ധതികൾ',           en: 'Schemes',           count: counts.schemes, color: '#2997ff', href: '/admin/schemes', icon: '📋' },
    { label: 'ലിങ്കുകൾ',           en: 'Quick Links',       count: counts.links,  color: '#30d158', href: '/admin/links',   icon: '🔗' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">ഡാഷ്‌ബോർഡ്</h1>
      <p className="text-sm text-[#6e6e73] mb-8">Welcome to the admin panel</p>

      {status === 'error' && (
        <div className="bg-[#ff453a]/10 border border-[#ff453a]/30 rounded-xl p-4 mb-6 text-sm text-[#ff453a]">
          ⚠️ Supabase connection failed. Check your environment variables in Vercel.
        </div>
      )}

      {/* Count Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <a key={c.en} href={c.href}
            className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 no-underline text-inherit hover:border-white/20 hover:bg-[#1a1a1a] transition-all group">
            <div className="text-3xl mb-3">{c.icon}</div>
            <div className="text-3xl font-black mb-1" style={{ color: c.color }}>{c.count}</div>
            <div className="text-sm font-semibold text-white">{c.label}</div>
            <div className="text-[10px] text-[#6e6e73]">{c.en}</div>
          </a>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-sm font-bold uppercase tracking-widest text-[#6e6e73] mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: '/admin/orders', icon: '➕', label: 'പുതിയ ഉത്തരവ് ചേർക്കുക', en: 'Add new Government Order', color: '#ff9f0a' },
          { href: '/admin/schemes', icon: '✏️', label: 'പദ്ധതികൾ എഡിറ്റ് ചെയ്യുക', en: 'Edit Schemes content', color: '#2997ff' },
          { href: '/admin/links', icon: '🔗', label: 'ലിങ്കുകൾ മാനേജ് ചെയ്യുക', en: 'Manage Quick Links', color: '#30d158' },
          { href: '/', icon: '🌐', label: 'പബ്ലിക് സൈറ്റ് കാണുക', en: 'View public website', color: '#86868b', target: '_blank' },
        ].map(a => (
          <a key={a.href} href={a.href} target={a.target}
            className="flex items-center gap-4 bg-[#111] border border-white/[0.08] rounded-xl p-4 no-underline text-inherit hover:bg-[#1a1a1a] transition-all"
            style={{ '--hover-color': a.color }}>
            <div className="text-2xl w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl">{a.icon}</div>
            <div>
              <div className="text-sm font-semibold text-white">{a.label}</div>
              <div className="text-[10px] text-[#6e6e73]">{a.en}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
