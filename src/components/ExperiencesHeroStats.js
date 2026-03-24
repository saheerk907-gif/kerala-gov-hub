'use client';
import { useEffect, useRef, useState } from 'react';

const GREEN = '#30d158';

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
      <span className="text-[13px] font-semibold" style={{ color: GREEN }}>
        {stories} കഥകൾ
      </span>
      <span className="text-white/20 text-sm">·</span>
      <span className="text-[13px] font-semibold text-white/70">
        {reactions} പ്രതികരണങ്ങൾ
      </span>
      <span className="text-white/20 text-sm">·</span>
      <span className="text-[13px] text-white/50">
        {pct}% അജ്ഞാതം
      </span>
      <span className="text-[10px] text-white/25 ml-1">· Updated hourly</span>
    </div>
  );
}
