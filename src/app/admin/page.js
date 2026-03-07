'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
  const [counts, setCounts] = useState({ orders: '...', schemes: '...', links: '...', news: '...', audio: '...' });
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    async function load() {
      try {
        const [orders, schemes, links, news, audio] = await Promise.all([
          fetchCount('government_orders'),
          fetchCount('schemes'),
          fetchCount('quick_links'),
          fetchCount('news'),
          fetchCount('audio_classes'),
        ]);
        setCounts({ orders, schemes, links, news, audio });
        setStatus('ok');
      } catch {
        setStatus('error');
      }
    }
    load();
  }, []);

  const cards = [
    { label: 'വാർത്തകൾ', en: 'News Updates', count: counts.news, color: '#0071e3', href: '/admin/news', icon: '📰' },
    { label: 'സർക്കാർ ഉത്തരവുകൾ', en: 'Government Orders', count: counts.orders, color: '#ff9f0a', href: '/admin/orders', icon: '📄' },
    { label: 'പദ്ധതികൾ', en: 'Schemes', count: counts.schemes, color: '#30d158', href: '/admin/schemes', icon: '📋' },
    { label: 'ലിങ്കുകൾ', en: 'Quick Links', count: counts.links, color: '#5e5ce6', href: '/admin/links', icon: '🔗' },
    { label: 'ഓഡിയോ ക്ലാസ്സുകൾ', en: 'Audio Classes', count: counts.audio, color: '#30d158', href: '/admin/audio', icon: '🎙️' },
  ];

  return (
    <div className="p-4 md:p-8 bg-[#F5F7F9] min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1d1d1f] mb-2" style={{ fontFamily: "'Meera', sans-serif" }}>
          ഡാഷ്‌ബോർഡ്
        </h1>
        <p className="text-sm font-medium text-[#6e6e73]">Welcome to your professional admin panel</p>
      </div>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-8 text-sm text-red-600 font-bold">
          ⚠️ Supabase connection failed. Check your environment variables.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map(c => (
          <Link key={c.en} href={c.href}
            className="group bg-white border border-gray-100 rounded-[32px] p-8 no-underline transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1">
            <div className="text-4xl mb-6 bg-[#F5F7F9] w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
              {c.icon}
            </div>
            <div className="text-4xl font-black mb-2 tracking-tight" style={{ color: c.color }}>{c.count}</div>
            <div className="text-lg font-bold text-[#1d1d1f]" style={{ fontFamily: "'Meera', sans-serif" }}>{c.label}</div>
            <div className="text-[10px] uppercase tracking-widest font-black text-[#6e6e73] opacity-60">{c.en}</div>
          </Link>
        ))}
      </div>

      <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#86868b] mb-6 ml-2">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: '/admin/news', icon: '📰', label: 'വാർത്തകൾ ചേർക്കുക', en: 'Add News Updates' },
          { href: '/admin/orders', icon: '➕', label: 'പുതിയ ഉത്തരവ് ചേർക്കുക', en: 'Add new Government Order' },
          { href: '/admin/schemes', icon: '✏️', label: 'പദ്ധതികൾ എഡിറ്റ് ചെയ്യുക', en: 'Edit Schemes content' },
          { href: '/admin/links', icon: '🔗', label: 'ലിങ്കുകൾ മാനേജ് ചെയ്യുക', en: 'Manage Quick Links' },
          { href: '/admin/audio', icon: '🎙️', label: 'ഓഡിയോ ക്ലാസ്സ് അപ്‌ലോഡ് ചെയ്യുക', en: 'Upload Audio Classes' },
          { href: '/', icon: '🌐', label: 'പബ്ലിക് സൈറ്റ് കാണുക', en: 'View public website', target: '_blank' },
        ].map(a => (
          <Link key={a.en} href={a.href} target={a.target}
            className="flex items-center gap-5 bg-white border border-gray-100 rounded-2xl p-5 no-underline transition-all hover:bg-blue-50 hover:border-blue-200 group cursor-pointer">
            <div className="text-2xl w-12 h-12 flex items-center justify-center bg-[#F5F7F9] rounded-xl group-hover:bg-white transition-colors">
              {a.icon}
            </div>
            <div>
              <div className="text-[15px] font-bold text-[#1d1d1f]" style={{ fontFamily: "'Meera', sans-serif" }}>
                {a.label}
              </div>
              <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">
                {a.en}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
