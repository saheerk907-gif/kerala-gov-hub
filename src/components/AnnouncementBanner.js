'use client';
import { useState, useEffect } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function fetchTicker() {
  try {
    const [newsRes, goRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/news?select=title_ml,created_at&order=created_at.desc&limit=5`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      }),
      fetch(`${SUPABASE_URL}/rest/v1/government_orders?select=title_ml,go_number,go_date&is_published=eq.true&order=go_date.desc&limit=5`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      }),
    ]);
    const news = await newsRes.json();
    const gos = await goRes.json();

    const items = [];
    if (Array.isArray(gos)) gos.forEach(g => items.push({ icon: '📋', label: 'NEW GO', text: g.title_ml, sub: g.go_number, color: '#ff9f0a', href: '#orders' }));
    if (Array.isArray(news)) news.forEach(n => items.push({ icon: '📰', label: 'LATEST', text: n.title_ml, sub: null, color: '#2997ff', href: '#news' }));
    return items;
  } catch { return []; }
}

const FALLBACK = [
  { icon: '📋', label: 'NEW GO', text: 'ക്ഷാമബത്ത 3% — 01/07/2023 മുതൽ', sub: 'G.O.(P) No.15/2026/Fin', color: '#ff9f0a', href: '#orders' },
  { icon: '📰', label: 'LATEST', text: 'DA Revision — July 2024 മുതൽ 35%', sub: null, color: '#2997ff', href: '#news' },
  { icon: '🏥', label: 'UPDATE', text: 'Medisep Phase II — ₹5 ലക്ഷം കവറേജ്', sub: null, color: '#30d158', href: '#services' },
  { icon: '📌', label: 'LATEST', text: 'GPF Annual Statement 2024-25 — SPARK-ൽ ലഭ്യം', sub: null, color: '#bf5af2', href: '#links' },
];

export default function AnnouncementBanner() {
  const [items, setItems] = useState(FALLBACK);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchTicker().then(data => { if (data.length > 0) setItems(data); });
  }, []);

  if (dismissed) return null;

  const repeated = [...items, ...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-b"
      style={{ background: 'rgba(18,20,22,0.95)', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-center h-10">

        {/* BREAKING label */}
        <div
          className="flex items-center gap-2 px-4 h-full flex-shrink-0 border-r"
          style={{ background: 'rgba(41,151,255,0.85)', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white whitespace-nowrap">
            Live
          </span>
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgba(18,20,22,0.95), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, rgba(18,20,22,0.95), transparent)' }} />

          <div className="flex items-center gap-0 ticker-track whitespace-nowrap">
            {repeated.map((item, i) => (
              <a key={i} href={item.href}
                className="inline-flex items-center gap-2 px-5 no-underline group flex-shrink-0">
                <span
                  className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: item.color + '25', color: item.color, border: `1px solid ${item.color}30` }}>
                  {item.label}
                </span>
                <span className="text-[11px] font-medium text-white/55 group-hover:text-white/85 transition-colors"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                  {item.text}
                </span>
                {item.sub && (
                  <span className="text-[10px] text-white/45 font-sans flex-shrink-0">{item.sub}</span>
                )}
                <span className="text-white/10 mx-1 flex-shrink-0">◆</span>
              </a>
            ))}
          </div>
        </div>

        {/* Dismiss */}
        <button onClick={() => setDismissed(true)}
          className="flex-shrink-0 px-3 h-full text-white/40 hover:text-white/60 transition-colors text-lg font-light border-none bg-transparent cursor-pointer border-l"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          ×
        </button>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .ticker-track {
          animation: ticker 40s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
