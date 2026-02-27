'use client';
import { useEffect, useRef, useState } from 'react';

function AnimatedNumber({ target, suffix }) {
  const [val, setVal] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated.current) {
        animated.current = true;
        setVisible(true);
        const start = performance.now();
        const dur = 2400;
        function upd(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          setVal(Math.floor(eased * target));
          if (p < 1) requestAnimationFrame(upd);
        }
        requestAnimationFrame(upd);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  const display = target >= 1000 ? val.toLocaleString('en-IN') : val;

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <span className="text-[clamp(36px,5vw,52px)] font-black tracking-tight tabular-nums"
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #aeaeb2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {display}{suffix}
      </span>
    </div>
  );
}

export default function StatsBar({ stats }) {
  if (!stats?.length) return null;

  return (
    <div className="relative z-[1] py-16 px-6 border-y border-white/[0.06] overflow-hidden">
      {/* subtle background glow */}
      <div className="absolute inset-0 opacity-20"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, #2997ff10, transparent)' }} />

      <div className="relative max-w-4xl mx-auto flex justify-center gap-0 flex-wrap">
        {stats.map((s, i) => (
          <div key={s.id} className="flex items-stretch">
            {/* Stat item */}
            <div className="px-10 py-4 text-center group">
              <AnimatedNumber target={Number(s.value) || 0} suffix={s.suffix || '+'} />
              <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#6e6e73] mt-2 group-hover:text-[#86868b] transition-colors">
                {s.label_ml}
              </div>
            </div>
            {/* Divider */}
            {i < stats.length - 1 && (
              <div className="self-center w-px h-10 bg-white/[0.08]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
