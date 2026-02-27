'use client';
import { useEffect, useRef, useState } from 'react';

const COLORS = ['#ff9f0a', '#2997ff', '#30d158', '#bf5af2'];

function StatCard({ stat, index }) {
  const [val, setVal] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const animated = useRef(false);
  const target = Number(stat.value) || 0;
  const color = COLORS[index % COLORS.length];

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated.current) {
        animated.current = true;
        setTimeout(() => {
          setVisible(true);
          const start = performance.now();
          const dur = 2200;
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

  const display = val.toLocaleString('en-IN');

  return (
    <div ref={ref}
      className="relative rounded-2xl p-6 text-center transition-all duration-700 flex flex-col items-center justify-center gap-3"
      style={{
        background: `linear-gradient(145deg, ${color}10 0%, rgba(0,0,0,0) 100%)`,
        border: `1px solid ${color}30`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: `0 0 40px ${color}10, inset 0 1px 0 ${color}20`,
        opacity: visible ? 1 : 0,
        filter: visible ? 'blur(0px)' : 'blur(14px)',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transitionDelay: `${index * 130}ms`,
        minWidth: '160px',
        flex: '1',
        maxWidth: '210px',
      }}>

      {/* Glow dot top */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full opacity-60"
        style={{ background: color, filter: 'blur(4px)' }} />

      {/* Number — white */}
      <div className="text-3xl font-black tracking-tight leading-none text-white">
        {display}+
      </div>

      {/* Divider */}
      <div className="w-8 h-px" style={{ background: `${color}60` }} />

      {/* Label */}
      <div className="text-base font-bold leading-snug text-white/90 text-center"
        style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}>
        {stat.label_ml}
      </div>
    </div>
  );
}

export default function StatsBar({ stats }) {
  if (!stats?.length) return null;

  return (
    <section className="relative z-[1] py-16 px-6">
      <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-[#6e6e73] mb-8">
        കേരള സർക്കാർ ജീവനക്കാർ — ഒരു നോട്ടത്തിൽ
      </p>
      <div className="max-w-5xl mx-auto flex gap-4 flex-wrap justify-center">
        {stats.map((s, i) => (
          <StatCard key={s.id} stat={s} index={i} />
        ))}
      </div>
    </section>
  );
}
