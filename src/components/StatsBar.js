'use client';
import { useEffect, useRef, useState } from 'react';

function StatCard({ stat, index }) {
  const [val, setVal] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const animated = useRef(false);
  const target = Number(stat.value) || 0;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated.current) {
        animated.current = true;
        setTimeout(() => {
          setVisible(true);
          const start = performance.now();
          const dur = 1800;
          function upd(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            setVal(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(upd);
          }
          requestAnimationFrame(upd);
        }, index * 120);
      }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, index]);

  const icons = ['📰', '📋', '🏛️'];
  const colors = ['#2997ff', '#30d158', '#c8960c'];
  const color = colors[index % colors.length];

  return (
    <div
      ref={ref}
      className={`glass-card glow-top relative rounded-[18px] md:rounded-[28px] p-4 md:p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Icon */}
      <div
        className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-2xl mb-2 md:mb-5"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        {icons[index % icons.length]}
      </div>

      {/* Label */}
      <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em] text-white/60 mb-1 md:mb-3" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
        {stat.label_ml}
      </p>

      {/* Number */}
      <div className="text-2xl md:text-5xl font-[900] tracking-[-0.04em] leading-none text-white mb-1 md:mb-3">
        {val.toLocaleString('en-IN')}
        <span style={{ color }} className="ml-0.5 md:ml-1 text-xl md:text-3xl">+</span>
      </div>

      <div className="hidden md:flex items-center gap-2 justify-center">
        <div className="w-5 h-[1px]" style={{ background: `${color}50` }} />
        <p className="text-[12px] font-semibold text-white/50" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
          {stat.sub_text || 'ഔദ്യോഗിക കണക്കുകൾ'}
        </p>
        <div className="w-5 h-[1px]" style={{ background: `${color}50` }} />
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-1/2 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
    </div>
  );
}

export default function StatsBar() {
  const [counts, setCounts] = useState([
    { id: 1, label_ml: 'വാർത്തകൾ', value: 0, sub_text: 'പുതിയ അറിയിപ്പുകൾ' },
    { id: 2, label_ml: 'ഉത്തരവുകൾ', value: 0, sub_text: 'സർക്കാർ വിജ്ഞാപനങ്ങൾ' },
    { id: 3, label_ml: 'പദ്ധതികൾ', value: 18, sub_text: 'സേവന പദ്ധതികൾ' },
  ]);

  useEffect(() => {
    async function getLiveCounts() {
      try {
        const fetchCount = async (table) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}?select=id`,
            { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY } }
          );
          const data = await res.json();
          return Array.isArray(data) ? data.length : 0;
        };
        const [newsCount, ordersCount] = await Promise.all([
          fetchCount('news'),
          fetchCount('government_orders'),
        ]);
        setCounts([
          { id: 1, label_ml: 'വാർത്തകൾ', value: newsCount, sub_text: 'പുതിയ അറിയിപ്പുകൾ' },
          { id: 2, label_ml: 'ഉത്തരവുകൾ', value: ordersCount, sub_text: 'സർക്കാർ വിജ്ഞാപനങ്ങൾ' },
          { id: 3, label_ml: 'പദ്ധതികൾ', value: 18, sub_text: 'സേവന പദ്ധതികൾ' },
        ]);
      } catch (e) {
        console.error(e);
      }
    }
    getLiveCounts();
  }, []);

  return (
    <section className="relative pt-5 pb-7 md:pt-10 md:pb-20 px-4 md:px-6">
      <div className="max-w-[1100px] mx-auto">
        {/* Section header — hidden on mobile to save space */}
        <div className="hidden md:flex flex-col items-center text-center mb-14">
          <div className="section-label mb-3">Dashboard</div>
          <h2 className="text-[clamp(28px,4vw,44px)] font-[900] tracking-[-0.03em] text-white leading-tight" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            കേരള സർക്കാർ ജീവനക്കാർ{' '}
            <span className="text-white/60">ഒരു നോട്ടത്തിൽ</span>
          </h2>
        </div>

        {/* Cards — 3-col horizontal on mobile, same on desktop */}
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {counts.map((s, i) => (
            <StatCard key={s.id} stat={s} index={i} />
          ))}
        </div>

        {/* Live indicator */}
        <div className="mt-6 md:mt-12 flex items-center justify-center gap-2.5 opacity-40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
          <p className="text-[11px] font-bold text-white uppercase tracking-widest">
            Live data · {new Date().getFullYear()} Edition
          </p>
        </div>
      </div>
    </section>
  );
}
