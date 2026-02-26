'use client';
import { useEffect, useRef, useState } from 'react';

function AnimatedNumber({ target, suffix }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated.current) {
        animated.current = true;
        const start = performance.now();
        const dur = 2000;
        function upd(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.floor(eased * target));
          if (p < 1) requestAnimationFrame(upd);
        }
        requestAnimationFrame(upd);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  const display = target >= 1000 ? val.toLocaleString() : val;

  return (
    <div ref={ref} className="text-center">
      <div className="text-[clamp(32px,5vw,44px)] font-bold tracking-tight font-sans bg-gradient-to-b from-[#f5f5f7] to-[#86868b] bg-clip-text text-transparent">
        {display}{suffix}
      </div>
    </div>
  );
}

export default function StatsBar({ stats }) {
  if (!stats?.length) return null;
  return (
    <div className="relative z-[1] py-14 px-6 flex justify-center gap-10 md:gap-16 flex-wrap border-y border-white/[0.08]">
      {stats.map(s => (
        <div key={s.id} className="text-center">
          <AnimatedNumber target={s.value} suffix={s.suffix || ''} />
          <div className="text-xs text-[#6e6e73] mt-1 font-semibold">{s.label_ml}</div>
        </div>
      ))}
    </div>
  );
}
