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
          const dur = 2000;
          function upd(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(upd);
          }
          requestAnimationFrame(upd);
        }, index * 150);
      }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, index]);

  // Smart display: 3000000 → 30 ലക്ഷം, 500000 → 5 ലക്ഷം, others normal
  function formatNumber(n) {
    if (n >= 100000) {
      const lakhs = Math.floor(val / 100000);
      return `${lakhs} ലക്ഷം`;
    }
    if (n >= 1000) return val.toLocaleString('en-IN');
    return val;
  }

  const display = formatNumber(target);

  return (
    <div ref={ref}
      className="relative rounded-2xl px-8 py-7 text-center min-w-[160px] flex-1 transition-all duration-700"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        opacity: visible ? 1 : 0,
        filter: visible ? 'blur(0px)' : 'blur(12px)',
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transitionDelay: `${index * 120}ms`,
        maxWidth: '220px',
      }}>

      {/* Top shimmer */}
      <div className="absolute top-0 left-6 right-6 h-px rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />

      {/* Number */}
      <div className="text-3xl font-black tracking-tight text-white leading-none mb-2">
        {display}+
      </div>

      {/* Label */}
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">
        {stat.label_ml}
      </div>
    </div>
  );
}

export default function StatsBar({ stats }) {
  if (!stats?.length) return null;

  return (
    <div className="relative z-[1] py-14 px-6">
      <div className="max-w-5xl mx-auto flex gap-4 flex-wrap justify-center">
        {stats.map((s, i) => (
          <StatCard key={s.id} stat={s} index={i} />
        ))}
      </div>
    </div>
  );
}
