'use client';
import { useEffect, useRef, useState } from 'react';

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

export default function ExperiencesHeroStats({ totalStories, totalReactions, anonymousPct }) {
  const stories   = useCountUp(totalStories);
  const reactions = useCountUp(totalReactions);
  const pct       = useCountUp(anonymousPct);

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <span className="text-[13px] font-semibold" style={{ color: 'var(--accent-green)' }}>
        {stories} കഥകൾ
      </span>
      <span className="text-white/20 text-sm">·</span>
      <span className="text-[13px] font-semibold" style={{ color: 'var(--text-dim)' }}>
        {reactions} പ്രതികരണങ്ങൾ
      </span>
      <span className="text-sm" style={{ color: 'var(--text-ghost)' }}>·</span>
      <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
        {pct}% അജ്ഞാതം
      </span>
      <span className="text-[10px] ml-1" style={{ color: 'var(--text-ghost)' }}>· Updated hourly</span>
    </div>
  );
}
